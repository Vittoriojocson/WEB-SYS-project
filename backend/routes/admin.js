/*
 * ADMIN ROUTES
 * 
 * GET /api/admin/statistics  - Dashboard statistics
 * GET /api/admin/email-logs  - Email sending logs
 * GET /api/admin/contacts    - View all contact messages
 * GET /api/admin/subscribers - View all newsletter subscribers
 * GET /api/admin/bookings    - View all bookings
 * POST /api/admin/approve-booking/:id - Approve booking and send verification
 */

import express from 'express';
import {
    getRow,
    getAllRows,
    runQuery
} from '../database.js';
import {
    errorResponse,
    successResponse,
    sendBookingVerification
} from '../utils.js';

const router = express.Router();

/**
 * Get dashboard statistics
 * GET /api/admin/statistics
 */
router.get('/statistics', async (req, res) => {
    try {
        // Count contacts
        const totalContacts = await getRow(
            'SELECT COUNT(*) as count FROM contact_messages'
        );

        const newContacts = await getRow(
            'SELECT COUNT(*) as count FROM contact_messages WHERE status = "new"'
        );

        // Count subscribers
        const totalSubscribers = await getRow(
            'SELECT COUNT(*) as count FROM newsletter_subscribers WHERE active = 1'
        );

        // Count bookings
        const totalBookings = await getRow(
            'SELECT COUNT(*) as count FROM bookings'
        );

        const confirmedBookings = await getRow(
            'SELECT COUNT(*) as count FROM bookings WHERE status = "confirmed"'
        );

        // Calculate revenue
        const revenue = await getRow(
            'SELECT SUM(price_quote) as total FROM bookings WHERE status = "confirmed"'
        );

        // Count customer orders
        const totalOrders = await getRow(
            'SELECT COUNT(*) as count FROM customer_orders'
        );

        const pendingOrders = await getRow(
            'SELECT COUNT(*) as count FROM customer_orders WHERE status = "pending"'
        );

        res.status(200).json(successResponse(
            {
                total_contacts: totalContacts?.count || 0,
                new_contacts: newContacts?.count || 0,
                total_subscribers: totalSubscribers?.count || 0,
                total_bookings: totalBookings?.count || 0,
                confirmed_bookings: confirmedBookings?.count || 0,
                total_revenue: revenue?.total || 0,
                total_orders: totalOrders?.count || 0,
                pending_orders: pendingOrders?.count || 0
            },
            'Statistics retrieved successfully',
            200
        ));

    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json(errorResponse('Failed to fetch statistics', 500));
    }
});

/**
 * Get email logs
 * GET /api/admin/email-logs?limit=100&status=sent
 */
router.get('/email-logs', async (req, res) => {
    try {
        const { limit = 100, status } = req.query;

        let sql = 'SELECT * FROM email_logs';
        let params = [];

        if (status) {
            sql += ' WHERE status = ?';
            params.push(status);
        }

        sql += ' ORDER BY created_at DESC LIMIT ?';
        params.push(parseInt(limit));

        const logs = await getAllRows(sql, params);

        // Get summary counts
        const sentCount = await getRow(
            'SELECT COUNT(*) as count FROM email_logs WHERE status = "sent"'
        );

        const failedCount = await getRow(
            'SELECT COUNT(*) as count FROM email_logs WHERE status = "failed"'
        );

        res.status(200).json(successResponse(
            {
                count: logs.length,
                logs: logs,
                summary: {
                    sent: sentCount?.count || 0,
                    failed: failedCount?.count || 0
                }
            },
            'Email logs retrieved successfully',
            200
        ));

    } catch (error) {
        console.error('Error fetching email logs:', error);
        res.status(500).json(errorResponse('Failed to fetch email logs', 500));
    }
});

/**
 * Get all contact messages
 * GET /api/admin/contacts?limit=50
 */
router.get('/contacts', async (req, res) => {
    try {
        const { limit = 50 } = req.query;

        const contacts = await getAllRows(
            'SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT ?',
            [parseInt(limit)]
        );

        res.status(200).json(successResponse(
            {
                count: contacts.length,
                contacts: contacts
            },
            'Contact messages retrieved successfully',
            200
        ));

    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json(errorResponse('Failed to fetch contacts', 500));
    }
});

/**
 * Get all newsletter subscribers
 * GET /api/admin/subscribers?limit=50
 */
router.get('/subscribers', async (req, res) => {
    try {
        const { limit = 50 } = req.query;

        const subscribers = await getAllRows(
            'SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC LIMIT ?',
            [parseInt(limit)]
        );

        res.status(200).json(successResponse(
            {
                count: subscribers.length,
                subscribers: subscribers
            },
            'Newsletter subscribers retrieved successfully',
            200
        ));

    } catch (error) {
        console.error('Error fetching subscribers:', error);
        res.status(500).json(errorResponse('Failed to fetch subscribers', 500));
    }
});

/**
 * Get all bookings
 * GET /api/admin/bookings?limit=50
 */
router.get('/bookings', async (req, res) => {
    try {
        const { limit = 50 } = req.query;

        const bookings = await getAllRows(
            'SELECT * FROM bookings ORDER BY created_at DESC LIMIT ?',
            [parseInt(limit)]
        );

        res.status(200).json(successResponse(
            {
                count: bookings.length,
                bookings: bookings
            },
            'Bookings retrieved successfully',
            200
        ));

    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json(errorResponse('Failed to fetch bookings', 500));
    }
});

/**
 * Approve booking and send verification email
 * POST /api/admin/approve-booking/:id
 */
router.post('/approve-booking/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch booking details
        const booking = await getRow(
            'SELECT * FROM bookings WHERE id = ?',
            [id]
        );

        if (!booking) {
            return res.status(404).json(errorResponse('Booking not found', 404));
        }

        // Check if already approved
        if (booking.status === 'approved') {
            return res.status(400).json(errorResponse('Booking already approved', 400));
        }

        // Validate required customer info
        if (!booking.customer_email || !booking.customer_name) {
            return res.status(400).json(
                errorResponse('Customer email and name are required for approval', 400)
            );
        }

        // Update booking status to approved
        const approvedAt = new Date().toISOString();
        await runQuery(
            `UPDATE bookings 
             SET status = 'approved', 
                 approved_at = ?,
                 verification_sent = 1
             WHERE id = ?`,
            [approvedAt, id]
        );

        // Send verification email
        const emailSent = await sendBookingVerification(
            booking.customer_email,
            booking.customer_name,
            {
                bookingId: booking.id,
                packageType: booking.package_type,
                eventDate: booking.event_date,
                guestCount: booking.guest_count,
                priceQuote: booking.price_quote,
                paymentMethod: booking.payment_method
            }
        );

        if (!emailSent) {
            // Email failed but booking is still approved
            return res.status(200).json(successResponse(
                { 
                    booking_id: id,
                    email_sent: false,
                    warning: 'Booking approved but verification email failed to send'
                },
                'Booking approved with email error',
                200
            ));
        }

        // Get updated booking
        const updatedBooking = await getRow(
            'SELECT * FROM bookings WHERE id = ?',
            [id]
        );

        res.status(200).json(successResponse(
            { 
                booking: updatedBooking,
                email_sent: true
            },
            'Booking approved and verification email sent successfully',
            200
        ));

    } catch (error) {
        console.error('Error approving booking:', error);
        res.status(500).json(errorResponse('Failed to approve booking', 500));
    }
});

export default router;

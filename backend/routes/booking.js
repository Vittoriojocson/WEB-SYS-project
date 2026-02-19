/*
 * BOOKING ROUTES
 * 
 * POST /api/booking/create - Create booking
 * GET  /api/booking/list   - Get all bookings
 * GET  /api/booking/:id    - Get specific booking
 * PUT  /api/booking/:id/status - Update booking status
 */

import express from 'express';
import {
    runQuery,
    getRow,
    getAllRows
} from '../database.js';
import {
    errorResponse,
    successResponse,
    sanitizeInput
} from '../utils.js';

const router = express.Router();

// Pricing for packages
const PACKAGE_PRICING = {
    professional: { min: 6000, max: 10000 },
    elite: { min: 7000, max: 50000 }
};

/**
 * Create booking
 * POST /api/booking/create
 */
router.post('/create', async (req, res) => {
    try {
        const {
            contact_id,
            package_type,
            event_date,
            guest_count
        } = req.body;

        // Verify contact exists
        const contact = await getRow(
            'SELECT * FROM contact_messages WHERE id = ?',
            [contact_id]
        );

        if (!contact) {
            return res.status(404).json(errorResponse('Contact not found', 404));
        }

        // Validate package type
        if (!PACKAGE_PRICING[package_type]) {
            return res.status(400).json(errorResponse('Invalid package type', 400));
        }

        // Get base price
        const priceQuote = PACKAGE_PRICING[package_type].min;

        // Create booking
        const result = await runQuery(
            `INSERT INTO bookings (contact_id, package_type, event_date, guest_count, price_quote, status)
             VALUES (?, ?, ?, ?, ?, 'pending')`,
            [contact_id, package_type, event_date, guest_count, priceQuote]
        );

        const booking = await getRow(
            'SELECT * FROM bookings WHERE id = ?',
            [result.lastID]
        );

        res.status(201).json(successResponse(
            { booking: booking },
            'Booking created successfully',
            201
        ));

    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json(errorResponse('Failed to create booking', 500));
    }
});

/**
 * Get all bookings
 * GET /api/booking/list?status=pending&limit=50
 */
router.get('/list', async (req, res) => {
    try {
        const { status, limit = 50 } = req.query;

        let sql = 'SELECT * FROM bookings';
        let params = [];

        if (status) {
            sql += ' WHERE status = ?';
            params.push(status);
        }

        sql += ' ORDER BY created_at DESC LIMIT ?';
        params.push(parseInt(limit));

        const bookings = await getAllRows(sql, params);

        res.status(200).json(successResponse(
            { count: bookings.length, bookings: bookings },
            'Bookings retrieved successfully',
            200
        ));

    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json(errorResponse('Failed to fetch bookings', 500));
    }
});

/**
 * Get single booking
 * GET /api/booking/:id
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const booking = await getRow(
            'SELECT * FROM bookings WHERE id = ?',
            [id]
        );

        if (!booking) {
            return res.status(404).json(errorResponse('Booking not found', 404));
        }

        res.status(200).json(successResponse(
            { booking: booking },
            'Booking retrieved successfully',
            200
        ));

    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json(errorResponse('Failed to fetch booking', 500));
    }
});

/**
 * Update booking status
 * PUT /api/booking/:id/status
 */
router.put('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
            return res.status(400).json(errorResponse('Invalid status', 400));
        }

        // Check if booking exists
        const booking = await getRow(
            'SELECT * FROM bookings WHERE id = ?',
            [id]
        );

        if (!booking) {
            return res.status(404).json(errorResponse('Booking not found', 404));
        }

        // Update status
        await runQuery(
            'UPDATE bookings SET status = ? WHERE id = ?',
            [status, id]
        );

        const updatedBooking = await getRow(
            'SELECT * FROM bookings WHERE id = ?',
            [id]
        );

        res.status(200).json(successResponse(
            { booking: updatedBooking },
            'Booking status updated',
            200
        ));

    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json(errorResponse('Failed to update booking', 500));
    }
});

export default router;

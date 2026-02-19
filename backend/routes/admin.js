/*
 * ADMIN ROUTES
 * 
 * GET /api/admin/statistics  - Dashboard statistics
 * GET /api/admin/email-logs  - Email sending logs
 */

import express from 'express';
import {
    getRow,
    getAllRows
} from '../database.js';
import {
    errorResponse,
    successResponse
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

        res.status(200).json(successResponse(
            {
                total_contacts: totalContacts?.count || 0,
                new_contacts: newContacts?.count || 0,
                total_subscribers: totalSubscribers?.count || 0,
                total_bookings: totalBookings?.count || 0,
                confirmed_bookings: confirmedBookings?.count || 0,
                total_revenue: revenue?.total || 0
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

export default router;

/*
 * NEWSLETTER ROUTES
 * 
 * POST   /api/newsletter/subscribe    - Subscribe to newsletter
 * GET    /api/newsletter/subscribers  - Get all subscribers
 * POST   /api/newsletter/unsubscribe/:email - Unsubscribe
 */

import express from 'express';
import { 
    runQuery, 
    getRow, 
    getAllRows 
} from '../database.js';
import {
    isValidEmail,
    sendNewsletterConfirmation,
    errorResponse,
    successResponse
} from '../utils.js';

const router = express.Router();

/**
 * Subscribe to newsletter
 * POST /api/newsletter/subscribe
 */
router.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body;
        const normalizedEmail = email?.toLowerCase().trim() || '';

        // Validate email
        if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
            return res.status(400).json(errorResponse('Valid email required', 400));
        }

        // Check if already subscribed
        const existing = await getRow(
            'SELECT * FROM newsletter_subscribers WHERE email = ?',
            [normalizedEmail]
        );

        if (existing && existing.active) {
            return res.status(409).json(errorResponse('Already subscribed', 409));
        }

        // If exists but inactive, reactivate
        if (existing) {
            await runQuery(
                'UPDATE newsletter_subscribers SET active = 1 WHERE email = ?',
                [normalizedEmail]
            );

            return res.status(200).json(successResponse(
                { id: existing.id },
                'Resubscribed successfully',
                200
            ));
        }

        // Create new subscriber
        const result = await runQuery(
            'INSERT INTO newsletter_subscribers (email, active) VALUES (?, 1)',
            [normalizedEmail]
        );

        // Send welcome email
        await sendNewsletterConfirmation(normalizedEmail);

        res.status(201).json(successResponse(
            { id: result.lastID },
            'Subscribed successfully',
            201
        ));

    } catch (error) {
        console.error('Error subscribing to newsletter:', error);
        res.status(500).json(errorResponse('Failed to subscribe', 500));
    }
});

/**
 * Get all subscribers
 * GET /api/newsletter/subscribers?active=true
 */
router.get('/subscribers', async (req, res) => {
    try {
        const { active = 'true' } = req.query;
        const activeOnly = active.toLowerCase() === 'true';

        let sql = 'SELECT * FROM newsletter_subscribers';
        let params = [];

        if (activeOnly) {
            sql += ' WHERE active = 1';
        }

        sql += ' ORDER BY subscribed_at DESC';

        const subscribers = await getAllRows(sql, params);

        res.status(200).json(successResponse(
            { count: subscribers.length, subscribers: subscribers },
            'Subscribers retrieved successfully',
            200
        ));

    } catch (error) {
        console.error('Error fetching subscribers:', error);
        res.status(500).json(errorResponse('Failed to fetch subscribers', 500));
    }
});

/**
 * Unsubscribe from newsletter
 * POST /api/newsletter/unsubscribe/:email
 */
router.post('/unsubscribe/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const normalizedEmail = email.toLowerCase().trim();

        // Check if subscriber exists
        const subscriber = await getRow(
            'SELECT * FROM newsletter_subscribers WHERE email = ?',
            [normalizedEmail]
        );

        if (!subscriber) {
            return res.status(404).json(errorResponse('Subscriber not found', 404));
        }

        // Update to inactive
        await runQuery(
            'UPDATE newsletter_subscribers SET active = 0 WHERE email = ?',
            [normalizedEmail]
        );

        res.status(200).json(successResponse(
            {},
            'Unsubscribed successfully',
            200
        ));

    } catch (error) {
        console.error('Error unsubscribing:', error);
        res.status(500).json(errorResponse('Failed to unsubscribe', 500));
    }
});

export default router;

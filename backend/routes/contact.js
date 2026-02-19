/*
 * CONTACT FORM ROUTES
 * 
 * POST   /api/contact/submit    - Submit contact form
 * GET    /api/contact/list      - Get all contacts
 * GET    /api/contact/:id       - Get specific contact
 * PUT    /api/contact/:id/status - Update contact status
 */

import express from 'express';
import { 
    runQuery, 
    getRow, 
    getAllRows 
} from '../database.js';
import {
    validateContactForm,
    sendContactReply,
    errorResponse,
    successResponse,
    sanitizeInput
} from '../utils.js';

const router = express.Router();

/**
 * Submit contact form
 * POST /api/contact/submit
 */
router.post('/submit', async (req, res) => {
    try {
        const { name, email, event_name, package: packageType, details } = req.body;

        // Validate input
        const errors = validateContactForm({ name, email, event_name, details });
        if (errors.length > 0) {
            return res.status(400).json(errorResponse(errors));
        }

        // Insert into database
        const result = await runQuery(
            'INSERT INTO contact_messages (name, email, event_name, package, details) VALUES (?, ?, ?, ?, ?)',
            [
                sanitizeInput(name),
                email.toLowerCase(),
                sanitizeInput(event_name),
                sanitizeInput(packageType),
                sanitizeInput(details)
            ]
        );

        // Send automated reply
        await sendContactReply(email, name, event_name);

        res.status(201).json(successResponse(
            { id: result.lastID },
            'Contact form submitted successfully',
            201
        ));

    } catch (error) {
        console.error('Error submitting contact form:', error);
        res.status(500).json(errorResponse('Failed to submit contact form', 500));
    }
});

/**
 * Get all contacts
 * GET /api/contact/list?status=new&limit=50
 */
router.get('/list', async (req, res) => {
    try {
        const { status, limit = 50 } = req.query;

        let sql = 'SELECT * FROM contact_messages';
        let params = [];

        if (status) {
            sql += ' WHERE status = ?';
            params.push(status);
        }

        sql += ' ORDER BY created_at DESC LIMIT ?';
        params.push(parseInt(limit));

        const contacts = await getAllRows(sql, params);

        res.status(200).json(successResponse(
            { count: contacts.length, contacts: contacts },
            'Contacts retrieved successfully',
            200
        ));

    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json(errorResponse('Failed to fetch contacts', 500));
    }
});

/**
 * Get single contact
 * GET /api/contact/:id
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const contact = await getRow(
            'SELECT * FROM contact_messages WHERE id = ?',
            [id]
        );

        if (!contact) {
            return res.status(404).json(errorResponse('Contact not found', 404));
        }

        res.status(200).json(successResponse(
            { contact: contact },
            'Contact retrieved successfully',
            200
        ));

    } catch (error) {
        console.error('Error fetching contact:', error);
        res.status(500).json(errorResponse('Failed to fetch contact', 500));
    }
});

/**
 * Update contact status
 * PUT /api/contact/:id/status
 */
router.put('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        // Validate status
        if (!['new', 'viewed', 'responded'].includes(status)) {
            return res.status(400).json(errorResponse('Invalid status', 400));
        }

        // Check if contact exists
        const contact = await getRow(
            'SELECT * FROM contact_messages WHERE id = ?',
            [id]
        );

        if (!contact) {
            return res.status(404).json(errorResponse('Contact not found', 404));
        }

        // Update status
        let sql = 'UPDATE contact_messages SET status = ?';
        let params = [status];

        if (notes) {
            sql += ', notes = ?';
            params.push(sanitizeInput(notes));
        }

        sql += ' WHERE id = ?';
        params.push(id);

        await runQuery(sql, params);

        const updatedContact = await getRow(
            'SELECT * FROM contact_messages WHERE id = ?',
            [id]
        );

        res.status(200).json(successResponse(
            { contact: updatedContact },
            'Contact status updated',
            200
        ));

    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json(errorResponse('Failed to update contact', 500));
    }
});

export default router;

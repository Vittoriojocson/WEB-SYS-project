/*
 * CUSTOMER ORDERS ROUTES
 * 
 * POST /api/orders/create - Create customer order with drink selection
 * GET  /api/orders/list   - Get all customer orders
 * GET  /api/orders/:id    - Get specific order
 * PUT  /api/orders/:id/status - Update order status
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
    sanitizeInput,
    isValidEmail
} from '../utils.js';

const router = express.Router();

/**
 * Create customer order
 * POST /api/orders/create
 */
router.post('/create', async (req, res) => {
    try {
        const {
            customer_name,
            customer_email,
            customer_phone,
            event_location,
            city,
            province,
            postal_code,
            package_id,
            package_name,
            package_price,
            selected_drinks,
            guest_count,
            event_date,
            event_time,
            special_requests
        } = req.body;

        // Validate required fields
        if (!customer_name || customer_name.trim().length < 2) {
            return res.status(400).json(errorResponse('Customer name is required (min 2 characters)', 400));
        }

        if (!customer_email || !isValidEmail(customer_email)) {
            return res.status(400).json(errorResponse('Valid email is required', 400));
        }

        if (!event_location || event_location.trim().length < 5) {
            return res.status(400).json(errorResponse('Event location is required (min 5 characters)', 400));
        }

        if (!package_id || !package_name) {
            return res.status(400).json(errorResponse('Package information is required', 400));
        }

        if (!selected_drinks || !Array.isArray(selected_drinks) || selected_drinks.length === 0) {
            return res.status(400).json(errorResponse('At least one drink must be selected', 400));
        }

        // Sanitize inputs
        const sanitizedName = sanitizeInput(customer_name);
        const sanitizedEmail = sanitizeInput(customer_email);
        const sanitizedPhone = customer_phone ? sanitizeInput(customer_phone) : null;
        const sanitizedLocation = sanitizeInput(event_location);
        const sanitizedCity = city ? sanitizeInput(city) : null;
        const sanitizedProvince = province ? sanitizeInput(province) : null;
        const sanitizedRequests = special_requests ? sanitizeInput(special_requests) : null;

        // Convert drinks array to JSON string
        const drinksJson = JSON.stringify(selected_drinks);

        // Create order
        const result = await runQuery(
            `INSERT INTO customer_orders 
             (customer_name, customer_email, customer_phone, event_location, 
              city, province, postal_code, package_id, package_name, package_price, 
              selected_drinks, guest_count, event_date, event_time, special_requests, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
            [
                sanitizedName,
                sanitizedEmail,
                sanitizedPhone,
                sanitizedLocation,
                sanitizedCity,
                sanitizedProvince,
                postal_code || null,
                package_id,
                package_name,
                package_price,
                drinksJson,
                guest_count || null,
                event_date || null,
                event_time || null,
                sanitizedRequests
            ]
        );

        const order = await getRow(
            'SELECT * FROM customer_orders WHERE id = ?',
            [result.lastID]
        );

        res.status(201).json(successResponse(
            { order: order },
            'Order created successfully. We will contact you soon!',
            201
        ));

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json(errorResponse('Failed to create order', 500));
    }
});

/**
 * Get all orders
 * GET /api/orders/list?status=pending&limit=50
 */
router.get('/list', async (req, res) => {
    try {
        const { status, limit = 50 } = req.query;

        let sql = 'SELECT * FROM customer_orders';
        let params = [];

        if (status) {
            sql += ' WHERE status = ?';
            params.push(status);
        }

        sql += ' ORDER BY created_at DESC LIMIT ?';
        params.push(parseInt(limit));

        const orders = await getAllRows(sql, params);

        // Parse drinks JSON for each order
        const ordersWithParsedDrinks = orders.map(order => ({
            ...order,
            selected_drinks: JSON.parse(order.selected_drinks || '[]')
        }));

        res.status(200).json(successResponse(
            { count: orders.length, orders: ordersWithParsedDrinks },
            'Orders retrieved successfully',
            200
        ));

    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json(errorResponse('Failed to fetch orders', 500));
    }
});

/**
 * Get single order
 * GET /api/orders/:id
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const order = await getRow(
            'SELECT * FROM customer_orders WHERE id = ?',
            [id]
        );

        if (!order) {
            return res.status(404).json(errorResponse('Order not found', 404));
        }

        // Parse drinks JSON
        order.selected_drinks = JSON.parse(order.selected_drinks || '[]');

        res.status(200).json(successResponse(
            { order: order },
            'Order retrieved successfully',
            200
        ));

    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json(errorResponse('Failed to fetch order', 500));
    }
});

/**
 * Update order status
 * PUT /api/orders/:id/status
 */
router.put('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        // Validate status
        if (!['pending', 'confirmed', 'processing', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json(errorResponse('Invalid status', 400));
        }

        // Check if order exists
        const order = await getRow(
            'SELECT * FROM customer_orders WHERE id = ?',
            [id]
        );

        if (!order) {
            return res.status(404).json(errorResponse('Order not found', 404));
        }

        // Update status
        await runQuery(
            'UPDATE customer_orders SET status = ?, notes = ? WHERE id = ?',
            [status, notes || order.notes, id]
        );

        const updatedOrder = await getRow(
            'SELECT * FROM customer_orders WHERE id = ?',
            [id]
        );

        // Parse drinks JSON
        updatedOrder.selected_drinks = JSON.parse(updatedOrder.selected_drinks || '[]');

        res.status(200).json(successResponse(
            { order: updatedOrder },
            'Order status updated',
            200
        ));

    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json(errorResponse('Failed to update order', 500));
    }
});

export default router;

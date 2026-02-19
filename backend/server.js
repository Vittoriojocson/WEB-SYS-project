/*
 * ============================================================================
 * JIGGERONTHEMIX BACKEND - NODE.JS/EXPRESS SERVER
 * ============================================================================
 * 
 * FILE PURPOSE:
 * Main Express server configuration and initialization
 * 
 * IMPORTS:
 * - express: Web framework
 * - cors: Cross-origin requests
 * - dotenv: Environment variables
 * - body-parser: Request body parsing
 * - Database initialization
 * - Route handlers
 * 
 * INITIALIZATION:
 * - Load environment variables
 * - Configure Express middleware
 * - Initialize SQLite database
 * - Register route blueprints
 * - Start server on PORT
 * 
 * ENDPOINTS REGISTERED:
 * - /api/health: Health check
 * - /api/contact/*: Contact form routes
 * - /api/newsletter/*: Newsletter routes
 * - /api/booking/*: Booking routes
 * - /api/admin/*: Admin routes
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { initializeDatabase } from './database.js';
import contactRoutes from './routes/contact.js';
import newsletterRoutes from './routes/newsletter.js';
import bookingRoutes from './routes/booking.js';
import adminRoutes from './routes/admin.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Parse CORS origins - allow GitHub Pages and localhost
const corsOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:8000,https://vittoriojocson.github.io')
    .split(',')
    .map(url => url.trim())
    .filter(url => url);

console.log('CORS Origins allowed:', corsOrigins);

// Middleware
app.use(cors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept']
}));

// Explicitly handle preflight requests
app.options('*', cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'JiggerOnTheMix API is running',
        timestamp: new Date().toISOString()
    });
});

// Initialize database
initializeDatabase();

// Register routes
app.use('/api/contact', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🍸 JiggerOnTheMix API running at http://localhost:${PORT}`);
    console.log(`📧 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`💾 Database: ${process.env.DATABASE_URL}`);
});

export default app;

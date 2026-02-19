/*
 * ============================================================================
 * DATABASE INITIALIZATION AND MANAGEMENT
 * ============================================================================
 * 
 * TABLES CREATED:
 * 1. contact_messages - Contact form submissions
 * 2. newsletter_subscribers - Newsletter email list
 * 3. bookings - Event bookings
 * 4. email_logs - Outgoing email tracking
 */

import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DATABASE_URL || path.join(__dirname, 'database.db');
let db;

/**
 * Initialize SQLite database connection
 */
export function getDatabase() {
    if (!db) {
        db = new sqlite3.Database(dbPath, (err) => {
            if (err) console.error('Database connection error:', err);
            else console.log('✓ Connected to SQLite database');
        });
    }
    return db;
}

/**
 * Run SQL query (non-select)
 */
export function runQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        const database = getDatabase();
        database.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve({ lastID: this.lastID, changes: this.changes });
        });
    });
}

/**
 * Get single row
 */
export function getRow(sql, params = []) {
    return new Promise((resolve, reject) => {
        const database = getDatabase();
        database.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

/**
 * Get all rows
 */
export function getAllRows(sql, params = []) {
    return new Promise((resolve, reject) => {
        const database = getDatabase();
        database.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows || []);
        });
    });
}

/**
 * Initialize database schema
 */
export function initializeDatabase() {
    const database = getDatabase();

    // Contact Messages Table
    const createContactTable = `
        CREATE TABLE IF NOT EXISTS contact_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            event_name TEXT NOT NULL,
            package TEXT,
            details TEXT NOT NULL,
            status TEXT DEFAULT 'new',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            notes TEXT
        )
    `;

    // Newsletter Subscribers Table
    const createNewsletterTable = `
        CREATE TABLE IF NOT EXISTS newsletter_subscribers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            active INTEGER DEFAULT 1,
            unsubscribe_token TEXT UNIQUE
        )
    `;

    // Bookings Table
    const createBookingsTable = `
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            contact_id INTEGER NOT NULL,
            package_type TEXT NOT NULL,
            event_date DATETIME,
            guest_count INTEGER,
            price_quote REAL,
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (contact_id) REFERENCES contact_messages(id)
        )
    `;

    // Email Logs Table
    const createEmailLogTable = `
        CREATE TABLE IF NOT EXISTS email_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            recipient TEXT NOT NULL,
            subject TEXT NOT NULL,
            email_type TEXT NOT NULL,
            status TEXT DEFAULT 'sent',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            error_message TEXT
        )
    `;

    // Create all tables
    const tables = [
        createContactTable,
        createNewsletterTable,
        createBookingsTable,
        createEmailLogTable
    ];

    tables.forEach((sql) => {
        database.run(sql, (err) => {
            if (err) console.error('Table creation error:', err);
        });
    });

    console.log('✓ Database schema initialized');
}

/**
 * Close database connection
 */
export function closeDatabase() {
    if (db) {
        db.close((err) => {
            if (err) console.error('Error closing database:', err);
            else console.log('Database connection closed');
        });
    }
}

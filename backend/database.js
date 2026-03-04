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
            payment_proof TEXT,
            payment_method TEXT,
            customer_email TEXT,
            customer_name TEXT,
            approved_at DATETIME,
            verification_sent INTEGER DEFAULT 0,
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

    // Customer Orders Table
    const createCustomerOrdersTable = `
        CREATE TABLE IF NOT EXISTS customer_orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_name TEXT NOT NULL,
            customer_email TEXT NOT NULL,
            customer_phone TEXT,
            event_location TEXT NOT NULL,
            city TEXT,
            province TEXT,
            postal_code TEXT,
            package_id TEXT NOT NULL,
            package_name TEXT NOT NULL,
            package_price TEXT,
            selected_drinks TEXT NOT NULL,
            guest_count INTEGER,
            event_date DATETIME,
            event_time TEXT,
            special_requests TEXT,
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            notes TEXT
        )
    `;

    // Create all tables
    const tables = [
        createContactTable,
        createNewsletterTable,
        createBookingsTable,
        createEmailLogTable,
        createCustomerOrdersTable
    ];

    tables.forEach((sql) => {
        database.run(sql, (err) => {
            if (err) console.error('Table creation error:', err);
        });
    });

    // Migrate existing bookings table to add new columns (if they don't exist)
    const migrations = [
        `ALTER TABLE bookings ADD COLUMN payment_proof TEXT`,
        `ALTER TABLE bookings ADD COLUMN payment_method TEXT`,
        `ALTER TABLE bookings ADD COLUMN customer_email TEXT`,
        `ALTER TABLE bookings ADD COLUMN customer_name TEXT`,
        `ALTER TABLE bookings ADD COLUMN approved_at DATETIME`,
        `ALTER TABLE bookings ADD COLUMN verification_sent INTEGER DEFAULT 0`,
        `ALTER TABLE customer_orders ADD COLUMN event_time TEXT`
    ];

    migrations.forEach((sql) => {
        database.run(sql, (err) => {
            // Ignore error if column already exists
            if (err && !err.message.includes('duplicate column name')) {
                console.error('Migration error:', err.message);
            }
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

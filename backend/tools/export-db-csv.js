import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DATABASE_URL || path.join(__dirname, '..', 'database.db');
const outputPath = path.join(os.homedir(), 'Downloads', 'db_export.csv');

const tables = [
    'contact_messages',
    'newsletter_subscribers',
    'bookings',
    'email_logs'
];

function openDatabase(filePath) {
    return new sqlite3.Database(filePath);
}

function getAllRows(db, sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows || []);
        });
    });
}

function csvEscape(value) {
    if (value === null || value === undefined) return '';
    const text = String(value);
    if (/[",\n]/.test(text)) {
        return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
}

async function getTableColumns(db, table) {
    const info = await getAllRows(db, `PRAGMA table_info(${table})`);
    return info.map((col) => col.name);
}

async function exportToCsv() {
    const db = openDatabase(dbPath);

    try {
        const columnOrder = [];
        const columnSet = new Set();

        for (const table of tables) {
            const columns = await getTableColumns(db, table);
            for (const column of columns) {
                if (!columnSet.has(column)) {
                    columnSet.add(column);
                    columnOrder.push(column);
                }
            }
        }

        const headers = ['table_name', ...columnOrder];
        const lines = [headers.map(csvEscape).join(',')];

        for (const table of tables) {
            const rows = await getAllRows(db, `SELECT * FROM ${table}`);
            for (const row of rows) {
                const line = [table];
                for (const column of columnOrder) {
                    line.push(csvEscape(row[column]));
                }
                lines.push(line.join(','));
            }
        }

        await fs.writeFile(outputPath, `${lines.join('\n')}\n`, 'utf8');
        console.log(`CSV export created at: ${outputPath}`);
    } finally {
        db.close();
    }
}

exportToCsv().catch((error) => {
    console.error('Failed to export database:', error);
    process.exit(1);
});

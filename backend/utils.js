/*
 * ============================================================================
 * UTILITY AND VALIDATION FUNCTIONS
 * ============================================================================
 * 
 * INCLUDES:
 * - Email validation
 * - Input sanitization
 * - Contact form validation
 * - Error responses
 */

import nodemailer from 'nodemailer';
import { runQuery } from './database.js';

// Email validation regex
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Validate email format
 */
export function isValidEmail(email) {
    return emailRegex.test(email);
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    return input.trim().replace(/[<>]/g, '');
}

/**
 * Validate contact form input
 */
export function validateContactForm(data) {
    const errors = [];

    if (!data.event_name || data.event_name.trim().length < 3) {
        errors.push('Event name is required and must be at least 3 characters');
    }

    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Valid email is required');
    }

    if (!data.name || data.name.trim().length < 2) {
        errors.push('Name is required and must be at least 2 characters');
    }

    if (!data.details || data.details.trim().length < 10) {
        errors.push('Details must be at least 10 characters');
    }

    return errors;
}

/**
 * Create email transporter for nodemailer
 */
export function createEmailTransporter() {
    return nodemailer.createTransport({
        host: process.env.MAIL_SERVER,
        port: parseInt(process.env.MAIL_PORT || '587'),
        secure: false,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        }
    });
}

/**
 * Send email and log it
 */
export async function sendEmail(to, subject, htmlBody, emailType) {
    try {
        const transporter = createEmailTransporter();

        const mailOptions = {
            from: process.env.MAIL_SENDER || 'JiggerOnTheMix <noreply@jiggeronthemix.com>',
            to: to,
            subject: subject,
            html: htmlBody
        };

        await transporter.sendMail(mailOptions);

        // Log successful send
        await runQuery(
            'INSERT INTO email_logs (recipient, subject, email_type, status) VALUES (?, ?, ?, ?)',
            [to, subject, emailType, 'sent']
        );

        console.log(`✓ Email sent to ${to}`);
        return true;

    } catch (error) {
        // Log failed send
        await runQuery(
            'INSERT INTO email_logs (recipient, subject, email_type, status, error_message) VALUES (?, ?, ?, ?, ?)',
            [to, subject, emailType, 'failed', error.message]
        );

        console.error(`✗ Error sending email to ${to}:`, error.message);
        return false;
    }
}

/**
 * Send contact form reply
 */
export async function sendContactReply(recipientEmail, contactName, eventName) {
    const subject = 'We Received Your Booking Request - JiggerOnTheMix';

    const htmlBody = `
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 8px;">
                    <h2 style="color: #dd0000;">Thank You, ${contactName}!</h2>
                    
                    <p>We received your booking request for <strong>${eventName}</strong>.</p>
                    
                    <p>Our team is reviewing your details and will get back to you within 24 hours with a personalized quote and availability.</p>
                    
                    <h3 style="color: #dd0000; margin-top: 30px;">What's Next?</h3>
                    <ul>
                        <li>We'll contact you via email or phone to confirm details</li>
                        <li>We'll provide a custom quote based on your event</li>
                        <li>Once confirmed, we'll send a booking confirmation</li>
                    </ul>
                    
                    <div style="margin: 30px 0; text-align: center;">
                        <a href="https://vittoriojocson.github.io/WEB-SYS-project/" style="background: #dd0000; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Visit Our Website</a>
                    </div>
                    
                    <p style="margin-top: 30px; color: #666; font-size: 12px;">
                        Questions? Contact us at +63 995-551-1748 or jiggeronthemix.atyourservice@gmail.com
                    </p>
                    
                    <p style="color: #dd0000; font-weight: bold; margin-top: 20px;">
                        JiggerOnTheMix - Premium Mobile Bar Service
                    </p>
                </div>
            </body>
        </html>
    `;

    return sendEmail(recipientEmail, subject, htmlBody, 'contact_reply');
}

/**
 * Send newsletter confirmation
 */
export async function sendNewsletterConfirmation(recipientEmail) {
    const subject = 'Welcome to JiggerOnTheMix Newsletter!';

    const htmlBody = `
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 8px;">
                    <h2 style="color: #dd0000;">Welcome to Our Newsletter!</h2>
                    
                    <p>Thank you for subscribing to JiggerOnTheMix updates.</p>
                    
                    <p>You'll now receive:</p>
                    <ul>
                        <li>✓ Exclusive event package deals</li>
                        <li>✓ New cocktail menu updates</li>
                        <li>✓ Special promotions and discounts</li>
                        <li>✓ Event planning tips from our experts</li>
                    </ul>
                    
                    <div style="margin: 30px 0; text-align: center;">
                        <a href="https://vittoriojocson.github.io/WEB-SYS-project/" style="background: #dd0000; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Explore Our Packages</a>
                    </div>
                    
                    <p style="margin-top: 30px; color: #666; font-size: 12px;">
                        Not interested? You can unsubscribe anytime by replying to this email.
                    </p>
                    
                    <p style="color: #dd0000; font-weight: bold; margin-top: 20px;">
                        JiggerOnTheMix - Premium Mobile Bar Service
                    </p>
                </div>
            </body>
        </html>
    `;

    return sendEmail(recipientEmail, subject, htmlBody, 'newsletter_welcome');
}

/**
 * Error response helper
 */
export function errorResponse(errors = [], statusCode = 400) {
    return {
        success: false,
        errors: Array.isArray(errors) ? errors : [errors],
        statusCode: statusCode
    };
}

/**
 * Success response helper
 */
export function successResponse(data = {}, message = 'Success', statusCode = 200) {
    return {
        success: true,
        message: message,
        data: data,
        statusCode: statusCode
    };
}

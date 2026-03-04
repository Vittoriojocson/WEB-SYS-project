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
 * Send booking verification/approval email
 */
export async function sendBookingVerification(recipientEmail, customerName, bookingDetails) {
    const {
        bookingId,
        packageType,
        eventDate,
        guestCount,
        priceQuote,
        paymentMethod
    } = bookingDetails;

    const subject = '✅ Booking Approved - JiggerOnTheMix';

    const formattedDate = eventDate ? new Date(eventDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : 'Date TBD';

    const htmlBody = `
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 8px;">
                    <div style="background: #dd0000; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
                        <h1 style="margin: 0; font-size: 28px;">🎉 Booking Approved!</h1>
                    </div>
                    
                    <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px;">
                        <p style="font-size: 18px; margin-bottom: 20px;">
                            Congratulations, <strong>${customerName}</strong>!
                        </p>
                        
                        <p style="font-size: 16px; color: #333;">
                            Your booking has been <strong style="color: #00aa00;">VERIFIED</strong> and <strong style="color: #00aa00;">APPROVED</strong>. 
                            We're excited to make your event unforgettable!
                        </p>
                        
                        <div style="margin: 30px 0; padding: 20px; background: #f0f8ff; border-left: 4px solid #dd0000; border-radius: 4px;">
                            <h3 style="color: #dd0000; margin-top: 0;">Booking Confirmation Details</h3>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Booking ID:</td>
                                    <td style="padding: 8px 0;">#${bookingId}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Package:</td>
                                    <td style="padding: 8px 0;">${packageType}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Event Date:</td>
                                    <td style="padding: 8px 0;">${formattedDate}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Guest Count:</td>
                                    <td style="padding: 8px 0;">${guestCount || 'TBD'} Guests</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Total Amount:</td>
                                    <td style="padding: 8px 0; font-size: 18px; color: #dd0000; font-weight: bold;">₱${priceQuote?.toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Payment Method:</td>
                                    <td style="padding: 8px 0;">${paymentMethod || 'N/A'}</td>
                                </tr>
                            </table>
                        </div>
                        
                        <h3 style="color: #dd0000; margin-top: 30px;">What Happens Next?</h3>
                        <ol style="line-height: 2;">
                            <li>Save this email for your records</li>
                            <li>Our team will contact you 3-5 days before the event to confirm final details</li>
                            <li>We'll arrive at the venue with all equipment and supplies</li>
                            <li>Enjoy your event with premium bar service!</li>
                        </ol>
                        
                        <div style="margin: 30px 0; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
                            <p style="margin: 0; color: #856404;">
                                <strong>⚠️ Important:</strong> If you need to make changes or have questions, 
                                please contact us at least 7 days before your event.
                            </p>
                        </div>
                        
                        <div style="margin: 30px 0; text-align: center;">
                            <a href="https://vittoriojocson.github.io/WEB-SYS-project/" 
                               style="background: #dd0000; color: white; padding: 12px 30px; 
                                      text-decoration: none; border-radius: 6px; font-weight: bold; 
                                      display: inline-block;">Visit Our Website</a>
                        </div>
                        
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #eee;">
                            <p style="color: #666; font-size: 14px; margin: 5px 0;">
                                <strong>Contact Us:</strong>
                            </p>
                            <p style="color: #666; font-size: 14px; margin: 5px 0;">
                                📞 Phone: +63 995-551-1748
                            </p>
                            <p style="color: #666; font-size: 14px; margin: 5px 0;">
                                ✉️ Email: jiggeronthemix.atyourservice@gmail.com
                            </p>
                        </div>
                        
                        <p style="color: #dd0000; font-weight: bold; margin-top: 30px; text-align: center; font-size: 16px;">
                            JiggerOnTheMix - Premium Mobile Bar Service
                        </p>
                    </div>
                </div>
            </body>
        </html>
    `;

    return sendEmail(recipientEmail, subject, htmlBody, 'booking_verification');
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

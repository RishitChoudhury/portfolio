import nodemailer from 'nodemailer';
import { getAutoReplyEmailTemplate } from './emailTemplate.js';

export default async function handler(req, res) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, projectType, description } = req.body;

    // Validate required fields
    if (!email || !projectType || !description) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email address' });
    }

    // Create transporter with Google SMTP
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });

    // Build the HTML email
    const htmlBody = `
    <div style="font-family: 'Courier New', monospace; background: #0a0a0a; color: #e0e0e0; padding: 32px; border: 1px solid #333;">
        <div style="border-bottom: 1px solid #333; padding-bottom: 16px; margin-bottom: 24px;">
            <h1 style="color: #00ff88; margin: 0; font-size: 18px; letter-spacing: 2px;">
                ▶ SYNTAXT — NEW TRANSMISSION
            </h1>
            <p style="color: #666; margin: 8px 0 0 0; font-size: 12px;">
                ${new Date().toISOString()}
            </p>
        </div>

        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 12px 0; color: #888; font-size: 13px; width: 160px; vertical-align: top;">
                    SENDER_EMAIL //
                </td>
                <td style="padding: 12px 0; color: #fff; font-size: 14px;">
                    <a href="mailto:${email}" style="color: #00ff88;">${email}</a>
                </td>
            </tr>
            <tr>
                <td style="padding: 12px 0; color: #888; font-size: 13px; vertical-align: top;">
                    PROJECT_TYPE //
                </td>
                <td style="padding: 12px 0; color: #fff; font-size: 14px;">
                    ${projectType}
                </td>
            </tr>
            <tr>
                <td style="padding: 12px 0; color: #888; font-size: 13px; vertical-align: top;">
                    DESCRIPTION //
                </td>
                <td style="padding: 12px 0; color: #fff; font-size: 14px; line-height: 1.6;">
                    ${description.replace(/\n/g, '<br>')}
                </td>
            </tr>
        </table>

        <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #333;">
            <p style="color: #555; font-size: 11px; margin: 0;">
                // Reply directly to this email to respond to the sender.
            </p>
        </div>
    </div>
    `;

    try {
        await transporter.sendMail({
            from: `"Syntaxt Systems Portfolio" <${process.env.GMAIL_USER}>`,
            to: process.env.GMAIL_USER,
            replyTo: email,
            subject: `[SYNTAXT] New ${projectType} inquiry from ${email}`,
            html: htmlBody,
        });

        const host = req.headers.host || 'localhost:3000';
        const protocol = req.headers['x-forwarded-proto'] || 'http';
        const baseUrl = `${protocol}://${host}`;

        // Send auto-reply to the client
        await transporter.sendMail({
            from: `"Syntaxt" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: `Your Inquiry to Syntaxt | Let's Connect`,
            html: getAutoReplyEmailTemplate(email, process.env.GMAIL_USER, projectType, description, baseUrl)
        });

        return res.status(200).json({ message: 'Transmission successful' });
    } catch (error) {
        console.error('SMTP Error:', error);
        return res.status(500).json({ error: 'Failed to send message. Please try again.' });
    }
}

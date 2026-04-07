import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import { parse, addHours } from 'date-fns';

/**
 * Creates an OAuth2 client using stored refresh token.
 * This allows the API to act AS the user — required for
 * Google Meet link generation on personal Gmail accounts.
 */
function getOAuth2Client() {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_OAUTH_CLIENT_ID,
        process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    );
    oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
    });
    return oauth2Client;
}

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { date, time, email, projectType, description } = req.body;

    if (!date || !time || !email) {
        return res.status(400).json({ error: 'Missing required sync parameters' });
    }

    try {
        // Build actual Date object from "2026-03-31" and "10:00 AM"
        const meetStart = parse(`${date} ${time}`, 'yyyy-MM-dd h:mm a', new Date());
        const meetEnd = addHours(meetStart, 1); // 1 hr meeting

        let meetLink = '';
        let calendarEventLink = '';

        // ---------- GOOGLE CALENDAR EVENT + MEET LINK ----------
        const hasOAuth = process.env.GOOGLE_OAUTH_CLIENT_ID
            && process.env.GOOGLE_OAUTH_CLIENT_SECRET
            && process.env.GOOGLE_OAUTH_REFRESH_TOKEN;

        if (hasOAuth) {
            const auth = getOAuth2Client();
            const calendar = google.calendar({ version: 'v3', auth });

            const projectLabel = projectType || 'General Inquiry';

            const event = {
                summary: `Syntaxt × ${projectLabel} — Discovery Call`,
                description: [
                    `━━━ Syntaxt ━━━`,
                    ``,
                    `Client: ${email}`,
                    `Project Type: ${projectLabel}`,
                    ``,
                    `Brief:`,
                    `${description || 'To be discussed on the call.'}`,
                    ``,
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
                    `This meeting was auto-scheduled via syntaxt.dev`,
                ].join('\n'),
                start: {
                    dateTime: meetStart.toISOString(),
                    timeZone: 'Asia/Kolkata',
                },
                end: {
                    dateTime: meetEnd.toISOString(),
                    timeZone: 'Asia/Kolkata',
                },
                attendees: [
                    { email: email },
                ],
                conferenceData: {
                    createRequest: {
                        requestId: `syntaxt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                        conferenceSolutionKey: { type: 'hangoutsMeet' },
                    },
                },
                reminders: {
                    useDefault: false,
                    overrides: [
                        { method: 'popup', minutes: 30 },
                        { method: 'email', minutes: 60 },
                    ],
                },
                transparency: 'opaque',   // Blocks the calendar slot
                status: 'confirmed',
            };

            const createdEvent = await calendar.events.insert({
                calendarId: 'primary',
                resource: event,
                conferenceDataVersion: 1,
                sendUpdates: 'all',        // Sends invite to attendee
            });

            meetLink = createdEvent.data.hangoutLink || '';
            calendarEventLink = createdEvent.data.htmlLink || '';

            console.log('✅ Calendar event created:', createdEvent.data.id);
            console.log('   Meet link:', meetLink);
        } else {
            console.warn('⚠️  OAuth2 credentials not configured — skipping calendar creation.');
        }

        // ---------- CONFIRMATION EMAIL ----------
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        const meetButtonHtml = meetLink
            ? `<a href="${meetLink}" style="background: #ff003c; color: #fff; padding: 14px 28px; text-decoration: none; font-weight: bold; display: inline-block; letter-spacing: 1px; font-size: 14px;">JOIN GOOGLE MEET</a>`
            : `<span style="color: #888; font-size: 13px;">Google Meet link will be shared separately.</span>`;

        const calendarLinkHtml = calendarEventLink
            ? `<a href="${calendarEventLink}" style="color: #ff003c; font-size: 12px; text-decoration: underline; display: inline-block; margin-top: 12px;">View Calendar Event →</a>`
            : '';

        const confirmHtml = `
        <div style="font-family: 'Courier New', monospace; background: #030303; color: #ffffff; padding: 40px;">
            <div style="border: 1px solid #ff003c; padding: 30px; background: #0a0a0a;">
                <h1 style="color: #ff003c; margin: 0 0 20px 0; font-family: Impact, sans-serif; letter-spacing: 2px;">
                    UPLINK CONFIRMED
                </h1>
                <p style="color: #888; font-size: 14px;">&gt; DISCOVERY CALL SYNC SUCCESSFUL</p>
                <hr style="border-color: #333; margin: 20px 0;">
                
                <table style="width: 100%; text-align: left; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 10px 0; color: #888; width: 150px;">DATE //</td>
                        <td style="color: #fff;">${meetStart.toDateString()}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; color: #888;">TIME //</td>
                        <td style="color: #fff;">${time} IST</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; color: #888;">TYPE //</td>
                        <td style="color: #fff;">${projectType || 'General Inquiry'}</td>
                    </tr>
                </table>

                <div style="margin-top: 30px;">
                    ${meetButtonHtml}
                </div>
                ${calendarLinkHtml}
            </div>
        </div>
        `;

        await transporter.sendMail({
            from: `"Syntaxt" <${process.env.GMAIL_USER}>`,
            to: email,
            bcc: process.env.GMAIL_USER,
            subject: `Syntaxt × ${projectType || 'Discovery Call'} — Meeting Confirmed`,
            html: confirmHtml,
        });

        res.status(200).json({ success: true, meetLink, calendarEventLink });

    } catch (err) {
        console.error('Booking Error:', err);
        res.status(500).json({ error: err.message || 'Failed to initialize calendar sequence' });
    }
}

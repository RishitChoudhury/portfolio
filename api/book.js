import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import { parse, addHours } from 'date-fns';

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

        // Use a permanent Google Meet room link if set, otherwise fallback
        const meetLink = process.env.GOOGLE_MEET_LINK || 'https://calendar.google.com';

        let calendarEventLink = meetLink;

        // Check for Google Auth payload
        if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
            const rawPrivateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/^"|"$/g, '');
            const auth = new google.auth.GoogleAuth({
                credentials: {
                    client_email: process.env.GOOGLE_CLIENT_EMAIL,
                    private_key: rawPrivateKey,
                },
                scopes: ['https://www.googleapis.com/auth/calendar']
            });

            const authClient = await auth.getClient();
            const calendar = google.calendar({ version: 'v3', auth: authClient });

            // Build event — no attendees or conferenceData (not supported for
            // service accounts on personal Gmail).  The Meet link is embedded
            // in the description so both parties can join.
            const event = {
                summary: `Discovery Call: NUEVA × ${projectType || 'General'}`,
                description: [
                    `CLIENT: ${email}`,
                    `PROJECT TYPE: ${projectType || 'General'}`,
                    `DESCRIPTION:\n${description || 'N/A'}`,
                    ``,
                    `───────────────────`,
                    `JOIN MEETING: ${meetLink}`,
                    `───────────────────`,
                ].join('\n'),
                start: { dateTime: meetStart.toISOString() },
                end: { dateTime: meetEnd.toISOString() },
                reminders: {
                    useDefault: false,
                    overrides: [
                        { method: 'popup', minutes: 30 },
                        { method: 'popup', minutes: 10 },
                    ],
                },
                // Mark as busy to block the slot
                transparency: 'opaque',
                status: 'confirmed',
            };

            const createdEvent = await calendar.events.insert({
                calendarId: process.env.GMAIL_USER,
                resource: event,
            });

            calendarEventLink = createdEvent.data.htmlLink || meetLink;
            console.log('Calendar event created:', createdEvent.data.id);
        }

        // Send Custom branded email confirmation using Nodemailer
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

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
                        <td style="color: #fff;">${time}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; color: #888;">TYPE //</td>
                        <td style="color: #fff;">${projectType || 'General'}</td>
                    </tr>
                </table>

                <div style="margin-top: 30px;">
                    <a href="${meetLink}" style="background: #ff003c; color: #fff; padding: 12px 24px; text-decoration: none; font-weight: bold; display: inline-block; letter-spacing: 1px;">
                        JOIN GOOGLE MEET
                    </a>
                </div>
                <div style="margin-top: 12px;">
                    <a href="${calendarEventLink}" style="color: #ff003c; font-size: 12px; text-decoration: underline;">
                        View Calendar Event
                    </a>
                </div>
            </div>
        </div>
        `;

        await transporter.sendMail({
            from: `"NUEVA | Digital Engineering" <${process.env.GMAIL_USER}>`,
            to: email, // Send to the client
            bcc: process.env.GMAIL_USER, // Admin copy
            subject: `Calendar Sync Confirmed: Meeting with NUEVA`,
            html: confirmHtml
        });

        res.status(200).json({ success: true, meetLink, calendarEventLink });

    } catch (err) {
        console.error('Booking Error:', err);
        res.status(500).json({ error: err.message || 'Failed to initialize calendar sequence' });
    }
}

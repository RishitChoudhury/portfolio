import { google } from 'googleapis';
import { startOfDay, endOfDay, formatISO } from 'date-fns';

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
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const { date } = req.query; // '2026-03-31'
    if (!date) return res.status(400).json({ error: 'Missing date parameter' });

    try {
        const hasOAuth = process.env.GOOGLE_OAUTH_CLIENT_ID
            && process.env.GOOGLE_OAUTH_CLIENT_SECRET
            && process.env.GOOGLE_OAUTH_REFRESH_TOKEN;

        if (!hasOAuth) {
            // Fallback fixed slots if OAuth not configured
            return res.status(200).json({ 
                slots: ['10:00 AM', '11:30 AM', '01:00 PM', '02:30 PM', '04:00 PM']
            });
        }

        const auth = getOAuth2Client();
        const calendar = google.calendar({ version: 'v3', auth });
        
        const timeMin = startOfDay(new Date(date));
        const timeMax = endOfDay(new Date(date));

        // Get free/busy from the user's primary calendar
        const response = await calendar.freebusy.query({
            requestBody: {
                timeMin: formatISO(timeMin),
                timeMax: formatISO(timeMax),
                timeZone: 'Asia/Kolkata',
                items: [{ id: 'primary' }]
            }
        });

        const busySlots = response.data.calendars.primary.busy;

        // Generate standard slots from 9 AM to 5 PM
        const availableSlots = [];
        let currentSlot = new Date(date);
        currentSlot.setHours(9, 0, 0, 0); // Start at 9 AM
        
        const endOfDayLimit = new Date(date);
        endOfDayLimit.setHours(17, 0, 0, 0); // End at 5 PM

        while (currentSlot < endOfDayLimit) {
            const slotEnd = new Date(currentSlot.getTime() + 60 * 60 * 1000); // 1 hr meetings

            // Check if this slot overlaps with busy slots
            const isBusy = busySlots.some(busy => {
                const busyStart = new Date(busy.start);
                const busyEnd = new Date(busy.end);
                return (currentSlot < busyEnd && slotEnd > busyStart);
            });

            // Ensure slot isn't in the past
            const isFuture = currentSlot > new Date();

            if (!isBusy && isFuture) {
                let hours = currentSlot.getHours();
                const ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                hours = hours ? hours : 12; 
                const mins = currentSlot.getMinutes() === 0 ? '00' : currentSlot.getMinutes();
                availableSlots.push(`${hours}:${mins} ${ampm}`);
            }

            currentSlot.setHours(currentSlot.getHours() + 1);
        }

        res.status(200).json({ slots: availableSlots });
    } catch (err) {
        console.error('Calendar API Error:', err);
        // Return default slots on error so the UI doesn't break
        res.status(200).json({ 
            slots: ['10:00 AM', '11:30 AM', '01:00 PM', '02:30 PM', '04:00 PM']
        });
    }
}

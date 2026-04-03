import { google } from 'googleapis';
import { startOfDay, endOfDay, formatISO, parseISO } from 'date-fns';

export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const { date } = req.query; // '2026-03-31'
    if (!date) return res.status(400).json({ error: 'Missing date parameter' });

    try {
        // Authenticate with Google
        if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
            // If the user hasn't set this up yet, return dummy slots so the UI works
            return res.status(200).json({ 
                slots: ['10:00 AM', '11:30 AM', '01:00 PM', '02:30 PM', '04:00 PM']
            });
        }

        const auth = new google.auth.JWT(
            process.env.GOOGLE_CLIENT_EMAIL,
            null,
            process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            ['https://www.googleapis.com/auth/calendar.readonly']
        );

        const calendar = google.calendar({ version: 'v3', auth });
        
        const timeMin = startOfDay(new Date(date));
        const timeMax = endOfDay(new Date(date));

        // Get free/busy
        const response = await calendar.freebusy.query({
            requestBody: {
                timeMin: formatISO(timeMin),
                timeMax: formatISO(timeMax),
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
                // Formatting time (e.g. 10:00 AM)
                let hours = currentSlot.getHours();
                const ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                hours = hours ? hours : 12; 
                const mins = currentSlot.getMinutes() === 0 ? '00' : currentSlot.getMinutes();
                availableSlots.push(`${hours}:${mins} ${ampm}`);
            }

            // Next slot
            currentSlot.setHours(currentSlot.getHours() + 1);
        }

        res.status(200).json({ slots: availableSlots });
    } catch (err) {
        console.error('Calendar API Error:', err);
        res.status(500).json({ error: 'Failed to fetch availability' });
    }
}

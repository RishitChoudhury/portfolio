import { getDb } from '../db.js';
import { verifyAdminToken } from '../adminAuth.js';

export default async function handler(req, res) {
    const auth = verifyAdminToken(req, res);
    if (!auth) return;

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const sql = getDb();
        const bookings = await sql`SELECT * FROM bookings ORDER BY meeting_date DESC, booked_at DESC`;
        return res.status(200).json({ bookings });
    } catch (err) {
        console.error('DB error fetching bookings:', err);
        return res.status(500).json({ error: 'Failed to fetch bookings' });
    }
}

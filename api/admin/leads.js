import { getDb } from '../db.js';
import { verifyAdminToken } from '../adminAuth.js';

const VALID_STATUSES = ['new', 'contacted', 'booked', 'closed'];
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function handler(req, res) {
    const auth = verifyAdminToken(req, res);
    if (!auth) return;

    const sql = getDb();

    // GET /api/admin/leads — all leads, newest first
    if (req.method === 'GET') {
        try {
            const leads = await sql`SELECT * FROM leads ORDER BY submitted_at DESC`;
            return res.status(200).json({ leads });
        } catch (err) {
            console.error('DB error fetching leads:', err);
            return res.status(500).json({ error: 'Failed to fetch leads' });
        }
    }

    // PATCH /api/admin/leads — update status and/or notes for a lead
    if (req.method === 'PATCH') {
        const { id, status, notes } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'Lead id required' });
        }
        if (!UUID_RE.test(id)) {
            return res.status(400).json({ error: 'Invalid lead id format' });
        }
        if (status !== undefined && !VALID_STATUSES.includes(status)) {
            return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
        }
        if (status === undefined && notes === undefined) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        try {
            let rows;

            if (status !== undefined && notes !== undefined) {
                rows = await sql`
                    UPDATE leads SET status = ${status}, notes = ${notes}
                    WHERE id = ${id} RETURNING *
                `;
            } else if (status !== undefined) {
                rows = await sql`
                    UPDATE leads SET status = ${status}
                    WHERE id = ${id} RETURNING *
                `;
            } else {
                rows = await sql`
                    UPDATE leads SET notes = ${notes}
                    WHERE id = ${id} RETURNING *
                `;
            }

            if (!rows.length) {
                return res.status(404).json({ error: 'Lead not found' });
            }

            return res.status(200).json({ lead: rows[0] });
        } catch (err) {
            console.error('DB error updating lead:', err);
            return res.status(500).json({ error: 'Failed to update lead' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}

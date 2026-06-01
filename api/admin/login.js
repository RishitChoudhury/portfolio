import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '../db.js';

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function getIp(req) {
    return (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown')
        .split(',')[0]
        .trim();
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { password } = req.body;

    if (!password || typeof password !== 'string') {
        return res.status(400).json({ error: 'Password required' });
    }

    // bcrypt silently truncates beyond 72 bytes — reject oversized inputs early
    if (password.length > 72) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const hash = process.env.ADMIN_PASSWORD_HASH;
    const secret = process.env.JWT_SECRET;

    if (!hash || !secret) {
        console.error('ADMIN_PASSWORD_HASH or JWT_SECRET not configured');
        return res.status(500).json({ error: 'Server misconfiguration' });
    }

    const ip = getIp(req);
    const sql = getDb();
    const windowStart = new Date(Date.now() - WINDOW_MS);

    // Check rate limit — count failed attempts from this IP in the last 15 minutes
    try {
        const [{ count }] = await sql`
            SELECT COUNT(*) AS count FROM login_attempts
            WHERE ip = ${ip} AND success = FALSE AND attempted_at > ${windowStart}
        `;

        if (parseInt(count) >= MAX_ATTEMPTS) {
            return res.status(429).json({
                error: 'Too many failed attempts. Try again in 15 minutes.',
            });
        }
    } catch (err) {
        // If rate limit check fails, log and continue — don't block legitimate access
        console.error('Rate limit check error:', err.message);
    }

    // bcrypt.compare is inherently constant-time — no timing attack risk
    const isValid = await bcrypt.compare(password, hash);

    // Record this attempt
    try {
        await sql`INSERT INTO login_attempts (ip, success) VALUES (${ip}, ${isValid})`;

        // Probabilistic cleanup — run ~10% of requests to avoid a cron job
        if (Math.random() < 0.1) {
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            sql`DELETE FROM login_attempts WHERE attempted_at < ${oneDayAgo}`.catch(() => {});
        }
    } catch (err) {
        console.error('Failed to record login attempt:', err.message);
    }

    if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
        { role: 'admin' },
        secret,
        { expiresIn: '24h' }
    );

    return res.status(200).json({ token });
}

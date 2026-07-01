import { getDb } from './db.js';

/**
 * Extract the real client IP from Vercel's forwarded headers.
 * Vercel always sets x-forwarded-for; the first entry is the client IP.
 */
export function getIp(req) {
    return (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown')
        .split(',')[0]
        .trim();
}

/**
 * Check whether a request should be rate-limited.
 *
 * Uses the `api_rate_limits` table in Neon to track attempts per (key, action)
 * within a sliding time window. Two independent keys are supported per call:
 *   - ip key   → prevents bot floods from a single IP
 *   - email key → prevents a single user from cycling IPs (optional)
 *
 * Schema required (run once in your Neon console):
 *   CREATE TABLE IF NOT EXISTS api_rate_limits (
 *     id          SERIAL PRIMARY KEY,
 *     key         TEXT NOT NULL,
 *     action      TEXT NOT NULL,
 *     attempted_at TIMESTAMPTZ DEFAULT NOW()
 *   );
 *   CREATE INDEX IF NOT EXISTS idx_api_rate_limits
 *     ON api_rate_limits (key, action, attempted_at);
 *
 * @param {object} options
 * @param {string}  options.ip          — client IP address
 * @param {string}  options.action      — endpoint name, e.g. 'contact' | 'book'
 * @param {number}  options.maxPerIp    — max requests from one IP within the window
 * @param {number}  options.windowMs    — sliding window size in milliseconds
 * @param {string}  [options.email]     — optional: also apply a per-email limit
 * @param {number}  [options.maxPerEmail] — max requests from one email within window
 *
 * @returns {{ limited: boolean, reason?: string }}
 */
export async function checkRateLimit({ ip, action, maxPerIp, windowMs, email, maxPerEmail }) {
    try {
        const sql = getDb();
        const windowStart = new Date(Date.now() - windowMs);

        // Check IP limit
        const [{ count: ipCount }] = await sql`
            SELECT COUNT(*) AS count FROM api_rate_limits
            WHERE key = ${ip} AND action = ${action} AND attempted_at > ${windowStart}
        `;

        if (parseInt(ipCount) >= maxPerIp) {
            return { limited: true, reason: 'Too many requests from your network. Please try again later.' };
        }

        // Check email limit (if provided)
        if (email && maxPerEmail) {
            const emailKey = `email:${email.toLowerCase()}`;
            const [{ count: emailCount }] = await sql`
                SELECT COUNT(*) AS count FROM api_rate_limits
                WHERE key = ${emailKey} AND action = ${action} AND attempted_at > ${windowStart}
            `;

            if (parseInt(emailCount) >= maxPerEmail) {
                return { limited: true, reason: 'This email address has already submitted recently. Please try again later.' };
            }
        }

        return { limited: false };
    } catch (err) {
        // If rate limit check fails, log and allow — don't block legitimate users
        console.error(`Rate limit check error [${action}]:`, err.message);
        return { limited: false };
    }
}

/**
 * Record a successful request attempt for future rate limit checks.
 * Non-blocking — failures are logged but do not affect the response.
 *
 * @param {object} options
 * @param {string}  options.ip      — client IP
 * @param {string}  options.action  — endpoint name
 * @param {string}  [options.email] — optional email key to also record
 */
export async function recordAttempt({ ip, action, email }) {
    try {
        const sql = getDb();

        // Record the IP attempt
        await sql`INSERT INTO api_rate_limits (key, action) VALUES (${ip}, ${action})`;

        // Record the email attempt if provided
        if (email) {
            const emailKey = `email:${email.toLowerCase()}`;
            await sql`INSERT INTO api_rate_limits (key, action) VALUES (${emailKey}, ${action})`;
        }

        // Probabilistic cleanup — runs ~5% of requests to avoid stale row buildup
        if (Math.random() < 0.05) {
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            sql`DELETE FROM api_rate_limits WHERE attempted_at < ${oneDayAgo}`.catch(() => {});
        }
    } catch (err) {
        console.error(`Rate limit record error [${action}]:`, err.message);
    }
}

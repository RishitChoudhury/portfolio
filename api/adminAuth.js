import jwt from 'jsonwebtoken';

/**
 * JWT middleware for admin API routes.
 * Returns the decoded payload if valid, or sends a 401 and returns false.
 *
 * Usage (must be first line of every /api/admin/* handler):
 *   const auth = verifyAdminToken(req, res);
 *   if (!auth) return;
 */
export function verifyAdminToken(req, res) {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Missing or malformed Authorization header' });
        return false;
    }

    const token = authHeader.slice(7);

    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        const message = err.name === 'TokenExpiredError'
            ? 'Session expired. Please log in again.'
            : 'Invalid token';
        res.status(401).json({ error: message });
        return false;
    }
}

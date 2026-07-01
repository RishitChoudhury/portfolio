-- Syntaxt Portfolio CRM — Neon PostgreSQL Schema
-- Run this once in your Neon console to initialise the database.
-- All tables use IF NOT EXISTS so re-running is safe.

-- ── leads ─────────────────────────────────────────────────────────────────────
-- Stores every contact form submission.
-- status lifecycle: new → contacted → booked → closed
CREATE TABLE IF NOT EXISTS leads (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email        TEXT NOT NULL,
    project_type TEXT NOT NULL,
    description  TEXT,
    status       TEXT NOT NULL DEFAULT 'new'
                     CHECK (status IN ('new', 'contacted', 'booked', 'closed')),
    notes        TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_email        ON leads (email);
CREATE INDEX IF NOT EXISTS idx_leads_status       ON leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_submitted_at ON leads (submitted_at DESC);

-- ── bookings ──────────────────────────────────────────────────────────────────
-- One row per Google Calendar booking.
-- lead_id is nullable — orphan bookings occur when a user books without
-- first submitting the contact form (booked directly via /schedule).
CREATE TABLE IF NOT EXISTS bookings (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id             UUID REFERENCES leads (id) ON DELETE SET NULL,
    email               TEXT NOT NULL,
    meeting_date        TEXT NOT NULL,    -- 'yyyy-MM-dd'
    meeting_time        TEXT NOT NULL,    -- 'h:mm AM/PM'
    project_type        TEXT,
    meet_link           TEXT,
    calendar_event_link TEXT,
    status              TEXT NOT NULL DEFAULT 'scheduled'
                            CHECK (status IN ('scheduled', 'completed', 'cancelled')),
    booked_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_lead_id     ON bookings (lead_id);
CREATE INDEX IF NOT EXISTS idx_bookings_email       ON bookings (email);
CREATE INDEX IF NOT EXISTS idx_bookings_meeting_date ON bookings (meeting_date DESC);

-- ── login_attempts ────────────────────────────────────────────────────────────
-- Tracks admin login attempts for IP-based rate limiting.
-- Rows older than 24 hours are cleaned up probabilistically in login.js.
CREATE TABLE IF NOT EXISTS login_attempts (
    id           SERIAL PRIMARY KEY,
    ip           TEXT NOT NULL,
    success      BOOLEAN NOT NULL,
    attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_login_attempts_ip ON login_attempts (ip, attempted_at);

-- ── api_rate_limits ───────────────────────────────────────────────────────────
-- Tracks public API usage for rate limiting /api/contact and /api/book.
-- key can be an IP address or 'email:<address>' for per-email tracking.
-- Rows older than 24 hours are cleaned up probabilistically in rateLimit.js.
CREATE TABLE IF NOT EXISTS api_rate_limits (
    id           SERIAL PRIMARY KEY,
    key          TEXT NOT NULL,
    action       TEXT NOT NULL,    -- 'contact' | 'book'
    attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_api_rate_limits ON api_rate_limits (key, action, attempted_at);

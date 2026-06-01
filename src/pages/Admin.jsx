import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Utilities ─────────────────────────────────────────────────────────────────

function getAuthHeader() {
    const token = sessionStorage.getItem('admin_token');
    return { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
}

function formatDate(isoString) {
    if (!isoString) return '—';
    return new Date(isoString).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
    });
}

const STATUS_COLORS = {
    new:       '#FF003C',
    contacted: '#ffaa00',
    booked:    '#00ff88',
    closed:    '#555555',
    scheduled: '#00ff88',
    completed: '#0077ff',
    cancelled: '#555555',
    no_show:   '#ff4444',
};

const mono = { fontFamily: "'JetBrains Mono', monospace" };

// ── Stats Bar ─────────────────────────────────────────────────────────────────

function StatsBar({ leads, bookings }) {
    const today = new Date().toDateString();
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const stats = [
        { label: 'TOTAL_LEADS',  value: leads.length },
        { label: 'NEW_TODAY',    value: leads.filter(l => new Date(l.submitted_at).toDateString() === today).length },
        { label: 'BOOKINGS_7D', value: bookings.filter(b => new Date(b.booked_at) >= weekAgo).length },
        { label: 'OPEN',         value: leads.filter(l => l.status === 'new' || l.status === 'contacted').length },
    ];

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1px',
            background: '#333333',
            border: '1px solid #333333',
            marginBottom: '2.5rem',
        }}>
            {stats.map(s => (
                <div key={s.label} style={{ background: '#0a0a0a', padding: '1.5rem', textAlign: 'center' }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', color: '#FF003C' }}>
                        {s.value}
                    </div>
                    <div style={{ ...mono, fontSize: '0.6rem', color: '#888888', letterSpacing: '0.15em', marginTop: '0.25rem' }}>
                        {s.label}
                    </div>
                </div>
            ))}
        </div>
    );
}

// ── Leads Table ───────────────────────────────────────────────────────────────

function LeadsTable({ leads, onUpdate }) {
    const [editingId, setEditingId] = useState(null);
    const [notesValue, setNotesValue] = useState('');

    const handleStatusChange = (id, newStatus) => onUpdate(id, { status: newStatus });

    const startEditNotes = (lead) => {
        setEditingId(lead.id);
        setNotesValue(lead.notes || '');
    };

    const saveNotes = (id) => {
        onUpdate(id, { notes: notesValue });
        setEditingId(null);
    };

    const th = {
        padding: '0.75rem 1rem',
        textAlign: 'left',
        ...mono,
        fontSize: '0.65rem',
        color: '#888888',
        letterSpacing: '0.15em',
        fontWeight: 'normal',
        whiteSpace: 'nowrap',
        borderBottom: '1px solid #FF003C',
    };

    const td = {
        padding: '0.75rem 1rem',
        ...mono,
        fontSize: '0.78rem',
        borderBottom: '1px solid #1a1a1a',
        verticalAlign: 'top',
    };

    return (
        <div style={{ marginBottom: '3.5rem' }}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', color: '#FFFFFF', marginBottom: '1rem', letterSpacing: '0.05em' }}>
                LEADS
            </h2>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                    <thead>
                        <tr>
                            {['EMAIL', 'TYPE', 'DESCRIPTION', 'STATUS', 'NOTES', 'SUBMITTED'].map(h => (
                                <th key={h} style={th}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {leads.map(lead => (
                            <tr key={lead.id}>
                                <td style={{ ...td, color: '#cccccc' }}>{lead.email}</td>
                                <td style={{ ...td, color: '#aaaaaa', whiteSpace: 'nowrap' }}>{lead.project_type}</td>
                                <td style={{ ...td, color: '#888888', maxWidth: '200px' }}>
                                    {(lead.description || '').slice(0, 60)}
                                    {(lead.description || '').length > 60 ? '...' : ''}
                                </td>
                                <td style={td}>
                                    <select
                                        value={lead.status}
                                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                                        style={{
                                            background: '#030303',
                                            border: `1px solid ${STATUS_COLORS[lead.status] || '#333'}`,
                                            color: STATUS_COLORS[lead.status] || '#fff',
                                            padding: '0.25rem 0.4rem',
                                            ...mono,
                                            fontSize: '0.7rem',
                                            cursor: 'pointer',
                                            textTransform: 'uppercase',
                                        }}
                                    >
                                        {['new', 'contacted', 'booked', 'closed'].map(s => (
                                            <option key={s} value={s}>{s.toUpperCase()}</option>
                                        ))}
                                    </select>
                                </td>
                                <td style={{ ...td, maxWidth: '180px' }}>
                                    {editingId === lead.id ? (
                                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'flex-start' }}>
                                            <textarea
                                                value={notesValue}
                                                onChange={(e) => setNotesValue(e.target.value)}
                                                rows={2}
                                                autoFocus
                                                style={{
                                                    background: '#030303',
                                                    border: '1px solid #333',
                                                    color: '#fff',
                                                    padding: '0.25rem',
                                                    ...mono,
                                                    fontSize: '0.72rem',
                                                    resize: 'none',
                                                    flex: 1,
                                                }}
                                            />
                                            <button
                                                onClick={() => saveNotes(lead.id)}
                                                style={{
                                                    background: '#FF003C',
                                                    border: 'none',
                                                    color: '#fff',
                                                    padding: '0.25rem 0.5rem',
                                                    cursor: 'pointer',
                                                    ...mono,
                                                    fontSize: '0.65rem',
                                                    whiteSpace: 'nowrap',
                                                    letterSpacing: '0.05em',
                                                }}
                                            >
                                                SAVE
                                            </button>
                                        </div>
                                    ) : (
                                        <span
                                            onClick={() => startEditNotes(lead)}
                                            title="Click to edit"
                                            style={{
                                                color: lead.notes ? '#aaaaaa' : '#444444',
                                                cursor: 'pointer',
                                                display: 'block',
                                            }}
                                        >
                                            {lead.notes || '+ add note'}
                                        </span>
                                    )}
                                </td>
                                <td style={{ ...td, color: '#555555', whiteSpace: 'nowrap' }}>
                                    {formatDate(lead.submitted_at)}
                                </td>
                            </tr>
                        ))}
                        {leads.length === 0 && (
                            <tr>
                                <td colSpan={6} style={{ ...td, textAlign: 'center', color: '#444444', padding: '2rem' }}>
                                    // NO LEADS YET
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ── Bookings Table ────────────────────────────────────────────────────────────

function BookingsTable({ bookings }) {
    const th = {
        padding: '0.75rem 1rem',
        textAlign: 'left',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '0.65rem',
        color: '#888888',
        letterSpacing: '0.15em',
        fontWeight: 'normal',
        whiteSpace: 'nowrap',
        borderBottom: '1px solid #FF003C',
    };

    const td = {
        padding: '0.75rem 1rem',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '0.78rem',
        borderBottom: '1px solid #1a1a1a',
        verticalAlign: 'top',
    };

    return (
        <div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', color: '#FFFFFF', marginBottom: '1rem', letterSpacing: '0.05em' }}>
                BOOKINGS
            </h2>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                    <thead>
                        <tr>
                            {['EMAIL', 'DATE', 'TIME', 'TYPE', 'MEET LINK', 'STATUS', 'BOOKED_AT'].map(h => (
                                <th key={h} style={th}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map(b => (
                            <tr key={b.id}>
                                <td style={{ ...td, color: '#cccccc' }}>{b.email}</td>
                                <td style={{ ...td, color: '#cccccc', whiteSpace: 'nowrap' }}>{b.meeting_date}</td>
                                <td style={{ ...td, color: '#cccccc', whiteSpace: 'nowrap' }}>{b.meeting_time}</td>
                                <td style={{ ...td, color: '#888888' }}>{b.project_type || '—'}</td>
                                <td style={td}>
                                    {b.meet_link ? (
                                        <a
                                            href={b.meet_link}
                                            target="_blank"
                                            rel="noreferrer"
                                            style={{ color: '#FF003C', textDecoration: 'underline', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem' }}
                                        >
                                            JOIN MEET →
                                        </a>
                                    ) : (
                                        <span style={{ color: '#444444' }}>—</span>
                                    )}
                                </td>
                                <td style={td}>
                                    <span style={{ color: STATUS_COLORS[b.status] || '#fff', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.1em' }}>
                                        {b.status}
                                    </span>
                                </td>
                                <td style={{ ...td, color: '#555555', whiteSpace: 'nowrap' }}>
                                    {formatDate(b.booked_at)}
                                </td>
                            </tr>
                        ))}
                        {bookings.length === 0 && (
                            <tr>
                                <td colSpan={7} style={{ ...td, textAlign: 'center', color: '#444444', padding: '2rem' }}>
                                    // NO BOOKINGS YET
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ── Main Admin Page ───────────────────────────────────────────────────────────

export default function Admin() {
    const [leads, setLeads] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem('admin_token');
        navigate('/admin/login', { replace: true });
    };

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const headers = getAuthHeader();
            const [leadsRes, bookingsRes] = await Promise.all([
                fetch('/api/admin/leads', { headers }),
                fetch('/api/admin/bookings', { headers }),
            ]);

            if (leadsRes.status === 401 || bookingsRes.status === 401) {
                sessionStorage.removeItem('admin_token');
                navigate('/admin/login', { replace: true });
                return;
            }

            const [leadsData, bookingsData] = await Promise.all([
                leadsRes.json(),
                bookingsRes.json(),
            ]);

            setLeads(leadsData.leads || []);
            setBookings(bookingsData.bookings || []);
        } catch (err) {
            setError('Failed to load data. Check console.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleLeadUpdate = async (id, updates) => {
        try {
            const res = await fetch('/api/admin/leads', {
                method: 'PATCH',
                headers: getAuthHeader(),
                body: JSON.stringify({ id, ...updates }),
            });

            if (res.status === 401) {
                sessionStorage.removeItem('admin_token');
                navigate('/admin/login', { replace: true });
                return;
            }

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            // Optimistic update — replace the lead in local state immediately
            setLeads(prev => prev.map(l => l.id === id ? data.lead : l));
        } catch (err) {
            console.error('Lead update failed:', err);
            alert(`Update failed: ${err.message}`);
        }
    };

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                background: '#030303',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'JetBrains Mono', monospace",
                color: '#FF003C',
                fontSize: '0.875rem',
                letterSpacing: '0.1em',
            }}>
                INITIALIZING CONTROL PANEL...
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#030303', padding: '2rem', color: '#FFFFFF' }}>

            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginBottom: '2rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid #333333',
            }}>
                <div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#FF003C', letterSpacing: '0.25em', marginBottom: '0.4rem' }}>
                        &gt; SYS.ADMIN.CRM_V1.0
                    </div>
                    <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', color: '#FFFFFF', margin: 0, letterSpacing: '0.05em' }}>
                        CONTROL PANEL
                    </h1>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                        onClick={fetchData}
                        style={{
                            background: 'transparent',
                            border: '1px solid #333333',
                            color: '#888888',
                            padding: '0.5rem 1rem',
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '0.7rem',
                            cursor: 'pointer',
                            letterSpacing: '0.1em',
                        }}
                    >
                        REFRESH
                    </button>
                    <button
                        onClick={handleLogout}
                        style={{
                            background: 'transparent',
                            border: '1px solid #FF003C',
                            color: '#FF003C',
                            padding: '0.5rem 1rem',
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '0.7rem',
                            cursor: 'pointer',
                            letterSpacing: '0.1em',
                        }}
                    >
                        LOGOUT
                    </button>
                </div>
            </div>

            {error && (
                <div style={{ fontFamily: "'JetBrains Mono', monospace", color: '#ff4444', marginBottom: '1.5rem', fontSize: '0.8rem' }}>
                    &gt; ERROR: {error}
                </div>
            )}

            <StatsBar leads={leads} bookings={bookings} />
            <LeadsTable leads={leads} onUpdate={handleLeadUpdate} />
            <BookingsTable bookings={bookings} />
        </div>
    );
}

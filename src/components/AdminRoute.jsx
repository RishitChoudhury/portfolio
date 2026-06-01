import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

// Decode JWT payload without verifying signature (verification happens server-side).
// Used only to check expiry client-side to avoid an unnecessary API round-trip.
function isTokenExpired(token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 < Date.now();
    } catch {
        return true; // malformed token — treat as expired
    }
}

export default function AdminRoute({ children }) {
    const [status, setStatus] = useState('checking'); // 'checking' | 'ok' | 'redirect'

    useEffect(() => {
        const token = sessionStorage.getItem('admin_token');
        if (!token || isTokenExpired(token)) {
            sessionStorage.removeItem('admin_token');
            setStatus('redirect');
        } else {
            setStatus('ok');
        }
    }, []);

    if (status === 'checking') {
        return (
            <div style={{
                background: '#030303',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'JetBrains Mono', monospace",
                color: '#FF003C',
                fontSize: '0.875rem',
                letterSpacing: '0.1em',
            }}>
                VERIFYING SESSION...
            </div>
        );
    }

    if (status === 'redirect') {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function AdminLogin() {
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'error'
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    // Skip login if already authenticated
    useEffect(() => {
        const token = sessionStorage.getItem('admin_token');
        if (token) navigate('/admin', { replace: true });
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMsg('');

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Authentication failed');

            sessionStorage.setItem('admin_token', data.token);
            navigate('/admin', { replace: true });
        } catch (err) {
            setStatus('error');
            setErrorMsg(err.message);
            setPassword('');
        }
    };

    return (
        <>
        <Helmet>
            <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        </Helmet>
        <div style={{
            minHeight: '100vh',
            background: '#030303',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
        }}>
            <div style={{
                border: '1px solid #FF003C',
                padding: '3rem',
                width: '100%',
                maxWidth: '400px',
                background: '#0a0a0a',
                boxShadow: '0 0 40px rgba(255, 0, 60, 0.1)',
            }}>
                <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.65rem',
                    color: '#FF003C',
                    letterSpacing: '0.25em',
                    marginBottom: '1.5rem',
                    textTransform: 'uppercase',
                }}>
                    &gt; SYS.ADMIN.AUTH_V1
                </div>

                <h1 style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '2.5rem',
                    color: '#FFFFFF',
                    margin: '0 0 2rem 0',
                    letterSpacing: '0.05em',
                }}>
                    ADMIN ACCESS
                </h1>

                <form onSubmit={handleSubmit}>
                    <label style={{
                        display: 'block',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '0.7rem',
                        color: '#888888',
                        letterSpacing: '0.15em',
                        marginBottom: '0.5rem',
                        textTransform: 'uppercase',
                    }}>
                        &gt; PASSPHRASE //
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoFocus
                        style={{
                            display: 'block',
                            width: '100%',
                            boxSizing: 'border-box',
                            background: '#030303',
                            border: '1px solid #333333',
                            color: '#FFFFFF',
                            padding: '0.75rem 1rem',
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '0.875rem',
                            outline: 'none',
                            marginBottom: '1.5rem',
                        }}
                        placeholder="••••••••••••"
                    />

                    {status === 'error' && (
                        <div style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '0.75rem',
                            color: '#ff4444',
                            marginBottom: '1rem',
                            padding: '0.75rem',
                            border: '1px solid #ff444433',
                            background: '#ff44440a',
                        }}>
                            &gt; ERROR: {errorMsg}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        style={{
                            width: '100%',
                            background: status === 'loading' ? 'transparent' : '#FF003C',
                            border: '1px solid #FF003C',
                            color: '#FFFFFF',
                            padding: '0.875rem',
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '0.8rem',
                            letterSpacing: '0.2em',
                            cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                            textTransform: 'uppercase',
                            opacity: status === 'loading' ? 0.6 : 1,
                            transition: 'background 0.2s',
                        }}
                    >
                        {status === 'loading' ? 'AUTHENTICATING...' : '[ INITIALIZE ACCESS ]'}
                    </button>
                </form>
            </div>
        </div>
        </>
    );
}

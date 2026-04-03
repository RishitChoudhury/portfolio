import React, { useState, useEffect } from 'react';
import './CyberContactForm.css';

const CyberContactForm = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        email: '',
        projectType: 'Web',
        description: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadingText, setLoadingText] = useState('');
    const [submitStatus, setSubmitStatus] = useState('idle'); // 'idle' | 'success' | 'error'
    const [errorMessage, setErrorMessage] = useState('');

    const loadingSequence = [
        '> INITIATING SECURE HANDSHAKE...',
        '> AUTHENTICATING CREDENTIALS...',
        '> BYPASSING FIREWALLS...',
        '> ESTABLISHING ENCRYPTED UPLINK...',
        '> TRANSMITTING DATA PACKET...'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');
        setErrorMessage('');

        // Run the loading animation
        for (let i = 0; i < loadingSequence.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 400));
            setLoadingText(loadingSequence[i]);
        }

        // Send the actual request
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Transmission failed');
            }

            setSubmitStatus('success');

            // Auto-close after showing success
            setTimeout(() => {
                handleReset();
                onClose();
            }, 3000);
        } catch (err) {
            setSubmitStatus('error');
            setErrorMessage(err.message || 'Connection lost. Please retry.');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleReset = () => {
        setIsSubmitting(false);
        setSubmitStatus('idle');
        setLoadingText('');
        setErrorMessage('');
        setFormData({ email: '', projectType: 'Web', description: '' });
    };

    const handleClose = () => {
        handleReset();
        onClose();
    };

    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="contact-modal-overlay">
            <div className="modal-backdrop" onClick={handleClose}></div>

            <div className="contact-console">
                {/* Close Button */}
                <button className="console-close mono" onClick={handleClose}>[X] ABORT</button>

                {/* Decorative Console Corner Reticles */}
                <div className="console-reticle top-left"></div>
                <div className="console-reticle top-right"></div>
                <div className="console-reticle bottom-left"></div>
                <div className="console-reticle bottom-right"></div>

                {/* System Label */}
                <div className="console-label mono">
                    SYS.COMMS.TERMINAL_V1.0
                </div>

                {!isSubmitting ? (
                    <form onSubmit={handleSubmit} className="console-form">
                        <h2 className="console-header mono">
                            Init Console <span className="caret-pulse">_</span>
                        </h2>

                        {/* Field: Professional Email */}
                        <div className="form-group">
                            <label htmlFor="email" className="mono input-label">
                                &gt; Professional Email //
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="console-input mono"
                                placeholder="operable@domain.sys"
                            />
                        </div>

                        {/* Field: Project Type */}
                        <div className="form-group">
                            <label htmlFor="projectType" className="mono input-label">
                                &gt; Project Type //
                            </label>
                            <div className="select-wrapper">
                                <select
                                    id="projectType"
                                    name="projectType"
                                    value={formData.projectType}
                                    onChange={handleChange}
                                    className="console-input select-input mono"
                                >
                                    <option value="Web">Web Engineering</option>
                                    <option value="Mobile">Mobile Architecture</option>
                                    <option value="Automation">System Automation</option>
                                    <option value="Integration">API & Integration</option>
                                </select>
                                <div className="select-arrow">▼</div>
                            </div>
                        </div>

                        {/* Field: Description */}
                        <div className="form-group">
                            <label htmlFor="description" className="mono input-label">
                                &gt; Description (The Bottleneck) //
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                required
                                rows="4"
                                value={formData.description}
                                onChange={handleChange}
                                className="console-input textarea-input mono"
                                placeholder="Detail the exact constraints and failure points of your current system..."
                            ></textarea>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="console-submit-btn mono">
                            TRANSMIT_DATA
                        </button>
                    </form>
                ) : submitStatus === 'success' ? (

                    /* Success State */
                    <div className="terminal-loading-state">
                        <h2 className="loading-header mono" style={{ color: '#00ff88' }}>
                            [TRANSMISSION COMPLETE]
                        </h2>
                        <div className="loading-sequence mono">
                            <div className="loading-line" style={{ color: '#00ff88' }}>
                                &gt; DATA PACKET DELIVERED SUCCESSFULLY
                            </div>
                            <div className="loading-line" style={{ color: '#00ff88', marginTop: '8px' }}>
                                &gt; EXPECT RESPONSE WITHIN 24-48 HOURS
                            </div>
                            <div className="loading-line" style={{ color: '#555', marginTop: '16px' }}>
                                // Terminal will auto-close...
                            </div>
                        </div>
                    </div>

                ) : submitStatus === 'error' ? (

                    /* Error State */
                    <div className="terminal-loading-state">
                        <h2 className="loading-header mono" style={{ color: '#ff4444' }}>
                            [TRANSMISSION FAILED]
                        </h2>
                        <div className="loading-sequence mono">
                            <div className="loading-line" style={{ color: '#ff4444' }}>
                                &gt; ERROR: {errorMessage}
                            </div>
                            <div className="loading-line" style={{ color: '#888', marginTop: '8px' }}>
                                &gt; UPLINK INTERRUPTED. RETRY RECOMMENDED.
                            </div>
                        </div>
                        <button
                            className="console-submit-btn mono"
                            style={{ marginTop: '24px' }}
                            onClick={handleReset}
                        >
                            RETRY_TRANSMISSION
                        </button>
                    </div>

                ) : (

                    /* Terminal Loading State */
                    <div className="terminal-loading-state">
                        <h2 className="loading-header mono">
                            [PROCESSING REQUEST]
                        </h2>
                        <div className="loading-sequence mono">
                            {loadingSequence.slice(0, loadingSequence.indexOf(loadingText) + 1).map((text, idx) => (
                                <div key={idx} className="loading-line">
                                    {text}
                                </div>
                            ))}
                            <span className="caret-pulse block-caret mt-4"></span>
                        </div>
                    </div>

                )}
            </div>
        </div>
    );
};

export default CyberContactForm;

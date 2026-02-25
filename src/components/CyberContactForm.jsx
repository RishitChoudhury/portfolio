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

    const loadingSequence = [
        '> INITIATING SECURE HANDSHAKE...',
        '> AUTHENTICATING CREDENTIALS...',
        '> BYPASSING FIREWALLS...',
        '> ESTABLISHING ENCRYPTED UPLINK...',
        '> CONNECTION SECURED. REDIRECTING...'
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        let step = 0;
        const interval = setInterval(() => {
            setLoadingText(loadingSequence[step]);
            step++;
            if (step >= loadingSequence.length) {
                clearInterval(interval);
                setTimeout(() => {
                    // Replace with actual Calendly link
                    window.location.href = 'https://calendly.com/';
                }, 400);
            }
        }, 400);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
            <div className="modal-backdrop" onClick={onClose}></div>

            <div className="contact-console">
                {/* Close Button */}
                <button className="console-close mono" onClick={onClose}>[X] ABORT</button>

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

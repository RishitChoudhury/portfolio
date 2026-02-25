import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';
import './Footer.css';

const Footer = ({ onOpenContact }) => {
    return (
        <footer id="contact" className="footer-section">
            <div className="footer-gradient-overlay"></div>

            <div className="container footer-content">

                <div className="footer-cta-container">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="cta-text-block"
                    >
                        <h2 className="massive-cta headline brutalist-text-shadow">
                            ENOUGH
                            <br />
                            TALKING
                        </h2>
                        <div className="cta-action-row">
                            <span className="cta-subtext mono">WANT TO SEE OUR SYSTEMS IN ACTION?</span>
                            <button onClick={onOpenContact} className="btn-primary huge glow-on-hover" style={{ cursor: 'pointer', fontFamily: 'var(--font-headline)' }}>
                                INITIATE_PROTOCOL
                            </button>
                        </div>
                    </motion.div>
                </div>

                <div className="footer-bottom-grid">
                    <div className="footer-brand">
                        <h3 className="headline brand-logo">NUEVA<span className="accent">/</span>SYSTEMS</h3>
                        <p className="copyright mono">© 2026 / ALL SYSTEMS NOMINAL</p>
                    </div>

                    <div className="footer-links-group">
                        <h4 className="footer-label mono">LOCATION</h4>
                        <ul className="footer-list mono">
                            <li><span className="accent">📍</span> Pune, India</li>
                        </ul>
                    </div>

                    <div className="footer-links-group">
                        <h4 className="footer-label mono">CONNECT</h4>
                        <ul className="footer-list social-list mono">
                            <li>
                                <a href="#" className="social-link">
                                    <Github size={16} /> GitHub / Source
                                </a>
                            </li>
                            <li>
                                <a href="#" className="social-link">
                                    <Linkedin size={16} /> LinkedIn / Net
                                </a>
                            </li>
                            <li>
                                <a href="mailto:rishitchoudhury@gmail.com" className="social-link">
                                    <Mail size={16} /> rishitchoudhury@gmail.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;

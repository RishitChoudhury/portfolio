import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './CaseStudyShapingHearts.css';

const CaseStudyShapingHearts = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="case-study-container">
            {/* Navigation / Back Button */}
            <div className="cs-nav">
                <Link to="/" className="cs-back-btn mono">
                    <span className="accent">&lt;</span> return_to_system_root
                </Link>
            </div>

            <main className="cs-main">
                {/* Header Section */}
                <header className="cs-header">
                    <motion.div 
                        className="cs-header-badge mono"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        [ ARCHIVE_RECORD // 2026 ]
                    </motion.div>
                    
                    <motion.h1 
                        className="cs-title headline brutalist-text-shadow"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        SHAPING HEARTS
                        <br/>
                        <span className="cs-subtitle">REVOLUTIONIZING EVENT & SUBMISSION MANAGEMENT</span>
                    </motion.h1>

                    <motion.div 
                        className="cs-meta-grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="cs-meta-item">
                            <span className="cs-meta-label mono">CLIENT_ID:</span>
                            <span className="cs-meta-value">Shaping Hearts</span>
                        </div>
                        <div className="cs-meta-item">
                            <span className="cs-meta-label mono">SERVICES:</span>
                            <span className="cs-meta-value">Full-Stack Web Development, Architecture Design, Automated Workflows</span>
                        </div>
                        <div className="cs-meta-item">
                            <span className="cs-meta-label mono">TECH_STACK:</span>
                            <span className="cs-meta-value accent">Next.js | NestJS | Prisma ORM | PostgreSQL | Docker | NextAuth | NodeMailer</span>
                        </div>
                    </motion.div>
                </header>

                <div className="cs-grid">
                    {/* Main Content Area */}
                    <div className="cs-content">
                        
                        <section className="cs-section">
                            <h2 className="cs-section-title headline">EXECUTIVE SUMMARY</h2>
                            <p className="cs-text">
                                Shaping Hearts required a robust, modern digital ecosystem to smoothly manage their massive influx of artwork submissions, live performance bookings, and booth market registrations. Our agency stepped in to design and build a multi-portal architecture that segregates artist-facing workflows from complex internal administrative capabilities, ultimately delivering a seamless, automated, and secure digital platform.
                            </p>
                        </section>

                        <section className="cs-section">
                            <h2 className="cs-section-title headline">THE CHALLENGE</h2>
                            <p className="cs-text">
                                Managing a large-scale event involves a massive administrative overhead. Shaping Hearts struggled with manual tracking of artwork submissions, varying pricing rules, applicant statuses, and booth assignments. They needed a holistic system capable of:
                            </p>
                            <ul className="cs-list">
                                <li>Allowing artists to apply, modify, and submit their artwork, performance slots, and booth requirements seamlessly.</li>
                                <li>Equipping administrators with a comprehensive dashboard to review, approve, reject, or request modifications for submissions.</li>
                                <li>Executing an automated, status-driven workflow that kept participants engaged without manual email outreach.</li>
                            </ul>
                        </section>

                        <section className="cs-section">
                            <h2 className="cs-section-title headline">OUR SOLUTION</h2>
                            <p className="cs-text">
                                We architected a fully scalable <span className="accent">Three-Tier System</span> that broke down the complex workflow into manageable, secure, and user-centric portals.
                            </p>

                            <div className="cs-architecture-block">
                                <h3 className="cs-sub-title headline">1. The Artist & Agency Portal (Next.js)</h3>
                                <p className="cs-text-small">
                                    A public-facing portal meticulously designed for user accessibility.
                                </p>
                                <ul className="cs-list secondary">
                                    <li><strong>Multi-Step Onboarding:</strong> Complete with OTP verifications and seamless Google OAuth support via NextAuth.</li>
                                    <li><strong>Dynamic Pricing Engine:</strong> A custom submission engine specifically catering to nuanced artwork pricing rules (including dynamic validation rules such as minimum limits on varying tiers).</li>
                                    <li><strong>Compliance & Security:</strong> Seamless integrated Terms & Conditions approval checkpoints integrated elegantly within the user journey, ensuring legal rigor before finalized submissions while still allowing "draft" saves.</li>
                                </ul>
                            </div>

                            <div className="cs-architecture-block">
                                <h3 className="cs-sub-title headline">2. The Internal Administrator Dashboard (Next.js)</h3>
                                <p className="cs-text-small">
                                    We empowered the event team with a high-performance administration dashboard.
                                </p>
                                <ul className="cs-list secondary">
                                    <li><strong>Complex Record Management:</strong> A 360-degree view of all Users, Submissions, Artworks, Performances, and Booth registrations.</li>
                                    <li><strong>State-Machine Operations:</strong> Administrators can change states instantly with one click, shifting submissions through a meticulously designed funnel.</li>
                                </ul>
                            </div>

                            <div className="cs-architecture-block">
                                <h3 className="cs-sub-title headline">3. Core API & Database Engine</h3>
                                <p className="cs-text-small mono opacity-75">NestJS + Prisma + PostgreSQL</p>
                                <p className="cs-text-small" style={{marginTop: '0.5rem'}}>
                                    Underpinning this beautiful frontend is a heavy-duty microkernel architecture.
                                </p>
                                <ul className="cs-list secondary">
                                    <li><strong>Automated Workflow Automation:</strong> Built a fully integrated state machine <span className="mono cs-state">(DRAFT ➔ PENDING ➔ APPROVED / REJECTED / MODIFICATION_REQUESTED ➔ PUBLISHED)</span>.</li>
                                    <li><strong>Transactional Triggers:</strong> Every shift in submission status automatically interfaces with an SMTP mailer pipeline to instantly notify the user, massively cutting down admin manual labor.</li>
                                    <li><strong>Google API Integrations:</strong> Successfully bridged real-time Google Calendar availability, seamlessly provisioning programmatic Google Meet environments for any required reviews.</li>
                                </ul>
                            </div>
                        </section>

                        <section className="cs-section">
                            <h2 className="cs-section-title headline">CONCLUSION</h2>
                            <p className="cs-text">
                                The Shaping Hearts Event Platform is a prime showcase of our agency's ability to take disjointed, real-world administrative nightmares and transform them into a sleek, fast, and remarkably reliable web ecosystem. By harnessing Next.js on the frontend and NestJS on the backend, we delivered an enterprise-grade utility that will scale with their events for years.
                            </p>
                        </section>
                    </div>

                    {/* Sidebar / Stats */}
                    <aside className="cs-sidebar">
                        <div className="cs-stats-card glow-on-hover">
                            <h3 className="cs-stats-title mono">KEY HIGHLIGHTS & RESULTS</h3>
                            <div className="cs-stat-item">
                                <div className="cs-stat-number headline">85<span className="accent">%</span></div>
                                <div className="cs-stat-desc mono">Reduced Administrative Friction via workflow automation and nodemailing pipelines.</div>
                            </div>
                            
                            <hr className="cs-divider" />
                            
                            <div className="cs-stat-item">
                                <div className="cs-stat-number headline accent">0<span style={{color: 'var(--text-primary)'}}> DOWNTIME</span></div>
                                <div className="cs-stat-desc mono">Fault-Tolerant, scalable deployments hand-rolled via Docker Compose arrays.</div>
                            </div>
                            
                            <hr className="cs-divider" />
                            
                            <div className="cs-stat-item">
                                <div className="cs-stat-number headline">1000<span className="accent">+</span></div>
                                <div className="cs-stat-desc mono">Diverse creative assets onboarded seamlessly through a flawless UI/UX execution.</div>
                            </div>
                        </div>

                        <div className="cs-wireframe-box">
                            <div className="reticle top-left"></div>
                            <div className="reticle top-right"></div>
                            <div className="reticle bottom-left"></div>
                            <div className="reticle bottom-right"></div>
                            <div className="cs-wire-inner mono text-center pt-2">
                                <div className="accent mb-1">[ SYSTEM_STATUS ]</div>
                                OPERATIONAL
                                <br />
                                VERSION: 1.0.0
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
};

export default CaseStudyShapingHearts;

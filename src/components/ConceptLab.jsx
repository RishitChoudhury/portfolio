import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './ConceptLab.css';

const ConceptLab = () => {
    const [activeStat, setActiveStat] = useState(0);

    const stats = [
        { label: 'INFRASTRUCTURE UPTIME', value: '99.999%', detail: 'Across all managed deployments globally.' },
        { label: 'SYSTEMS ARCHITECTED', value: '142+', detail: 'From monolithic enterprise to agile Web3.' },
        { label: 'PEAK THROUGHPUT', value: '10M/s', detail: 'Events processed during stress simulations.' }
    ];

    return (
        <section id="about" className="concept-lab-section">
            <div className="container">
                <div className="lab-grid">

                    {/* Editorial Content Side */}
                    <div className="lab-editorial">
                        <div className="section-eyebrow mono">
                            <span className="accent">/</span> STUDIO_CULTURE
                        </div>

                        <h2 className="headline brutalist-text-shadow lab-headline">
                            RUTHLESS
                            <br />
                            EFFICIENCY.
                            <br />
                            ZERO
                            <br />
                            BULLSHIT.
                        </h2>

                        <motion.div
                            className="founder-quote-box"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="quote-mark headline">"</div>
                            <p className="quote-text">
                                Stop building fragile monoliths based on hypothetical scaling.
                                We engineer resilient technological backbones that survive
                                first contact with actual users.
                            </p>
                            <div className="quote-author mono">
                                -- N. VANE <span className="accent">/</span> LEAD ARCHITECT
                            </div>
                        </motion.div>
                    </div>

                    {/* Interactive Stats Side */}
                    <div className="lab-stats-container">
                        <div className="wireframe-container overlay-grid">

                            <div className="stats-selector">
                                {stats.map((stat, i) => (
                                    <button
                                        key={i}
                                        className={`stat-btn mono ${activeStat === i ? 'active' : ''}`}
                                        onClick={() => setActiveStat(i)}
                                    >
                                        [STAT_{i + 1}]
                                    </button>
                                ))}
                            </div>

                            <div className="stat-display-area">
                                <motion.div
                                    key={activeStat}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="active-stat-content"
                                >
                                    <div className="stat-value headline">{stats[activeStat].value}</div>
                                    <div className="stat-label mono">{stats[activeStat].label}</div>
                                    <div className="stat-detail">{stats[activeStat].detail}</div>
                                </motion.div>
                            </div>

                            {/* Decorative Data Visualizer */}
                            <div className="data-visualizer">
                                {[...Array(20)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="data-bar"
                                        animate={{ height: ['20%', '100%', '40%'] }}
                                        transition={{ duration: 1.5 + Math.random(), repeat: Infinity, ease: "easeInOut" }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ConceptLab;

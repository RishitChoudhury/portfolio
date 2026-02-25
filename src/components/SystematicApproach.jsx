import React from 'react';
import { motion } from 'framer-motion';
import './SystematicApproach.css';

const steps = [
    {
        num: '01',
        title: 'AUDIT & DISCOVERY',
        desc: 'Deep structural analysis of existing constraints and operational fail points.'
    },
    {
        num: '02',
        title: 'ARCHITECTURE & SPRINTING',
        desc: 'Defining scalable topologies followed by rapid, relentless engineering iteration.'
    },
    {
        num: '03',
        title: 'INTEGRATION & AUTOMATION',
        desc: 'Connecting disparate nodes and automating CI/CD pipelines for maximum velocity.'
    },
    {
        num: '04',
        title: 'DEPLOYMENT & STABILIZATION',
        desc: 'Zero-downtime orchestration and sustained infrastructural resilience.'
    }
];

const SystematicApproach = () => {
    return (
        <section id="process" className="systematic-section">
            <div className="container">
                <div className="section-header">
                    <div className="section-eyebrow mono">
                        <span className="accent">/</span> HOW_WE_OPERATE
                    </div>
                    <h2 className="headline brutalist-text-shadow">PROCESS ENGINEERING</h2>
                </div>

                <div className="horizontal-timeline">
                    <div className="timeline-track-line"></div>

                    <div className="timeline-grid">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.num}
                                className="timeline-node"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-10%' }}
                                transition={{ delay: index * 0.15, duration: 0.6 }}
                            >
                                <div className="node-marker">
                                    <div className="node-dot"></div>
                                </div>

                                <div className="node-content">
                                    <div className="node-num headline">{step.num}</div>
                                    <h3 className="node-title headline">{step.title}</h3>
                                    <p className="node-desc">{step.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SystematicApproach;

import React from 'react';
import { motion } from 'framer-motion';
import { Server, Code2, Smartphone, Cpu } from 'lucide-react';
import './Capabilities.css';

const capabilities = [
    {
        id: '01',
        icon: <Code2 size={32} />,
        title: 'FULL-STACK DEVELOPMENT',
        desc: 'High-performance web applications built on modern React architectures with robust backend layers.'
    },
    {
        id: '02',
        icon: <Server size={32} />,
        title: 'SYSTEM AUTOMATION',
        desc: 'Intelligent workflows and CI/CD pipelines that eliminate manual operational overhead.'
    },
    {
        id: '03',
        icon: <Smartphone size={32} />,
        title: 'MOBILE ENGINEERING',
        desc: 'Native-feel applications extending your digital infrastructure to high-engagement platforms.'
    },
    {
        id: '04',
        icon: <Cpu size={32} />,
        title: 'API & MIDDLEWARE',
        desc: 'Resilient connective tissue integrating disparate systems into unified operational fabrics.'
    }
];

const Capabilities = () => {
    return (
        <section id="capabilities" className="capabilities-section">
            <div className="container">
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                >
                    <div className="section-eyebrow mono">
                        <span className="accent">/</span> WHAT_WE_DO
                    </div>
                    <h2 className="headline">CORE CAPABILITIES</h2>
                </motion.div>

                <div className="capabilities-grid">
                    {capabilities.map((cap, index) => (
                        <motion.div
                            key={cap.id}
                            className="cap-card"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ delay: index * 0.15, duration: 0.6 }}
                        >
                            <div className="cap-card-header mono">
                                <span>// CAP_{cap.id}</span>
                                <div className="cap-icon">{cap.icon}</div>
                            </div>
                            <h3 className="cap-title headline">{cap.title}</h3>
                            <p className="cap-desc">{cap.desc}</p>
                            <div className="cap-card-footer mono">
                                <span className="read-more">EXPLORE [→]</span>
                            </div>
                            {/* Hover glow element */}
                            <div className="cap-glow"></div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Capabilities;

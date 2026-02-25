import React from 'react';
import { motion } from 'framer-motion';
import './TechStack.css';

const stackData = {
    Engineering: ['React / Next.js', 'Typescript', 'Go', 'Python / Django', 'GraphQL / tRPC'],
    Infrastructure: ['AWS / GCP', 'Kubernetes', 'Terraform', 'Docker', 'PostgreSQL / Redis'],
    Integrations: ['Stripe / Plaid', 'Twilio API', 'Webhooks UI', 'Kafka', 'Datadog']
};

const TechStack = () => {
    return (
        <section id="stack" className="tech-stack-section">
            <div className="container">
                <div className="section-header">
                    <div className="section-eyebrow mono">
                        <span className="accent">/</span> SYS_REQUIREMENTS
                    </div>
                    <h2 className="headline">TECHNICAL STACK</h2>
                </div>

                <div className="terminal-container">
                    <div className="terminal-header mono">
                        <span className="term-dot red"></span>
                        <span className="term-dot yellow"></span>
                        <span className="term-dot green"></span>
                        <span className="term-title">nueva@systema: ~/stack.config</span>
                    </div>

                    <div className="terminal-body mono">
                        {Object.entries(stackData).map(([category, items], i) => (
                            <motion.div
                                className="stack-block"
                                key={category}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                            >
                                <div className="stack-category">
                                    <span className="accent prompt">❯</span> cat {category.toLowerCase()}.json
                                </div>
                                <div className="stack-items grid">
                                    {items.map((item, j) => (
                                        <motion.div
                                            key={item}
                                            className="stack-item"
                                            initial={{ opacity: 0 }}
                                            whileInView={{ opacity: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: (i * 0.2) + (j * 0.1) }}
                                        >
                                            [{item}]
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}

                        <motion.div
                            className="terminal-cursor"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                        >
                            <span className="accent prompt">❯</span> █
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TechStack;

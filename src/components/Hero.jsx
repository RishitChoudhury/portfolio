import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Marquee from './Marquee';
import './Hero.css';

const Hero = () => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 800], [0, 200]);
    const y2 = useTransform(scrollY, [0, 800], [0, -100]);
    const opacity = useTransform(scrollY, [0, 400], [1, 0]);

    return (
        <>
            <section className="hero-section">
                {/* CRT Scanline overlay effect just for Hero */}
                <div className="hero-scanline-overlay"></div>
                <div className="hero-grid-overlay"></div>

                <div className="container hero-content">
                    <motion.div
                        className="hero-text-wrapper"
                        style={{ y: y1, opacity }}
                    >
                        <div className="hero-eyebrow mono">
                            <span className="bracket">[</span> INIT_SEQUENCE_01 <span className="bracket">]</span>
                        </div>

                        <h1 className="hero-headline brutalist-text-shadow">
                            WE BUILD
                            <br />
                            <span className="accent">SCALABLE</span> SYSTEMS.
                            <br />
                            NOT JUST
                            <br />
                            WEBSITES.
                        </h1>

                        <div className="hero-bottom-cluster">
                            <motion.p
                                className="hero-subtext"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1, delay: 0.8 }}
                            >
                                Engineering digital infrastructure for organizations that demand absolute reliability,
                                extreme performance, and unapologetic aesthetic dominance.
                            </motion.p>

                            <motion.div
                                className="hero-cta-group"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 1 }}
                            >
                                <a href="#work" className="btn-primary mono glow-on-hover">Explore Our Work</a>
                                <a href="#contact" className="btn-secondary mono">Work With Us</a>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Abstract Cyberpunk Mascot/Object */}
                    <motion.div
                        className="hero-abstract-hologram"
                        style={{ y: y2 }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                    >
                        <div className="wireframe-cube">
                            <div className="cube-face front"></div>
                            <div className="cube-face back"></div>
                            <div className="cube-face right"></div>
                            <div className="cube-face left"></div>
                            <div className="cube-face top"></div>
                            <div className="cube-face bottom"></div>
                        </div>
                        <div className="hologram-glow"></div>
                    </motion.div>

                    {/* Decorative elements */}
                    <motion.div
                        className="hero-decoration crosshair-tl"
                        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1, duration: 0.5 }}
                    />
                    <motion.div
                        className="hero-decoration crosshair-br"
                        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2, duration: 0.5 }}
                    />
                </div>
            </section>

            {/* Marquee Divider bridging Hero to next section */}
            <Marquee text="SYSTEMS ENGINEERING" speed={25} direction="left" />
            <div style={{ height: '4px' }}></div>
            <Marquee text="NUEVA_INIT(//)" speed={35} direction="right" />
        </>
    );
};

export default Hero;

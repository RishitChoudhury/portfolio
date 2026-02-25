import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Navbar.css';

const Navbar = ({ onOpenContact }) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.nav
            className={`navbar ${scrolled ? 'scrolled' : ''}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
            <div className="navbar-container">
                <div className="nav-brand">
                    <span className="headline">NUEVA<span className="accent">/</span>SYSTEMA</span>
                </div>

                <div className="nav-links mono">
                    <a href="#work" className="nav-link">Work</a>
                    <a href="#capabilities" className="nav-link">Capabilities</a>
                    <a href="#process" className="nav-link">Process</a>
                    <a href="#stack" className="nav-link">Stack</a>
                </div>

                <button
                    onClick={onOpenContact}
                    className="nav-cta headline glow-on-hover"
                    style={{ display: 'flex', alignItems: 'center' }}
                >
                    START A PROJECT
                </button>
            </div>
        </motion.nav>
    );
};

export default Navbar;

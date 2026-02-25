import React from 'react';
import { motion } from 'framer-motion';
import './Marquee.css';

const Marquee = ({ text, speed = 20, direction = 'left' }) => {
    return (
        <div className="marquee-container">
            <div className="marquee-borders top-border"></div>

            <div className={`marquee-content ${direction}`}>
                <div className="marquee-track" style={{ animationDuration: `${speed}s` }}>
                    {/* We duplicate the text multiple times to create the infinite scroll effect */}
                    {[...Array(6)].map((_, i) => (
                        <span key={i} className="marquee-text headline">
                            {text} <span className="accent">/</span>
                        </span>
                    ))}
                </div>
                <div className="marquee-track" style={{ animationDuration: `${speed}s` }}>
                    {[...Array(6)].map((_, i) => (
                        <span key={`dup-${i}`} className="marquee-text headline">
                            {text} <span className="accent">/</span>
                        </span>
                    ))}
                </div>
            </div>

            <div className="marquee-borders bottom-border"></div>
        </div>
    );
};

export default Marquee;

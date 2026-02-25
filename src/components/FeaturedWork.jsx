import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './FeaturedWork.css';

const projects = [
    {
        id: '01',
        title: 'SANKALP NGO PLATFORM',
        tag: 'WORKFLOW OPTIMIZATION',
        summary: 'Engineered a centralized web platform integrated with an automated document generation engine. This system shifted the organization from a manual, email-heavy workflow to a self-service digital model.',
        wins: ['Instant certificate verification & download', 'Deployed high-performance global web presence', 'Automated repetitive data handling'],
        metric: '100%',
        metricLabel: 'Manual Labor Reduction',
        buttonText: 'VIEW_CASE_STUDY',
        link: 'https://www.thesankalp.org',
        videoUrl: 'https://leefalk9yd9m859v.public.blob.vercel-storage.com/sankalp.mp4'
    },
    {
        id: '02',
        title: 'SHAPING HEARTS PLATFORM',
        tag: 'FULL-STACK ARCHITECTURE',
        summary: 'Developed a dual-portal system for the Neo Kah Kiat Arts Awards 2026, comprising a Next.js artist submission platform and an administrative dashboard. Solved complex artwork pricing and review workflows through a robust Prisma and PostgreSQL backend.',
        wins: [
            'Automated dynamic artwork pricing engine',
            'Streamlined admin review and custom filtering workflows',
            'Containerized zero-downtime deployment setup'
        ],
        metric: '100%',
        metricLabel: 'Type-Safe Architecture',
        buttonText: 'VIEW_PLATFORM',
        link: 'https://github.com/RishitChoudhury/shaping-hearts.git'
    }
];

const ProjectCard = ({ project }) => {
    const cardRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start end", "end start"]
    });

    const parallaxY = useTransform(scrollYProgress, [0, 1], [50, -50]);

    return (
        <div className="project-card" ref={cardRef}>

            <div className="project-visual">
                {project.videoUrl ? (
                    <motion.video
                        src={project.videoUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="project-video-inner"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.5 }}
                    />
                ) : (
                    <motion.div
                        className="project-image-inner"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.5 }}
                    />
                )}
                {/* Wireframe reticle overlays */}
                <div className="blueprint-overlay">
                    <div className="reticle top-left"></div>
                    <div className="reticle top-right"></div>
                    <div className="reticle bottom-left"></div>
                    <div className="reticle bottom-right"></div>
                </div>
            </div>

            <motion.div
                className="project-info"
                style={{ y: parallaxY }}
            >
                <div className="project-header">
                    <div className="project-tag mono">[{project.tag}]</div>
                    <div className="project-id mono">SYS_{project.id}</div>
                </div>

                <h3 className="project-title headline">{project.title}</h3>
                <p className="project-summary">{project.summary}</p>

                <div className="project-stats-grid">
                    <div className="project-impact">
                        <div className="impact-metric headline">{project.metric}</div>
                        <div className="impact-label mono">{project.metricLabel}</div>
                    </div>

                    <div className="project-engineering">
                        <div className="eng-label mono">WINS <span className="accent">/</span></div>
                        <ul className="eng-list">
                            {project.wins.map((win, i) => (
                                <li key={i}><span className="accent">+</span> {win}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {project.link ? (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn-outline mono project-btn" style={{ textDecoration: 'none', display: 'inline-block', textAlign: 'center' }}>
                        {project.buttonText || 'VIEW_ARCHITECTURE'}
                    </a>
                ) : (
                    <button className="btn-outline mono project-btn">{project.buttonText || 'VIEW_ARCHITECTURE'}</button>
                )}
            </motion.div>
        </div>
    );
};

const FeaturedWork = () => {
    return (
        <section id="work" className="featured-work-section">
            <div className="container">
                <div className="section-header">
                    <div className="section-eyebrow mono">
                        <span className="accent">/</span> PROOF_OF_WORK
                    </div>
                    <h2 className="headline brutalist-text-shadow">FEATURED SYSTEMS</h2>
                </div>

                <div className="projects-container">
                    {projects.map((project, i) => (
                        <ProjectCard key={project.id} project={project} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedWork;

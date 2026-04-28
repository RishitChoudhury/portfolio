import React from 'react';

// Components
import SEO from '../components/SEO';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Capabilities from '../components/Capabilities';
import FeaturedWork from '../components/FeaturedWork';
import SystematicApproach from '../components/SystematicApproach';
import TechStack from '../components/TechStack';
import Footer from '../components/Footer';
import CyberContactForm from '../components/CyberContactForm';

const HOME_JSON_LD = [
    {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Syntaxt",
        "url": "https://www.syntaxt.dev",
        "logo": "https://www.syntaxt.dev/og-image.jpg",
        "description": "Syntaxt builds custom fullstack web apps, mobile apps, and business automation solutions.",
        "sameAs": [
            "https://github.com/syntaxt",
            "https://linkedin.com/company/syntaxt"
        ]
    },
    {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Syntaxt",
        "url": "https://www.syntaxt.dev",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://www.syntaxt.dev/?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    }
];

function Home() {
    const [isContactOpen, setIsContactOpen] = React.useState(false);

    return (
        <div className="app-container">
            <SEO
                title="Syntaxt | Custom Fullstack Development & Automation"
                description="Syntaxt builds custom fullstack web apps, mobile apps, and business automation solutions. Fast, modern, and built to scale."
                keywords="custom fullstack development, business automation solutions, mobile app development, custom software development, modern website building, next-gen web interfaces"
                jsonLd={HOME_JSON_LD}
            />
            <Navbar onOpenContact={() => setIsContactOpen(true)} />
            <Hero />
            <Capabilities />
            <FeaturedWork />
            <SystematicApproach />
            <TechStack />
            <Footer onOpenContact={() => setIsContactOpen(true)} />

            <CyberContactForm
                isOpen={isContactOpen}
                onClose={() => setIsContactOpen(false)}
            />
        </div>
    )
}

export default Home;

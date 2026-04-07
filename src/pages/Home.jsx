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

function Home() {
    const [isContactOpen, setIsContactOpen] = React.useState(false);

    return (
        <div className="app-container">
            <SEO 
                title="Syntaxt" 
                description="Custom fullstack development, mobile apps, and business automation solutions." 
                keywords="custom fullstack development, business automation solutions, mobile app development services, custom software development for businesses, modern website building, next-gen web interfaces" 
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

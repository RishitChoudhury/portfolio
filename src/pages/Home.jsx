import React from 'react';

// Components
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

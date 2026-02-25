import React, { useEffect } from 'react';

// Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Capabilities from './components/Capabilities';
import FeaturedWork from './components/FeaturedWork';
import SystematicApproach from './components/SystematicApproach';
import TechStack from './components/TechStack';
import ConceptLab from './components/ConceptLab';
import Footer from './components/Footer';
import CyberContactForm from './components/CyberContactForm';

function App() {
    const [isContactOpen, setIsContactOpen] = React.useState(false);

    // Custom Cursor
    useEffect(() => {
        const cursor = document.createElement('div');
        cursor.id = 'custom-cursor';
        document.body.appendChild(cursor);

        const moveCursor = (e) => {
            cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        };

        window.addEventListener('mousemove', moveCursor);
        return () => {
            window.removeEventListener('mousemove', moveCursor);
            cursor.remove();
        };
    }, []);

    return (
        <div className="app-container">
            <Navbar onOpenContact={() => setIsContactOpen(true)} />
            <Hero />
            <Capabilities />
            <FeaturedWork />
            <SystematicApproach />
            <TechStack />
            <ConceptLab />
            <Footer onOpenContact={() => setIsContactOpen(true)} />

            <CyberContactForm
                isOpen={isContactOpen}
                onClose={() => setIsContactOpen(false)}
            />
        </div>
    )
}

export default App;

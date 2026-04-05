import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import CyberScheduler from './pages/CyberScheduler';
import CaseStudyShapingHearts from './pages/CaseStudyShapingHearts';

function App() {
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
            if (document.body.contains(cursor)) {
                cursor.remove();
            }
        };
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/schedule" element={<CyberScheduler />} />
                <Route path="/case-study/shaping-hearts" element={<CaseStudyShapingHearts />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;

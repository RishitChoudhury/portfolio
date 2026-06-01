import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import CyberScheduler from './pages/CyberScheduler';
import CaseStudyShapingHearts from './pages/CaseStudyShapingHearts';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import WhatsAppButton from './components/WhatsAppButton';
import AdminRoute from './components/AdminRoute';

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
            <WhatsAppButton />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/schedule" element={<CyberScheduler />} />
                <Route path="/case-study/shaping-hearts" element={<CaseStudyShapingHearts />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;

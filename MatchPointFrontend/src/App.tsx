import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Upload from './pages/upload';
import Home from './pages/home';
import Contact from "./pages/contact.tsx";
import Footer from "./components/Footer.tsx";
import Header from "./components/Header.tsx";
import Feedback from "./pages/feedback.tsx";

const App: React.FC = () => {
    return (
        <Router>
            <div>
                <Header/>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
                <Footer/>
            </div>
        </Router>
    );
};

export default App;
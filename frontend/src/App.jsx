import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Portfolio Components
import Header from './pages/protfolio/Header';
import Hero from './pages/protfolio/Hero';
import About from './pages/protfolio/About';
import Education from './pages/protfolio/Education';
import Experience from './pages/protfolio/Experience';
import Skills from './pages/protfolio/Skills';
import Portfolio from './pages/protfolio/Portfolio';
import Pictures from './pages/protfolio/Pictures';
import References from './pages/protfolio/References';
import Footer from './pages/protfolio/Footer';

// Admin Components
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

// Debug Components
import Debugger from './pages/admin/Debugger';

// Global Styles
import './styles/globals.css';

const PortfolioHome = () => {
  useEffect(() => {
    // Create particles for background effect
    const createParticles = () => {
      const particlesContainer = document.createElement('div');
      particlesContainer.className = 'particles-container';
      document.body.appendChild(particlesContainer);
      
      const particleCount = 20;
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size between 20px and 120px
        const size = Math.random() * 100 + 20;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `${Math.random() * 100}vh`;
        
        // Random animation duration between 15s and 30s
        const duration = Math.random() * 15 + 15;
        particle.style.animationDuration = `${duration}s`;
        
        // Random animation delay
        particle.style.animationDelay = `${Math.random() * 10}s`;
        
        particlesContainer.appendChild(particle);
      }
    };
    
    createParticles();
    
    return () => {
      const particlesContainer = document.querySelector('.particles-container');
      if (particlesContainer) {
        particlesContainer.remove();
      }
    };
  }, []);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Education />
        <Experience />
        <Skills />
        <Portfolio />
        <Pictures />
        <References />
      </main>
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PortfolioHome />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/:username/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/debug" element={<Debugger />} />
      </Routes>
    </Router>
  );
};

export default App; 
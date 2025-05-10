import React, { useEffect } from 'react';
import Header from './protfolio/Header';
import Footer from './protfolio/Footer';
import Hero from './protfolio/Hero';
import About from './protfolio/About';
import Education from './protfolio/Education';
import Experience from './protfolio/Experience';
import Skills from './protfolio/Skills';
import Portfolio from './protfolio/Portfolio';
import Pictures from './protfolio/Pictures';
import References from './protfolio/References';
import styles from './PortfolioHome.module.css';

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
    <div className={styles.portfolioHome}>
      <Header />
      <main className={styles.main}>
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
    </div>
  );
};

export default PortfolioHome; 
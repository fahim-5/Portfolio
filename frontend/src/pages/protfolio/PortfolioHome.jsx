import React from 'react';

// Portfolio Components
import Header from './Header';
import Hero from './Hero';
import About from './About';
import Education from './Education';
import Experience from './Experience';
import Skills from './Skills';
import Portfolio from './Portfolio';
import Pictures from './Pictures';
import References from './References';

import './styles/globals.css'; 
import Footer from './Footer';

const PortfolioHome = () => {
  return (
    <div className="portfolio-container">
      <Header />
      <main className="content-wrapper">
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

import React, { useState, useEffect } from 'react';
import styles from './Header.module.css';
import portfolioService from '../../services/portfolioService';

const Header = () => {
  const [personalInfo, setPersonalInfo] = useState({
    name: 'Portfolio'
  });

  const loadPersonalInfo = () => {
    console.log('Loading header personal info...');
    // Try both 'personalInfo' and 'personal' section names for backward compatibility
    const data = portfolioService.getSectionData('personalInfo') || portfolioService.getSectionData('personal');
    
    if (data && data.name) {
      console.log('Header personal info loaded:', data.name);
      setPersonalInfo(data);
    }
  };

  // Load on mount
  useEffect(() => {
    loadPersonalInfo();
  }, []);

  // Listen for storage updates
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'portfolio_personal_info' || e.key === 'lastUpdate') {
        loadPersonalInfo();
      }
    };
    
    // Also listen for custom local data changed events
    const handleLocalDataChanged = (e) => {
      if (e.detail?.key === 'portfolio_personal_info') {
        loadPersonalInfo();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localDataChanged', handleLocalDataChanged);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localDataChanged', handleLocalDataChanged);
    };
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <h1>{personalInfo.name}</h1>
        </div>
        <nav>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#education">Education</a></li>
            <li><a href="#experience">Experience</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#portfolio">Portfolio</a></li>
            <li><a href="#references">References</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
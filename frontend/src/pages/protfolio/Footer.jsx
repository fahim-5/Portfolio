import React, { useState, useEffect } from 'react';
import styles from './Footer.module.css';
import { Link } from 'react-router-dom';
import portfolioService from '../../services/portfolioService';

const Footer = () => {
  const [socialLinks, setSocialLinks] = useState({
    linkedin: 'https://www.linkedin.com/',
    github: 'https://github.com/',
    twitter: 'https://twitter.com/',
    instagram: 'https://www.instagram.com/'
  });

  useEffect(() => {
    const loadSocialLinks = () => {
      const personalInfo = portfolioService.getSectionData('personalInfo') || portfolioService.getSectionData('personal');
      if (personalInfo && personalInfo.socialLinks) {
        setSocialLinks({
          ...socialLinks,
          ...personalInfo.socialLinks
        });
      }
    };

    loadSocialLinks();

    // Listen for storage updates
    const handleStorageChange = (e) => {
      if (e.key === 'portfolio_personal_info' || e.key === 'lastUpdate') {
        loadSocialLinks();
      }
    };
    
    // Also listen for custom local data changed events
    const handleLocalDataChanged = (e) => {
      if (e.detail?.key === 'portfolio_personal_info') {
        loadSocialLinks();
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
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} <span className={styles.adminLink}><Link to="/admin/login">Bafu</Link></span> All rights reserved.
          </p>
          
          <div className={styles.footerSocial}>
            <a href={socialLinks.linkedin} className={styles.socialIcon} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href={socialLinks.github} className={styles.socialIcon} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-github"></i>
            </a>
            <a href={socialLinks.twitter} className={styles.socialIcon} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
            <a href={socialLinks.instagram} className={styles.socialIcon} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
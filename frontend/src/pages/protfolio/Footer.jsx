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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFooterData = async () => {
      console.log('Loading footer data from database...');
      setLoading(true);
      
      try {
        // Fetch directly from database via API using the same method as Hero
        const data = await portfolioService.fetchHeroData();
        
        if (data && data.socialLinks) {
          console.log('Footer data fetched successfully from database:', data.socialLinks);
          setSocialLinks({
            ...socialLinks,
            ...data.socialLinks
          });
        } else {
          console.log('No social links data returned from database, falling back to localStorage');
          // Fall back to localStorage if API fails
          const localData = portfolioService.getSectionData('personalInfo') || portfolioService.getSectionData('personal');
          if (localData && localData.socialLinks) {
            setSocialLinks({
              ...socialLinks,
              ...localData.socialLinks
            });
          }
        }
      } catch (error) {
        console.error('Error fetching footer data from database:', error);
        setError(error.message);
        
        // Fall back to localStorage on error
        const localData = portfolioService.getSectionData('personalInfo') || portfolioService.getSectionData('personal');
        if (localData && localData.socialLinks) {
          setSocialLinks({
            ...socialLinks,
            ...localData.socialLinks
          });
        }
      } finally {
        setLoading(false);
      }
    };

    loadFooterData();

    // Listen for storage updates (for backward compatibility)
    const handleStorageChange = (e) => {
      if (e.key === 'portfolio_personal_info' || e.key === 'lastUpdate') {
        const localData = portfolioService.getSectionData('personalInfo') || portfolioService.getSectionData('personal');
        if (localData && localData.socialLinks) {
          setSocialLinks({
            ...socialLinks,
            ...localData.socialLinks
          });
        }
      }
    };
    
    // Also listen for custom local data changed events
    const handleLocalDataChanged = (e) => {
      if (e.detail?.key === 'portfolio_personal_info') {
        const localData = portfolioService.getSectionData('personalInfo') || portfolioService.getSectionData('personal');
        if (localData && localData.socialLinks) {
          setSocialLinks({
            ...socialLinks,
            ...localData.socialLinks
          });
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localDataChanged', handleLocalDataChanged);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localDataChanged', handleLocalDataChanged);
    };
  }, []);

  if (loading) {
    return (
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <p className={styles.copyright}>
              &copy; {new Date().getFullYear()} <span className={styles.adminLink}><Link to="/admin/login">Bafu</Link></span> All rights reserved.
            </p>
            <div className={styles.footerSocial}>
              <span>Loading social links...</span>
            </div>
          </div>
        </div>
      </footer>
    );
  }

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
import React, { useState, useEffect } from 'react';
import styles from './About.module.css';
import portfolioService from '../../services/portfolioService';

const About = () => {
  const [heroData, setHeroData] = useState({
    bio: '',
    aboutImageUrl: '',
    socialLinks: {
      linkedin: '',
      github: '',
      twitter: '',
      instagram: ''
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load hero data for the about section directly from the database
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('About component: Fetching hero data from database...');
        setLoading(true);
        
        // Use the portfolioService to fetch data from API only
        const data = await portfolioService.fetchHeroData();
        console.log('About component: Received hero data:', data);
        
        if (data) {
          console.log('About section fields:', {
            bio: data.bio,
            aboutImageUrl: data.aboutImageUrl
          });
          
          setHeroData(data);
        } else {
          setError('Failed to fetch data from database');
        }
      } catch (error) {
        console.error('Error loading about data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Split bio into paragraphs
  const bioParagraphs = heroData.bio ? heroData.bio.split('\n').filter(p => p.trim() !== '') : [];
 
  return (
    <section id="about" className={styles.about}>
      <div className={styles.container}>
        <div className={styles.profileSidebar}>
          <div className={styles.profileImage}>
            {heroData.aboutImageUrl ? (
              <img src={heroData.aboutImageUrl} alt="Profile" />
            ) : (
              <div className={styles.placeholderImage}></div>
            )}
          </div>
          
          <div className={styles.socialLinks}>
            {heroData.socialLinks.linkedin && (
              <a href={heroData.socialLinks.linkedin} className={styles.socialIcon} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin-in"></i>
              </a>
            )}
            {heroData.socialLinks.github && (
              <a href={heroData.socialLinks.github} className={styles.socialIcon} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-github"></i>
              </a>
            )}
            {heroData.socialLinks.twitter && (
              <a href={heroData.socialLinks.twitter} className={styles.socialIcon} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
            )}
            {heroData.socialLinks.instagram && (
              <a href={heroData.socialLinks.instagram} className={styles.socialIcon} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
            )}
          </div>
        </div>
        
        <div className={styles.aboutContent}>
          <h2 className={styles.sectionTitle}>About Me</h2>
          
          {loading ? (
            <p>Loading about information from database...</p>
          ) : error ? (
            <p>Error loading data: {error}</p>
          ) : bioParagraphs.length > 0 ? (
            bioParagraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))
          ) : (
            <p>No about information available.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default About; 
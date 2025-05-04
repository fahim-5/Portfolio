import React, { useState, useEffect } from 'react';
import styles from './About.module.css';
import profileImage from '../../assets/profile.jpg';
import portfolioService from '../../services/portfolioService';



const About = () => {
  const [aboutData, setAboutData] = useState({
    name: "John Doe",
    bio: "I am a passionate Full Stack Developer with 5+ years of experience in building web applications. My expertise spans across frontend and backend technologies, with a focus on creating responsive, user-friendly interfaces and robust server-side applications.",
    socialLinks: {
      linkedin: "https://www.linkedin.com/",
      github: "https://github.com/",
      twitter: "https://twitter.com/",
      instagram: "https://www.instagram.com/"
    },
    aboutImageUrl: null
  });

  useEffect(() => {
    const loadAboutData = () => {
      const personalInfo = portfolioService.getSectionData('personal');
      if (personalInfo) {
        setAboutData({
          name: personalInfo.name || aboutData.name,
          bio: personalInfo.bio || aboutData.bio,
          socialLinks: personalInfo.socialLinks || aboutData.socialLinks,
          aboutImageUrl: personalInfo.aboutImageUrl || null
        });
      }
    };

    loadAboutData();

    // Listen for storage updates
    const handleStorageChange = (e) => {
      if (e.key === 'portfolio_personal_info' || e.key === 'lastUpdate') {
        loadAboutData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Convert bio text to paragraphs
  const bioParagraphs = aboutData.bio.split('\n\n').filter(para => para.trim() !== '');

  return (
    <section id="about" className={styles.about}>
      <div className={styles.container}>
        <div className={styles.profileSidebar}>
          <div className={styles.profileImage}>
            <img src={aboutData.aboutImageUrl || profileImage} alt="Profile" />
          </div>
          
          <div className={styles.socialLinks}>
            {aboutData.socialLinks.linkedin && (
              <a href={aboutData.socialLinks.linkedin} className={styles.socialIcon} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin-in"></i>
              </a>
            )}
            {aboutData.socialLinks.github && (
              <a href={aboutData.socialLinks.github} className={styles.socialIcon} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-github"></i>
              </a>
            )}
            {aboutData.socialLinks.twitter && (
              <a href={aboutData.socialLinks.twitter} className={styles.socialIcon} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
            )}
            {aboutData.socialLinks.instagram && (
              <a href={aboutData.socialLinks.instagram} className={styles.socialIcon} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
            )}
          </div>
        </div>
        
        <div className={styles.aboutContent}>
          <h2 className={styles.sectionTitle}>About Me</h2>
          {bioParagraphs.length > 0 ? (
            bioParagraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))
          ) : (
            <p>
              I am a passionate Full Stack Developer with expertise in building web applications. 
              My skills span across frontend and backend technologies, focusing on creating 
              responsive, user-friendly interfaces and robust server-side applications.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default About; 
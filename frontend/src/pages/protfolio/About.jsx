import React, { useState, useEffect } from 'react';
import styles from './About.module.css';
import profileImage from '../../assets/profile.jpg';
import portfolioService from '../../services/portfolioService';



const About = () => {
 
 
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
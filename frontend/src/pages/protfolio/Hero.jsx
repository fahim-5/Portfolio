import React, { useState, useEffect } from 'react';
import styles from './Hero.module.css';
import profileImage from '../../assets/profile.jpg';
import portfolioService from '../../services/portfolioService';

const Hero = () => {
  const [heroData, setHeroData] = useState({
    greeting: "Hello, I'm",
    name: "John",
    lastName: "Doe",
    description: "I am a passionate developer with expertise in creating modern and responsive web applications. I specialize in frontend development with React, backend with Node.js, and database management.",
    jobTitle: "Full Stack Developer",
    stats: [
      { value: "5+", label: "Years Experience" },
      { value: "100+", label: "Projects Completed" },
      { value: "50+", label: "Happy Clients" }
    ],
    buttonText: "Get In Touch",
    profileImageUrl: null
  });
  
  const [showContactModal, setShowContactModal] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    email: 'example@example.com',
    phone: '+1234567890',
    location: 'Dhaka, Bangladesh',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/example',
      github: 'https://github.com/example',
      twitter: 'https://twitter.com/example',
      instagram: 'https://instagram.com/example'
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load hero data directly from database
  useEffect(() => {
    const loadHeroData = async () => {
      console.log('Loading hero data from database...');
      setLoading(true);
      
      try {
        // Fetch directly from database via API
        const data = await portfolioService.fetchHeroData();
        
        if (data) {
          console.log('Hero data fetched successfully from database:', data);
          setHeroData({
            greeting: data.greeting || "Hello, I'm",
            name: data.name || "John",
            lastName: data.lastName || "Doe",
            description: data.description || heroData.description,
            jobTitle: data.jobTitle || "Full Stack Developer",
            stats: data.stats || heroData.stats,
            buttonText: data.buttonText || "Get In Touch",
            profileImageUrl: data.profileImageUrl || null
          });
          
          setPersonalInfo({
            email: data.email || 'example@example.com',
            phone: data.phone || '+1234567890',
            location: data.location || 'Dhaka, Bangladesh',
            socialLinks: data.socialLinks || {
              linkedin: 'https://linkedin.com/in/example',
              github: 'https://github.com/example',
              twitter: 'https://twitter.com/example',
              instagram: 'https://instagram.com/example'
            }
          });
        } else {
          setError('Failed to fetch data from database');
        }
      } catch (error) {
        console.error('Error fetching hero data from database:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadHeroData();
  }, []);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const modal = document.querySelector(`.${styles.contactModal}`);
      if (modal && !modal.contains(event.target) && showContactModal) {
        setShowContactModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showContactModal]);

  if (loading) {
    return (
      <section id="home" className={styles.hero}>
        <div className={styles.container}>
          <p>Loading hero information from database...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="home" className={styles.hero}>
        <div className={styles.container}>
          <p>Error loading data: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="home" className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.heroContent}>
          <div className={styles.intro}>
            <h2>{heroData.greeting}</h2>
            <h1 className={styles.gradientText}>{heroData.name}</h1>
            <p>{heroData.description}</p>
            
            <div className={styles.stats}>
              {heroData.stats.map((stat, index) => (
                <div key={index} className={`${styles.statItem} ${styles.glassCard}`}>
                  <h3>{stat.value}</h3>
                  <p>{stat.label}</p>
                </div>
              ))}
            </div>
            
            <button 
              className={styles.btn} 
              onClick={() => setShowContactModal(true)}
            >
              {heroData.buttonText}
            </button>
          </div>
          
          <div className={styles.heroImage}>
            <img 
              src={heroData.profileImageUrl} 
              alt={heroData.name} 
              onError={(e) => {
                console.log('Hero image failed to load, using default');
                e.target.src = profileImage;
              }}
            />
            <div className={styles.caption}>{heroData.jobTitle}</div>
          </div>
        </div>
      </div>
      
      {/* Contact Modal/Popup */}
      {showContactModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.contactModal}>
            <button className={styles.closeButton} onClick={() => setShowContactModal(false)}>×</button>
            <h2>Get In Touch</h2>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <i className="fas fa-envelope"></i>
                <p>{personalInfo.email}</p>
              </div>
              <div className={styles.contactItem}>
                <i className="fas fa-phone"></i>
                <p>{personalInfo.phone}</p>
              </div>
              <div className={styles.contactItem}>
                <i className="fas fa-map-marker-alt"></i>
                <p>{personalInfo.location}</p>
              </div>
            </div>
            <div className={styles.socialLinks}>
              <a href={personalInfo.socialLinks?.linkedin} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href={personalInfo.socialLinks?.github} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-github"></i>
              </a>
              <a href={personalInfo.socialLinks?.twitter} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
              <a href={personalInfo.socialLinks?.instagram} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>
      )}
      
      {/* Decorative elements */}
      <div className={`${styles.floatingElement} ${styles.float1}`}></div>
      <div className={`${styles.floatingElement} ${styles.float2}`}></div>
      <div className={`${styles.floatingElement} ${styles.float3}`}></div>
    </section>
  );
};

export default Hero; 
import React, { useState, useEffect } from 'react';
import styles from './About.module.css';
import profileImage from '../../assets/profile.jpg';
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
  const [debugInfo, setDebugInfo] = useState(null);

  // Load hero data for the about section
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('About component: Fetching hero data...');
        
        // Try to get hero data from API
        const data = await portfolioService.fetchHeroData();
        console.log('About component: Received hero data:', data);
        
        if (data) {
          // Debug check for bio and aboutImageUrl
          console.log('About section fields:', {
            bio: data.bio,
            aboutImageUrl: data.aboutImageUrl
          });
          
          setHeroData(data);
          setDebugInfo({
            dataSource: 'API',
            hasBio: !!data.bio,
            hasAboutImage: !!data.aboutImageUrl,
            bioLength: data.bio ? data.bio.length : 0
          });
        } else {
          // Fallback to localStorage
          console.log('About component: Falling back to localStorage');
          const localData = portfolioService.getSectionData('personalInfo');
          
          if (localData) {
            console.log('About component: Local data:', localData);
            console.log('About section local fields:', {
              bio: localData.bio,
              aboutImageUrl: localData.aboutImageUrl
            });
            
            setHeroData(localData);
            setDebugInfo({
              dataSource: 'localStorage',
              hasBio: !!localData.bio,
              hasAboutImage: !!localData.aboutImageUrl,
              bioLength: localData.bio ? localData.bio.length : 0
            });
          }
        }
      } catch (error) {
        console.error('Error loading about data:', error);
        setDebugInfo({
          dataSource: 'error',
          error: error.message
        });
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
            <img src={heroData.aboutImageUrl || profileImage} alt="Profile" />
            {debugInfo && debugInfo.hasAboutImage ? 
              <small style={{color: 'green'}}>Using aboutImageUrl</small> : 
              <small style={{color: 'red'}}>Using fallback image</small>
            }
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
          
          {debugInfo && (
            <div style={{fontSize: '12px', background: '#f0f0f0', padding: '5px', margin: '5px 0'}}>
              <p>Debug: Source={debugInfo.dataSource}, Has Bio={debugInfo.hasBio ? 'Yes' : 'No'}, Length={debugInfo.bioLength}</p>
            </div>
          )}
          
          {loading ? (
            <p>Loading about information...</p>
          ) : bioParagraphs.length > 0 ? (
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
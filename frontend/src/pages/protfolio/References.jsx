import React, { useEffect, useRef, useState } from 'react';
import styles from './References.module.css';
import portfolioService from '../../services/portfolioService';
import placeholderImage from '../../assets/placeholder.js';

// Import fallback images if needed
import managerImage from '../../assets/references/manager.jpg';
import professorImage from '../../assets/references/professor.jpg';
import jenniferImage from '../../assets/jennifer.jpg';
import donaldImage from '../../assets/donald.jpg';

const References = () => {
  const referenceItems = useRef([]);
  const [referencesData, setReferencesData] = useState([]);
  const [imageSources, setImageSources] = useState({});
  
  // Handler for image loading errors
  const handleImageError = (name) => {
    setImageSources(prev => ({
      ...prev,
      [name]: placeholderImage
    }));
  };
  
  // Fallback images for demo purposes
  const fallbackImages = [
    managerImage,
    professorImage,
    jenniferImage,
    donaldImage
  ];
  
  useEffect(() => {
    // Initialize localStorage if needed
    portfolioService.initializeStorage();
    
    // Fetch references data from localStorage
    const fetchData = () => {
      const data = portfolioService.getSectionData('references');
      setReferencesData(data || []);
      console.log("References data loaded:", data);
    };
    
    // Initial data fetch
    fetchData();
    
    // Listen for changes to localStorage
    const handleStorageChange = (e) => {
      if (e.key === 'portfolio_references' || e.key === 'lastUpdate') {
        console.log("Storage change detected for references");
        fetchData();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically for changes
    const interval = setInterval(fetchData, 3000);
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.revealed);
          }
        });
      },
      { threshold: 0.2 }
    );
    
    // Update observer for items
    const updateObserver = () => {
      const currentItems = referenceItems.current;
      
      if (currentItems && currentItems.forEach) {
        currentItems.forEach((item) => {
          if (item) observer.observe(item);
        });
      }
    };
    
    // Set up observer after data is loaded
    if (referencesData.length > 0) {
      setTimeout(updateObserver, 100);
    }
    
    return () => {
      // Cleanup observer
      const currentItems = referenceItems.current;
      if (currentItems && currentItems.forEach) {
        currentItems.forEach((item) => {
          if (item) observer.unobserve(item);
        });
      }
      
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [referencesData.length]);
  
  // Manually force an update to the component when localStorage is changed from this window
  useEffect(() => {
    const handleLocalChange = () => {
      const data = portfolioService.getSectionData('references');
      setReferencesData(data || []);
    };
    
    window.addEventListener('localDataChanged', handleLocalChange);
    
    return () => {
      window.removeEventListener('localDataChanged', handleLocalChange);
    };
  }, []);
  
  // Check if we have references data
  if (referencesData.length === 0) {
    return null; // Don't render the section if no data
  }
  
  return (
    <section id="references" className={styles.references}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>References</h2>
        
        <div className={styles.referencesList}>
          Here's what my clients and colleagues have to say about working with me.
        </div>
        
        <div className={styles.referencesGrid}>
          {referencesData.map((reference, index) => (
            <div 
              key={index} 
              className={`${styles.referenceCard} ${styles.glassCard}`}
              ref={el => referenceItems.current[index] = el}
            >
              <div className={styles.referenceImage}>
                <img 
                  src={imageSources[reference.name] || reference.image || fallbackImages[index % fallbackImages.length]} 
                  alt={reference.name}
                  onError={() => handleImageError(reference.name)}
                />
              </div>
              <div className={styles.referenceContent}>
                <h3>{reference.name}</h3>
                <h4>{reference.position}</h4>
                <h5>{reference.company}</h5>
                
                <div className={styles.quote}>
                  <p>"{reference.quote}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default References; 
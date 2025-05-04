import React, { useEffect, useRef, useState } from 'react';
import styles from './Pictures.module.css';
import portfolioService from '../../services/portfolioService';

const Pictures = () => {
  const pictureItems = useRef([]);
  const [picturesData, setPicturesData] = useState([]);
  
  // Function to create sample picture data if none exists
  const createSamplePictureData = () => {
    const sampleData = [
      {
        title: 'My Photography',
        category: 'Portfolio',
        description: 'A collection of my photography work.',
        link: '',
        image: null
      }
    ];
    
    portfolioService.saveSectionData('pictures', sampleData);
    return sampleData;
  };
  
  useEffect(() => {
    // Initialize localStorage if needed
    portfolioService.initializeStorage();
    
    // Fetch pictures data from localStorage
    const fetchData = () => {
      let data = portfolioService.getSectionData('pictures');
      
      // If no data exists, create sample data
      if (!data || data.length === 0) {
        data = createSamplePictureData();
      }
      
      setPicturesData(data);
      console.log("Pictures data loaded:", data);
    };
    
    // Initial data fetch
    fetchData();
    
    // Listen for changes to localStorage
    const handleStorageChange = (e) => {
      if (e.key === 'portfolio_pictures' || e.key === 'lastUpdate') {
        console.log("Storage change detected for pictures");
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
      const currentItems = pictureItems.current;
      
      if (currentItems && currentItems.forEach) {
        currentItems.forEach((item) => {
          if (item) observer.observe(item);
        });
      }
    };
    
    // Set up observer after data is loaded
    if (picturesData.length > 0) {
      setTimeout(updateObserver, 100);
    }
    
    return () => {
      // Cleanup observer
      const currentItems = pictureItems.current;
      if (currentItems && currentItems.forEach) {
        currentItems.forEach((item) => {
          if (item) observer.unobserve(item);
        });
      }
      
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [picturesData.length]);
  
  // Manually force an update to the component when localStorage is changed from this window
  useEffect(() => {
    const handleLocalChange = () => {
      const data = portfolioService.getSectionData('pictures');
      setPicturesData(data || []);
    };
    
    window.addEventListener('localDataChanged', handleLocalChange);
    
    return () => {
      window.removeEventListener('localDataChanged', handleLocalChange);
    };
  }, []);
  
  // Check if we have pictures data and if it contains images to display
  if (picturesData.length === 0 || !picturesData.some(pic => pic.image)) {
    return null; // Don't render the section if no data or no images
  }
  
  return (
    <section id="pictures" className={styles.pictures}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Photography</h2>
        
        <div className={styles.picturesGrid}>
          {picturesData.map((picture, index) => (
            picture.image && (
              <div 
                key={index} 
                className={`${styles.pictureCard}`}
                ref={el => pictureItems.current[index] = el}
              >
                <div className={styles.pictureImage}>
                  <img 
                    src={picture.image}
                    alt={picture.title}
                    className={styles.pictureImg}
                  />
                </div>
                <div className={styles.pictureContent}>
                  <span className={styles.pictureTag}>{picture.category}</span>
                  <h3>{picture.title}</h3>
                  <p>{picture.description}</p>
                  {picture.link && (
                    <a href={picture.link} className={styles.viewPicture} target="_blank" rel="noopener noreferrer">
                      View Full Size <i className="fas fa-external-link-alt"></i>
                    </a>
                  )}
                </div>
              </div>
            )
          )).filter(Boolean)}
        </div>
      </div>
    </section>
  );
};

export default Pictures;
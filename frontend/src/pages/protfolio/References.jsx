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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
    // Fetch references data from API
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('References component: Starting to fetch references data...');
        
        // Direct fetch to test API endpoint
        try {
          console.log('References component: Testing direct fetch to API endpoint...');
          const directResponse = await fetch('http://localhost:5000/api/references', {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
          });
          
          console.log('References component: Direct fetch status:', directResponse.status);
          if (directResponse.ok) {
            const directData = await directResponse.json();
            console.log('References component: Direct fetch data:', directData);
          } else {
            console.error('References component: Direct fetch failed with status:', directResponse.status);
          }
        } catch (directError) {
          console.error('References component: Direct fetch error:', directError);
        }
        
        // Fetch from service
        console.log('References component: Calling portfolioService.fetchReferencesData()...');
        const apiData = await portfolioService.fetchReferencesData();
        console.log('References component: API data received:', apiData);
        
        if (apiData && Array.isArray(apiData)) {
          console.log('References component: Setting references data with array of length:', apiData.length);
          setReferencesData(apiData);
        } else {
          console.error('References component: API data is not an array or is empty:', apiData);
          setError('No references data returned from API');
          setReferencesData([]);
        }
      } catch (error) {
        console.error('References component: Error fetching references:', error);
        setError('Failed to fetch references data from the database');
        setReferencesData([]);
      } finally {
        setLoading(false);
      }
    };
    
    // Initial data fetch
    fetchData();
    
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
    };
  }, []);
  
  // Check if we have references data
  if (loading) {
    return (
      <section id="references" className={styles.references}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>References</h2>
          <p>Loading references...</p>
        </div>
      </section>
    );
  }
  
  if (error) {
    return (
      <section id="references" className={styles.references}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>References</h2>
          <p className={styles.errorMessage}>Error: {error}</p>
        </div>
      </section>
    );
  }
  
  if (referencesData.length === 0) {
    return (
      <section id="references" className={styles.references}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>References</h2>
          <p>No references data available.</p>
        </div>
      </section>
    );
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
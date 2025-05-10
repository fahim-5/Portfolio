import React, { useEffect, useRef, useState } from 'react';
import styles from './Experience.module.css';
import portfolioService from '../../services/portfolioService';

const Experience = () => {
  const experienceItems = useRef([]);
  const [experienceData, setExperienceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Fetch experience data directly from the database
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Fetching experience data from database...");
        
        // Use the portfolioService to fetch data from API only
        const data = await portfolioService.fetchExperienceData();
        
        if (data) {
          console.log("Experience data loaded from database:", data);
          setExperienceData(data);
        } else {
          console.log("No experience data returned from database");
          setExperienceData([]);
        }
      } catch (err) {
        console.error("Error fetching experience data:", err);
        setError(err.message);
        setExperienceData([]);
      } finally {
        setLoading(false);
      }
    };
    
    // Initial data fetch
    fetchData();
    
    // Set up intersection observer for animations
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
      const currentItems = experienceItems.current;
      
      if (currentItems && currentItems.forEach) {
        currentItems.forEach((item) => {
          if (item) observer.observe(item);
        });
      }
    };
    
    // Set up observer after data is loaded
    if (experienceData.length > 0) {
      setTimeout(updateObserver, 100);
    }
    
    return () => {
      // Cleanup observer
      const currentItems = experienceItems.current;
      if (currentItems && currentItems.forEach) {
        currentItems.forEach((item) => {
          if (item) observer.unobserve(item);
        });
      }
    };
  }, [experienceData.length]);
  
  if (loading) {
    return (
      <section id="experience" className={styles.experience}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Work Experience</h2>
          <p className={styles.loadingText}>Loading experience data from database...</p>
        </div>
      </section>
    );
  }
  
  if (error) {
    return (
      <section id="experience" className={styles.experience}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Work Experience</h2>
          <p className={styles.errorText}>Error loading data: {error}</p>
        </div>
      </section>
    );
  }
  
  // Check if we have experience data
  if (experienceData.length === 0) {
    return (
      <section id="experience" className={styles.experience}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Work Experience</h2>
          <p className={styles.emptyText}>No experience data available.</p>
        </div>
      </section>
    );
  }
  
  return (
    <section id="experience" className={styles.experience}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Work Experience</h2>
        
        <div className={styles.experienceGrid}>
          {experienceData.map((exp, index) => (
            <div 
              key={index} 
              className={`${styles.expItem} ${styles.glassCard}`}
              ref={el => experienceItems.current[index] = el}
            >
              <h3>{exp.position}</h3>
              <h4>{exp.company}</h4>
              <h5>{exp.location} | {exp.period}</h5>
              <p>{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience; 
import React, { useEffect, useRef, useState } from 'react';
import styles from './Education.module.css';
import portfolioService from '../../services/portfolioService';

const Education = () => {
  const educationItems = useRef([]);
  const [educationData, setEducationData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Initialize localStorage if needed
    portfolioService.initializeStorage();
    
    // Fetch education data from API first, then fall back to localStorage if API fails
    const fetchData = async () => {
      setLoading(true);
      try {
        // Try to fetch from API first
        const apiData = await portfolioService.fetchEducationData();
        if (apiData) {
          setEducationData(apiData);
          console.log("Education data loaded from API:", apiData);
        } else {
          // Fall back to localStorage if API fails
          const localData = portfolioService.getSectionData('education');
          setEducationData(localData || []);
          console.log("Education data loaded from localStorage:", localData);
        }
      } catch (error) {
        console.error("Error fetching education data:", error);
        // Fall back to localStorage on error
        const localData = portfolioService.getSectionData('education');
        setEducationData(localData || []);
      } finally {
        setLoading(false);
      }
    };
    
    // Initial data fetch
    fetchData();
    
    // Listen for changes to localStorage
    const handleStorageChange = (e) => {
      if (e.key === 'portfolio_education' || e.key === 'lastUpdate') {
        console.log("Storage change detected for education");
        const localData = portfolioService.getSectionData('education');
        setEducationData(localData || []);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
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
      const currentItems = educationItems.current;
      
      if (currentItems && currentItems.forEach) {
        currentItems.forEach((item) => {
          if (item) observer.observe(item);
        });
      }
    };
    
    // Set up observer after data is loaded
    if (educationData.length > 0) {
      setTimeout(updateObserver, 100);
    }
    
    return () => {
      // Cleanup observer
      const currentItems = educationItems.current;
      if (currentItems && currentItems.forEach) {
        currentItems.forEach((item) => {
          if (item) observer.unobserve(item);
        });
      }
      
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [educationData.length]);
  
  // Manually force an update to the component when localStorage is changed from this window
  useEffect(() => {
    const handleLocalChange = (e) => {
      if (e.detail && e.detail.key === 'portfolio_education') {
        const data = portfolioService.getSectionData('education');
        setEducationData(data || []);
      }
    };
    
    window.addEventListener('localDataChanged', handleLocalChange);
    
    return () => {
      window.removeEventListener('localDataChanged', handleLocalChange);
    };
  }, []);
  
  // Format a date from YYYY-MM to a readable format
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const [year, month] = dateString.split('-');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthIndex = parseInt(month, 10) - 1;
      return `${monthNames[monthIndex]} ${year}`;
    } catch (error) {
      return dateString;
    }
  };
  
  // If loading, show a loading indicator
  if (loading) {
    return (
      <section id="education" className={styles.education}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Education</h2>
          <div className={styles.loading}>Loading education data...</div>
        </div>
      </section>
    );
  }
  
  // Check if we have education data
  if (educationData.length === 0) {
    return null; // Don't render the section if no data
  }
  
  return (
    <section id="education" className={styles.education}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Education</h2>
        
        <div className={styles.educationGrid}>
          {educationData.map((edu, index) => (
            <div 
              key={edu.id || index} 
              className={`${styles.eduItem} ${styles.glassCard}`}
              ref={el => educationItems.current[index] = el}
            >
              <h3>{edu.degree}</h3>
              <h4>{edu.institution}</h4>
              <h5>
                {edu.location} | {
                  edu.current 
                    ? 'Current' 
                    : `${formatDate(edu.startDate)}${edu.endDate ? ` - ${formatDate(edu.endDate)}` : ''}`
                }
              </h5>
              <p>{edu.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education; 
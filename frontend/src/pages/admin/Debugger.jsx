import React, { useState, useEffect } from 'react';
import portfolioService from '../../services/portfolioService';
import styles from './adminDashboard.module.css';

const Debugger = () => {
  const [debugLog, setDebugLog] = useState([]);
  const [activeSection, setActiveSection] = useState('');
  const [personalInfoData, setPersonalInfoData] = useState(null);
  const [educationData, setEducationData] = useState(null);

  // Function to add to the debug log
  const log = (message) => {
    setDebugLog(prev => [...prev, {
      id: Date.now(),
      time: new Date().toLocaleTimeString(),
      message
    }]);
  };

  // Handle section change
  const changeSection = (section) => {
    log(`Changing section to: ${section}`);
    setActiveSection(section);

    try {
      if (section === 'personalInfo') {
        const data = portfolioService.getSectionData('personalInfo');
        log(`Retrieved personalInfo data: ${data ? 'Success' : 'Failed'}`);
        if (data) {
          setPersonalInfoData(data);
          log(`Personal Name: ${data.name || 'Not set'}`);
        }
      } else if (section === 'education') {
        const data = portfolioService.getSectionData('education');
        log(`Retrieved education data: ${data ? 'Success' : 'Failed'}`);
        if (data) {
          setEducationData(data);
          log(`Education entries: ${data.length || 0}`);
        }
      }
    } catch (error) {
      log(`Error: ${error.message}`);
    }
  };

  // Initialize data
  useEffect(() => {
    log('Component mounted');
    log('Initializing portfolio storage');
    
    try {
      portfolioService.initializeStorage();
      log('Portfolio storage initialized');
      
      // Try to load all data
      const allData = portfolioService.getAllData();
      log(`All data loaded: ${Object.keys(allData).join(', ')}`);
      
      // Check if personalInfo exists
      if (allData.personalInfo) {
        log(`Personal name: ${allData.personalInfo.name || 'Not set'}`);
      } else {
        log('personalInfo data not found');
      }
    } catch (error) {
      log(`Initialization error: ${error.message}`);
    }
  }, []);

  return (
    <div className={styles['debug-container']}>
      <h2>Dashboard Debugger</h2>
      
      <div className={styles['debug-actions']}>
        <button 
          className={styles['debug-button']} 
          onClick={() => changeSection('dashboard')}
        >
          Load Dashboard
        </button>
        <button 
          className={styles['debug-button']} 
          onClick={() => changeSection('personalInfo')}
        >
          Load Personal Info
        </button>
        <button 
          className={styles['debug-button']} 
          onClick={() => changeSection('education')}
        >
          Load Education
        </button>
      </div>
      
      <div className={styles['debug-state']}>
        <h3>Current State</h3>
        <p><strong>Active Section:</strong> {activeSection || 'None'}</p>
        <p><strong>Personal Info:</strong> {personalInfoData ? 'Loaded' : 'Not Loaded'}</p>
        {personalInfoData && (
          <div>
            <p>Name: {personalInfoData.name || 'Not set'}</p>
            <p>Job Title: {personalInfoData.jobTitle || 'Not set'}</p>
          </div>
        )}
        <p><strong>Education:</strong> {educationData ? `${educationData.length} entries` : 'Not Loaded'}</p>
      </div>
      
      <div className={styles['debug-log']}>
        <h3>Debug Log</h3>
        <div className={styles['log-container']}>
          {debugLog.map(entry => (
            <div key={entry.id} className={styles['log-entry']}>
              <span className={styles['log-time']}>{entry.time}</span>
              <span className={styles['log-message']}>{entry.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Debugger; 
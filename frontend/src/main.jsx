import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import portfolioService from './services/portfolioService';
import './pages/admin/adminDashboard.css';

// Initialize storage on application startup
portfolioService.initializeStorage();

// Create a global backup function to preserve data
window.backupPortfolioData = () => {
  console.log('Creating manual backup of portfolio data...');
  const data = portfolioService.getAllData();
  
  // Store with a timestamp
  const timestamp = new Date().toISOString();
  const backup = {
    data: data,
    timestamp: timestamp
  };
  
  try {
    localStorage.setItem('portfolio_complete_backup', JSON.stringify(backup));
    console.log('Manual backup created successfully at', timestamp);
  } catch (error) {
    console.error('Error creating manual backup:', error);
  }
};

// Set up automatic periodic backup every 5 minutes
const backupInterval = setInterval(() => {
  window.backupPortfolioData();
}, 5 * 60 * 1000); // 5 minutes

// Function to restore from backup if needed
window.restoreFromBackup = () => {
  console.log('Attempting to restore from backup...');
  try {
    const backupStr = localStorage.getItem('portfolio_complete_backup');
    if (backupStr) {
      const backup = JSON.parse(backupStr);
      if (backup && backup.data) {
        // Restore each section
        Object.entries(backup.data).forEach(([key, value]) => {
          if (value) {
            const storageKey = key === 'personalInfo' 
              ? 'portfolio_personal_info' 
              : `portfolio_${key}`;
            
            localStorage.setItem(storageKey, JSON.stringify(value));
            sessionStorage.setItem(storageKey, JSON.stringify(value));
            console.log(`Restored ${key} from backup`);
          }
        });
        console.log('Restoration from backup complete');
        return true;
      }
    }
    console.log('No backup found to restore');
    return false;
  } catch (error) {
    console.error('Error restoring from backup:', error);
    return false;
  }
};

// Set up hot module replacement (HMR) for development with enhanced protection
if (import.meta.hot) {
  // Create a full backup before any HMR updates
  import.meta.hot.on('vite:beforeUpdate', () => {
    console.log('HMR update detected - creating data backup...');
    window.backupPortfolioData();
    
    // Get all data from localStorage
    const data = portfolioService.getAllData();
    
    // Make sure everything is also saved in sessionStorage with the correct keys
    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        try {
          // Use the same keys as in the KEYS object in portfolioService.js
          const storageKey = key === 'personalInfo' 
            ? 'portfolio_personal_info' 
            : `portfolio_${key}`;
            
          // Save to sessionStorage
          sessionStorage.setItem(storageKey, JSON.stringify(value));
          
          // Also create individual backups for each key
          const backupKey = `hmr_backup_${storageKey}`;
          const backupData = {
            data: value,
            timestamp: new Date().getTime()
          };
          sessionStorage.setItem(backupKey, JSON.stringify(backupData));
        } catch (error) {
          console.error(`Error preserving ${key} data during hot reload:`, error);
        }
      }
    });
  });
  
  // After HMR update completes, verify data integrity
  import.meta.hot.on('vite:afterUpdate', () => {
    console.log('HMR update completed - verifying data integrity...');
    
    // Check if any data was lost and restore from sessionStorage if needed
    setTimeout(() => {
      const keys = [
        'portfolio_personal_info',
        'portfolio_education',
        'portfolio_experience',
        'portfolio_skills',
        'portfolio_projects',
        'portfolio_highlights',
        'portfolio_pictures',
        'portfolio_references',
        'portfolio_settings'
      ];
      
      let dataLost = false;
      
      keys.forEach(key => {
        const localData = localStorage.getItem(key);
        if (!localData) {
          dataLost = true;
          // Try to restore from sessionStorage
          const sessionData = sessionStorage.getItem(key);
          if (sessionData) {
            localStorage.setItem(key, sessionData);
            console.log(`Restored ${key} from sessionStorage after HMR`);
          } else {
            // Try to restore from HMR backup
            const backupKey = `hmr_backup_${key}`;
            const backupData = sessionStorage.getItem(backupKey);
            if (backupData) {
              try {
                const parsed = JSON.parse(backupData);
                if (parsed && parsed.data) {
                  localStorage.setItem(key, JSON.stringify(parsed.data));
                  console.log(`Restored ${key} from HMR backup`);
                }
              } catch (error) {
                console.error(`Error restoring ${key} from HMR backup:`, error);
              }
            }
          }
        }
      });
      
      if (dataLost) {
        // Force portfolio service to re-initialize if data was lost
        portfolioService.initializeStorage();
        console.log('Data recovery after HMR complete');
      }
    }, 1000); // Wait 1 second after HMR to check and restore
  });
}

// Clean up interval on application exit
window.addEventListener('unload', () => {
  clearInterval(backupInterval);
  // Create one final backup before unloading
  window.backupPortfolioData();
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 
// This is a simple fallback service that uses localStorage
// It will be gradually replaced by API calls to the backend

const storagePrefix = 'portfolio_';

const portfolioService = {
  // Initialize storage
  initializeStorage: () => {
    // Check if storage is initialized
    if (!localStorage.getItem(`${storagePrefix}initialized`)) {
      console.log('Initializing portfolio storage');
      localStorage.setItem(`${storagePrefix}initialized`, 'true');
      
      // Initialize empty sections
      const sections = [
        'personalInfo',
        'education',
        'experience',
        'skills',
        'projects',
        'highlights',
        'references',
        'pictures'
      ];
      
      sections.forEach(section => {
        if (!localStorage.getItem(`${storagePrefix}${section}`)) {
          localStorage.setItem(`${storagePrefix}${section}`, JSON.stringify({}));
        }
      });
      
      // Initialize recent activity
      if (!localStorage.getItem(`${storagePrefix}recent_activity`)) {
        localStorage.setItem(`${storagePrefix}recent_activity`, JSON.stringify([]));
      }
      
      // Initialize portfolio views counter
      if (!localStorage.getItem(`${storagePrefix}views`)) {
        localStorage.setItem(`${storagePrefix}views`, '0');
      }
    }
  },
  
  // Save section data
  saveSectionData: (section, data) => {
    localStorage.setItem(`${storagePrefix}${section}`, JSON.stringify(data));
    return true;
  },
  
  // Get section data
  getSectionData: (section) => {
    const data = localStorage.getItem(`${storagePrefix}${section}`);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (error) {
        console.error(`Error parsing ${section} data:`, error);
        return null;
      }
    }
    return null;
  },
  
  // Delete section data
  deleteSectionData: (section) => {
    localStorage.removeItem(`${storagePrefix}${section}`);
    return true;
  },
  
  // Clear all portfolio data
  clearAllData: () => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(storagePrefix)) {
        localStorage.removeItem(key);
      }
    });
    return true;
  },
  
  // Increment portfolio views counter
  incrementPortfolioViews: () => {
    const views = localStorage.getItem(`${storagePrefix}views`) || '0';
    const newViews = parseInt(views, 10) + 1;
    localStorage.setItem(`${storagePrefix}views`, newViews.toString());
    return newViews;
  },
  
  // Get portfolio views count
  getPortfolioViews: () => {
    const views = localStorage.getItem(`${storagePrefix}views`) || '0';
    return parseInt(views, 10);
  }
};

export default portfolioService; 
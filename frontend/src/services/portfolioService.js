// Local Storage Keys
const KEYS = {
  PERSONAL_INFO: 'portfolio_personal_info',
  EDUCATION: 'portfolio_education',
  EXPERIENCE: 'portfolio_experience',
  SKILLS: 'portfolio_skills',
  PROJECTS: 'portfolio_projects',
  HIGHLIGHTS: 'portfolio_highlights',
  PICTURES: 'portfolio_pictures',
  REFERENCES: 'portfolio_references',
  SETTINGS: 'portfolio_settings',
  PORTFOLIO_VIEWS: 'portfolio_views_count'
};

// Function to save data to localStorage and sessionStorage for persistence
const saveToStorage = (key, data) => {
  try {
    // Convert data to string once to avoid duplication
    const dataString = JSON.stringify(data);
    
    // Save to localStorage for long-term persistence
    localStorage.setItem(key, dataString);
    
    // Also save to sessionStorage as a backup during development
    sessionStorage.setItem(key, dataString);
    
    // Save a timestamp for this key to track when it was last updated
    const timestamp = new Date().getTime();
    localStorage.setItem(`${key}_timestamp`, timestamp.toString());
    sessionStorage.setItem(`${key}_timestamp`, timestamp.toString());
    
    // Save an additional backup for critical development persistence
    try {
      const backupData = {
        data: data,
        timestamp: timestamp
      };
      localStorage.setItem(`backup_${key}`, JSON.stringify(backupData));
    } catch (backupError) {
      console.error('Error creating backup:', backupError);
    }
  } catch (error) {
    console.error('Error saving data to storage:', error);
    // Try to recover from quota exceeded error by clearing less important data
    if (error.name === 'QuotaExceededError') {
      tryToFreeUpStorage();
      // Try one more time with just the essential data
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (retryError) {
        console.error('Failed to save data even after cleanup:', retryError);
      }
    }
  }
};

// Helper function to try to free up storage space
const tryToFreeUpStorage = () => {
  try {
    // Find old backup items that can be removed
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('backup_') && key !== 'backup_portfolio_personal_info') {
        localStorage.removeItem(key);
      }
    }
  } catch (error) {
    console.error('Error while trying to free up storage:', error);
  }
};

// Function to get data with fallback between storages
const getFromStorage = (key, defaultValue) => {
  try {
    // Try localStorage first
    const localData = localStorage.getItem(key);
    if (localData) {
      try {
        return JSON.parse(localData);
      } catch (parseError) {
        console.error(`Error parsing data from localStorage for key ${key}:`, parseError);
      }
    }
    
    // Try sessionStorage if localStorage is empty or invalid
    const sessionData = sessionStorage.getItem(key);
    if (sessionData) {
      try {
        const parsedData = JSON.parse(sessionData);
        // If data exists in sessionStorage but not localStorage, restore it
        localStorage.setItem(key, sessionData);
        return parsedData;
      } catch (parseError) {
        console.error(`Error parsing data from sessionStorage for key ${key}:`, parseError);
      }
    }
    
    // Try the backup storage as a last resort
    const backupData = localStorage.getItem(`backup_${key}`);
    if (backupData) {
      try {
        const parsedBackup = JSON.parse(backupData);
        if (parsedBackup && parsedBackup.data) {
          console.log(`Recovering data for ${key} from backup storage`);
          // Restore from backup to primary storage
          const restoredData = parsedBackup.data;
          saveToStorage(key, restoredData);
          return restoredData;
        }
      } catch (parseError) {
        console.error(`Error parsing backup data for key ${key}:`, parseError);
      }
    }
    
    // Return default if no valid data is found
    return defaultValue;
  } catch (error) {
    console.error('Error retrieving data from storage:', error);
    return defaultValue;
  }
};

// Initial default data
const defaultData = {
  personalInfo: {
    name: 'Fahim Faysal',
    jobTitle: 'Web Developer',
    introText: 'Passionate web developer with expertise in React and modern web technologies.',
    bio: 'I am a full-stack developer with over 5 years of experience building web applications.',
    email: 'example@example.com',
    phone: '+1234567890',
    location: 'Dhaka, Bangladesh',
    website: 'https://example.com',
    aboutImageUrl: null,
    socialLinks: {
      linkedin: 'https://linkedin.com/in/example',
      github: 'https://github.com/example',
      twitter: 'https://twitter.com/example',
      instagram: 'https://instagram.com/example'
    },
    hero: {
      greeting: "Hello, I'm",
      description: "Passionate web developer with expertise in React and modern web technologies. I create responsive and user-friendly web applications.",
      stats: [
        { value: "5+", label: "Years Experience" },
        { value: "100+", label: "Projects Completed" },
        { value: "50+", label: "Happy Clients" }
      ],
      buttonText: "Get In Touch",
      profileImageUrl: null
    }
  },
  education: [
    {
      degree: 'Bachelor of Computer Science',
      field: 'Software Engineering',
      institution: 'Example University',
      location: 'Dhaka, Bangladesh',
      startDate: '2018-09',
      endDate: '2022-06',
      current: false,
      description: 'Studied computer science with focus on software engineering and web development. Participated in several coding competitions and hackathons.'
    }
  ],
  experience: [
    {
      position: 'Senior Full Stack Developer',
      company: 'Tech Innovations Inc.',
      location: 'San Francisco, CA',
      period: '2021 - Present',
      description: 'Lead developer for multiple enterprise-level web applications. Managed a team of five developers and collaborated with design and product teams.'
    }
  ],
  skills: {
    technical: [
      { name: 'React', level: 'advanced' },
      { name: 'HTML', level: 'expert' },
      { name: 'CSS', level: 'expert' },
      { name: 'JavaScript', level: 'advanced' },
      { name: 'Node.js', level: 'intermediate' }
    ],
    soft: [
      { name: 'Communication' },
      { name: 'Teamwork' },
      { name: 'Problem Solving' }
    ],
    languages: [
      { name: 'Bengali', level: 'native' },
      { name: 'English', level: 'advanced' },
      { name: 'Spanish', level: 'elementary' }
    ]
  },
  projects: [
    {
      title: 'Personal Portfolio',
      category: 'Web Development',
      description: 'A responsive portfolio website built with React and modern CSS. Features include a clean design, smooth animations, and a custom admin panel for easy content management.',
      image: null,
      demoUrl: 'https://example.com/portfolio',
      repoUrl: 'https://github.com/username/portfolio',
      date: '2023-03',
      technologies: 'React, CSS Modules, React Router'
    }
  ],
  highlights: [
    {
      title: 'Best Web Application Award',
      date: '2023-05',
      category: 'award',
      description: 'Received industry recognition for developing an innovative user interface that increased customer engagement by 45%.'
    }
  ],
  pictures: [
    {
      title: 'Mountain Sunrise',
      category: 'Landscape',
      image: null,
      description: 'Breathtaking sunrise captured from the summit of Mount Rainier during a hiking expedition.',
      link: '#'
    }
  ],
  references: [
    {
      name: 'Sarah Johnson',
      position: 'CTO at Tech Innovations',
      company: 'Tech Innovations Inc.',
      image: null,
      quote: 'John is an exceptional developer who consistently delivered high-quality work on all of our projects. His technical skills, problem-solving abilities, and communication made him an invaluable asset to our team.'
    }
  ],
  settings: {
    portfolioTitle: 'John Doe - Full Stack Developer',
    faviconUrl: '/favicon.ico',
    accentColor: '#00bcd4',
    secondaryColor: '#7986cb',
    metaDescription: 'Portfolio of John Doe, a Full Stack Developer specializing in React, Node.js, and modern web technologies.',
    auth: {
      username: 'admin',
      email: 'admin@example.com',
      passwordHash: 'MTIzNA==' // Base64 encoded "1234"
    }
  }
};

// Initialize local storage with default data if not already present
const initializeStorage = () => {
  console.log('Initializing storage and checking for existing data...');
  
  // Check for data in all storage locations and use the most recent
  const checkDataExists = (key, defaultData) => {
    // Check primary localStorage
    const localData = localStorage.getItem(key);
    const localTimestamp = localStorage.getItem(`${key}_timestamp`);
    
    // Check sessionStorage
    const sessionData = sessionStorage.getItem(key);
    const sessionTimestamp = sessionStorage.getItem(`${key}_timestamp`);
    
    // Check backup storage
    const backupStorage = localStorage.getItem(`backup_${key}`);
    let backupData = null;
    let backupTimestamp = null;
    
    if (backupStorage) {
      try {
        const parsedBackup = JSON.parse(backupStorage);
        if (parsedBackup && parsedBackup.data) {
          backupData = parsedBackup.data;
          backupTimestamp = parsedBackup.timestamp;
        }
      } catch (error) {
        console.error(`Error parsing backup data for ${key}:`, error);
      }
    }
    
    // Compare timestamps and use the most recent data
    if (localData && sessionData && backupData) {
      // All three exist, compare timestamps
      const localTime = parseInt(localTimestamp || '0');
      const sessionTime = parseInt(sessionTimestamp || '0');
      const backupTime = backupTimestamp || 0;
      
      if (localTime >= sessionTime && localTime >= backupTime) {
        return true; // localStorage is most recent
      } else if (sessionTime >= localTime && sessionTime >= backupTime) {
        // sessionStorage is most recent, restore to localStorage
        try {
          localStorage.setItem(key, sessionData);
          return true;
        } catch (error) {
          console.error(`Error restoring session data to localStorage for ${key}:`, error);
        }
      } else {
        // backup is most recent, restore to both storages
        try {
          const backupStr = JSON.stringify(backupData);
          localStorage.setItem(key, backupStr);
          sessionStorage.setItem(key, backupStr);
          return true;
        } catch (error) {
          console.error(`Error restoring backup data to storages for ${key}:`, error);
        }
      }
    } else if (localData) {
      return true; // localStorage exists
    } else if (sessionData) {
      // Only sessionStorage exists, restore to localStorage
      try {
        localStorage.setItem(key, sessionData);
        return true;
      } catch (error) {
        console.error(`Error restoring session data to localStorage for ${key}:`, error);
      }
    } else if (backupData) {
      // Only backup exists, restore to both storages
      try {
        const backupStr = JSON.stringify(backupData);
        localStorage.setItem(key, backupStr);
        sessionStorage.setItem(key, backupStr);
        return true;
      } catch (error) {
        console.error(`Error restoring backup data to storages for ${key}:`, error);
      }
    }
    
    // No valid data found
    return false;
  };
  
  // Personal Info
  if (!checkDataExists(KEYS.PERSONAL_INFO, defaultData.personalInfo)) {
    saveToStorage(KEYS.PERSONAL_INFO, defaultData.personalInfo);
  }
  
  // Education
  if (!checkDataExists(KEYS.EDUCATION, defaultData.education)) {
    saveToStorage(KEYS.EDUCATION, defaultData.education);
  }
  
  // Experience
  if (!checkDataExists(KEYS.EXPERIENCE, defaultData.experience)) {
    saveToStorage(KEYS.EXPERIENCE, defaultData.experience);
  }
  
  // Skills
  if (!checkDataExists(KEYS.SKILLS, defaultData.skills)) {
    saveToStorage(KEYS.SKILLS, defaultData.skills);
  }
  
  // Projects
  if (!checkDataExists(KEYS.PROJECTS, defaultData.projects)) {
    saveToStorage(KEYS.PROJECTS, defaultData.projects);
  }
  
  // Highlights
  if (!checkDataExists(KEYS.HIGHLIGHTS, defaultData.highlights)) {
    saveToStorage(KEYS.HIGHLIGHTS, defaultData.highlights);
  }
  
  // Pictures
  if (!checkDataExists(KEYS.PICTURES, defaultData.pictures)) {
    saveToStorage(KEYS.PICTURES, defaultData.pictures);
  }
  
  // References
  if (!checkDataExists(KEYS.REFERENCES, defaultData.references)) {
    saveToStorage(KEYS.REFERENCES, defaultData.references);
  }
  
  // Settings
  if (!checkDataExists(KEYS.SETTINGS, defaultData.settings)) {
    saveToStorage(KEYS.SETTINGS, defaultData.settings);
  }
  
  console.log('Storage initialization complete');
};

// Get all portfolio data
const getAllData = () => {
  return {
    personalInfo: getFromStorage(KEYS.PERSONAL_INFO, defaultData.personalInfo),
    education: getFromStorage(KEYS.EDUCATION, defaultData.education),
    experience: getFromStorage(KEYS.EXPERIENCE, defaultData.experience),
    skills: getFromStorage(KEYS.SKILLS, defaultData.skills),
    projects: getFromStorage(KEYS.PROJECTS, defaultData.projects),
    highlights: getFromStorage(KEYS.HIGHLIGHTS, defaultData.highlights),
    pictures: getFromStorage(KEYS.PICTURES, defaultData.pictures),
    references: getFromStorage(KEYS.REFERENCES, defaultData.references),
    settings: getFromStorage(KEYS.SETTINGS, defaultData.settings)
  };
};

// Get section data
const getSectionData = (section) => {
  switch(section) {
    case 'personalInfo':
    case 'personal':  // Add alias for backward compatibility
      return getFromStorage(KEYS.PERSONAL_INFO, defaultData.personalInfo);
    case 'education':
      return getFromStorage(KEYS.EDUCATION, defaultData.education);
    case 'experience':
      return getFromStorage(KEYS.EXPERIENCE, defaultData.experience);
    case 'skills':
      return getFromStorage(KEYS.SKILLS, defaultData.skills);
    case 'projects':
      return getFromStorage(KEYS.PROJECTS, defaultData.projects);
    case 'highlights':
      return getFromStorage(KEYS.HIGHLIGHTS, defaultData.highlights);
    case 'pictures':
      return getFromStorage(KEYS.PICTURES, defaultData.pictures);
    case 'references':
      return getFromStorage(KEYS.REFERENCES, defaultData.references);
    case 'settings':
      return getFromStorage(KEYS.SETTINGS, defaultData.settings);
    default:
      return null;
  }
};

// Save section data
const saveSectionData = (section, data) => {
  switch(section) {
    case 'personalInfo':
    case 'personal':
      saveToStorage(KEYS.PERSONAL_INFO, data);
      // Dispatch event to notify about data change
      dispatchLocalDataChanged('portfolio_personal_info');
      break;
    case 'education':
      saveToStorage(KEYS.EDUCATION, data);
      dispatchLocalDataChanged('portfolio_education');
      break;
    case 'experience':
      saveToStorage(KEYS.EXPERIENCE, data);
      dispatchLocalDataChanged('portfolio_experience');
      break;
    case 'skills':
      saveToStorage(KEYS.SKILLS, data);
      dispatchLocalDataChanged('portfolio_skills');
      break;
    case 'projects':
      saveToStorage(KEYS.PROJECTS, data);
      dispatchLocalDataChanged('portfolio_projects');
      break;
    case 'highlights':
      saveToStorage(KEYS.HIGHLIGHTS, data);
      dispatchLocalDataChanged('portfolio_highlights');
      break;
    case 'pictures':
      saveToStorage(KEYS.PICTURES, data);
      dispatchLocalDataChanged('portfolio_pictures');
      break;
    case 'references':
      saveToStorage(KEYS.REFERENCES, data);
      dispatchLocalDataChanged('portfolio_references');
      break;
    case 'settings':
      saveToStorage(KEYS.SETTINGS, data);
      dispatchLocalDataChanged('portfolio_settings');
      break;
    default:
      return false;
  }
  
  return true;
};

// Helper function to dispatch a custom event for in-window updates
const dispatchLocalDataChanged = (key) => {
  try {
    const event = new CustomEvent('localDataChanged', { detail: { key } });
    window.dispatchEvent(event);
    console.log(`Dispatched localDataChanged event for key: ${key}`);
  } catch (error) {
    console.error('Error dispatching localDataChanged event:', error);
  }
};

// Clear all data
const clearAllData = () => {
  Object.values(KEYS).forEach(key => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
  
  localStorage.removeItem('portfolio_recent_activity');
  sessionStorage.removeItem('portfolio_recent_activity');
};

// Reset to default data
const resetToDefault = () => {
  // Clear all existing data first
  clearAllData();
  
  // Save default data using the new storage functions
  saveToStorage(KEYS.PERSONAL_INFO, defaultData.personalInfo);
  saveToStorage(KEYS.EDUCATION, defaultData.education);
  saveToStorage(KEYS.EXPERIENCE, defaultData.experience);
  saveToStorage(KEYS.SKILLS, defaultData.skills);
  saveToStorage(KEYS.PROJECTS, defaultData.projects);
  saveToStorage(KEYS.HIGHLIGHTS, defaultData.highlights);
  saveToStorage(KEYS.PICTURES, defaultData.pictures);
  saveToStorage(KEYS.REFERENCES, defaultData.references);
  saveToStorage(KEYS.SETTINGS, defaultData.settings);
  
  // Return success
  return true;
};

// Get portfolio views count
const getPortfolioViews = () => {
  try {
    // Try localStorage first
    const views = localStorage.getItem(KEYS.PORTFOLIO_VIEWS);
    if (views) {
      return parseInt(views) || 0;
    }
    
    // Try sessionStorage if localStorage is empty
    const sessionViews = sessionStorage.getItem(KEYS.PORTFOLIO_VIEWS);
    if (sessionViews) {
      // If views exist in sessionStorage but not localStorage, restore it
      localStorage.setItem(KEYS.PORTFOLIO_VIEWS, sessionViews);
      return parseInt(sessionViews) || 0;
    }
    
    // Default to 0 if neither exists
    return 0;
  } catch (error) {
    console.error('Error retrieving portfolio views:', error);
    return 0;
  }
};

// Increment portfolio views count
const incrementPortfolioViews = () => {
  const currentViews = getPortfolioViews();
  const newViews = currentViews + 1;
  localStorage.setItem(KEYS.PORTFOLIO_VIEWS, newViews.toString());
  return newViews;
};

// Debug functions to help troubleshoot data issues
const debugPortfolioData = () => {
  try {
    console.group('Portfolio Data Debug');
    
    // Check personal info with hero image
    const personalInfo = getFromStorage(KEYS.PERSONAL_INFO, null);
    console.log('Personal Info from storage:', personalInfo);
    
    if (personalInfo && personalInfo.hero) {
      console.log('Hero object exists:', personalInfo.hero);
      console.log('Hero profile image URL:', personalInfo.hero.profileImageUrl);
    } else {
      console.log('Hero object missing or incomplete');
    }
    
    // Check all storage mechanisms for personal info
    console.group('Storage Check');
    const localData = localStorage.getItem(KEYS.PERSONAL_INFO);
    console.log('localStorage data exists:', !!localData);
    
    const sessionData = sessionStorage.getItem(KEYS.PERSONAL_INFO);
    console.log('sessionStorage data exists:', !!sessionData);
    
    const backupData = localStorage.getItem(`backup_${KEYS.PERSONAL_INFO}`);
    console.log('backup data exists:', !!backupData);
    console.groupEnd();
    
    console.groupEnd();
    return { localData, sessionData, backupData, personalInfo };
  } catch (error) {
    console.error('Error in debug function:', error);
    return null;
  }
};

// Fix hero image data if it's missing
const fixHeroImageData = (imageUrl) => {
  try {
    console.log('Attempting to fix hero image data...');
    
    // Get current personal info
    const personalInfo = getFromStorage(KEYS.PERSONAL_INFO, defaultData.personalInfo);
    console.log('Current personal info:', personalInfo);
    
    // Ensure hero object exists
    if (!personalInfo.hero) {
      personalInfo.hero = {
        greeting: "Hello, I'm",
        description: personalInfo.introText || '',
        stats: [
          { value: "5+", label: "Years Experience" },
          { value: "100+", label: "Projects Completed" },
          { value: "50+", label: "Happy Clients" }
        ],
        buttonText: "Get In Touch",
        profileImageUrl: null
      };
    }
    
    // Set the image URL
    personalInfo.hero.profileImageUrl = imageUrl;
    console.log('Updated personal info with new image URL:', personalInfo);
    
    // Save the updated personal info
    saveToStorage(KEYS.PERSONAL_INFO, personalInfo);
    dispatchLocalDataChanged('portfolio_personal_info');
    
    console.log('Hero image data fixed successfully!');
    return true;
  } catch (error) {
    console.error('Error fixing hero image data:', error);
    return false;
  }
};

// Export all functions
const portfolioService = {
  initializeStorage,
  getAllData,
  getSectionData,
  saveSectionData,
  clearAllData,
  resetToDefault,
  dispatchLocalDataChanged,
  getPortfolioViews,
  incrementPortfolioViews,
  debugPortfolioData,
  fixHeroImageData
};

export default portfolioService; 
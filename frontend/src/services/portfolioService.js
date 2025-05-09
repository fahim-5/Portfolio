// portfolioService.js
// This service handles portfolio data management between localStorage and backend API

import axios from 'axios';

// Create axios instance with baseURL
const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const STORAGE_KEYS = {
  PERSONAL_INFO: 'portfolio_personal_info',
  EDUCATION: 'portfolio_education',
  EXPERIENCE: 'portfolio_experience',
  SKILLS: 'portfolio_skills',
  PROJECTS: 'portfolio_projects',
  PICTURES: 'portfolio_pictures',
  REFERENCES: 'portfolio_references',
  VIEWS: 'portfolio_views',
  LAST_UPDATE: 'lastUpdate'
};

const portfolioService = {
  // Initialize localStorage if needed
  initializeStorage() {
    // Check if localStorage is available
    if (typeof window === 'undefined' || !window.localStorage) {
      console.error('localStorage is not available');
      return;
    }

    // Initialize sections if they don't exist
    Object.values(STORAGE_KEYS).forEach(key => {
      if (!localStorage.getItem(key)) {
        if (key === STORAGE_KEYS.VIEWS) {
          localStorage.setItem(key, '0');
        } else if (key === STORAGE_KEYS.LAST_UPDATE) {
          localStorage.setItem(key, Date.now().toString());
        } else {
          localStorage.setItem(key, '[]');
        }
      }
    });
  },

  // Get section data from localStorage
  getSectionData(section) {
    try {
      // Map section name to storage key
      const key = STORAGE_KEYS[section.toUpperCase()] || `portfolio_${section.toLowerCase()}`;
      
      // Get data from localStorage
      const data = localStorage.getItem(key);
      
      // Log for debugging
      console.log(`Getting data for ${section} with key ${key}:`, data);
      
      // Parse and return data
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error getting ${section} data:`, error);
      return null;
    }
  },

  // Save section data to localStorage
  saveSectionData(section, data) {
    try {
      // Map section name to storage key
      const key = STORAGE_KEYS[section.toUpperCase()] || `portfolio_${section.toLowerCase()}`;
      
      // Stringify and save data
      localStorage.setItem(key, JSON.stringify(data));
      
      // Update last update timestamp
      localStorage.setItem(STORAGE_KEYS.LAST_UPDATE, Date.now().toString());
      
      // Dispatch custom event for local updates
      window.dispatchEvent(new CustomEvent('localDataChanged', {
        detail: { key }
      }));
      
      return true;
    } catch (error) {
      console.error(`Error saving ${section} data:`, error);
      return false;
    }
  },

  // Increment portfolio views count
  incrementPortfolioViews() {
    try {
      const views = parseInt(localStorage.getItem(STORAGE_KEYS.VIEWS) || '0', 10);
      localStorage.setItem(STORAGE_KEYS.VIEWS, (views + 1).toString());
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  },

  // Get portfolio views count
  getPortfolioViews() {
    return parseInt(localStorage.getItem(STORAGE_KEYS.VIEWS) || '0', 10);
  },

  // Fetch hero data from API
  async fetchHeroData() {
    try {
      console.log('portfolioService: Fetching hero data from API...');
      const response = await api.get('/api/admin/hero');
      console.log('portfolioService: Hero API response:', response.data);
      
      if (response.data) {
        // Check if bio and aboutImageUrl exist in the response
        console.log('portfolioService: About fields in API response:', {
          bio: response.data.bio,
          aboutImageUrl: response.data.aboutImageUrl
        });
        
        // Transform backend data to frontend format
        const heroData = {
          greeting: response.data.greeting || "Hello, I'm",
          name: response.data.name || "",
          lastName: response.data.last_name || "",
          description: response.data.description || "",
          jobTitle: response.data.job_title || "",
          stats: response.data.stats || [],
          buttonText: response.data.button_text || "Get In Touch",
          profileImageUrl: response.data.profile_image_url || null,
          // Add new about fields
          bio: response.data.bio || "",
          aboutImageUrl: response.data.aboutImageUrl || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          location: response.data.location || "",
          socialLinks: {
            linkedin: response.data.linkedin_url || "",
            github: response.data.github_url || "",
            twitter: response.data.twitter_url || "",
            instagram: response.data.instagram_url || ""
          }
        };

        console.log('portfolioService: Transformed hero data:', heroData);
        console.log('portfolioService: About fields in transformed data:', {
          bio: heroData.bio,
          aboutImageUrl: heroData.aboutImageUrl
        });

        // Save to localStorage
        this.saveSectionData('personalInfo', heroData);
        return heroData;
      }
      return null;
    } catch (error) {
      console.error('Error fetching hero data:', error);
      return null;
    }
  },

  // Update hero data via API
  async updateHeroData(heroData) {
    try {
      console.log('portfolioService: Updating hero data:', heroData);
      console.log('portfolioService: About fields in update:', {
        bio: heroData.bio,
        aboutImageUrl: heroData.aboutImageUrl
      });
      
      // Transform frontend data to backend format
      const backendData = {
        greeting: heroData.greeting,
        name: heroData.name,
        last_name: heroData.lastName,
        description: heroData.description,
        job_title: heroData.jobTitle,
        button_text: heroData.buttonText,
        profile_image_url: heroData.profileImageUrl,
        // Add new about fields
        bio: heroData.bio,
        aboutImageUrl: heroData.aboutImageUrl,
        email: heroData.email,
        phone: heroData.phone,
        location: heroData.location,
        linkedin_url: heroData.socialLinks?.linkedin,
        github_url: heroData.socialLinks?.github,
        twitter_url: heroData.socialLinks?.twitter,
        instagram_url: heroData.socialLinks?.instagram,
        stats: heroData.stats
      };

      console.log('portfolioService: Transformed backend data for update:', backendData);

      const response = await api.put('/api/admin/hero', backendData);
      console.log('portfolioService: Update hero response:', response.data);
      
      if (response.data.success) {
        // Save to localStorage
        this.saveSectionData('personalInfo', heroData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating hero data:', error);
      return false;
    }
  },

  // Fetch education data from API
  async fetchEducationData() {
    try {
      console.log('Fetching education data from API...');
      const response = await api.get('/api/admin/education');
      console.log('Education API response:', response);
      if (response.data) {
        // Save to localStorage
        this.saveSectionData('education', response.data);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching education data:', error);
      return null;
    }
  },

  // Create a new education entry
  async createEducation(educationData) {
    try {
      const response = await api.post('/api/admin/education', educationData);
      if (response.data.success) {
        // Fetch updated data after creation
        await this.fetchEducationData();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating education entry:', error);
      return false;
    }
  },

  // Update an education entry
  async updateEducation(id, educationData) {
    try {
      const response = await api.put(`/api/admin/education/${id}`, educationData);
      if (response.data.success) {
        // Fetch updated data after update
        await this.fetchEducationData();
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error updating education entry with ID ${id}:`, error);
      return false;
    }
  },

  // Delete an education entry
  async deleteEducation(id) {
    try {
      const response = await api.delete(`/api/admin/education/${id}`);
      if (response.data.success) {
        // Fetch updated data after deletion
        await this.fetchEducationData();
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error deleting education entry with ID ${id}:`, error);
      return false;
    }
  },

  // Fetch experience data from API
  async fetchExperienceData() {
    try {
      console.log('Fetching experience data from API...');
      
      // Log the API URL
      console.log('API URL:', api.defaults.baseURL + '/api/admin/experience');
      
      try {
        // First check if the API endpoint is accessible
        console.log('Testing API connection...');
        const testResponse = await api.get('/api/admin/experience/check');
        console.log('API test response:', testResponse.data);
      } catch (testError) {
        console.error('API test connection failed:', testError);
      }
      
      // Make the actual request
      console.log('Making main API request for experience data...');
      const response = await api.get('/api/admin/experience');
      
      console.log('Experience API response status:', response.status);
      console.log('Experience API response data:', response.data);
      
      if (response.data) {
        // Check the data structure
        console.log('Data type:', typeof response.data);
        console.log('Is array:', Array.isArray(response.data));
        console.log('Data length:', Array.isArray(response.data) ? response.data.length : 'N/A');
        
        // Save to localStorage
        this.saveSectionData('experience', response.data);
        return response.data;
      } else {
        console.log('No data received from API');
      }
      return null;
    } catch (error) {
      console.error('Error fetching experience data:', error);
      console.error('Error details:', error.message);
      
      if (error.response) {
        // The request was made and the server responded with an error status
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
        console.error('Error data:', error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      }
      
      return null;
    }
  },

  // Create a new experience entry
  async createExperience(experienceData) {
    try {
      const response = await api.post('/api/admin/experience', experienceData);
      if (response.data.success) {
        // Fetch updated data after creation
        await this.fetchExperienceData();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating experience entry:', error);
      return false;
    }
  },

  // Update an experience entry
  async updateExperience(id, experienceData) {
    try {
      const response = await api.put(`/api/admin/experience/${id}`, experienceData);
      if (response.data.success) {
        // Fetch updated data after update
        await this.fetchExperienceData();
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error updating experience entry with ID ${id}:`, error);
      return false;
    }
  },

  // Delete an experience entry
  async deleteExperience(id) {
    try {
      const response = await api.delete(`/api/admin/experience/${id}`);
      if (response.data.success) {
        // Fetch updated data after deletion
        await this.fetchExperienceData();
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error deleting experience entry with ID ${id}:`, error);
      return false;
    }
  },

  // Authentication methods
  async login(email, password) {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      if (response.data && response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  },

  async logout() {
    localStorage.removeItem('authToken');
    return true;
  },

  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  },

  // Fetch about data from API with improved error handling
  async fetchAboutData() {
    try {
      console.log('Fetching about data from API...');
      
      // Log the API URL
      console.log('API URL:', api.defaults.baseURL + '/api/admin/about');
      
      // Before making the actual request, check if the server is responding
      try {
        console.log('Testing if server is alive...');
        const serverCheckResponse = await fetch('http://localhost:5000/api', {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });
        
        console.log('Server check status:', serverCheckResponse.status);
        if (!serverCheckResponse.ok) {
          console.warn('Server check failed with status:', serverCheckResponse.status);
        }
      } catch (serverCheckError) {
        console.error('Server is not responding properly:', serverCheckError);
        throw new Error('Backend server may not be running. Please start the server.');
      }
      
      // Enhanced error handling for API calls
      try {
        console.log('Making main API request for about data...');
        const response = await api.get('/api/admin/about', {
          validateStatus: function (status) {
            return status < 500; // Accept all non-500 responses for diagnosis
          }
        });
        
        console.log('About API response status:', response.status);
        
        if (response.status === 200 && response.data) {
          // Check the data structure
          console.log('Data type:', typeof response.data);
          console.log('Is array:', Array.isArray(response.data));
          console.log('Data length:', Array.isArray(response.data) ? response.data.length : 'N/A');
          
          // Save to localStorage
          this.saveSectionData('about', response.data);
          return response.data;
        } else {
          console.warn('Non-success response:', response.status, response.data);
          return [];
        }
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with an error status
          console.error('Error status:', error.response.status);
          
          // Log the data if it's not JSON
          if (error.response.data && typeof error.response.data === 'string' && 
              error.response.data.includes('<!DOCTYPE')) {
            console.error('Received HTML instead of JSON. Server may have crashed.');
            throw new Error('Server returned HTML instead of JSON. Backend may have an error.');
          }
          
          console.error('Error data:', error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('No response received:', error.request);
          throw new Error('No response from server. Backend may not be running.');
        }
        
        throw error; // Rethrow to handle in component
      }
    } catch (error) {
      console.error('Error fetching about data:', error);
      console.error('Error details:', error.message);
      
      throw error; // Allow component to handle the error
    }
  },

  // Create a new about entry with improved logging
  async createAbout(aboutData) {
    try {
      console.log('Creating about entry with data:', aboutData);
      const response = await api.post('/api/admin/about', aboutData);
      console.log('Create about response:', response);
      
      if (response.data && response.data.success) {
        // Fetch updated data after creation
        await this.fetchAboutData();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating about entry:', error);
      console.error('Error details:', error.message);
      
      if (error.response) {
        console.error('Server responded with:', error.response.data);
      }
      
      throw error; // Rethrow to allow handling in the component
    }
  },

  // Update an about entry with improved logging
  async updateAbout(id, aboutData) {
    try {
      console.log(`Updating about entry with ID ${id}:`, aboutData);
      const response = await api.put(`/api/admin/about/${id}`, aboutData);
      console.log('Update about response:', response);
      
      if (response.data && response.data.success) {
        // Fetch updated data after update
        await this.fetchAboutData();
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error updating about entry with ID ${id}:`, error);
      console.error('Error details:', error.message);
      
      if (error.response) {
        console.error('Server responded with:', error.response.data);
      }
      
      throw error; // Rethrow to allow handling in the component
    }
  },

  // Delete an about entry with improved logging
  async deleteAbout(id) {
    try {
      console.log(`Deleting about entry with ID ${id}`);
      const response = await api.delete(`/api/admin/about/${id}`);
      console.log('Delete about response:', response);
      
      if (response.data && response.data.success) {
        // Fetch updated data after deletion
        await this.fetchAboutData();
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error deleting about entry with ID ${id}:`, error);
      console.error('Error details:', error.message);
      
      if (error.response) {
        console.error('Server responded with:', error.response.data);
      }
      
      throw error; // Rethrow to allow handling in the component
    }
  },

  // Fetch skills data from API
  async fetchSkillsData() {
    try {
      console.log('Fetching skills data from API...');
      const response = await api.get('/api/admin/skills');
      console.log('Skills API response:', response.data);
      
      if (response.data) {
        // Save to localStorage
        this.saveSectionData('skills', response.data);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching skills data:', error);
      return null;
    }
  },

  // Create a new skill
  async createSkill(skillData) {
    try {
      console.log('portfolioService: Creating skill with data:', skillData);
      const response = await api.post('/api/admin/skills', skillData);
      console.log('portfolioService: Create skill response:', response.data);
      
      if (response.data && response.data.success) {
        // Fetch updated data after creation
        await this.fetchSkillsData();
        return true;
      }
      console.log('portfolioService: Create skill failed - success flag not true');
      return false;
    } catch (error) {
      console.error('portfolioService: Error creating skill:', error);
      if (error.response) {
        console.error('portfolioService: Server responded with error:', error.response.data);
      }
      return false;
    }
  },

  // Update a skill
  async updateSkill(id, skillData) {
    try {
      console.log(`portfolioService: Updating skill ${id} with data:`, skillData);
      const response = await api.put(`/api/admin/skills/${id}`, skillData);
      console.log('portfolioService: Update skill response:', response.data);
      
      if (response.data && response.data.success) {
        // Fetch updated data after update
        await this.fetchSkillsData();
        return true;
      }
      console.log('portfolioService: Update skill failed - success flag not true');
      return false;
    } catch (error) {
      console.error(`portfolioService: Error updating skill ${id}:`, error);
      if (error.response) {
        console.error('portfolioService: Server responded with error:', error.response.data);
      }
      return false;
    }
  },

  // Delete a skill
  async deleteSkill(id) {
    try {
      console.log(`portfolioService: Deleting skill ${id}`);
      const response = await api.delete(`/api/admin/skills/${id}`);
      console.log('portfolioService: Delete skill response:', response.data);
      
      if (response.data && response.data.success) {
        // Fetch updated data after deletion
        await this.fetchSkillsData();
        return true;
      }
      console.log('portfolioService: Delete skill failed - success flag not true');
      return false;
    } catch (error) {
      console.error(`portfolioService: Error deleting skill ${id}:`, error);
      if (error.response) {
        console.error('portfolioService: Server responded with error:', error.response.data);
      }
      return false;
    }
  }
};

export default portfolioService; 
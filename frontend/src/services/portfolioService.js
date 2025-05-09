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

  // API methods for backend integration
  async fetchHeroData() {
    try {
      const response = await api.get('/api/admin/hero');
      if (response.data) {
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
      // Transform frontend data to backend format
      const backendData = {
        greeting: heroData.greeting,
        name: heroData.name,
        last_name: heroData.lastName,
        description: heroData.description,
        job_title: heroData.jobTitle,
        button_text: heroData.buttonText,
        profile_image_url: heroData.profileImageUrl,
        email: heroData.email,
        phone: heroData.phone,
        location: heroData.location,
        linkedin_url: heroData.socialLinks?.linkedin,
        github_url: heroData.socialLinks?.github,
        twitter_url: heroData.socialLinks?.twitter,
        instagram_url: heroData.socialLinks?.instagram,
        stats: heroData.stats
      };

      const response = await api.put('/api/admin/hero', backendData);
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
  }
};

export default portfolioService; 
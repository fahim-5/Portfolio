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

  // Clear all portfolio data from localStorage
  clearLocalStorage() {
    console.log('Clearing all portfolio data from localStorage...');
    
    // Remove all portfolio-related items
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log('localStorage cleared for portfolio data');
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
      // Clear localStorage to ensure we only use database data
      this.clearLocalStorage();
      
      console.log('portfolioService: Fetching hero data from API...');
      
      // First try the public endpoint
      let response;
      try {
        console.log('Trying public hero endpoint...');
        response = await api.get('/api/hero');
      } catch (publicError) {
        console.error('Error fetching from public endpoint, trying admin endpoint:', publicError);
        // Fallback to admin endpoint
        response = await api.get('/api/admin/hero');
      }
      
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

        // No localStorage saving, return data directly
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
        // Return data directly without saving to localStorage
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
        
        // Return data directly without saving to localStorage
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
        // Return data directly without saving to localStorage
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
  },

  // Fetch projects data from API
  async fetchProjectsData() {
    try {
      console.log('portfolioService: Fetching projects data from API...');
      
      // First try direct connection to check DB availability
      try {
        console.log('Checking database status via /api/db-check endpoint');
        const dbCheckRes = await fetch('http://localhost:5000/api/db-check', {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          cache: 'no-store'
        });
        
        if (dbCheckRes.ok) {
          const dbStatus = await dbCheckRes.json();
          console.log('Database status:', dbStatus);
          
          if (!dbStatus.dbConnected) {
            console.error('Database is not connected.');
            throw new Error('Database connection failed: ' + dbStatus.error);
          }
          
          if (!dbStatus.projectsTableExists) {
            console.error('Projects table does not exist');
            throw new Error('Projects table does not exist in the database');
          }
        }
      } catch (dbCheckError) {
        console.error('Error checking database status:', dbCheckError);
        throw dbCheckError; // Re-throw to abort the process
      }
      
      // Try both API endpoints - first the non-admin route
      let projectsData = null;
      
      try {
        console.log('Trying public projects endpoint: /api/projects');
        const publicRes = await fetch('http://localhost:5000/api/projects', {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          cache: 'no-store'
        });
        
        if (publicRes.ok) {
          projectsData = await publicRes.json();
          console.log('Successfully fetched projects from public endpoint:', projectsData);
        } else {
          console.log('Public endpoint returned status:', publicRes.status);
          throw new Error(`Public endpoint returned status: ${publicRes.status}`);
        }
      } catch (publicError) {
        console.error('Error fetching from public endpoint:', publicError);
        
        try {
          console.log('Trying admin projects endpoint: /api/admin/projects');
          
          // Check for auth token
          const token = localStorage.getItem('authToken');
          const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          };
          
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }
          
          const adminRes = await fetch('http://localhost:5000/api/admin/projects', {
            method: 'GET',
            headers,
            credentials: 'include',
            cache: 'no-store'
          });
          
          if (adminRes.ok) {
            projectsData = await adminRes.json();
            console.log('Successfully fetched projects from admin endpoint:', projectsData);
          } else {
            console.log('Admin endpoint returned status:', adminRes.status);
            throw new Error(`Admin endpoint returned status: ${adminRes.status}`);
          }
        } catch (adminError) {
          console.error('Error fetching from admin endpoint:', adminError);
          throw adminError; // Re-throw to abort the process
        }
      }
      
      // If we got data from either endpoint, process it
      if (projectsData && Array.isArray(projectsData)) {
        // Normalize data format - fix image field if needed
        const normalizedData = projectsData.map(project => ({
          id: project.id || Date.now() + Math.floor(Math.random() * 1000),
          title: project.title || 'Untitled Project',
          category: project.category || 'Uncategorized',
          description: project.description || '',
          // Handle both image and imageUrl fields
          image: project.image || project.imageUrl || 'https://placehold.co/800x600/gray/white?text=No+Image',
          technologies: project.technologies || '',
          demoUrl: project.demoUrl || '',
          repoUrl: project.repoUrl || ''
        }));
        
        return normalizedData;
      }
      
      // If no data was retrieved, return empty array
      console.warn('No projects data available from API');
      return [];
    } catch (error) {
      console.error('Error fetching projects data:', error);
      throw error; // Re-throw the error to be handled by the component
    }
  },

  // Create a new project
  async createProject(projectData) {
    try {
      const response = await api.post('/api/admin/projects', projectData);
      if (response.data.success) {
        // Fetch updated data after creation
        await this.fetchProjectsData();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating project:', error);
      return false;
    }
  },

  // Update a project
  async updateProject(id, projectData) {
    try {
      console.log(`Attempting to update project with ID: ${id}`, projectData);
      
      // Check if we have an auth token
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No authentication token found for update operation');
        return false;
      }
      
      // Use fetch API for better control
      const response = await fetch(`http://localhost:5000/api/admin/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        },
        credentials: 'include',
        body: JSON.stringify(projectData)
      });
      
      console.log(`Update project response status: ${response.status}`);
      
      if (!response.ok) {
        // Try to get error details
        try {
          const errorData = await response.json();
          console.error('Update project failed:', errorData);
          throw new Error(errorData.message || `Failed to update project. Status: ${response.status}`);
        } catch (parseError) {
          console.error('Error parsing update project response:', parseError);
          throw new Error(`Failed to update project. Status: ${response.status}`);
        }
      }
      
      const data = await response.json();
      console.log('Update project response data:', data);
      
      if (data.success) {
        // Fetch updated data after update
        await this.fetchProjectsData();
        return true;
      } else {
        console.error('Update operation returned success: false', data.message);
        return false;
      }
    } catch (error) {
      console.error('Error updating project:', error);
      
      if (error.response) {
        console.error('Server responded with error:', error.response.data);
        console.error('Status code:', error.response.status);
      } else if (error.request) {
        console.error('No response received from server');
      } else {
        console.error('Error message:', error.message);
      }
      
      throw error; // Rethrow to allow component to handle it
    }
  },

  // Delete a project
  async deleteProject(id) {
    try {
      console.log(`Attempting to delete project with ID: ${id}`);
      
      // Check if we have an auth token
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No authentication token found for delete operation');
        return false;
      }
      
      // Use fetch API for better control
      const response = await fetch(`http://localhost:5000/api/admin/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        },
        credentials: 'include'
      });
      
      console.log(`Delete project response status: ${response.status}`);
      
      if (!response.ok) {
        // Try to get error details
        try {
          const errorData = await response.json();
          console.error('Delete project failed:', errorData);
          throw new Error(errorData.message || `Failed to delete project. Status: ${response.status}`);
        } catch (parseError) {
          console.error('Error parsing delete project response:', parseError);
          throw new Error(`Failed to delete project. Status: ${response.status}`);
        }
      }
      
      const data = await response.json();
      console.log('Delete project response data:', data);
      
      if (data.success) {
        // Fetch updated data after deletion
        await this.fetchProjectsData();
        return true;
      } else {
        console.error('Delete operation returned success: false', data.message);
        return false;
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      
      if (error.response) {
        console.error('Server responded with error:', error.response.data);
        console.error('Status code:', error.response.status);
      } else if (error.request) {
        console.error('No response received from server');
      } else {
        console.error('Error message:', error.message);
      }
      
      throw error; // Rethrow to allow component to handle it
    }
  },

  // Fetch pictures data from API
  async fetchPicturesData() {
    try {
      console.log('portfolioService: Fetching pictures data from API...');
      
      // Use only port 5000 as specified
      const baseURL = 'http://localhost:5000';
      console.log(`Fetching pictures from ${baseURL}/api/pictures`);
      
      const response = await fetch(`${baseURL}/api/pictures`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`Response status from ${baseURL}/api/pictures:`, response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch pictures: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Pictures data received from server:', data);
      
      return data;
    } catch (error) {
      console.error('Error fetching pictures data:', error);
      throw error;
    }
  },
  
  // Create new picture
  async createPicture(pictureData) {
    try {
      console.log('Creating picture:', pictureData);
      
      // Use only port 5000 as specified
      const baseURL = 'http://localhost:5000';
      console.log(`Creating picture at ${baseURL}/api/pictures`);
      
      const response = await fetch(`${baseURL}/api/pictures`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // Removed auth token for testing
        },
        body: JSON.stringify(pictureData)
      });
      
      console.log(`Response status from ${baseURL}/api/pictures:`, response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to create picture: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Picture created successfully:', result);
      
      return result;
    } catch (error) {
      console.error('Error creating picture:', error);
      throw error;
    }
  },
  
  // Update picture
  async updatePicture(id, pictureData) {
    try {
      console.log(`Updating picture ${id}:`, pictureData);
      
      // Use only port 5000 as specified
      const baseURL = 'http://localhost:5000';
      console.log(`Updating picture at ${baseURL}/api/pictures/${id}`);
      
      // Convert ID to number if it's a string
      const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
      
      if (isNaN(numericId)) {
        throw new Error(`Invalid picture ID: ${id}`);
      }
      
      const response = await fetch(`${baseURL}/api/pictures/${numericId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
          // Removed auth token for testing
        },
        body: JSON.stringify(pictureData)
      });
      
      console.log(`Response status from ${baseURL}/api/pictures/${numericId}:`, response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        throw new Error(`Failed to update picture: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Picture updated successfully:', result);
      
      return result;
    } catch (error) {
      console.error('Error updating picture:', error);
      throw error;
    }
  },
  
  // Delete picture
  async deletePicture(id) {
    try {
      console.log(`Deleting picture ${id}`);
      
      // Use only port 5000 as specified
      const baseURL = 'http://localhost:5000';
      console.log(`Deleting picture at ${baseURL}/api/pictures/${id}`);
      
      // Convert ID to number if it's a string
      const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
      
      if (isNaN(numericId)) {
        throw new Error(`Invalid picture ID: ${id}`);
      }
      
      const response = await fetch(`${baseURL}/api/pictures/${numericId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
          // Removed auth token for testing
        }
      });
      
      console.log(`Response status from ${baseURL}/api/pictures/${numericId}:`, response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        throw new Error(`Failed to delete picture: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Picture deleted successfully:', result);
      
      return result;
    } catch (error) {
      console.error('Error deleting picture:', error);
      throw error;
    }
  },

  // Fetch references data from API
  async fetchReferencesData() {
    try {
      console.log('portfolioService: Fetching references data from API...');
      
      // Use only port 5000 as specified
      const baseURL = 'http://localhost:5000';
      console.log(`Fetching references from ${baseURL}/api/references`);
      
      const response = await fetch(`${baseURL}/api/references`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`Response status from ${baseURL}/api/references:`, response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch references: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('References data received from server:', data);
      
      return data;
    } catch (error) {
      console.error('Error fetching references data:', error);
      throw error;
    }
  },
  
  // Create new reference
  async createReference(referenceData) {
    try {
      console.log('Creating reference:', referenceData);
      
      // Use only port 5000 as specified
      const baseURL = 'http://localhost:5000';
      console.log(`Creating reference at ${baseURL}/api/references`);
      
      const response = await fetch(`${baseURL}/api/references`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // Removed auth token for testing
        },
        body: JSON.stringify(referenceData)
      });
      
      console.log(`Response status from ${baseURL}/api/references:`, response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to create reference: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Reference created successfully:', result);
      
      return result;
    } catch (error) {
      console.error('Error creating reference:', error);
      throw error;
    }
  },
  
  // Update reference
  async updateReference(id, referenceData) {
    try {
      console.log(`Updating reference ${id}:`, referenceData);
      
      // Use only port 5000 as specified
      const baseURL = 'http://localhost:5000';
      console.log(`Updating reference at ${baseURL}/api/references/${id}`);
      
      // Convert ID to number if it's a string
      const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
      
      if (isNaN(numericId)) {
        throw new Error(`Invalid reference ID: ${id}`);
      }
      
      const response = await fetch(`${baseURL}/api/references/${numericId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
          // Removed auth token for testing
        },
        body: JSON.stringify(referenceData)
      });
      
      console.log(`Response status from ${baseURL}/api/references/${numericId}:`, response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        throw new Error(`Failed to update reference: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Reference updated successfully:', result);
      
      return result;
    } catch (error) {
      console.error('Error updating reference:', error);
      throw error;
    }
  },
  
  // Delete reference
  async deleteReference(id) {
    try {
      console.log(`Deleting reference ${id}`);
      
      // Use only port 5000 as specified
      const baseURL = 'http://localhost:5000';
      console.log(`Deleting reference at ${baseURL}/api/references/${id}`);
      
      // Convert ID to number if it's a string
      const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
      
      if (isNaN(numericId)) {
        throw new Error(`Invalid reference ID: ${id}`);
      }
      
      const response = await fetch(`${baseURL}/api/references/${numericId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
          // Removed auth token for testing
        }
      });
      
      console.log(`Response status from ${baseURL}/api/references/${numericId}:`, response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        throw new Error(`Failed to delete reference: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Reference deleted successfully:', result);
      
      return result;
    } catch (error) {
      console.error('Error deleting reference:', error);
      throw error;
    }
  }
};

export default portfolioService; 
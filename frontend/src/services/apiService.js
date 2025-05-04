import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// API service for interacting with the backend
const apiService = {
  // User profile endpoints
  getUserProfile: async (userId = 1) => {
    try {
      const response = await api.get(`/profile/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },
  
  updateUserProfile: async (userId = 1, profileData) => {
    try {
      const response = await api.put(`/profile/${userId}`, profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },
  
  uploadProfileImage: async (userId = 1, file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await axios.post(`${API_URL}/profile/avatar/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw error;
    }
  },
  
  uploadAboutImage: async (userId = 1, file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await axios.post(`${API_URL}/profile/about-image/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error uploading about image:', error);
      throw error;
    }
  },
  
  // Projects endpoints
  getProjects: async () => {
    try {
      const response = await api.get('/projects');
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },
  
  // Education endpoints
  getEducation: async () => {
    try {
      const response = await api.get('/education');
      return response.data;
    } catch (error) {
      console.error('Error fetching education:', error);
      throw error;
    }
  },
  
  // Experience endpoints
  getExperience: async () => {
    try {
      const response = await api.get('/experience');
      return response.data;
    } catch (error) {
      console.error('Error fetching experience:', error);
      throw error;
    }
  },
  
  // Skills endpoints
  getSkills: async () => {
    try {
      const response = await api.get('/skills');
      return response.data;
    } catch (error) {
      console.error('Error fetching skills:', error);
      throw error;
    }
  },
  
  // Generic upload endpoint
  uploadFile: async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await axios.post(`${API_URL}/upload/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }
};

export default apiService; 
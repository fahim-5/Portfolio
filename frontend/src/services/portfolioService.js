const API_BASE_URL = process.env.REACT_APP_API_URL;

const portfolioService = {
  // Generic method to fetch section data
  getSectionData: async (section) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/${section}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${section} data:`, error);
      throw error;
    }
  },

  // Generic method to save/update an entry
  saveEntry: async (section, entry) => {
    const isUpdate = entry.id;
    const url = isUpdate 
      ? `${API_BASE_URL}/api/${section}/${entry.id}`
      : `${API_BASE_URL}/api/${section}`;

    try {
      const response = await fetch(url, {
        method: isUpdate ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(entry)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error saving ${section} entry:`, error);
      throw error;
    }
  },

  // Generic method to delete an entry
  deleteEntry: async (section, id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/${section}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error deleting ${section} entry:`, error);
      throw error;
    }
  },

  // Education-specific methods
  getEducation: async () => {
    return this.getSectionData('education');
  },

  saveEducation: async (education) => {
    return this.saveEntry('education', education);
  },

  deleteEducation: async (id) => {
    return this.deleteEntry('education', id);
  },

  // Add similar methods for other sections as needed
  // (experience, skills, projects, etc.)

  // Views tracking (if implemented in backend)
  incrementPortfolioViews: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/analytics/views`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error incrementing views:', error);
      throw error;
    }
  },

  getPortfolioViews: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/analytics/views`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.views;
    } catch (error) {
      console.error('Error fetching views:', error);
      throw error;
    }
  }
};

export default portfolioService;
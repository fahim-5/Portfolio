const Experience = require('../models/experienceModel');

// Controller methods for experience routes
const experienceController = {
  // Get all experience entries
  getAllExperience: async (req, res) => {
    try {
      console.log('Fetching all experience entries...');
      
      // Log database connection info
      console.log('Database connection active in experienceController.getAllExperience');
      
      // Attempt to fetch data
      const experience = await Experience.getAll();
      
      console.log('Experience data retrieved:', experience);
      console.log('Number of experience records:', experience ? experience.length : 0);
      
      res.json(experience);
    } catch (error) {
      console.error('Error fetching experience data:', error);
      console.error('Error details:', error.message, error.stack);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch experience data', 
        error: error.message 
      });
    }
  },

  // Get a single experience entry by ID
  getExperienceById: async (req, res) => {
    try {
      const id = req.params.id;
      const experience = await Experience.getById(id);
      
      if (!experience) {
        return res.status(404).json({ 
          success: false, 
          message: 'Experience entry not found' 
        });
      }
      
      res.json(experience);
    } catch (error) {
      console.error(`Error fetching experience with ID ${req.params.id}:`, error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch experience entry', 
        error: error.message 
      });
    }
  },

  // Create a new experience entry
  createExperience: async (req, res) => {
    try {
      console.log('Creating experience entry with data:', req.body);
      const experienceData = {
        position: req.body.position,
        company: req.body.company,
        location: req.body.location,
        period: req.body.period,
        description: req.body.description
      };
      
      const id = await Experience.create(experienceData);
      console.log('Created experience entry with ID:', id);
      
      res.status(201).json({ 
        success: true, 
        message: 'Experience entry created successfully', 
        id 
      });
    } catch (error) {
      console.error('Error creating experience entry:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to create experience entry', 
        error: error.message 
      });
    }
  },

  // Update an experience entry
  updateExperience: async (req, res) => {
    try {
      const id = req.params.id;
      const experienceData = {
        position: req.body.position,
        company: req.body.company,
        location: req.body.location,
        period: req.body.period,
        description: req.body.description
      };
      
      const success = await Experience.update(id, experienceData);
      
      if (!success) {
        return res.status(404).json({ 
          success: false, 
          message: 'Experience entry not found or no changes made' 
        });
      }
      
      res.json({ 
        success: true, 
        message: 'Experience entry updated successfully' 
      });
    } catch (error) {
      console.error(`Error updating experience with ID ${req.params.id}:`, error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to update experience entry', 
        error: error.message 
      });
    }
  },

  // Delete an experience entry
  deleteExperience: async (req, res) => {
    try {
      const id = req.params.id;
      const success = await Experience.delete(id);
      
      if (!success) {
        return res.status(404).json({ 
          success: false, 
          message: 'Experience entry not found' 
        });
      }
      
      res.json({ 
        success: true, 
        message: 'Experience entry deleted successfully' 
      });
    } catch (error) {
      console.error(`Error deleting experience with ID ${req.params.id}:`, error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to delete experience entry', 
        error: error.message 
      });
    }
  }
};

module.exports = experienceController; 
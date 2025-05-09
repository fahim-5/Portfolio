const Education = require('../models/educationModel');

// Controller methods for education routes
const educationController = {
  // Get all education entries
  getAllEducation: async (req, res) => {
    try {
      console.log('Fetching all education entries...');
      const education = await Education.getAll();
      console.log('Education data retrieved:', education);
      res.json(education);
    } catch (error) {
      console.error('Error fetching education data:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch education data', 
        error: error.message 
      });
    }
  },

  // Get a single education entry by ID
  getEducationById: async (req, res) => {
    try {
      const id = req.params.id;
      const education = await Education.getById(id);
      
      if (!education) {
        return res.status(404).json({ 
          success: false, 
          message: 'Education entry not found' 
        });
      }
      
      res.json(education);
    } catch (error) {
      console.error(`Error fetching education with ID ${req.params.id}:`, error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch education entry', 
        error: error.message 
      });
    }
  },

  // Create a new education entry
  createEducation: async (req, res) => {
    try {
      console.log('Creating education entry with data:', req.body);
      const educationData = {
        degree: req.body.degree,
        institution: req.body.institution,
        location: req.body.location,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        current: req.body.current || false,
        description: req.body.description
      };
      
      const id = await Education.create(educationData);
      console.log('Created education entry with ID:', id);
      
      res.status(201).json({ 
        success: true, 
        message: 'Education entry created successfully', 
        id 
      });
    } catch (error) {
      console.error('Error creating education entry:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to create education entry', 
        error: error.message 
      });
    }
  },

  // Update an education entry
  updateEducation: async (req, res) => {
    try {
      const id = req.params.id;
      const educationData = {
        degree: req.body.degree,
        institution: req.body.institution,
        location: req.body.location,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        current: req.body.current || false,
        description: req.body.description
      };
      
      const success = await Education.update(id, educationData);
      
      if (!success) {
        return res.status(404).json({ 
          success: false, 
          message: 'Education entry not found or no changes made' 
        });
      }
      
      res.json({ 
        success: true, 
        message: 'Education entry updated successfully' 
      });
    } catch (error) {
      console.error(`Error updating education with ID ${req.params.id}:`, error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to update education entry', 
        error: error.message 
      });
    }
  },

  // Delete an education entry
  deleteEducation: async (req, res) => {
    try {
      const id = req.params.id;
      const success = await Education.delete(id);
      
      if (!success) {
        return res.status(404).json({ 
          success: false, 
          message: 'Education entry not found' 
        });
      }
      
      res.json({ 
        success: true, 
        message: 'Education entry deleted successfully' 
      });
    } catch (error) {
      console.error(`Error deleting education with ID ${req.params.id}:`, error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to delete education entry', 
        error: error.message 
      });
    }
  }
};

module.exports = educationController; 
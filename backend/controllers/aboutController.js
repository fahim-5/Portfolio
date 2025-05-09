const About = require('../models/aboutModel');

// Controller methods for about routes
const aboutController = {
  // Get all about entries
  getAllAbout: async (req, res) => {
    try {
      console.log('Fetching all about entries...');
      
      // Log database connection info
      console.log('Database connection active in aboutController.getAllAbout');
      
      // Attempt to fetch data
      const about = await About.getAll();
      
      console.log('About data retrieved:', about);
      console.log('Number of about records:', about ? about.length : 0);
      
      res.json(about);
    } catch (error) {
      console.error('Error fetching about data:', error);
      console.error('Error details:', error.message, error.stack);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch about data', 
        error: error.message 
      });
    }
  },

  // Get a single about entry by ID
  getAboutById: async (req, res) => {
    try {
      const id = req.params.id;
      const about = await About.getById(id);
      
      if (!about) {
        return res.status(404).json({ 
          success: false, 
          message: 'About entry not found' 
        });
      }
      
      res.json(about);
    } catch (error) {
      console.error(`Error fetching about with ID ${req.params.id}:`, error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch about entry', 
        error: error.message 
      });
    }
  },

  // Create a new about entry
  createAbout: async (req, res) => {
    try {
      console.log('Creating about entry with data:', req.body);
      const aboutData = {
        aboutImageUrl: req.body.aboutImageUrl,
        bio: req.body.bio,
        linkedin: req.body.linkedin,
        github: req.body.github,
        twitter: req.body.twitter,
        instagram: req.body.instagram
      };
      
      const id = await About.create(aboutData);
      console.log('Created about entry with ID:', id);
      
      res.status(201).json({ 
        success: true, 
        message: 'About entry created successfully', 
        id 
      });
    } catch (error) {
      console.error('Error creating about entry:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to create about entry', 
        error: error.message 
      });
    }
  },

  // Update an about entry
  updateAbout: async (req, res) => {
    try {
      const id = req.params.id;
      const aboutData = {
        aboutImageUrl: req.body.aboutImageUrl,
        bio: req.body.bio,
        linkedin: req.body.linkedin,
        github: req.body.github,
        twitter: req.body.twitter,
        instagram: req.body.instagram
      };
      
      const success = await About.update(id, aboutData);
      
      if (!success) {
        return res.status(404).json({ 
          success: false, 
          message: 'About entry not found or no changes made' 
        });
      }
      
      res.json({ 
        success: true, 
        message: 'About entry updated successfully' 
      });
    } catch (error) {
      console.error(`Error updating about with ID ${req.params.id}:`, error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to update about entry', 
        error: error.message 
      });
    }
  },

  // Delete an about entry
  deleteAbout: async (req, res) => {
    try {
      const id = req.params.id;
      const success = await About.delete(id);
      
      if (!success) {
        return res.status(404).json({ 
          success: false, 
          message: 'About entry not found' 
        });
      }
      
      res.json({ 
        success: true, 
        message: 'About entry deleted successfully' 
      });
    } catch (error) {
      console.error(`Error deleting about with ID ${req.params.id}:`, error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to delete about entry', 
        error: error.message 
      });
    }
  }
};

module.exports = aboutController; 
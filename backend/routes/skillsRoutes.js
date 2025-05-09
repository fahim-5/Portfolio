const express = require('express');
const router = express.Router();
const skillsController = require('../controllers/skillsController');
const pool = require('../config/db');
// Authentication middleware is commented out for now to allow operations
// const { authenticateToken } = require('../middleware/authMiddleware');

// All routes made public temporarily
router.get('/', skillsController.getAllSkills);
router.post('/', skillsController.createSkill);
router.put('/:id', skillsController.updateSkill);
router.delete('/:id', skillsController.deleteSkill);

// Debug route that uses direct SQL to add a test skill
router.get('/test-add', async (req, res) => {
  try {
    console.log('Attempting to add test skill via direct SQL');
    
    // First check if table exists, if not create it
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS skills (
          id INT NOT NULL AUTO_INCREMENT,
          name VARCHAR(100) NOT NULL,
          category VARCHAR(20) NOT NULL,
          level VARCHAR(20) DEFAULT NULL,
          PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
      `);
      
      // Insert test skill
      const [result] = await pool.query(
        'INSERT INTO skills (name, category, level) VALUES (?, ?, ?)',
        ['Test Skill from API', 'technical', 'intermediate']
      );
      
      // Get all skills to verify
      const [skills] = await pool.query('SELECT * FROM skills');
      
      res.json({
        success: true,
        message: 'Test skill added successfully',
        testSkillId: result.insertId,
        allSkills: skills
      });
    } catch (error) {
      console.error('Error in test-add route:', error);
      res.status(500).json({
        success: false,
        message: 'Error adding test skill',
        error: error.message
      });
    }
  } catch (error) {
    console.error('Error in test-add route:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding test skill',
      error: error.message
    });
  }
});

module.exports = router; 
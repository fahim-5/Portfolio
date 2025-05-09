const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projectsController');
const { authenticateToken, optionalAuth } = require('../middleware/authMiddleware');
const pool = require('../config/db');

// Debug middleware to log all requests
router.use((req, res, next) => {
  console.log(`Projects API request: ${req.method} ${req.originalUrl}`);
  console.log('Request headers:', JSON.stringify(req.headers));
  next();
});

// GET route with optional authentication - allows public access
router.get('/', optionalAuth, projectsController.getAllProjects);

// Admin routes with required authentication
router.post('/', authenticateToken, projectsController.createProject);
router.put('/:id', authenticateToken, projectsController.updateProject);
router.delete('/:id', authenticateToken, projectsController.deleteProject);

// Debug routes for testing
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Projects API test endpoint working' });
});

// Error handling middleware specific to projects routes
router.use((err, req, res, next) => {
  console.error('Projects API error:', err.message);
  res.status(500).json({
    success: false,
    message: 'An error occurred in the projects API',
    error: err.message
  });
});

module.exports = router; 
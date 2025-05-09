const express = require('express');
const router = express.Router();
const experienceController = require('../controllers/experienceController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Debug route to check if the experience routes are working
router.get('/check', (req, res) => {
  console.log('Experience route check endpoint hit');
  res.json({ message: 'Experience routes are working' });
});

// Public routes - no authentication required
router.get('/', experienceController.getAllExperience);
router.get('/:id', experienceController.getExperienceById);

// Protected routes - require authentication
router.post('/', authenticateToken, experienceController.createExperience);
router.put('/:id', authenticateToken, experienceController.updateExperience);
router.delete('/:id', authenticateToken, experienceController.deleteExperience);

module.exports = router; 
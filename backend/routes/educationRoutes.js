const express = require('express');
const router = express.Router();
const educationController = require('../controllers/educationController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Public routes - no authentication required
router.get('/', educationController.getAllEducation);
router.get('/:id', educationController.getEducationById);

// Protected routes - require authentication
router.post('/', authenticateToken, educationController.createEducation);
router.put('/:id', authenticateToken, educationController.updateEducation);
router.delete('/:id', authenticateToken, educationController.deleteEducation);

module.exports = router; 
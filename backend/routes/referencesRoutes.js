const express = require('express');
const router = express.Router();
const referencesController = require('../controllers/referencesController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Public routes
router.get('/', referencesController.getAllReferences);
router.get('/:id', referencesController.getReferenceById);

// Temporarily make these public for testing
router.post('/', referencesController.createReference); // Removed authentication for testing
router.put('/:id', referencesController.updateReference); // Removed authentication for testing
router.delete('/:id', referencesController.deleteReference); // Removed authentication for testing

module.exports = router; 
const express = require('express');
const router = express.Router();
const picturesController = require('../controllers/picturesController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Public routes
router.get('/', picturesController.getAllPictures);
router.get('/:id', picturesController.getPictureById);

// Temporarily make these public for testing
router.post('/', picturesController.createPicture); // Removed authentication for testing
router.put('/:id', picturesController.updatePicture); // Removed authentication for testing
router.delete('/:id', picturesController.deletePicture); // Removed authentication for testing

module.exports = router; 
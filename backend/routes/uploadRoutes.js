const express = require('express');
const { 
  uploadImage, 
  uploadMultipleImages, 
  deleteUploadedFile, 
  updateImage 
} = require('../controllers/uploadController');

const router = express.Router();

// POST /api/upload/image - Upload a single image
router.post('/image', uploadImage);

// POST /api/upload/images - Upload multiple images (max 5)
router.post('/images', uploadMultipleImages);

// DELETE /api/upload/:filename - Delete an uploaded file
router.delete('/:filename', deleteUploadedFile);

// PUT /api/upload/:table/:id - Update an image for a specific record
router.put('/:table/:id', updateImage);

module.exports = router; 
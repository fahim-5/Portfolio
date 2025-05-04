const path = require('path');
const { upload, getRelativeFilePath, deleteFile } = require('../utils/fileUpload');
const db = require('../utils/database');

/**
 * Upload a single image file
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const uploadImage = async (req, res) => {
  try {
    // Use the upload middleware (single file)
    upload.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: 'Image upload failed',
          error: err.message
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No image file provided'
        });
      }

      // Process the uploaded file
      const filePath = req.file.path;
      const relativePath = getRelativeFilePath(filePath) || req.file.filename;
      
      return res.status(201).json({
        success: true,
        message: 'Image uploaded successfully',
        file: {
          filename: req.file.filename,
          originalName: req.file.originalname,
          path: relativePath,
          size: req.file.size,
          mimetype: req.file.mimetype
        }
      });
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during upload',
      error: error.message
    });
  }
};

/**
 * Upload multiple image files
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const uploadMultipleImages = async (req, res) => {
  try {
    // Use the upload middleware (multiple files, max 5)
    upload.array('images', 5)(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: 'Image upload failed',
          error: err.message
        });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No image files provided'
        });
      }

      // Process the uploaded files
      const uploadedFiles = req.files.map(file => {
        const relativePath = getRelativeFilePath(file.path) || file.filename;
        return {
          filename: file.filename,
          originalName: file.originalname,
          path: relativePath,
          size: file.size,
          mimetype: file.mimetype
        };
      });
      
      return res.status(201).json({
        success: true,
        message: `${uploadedFiles.length} images uploaded successfully`,
        files: uploadedFiles
      });
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during upload',
      error: error.message
    });
  }
};

/**
 * Delete an uploaded file
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const deleteUploadedFile = async (req, res) => {
  try {
    const { filename } = req.params;
    
    if (!filename) {
      return res.status(400).json({
        success: false,
        message: 'Filename is required'
      });
    }

    const filePath = path.join(__dirname, '../uploads', filename);
    const success = await deleteFile(filePath);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'File not found or could not be deleted'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('File deletion error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during file deletion',
      error: error.message
    });
  }
};

/**
 * Update an image for a specific record
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const updateImage = async (req, res) => {
  try {
    const { table, id } = req.params;
    
    if (!table || !id) {
      return res.status(400).json({
        success: false,
        message: 'Table name and record ID are required'
      });
    }

    // Retrieve the existing record to get the old image path
    const record = await db.getById(table, id);
    
    if (!record) {
      return res.status(404).json({
        success: false,
        message: `Record not found in ${table} with ID ${id}`
      });
    }

    // Use the upload middleware
    upload.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: 'Image upload failed',
          error: err.message
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No image file provided'
        });
      }

      // Process the uploaded file
      const filePath = req.file.path;
      const relativePath = getRelativeFilePath(filePath) || req.file.filename;
      
      // Update the record in the database
      const updatedRecord = await db.update(table, id, { image: relativePath });

      // If there was an old image, delete it
      if (record.image) {
        const oldImagePath = path.join(__dirname, '../uploads', path.basename(record.image));
        await deleteFile(oldImagePath);
      }

      return res.status(200).json({
        success: true,
        message: 'Image updated successfully',
        file: {
          filename: req.file.filename,
          originalName: req.file.originalname,
          path: relativePath
        },
        record: updatedRecord
      });
    });
  } catch (error) {
    console.error('Image update error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during image update',
      error: error.message
    });
  }
};

module.exports = {
  uploadImage,
  uploadMultipleImages,
  deleteUploadedFile,
  updateImage
}; 
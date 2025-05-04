const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs-extra');

// Create uploads directory if it doesn't exist
const createUploadsDir = async () => {
  const uploadsDir = path.join(__dirname, '../uploads');
  await fs.ensureDir(uploadsDir);
  return uploadsDir;
};

// Configure storage
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const uploadsDir = await createUploadsDir();
      cb(null, uploadsDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    // Generate a unique filename with original extension
    const fileExt = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExt}`;
    cb(null, fileName);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Allow only images
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const isValidType = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const isValidMimeType = allowedTypes.test(file.mimetype.split('/')[1]);
  
  if (isValidType && isValidMimeType) {
    return cb(null, true);
  }
  
  cb(new Error('Invalid file type. Only JPEG, JPG, PNG, GIF, and WEBP files are allowed.'));
};

// Create multer upload instance
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
  fileFilter
});

// Function to delete a file
const deleteFile = async (filePath) => {
  try {
    await fs.remove(filePath);
    return true;
  } catch (error) {
    console.error(`Error deleting file at ${filePath}:`, error);
    return false;
  }
};

// Get relative file path for database storage
const getRelativeFilePath = (absolutePath) => {
  if (!absolutePath) return null;
  return absolutePath.split('uploads')[1].replace(/\\/g, '/');
};

module.exports = {
  upload,
  deleteFile,
  getRelativeFilePath
}; 
const path = require('path');
const { deleteFile, getRelativeFilePath } = require('../utils/fileUpload');
const PersonalInfo = require('../models/personalInfoModel'); // Adjust to your model

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const imageUrl = getRelativeFilePath(req.file.path);
    res.status(201).json({ imageUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUploadedFile = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../uploads', filename);
    
    await deleteFile(filePath);
    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const personalInfo = await PersonalInfo.findById(id);
    if (!personalInfo) {
      return res.status(404).json({ error: 'Record not found' });
    }

    // Delete old image if exists
    if (personalInfo.hero?.profileImageUrl) {
      const oldFilePath = path.join(__dirname, '../uploads', personalInfo.hero.profileImageUrl);
      await deleteFile(oldFilePath);
    }

    // Update with new image URL
    const imageUrl = getRelativeFilePath(req.file.path);
    personalInfo.hero.profileImageUrl = imageUrl;
    await personalInfo.save();

    res.status(200).json({ imageUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
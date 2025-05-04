const UserModel = require('../models/userModel');
const { upload, getRelativeFilePath, deleteFile } = require('../utils/fileUpload');
const path = require('path');

/**
 * Get user profile
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getUserProfile = async (req, res) => {
  try {
    const userId = parseInt(req.params.id || req.user?.id);
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }
    
    // Get user basic info
    const user = await UserModel.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Get user profile
    const profile = await UserModel.getUserProfileById(userId);
    
    // Get social links
    const socialLinks = await UserModel.getUserSocialLinks(userId);
    
    // Get hero stats
    const heroStats = await UserModel.getUserHeroStats(userId);
    
    // Format response
    const formattedProfile = {
      id: user.id,
      name: `${user.firstname} ${user.lastname}`.trim(),
      email: user.email,
      avatar: user.avatar,
      jobTitle: profile?.job_title || '',
      bio: profile?.bio || '',
      location: profile?.location || '',
      website: profile?.website || '',
      phone: profile?.phone || '',
      aboutImageUrl: profile?.about_image_url || '',
      hero: {
        profileImageUrl: user.avatar || '',
        greeting: profile?.hero_greeting || 'Hello, I\'m',
        description: profile?.hero_description || '',
        buttonText: profile?.hero_button_text || 'Get In Touch',
        stats: heroStats.map(stat => ({
          value: stat.value,
          label: stat.label
        }))
      },
      socialLinks: socialLinks ? {
        linkedin: socialLinks.linkedin || '',
        github: socialLinks.github || '',
        twitter: socialLinks.twitter || '',
        instagram: socialLinks.instagram || ''
      } : {}
    };
    
    return res.status(200).json({
      success: true,
      data: formattedProfile
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error getting user profile',
      error: error.message
    });
  }
};

/**
 * Update user profile
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const updateUserProfile = async (req, res) => {
  try {
    const userId = parseInt(req.params.id || req.user?.id);
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }
    
    const {
      name,
      jobTitle,
      bio,
      location,
      website,
      phone,
      email,
      hero,
      socialLinks
    } = req.body;
    
    // Check if user exists
    const user = await UserModel.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Update basic user info
    if (name) {
      const nameParts = name.split(' ');
      const firstname = nameParts[0];
      const lastname = nameParts.slice(1).join(' ');
      
      await UserModel.updateUser(userId, {
        firstname,
        lastname: lastname || '',
        email: email || user.email
      });
    } else if (email && email !== user.email) {
      await UserModel.updateUser(userId, { email });
    }
    
    // Update profile
    const profileData = {
      bio,
      location,
      website,
      job_title: jobTitle,
      phone,
      hero_greeting: hero?.greeting,
      hero_description: hero?.description,
      hero_button_text: hero?.buttonText
    };
    
    // Filter out undefined values
    Object.keys(profileData).forEach(key => {
      if (profileData[key] === undefined) {
        delete profileData[key];
      }
    });
    
    await UserModel.updateUserProfile(userId, profileData);
    
    // Update hero stats
    if (hero && Array.isArray(hero.stats)) {
      await UserModel.updateUserHeroStats(userId, hero.stats);
    }
    
    // Update social links
    if (socialLinks) {
      const socialData = {
        linkedin: socialLinks.linkedin,
        github: socialLinks.github,
        twitter: socialLinks.twitter,
        instagram: socialLinks.instagram
      };
      
      // Filter out undefined values
      Object.keys(socialData).forEach(key => {
        if (socialData[key] === undefined) {
          delete socialData[key];
        }
      });
      
      await UserModel.updateUserSocialLinks(userId, socialData);
    }
    
    // Get updated profile for response
    const updatedProfile = await getUserProfile(
      { params: { id: userId }, user: { id: userId } },
      { 
        status: (code) => ({ 
          json: (data) => data 
        })
      }
    );
    
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedProfile.data
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating user profile',
      error: error.message
    });
  }
};

/**
 * Upload profile image (avatar)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const uploadProfileImage = async (req, res) => {
  try {
    const userId = parseInt(req.params.id || req.user?.id);
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }
    
    // Check if user exists
    const user = await UserModel.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Use the upload middleware
    upload.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: 'Avatar upload failed',
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
      
      // Delete old avatar if exists
      if (user.avatar) {
        const oldAvatarPath = path.join(__dirname, '../uploads', path.basename(user.avatar));
        await deleteFile(oldAvatarPath);
      }
      
      // Update user avatar in database
      await UserModel.updateUser(userId, { avatar: relativePath });
      
      return res.status(200).json({
        success: true,
        message: 'Avatar uploaded successfully',
        data: {
          avatar: relativePath
        }
      });
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error uploading avatar',
      error: error.message
    });
  }
};

/**
 * Upload about image
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const uploadAboutImage = async (req, res) => {
  try {
    const userId = parseInt(req.params.id || req.user?.id);
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }
    
    // Check if user exists
    const user = await UserModel.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Get user profile
    const checkSql = 'SELECT id, about_image_url FROM user_profiles WHERE user_id = ?';
    const profiles = await UserModel.getUserProfileById(userId);
    
    // Use the upload middleware
    upload.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: 'About image upload failed',
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
      
      // Delete old about image if exists
      if (profiles && profiles.about_image_url) {
        const oldImagePath = path.join(__dirname, '../uploads', path.basename(profiles.about_image_url));
        await deleteFile(oldImagePath);
      }
      
      // Update about image in database
      await UserModel.updateUserProfile(userId, { about_image_url: relativePath });
      
      return res.status(200).json({
        success: true,
        message: 'About image uploaded successfully',
        data: {
          aboutImageUrl: relativePath
        }
      });
    });
  } catch (error) {
    console.error('Error uploading about image:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error uploading about image',
      error: error.message
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  uploadProfileImage,
  uploadAboutImage
}; 
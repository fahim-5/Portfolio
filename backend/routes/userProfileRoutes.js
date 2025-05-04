const express = require('express');
const {
  getUserProfile,
  updateUserProfile,
  uploadProfileImage,
  uploadAboutImage
} = require('../controllers/userProfileController');

const router = express.Router();

// Add a status check endpoint
router.get('/status', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Profile API is operational',
    timestamp: new Date().toISOString()
  });
});

// Add a mock profile endpoint for when the database is not available
router.get('/mock/1', (req, res) => {
  // Return a mock profile with default values
  return res.status(200).json({
    success: true,
    data: {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      avatar: null,
      jobTitle: 'Web Developer',
      bio: 'A passionate web developer with expertise in modern web technologies.',
      location: 'New York, USA',
      website: 'https://example.com',
      phone: '+1 (555) 123-4567',
      aboutImageUrl: null,
      hero: {
        profileImageUrl: null,
        greeting: 'Hello, I\'m',
        description: 'A Full-Stack Developer who loves building beautiful, functional websites and applications.',
        buttonText: 'Get In Touch',
        stats: [
          { value: '5+', label: 'Years Experience' },
          { value: '20+', label: 'Projects Completed' },
          { value: '10+', label: 'Happy Clients' }
        ]
      },
      socialLinks: {
        linkedin: 'https://linkedin.com/in/johndoe',
        github: 'https://github.com/johndoe',
        twitter: 'https://twitter.com/johndoe',
        instagram: 'https://instagram.com/johndoe'
      }
    }
  });
});

// Mock update endpoint
router.put('/mock/1', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      id: 1,
      ...req.body
    }
  });
});

// GET /api/profile/:id - Get user profile
router.get('/:id', getUserProfile);

// GET /api/profile - Get current user profile
router.get('/', getUserProfile);

// PUT /api/profile/:id - Update user profile
router.put('/:id', updateUserProfile);

// PUT /api/profile - Update current user profile
router.put('/', updateUserProfile);

// POST /api/profile/avatar/:id - Upload profile image
router.post('/avatar/:id', uploadProfileImage);

// POST /api/profile/avatar - Upload current user's profile image
router.post('/avatar', uploadProfileImage);

// POST /api/profile/about-image/:id - Upload about image
router.post('/about-image/:id', uploadAboutImage);

// POST /api/profile/about-image - Upload current user's about image
router.post('/about-image', uploadAboutImage);

module.exports = router; 
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Password reset routes
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
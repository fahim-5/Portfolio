const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

const authController = {
  // Forgot password - verify email
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      
      // Check if user exists
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'Email not found' 
        });
      }

      // In a real app, you would send a password reset email here
      // For this example, we'll just return success
      res.status(200).json({ 
        success: true, 
        message: 'If this email exists in our system, you will receive a reset link'
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  },

  // Reset password
  resetPassword: async (req, res) => {
    try {
      const { email, newPassword, confirmPassword } = req.body;

      // Validate passwords match
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ 
          success: false, 
          message: 'Passwords do not match' 
        });
      }

      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update user password
      const updatedUser = await User.updatePassword(email, hashedPassword);

      if (!updatedUser) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
      }

      res.status(200).json({ 
        success: true, 
        message: 'Password updated successfully' 
      });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }
};

module.exports = authController;
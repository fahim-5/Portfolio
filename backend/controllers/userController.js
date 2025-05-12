const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

const userController = {
  // Get user profile
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Don't send password or sensitive data
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.is_admin,
        lastLogin: user.last_login,
      };

      res.status(200).json({
        success: true,
        user: userData,
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  // Update user profile
  updateProfile: async (req, res) => {
    try {
      const { name, email } = req.body;

      // Make sure user exists
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Check if email is already taken (if changing email)
      if (email !== user.email) {
        const existingUser = await User.findByEmail(email);
        if (existingUser && existingUser.id !== user.id) {
          return res.status(400).json({
            success: false,
            message: "Email already in use",
          });
        }
      }

      // Update user
      const updated = await User.updateProfile(user.id, { name, email });

      if (!updated) {
        return res.status(400).json({
          success: false,
          message: "Failed to update profile",
        });
      }

      // Get updated user data
      const updatedUser = await User.findById(user.id);

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          isAdmin: updatedUser.is_admin,
        },
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  // Update user password
  updatePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      // Validate input
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password and new password are required",
        });
      }

      // Get user
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update password - Note: This function does NOT send any emails
      // Email notifications are only sent through the forgotPassword flow
      const updated = await User.updatePassword(user.id, hashedPassword);

      if (!updated) {
        return res.status(400).json({
          success: false,
          message: "Failed to update password",
        });
      }

      res.status(200).json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error) {
      console.error("Error updating password:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
};

module.exports = userController;

const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authController = {
  // User login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check if user exists
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Update last login
      await User.updateLastLogin(user.id);

      // Create JWT token
      const token = jwt.sign(
        { userId: user.id, isAdmin: user.is_admin },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.is_admin,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  // Forgot password - verify email
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Email not found",
        });
      }

      // Generate reset token (simplified for this example)
      const resetToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || "your_secret_jwt_key_for_portfolio",
        { expiresIn: "15m" }
      );

      // Save token to database
      await User.setResetToken(user.id, resetToken);

      // In production, you would send an email here
      console.log(`Password reset token for ${email}: ${resetToken}`);

      res.status(200).json({
        success: true,
        token: resetToken, // Send token to frontend
        message: "Reset link sent to email if account exists",
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  // Reset password
  resetPassword: async (req, res) => {
    try {
      const { email, newPassword } = req.body;

      // Find user by email
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update user password and clear reset token
      await User.updatePassword(user.id, hashedPassword);

      res.status(200).json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  },
};

module.exports = authController;

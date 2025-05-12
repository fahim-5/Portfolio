const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// Configure email service for production
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "yourportfolio@gmail.com", // Replace with your email in .env
    pass: process.env.EMAIL_PASS || "your-app-password", // Replace with your app password in .env
  },
});

// Simple in-memory store for verification codes
const verificationCodes = new Map();

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

  // Forgot password - verify email and send code
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      // Check if user exists
      const user = await User.findByEmail(email);
      if (!user) {
        // Return a more user-friendly error message
        return res.status(404).json({
          success: false,
          message:
            "We couldn't find an account with that email address. Please check your email and try again.",
        });
      }

      // Generate a 6-digit verification code
      const verificationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      // Store the code with an expiration (15 minutes)
      const expiration = new Date();
      expiration.setMinutes(expiration.getMinutes() + 15);

      // Save in memory instead of database
      verificationCodes.set(email, {
        code: verificationCode,
        expiration,
        userId: user.id,
      });

      // Send verification code via email with improved template
      const mailOptions = {
        from: `"Portfolio Admin" <${
          process.env.EMAIL_USER || "yourportfolio@gmail.com"
        }>`,
        to: email,
        subject: "Portfolio Password Reset Verification Code",
        html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #e0e0e0;
              border-radius: 8px;
            }
            .header {
              background-color: #0dd3ff;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
              margin: -20px -20px 20px;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .code-container {
              background-color: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              text-align: center;
              margin: 25px 0;
              border: 1px solid #e0e0e0;
            }
            .verification-code {
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 5px;
              color: #333;
              margin: 15px 0;
            }
            .expiry {
              color: #777;
              font-size: 14px;
              margin-top: 10px;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 12px;
              color: #777;
              border-top: 1px solid #e0e0e0;
              padding-top: 20px;
            }
            .note {
              background-color: #f8f9fa;
              padding: 10px 15px;
              border-left: 4px solid #0dd3ff;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            
            <p>Hello,</p>
            
            <p>We received a request to reset your password for your Portfolio Admin account. To proceed with your password reset, please use the verification code below:</p>
            
            <div class="code-container">
              <p>Your verification code is:</p>
              <div class="verification-code">${verificationCode}</div>
              <p class="expiry">This code will expire in 15 minutes</p>
            </div>
            
            <div class="note">
              <p>If you did not request a password reset, please ignore this email or contact our support team if you have any concerns.</p>
            </div>
            
            <p>Thank you,<br>Portfolio Admin Team</p>
            
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Portfolio Admin. All rights reserved.</p>
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
        `,
      };

      // Log for server monitoring
      console.log(`Sending password reset code to ${email}`);

      try {
        // Actually send the email
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${email} with verification code`);
      } catch (emailErr) {
        console.error("Email sending error:", emailErr);
        return res.status(500).json({
          success: false,
          message: "Failed to send verification email. Please try again later.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Verification code sent to your email",
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  // Verify reset code
  verifyResetCode: async (req, res) => {
    try {
      const { email, code } = req.body;

      // Validate input
      if (!email || !code) {
        return res.status(400).json({
          success: false,
          message: "Email and verification code are required",
        });
      }

      // Get the stored verification data
      const verification = verificationCodes.get(email);

      // Verify the code exists and is valid
      if (
        !verification ||
        verification.code !== code ||
        verification.expiration < new Date()
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired verification code",
        });
      }

      // Code is valid - generate a reset token
      const resetToken = jwt.sign(
        { userId: verification.userId },
        process.env.JWT_SECRET || "your_secret_jwt_key_for_portfolio",
        { expiresIn: "15m" }
      );

      // Update verification with token
      verification.resetToken = resetToken;
      verificationCodes.set(email, verification);

      res.status(200).json({
        success: true,
        message: "Verification successful",
        token: resetToken,
      });
    } catch (error) {
      console.error("Verification error:", error);
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

      // Check if the reset is allowed
      const verification = verificationCodes.get(email);
      if (
        !verification ||
        !verification.resetToken ||
        verification.expiration < new Date()
      ) {
        return res.status(400).json({
          success: false,
          message: "Password reset token is invalid or expired",
        });
      }

      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update user password
      await User.updatePassword(user.id, hashedPassword);

      // Clear the verification code
      verificationCodes.delete(email);

      // Send confirmation email - this is only for the forgot password flow
      const confirmationMailOptions = {
        from: `"Portfolio Admin" <${
          process.env.EMAIL_USER || "yourportfolio@gmail.com"
        }>`,
        to: email,
        subject: "Your Portfolio Password Has Been Reset Successfully",
        html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset Successful</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #e0e0e0;
              border-radius: 8px;
            }
            .header {
              background-color: #4CAF50;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
              margin: -20px -20px 20px;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .success-icon {
              text-align: center;
              margin: 20px 0;
              font-size: 48px;
            }
            .message-box {
              background-color: #f1f8e9;
              border-left: 4px solid #4CAF50;
              padding: 15px;
              margin: 20px 0;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 12px;
              color: #777;
              border-top: 1px solid #e0e0e0;
              padding-top: 20px;
            }
            .button {
              display: inline-block;
              background-color: #0dd3ff;
              color: white;
              padding: 10px 20px;
              text-decoration: none;
              border-radius: 4px;
              margin-top: 15px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Successful</h1>
            </div>
            
            <div class="success-icon">✓</div>
            
            <p>Hello,</p>
            
            <p>Your password for the Portfolio Admin account has been successfully reset.</p>
            
            <div class="message-box">
              <p>You can now log in with your new password. If you did not make this change, please contact our support team immediately.</p>
            </div>
            
            <p style="text-align: center;">
              <a href="${
                process.env.FRONTEND_URL || "http://localhost:3000"
              }/admin/login" class="button">Go to Login</a>
            </p>
            
            <p>Thank you,<br>Portfolio Admin Team</p>
            
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Portfolio Admin. All rights reserved.</p>
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
        `,
      };

      try {
        await transporter.sendMail(confirmationMailOptions);
        console.log(`Password reset confirmation email sent to ${email}`);
      } catch (emailErr) {
        console.error("Confirmation email sending error:", emailErr);
        // Continue even if confirmation email fails
      }

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

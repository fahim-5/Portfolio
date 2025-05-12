const pool = require("../config/db");
const bcrypt = require("bcryptjs");

const User = {
  // Find user by email
  findByEmail: async (email) => {
    try {
      const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
        email,
      ]);
      return rows[0] || null;
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw error;
    }
  },

  // Find user by ID
  findById: async (id) => {
    try {
      const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
      return rows[0] || null;
    } catch (error) {
      console.error("Error finding user by id:", error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (userId, data) => {
    try {
      const { name, email } = data;
      const [result] = await pool.query(
        "UPDATE users SET name = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [name, email, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },

  // Update user password
  updatePassword: async (userId, passwordHash) => {
    try {
      const [result] = await pool.query(
        "UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [passwordHash, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error updating password:", error);
      throw error;
    }
  },

  // Set reset token
  setResetToken: async (userId, token) => {
    try {
      const expires = new Date();
      expires.setMinutes(expires.getMinutes() + 15); // 15 minutes from now

      // Generate a 6-digit verification code
      const verificationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      await pool.query(
        "UPDATE users SET reset_token = ?, reset_token_expires = ?, verification_code = ? WHERE id = ?",
        [token, expires, verificationCode, userId]
      );

      return verificationCode;
    } catch (error) {
      console.error("Error setting reset token:", error);
      throw error;
    }
  },

  // Verify reset code
  verifyResetCode: async (email, code) => {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM users WHERE email = ? AND verification_code = ? AND reset_token_expires > NOW()",
        [email, code]
      );

      return rows[0] || null;
    } catch (error) {
      console.error("Error verifying reset code:", error);
      throw error;
    }
  },

  // Update last login
  updateLastLogin: async (userId) => {
    try {
      await pool.query(
        "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?",
        [userId]
      );
    } catch (error) {
      console.error("Error updating last login:", error);
      throw error;
    }
  },
};

module.exports = User;

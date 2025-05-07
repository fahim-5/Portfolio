const pool = require('../config/db');

const User = {
  // Find user by email
  findByEmail: async (email) => {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM users WHERE email = ?', 
        [email]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  },

  // Update user password
  updatePassword: async (email, passwordHash) => {
    try {
      const [result] = await pool.query(
        'UPDATE users SET password_hash = ? WHERE email = ?',
        [passwordHash, email]
      );
      
      if (result.affectedRows === 0) {
        return null;
      }
      
      // Return the updated user
      return await User.findByEmail(email);
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  }
};

module.exports = User;
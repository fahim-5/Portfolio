const db = require('../config/db');

const Experience = {
  // Get all experience entries
  getAll: async () => {
    try {
      console.log('Starting Experience.getAll() database query');
      console.log('SQL query: SELECT * FROM experience ORDER BY id DESC');
      
      const [rows] = await db.query('SELECT * FROM experience ORDER BY id DESC');
      
      console.log('Query executed successfully, returned rows:', rows.length);
      return rows;
    } catch (error) {
      console.error('Database error in Experience.getAll():', error.message);
      console.error('Error stack:', error.stack);
      
      // Check if this is a "table doesn't exist" error
      if (error.code === 'ER_NO_SUCH_TABLE') {
        console.error('The experience table does not exist in the database!');
        // Return empty array instead of throwing
        return [];
      }
      
      throw error;
    }
  },

  // Get a single experience entry by ID
  getById: async (id) => {
    try {
      const [rows] = await db.query('SELECT * FROM experience WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Create a new experience entry
  create: async (experienceData) => {
    try {
      const [result] = await db.query(
        'INSERT INTO experience (position, company, location, period, description) VALUES (?, ?, ?, ?, ?)',
        [
          experienceData.position,
          experienceData.company,
          experienceData.location,
          experienceData.period,
          experienceData.description
        ]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  },

  // Update an experience entry
  update: async (id, experienceData) => {
    try {
      const [result] = await db.query(
        'UPDATE experience SET position = ?, company = ?, location = ?, period = ?, description = ? WHERE id = ?',
        [
          experienceData.position,
          experienceData.company,
          experienceData.location,
          experienceData.period,
          experienceData.description,
          id
        ]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  },

  // Delete an experience entry
  delete: async (id) => {
    try {
      const [result] = await db.query('DELETE FROM experience WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = Experience; 
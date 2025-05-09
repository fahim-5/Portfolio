const db = require('../config/db');

const Education = {
  // Get all education entries
  getAll: async () => {
    try {
      const [rows] = await db.query('SELECT * FROM education ORDER BY startDate DESC');
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Get a single education entry by ID
  getById: async (id) => {
    try {
      const [rows] = await db.query('SELECT * FROM education WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Create a new education entry
  create: async (educationData) => {
    try {
      const [result] = await db.query(
        'INSERT INTO education (degree, institution, location, startDate, endDate, current, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          educationData.degree,
          educationData.institution,
          educationData.location,
          educationData.startDate,
          educationData.endDate,
          educationData.current,
          educationData.description
        ]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  },

  // Update an education entry
  update: async (id, educationData) => {
    try {
      const [result] = await db.query(
        'UPDATE education SET degree = ?, institution = ?, location = ?, startDate = ?, endDate = ?, current = ?, description = ? WHERE id = ?',
        [
          educationData.degree,
          educationData.institution,
          educationData.location,
          educationData.startDate,
          educationData.endDate,
          educationData.current,
          educationData.description,
          id
        ]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  },

  // Delete an education entry
  delete: async (id) => {
    try {
      const [result] = await db.query('DELETE FROM education WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = Education; 
const db = require('../config/db');

const About = {
  // Get all about entries
  getAll: async () => {
    try {
      console.log('Starting About.getAll() database query');
      
      // Modified query to be more explicit
      const query = 'SELECT * FROM `about` ORDER BY id DESC';
      console.log('SQL query:', query);
      
      // Check if the table exists first
      const [tables] = await db.query('SHOW TABLES LIKE "about"');
      if (tables.length === 0) {
        console.error('The about table does not exist in the database!');
        return [];
      }
      
      // Execute the query
      const [rows] = await db.query(query);
      
      console.log('Query executed successfully, returned rows:', rows.length);
      return rows;
    } catch (error) {
      console.error('Database error in About.getAll():', error.message);
      console.error('Error stack:', error.stack);
      
      // Check if this is a "table doesn't exist" error
      if (error.code === 'ER_NO_SUCH_TABLE') {
        console.error('The about table does not exist in the database!');
        // Return empty array instead of throwing
        return [];
      }
      
      throw error;
    }
  },

  // Get a single about entry by ID
  getById: async (id) => {
    try {
      const [rows] = await db.query('SELECT * FROM `about` WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Create a new about entry
  create: async (aboutData) => {
    try {
      console.log('Creating about entry with data:', aboutData);
      
      // Get the column names from the database to ensure we're using the correct ones
      const [columns] = await db.query('DESCRIBE `about`');
      const columnNames = columns.map(col => col.Field);
      console.log('Available columns:', columnNames);
      
      // Build a dynamic query based on the available columns
      let insertColumns = [];
      let placeholders = [];
      let values = [];
      
      // Check each field to see if it exists in the table
      if (columnNames.includes('aboutImageUrl')) {
        insertColumns.push('aboutImageUrl');
        placeholders.push('?');
        values.push(aboutData.aboutImageUrl);
      }
      
      if (columnNames.includes('bio')) {
        insertColumns.push('bio');
        placeholders.push('?');
        values.push(aboutData.bio);
      }
      
      if (columnNames.includes('linkedin')) {
        insertColumns.push('linkedin');
        placeholders.push('?');
        values.push(aboutData.linkedin);
      }
      
      if (columnNames.includes('github')) {
        insertColumns.push('github');
        placeholders.push('?');
        values.push(aboutData.github);
      }
      
      if (columnNames.includes('twitter')) {
        insertColumns.push('twitter');
        placeholders.push('?');
        values.push(aboutData.twitter);
      }
      
      if (columnNames.includes('instagram')) {
        insertColumns.push('instagram');
        placeholders.push('?');
        values.push(aboutData.instagram);
      }
      
      const query = `INSERT INTO \`about\` (${insertColumns.join(', ')}) VALUES (${placeholders.join(', ')})`;
      console.log('Insert query:', query);
      console.log('Insert values:', values);
      
      const [result] = await db.query(query, values);
      console.log('Insert result:', result);
      
      return result.insertId;
    } catch (error) {
      console.error('Error in About.create():', error);
      throw error;
    }
  },

  // Update an about entry
  update: async (id, aboutData) => {
    try {
      console.log('Updating about entry with id:', id);
      console.log('Update data:', aboutData);
      
      // Get the column names from the database to ensure we're using the correct ones
      const [columns] = await db.query('DESCRIBE `about`');
      const columnNames = columns.map(col => col.Field);
      console.log('Available columns:', columnNames);
      
      // Build a dynamic query based on the available columns
      let updateParts = [];
      let values = [];
      
      // Check each field to see if it exists in the table
      if (columnNames.includes('aboutImageUrl')) {
        updateParts.push('aboutImageUrl = ?');
        values.push(aboutData.aboutImageUrl);
      }
      
      if (columnNames.includes('bio')) {
        updateParts.push('bio = ?');
        values.push(aboutData.bio);
      }
      
      if (columnNames.includes('linkedin')) {
        updateParts.push('linkedin = ?');
        values.push(aboutData.linkedin);
      }
      
      if (columnNames.includes('github')) {
        updateParts.push('github = ?');
        values.push(aboutData.github);
      }
      
      if (columnNames.includes('twitter')) {
        updateParts.push('twitter = ?');
        values.push(aboutData.twitter);
      }
      
      if (columnNames.includes('instagram')) {
        updateParts.push('instagram = ?');
        values.push(aboutData.instagram);
      }
      
      // Add the ID at the end of values array
      values.push(id);
      
      const query = `UPDATE \`about\` SET ${updateParts.join(', ')} WHERE id = ?`;
      console.log('Update query:', query);
      console.log('Update values:', values);
      
      const [result] = await db.query(query, values);
      console.log('Update result:', result);
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error in About.update():', error);
      throw error;
    }
  },

  // Delete an about entry
  delete: async (id) => {
    try {
      const [result] = await db.query('DELETE FROM `about` WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = About; 
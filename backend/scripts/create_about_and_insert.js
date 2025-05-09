/**
 * This script creates the about table and inserts a single row
 */

const db = require('../config/db');

async function createAboutAndInsert() {
  try {
    console.log('Starting about table creation and data insertion...');
    
    // Check if table already exists
    const [tables] = await db.query('SHOW TABLES LIKE "about"');
    const tableExists = tables.length > 0;
    
    if (tableExists) {
      console.log('About table already exists, checking if it has data...');
      
      // Check if table has data
      const [rows] = await db.query('SELECT COUNT(*) as count FROM about');
      if (rows[0].count > 0) {
        console.log(`About table already has ${rows[0].count} rows of data.`);
      } else {
        console.log('About table exists but has no data. Inserting a row...');
        await insertData();
      }
    } else {
      console.log('About table does not exist. Creating it...');
      
      // Create table
      const createTableQuery = `
        CREATE TABLE about (
          id INT AUTO_INCREMENT PRIMARY KEY,
          aboutImageUrl VARCHAR(512),
          bio TEXT,
          linkedin VARCHAR(255),
          github VARCHAR(255),
          twitter VARCHAR(255),
          instagram VARCHAR(255),
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      
      await db.query(createTableQuery);
      console.log('About table created successfully.');
      
      // Insert data
      await insertData();
    }
    
    // Verify data
    const [dataRows] = await db.query('SELECT * FROM about');
    console.log('Data in about table:');
    console.log(dataRows);
    
    console.log('Script completed successfully!');
  } catch (error) {
    console.error('Error executing script:', error);
  } finally {
    await db.end();
    console.log('Database connection closed.');
  }
}

async function insertData() {
  const insertQuery = `
    INSERT INTO about (aboutImageUrl, bio, linkedin, github, twitter, instagram)
    VALUES (
      'https://via.placeholder.com/300x300',
      'I am a passionate web developer with experience in building modern web applications using the latest technologies. My expertise includes React, Node.js, Express, and MySQL.',
      'https://linkedin.com/in/myprofile',
      'https://github.com/myusername',
      'https://twitter.com/myhandle',
      'https://instagram.com/myaccount'
    )
  `;
  
  await db.query(insertQuery);
  console.log('Sample data inserted successfully.');
}

// Run the script
createAboutAndInsert(); 
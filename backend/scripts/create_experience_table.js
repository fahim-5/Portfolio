// Script to create the experience table in the database

const fs = require('fs');
const path = require('path');
const db = require('../config/db');

async function createExperienceTable() {
  try {
    console.log('Starting to create experience table...');
    
    // Read the SQL script
    const sqlScript = fs.readFileSync(
      path.join(__dirname, 'create_experience_table.sql'),
      'utf8'
    );
    
    // Split the script into individual statements
    const statements = sqlScript
      .split(';')
      .filter(statement => statement.trim() !== '');
    
    // Execute each statement
    for (const statement of statements) {
      console.log(`Executing: ${statement.trim().substring(0, 100)}...`);
      await db.query(statement);
    }
    
    console.log('Experience table created successfully.');
    
    // Verify by fetching data
    const [rows] = await db.query('SELECT * FROM experience');
    console.log(`Experience table has ${rows.length} entries.`);
    
    // Close the database connection
    console.log('Closing database connection...');
    await db.end();
    
    console.log('Done.');
  } catch (error) {
    console.error('Error creating experience table:', error);
  }
}

createExperienceTable(); 
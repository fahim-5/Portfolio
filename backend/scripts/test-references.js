// Test script for references table
require('dotenv').config();
const db = require('../config/db');

async function testReferencesTable() {
  try {
    console.log('Starting test script for references table...');
    
    // Test database connection
    console.log('Testing database connection...');
    try {
      const [result] = await db.execute('SELECT 1 as test');
      console.log('Database connection successful:', result);
    } catch (connError) {
      console.error('Database connection error:', connError);
      process.exit(1);
    }
    
    // Check if references table exists
    console.log('Checking if references table exists...');
    try {
      const [tables] = await db.execute("SHOW TABLES LIKE 'references'");
      console.log('Tables query result:', tables);
      
      if (tables.length === 0) {
        console.log('References table does not exist, creating it...');
        
        // Create the references table
        try {
          await db.execute(`
            CREATE TABLE IF NOT EXISTS \`references\` (
              id INT AUTO_INCREMENT PRIMARY KEY,
              name VARCHAR(255) NOT NULL,
              position VARCHAR(255),
              company VARCHAR(255),
              quote TEXT NOT NULL,
              image TEXT,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
          `);
          console.log('References table created successfully');
          
          // Insert sample data
          console.log('Inserting sample data...');
          try {
            await db.execute(`
              INSERT INTO \`references\` (name, position, company, quote, image)
              VALUES 
              ('John Smith', 'Senior Manager', 'Tech Solutions Inc.', 'An exceptional developer who consistently delivers high-quality work.', NULL),
              ('Dr. Jennifer Wilson', 'Professor', 'University of Technology', 'I\\'ve had the pleasure of mentoring this brilliant mind.', NULL)
            `);
            console.log('Sample data inserted successfully');
          } catch (insertError) {
            console.error('Error inserting sample data:', insertError);
          }
        } catch (createError) {
          console.error('Error creating references table:', createError);
        }
      } else {
        console.log('References table exists');
      }
    } catch (tableError) {
      console.error('Error checking for references table:', tableError);
    }
    
    // Query the table
    console.log('Querying references table...');
    try {
      const [rows] = await db.execute('SELECT * FROM `references`');
      console.log(`Found ${rows.length} references:`);
      console.log(JSON.stringify(rows, null, 2));
    } catch (queryError) {
      console.error('Error querying references table:', queryError);
    }
    
    console.log('Test completed');
  } catch (error) {
    console.error('Test failed with error:', error);
  } finally {
    console.log('Exiting script...');
    // Close the connection pool
    setTimeout(() => process.exit(0), 1000);
  }
}

testReferencesTable(); 
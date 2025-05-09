/**
 * This script fixes the about table in the database
 * Run this script with: node scripts/fix_about_table.js
 */

const db = require('../config/db');

async function fixAboutTable() {
  try {
    console.log('Starting about table fix script...');
    
    // Check database connection
    console.log('Testing database connection...');
    await db.query('SELECT 1');
    console.log('Database connection successful');
    
    // Check if about table exists
    console.log('Checking if about table exists...');
    const [tables] = await db.query('SHOW TABLES LIKE "about"');
    const tableExists = tables.length > 0;
    
    if (tableExists) {
      console.log('About table exists, checking structure...');
      
      // Get current columns
      const [columns] = await db.query('DESCRIBE `about`');
      console.log('Current table structure:', columns.map(c => `${c.Field} (${c.Type})`));
      
      // Check if we need to drop and recreate
      const confirmRecreate = process.argv.includes('--recreate');
      
      if (confirmRecreate) {
        console.log('Recreating about table from scratch...');
        
        // Drop existing table
        await db.query('DROP TABLE `about`');
        console.log('Dropped existing about table');
        
        // Create new table
        await db.query(`
          CREATE TABLE \`about\` (
            \`id\` int(11) NOT NULL AUTO_INCREMENT,
            \`aboutImageUrl\` varchar(512) DEFAULT NULL,
            \`bio\` text DEFAULT NULL,
            \`linkedin\` varchar(255) DEFAULT NULL,
            \`github\` varchar(255) DEFAULT NULL,
            \`twitter\` varchar(255) DEFAULT NULL,
            \`instagram\` varchar(255) DEFAULT NULL,
            \`createdAt\` timestamp NOT NULL DEFAULT current_timestamp(),
            PRIMARY KEY (\`id\`)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        `);
        
        console.log('Created new about table with proper structure');
        
        // Insert sample data
        await db.query(`
          INSERT INTO \`about\` (aboutImageUrl, bio, linkedin, github, twitter, instagram)
          VALUES (
            'https://example.com/profile.jpg',
            'Full-stack developer with experience in React, Node.js, and database technologies. Passionate about building user-friendly applications.',
            'https://linkedin.com/in/example',
            'https://github.com/example',
            'https://twitter.com/example',
            'https://instagram.com/example'
          );
        `);
        
        console.log('Added sample data to the about table');
      } else {
        console.log('Table exists, but if you want to recreate it, run:');
        console.log('  node scripts/fix_about_table.js --recreate');
      }
    } else {
      console.log('About table does not exist, creating it...');
      
      // Create table
      await db.query(`
        CREATE TABLE \`about\` (
          \`id\` int(11) NOT NULL AUTO_INCREMENT,
          \`aboutImageUrl\` varchar(512) DEFAULT NULL,
          \`bio\` text DEFAULT NULL,
          \`linkedin\` varchar(255) DEFAULT NULL,
          \`github\` varchar(255) DEFAULT NULL,
          \`twitter\` varchar(255) DEFAULT NULL,
          \`instagram\` varchar(255) DEFAULT NULL,
          \`createdAt\` timestamp NOT NULL DEFAULT current_timestamp(),
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
      `);
      
      console.log('Created about table');
      
      // Insert sample data
      await db.query(`
        INSERT INTO \`about\` (aboutImageUrl, bio, linkedin, github, twitter, instagram)
        VALUES (
          'https://example.com/profile.jpg',
          'Full-stack developer with experience in React, Node.js, and database technologies. Passionate about building user-friendly applications.',
          'https://linkedin.com/in/example',
          'https://github.com/example',
          'https://twitter.com/example',
          'https://instagram.com/example'
        );
      `);
      
      console.log('Added sample data to the about table');
    }
    
    // Verify the table and data
    const [newColumns] = await db.query('DESCRIBE `about`');
    console.log('Verified table structure:', newColumns.map(c => `${c.Field} (${c.Type})`));
    
    const [rows] = await db.query('SELECT * FROM `about`');
    console.log(`Table has ${rows.length} record(s)`);
    
    console.log('Script completed successfully.');
  } catch (error) {
    console.error('Error in script:', error);
  } finally {
    // Close the database connection
    await db.end();
    console.log('Database connection closed');
  }
}

// Run the script
fixAboutTable(); 
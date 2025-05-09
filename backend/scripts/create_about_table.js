// Script to create or update the about table in the database

const db = require('../config/db');

async function createAboutTable() {
  try {
    console.log('Starting about table creation/update script...');
    
    // Check if table already exists
    const [tables] = await db.query('SHOW TABLES LIKE "about"');
    const tableExists = tables.length > 0;
    
    if (tableExists) {
      console.log('About table already exists, checking column structure...');
      
      // Get current columns
      const [columns] = await db.query('DESCRIBE `about`');
      const columnNames = columns.map(col => col.Field);
      console.log('Current columns:', columnNames);
      
      // Check if we need to modify the table
      const requiredColumns = ['aboutImageUrl', 'bio', 'linkedin', 'github', 'twitter', 'instagram'];
      
      // Add missing columns
      for (const column of requiredColumns) {
        if (!columnNames.includes(column)) {
          console.log(`Adding missing column: ${column}`);
          
          let dataType = 'VARCHAR(512)';
          if (column === 'bio') {
            dataType = 'TEXT';
          }
          
          await db.query(`ALTER TABLE \`about\` ADD COLUMN ${column} ${dataType} DEFAULT NULL`);
          console.log(`Column ${column} added successfully`);
        }
      }
    } else {
      // Create the about table
      console.log('Creating about table...');
      
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
      
      console.log('About table created successfully');
      
      // Insert sample data
      console.log('Inserting sample data...');
      
      await db.query(`
        INSERT INTO \`about\` (aboutImageUrl, bio, linkedin, github, twitter, instagram)
        VALUES (
          'https://example.com/profile.jpg',
          'Full-stack developer with experience in React, Node.js, and database technologies. Passionate about building user-friendly applications and solving complex problems.',
          'https://linkedin.com/in/example',
          'https://github.com/example',
          'https://twitter.com/example',
          'https://instagram.com/example'
        );
      `);
      
      console.log('Sample data inserted successfully');
    }
    
    // Verify by fetching data
    const [rows] = await db.query('SELECT * FROM about');
    console.log(`About table has ${rows.length} entries:`, rows);
    
    console.log('Script completed successfully!');
  } catch (error) {
    console.error('Error in script:', error);
  } finally {
    // Close the database connection
    await db.end();
    console.log('Database connection closed');
  }
}

// Run the script
createAboutTable(); 
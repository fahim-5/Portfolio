// Script to check and fix database issues

const pool = require('../config/db');

async function repairDatabase() {
  console.log('Starting database repair script...');
  
  try {
    // 1. Check database connection
    console.log('Checking database connection...');
    const [connectionTest] = await pool.query('SELECT 1 as test');
    console.log('Database connection successful:', connectionTest);
    
    // 2. Check if projects table exists
    console.log('Checking if projects table exists...');
    const [tables] = await pool.query("SHOW TABLES LIKE 'projects'");
    
    if (tables.length === 0) {
      console.log('Projects table DOES NOT exist. Creating it...');
      await pool.query(`
        CREATE TABLE IF NOT EXISTS projects (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          category VARCHAR(100),
          description TEXT,
          image VARCHAR(512),
          technologies TEXT,
          demoUrl VARCHAR(512),
          repoUrl VARCHAR(512),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      console.log('Projects table created successfully!');
    } else {
      console.log('Projects table already exists.');
      
      // 3. Check table structure
      console.log('Checking projects table structure...');
      const [columns] = await pool.query('SHOW COLUMNS FROM projects');
      const columnNames = columns.map(col => col.Field);
      
      console.log('Current columns:', columnNames.join(', '));
      
      // Check if image column exists
      if (!columnNames.includes('image')) {
        console.log('Image column missing! Checking for imageUrl column instead...');
        
        if (columnNames.includes('imageUrl')) {
          console.log('Found imageUrl column. Renaming to image...');
          await pool.query('ALTER TABLE projects CHANGE imageUrl image VARCHAR(512)');
          console.log('Column renamed successfully.');
        } else {
          console.log('Adding missing image column...');
          await pool.query('ALTER TABLE projects ADD COLUMN image VARCHAR(512)');
          console.log('Image column added successfully.');
        }
      }
      
      // Check for other required columns
      const requiredColumns = [
        { name: 'title', type: 'VARCHAR(255) NOT NULL' },
        { name: 'category', type: 'VARCHAR(100)' },
        { name: 'description', type: 'TEXT' },
        { name: 'technologies', type: 'TEXT' },
        { name: 'demoUrl', type: 'VARCHAR(512)' },
        { name: 'repoUrl', type: 'VARCHAR(512)' }
      ];
      
      for (const col of requiredColumns) {
        if (!columnNames.includes(col.name)) {
          console.log(`Adding missing ${col.name} column...`);
          await pool.query(`ALTER TABLE projects ADD COLUMN ${col.name} ${col.type}`);
          console.log(`${col.name} column added successfully.`);
        }
      }
    }
    
    // 4. Check if projects table has data
    console.log('Checking if projects table has data...');
    const [projectCount] = await pool.query('SELECT COUNT(*) as count FROM projects');
    
    console.log(`Found ${projectCount[0].count} projects in the database.`);
    
    if (projectCount[0].count === 0) {
      console.log('No projects found. Adding sample data...');
      await pool.query(`
        INSERT INTO projects (title, category, description, image, technologies, demoUrl, repoUrl)
        VALUES 
        ('Personal Portfolio', 'Web Development', 'A responsive portfolio website built with React and Node.js', 'https://placehold.co/800x600/blue/white?text=Portfolio+Preview', 'React, Node.js, Express, MySQL', 'https://example.com/portfolio', 'https://github.com/example/portfolio'),
        ('Task Manager App', 'Web Application', 'A full-featured task management application with user authentication', 'https://placehold.co/800x600/purple/white?text=Task+Manager', 'React, Redux, Express, MongoDB', 'https://example.com/taskmanager', 'https://github.com/example/taskmanager')
      `);
      console.log('Sample data added successfully!');
    }
    
    console.log('Database repair completed successfully!');
    
  } catch (error) {
    console.error('Error during database repair:', error);
  } finally {
    // End the MySQL connection
    pool.end();
  }
}

// Run the repair function
repairDatabase(); 
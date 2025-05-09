const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'portfolio',
  port: Number(process.env.DB_PORT || 3306)
};

async function initializeDatabase() {
  let connection;

  try {
    // First connect without database to create it if it doesn't exist
    connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port
    });

    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    console.log(`Database ${dbConfig.database} created or already exists.`);
    
    // Close connection
    await connection.end();
    
    // Connect with database selected
    connection = await mysql.createConnection(dbConfig);
    
    // Create hero table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS hero (
        id INT PRIMARY KEY AUTO_INCREMENT,
        greeting VARCHAR(100) DEFAULT 'Hello, I''m',
        name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100),
        description TEXT,
        job_title VARCHAR(100),
        button_text VARCHAR(50) DEFAULT 'Get In Touch',
        profile_image_url VARCHAR(255),
        email VARCHAR(100),
        phone VARCHAR(50),
        location VARCHAR(100),
        linkedin_url VARCHAR(255),
        github_url VARCHAR(255),
        twitter_url VARCHAR(255),
        instagram_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Hero table created or already exists.');
    
    // Create hero_stats table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS hero_stats (
        id INT PRIMARY KEY AUTO_INCREMENT,
        hero_id INT NOT NULL,
        value VARCHAR(50) NOT NULL,
        label VARCHAR(100) NOT NULL,
        FOREIGN KEY (hero_id) REFERENCES hero(id) ON DELETE CASCADE
      )
    `);
    console.log('Hero stats table created or already exists.');
    
    // Check if hero data exists
    const [rows] = await connection.query('SELECT * FROM hero LIMIT 1');
    
    // Insert default hero data if none exists
    if (rows.length === 0) {
      const [result] = await connection.query(`
        INSERT INTO hero (
          greeting, name, last_name, description, job_title, 
          button_text, profile_image_url, email, phone, location,
          linkedin_url, github_url, twitter_url, instagram_url
        ) VALUES (
          'Hello, I''m', 'John', 'Doe', 
          'I am a passionate developer with expertise in creating modern and responsive web applications. I specialize in frontend development with React, backend with Node.js, and database management.',
          'Full Stack Developer', 'Get In Touch', '', 
          'john.doe@example.com', '+1234567890', 'New York, USA',
          'https://linkedin.com/in/johndoe', 'https://github.com/johndoe', 
          'https://twitter.com/johndoe', 'https://instagram.com/johndoe'
        )
      `);
      
      const heroId = result.insertId;
      console.log(`Default hero data inserted with ID: ${heroId}`);
      
      // Insert default stats
      const stats = [
        { value: '5+', label: 'Years Experience' },
        { value: '100+', label: 'Projects Completed' },
        { value: '50+', label: 'Happy Clients' }
      ];
      
      for (const stat of stats) {
        await connection.query(
          'INSERT INTO hero_stats (hero_id, value, label) VALUES (?, ?, ?)',
          [heroId, stat.value, stat.label]
        );
      }
      console.log('Default hero stats inserted.');
    } else {
      console.log('Hero data already exists, skipping default data insertion.');
    }
    
    console.log('Database initialization completed successfully! 🎉');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the initialization
initializeDatabase(); 
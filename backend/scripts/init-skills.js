/**
 * Script to initialize the skills table and add sample data
 * Run this script to ensure the skills table exists and has data
 */

const pool = require('../config/db');

async function initSkillsTable() {
  const connection = await pool.getConnection();
  
  try {
    console.log('Starting skills table initialization...');
    
    // Create skills table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS skills (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        category VARCHAR(20) NOT NULL,
        level VARCHAR(20) DEFAULT NULL,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);
    
    console.log('Skills table created or already exists');
    
    // Check if table is empty
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM skills');
    const count = rows[0].count;
    
    if (count === 0) {
      console.log('Skills table is empty, adding sample data...');
      
      // Sample technical skills
      const technicalSkills = [
        { name: 'JavaScript', category: 'technical', level: 'advanced' },
        { name: 'React', category: 'technical', level: 'advanced' },
        { name: 'Node.js', category: 'technical', level: 'intermediate' },
        { name: 'HTML/CSS', category: 'technical', level: 'advanced' },
        { name: 'TypeScript', category: 'technical', level: 'intermediate' },
        { name: 'SQL', category: 'technical', level: 'intermediate' }
      ];
      
      // Sample soft skills
      const softSkills = [
        { name: 'Communication', category: 'soft', level: 'advanced' },
        { name: 'Problem Solving', category: 'soft', level: 'advanced' },
        { name: 'Teamwork', category: 'soft', level: 'advanced' },
        { name: 'Time Management', category: 'soft', level: 'intermediate' }
      ];
      
      // Sample languages
      const languageSkills = [
        { name: 'English', category: 'languages', level: 'advanced' },
        { name: 'Spanish', category: 'languages', level: 'intermediate' }
      ];
      
      // Combine all skills
      const allSkills = [...technicalSkills, ...softSkills, ...languageSkills];
      
      // Insert all skills
      for (const skill of allSkills) {
        await connection.query(
          'INSERT INTO skills (name, category, level) VALUES (?, ?, ?)',
          [skill.name, skill.category, skill.level]
        );
      }
      
      console.log(`Added ${allSkills.length} sample skills to the database`);
    } else {
      console.log(`Skills table already has ${count} entries, skipping sample data insertion`);
    }
    
    console.log('Skills table initialization complete!');
  } catch (error) {
    console.error('Error initializing skills table:', error);
  } finally {
    connection.release();
  }
}

// Run the initialization function
initSkillsTable()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch(err => {
    console.error('Script failed:', err);
    process.exit(1);
  }); 
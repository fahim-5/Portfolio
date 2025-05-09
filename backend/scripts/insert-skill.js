const mysql = require('mysql2/promise');

async function insertSkill() {
  // Create connection
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'portfolio'
  });

  console.log('Connected to database');
  
  try {
    // First check if skills table exists
    const [tables] = await connection.query('SHOW TABLES LIKE "skills"');
    if (tables.length === 0) {
      // Create skills table
      console.log('Creating skills table');
      await connection.query(`
        CREATE TABLE IF NOT EXISTS skills (
          id INT NOT NULL AUTO_INCREMENT,
          name VARCHAR(100) NOT NULL,
          category VARCHAR(20) NOT NULL,
          level VARCHAR(20) DEFAULT NULL,
          PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
      `);
    } else {
      console.log('Skills table already exists');
    }
    
    // Insert a skill
    const skill = {
      name: 'Test Skill',
      category: 'technical',
      level: 'intermediate'
    };
    
    console.log('Inserting skill:', skill);
    const [result] = await connection.query(
      'INSERT INTO skills (name, category, level) VALUES (?, ?, ?)',
      [skill.name, skill.category, skill.level]
    );
    
    console.log('Insert result:', result);
    console.log('Skill inserted with ID:', result.insertId);
    
    // Verify by fetching the skill
    const [insertedSkills] = await connection.query(
      'SELECT * FROM skills WHERE id = ?',
      [result.insertId]
    );
    
    console.log('Inserted skill:', insertedSkills[0]);
    
    // Get all skills
    const [allSkills] = await connection.query('SELECT * FROM skills');
    console.log('All skills in database:');
    allSkills.forEach(skill => {
      console.log(`${skill.id}: ${skill.name} (${skill.category}, ${skill.level})`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
    console.log('Database connection closed');
  }
}

insertSkill().catch(err => {
  console.error('Script failed:', err.message);
}); 
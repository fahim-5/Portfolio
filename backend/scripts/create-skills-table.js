const pool = require('../config/db');

async function createSkillsTable() {
  try {
    console.log('Checking if skills table exists...');
    
    // Try to get the skills table description
    try {
      const [rows] = await pool.query('SHOW TABLES LIKE "skills"');
      if (rows.length > 0) {
        console.log('Skills table exists, checking structure...');
        
        // Check if the table has the correct structure
        const [columns] = await pool.query('DESCRIBE skills');
        console.log('Current skills table structure:');
        columns.forEach(col => console.log(`${col.Field}: ${col.Type}`));
        
        // Check if enum values are correct for category
        const categoryColumn = columns.find(col => col.Field === 'category');
        if (!categoryColumn || 
            !categoryColumn.Type.includes('technical') || 
            !categoryColumn.Type.includes('soft') || 
            !categoryColumn.Type.includes('languages')) {
          console.log('Category column needs to be updated');
          await updateCategoryColumn();
        }
        
        // Check if enum values are correct for level
        const levelColumn = columns.find(col => col.Field === 'level');
        if (!levelColumn || 
            !levelColumn.Type.includes('beginner') || 
            !levelColumn.Type.includes('intermediate') || 
            !levelColumn.Type.includes('advanced')) {
          console.log('Level column needs to be updated');
          await updateLevelColumn();
        }
        
        console.log('Skills table is up to date');
      } else {
        console.log('Skills table does not exist, creating it...');
        await createTable();
      }
    } catch (error) {
      console.log('Error checking table, attempting to create:', error.message);
      await createTable();
    }
    
    // Insert some test data to verify it works
    try {
      const [testData] = await pool.query('SELECT COUNT(*) as count FROM skills');
      const count = testData[0].count;
      
      if (count === 0) {
        console.log('Inserting test data into skills table...');
        await insertTestData();
      } else {
        console.log(`Skills table has ${count} records already`);
      }
    } catch (error) {
      console.error('Error checking or inserting test data:', error.message);
    }
    
    console.log('Skills table setup complete');
  } catch (error) {
    console.error('Failed to set up skills table:', error.message);
  } finally {
    // Close the connection
    await pool.end();
    console.log('Database connection closed');
    
    // Add delay to ensure output is shown before process exits
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

async function createTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS skills (
      id INT NOT NULL AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL,
      category ENUM('technical', 'soft', 'languages') NOT NULL,
      level ENUM('beginner', 'elementary', 'intermediate', 'advanced', 'expert', 'native') DEFAULT NULL,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
  `);
  console.log('Skills table created successfully');
}

async function updateCategoryColumn() {
  await pool.query(`
    ALTER TABLE skills 
    MODIFY COLUMN category ENUM('technical', 'soft', 'languages') NOT NULL;
  `);
  console.log('Category column updated');
}

async function updateLevelColumn() {
  await pool.query(`
    ALTER TABLE skills 
    MODIFY COLUMN level ENUM('beginner', 'elementary', 'intermediate', 'advanced', 'expert', 'native') DEFAULT NULL;
  `);
  console.log('Level column updated');
}

async function insertTestData() {
  const testSkills = [
    { name: 'JavaScript', category: 'technical', level: 'advanced' },
    { name: 'Teamwork', category: 'soft', level: 'intermediate' },
    { name: 'English', category: 'languages', level: 'native' }
  ];
  
  for (const skill of testSkills) {
    await pool.query(
      'INSERT INTO skills (name, category, level) VALUES (?, ?, ?)',
      [skill.name, skill.category, skill.level]
    );
  }
  
  console.log('Test data inserted successfully');
}

// Run the function
console.log('Starting skills table setup...');
createSkillsTable().then(() => {
  console.log('Script completed successfully');
}).catch(err => {
  console.error('Script failed:', err.message);
}); 
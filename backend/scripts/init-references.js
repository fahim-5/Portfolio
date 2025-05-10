/**
 * Script to initialize the references table and add sample data
 * Run this script to ensure the references table exists and has data
 */

const pool = require('../config/db');

async function initReferencesTable() {
  const connection = await pool.getConnection();
  
  try {
    console.log('Starting references table initialization...');
    
    // Create references table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`references\` (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        position VARCHAR(100) NOT NULL,
        company VARCHAR(100) NOT NULL,
        quote TEXT NOT NULL,
        image VARCHAR(255) DEFAULT NULL,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);
    
    console.log('References table created or already exists');
    
    // Check if table is empty
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM `references`');
    const count = rows[0].count;
    
    if (count === 0) {
      console.log('References table is empty, adding sample data...');
      
      // Sample references
      const sampleReferences = [
        {
          name: 'John Smith',
          position: 'Senior Manager',
          company: 'Tech Innovations Inc.',
          quote: 'One of the most dedicated developers I have ever worked with. Consistently delivers high-quality work and exceeds expectations.',
          image: 'https://randomuser.me/api/portraits/men/32.jpg'
        },
        {
          name: 'Sarah Johnson',
          position: 'Project Lead',
          company: 'Digital Solutions',
          quote: 'An exceptional problem-solver who approaches challenges with creativity and determination. A valuable asset to any team.',
          image: 'https://randomuser.me/api/portraits/women/44.jpg'
        },
        {
          name: 'Michael Chen',
          position: 'CTO',
          company: 'Startup Ventures',
          quote: 'Demonstrates remarkable technical skills and a deep understanding of user needs. Always delivers projects on time and with excellent quality.',
          image: 'https://randomuser.me/api/portraits/men/67.jpg'
        },
        {
          name: 'Jennifer Williams',
          position: 'UX Director',
          company: 'Creative Design Studio',
          quote: 'A pleasure to work with. Combines technical expertise with a keen eye for design and user experience. Highly recommended!',
          image: 'https://randomuser.me/api/portraits/women/17.jpg'
        }
      ];
      
      // Insert all references
      for (const reference of sampleReferences) {
        await connection.query(
          'INSERT INTO `references` (name, position, company, quote, image) VALUES (?, ?, ?, ?, ?)',
          [reference.name, reference.position, reference.company, reference.quote, reference.image]
        );
      }
      
      console.log(`Added ${sampleReferences.length} sample references to the database`);
    } else {
      console.log(`References table already has ${count} entries, skipping sample data insertion`);
    }
    
    console.log('References table initialization complete!');
  } catch (error) {
    console.error('Error initializing references table:', error);
  } finally {
    connection.release();
  }
}

// Run the initialization function
initReferencesTable()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch(err => {
    console.error('Script failed:', err);
    process.exit(1);
  });
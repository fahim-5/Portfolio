const db = require('./database');
const connectDB = require('../config/db');

async function testDatabaseConnection() {
  console.log('Testing MySQL database connection...');
  
  try {
    // Test the database connection
    const connection = await connectDB();
    console.log('✅ Successfully connected to MySQL database');
    
    // Try a simple query to verify functionality
    try {
      const [result] = await connection.execute('SELECT 1 as test');
      console.log('✅ Database query executed successfully:', result);
      
      // Test if user table exists and has data
      try {
        const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
        console.log(`✅ Found ${users[0].count} users in the database`);
        
        if (users[0].count > 0) {
          // Get first user
          const [firstUser] = await connection.execute('SELECT id, username, email FROM users LIMIT 1');
          console.log('✅ Sample user found:', firstUser[0]);
        } else {
          console.log('⚠️ No users found in database - you may need to run setup-db.js');
        }
      } catch (err) {
        console.error('❌ Error querying users table:', err.message);
        console.log('⚠️ Database tables may not be set up properly. Try running setup-db.js');
      }
      
    } catch (queryErr) {
      console.error('❌ Database query failed:', queryErr.message);
    }
    
    console.log('Closing connection...');
    await connection.end();
    console.log('Connection closed.');
    
  } catch (err) {
    console.error('❌ Failed to connect to database:', err.message);
    console.error('Please check your database credentials in config/db.js');
    console.error('Make sure MySQL server is running and accessible');
  }
}

// Run the test
testDatabaseConnection().catch(err => {
  console.error('Unhandled error during test:', err);
  process.exit(1);
}); 
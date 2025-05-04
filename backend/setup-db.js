const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);

async function setupDatabase() {
  console.log('🏗️  Starting database setup...');
  
  try {
    // Read database configuration
    const dbConfig = {
      host: 'localhost',
      user: 'portfolio',
      password: '12345678',
      multipleStatements: true  // Important for running multiple SQL statements
    };
    
    console.log('📝 Using database configuration:');
    console.log(`- Host: ${dbConfig.host}`);
    console.log(`- User: ${dbConfig.user}`);
    
    // Read SQL file
    const sqlFilePath = path.join(__dirname, 'database.sql');
    const sql = await readFile(sqlFilePath, 'utf8');
    
    console.log(`📄 Read SQL file from: ${sqlFilePath}`);
    
    // Create connection
    console.log('🔌 Connecting to MySQL...');
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL server');
    
    // Execute SQL
    console.log('🚀 Executing SQL script...');
    await connection.query(sql);
    console.log('✅ SQL script executed successfully');
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      console.log('📁 Creating uploads directory...');
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log(`✅ Uploads directory created at: ${uploadsDir}`);
    } else {
      console.log(`📁 Uploads directory already exists at: ${uploadsDir}`);
    }
    
    // Close connection
    await connection.end();
    console.log('🔌 Database connection closed');
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('You can now start the application.');
    
  } catch (error) {
    console.error('\n❌ Database setup failed:');
    console.error(error);
    process.exit(1);
  }
}

setupDatabase(); 
const mysql = require('mysql2/promise');
require('dotenv').config({ path: './config.env' });

const connectDB = async () => {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'portfolio',
      password: '12345678',
      database: 'portfolio'
    });
    
    console.log('✅ MySQL Database Connected Successfully');
    console.log('------------------------------------------');
    console.log('HOST: localhost');
    console.log('USER: portfolio');
    console.log('DATABASE: portfolio');
    console.log('------------------------------------------');
    return connection;
  } catch (error) {
    console.error('❌ DATABASE CONNECTION ERROR ❌');
    console.error('------------------------------------------');
    console.error(`Error details: ${error.message}`);
    console.error('------------------------------------------');
    process.exit(1);
  }
};

module.exports = connectDB; 
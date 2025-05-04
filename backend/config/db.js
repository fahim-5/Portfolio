const mysql = require('mysql2/promise');
require('dotenv').config({ path: './config.env' });

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'portfolio',
  password: process.env.DB_PASSWORD || '12345678',
  database: process.env.DB_NAME || 'portfolio',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection on startup
const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL Database Connected Successfully');
    console.log('------------------------------------------');
    console.log(`HOST: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`USER: ${process.env.DB_USER || 'portfolio'}`);
    console.log(`DATABASE: ${process.env.DB_NAME || 'portfolio'}`);
    console.log('------------------------------------------');
    connection.release();
    return pool;
  } catch (error) {
    console.error('❌ DATABASE CONNECTION ERROR ❌');
    console.error('------------------------------------------');
    console.error(`Error details: ${error.message}`);
    console.error('------------------------------------------');
    process.exit(1);
  }
};

module.exports = { connectDB, pool };
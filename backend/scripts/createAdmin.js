const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "portfolio",
  port: Number(process.env.DB_PORT || 3306),
};

async function createAdmin() {
  let connection;

  try {
    // Connect to database
    connection = await mysql.createConnection(dbConfig);
    console.log("✅ Connected to MySQL database");

    // Check if the users table exists
    const [tables] = await connection.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = ? AND table_name = 'users'",
      [dbConfig.database]
    );

    // Create table if it doesn't exist
    if (tables.length === 0) {
      console.log("Creating users table...");
      await connection.query(`
        CREATE TABLE users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(50) NOT NULL,
          email VARCHAR(50) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          is_admin BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          last_login TIMESTAMP NULL,
          reset_token VARCHAR(255) NULL,
          reset_token_expires TIMESTAMP NULL
        )
      `);
      console.log("✅ Users table created");
    }

    // Admin credentials
    const adminName = "Admin";
    const adminEmail = "admin@gmail.com";
    const adminPassword = "password";

    // Check if admin already exists
    const [existingUsers] = await connection.query(
      "SELECT id FROM users WHERE email = ?",
      [adminEmail]
    );

    if (existingUsers.length > 0) {
      console.log(`👍 Admin user with email ${adminEmail} already exists`);
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    // Insert admin user
    await connection.query(
      "INSERT INTO users (name, email, password, is_admin) VALUES (?, ?, ?, ?)",
      [adminName, adminEmail, hashedPassword, true]
    );

    console.log(`✅ Admin user created successfully`);
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createAdmin();

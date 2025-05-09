const app = require("./app");
const mysql = require("mysql2/promise");
require("dotenv").config();

// Set JWT_SECRET if not defined
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "your_secret_jwt_key_for_portfolio";
  console.log(
    "⚠️ Using default JWT_SECRET. Set it in .env file for production."
  );
}

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "portfolio",
};

// Connect to MySQL
async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log("✅ Connected to MySQL database");
    return connection;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
}

// Initialize server
async function startServer() {
  // Connect to database
  await connectToDatabase();

  // Define port
  const PORT = process.env.PORT || 5000;

  // Start the server
  app.listen(PORT, () => {
    console.log(
      `🚀 Backend server running in ${
        process.env.NODE_ENV || "development"
      } mode on port ${PORT}`
    );
  });
}

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

// Start the server
startServer();

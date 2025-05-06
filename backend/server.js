require("dotenv").config();
const app = require("./app");
const pool = require("./config/db");

const PORT = process.env.PORT || 5001;

async function startServer() {
  try {
    // Test database connection
    const connection = await pool.getConnection();
    console.log("✅ Connected to MySQL database");
    connection.release();

    // Start server
    app.listen(PORT, () => {
      console.log(
        `🚀 Backend server running in ${process.env.NODE_ENV} mode on port ${PORT}`
      );
    });
  } catch (error) {
    console.error("❌ Failed to connect to MySQL database:", error.message);
    process.exit(1);
  }
}

startServer();

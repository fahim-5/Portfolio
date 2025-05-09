const express = require("express");
const app = express();
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend URLs
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Morgan logging in development
if (process.env.NODE_ENV === "development") {
  const morgan = require("morgan");
  app.use(morgan("dev"));
}

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const heroRoutes = require("./routes/heroRoutes");
const educationRoutes = require("./routes/educationRoutes");
const experienceRoutes = require("./routes/experienceRoutes");
const skillsRoutes = require("./routes/skillsRoutes");
const projectsRoutes = require("./routes/projectsRoutes");
const picturesRoutes = require("./routes/picturesRoutes");
const referencesRoutes = require("./routes/referencesRoutes");

// Log available routes for debugging
console.log("Available routes:");
console.log("- /api/auth (authRoutes)");
console.log("- /api/user (userRoutes)");
console.log("- /api/admin/hero (heroRoutes)");
console.log("- /api/admin/education (educationRoutes)");
console.log("- /api/admin/experience (experienceRoutes)");
console.log("- /api/admin/skills (skillsRoutes)");
console.log("- /api/admin/projects (projectsRoutes)");
console.log("- /api/admin/pictures (picturesRoutes)");
console.log("- /api/admin/references (referencesRoutes)");

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use('/api/admin/hero', heroRoutes);
app.use('/api/admin/education', educationRoutes);
app.use('/api/admin/experience', experienceRoutes);
app.use('/api/admin/skills', skillsRoutes);
app.use('/api/admin/projects', projectsRoutes);
app.use('/api/admin/pictures', picturesRoutes);
app.use('/api/admin/references', referencesRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

// Debug route to check server is running
app.get("/api/status", (req, res) => {
  res.json({ status: "OK", time: new Date().toISOString() });
});

// Debug route to check database connection
app.get("/api/db-check", async (req, res) => {
  try {
    const pool = require('./config/db');
    console.log('Testing database connection...');
    const [result] = await pool.query('SELECT 1 as test');
    
    // Check if projects table exists
    const [tables] = await pool.query("SHOW TABLES LIKE 'projects'");
    const projectsTableExists = tables.length > 0;
    
    res.json({ 
      success: true, 
      dbConnected: true,
      projectsTableExists,
      message: 'Database connection successful', 
      result 
    });
  } catch (error) {
    console.error('Database connection test failed:', error);
    res.status(500).json({ 
      success: false, 
      dbConnected: false,
      message: 'Database connection failed', 
      error: error.message 
    });
  }
});

// Additional non-admin projects route for public access
// This allows /api/projects to work for public access without /admin prefix
app.use('/api/projects', require('./routes/projectsRoutes'));

// Additional non-admin pictures route for public access
app.use('/api/pictures', require('./routes/picturesRoutes'));

// Additional non-admin references route for public access
app.use('/api/references', require('./routes/referencesRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

module.exports = app;

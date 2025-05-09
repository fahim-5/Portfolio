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

// Log available routes for debugging
console.log("Available routes:");
console.log("- /api/auth (authRoutes)");
console.log("- /api/user (userRoutes)");
console.log("- /api/admin/hero (heroRoutes)");
console.log("- /api/admin/education (educationRoutes)");
console.log("- /api/admin/experience (experienceRoutes)");
console.log("- /api/admin/skills (skillsRoutes)");

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use('/api/admin/hero', heroRoutes);
app.use('/api/admin/education', educationRoutes);
app.use('/api/admin/experience', experienceRoutes);
app.use('/api/admin/skills', skillsRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

// Debug route to check server is running
app.get("/api/status", (req, res) => {
  res.json({ status: "OK", time: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

module.exports = app;

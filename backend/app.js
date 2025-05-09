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

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use('/api/admin/hero', heroRoutes);
app.use('/api/admin/education', educationRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

module.exports = app;

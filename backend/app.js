const express = require('express');
const cors = require('cors');
const path = require('path');

// Route files
const dbTestRoutes = require('./routes/dbTest');
const uploadRoutes = require('./routes/uploadRoutes');
const userProfileRoutes = require('./routes/userProfileRoutes');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint that doesn't require database access
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    apiVersion: '1.0.0'
  });
});

// Mount routes
app.use('/api/db', dbTestRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/profile', userProfileRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

module.exports = app; 
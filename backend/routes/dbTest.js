const express = require('express');
const connectDB = require('../config/db');
const db = require('../utils/database');

const router = express.Router();

// Test database connection
router.get('/test', async (req, res) => {
  try {
    const connection = await connectDB();
    res.status(200).json({
      success: true,
      message: 'Database connected successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Check users table
router.get('/users', async (req, res) => {
  try {
    const users = await db.query('SELECT * FROM users');
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

module.exports = router; 
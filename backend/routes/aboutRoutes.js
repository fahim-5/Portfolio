const express = require('express');
const router = express.Router();
const aboutController = require('../controllers/aboutController');
const { authenticateToken } = require('../middleware/authMiddleware');
const db = require('../config/db');

// Simplified check route - easier to test
router.get('/check', (req, res) => {
  console.log('Simple about route check endpoint hit');
  // Add CORS headers to ensure frontend can access
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Return a simple JSON response
  res.json({ 
    message: 'About routes are working',
    timestamp: new Date().toISOString(),
    status: 'ok'
  });
});

// Enhanced debug route to check if the about routes are working
router.get('/debug', async (req, res) => {
  console.log('About route debug endpoint hit');
  
  // Add CORS headers to ensure frontend can access
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  try {
    // Check database connection
    console.log('Checking database connection...');
    const [tables] = await db.query('SHOW TABLES');
    console.log('Tables in database:', tables);
    
    // Check if about table exists and its structure
    const tableExists = tables.some(table => 
      Object.values(table)[0].toLowerCase() === 'about'
    );
    
    if (tableExists) {
      console.log('About table exists, checking its structure...');
      const [columns] = await db.query('DESCRIBE about');
      console.log('About table structure:', columns);
      
      // Try to get the data
      const [rows] = await db.query('SELECT * FROM about');
      console.log('About table data:', rows);
      
      res.json({ 
        message: 'About routes are working',
        tableExists: true,
        tableStructure: columns,
        recordCount: rows.length,
        records: rows
      });
    } else {
      console.log('About table does not exist!');
      res.json({ 
        message: 'About routes are working but table does not exist',
        tableExists: false,
        allTables: tables.map(t => Object.values(t)[0])
      });
    }
  } catch (error) {
    console.error('Error in debug route:', error);
    res.status(500).json({ 
      message: 'Error checking about table',
      error: error.message,
      stack: error.stack
    });
  }
});

// Public routes - no authentication required
router.get('/', aboutController.getAllAbout);
router.get('/:id', aboutController.getAboutById);

// Protected routes - require authentication
router.post('/', authenticateToken, aboutController.createAbout);
router.put('/:id', authenticateToken, aboutController.updateAbout);
router.delete('/:id', authenticateToken, aboutController.deleteAbout);

module.exports = router; 
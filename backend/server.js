// Import config
const config = require('./config/config');
const connectDB = require('./config/db');

// Import app
const app = require('./app');

// Connect to database
connectDB();

// Start server
app.listen(config.PORT, () => {
  console.log(`Server running in ${config.NODE_ENV} mode on port ${config.PORT}`);
}); 
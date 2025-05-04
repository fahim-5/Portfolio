const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: './config.env' });

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.MONGO_URI || '',
}; 
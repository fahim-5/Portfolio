require('dotenv').config({ path: './config.env' });

module.exports = {
  PORT: process.env.PORT || 5001,
  NODE_ENV: process.env.NODE_ENV || 'development'
};

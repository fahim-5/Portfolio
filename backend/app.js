const express = require('express');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Morgan logging in development
if (process.env.NODE_ENV === 'development') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

// Test route
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

module.exports = app;
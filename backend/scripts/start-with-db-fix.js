// This script runs database repairs and then starts the server
const { execSync } = require('child_process');
const path = require('path');

console.log('Starting database repair process...');

try {
  // Run the database repair script
  console.log('Running database repair script...');
  const fixResult = execSync('node scripts/fix-database.js', { cwd: path.resolve(__dirname, '..') });
  console.log(fixResult.toString());
  
  console.log('Database repair completed.');
  console.log('Starting server...');
  
  // Start the server
  const nodeEnv = process.env.NODE_ENV || 'development';
  console.log(`Starting server in ${nodeEnv} mode...`);
  
  // Use exec to keep the process running (unlike execSync which would block)
  const { exec } = require('child_process');
  const server = exec('node server.js', { cwd: path.resolve(__dirname, '..') });
  
  server.stdout.on('data', (data) => {
    console.log(data.toString());
  });
  
  server.stderr.on('data', (data) => {
    console.error(data.toString());
  });
  
  console.log('Server started.');
  
} catch (error) {
  console.error('Error running database fix or starting server:', error.message);
  process.exit(1);
} 
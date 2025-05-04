/**
 * Development Startup Script
 * This script starts the frontend application with mock data mode enabled
 */
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Print colorful message
console.log('\x1b[36m%s\x1b[0m', '=================================================');
console.log('\x1b[36m%s\x1b[0m', '   Portfolio App - DEVELOPMENT MODE (MOCK DATA)   ');
console.log('\x1b[36m%s\x1b[0m', '=================================================');
console.log('\x1b[33m%s\x1b[0m', '\n⚠️  Running with MOCK DATA - changes will not be saved to the database');
console.log('\x1b[33m%s\x1b[0m', '⚠️  This is for development and testing purposes only\n');

// Start the frontend
console.log('\x1b[32m%s\x1b[0m', '🚀 Starting frontend application...');
console.log('\x1b[0m', 'After startup, you can access the application at: http://localhost:5173');

// Use child_process.spawn to start the frontend
const frontend = spawn('npm', ['run', 'start:frontend'], {
  cwd: process.cwd(),
  stdio: 'inherit', // Output frontend logs to the console
  shell: true
});

// Handle frontend process events
frontend.on('error', (err) => {
  console.error('\x1b[31m%s\x1b[0m', `Error starting frontend: ${err.message}`);
  process.exit(1);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n\x1b[33m%s\x1b[0m', 'Shutting down development mode...');
  
  // Kill the frontend process if it's running
  if (frontend) {
    frontend.kill('SIGINT');
  }
  
  process.exit(0);
});

// Print instructions for what to do next
console.log('\x1b[36m%s\x1b[0m', '\nUsage Instructions:');
console.log('\x1b[0m', '1. The PersonalInfoEditor will automatically use mock data');
console.log('\x1b[0m', '2. You can edit and save data, but changes won\'t be stored in a database');
console.log('\x1b[0m', '3. Press Ctrl+C to stop the development server');
console.log('\x1b[36m%s\x1b[0m', '\n=================================================\n'); 
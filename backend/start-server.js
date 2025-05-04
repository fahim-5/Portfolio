/**
 * Backend Server Starter Script
 * This script starts the backend server and handles errors and restarts
 */
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuration
const MAX_RESTARTS = 5;
const RESTART_DELAY = 3000; // 3 seconds
let restartCount = 0;

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Create log files
const logFile = fs.createWriteStream(path.join(logsDir, 'server.log'), { flags: 'a' });
const errorLogFile = fs.createWriteStream(path.join(logsDir, 'error.log'), { flags: 'a' });

// Helper to log with timestamp
function log(message, isError = false) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  
  // Log to console
  if (isError) {
    console.error(logMessage);
  } else {
    console.log(logMessage);
  }
  
  // Log to file
  if (isError) {
    errorLogFile.write(logMessage + '\n');
  } else {
    logFile.write(logMessage + '\n');
  }
}

// Function to start the server
function startServer() {
  log(`Starting server (attempt ${restartCount + 1} of ${MAX_RESTARTS + 1})...`);
  
  // Use server.js as the entry point
  const server = spawn('node', ['server.js'], {
    cwd: __dirname,
    stdio: 'pipe', // Capture stdout and stderr
  });
  
  // Handle server output
  server.stdout.on('data', (data) => {
    process.stdout.write(data); // Show in console
    logFile.write(data); // Log to file
  });
  
  server.stderr.on('data', (data) => {
    process.stderr.write(data); // Show in console
    errorLogFile.write(data); // Log to file
  });
  
  // Handle server exit
  server.on('exit', (code, signal) => {
    if (code !== 0) {
      log(`Server process exited with code ${code} and signal ${signal}`, true);
      restartServer();
    } else {
      log('Server process exited normally');
    }
  });
  
  // Handle server errors
  server.on('error', (err) => {
    log(`Failed to start server: ${err.message}`, true);
    restartServer();
  });
  
  // Return the server process
  return server;
}

// Function to restart the server
function restartServer() {
  if (restartCount < MAX_RESTARTS) {
    restartCount++;
    log(`Restarting server in ${RESTART_DELAY / 1000} seconds...`);
    
    setTimeout(() => {
      startServer();
    }, RESTART_DELAY);
  } else {
    log('Maximum restart attempts reached. Server will not restart automatically.', true);
    process.exit(1);
  }
}

// Start the server initially
try {
  const serverProcess = startServer();
  
  // Handle process signals
  process.on('SIGINT', () => {
    log('Received SIGINT. Shutting down server...');
    serverProcess.kill('SIGINT');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    log('Received SIGTERM. Shutting down server...');
    serverProcess.kill('SIGTERM');
    process.exit(0);
  });
  
} catch (err) {
  log(`Critical error starting server: ${err.message}`, true);
  process.exit(1);
} 
// Import config
const config = require('./config/config');
const connectDB = require('./config/db');

// Import app
const app = require('./app');

console.log('🚀 Starting Portfolio Application...');
console.log('------------------------------------------');

// Connect to database
connectDB()
  .then(() => {
    // Start server
    app.listen(config.PORT, () => {
      console.log(`✅ Server running in ${config.NODE_ENV} mode on port ${config.PORT}`);
      console.log('------------------------------------------');
      console.log('📁 API Routes:');
      console.log(`  • Root: http://localhost:${config.PORT}/`);
      console.log(`  • Database Test: http://localhost:${config.PORT}/api/db/test`);
      console.log('------------------------------------------');
      console.log('📱 Portfolio application is now fully running!');
    });
  })
  .catch(err => {
    console.error('❌ SERVER STARTUP ERROR ❌');
    console.error('------------------------------------------');
    console.error(`Error details: ${err.message}`);
    console.error('------------------------------------------');
    process.exit(1);
  }); 
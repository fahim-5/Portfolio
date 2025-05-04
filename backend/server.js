const { connectDB } = require('./config/db');
const config = require('./config/config');
const app = require('./app');

console.log('🚀 Starting Portfolio Application...');
console.log('------------------------------------------');

const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(config.PORT, () => {
      console.log(`✅ Server running in ${config.NODE_ENV} mode on port ${config.PORT}`);
      console.log('------------------------------------------');
      console.log('📁 API Routes:');
      console.log(`  • Root: http://localhost:${config.PORT}/`);
      console.log(`  • Health Check: http://localhost:${config.PORT}/api/health`);
      console.log(`  • Database Test: http://localhost:${config.PORT}/api/db/test`);
      console.log('------------------------------------------');
      console.log('📱 Portfolio application is now fully operational!');
    });
  } catch (err) {
    console.error('❌ SERVER STARTUP ERROR ❌');
    console.error('------------------------------------------');
    console.error(`Error details: ${err.message}`);
    console.error('------------------------------------------');
    process.exit(1);
  }
};

startServer();
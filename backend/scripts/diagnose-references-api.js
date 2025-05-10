// Script to diagnose the references API endpoint
require('dotenv').config();
const axios = require('axios');
const http = require('http');

async function diagnoseReferencesApi() {
  try {
    console.log('Starting API diagnosis for references endpoint...');
    
    // Test database connection first
    const db = require('../config/db');
    console.log('Testing database connection...');
    
    try {
      const [result] = await db.execute('SELECT 1 as test');
      console.log('✅ Database connection successful:', result);
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError);
      process.exit(1);
    }
    
    // Check if references table exists and has data
    console.log('Checking references table...');
    try {
      const [tables] = await db.execute("SHOW TABLES LIKE 'references'");
      
      if (tables.length === 0) {
        console.error('❌ References table does not exist.');
        process.exit(1);
      }
      
      console.log('✅ References table exists');
      
      // Check for data in the table
      const [rows] = await db.execute('SELECT COUNT(*) as count FROM `references`');
      const count = rows[0].count;
      
      console.log(`✅ References table has ${count} rows`);
      
      if (count > 0) {
        // Show sample data
        const [sampleRows] = await db.execute('SELECT * FROM `references` LIMIT 2');
        console.log('📄 Sample data:');
        console.log(JSON.stringify(sampleRows, null, 2));
      } else {
        console.warn('⚠️ References table is empty');
      }
    } catch (tableError) {
      console.error('❌ Error checking references table:', tableError);
    }
    
    // Test API endpoint directly
    console.log('\nTesting API endpoint directly...');
    try {
      // Method 1: Using http.get (Node.js built-in)
      console.log('Method 1: Using http.get...');
      
      const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/references',
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      };
      
      const req = http.request(options, (res) => {
        console.log(`✅ Status Code: ${res.statusCode}`);
        
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(data);
            console.log(`✅ Received ${parsedData.length} references`);
            console.log('📄 First item:', JSON.stringify(parsedData[0], null, 2));
          } catch (parseError) {
            console.error('❌ Error parsing response:', parseError);
            console.log('Raw response:', data);
          }
        });
      });
      
      req.on('error', (error) => {
        console.error('❌ Request error:', error);
      });
      
      req.end();
      
      // Wait 1 second before trying the next method
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Method 2: Using axios
      console.log('\nMethod 2: Using axios...');
      const response = await axios.get('http://localhost:5000/api/references', {
        headers: { 'Accept': 'application/json' }
      });
      
      console.log(`✅ Status Code: ${response.status}`);
      console.log(`✅ Received ${response.data.length} references`);
      console.log('📄 First item:', JSON.stringify(response.data[0], null, 2));
      
    } catch (apiError) {
      console.error('❌ API request failed:', apiError.message);
    }
    
    console.log('\nDiagnosis complete');
  } catch (error) {
    console.error('❌ Diagnosis failed:', error);
  } finally {
    // Exit after 3 seconds to allow async operations to complete
    setTimeout(() => process.exit(0), 3000);
  }
}

diagnoseReferencesApi(); 
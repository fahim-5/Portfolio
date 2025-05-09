/**
 * This script forces an update to the bio and aboutImageUrl fields in the hero table
 * Run with: node scripts/force_update_about_fields.js
 */

const db = require('../config/db');

// Replace these with your desired values
const NEW_BIO = "I am a full-stack developer with over 5 years of experience building web applications. My expertise includes JavaScript, React, Node.js, and database management. I am passionate about creating clean, efficient code and delivering exceptional user experiences.";
const NEW_IMAGE_URL = "https://example.com/about-image.jpg";

async function forceUpdateAboutFields() {
  try {
    console.log('Starting force update of hero about fields...');
    console.log('Bio to set:', NEW_BIO);
    console.log('Image URL to set:', NEW_IMAGE_URL);
    
    // Check if hero table exists and has a record
    const [rows] = await db.query('SELECT id FROM hero LIMIT 1');
    if (rows.length === 0) {
      console.error('No hero record found. Please create a hero record first.');
      return;
    }
    
    const heroId = rows[0].id;
    console.log(`Found hero record with ID: ${heroId}`);
    
    // Get current values
    const [current] = await db.query('SELECT bio, aboutImageUrl FROM hero WHERE id = ?', [heroId]);
    console.log('Current values:', current[0]);
    
    // Update only the about fields using direct SQL
    console.log('Executing direct SQL update...');
    const query = 'UPDATE hero SET bio = ?, aboutImageUrl = ? WHERE id = ?';
    const [result] = await db.query(query, [NEW_BIO, NEW_IMAGE_URL, heroId]);
    
    console.log('Update result:', result);
    console.log(`Affected rows: ${result.affectedRows}`);
    
    if (result.affectedRows > 0) {
      console.log('Update successful!');
      
      // Verify the update
      const [updated] = await db.query('SELECT bio, aboutImageUrl FROM hero WHERE id = ?', [heroId]);
      console.log('Values after update:', updated[0]);
      
      // Check if the update actually changed the values
      if (updated[0].bio === NEW_BIO && updated[0].aboutImageUrl === NEW_IMAGE_URL) {
        console.log('Verification successful - values were properly updated in the database');
      } else {
        console.log('Verification failed - values in database do not match what we tried to set');
        console.log('Expected:', { bio: NEW_BIO, aboutImageUrl: NEW_IMAGE_URL });
        console.log('Actual:', updated[0]);
      }
    } else {
      console.log('No rows were affected. Update may have failed.');
    }
  } catch (error) {
    console.error('Error updating about fields:', error);
  } finally {
    await db.end();
    console.log('Database connection closed');
  }
}

// Run the script
forceUpdateAboutFields(); 
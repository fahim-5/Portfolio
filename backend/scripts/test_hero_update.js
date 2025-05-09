/**
 * This script directly tests updating the hero bio and aboutImageUrl fields
 */

const db = require('../config/db');
const Hero = require('../models/heroModel');

async function testHeroUpdate() {
  try {
    console.log('Starting hero update test...');
    
    // Test data with specific values for bio and aboutImageUrl
    const testData = {
      greeting: 'Hello, I\'m',
      name: 'Fahim',
      last_name: 'Faysal',
      description: 'Test description',
      job_title: 'Full Stack Developer',
      button_text: 'Get In Touch',
      profile_image_url: 'https://example.com/profile.jpg',
      bio: 'This is a test bio that was directly added through the test script. It should be saved to the database.',
      aboutImageUrl: 'https://example.com/test-about-image.jpg',
      email: 'test@example.com',
      phone: '123-456-7890',
      location: 'Test Location',
      linkedin_url: 'https://linkedin.com/in/test',
      github_url: 'https://github.com/test',
      twitter_url: 'https://twitter.com/test',
      instagram_url: 'https://instagram.com/test',
      stats: [
        { value: '100', label: 'Test Stat 1' },
        { value: '200', label: 'Test Stat 2' }
      ]
    };
    
    console.log('Testing updateHero function with test data...');
    console.log('Test data about fields:', {
      bio: testData.bio,
      aboutImageUrl: testData.aboutImageUrl
    });
    
    // Use the Hero model to update
    await Hero.updateHero(testData);
    console.log('updateHero function completed');
    
    // Verify the update with a direct database query
    console.log('Verifying update in database...');
    const [rows] = await db.query('SELECT bio, aboutImageUrl FROM hero WHERE id = 1');
    
    if (rows.length === 0) {
      console.log('No hero record found with id = 1');
      return;
    }
    
    const hero = rows[0];
    console.log('Database values after update:');
    console.log('  Bio:', hero.bio);
    console.log('  AboutImageUrl:', hero.aboutImageUrl);
    
    // Check if the update was successful
    const bioUpdated = hero.bio === testData.bio;
    const imageUpdated = hero.aboutImageUrl === testData.aboutImageUrl;
    
    console.log('Bio update successful:', bioUpdated);
    console.log('AboutImageUrl update successful:', imageUpdated);
    
    if (bioUpdated && imageUpdated) {
      console.log('TEST PASSED: Both fields were updated successfully');
    } else {
      console.log('TEST FAILED: One or both fields were not updated');
      
      // If the update failed, try a direct SQL update
      if (!bioUpdated || !imageUpdated) {
        console.log('Attempting direct SQL update as fallback...');
        
        const result = await db.query(
          'UPDATE hero SET bio = ?, aboutImageUrl = ? WHERE id = 1',
          [testData.bio, testData.aboutImageUrl]
        );
        
        console.log('Direct SQL update result:', result);
        
        // Verify the direct update
        const [directRows] = await db.query('SELECT bio, aboutImageUrl FROM hero WHERE id = 1');
        console.log('Database values after direct update:');
        console.log('  Bio:', directRows[0].bio);
        console.log('  AboutImageUrl:', directRows[0].aboutImageUrl);
      }
    }
    
    console.log('Test completed!');
  } catch (error) {
    console.error('Error in test:', error);
  } finally {
    await db.end();
    console.log('Database connection closed');
  }
}

// Run the test
testHeroUpdate(); 
/**
 * This script checks the bio and aboutImageUrl fields in the hero table
 */

const db = require('../config/db');

async function checkHeroAboutFields() {
  try {
    console.log('Checking hero table about fields...');
    
    // Check if Hero table exists
    const [tables] = await db.query('SHOW TABLES LIKE "hero"');
    if (tables.length === 0) {
      console.error('Hero table does not exist!');
      return;
    }
    
    // Get table structure
    console.log('Getting hero table structure...');
    const [columns] = await db.query('DESCRIBE hero');
    const columnNames = columns.map(col => col.Field);
    console.log('Hero table columns:', columnNames);
    
    // Check for bio and aboutImageUrl columns
    const hasBioColumn = columnNames.includes('bio');
    const hasAboutImageColumn = columnNames.includes('aboutImageUrl');
    
    console.log('Bio column exists:', hasBioColumn);
    console.log('aboutImageUrl column exists:', hasAboutImageColumn);
    
    if (!hasBioColumn || !hasAboutImageColumn) {
      console.log('Missing columns! Exiting...');
      return;
    }
    
    // Get hero data
    console.log('Getting hero data...');
    const [rows] = await db.query('SELECT id, bio, aboutImageUrl FROM hero');
    
    if (rows.length === 0) {
      console.log('No data in hero table!');
      return;
    }
    
    // Print each row's about fields
    rows.forEach(row => {
      console.log(`Hero ID ${row.id}:`);
      console.log(`  Bio: ${row.bio ? row.bio.substring(0, 50) + '...' : 'NULL'}`);
      console.log(`  AboutImageUrl: ${row.aboutImageUrl || 'NULL'}`);
      console.log(`  Bio is ${row.bio === null ? 'NULL' : (row.bio === '' ? 'EMPTY' : 'FILLED')}`);
      console.log(`  AboutImageUrl is ${row.aboutImageUrl === null ? 'NULL' : (row.aboutImageUrl === '' ? 'EMPTY' : 'FILLED')}`);
    });
    
    // Try updating fields if they're empty
    console.log('\nAttempting to update empty fields...');
    
    for (const row of rows) {
      if (!row.bio || !row.aboutImageUrl) {
        console.log(`Updating hero ID ${row.id} with sample about data...`);
        
        await db.query(
          'UPDATE hero SET bio = ?, aboutImageUrl = ? WHERE id = ?',
          [
            row.bio || 'This is a sample bio text added for testing purposes.',
            row.aboutImageUrl || 'https://example.com/sample-about-image.jpg',
            row.id
          ]
        );
        
        console.log('Update completed!');
      }
    }
    
    // Verify the update
    console.log('\nVerifying updates...');
    const [updatedRows] = await db.query('SELECT id, bio, aboutImageUrl FROM hero');
    
    updatedRows.forEach(row => {
      console.log(`Hero ID ${row.id} (after update):`);
      console.log(`  Bio: ${row.bio ? row.bio.substring(0, 50) + '...' : 'NULL'}`);
      console.log(`  AboutImageUrl: ${row.aboutImageUrl || 'NULL'}`);
    });
    
    console.log('\nScript completed!');
  } catch (error) {
    console.error('Error checking hero about fields:', error);
  } finally {
    await db.end();
    console.log('Database connection closed');
  }
}

// Run the script
checkHeroAboutFields(); 
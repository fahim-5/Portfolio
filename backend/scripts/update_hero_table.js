/**
 * This script adds bio and aboutImageUrl columns to the Hero table
 */

const db = require('../config/db');

async function updateHeroTable() {
  try {
    console.log('Starting Hero table update...');
    
    // Check if Hero table exists
    const [tables] = await db.query('SHOW TABLES LIKE "hero"');
    if (tables.length === 0) {
      console.error('Hero table does not exist! Please create it first.');
      return;
    }
    
    console.log('Hero table exists, checking columns...');
    
    // Get current columns
    const [columns] = await db.query('DESCRIBE hero');
    const columnNames = columns.map(col => col.Field);
    console.log('Current columns:', columnNames);
    
    // Check if bio column already exists
    if (!columnNames.includes('bio')) {
      console.log('Adding bio column to hero table...');
      await db.query('ALTER TABLE hero ADD COLUMN bio TEXT');
      console.log('Bio column added successfully');
    } else {
      console.log('Bio column already exists');
    }
    
    // Check if aboutImageUrl column already exists
    if (!columnNames.includes('aboutImageUrl')) {
      console.log('Adding aboutImageUrl column to hero table...');
      await db.query('ALTER TABLE hero ADD COLUMN aboutImageUrl VARCHAR(512)');
      console.log('aboutImageUrl column added successfully');
    } else {
      console.log('aboutImageUrl column already exists');
    }
    
    // Verify updated table structure
    const [updatedColumns] = await db.query('DESCRIBE hero');
    console.log('Updated hero table structure:', updatedColumns.map(col => col.Field));
    
    console.log('Hero table updated successfully!');
  } catch (error) {
    console.error('Error updating Hero table:', error);
  } finally {
    await db.end();
    console.log('Database connection closed');
  }
}

// Run the script
updateHeroTable(); 
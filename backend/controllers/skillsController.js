const pool = require('../config/db');

// Get all skills
exports.getAllSkills = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM skills ORDER BY category, name');
    
    // Group skills by category
    const groupedSkills = {
      technical: rows.filter(skill => skill.category === 'technical'),
      soft: rows.filter(skill => skill.category === 'soft'),
      languages: rows.filter(skill => skill.category === 'languages')
    };
    
    res.json(groupedSkills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch skills' });
  }
};

// Create new skill
exports.createSkill = async (req, res) => {
  try {
    console.log('Creating skill with data:', req.body);
    const { name, category, level } = req.body;
    
    // Validate required fields
    if (!name || !category) {
      console.log('Validation failed: Missing name or category');
      return res.status(400).json({ success: false, message: 'Name and category are required' });
    }
    
    // Validate category is one of the allowed values
    if (!['technical', 'soft', 'languages'].includes(category)) {
      console.log(`Validation failed: Invalid category "${category}"`);
      return res.status(400).json({ 
        success: false, 
        message: 'Category must be one of: technical, soft, languages' 
      });
    }
    
    console.log('Attempting database insert with values:', { name, category, level });
    
    try {
      // Check if skills table exists
      try {
        await pool.query('SELECT 1 FROM skills LIMIT 1');
        console.log('Skills table exists');
      } catch (tableError) {
        console.log('Skills table may not exist, creating it...');
        try {
          await pool.query(`
            CREATE TABLE IF NOT EXISTS skills (
              id INT NOT NULL AUTO_INCREMENT,
              name VARCHAR(100) NOT NULL,
              category VARCHAR(20) NOT NULL,
              level VARCHAR(20) DEFAULT NULL,
              PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
          `);
          console.log('Skills table created successfully');
        } catch (createError) {
          console.error('Error creating skills table:', createError);
          return res.status(500).json({ success: false, message: 'Error creating skills table' });
        }
      }
      
      // Insert new skill
      const [result] = await pool.query(
        'INSERT INTO skills (name, category, level) VALUES (?, ?, ?)',
        [name, category, level]
      );
      
      console.log('Insert result:', result);
      
      if (!result || !result.insertId) {
        console.log('Database insert failed - no insertId returned');
        return res.status(500).json({ success: false, message: 'Failed to create skill - no ID returned' });
      }
      
      // Return the newly created skill with its ID
      try {
        const [newSkill] = await pool.query('SELECT * FROM skills WHERE id = ?', [result.insertId]);
        console.log('Retrieved new skill:', newSkill);
        
        res.status(201).json({ 
          success: true, 
          message: 'Skill created successfully', 
          skill: newSkill[0] 
        });
      } catch (selectErr) {
        console.error('Error retrieving newly created skill:', selectErr);
        // Still return success even if we can't retrieve the new skill
        res.status(201).json({ 
          success: true, 
          message: 'Skill created but could not retrieve details', 
          skillId: result.insertId 
        });
      }
    } catch (dbError) {
      console.error('Database error during skill creation:', dbError);
      return res.status(500).json({ 
        success: false, 
        message: 'Database error: ' + dbError.message
      });
    }
  } catch (error) {
    console.error('Error creating skill:', error);
    console.error('Error details:', error.message);
    if (error.sql) {
      console.error('SQL query that failed:', error.sql);
    }
    res.status(500).json({ success: false, message: 'Failed to create skill' });
  }
};

// Update skill
exports.updateSkill = async (req, res) => {
  try {
    console.log('Updating skill with data:', req.body);
    const { id } = req.params;
    const { name, category, level } = req.body;
    
    // Validate required fields
    if (!name || !category) {
      console.log('Validation failed: Missing name or category');
      return res.status(400).json({ success: false, message: 'Name and category are required' });
    }
    
    // Validate category is one of the allowed values
    if (!['technical', 'soft', 'languages'].includes(category)) {
      console.log(`Validation failed: Invalid category "${category}"`);
      return res.status(400).json({ 
        success: false, 
        message: 'Category must be one of: technical, soft, languages' 
      });
    }
    
    console.log('Attempting database update with values:', { id, name, category, level });
    
    try {
      // Check if the skill exists
      const [existingSkill] = await pool.query('SELECT * FROM skills WHERE id = ?', [id]);
      
      if (existingSkill.length === 0) {
        console.log(`Skill with ID ${id} not found`);
        return res.status(404).json({ success: false, message: 'Skill not found' });
      }
      
      // Update skill
      const [result] = await pool.query(
        'UPDATE skills SET name = ?, category = ?, level = ? WHERE id = ?',
        [name, category, level, id]
      );
      
      console.log('Update result:', result);
      
      if (result.affectedRows === 0) {
        console.log('No rows were updated');
        return res.status(404).json({ success: false, message: 'Skill not found or no changes made' });
      }
      
      // Get updated skill
      const [updatedSkill] = await pool.query('SELECT * FROM skills WHERE id = ?', [id]);
      
      res.json({ 
        success: true, 
        message: 'Skill updated successfully', 
        skill: updatedSkill[0] 
      });
    } catch (dbError) {
      console.error('Database error during skill update:', dbError);
      return res.status(500).json({ 
        success: false, 
        message: 'Database error: ' + dbError.message
      });
    }
  } catch (error) {
    console.error('Error updating skill:', error);
    console.error('Error details:', error.message);
    if (error.sql) {
      console.error('SQL query that failed:', error.sql);
    }
    res.status(500).json({ success: false, message: 'Failed to update skill' });
  }
};

// Delete skill
exports.deleteSkill = async (req, res) => {
  try {
    console.log('Deleting skill with ID:', req.params.id);
    const { id } = req.params;
    
    try {
      // Check if skill exists
      const [skill] = await pool.query('SELECT * FROM skills WHERE id = ?', [id]);
      
      if (skill.length === 0) {
        console.log(`Skill with ID ${id} not found`);
        return res.status(404).json({ success: false, message: 'Skill not found' });
      }
      
      // Delete skill
      const [result] = await pool.query('DELETE FROM skills WHERE id = ?', [id]);
      
      console.log('Delete result:', result);
      
      if (result.affectedRows === 0) {
        console.log('No rows were deleted');
        return res.status(404).json({ success: false, message: 'Skill not found or could not be deleted' });
      }
      
      res.json({ 
        success: true, 
        message: 'Skill deleted successfully',
        deletedSkillId: id
      });
    } catch (dbError) {
      console.error('Database error during skill deletion:', dbError);
      return res.status(500).json({ 
        success: false, 
        message: 'Database error: ' + dbError.message
      });
    }
  } catch (error) {
    console.error('Error deleting skill:', error);
    console.error('Error details:', error.message);
    if (error.sql) {
      console.error('SQL query that failed:', error.sql);
    }
    res.status(500).json({ success: false, message: 'Failed to delete skill' });
  }
}; 
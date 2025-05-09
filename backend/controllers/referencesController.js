const db = require('../config/db');

// Get all references
exports.getAllReferences = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM `references` ORDER BY createdAt DESC');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching references:', error);
    res.status(500).json({ message: 'Error fetching references', error: error.message });
  }
};

// Get reference by ID
exports.getReferenceById = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM `references` WHERE id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Reference not found' });
    }
    
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error fetching reference:', error);
    res.status(500).json({ message: 'Error fetching reference', error: error.message });
  }
};

// Create new reference
exports.createReference = async (req, res) => {
  try {
    console.log('createReference called with body:', req.body);
    const { name, position, company, quote, image } = req.body;
    
    // Log all incoming data
    console.log('Received reference data:', {
      name,
      position,
      company,
      quote,
      imageProvided: !!image
    });
    
    // Validate required fields
    if (!name || !quote) {
      console.log('Validation failed: Missing name or quote');
      return res.status(400).json({ message: 'Name and quote are required' });
    }
    
    console.log('Inserting reference into database...');
    const [result] = await db.execute(
      'INSERT INTO `references` (name, position, company, quote, image) VALUES (?, ?, ?, ?, ?)',
      [name, position, company, quote, image]
    );
    
    console.log('Insert result:', result);
    const newReferenceId = result.insertId;
    
    console.log('Fetching newly created reference with ID:', newReferenceId);
    const [newReference] = await db.execute('SELECT * FROM `references` WHERE id = ?', [newReferenceId]);
    
    console.log('New reference retrieved:', newReference[0]);
    res.status(201).json(newReference[0]);
  } catch (error) {
    console.error('Error creating reference:', error);
    res.status(500).json({ message: 'Error creating reference', error: error.message });
  }
};

// Update reference
exports.updateReference = async (req, res) => {
  try {
    console.log('updateReference called with params:', req.params);
    console.log('updateReference called with body:', req.body);
    
    const { name, position, company, quote, image } = req.body;
    const referenceId = parseInt(req.params.id, 10); // Ensure ID is a number
    
    if (isNaN(referenceId)) {
      console.error('Invalid reference ID format:', req.params.id);
      return res.status(400).json({ message: 'Invalid reference ID format' });
    }
    
    // Log all incoming data
    console.log('Updating reference data:', {
      id: referenceId,
      name,
      position,
      company,
      quote,
      imageProvided: !!image
    });
    
    // Check if reference exists
    console.log('Checking if reference exists with ID:', referenceId);
    const [existing] = await db.execute('SELECT * FROM `references` WHERE id = ?', [referenceId]);
    
    if (existing.length === 0) {
      console.log('Reference not found with ID:', referenceId);
      return res.status(404).json({ message: 'Reference not found' });
    }
    
    console.log('Reference found:', existing[0]);
    
    // Validate required fields
    if (!name || !quote) {
      console.log('Validation failed: Missing name or quote');
      return res.status(400).json({ message: 'Name and quote are required' });
    }
    
    console.log('Updating reference in database...');
    const [updateResult] = await db.execute(
      'UPDATE `references` SET name = ?, position = ?, company = ?, quote = ?, image = ? WHERE id = ?',
      [name, position, company, quote, image, referenceId]
    );
    
    console.log('Update result:', updateResult);
    
    // Retrieve the updated reference
    console.log('Fetching updated reference');
    const [updatedReference] = await db.execute('SELECT * FROM `references` WHERE id = ?', [referenceId]);
    
    console.log('Updated reference retrieved:', updatedReference[0]);
    res.status(200).json(updatedReference[0]);
  } catch (error) {
    console.error('Error updating reference:', error);
    res.status(500).json({ message: 'Error updating reference', error: error.message });
  }
};

// Delete reference
exports.deleteReference = async (req, res) => {
  try {
    console.log('deleteReference called with params:', req.params);
    const referenceId = parseInt(req.params.id, 10); // Ensure ID is a number
    
    if (isNaN(referenceId)) {
      console.error('Invalid reference ID format:', req.params.id);
      return res.status(400).json({ message: 'Invalid reference ID format' });
    }
    
    console.log('Deleting reference with ID:', referenceId);
    
    // Check if reference exists
    console.log('Checking if reference exists with ID:', referenceId);
    const [existing] = await db.execute('SELECT * FROM `references` WHERE id = ?', [referenceId]);
    
    if (existing.length === 0) {
      console.log('Reference not found with ID:', referenceId);
      return res.status(404).json({ message: 'Reference not found' });
    }
    
    console.log('Reference found:', existing[0]);
    
    // Delete the reference
    console.log('Deleting reference from database...');
    const [deleteResult] = await db.execute('DELETE FROM `references` WHERE id = ?', [referenceId]);
    
    console.log('Delete result:', deleteResult);
    
    res.status(200).json({ 
      message: 'Reference deleted successfully', 
      id: referenceId,
      success: true
    });
  } catch (error) {
    console.error('Error deleting reference:', error);
    res.status(500).json({ message: 'Error deleting reference', error: error.message });
  }
}; 
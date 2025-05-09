const db = require('../config/db');

// Get all pictures
exports.getAllPictures = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM pictures ORDER BY createdAt DESC');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching pictures:', error);
    res.status(500).json({ message: 'Error fetching pictures', error: error.message });
  }
};

// Get picture by ID
exports.getPictureById = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM pictures WHERE id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Picture not found' });
    }
    
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error fetching picture:', error);
    res.status(500).json({ message: 'Error fetching picture', error: error.message });
  }
};

// Create new picture
exports.createPicture = async (req, res) => {
  try {
    console.log('createPicture called with body:', req.body);
    const { title, category, description, link, image } = req.body;
    
    // Log all incoming data
    console.log('Received picture data:', {
      title,
      category,
      description,
      linkProvided: !!link,
      imageProvided: !!image
    });
    
    // Validate required fields
    if (!title || !image) {
      console.log('Validation failed: Missing title or image');
      return res.status(400).json({ message: 'Title and image are required' });
    }
    
    console.log('Inserting picture into database...');
    const [result] = await db.execute(
      'INSERT INTO pictures (title, category, description, link, image) VALUES (?, ?, ?, ?, ?)',
      [title, category, description, link, image]
    );
    
    console.log('Insert result:', result);
    const newPictureId = result.insertId;
    
    console.log('Fetching newly created picture with ID:', newPictureId);
    const [newPicture] = await db.execute('SELECT * FROM pictures WHERE id = ?', [newPictureId]);
    
    console.log('New picture retrieved:', newPicture[0]);
    res.status(201).json(newPicture[0]);
  } catch (error) {
    console.error('Error creating picture:', error);
    res.status(500).json({ message: 'Error creating picture', error: error.message });
  }
};

// Update picture
exports.updatePicture = async (req, res) => {
  try {
    console.log('updatePicture called with params:', req.params);
    console.log('updatePicture called with body:', req.body);
    
    const { title, category, description, link, image } = req.body;
    const pictureId = parseInt(req.params.id, 10); // Ensure ID is a number
    
    if (isNaN(pictureId)) {
      console.error('Invalid picture ID format:', req.params.id);
      return res.status(400).json({ message: 'Invalid picture ID format' });
    }
    
    // Log all incoming data
    console.log('Updating picture data:', {
      id: pictureId,
      title,
      category,
      description,
      linkProvided: !!link,
      imageProvided: !!image
    });
    
    // Check if picture exists
    console.log('Checking if picture exists with ID:', pictureId);
    const [existing] = await db.execute('SELECT * FROM pictures WHERE id = ?', [pictureId]);
    
    if (existing.length === 0) {
      console.log('Picture not found with ID:', pictureId);
      return res.status(404).json({ message: 'Picture not found' });
    }
    
    console.log('Picture found:', existing[0]);
    
    // Validate required fields
    if (!title || !image) {
      console.log('Validation failed: Missing title or image');
      return res.status(400).json({ message: 'Title and image are required' });
    }
    
    console.log('Updating picture in database...');
    const [updateResult] = await db.execute(
      'UPDATE pictures SET title = ?, category = ?, description = ?, link = ?, image = ? WHERE id = ?',
      [title, category, description, link, image, pictureId]
    );
    
    console.log('Update result:', updateResult);
    
    // Retrieve the updated picture
    console.log('Fetching updated picture');
    const [updatedPicture] = await db.execute('SELECT * FROM pictures WHERE id = ?', [pictureId]);
    
    console.log('Updated picture retrieved:', updatedPicture[0]);
    res.status(200).json(updatedPicture[0]);
  } catch (error) {
    console.error('Error updating picture:', error);
    res.status(500).json({ message: 'Error updating picture', error: error.message });
  }
};

// Delete picture
exports.deletePicture = async (req, res) => {
  try {
    console.log('deletePicture called with params:', req.params);
    const pictureId = parseInt(req.params.id, 10); // Ensure ID is a number
    
    if (isNaN(pictureId)) {
      console.error('Invalid picture ID format:', req.params.id);
      return res.status(400).json({ message: 'Invalid picture ID format' });
    }
    
    console.log('Deleting picture with ID:', pictureId);
    
    // Check if picture exists
    console.log('Checking if picture exists with ID:', pictureId);
    const [existing] = await db.execute('SELECT * FROM pictures WHERE id = ?', [pictureId]);
    
    if (existing.length === 0) {
      console.log('Picture not found with ID:', pictureId);
      return res.status(404).json({ message: 'Picture not found' });
    }
    
    console.log('Picture found:', existing[0]);
    
    // Delete the picture
    console.log('Deleting picture from database...');
    const [deleteResult] = await db.execute('DELETE FROM pictures WHERE id = ?', [pictureId]);
    
    console.log('Delete result:', deleteResult);
    
    res.status(200).json({ 
      message: 'Picture deleted successfully', 
      id: pictureId,
      success: true
    });
  } catch (error) {
    console.error('Error deleting picture:', error);
    res.status(500).json({ message: 'Error deleting picture', error: error.message });
  }
}; 
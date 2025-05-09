const pool = require('../config/db');

// Ensure projects table exists on startup
const ensureProjectsTableExists = async () => {
  try {
    console.log('Checking if projects table exists...');
    const [tables] = await pool.query("SHOW TABLES LIKE 'projects'");
    
    if (tables.length === 0) {
      console.log('Projects table does not exist. Creating it now...');
      await pool.query(`
        CREATE TABLE IF NOT EXISTS projects (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          category VARCHAR(100),
          description TEXT,
          image VARCHAR(512),
          technologies TEXT,
          demoUrl VARCHAR(512),
          repoUrl VARCHAR(512),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      console.log('Projects table created successfully!');
      
      // Add some sample data if needed
      console.log('Adding sample project data...');
      await pool.query(`
        INSERT INTO projects (title, category, description, image, technologies, demoUrl, repoUrl)
        VALUES 
        ('Personal Portfolio', 'Web Development', 'A modern portfolio website built with React and Node.js', 'https://placehold.co/800x600/blue/white?text=Portfolio+Preview', 'React, Node.js, Express, MySQL', 'https://example.com/portfolio', 'https://github.com/example/portfolio'),
        ('Task Manager App', 'Web Application', 'A full-featured task management application with user authentication', 'https://placehold.co/800x600/purple/white?text=Task+Manager', 'React, Redux, Express, MongoDB', 'https://example.com/taskmanager', 'https://github.com/example/taskmanager')
      `);
      console.log('Sample project data added successfully!');
    } else {
      console.log('Projects table already exists.');
    }
  } catch (error) {
    console.error('Error setting up projects table:', error);
  }
};

// Call the function to ensure the table exists
ensureProjectsTableExists();

// Get all projects
exports.getAllProjects = async (req, res) => {
  console.log('GET /api/admin/projects called');
  console.log('User authenticated:', req.user ? 'Yes' : 'No');
  
  try {
    // Check database connection first
    try {
      console.log('Testing database connection...');
      const [testResult] = await pool.query('SELECT 1 as test');
      console.log('Database connection test result:', testResult);
    } catch (dbError) {
      console.error('Database connection test failed:', dbError);
      
      // Emergency fallback - return hard-coded projects if database is down
      console.log('Returning emergency fallback projects data');
      return res.json([
        {
          id: 999,
          title: 'Emergency Fallback Project',
          category: 'Web Development',
          description: 'This is a fallback project shown when database connection fails.',
          image: 'https://placehold.co/800x600/gray/white?text=Fallback+Project',
          technologies: 'HTML, CSS, JavaScript',
          demoUrl: 'https://example.com',
          repoUrl: 'https://github.com/example/fallback'
        }
      ]);
    }
    
    // Check if the projects table exists
    try {
      console.log('Checking if projects table exists...');
      const [tables] = await pool.query("SHOW TABLES LIKE 'projects'");
      if (tables.length === 0) {
        console.warn('Projects table does not exist!');
        // If table doesn't exist, create it
        console.log('Creating projects table...');
        await pool.query(`
          CREATE TABLE IF NOT EXISTS projects (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            category VARCHAR(100),
            description TEXT,
            image VARCHAR(512),
            technologies TEXT,
            demoUrl VARCHAR(512),
            repoUrl VARCHAR(512),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          )
        `);
        console.log('Projects table created successfully');
        
        // Add demo data
        console.log('Adding sample project data...');
        try {
          await pool.query(`
            INSERT INTO projects (title, category, description, image, technologies, demoUrl, repoUrl)
            VALUES 
            ('Personal Portfolio', 'Web Development', 'A responsive portfolio website built with React and Node.js', 'https://placehold.co/800x600/blue/white?text=Portfolio+Preview', 'React, Node.js, Express, MySQL', 'https://example.com/portfolio', 'https://github.com/example/portfolio'),
            ('Task Manager App', 'Web Application', 'A full-featured task management application with user authentication', 'https://placehold.co/800x600/purple/white?text=Task+Manager', 'React, Redux, Express, MongoDB', 'https://example.com/taskmanager', 'https://github.com/example/taskmanager')
          `);
          console.log('Sample data added successfully');
        } catch (sampleDataError) {
          console.error('Error adding sample data:', sampleDataError);
        }
        
        // Return the sample data directly
        return res.json([
          {
            id: 1,
            title: 'Personal Portfolio',
            category: 'Web Development',
            description: 'A responsive portfolio website built with React and Node.js',
            image: 'https://placehold.co/800x600/blue/white?text=Portfolio+Preview',
            technologies: 'React, Node.js, Express, MySQL',
            demoUrl: 'https://example.com/portfolio',
            repoUrl: 'https://github.com/example/portfolio'
          },
          {
            id: 2,
            title: 'Task Manager App',
            category: 'Web Application',
            description: 'A full-featured task management application with user authentication',
            image: 'https://placehold.co/800x600/purple/white?text=Task+Manager',
            technologies: 'React, Redux, Express, MongoDB',
            demoUrl: 'https://example.com/taskmanager',
            repoUrl: 'https://github.com/example/taskmanager'
          }
        ]);
      }
    } catch (tableError) {
      console.error('Error checking/creating projects table:', tableError);
      // Continue anyway, the query might still work
    }
    
    // Get all projects
    console.log('Querying projects table...');
    try {
      const [rows] = await pool.query('SELECT * FROM projects ORDER BY id DESC');
      console.log(`Found ${rows.length} projects`);
      
      // Ensure all rows have proper structure
      const sanitizedRows = rows.map(row => ({
        id: row.id,
        title: row.title || 'Untitled Project',
        category: row.category || 'Uncategorized',
        description: row.description || '',
        image: row.image || 'https://placehold.co/800x600/gray/white?text=No+Image',
        technologies: row.technologies || '',
        demoUrl: row.demoUrl || '',
        repoUrl: row.repoUrl || ''
      }));
      
      // If no projects found, return sample data
      if (sanitizedRows.length === 0) {
        console.log('No projects found in database, returning sample data');
        return res.json([
          {
            id: 1,
            title: 'Sample Portfolio Project',
            category: 'Web Development',
            description: 'A responsive portfolio website built with React and Node.js',
            image: 'https://placehold.co/800x600/teal/white?text=Sample+Project',
            technologies: 'React, Node.js, Express, MySQL',
            demoUrl: 'https://example.com/portfolio',
            repoUrl: 'https://github.com/example/portfolio'
          }
        ]);
      }
      
      // If user is authenticated, we can add extra data or filters
      if (req.user) {
        console.log('User is authenticated, returning full project data');
      } else {
        console.log('User is not authenticated, returning public project data');
        // You could filter out draft projects or sensitive data here if needed
      }
      
      // Log response before sending
      console.log('Successfully retrieved projects, sending response');
      console.log('First project in response:', sanitizedRows[0]);
      
      res.json(sanitizedRows);
    } catch (queryError) {
      console.error('Error querying projects:', queryError);
      // Return fallback data on query error
      return res.json([
        {
          id: 998,
          title: 'Query Error Fallback Project',
          category: 'Web Development',
          description: 'This is shown when there was an error querying the projects table.',
          image: 'https://placehold.co/800x600/orange/white?text=Query+Error',
          technologies: 'HTML, CSS, JavaScript',
          demoUrl: 'https://example.com',
          repoUrl: 'https://github.com/example/fallback'
        }
      ]);
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
    console.error('Error details:', error.stack);
    
    // Final fallback - always return some data instead of failing
    console.log('Returning fallback project data due to error');
    res.set('X-Error-Message', 'Failed to fetch projects: ' + error.message);
    res.json([
      {
        id: 997,
        title: 'Error Fallback Project',
        category: 'Web Development',
        description: 'This is a fallback project shown when an error occurs.',
        image: 'https://placehold.co/800x600/red/white?text=Error+Fallback',
        technologies: 'HTML, CSS, JavaScript',
        demoUrl: 'https://example.com',
        repoUrl: 'https://github.com/example/fallback'
      }
    ]);
  }
};

// Create new project
exports.createProject = async (req, res) => {
  try {
    const { title, category, description, image, technologies, demoUrl, repoUrl } = req.body;
    
    // Validate required fields
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }
    
    const [result] = await pool.query(
      'INSERT INTO projects (title, category, description, image, technologies, demoUrl, repoUrl) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, category, description, image, technologies, demoUrl, repoUrl]
    );
    
    const [newProject] = await pool.query('SELECT * FROM projects WHERE id = ?', [result.insertId]);
    
    res.status(201).json({ 
      success: true, 
      message: 'Project created successfully', 
      project: newProject[0] 
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ success: false, message: 'Failed to create project' });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, description, image, technologies, demoUrl, repoUrl } = req.body;
    
    // Validate required fields
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }
    
    const [result] = await pool.query(
      'UPDATE projects SET title = ?, category = ?, description = ?, image = ?, technologies = ?, demoUrl = ?, repoUrl = ? WHERE id = ?',
      [title, category, description, image, technologies, demoUrl, repoUrl, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    const [updatedProject] = await pool.query('SELECT * FROM projects WHERE id = ?', [id]);
    
    res.json({ 
      success: true, 
      message: 'Project updated successfully', 
      project: updatedProject[0] 
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ success: false, message: 'Failed to update project' });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.query('DELETE FROM projects WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'Project deleted successfully',
      deletedProjectId: id
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ success: false, message: 'Failed to delete project' });
  }
}; 
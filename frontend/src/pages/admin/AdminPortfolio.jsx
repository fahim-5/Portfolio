import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AdminPortfolio.module.css';
import portfolioService from '../../services/portfolioService';
import { clearSectionCache } from '../../services/clearCache';

// Diagnostic Component
const ApiDiagnostic = ({ onReload }) => {
  const [diagnosticData, setDiagnosticData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  const runDiagnostics = async () => {
    setIsLoading(true);
    const results = { status: {}, endpoints: {}, auth: {}, database: {} };
    
    try {
      // Test server status
      try {
        const statusRes = await fetch('http://localhost:5000/api/status', { 
          method: 'GET',
          cache: 'no-store',
          credentials: 'include'
        });
        results.status.ok = statusRes.ok;
        results.status.status = statusRes.status;
        if (statusRes.ok) {
          results.status.data = await statusRes.json();
        }
      } catch (e) {
        results.status.error = e.message;
      }
      
      // Test database connection
      try {
        const dbRes = await fetch('http://localhost:5000/api/db-check', {
          method: 'GET',
          cache: 'no-store',
          credentials: 'include'
        });
        results.database.ok = dbRes.ok;
        results.database.status = dbRes.status;
        if (dbRes.ok) {
          const dbData = await dbRes.json();
          results.database.connected = dbData.dbConnected;
          results.database.projectsTableExists = dbData.projectsTableExists;
          results.database.message = dbData.message;
        }
      } catch (e) {
        results.database.error = e.message;
      }
      
      // Test projects endpoint
      try {
        // First try non-admin route
        const publicProjectsRes = await fetch('http://localhost:5000/api/projects', { 
          method: 'GET',
          cache: 'no-store',
          credentials: 'include'
        });
        results.endpoints.publicProjectsOk = publicProjectsRes.ok;
        results.endpoints.publicProjectsStatus = publicProjectsRes.status;
        if (publicProjectsRes.ok) {
          const data = await publicProjectsRes.json();
          results.endpoints.publicProjectsData = `Found ${data.length} projects`;
        }
        
        // Then try admin route
        const projectsRes = await fetch('http://localhost:5000/api/admin/projects', { 
          method: 'GET',
          cache: 'no-store',
          credentials: 'include'
        });
        results.endpoints.projectsOk = projectsRes.ok;
        results.endpoints.projectsStatus = projectsRes.status;
        if (projectsRes.ok) {
          const data = await projectsRes.json();
          results.endpoints.projectsData = `Found ${data.length} projects`;
        }
      } catch (e) {
        results.endpoints.projectsError = e.message;
      }
      
      // Test auth token
      const token = localStorage.getItem('authToken');
      results.auth.hasToken = !!token;
      if (token) {
        // Try to parse token info
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          results.auth.tokenInfo = JSON.parse(jsonPayload);
        } catch (e) {
          results.auth.tokenError = e.message;
        }
      }
      
      setDiagnosticData(results);
    } catch (e) {
      setDiagnosticData({ error: e.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCache = () => {
    try {
      clearSectionCache('projects');
      alert('Projects cache cleared. Click Reload to fetch fresh data.');
    } catch (error) {
      console.error('Error clearing cache:', error);
      alert('Error clearing cache: ' + error.message);
    }
  };

  return (
    <div className={styles.diagnosticPanel}>
      <button 
        className={styles.diagnosticButton}
        onClick={() => {
          if (showDiagnostics) {
            setShowDiagnostics(false);
            setDiagnosticData(null);
          } else {
            setShowDiagnostics(true);
            runDiagnostics();
          }
        }}
      >
        {showDiagnostics ? 'Hide Diagnostics' : 'Show API Diagnostics'}
      </button>
      
      {showDiagnostics && (
        <div className={styles.diagnosticResults}>
          {isLoading ? (
            <p>Running diagnostics...</p>
          ) : diagnosticData ? (
            <div>
              <h4>API Diagnostics Results</h4>
              
              <div className={styles.diagnosticSection}>
                <h5>Status Endpoint:</h5>
                {diagnosticData.status.error ? (
                  <p className={styles.errorText}>Error: {diagnosticData.status.error}</p>
                ) : (
                  <p>
                    Status: {diagnosticData.status.ok ? '✅' : '❌'} 
                    {diagnosticData.status.status} 
                    {diagnosticData.status.data && JSON.stringify(diagnosticData.status.data)}
                  </p>
                )}
              </div>
              
              <div className={styles.diagnosticSection}>
                <h5>Database Status:</h5>
                {diagnosticData.database?.error ? (
                  <p className={styles.errorText}>Error: {diagnosticData.database.error}</p>
                ) : (
                  <div>
                    <p>
                      Connection: {diagnosticData.database?.connected ? '✅' : '❌'} 
                      {diagnosticData.database?.message && ` - ${diagnosticData.database.message}`}
                    </p>
                    <p>
                      Projects Table: {diagnosticData.database?.projectsTableExists ? '✅ Exists' : '❌ Missing'}
                    </p>
                  </div>
                )}
              </div>
              
              <div className={styles.diagnosticSection}>
                <h5>Projects Endpoint:</h5>
                {diagnosticData.endpoints.projectsError ? (
                  <p className={styles.errorText}>Error: {diagnosticData.endpoints.projectsError}</p>
                ) : (
                  <p>
                    Status: {diagnosticData.endpoints.projectsOk ? '✅' : '❌'} 
                    {diagnosticData.endpoints.projectsStatus}
                    {diagnosticData.endpoints.projectsData && ` - ${diagnosticData.endpoints.projectsData}`}
                  </p>
                )}
              </div>
              
              <div className={styles.diagnosticSection}>
                <h5>Authentication:</h5>
                {diagnosticData.auth.hasToken ? (
                  <>
                    <p>Token: ✅ Present</p>
                    {diagnosticData.auth.tokenInfo && (
                      <div>
                        <p>User ID: {diagnosticData.auth.tokenInfo.userId}</p>
                        <p>Is Admin: {diagnosticData.auth.tokenInfo.isAdmin ? 'Yes' : 'No'}</p>
                        <p>Expires: {new Date(diagnosticData.auth.tokenInfo.exp * 1000).toLocaleString()}</p>
                      </div>
                    )}
                    {diagnosticData.auth.tokenError && (
                      <p className={styles.errorText}>Token Parse Error: {diagnosticData.auth.tokenError}</p>
                    )}
                  </>
                ) : (
                  <p className={styles.errorText}>Token: ❌ Missing</p>
                )}
              </div>
              
              <div className={styles.diagnosticActions}>
                <button onClick={runDiagnostics} className={styles.diagnosticRefresh}>
                  Refresh Diagnostics
                </button>
                <button onClick={onReload} className={styles.diagnosticRefresh}>
                  Reload Projects
                </button>
                <button onClick={handleClearCache} className={styles.clearCacheButton}>
                  Clear Cache
                </button>
                {!diagnosticData.auth.hasToken && (
                  <button 
                    onClick={() => window.location.href = '/admin/login'} 
                    className={styles.diagnosticLogin}
                  >
                    Go to Login
                  </button>
                )}
              </div>
            </div>
          ) : (
            <p>Click 'Run Diagnostics' to test API connectivity</p>
          )}
        </div>
      )}
    </div>
  );
};

const AdminPortfolio = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [project, setProject] = useState({
    title: '',
    category: '',
    description: '',
    image: '',
    technologies: '',
    demoUrl: '',
    repoUrl: ''
  });

  // Fetch projects on component mount
  useEffect(() => {
    console.log("AdminPortfolio component mounted");
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    console.log("Fetching projects data...");
    
    // Add a timestamp to prevent caching issues
    const timestamp = new Date().getTime();
    
    try {
      // First check server basic availability with direct fetch
      try {
        console.log("Testing server connectivity with direct fetch...");
        const serverTest = await fetch('http://localhost:5000/api/status?t=' + timestamp, {
          method: 'GET',
          mode: 'cors',
          credentials: 'include',
          headers: { 'Accept': 'application/json' },
          cache: 'no-store'
        });
        
        if (serverTest.ok) {
          const testData = await serverTest.json();
          console.log("Server is available:", testData);
        } else {
          console.error("Server responded with error:", serverTest.status);
          setError(`Server responded with error status: ${serverTest.status}`);
        }
      } catch (connectError) {
        console.error("Server connectivity test failed:", connectError.message);
        setError(`Cannot connect to server: ${connectError.message}. Is the backend running?`);
      }
      
      // Now try a direct API call to projects endpoint
      try {
        console.log("Testing projects API with direct fetch...");
        
        // Get auth token if available
        const token = localStorage.getItem('authToken');
        const headers = {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const projectsTest = await fetch('http://localhost:5000/api/admin/projects?t=' + timestamp, {
          method: 'GET',
          mode: 'cors',
          credentials: 'include',
          headers,
          cache: 'no-store'
        });
        
        if (projectsTest.ok) {
          const directData = await projectsTest.json();
          console.log("Direct fetch of projects succeeded:", directData);
          
          if (Array.isArray(directData)) {
            setProjects(directData.map((proj, index) => {
              if (!proj.id) {
                return { ...proj, id: `direct-id-${index}` };
              }
              return proj;
            }));
            setError(null);
            setLoading(false);
            return; // Skip the portfolioService call
          }
        } else {
          console.error("Projects API responded with error:", projectsTest.status);
        }
      } catch (apiError) {
        console.error("Direct projects API test failed:", apiError.message);
      }
      
      // If direct fetch failed or had issues, fall back to portfolioService
      console.log("Falling back to portfolioService.fetchProjectsData()");
      const data = await portfolioService.fetchProjectsData();
      console.log("Projects data received:", data);
      
      if (data && Array.isArray(data)) {
        // Ensure each project has a unique identifier
        const projectsWithIds = data.map((proj, index) => {
          // If the project doesn't have an id, add an index-based one
          if (!proj.id) {
            return { ...proj, id: `temp-id-${index}` };
          }
          return proj;
        });
        setProjects(projectsWithIds);
        setError(null);
      } else {
        console.log("No projects data returned or invalid format");
        // Try loading from localStorage as fallback
        const localData = portfolioService.getSectionData('projects');
        console.log("Local projects data:", localData);
        if (localData && Array.isArray(localData)) {
          // Ensure each local project has a unique identifier
          const localProjectsWithIds = localData.map((proj, index) => {
            if (!proj.id) {
              return { ...proj, id: `local-id-${index}` };
            }
            return proj;
          });
          setProjects(localProjectsWithIds);
        } else {
          setProjects([]);
        }
        setError("Failed to load from API - using cached data");
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
        console.error('Error status:', err.response.status);
      } else if (err.request) {
        console.error('Error request:', err.request);
      }
      
      setError(`Failed to load projects: ${err.message}`);
      
      // Try to load from localStorage as a fallback
      try {
        const localData = portfolioService.getSectionData('projects');
        console.log("Attempting to load from localStorage:", localData);
        if (localData && Array.isArray(localData) && localData.length > 0) {
          // Ensure each local project has a unique identifier
          const localProjectsWithIds = localData.map((proj, index) => {
            if (!proj.id) {
              return { ...proj, id: `fallback-id-${index}` };
            }
            return proj;
          });
          setProjects(localProjectsWithIds);
          setError("API error - using cached data");
        }
      } catch (localErr) {
        console.error("LocalStorage fallback failed:", localErr);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setProject({
      title: '',
      category: '',
      description: '',
      image: '',
      technologies: '',
      demoUrl: '',
      repoUrl: ''
    });
    setEditMode(false);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Make sure image URL is a valid URL or use a reliable fallback
      if (!project.image || project.image.trim() === '') {
        // Use a reliable placeholder image service
        project.image = 'https://placehold.co/800x600/darkgray/white?text=No+Image';
      }
      
      // Clear localStorage cache to ensure fresh data is loaded
      localStorage.removeItem('portfolio_projects');
      
      let success;
      
      if (editMode) {
        try {
          success = await portfolioService.updateProject(editId, project);
          console.log('Update project result:', success);
        } catch (updateError) {
          console.error('Error updating project:', updateError);
          throw new Error(`Failed to update project: ${updateError.message}`);
        }
      } else {
        try {
          success = await portfolioService.createProject(project);
          console.log('Create project result:', success);
        } catch (createError) {
          console.error('Error creating project:', createError);
          throw new Error(`Failed to create project: ${createError.message}`);
        }
      }
      
      if (success) {
        resetForm();
        await fetchProjects();
        setError(null);
      } else {
        throw new Error('Operation failed. Server returned success: false');
      }
    } catch (err) {
      console.error('Error saving project:', err);
      setError(`Failed to save project: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project) => {
    setProject({
      title: project.title || '',
      category: project.category || '',
      description: project.description || '',
      image: project.image || '',
      technologies: project.technologies || '',
      demoUrl: project.demoUrl || '',
      repoUrl: project.repoUrl || ''
    });
    setEditMode(true);
    setEditId(project.id);
  };

  const handleDelete = async (id) => {
    if (!id) {
      setError('Cannot delete: Invalid project ID');
      return;
    }
    
    // Confirm before deletion
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }
    
    setLoading(true);
    try {
      console.log(`Attempting to delete project with ID: ${id}`);
      
      // Check for authentication
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Authentication required. Please log in again.');
        setLoading(false);
        return;
      }
      
      // Show temporary optimistic UI update
      setProjects(prev => prev.filter(p => p.id !== id));
      
      const success = await portfolioService.deleteProject(id);
      
      if (success) {
        // Already removed from UI
        console.log('Project deleted successfully');
        setError(null);
      } else {
        // Revert optimistic update
        await fetchProjects(); // Reload all projects
        setError('Failed to delete project. Please try again.');
      }
    } catch (err) {
      console.error('Error deleting project:', err);
      
      // Reload projects to revert optimistic update
      await fetchProjects();
      
      // Detailed error message
      let errorMessage = 'Failed to delete project';
      
      if (err.message) {
        errorMessage += `: ${err.message}`;
      }
      
      if (err.response?.status === 401 || err.response?.status === 403) {
        errorMessage = 'Authentication error. Please log in again.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className={styles.loadingState}>
      <div className={styles.loadingIcon}></div>
      <p className={styles.loadingText}>
        {editMode ? 'Updating project...' : 'Loading projects...'}
      </p>
      <p className={styles.loadingHint}>
        This may take a moment. Please wait while we connect to the database.
      </p>
    </div>
  );

  return (
    <div className={styles.adminPortfolio}>
      <ApiDiagnostic onReload={fetchProjects} />
      
      <h2>{editMode ? 'Edit Project' : 'Add New Project'}</h2>
      
      {error && (
        <div className={styles.error}>
          <strong>Error:</strong> {error}
          <div className={styles.errorActions}>
            <button onClick={fetchProjects} className={styles.retryButton}>
              <span>↻</span> Retry
            </button>
            <button
              onClick={() => window.location.reload()}
              className={styles.reloadButton}
            >
              <span>↻</span> Reload Page
            </button>
          </div>
          <div className={styles.errorHelp}>
            <p>
              <strong>Troubleshooting tips:</strong>
            </p>
            <ul>
              <li>Check that the backend server is running</li>
              <li>Verify your authentication status using the API Diagnostics tool above</li>
              <li>Check for network connectivity issues</li>
            </ul>
          </div>
        </div>
      )}
      
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="title">
                <span className={styles.labelIcon}>📝</span>
                Project Title *
              </label>
              <input 
                type="text" 
                id="title"
                name="title" 
                value={project.title} 
                onChange={handleChange} 
                placeholder="Project Title" 
                required 
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="category">
                <span className={styles.labelIcon}>🏷️</span>
                Category
              </label>
              <input 
                type="text" 
                id="category"
                name="category" 
                value={project.category} 
                onChange={handleChange} 
                placeholder="e.g. Web Development, Mobile App" 
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="image">
                <span className={styles.labelIcon}>🖼️</span>
                Image URL *
              </label>
              <input 
                type="text" 
                id="image"
                name="image" 
                value={project.image} 
                onChange={handleChange} 
                placeholder="Image URL" 
                required 
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="technologies">
                <span className={styles.labelIcon}>⚙️</span>
                Technologies
              </label>
              <input 
                type="text" 
                id="technologies"
                name="technologies" 
                value={project.technologies} 
                onChange={handleChange} 
                placeholder="Technologies (comma-separated)" 
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="demoUrl">
                <span className={styles.labelIcon}>🔗</span>
                Demo URL
              </label>
              <input 
                type="text" 
                id="demoUrl"
                name="demoUrl" 
                value={project.demoUrl} 
                onChange={handleChange} 
                placeholder="Live Demo URL (optional)" 
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="repoUrl">
                <span className={styles.labelIcon}>💻</span>
                Repository URL
              </label>
              <input 
                type="text" 
                id="repoUrl"
                name="repoUrl" 
                value={project.repoUrl} 
                onChange={handleChange} 
                placeholder="GitHub Repository URL (optional)" 
              />
            </div>
            
            <div className={`${styles.formGroup} ${styles.formFullWidth}`}>
              <label htmlFor="description">
                <span className={styles.labelIcon}>📄</span>
                Description
              </label>
              <textarea 
                id="description"
                name="description" 
                value={project.description} 
                onChange={handleChange} 
                placeholder="Project description" 
                rows={4}
              />
            </div>
          </div>
          
          <div className={styles.formActions}>
            <button type="submit" className={styles.saveButton}>
              {editMode ? '✓ Update Project' : '+ Save Project'}
            </button>
            
            {editMode && (
              <button 
                type="button" 
                className={styles.cancelButton}
                onClick={resetForm}
              >
                ✕ Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      
      <h3 className={styles.projectsHeading}>
        <span className={styles.headerIcon}>📋</span> Existing Projects
        {projects.length > 0 && <span className={styles.projectCount}>{projects.length}</span>}
      </h3>
      
      {projects.length > 0 ? (
        <div className={styles.projectList}>
          {projects.map((proj, index) => (
            <div key={proj.id || `project-${index}`} className={styles.projectItem}>
              <div className={styles.projectImage}>
                <img 
                  src={proj.image || proj.imageUrl || 'https://placehold.co/150/darkgray/white?text=No+Image'} 
                  alt={proj.title || 'Project'}
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = 'https://placehold.co/150/red/white?text=Error';
                  }}
                />
              </div>
              <div className={styles.projectDetails}>
                <h4>{proj.title || 'Untitled Project'}</h4>
                {proj.category && <p className={styles.category}>{proj.category}</p>}
                {proj.description && <p className={styles.description}>{proj.description}</p>}
                {proj.technologies && (
                  <div className={styles.techList}>
                    {proj.technologies.split(',').map((tech, techIndex) => (
                      <span key={techIndex} className={styles.techTag}>
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className={styles.projectActions}>
                <button 
                  className={styles.editBtn}
                  onClick={() => handleEdit(proj)}
                >
                  Edit
                </button>
                <button 
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(proj.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>No projects found. Add your first project above.</p>
        </div>
      )}
    </div>
  );
};

export default AdminPortfolio;

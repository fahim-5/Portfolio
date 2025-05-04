import React, { useState, useEffect } from 'react';
import './adminDashboard.css';

const ProjectEditors = ({ projects = [], onSave }) => {
  const [projectList, setProjectList] = useState(projects);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  
  useEffect(() => {
    setProjectList(projects);
  }, [projects]);

  const addNewProject = () => {
    const newProject = {
      id: Date.now(),
      title: "New Project",
      category: "Web Development",
      description: "",
      imageUrl: "",
      demoUrl: "",
      repoUrl: "",
      completionDate: "",
      technologies: ""
    };
    
    const updatedProjects = [...projectList, newProject];
    setProjectList(updatedProjects);
    
    // Save without showing notification
    if (onSave) {
      onSave(updatedProjects);
    }
  };
  
  const updateProject = (index, field, value) => {
    const updatedProjects = [...projectList];
    updatedProjects[index] = {
      ...updatedProjects[index],
      [field]: value
    };
    
    setProjectList(updatedProjects);
    
    // Auto-save changes
    if (onSave) {
      onSave(updatedProjects);
      showSaveMessage && clearTimeout(showSaveMessage);
      const timer = setTimeout(() => setShowSaveMessage(false), 2000);
      setShowSaveMessage(timer);
    }
  };
  
  const confirmDeleteProject = (index) => {
    setDeleteIndex(index);
    setShowDeleteConfirm(true);
  };
  
  const deleteProject = () => {
    if (deleteIndex === null) return;
    
    const updatedProjects = projectList.filter((_, index) => index !== deleteIndex);
    setProjectList(updatedProjects);
    
    // Save the updated project list
    if (onSave) {
      onSave(updatedProjects);
    }
    
    // Close the confirm dialog
    setShowDeleteConfirm(false);
    setDeleteIndex(null);
  };
  
  const cancelDeleteProject = () => {
    setShowDeleteConfirm(false);
    setDeleteIndex(null);
  };
  
  const handleSaveChanges = () => {
    if (onSave) {
      onSave(projectList);
      // Show alert for user feedback when Save Changes button is clicked
      alert('Projects saved successfully!');
    }
  };
  
  const uploadImage = (index) => {
    // This would normally handle file uploads, but for now just a placeholder
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // In a real app, you would upload the file to a server
        // and get back a URL. For now, we'll use a local URL
        const imageUrl = URL.createObjectURL(file);
        updateProject(index, 'imageUrl', imageUrl);
      }
    };
    
    fileInput.click();
  };

  return (
    <div className="content-section">
      <div className="editor-header">
        <h2>Edit Projects</h2>
        <div className="editor-actions">
          <button className="btn-primary" onClick={handleSaveChanges}>
            Save Changes
          </button>
          <button className="btn-secondary">
            Cancel
          </button>
        </div>
      </div>
      
      <h3 className="section-subheader">Portfolio Projects</h3>
      
      <div className="education-entries">
        {projectList.length > 0 ? (
          projectList.map((project, index) => (
            <div key={index} className="education-card">
              <div className="education-card-header">
                <h4 className="education-title">
                  {project.title || 'New Project'} 
                  {project.category && (
                    <span className="education-institution">
                      {' - '}{project.category}
                    </span>
                  )}
                </h4>
                <div className="card-actions">
                  <button 
                    className="btn-icon btn-delete"
                    onClick={() => confirmDeleteProject(index)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              
              <div className="education-card-content">
                <div className="form-row">
                  <div className="form-group">
                    <label>Project Title</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Portfolio Website" 
                      value={project.title || ''}
                      onChange={(e) => updateProject(index, 'title', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Web Development" 
                      value={project.category || ''}
                      onChange={(e) => updateProject(index, 'category', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Description</label>
                  <textarea 
                    className="form-control" 
                    rows="4" 
                    placeholder="Describe your project here"
                    value={project.description || ''}
                    onChange={(e) => updateProject(index, 'description', e.target.value)}
                  ></textarea>
                </div>
                
                <div className="form-group">
                  <label>Project Image</label>
                  <div className="image-preview-container">
                    {project.imageUrl ? (
                      <img src={project.imageUrl} alt={project.title} className="preview-image" />
                    ) : (
                      <div className="no-image-placeholder">
                        <i className="fas fa-laptop-code"></i>
                      </div>
                    )}
                    <div className="image-actions">
                      <button
                        className="upload-btn"
                        onClick={() => uploadImage(index)}
                      >
                        <i className="fas fa-upload"></i> Upload Image
                      </button>
                      
                      {project.imageUrl && (
                        <button
                          className="remove-btn"
                          onClick={() => updateProject(index, 'imageUrl', '')}
                        >
                          <i className="fas fa-trash"></i> Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Demo URL</label>
                    <input 
                      type="text"
                      className="form-control"
                      placeholder="https://demo-url.com"
                      value={project.demoUrl || ''}
                      onChange={(e) => updateProject(index, 'demoUrl', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Repository URL</label>
                    <input 
                      type="text"
                      className="form-control"
                      placeholder="https://github.com/username/repo"
                      value={project.repoUrl || ''}
                      onChange={(e) => updateProject(index, 'repoUrl', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Completion Date</label>
                    <input 
                      type="text"
                      className="form-control"
                      placeholder="YYYY-MM-DD"
                      value={project.completionDate || ''}
                      onChange={(e) => updateProject(index, 'completionDate', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Technologies Used</label>
                    <input 
                      type="text"
                      className="form-control"
                      placeholder="React, Node.js, MongoDB"
                      value={project.technologies || ''}
                      onChange={(e) => updateProject(index, 'technologies', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <i className="fas fa-project-diagram"></i>
            <p>No projects yet. Showcase your work by adding projects.</p>
          </div>
        )}
      </div>
      
      <div className="section-footer">
        <button 
          className="btn-add-education" 
          onClick={addNewProject}
        >
          <i className="fas fa-plus"></i> Add New Project
        </button>
      </div>
      
      {showDeleteConfirm && (
        <div className="delete-confirm-modal">
          <div className="delete-confirm-content">
            <h4>Delete Project</h4>
            <p>Are you sure you want to delete this project? This action cannot be undone.</p>
            <div className="delete-confirm-actions">
              <button className="btn-danger" onClick={deleteProject}>
                Delete
              </button>
              <button className="btn-secondary" onClick={cancelDeleteProject}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectEditors;

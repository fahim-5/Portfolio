import React, { useState } from 'react';
import './adminDashboard.css';

const ExperienceEditor = ({ 
  experienceEntries, 
  addExperienceEntry, 
  updateExperienceEntry, 
  deleteExperienceEntry, 
  saveExperienceChanges,
  changeSection
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const confirmDelete = (index) => {
    setDeleteIndex(index);
    setShowDeleteConfirm(true);
  };

  const handleDelete = () => {
    deleteExperienceEntry(deleteIndex);
    setShowDeleteConfirm(false);
    setDeleteIndex(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteIndex(null);
  };
  
  return (
    <div className="content-section">
      <div className="editor-header">
        <h2>Edit Experience</h2>
        <div className="editor-actions">
          <button 
            className="btn-primary"
            onClick={saveExperienceChanges}
          >
            Save Changes
          </button>
          <button 
            className="btn-secondary" 
            onClick={() => changeSection('dashboard')}
          >
            Cancel
          </button>
        </div>
      </div>
      
      <h3 className="section-subheader">Work Experience</h3>
      
      <div className="experience-entries">
        {experienceEntries && experienceEntries.length > 0 ? (
          experienceEntries.map((exp, index) => (
            <div key={index} className="experience-card">
              <div className="experience-card-header">
                <h4 className="experience-title">
                  Experience Entry #{index + 1}
                </h4>
                <div className="card-actions">
                  <button 
                    className="btn-icon btn-delete"
                    onClick={() => confirmDelete(index)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              
              <div className="experience-card-content">
                <div className="form-row">
                  <div className="form-group">
                    <label>Job Title</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="General Member" 
                      value={exp.position || ''}
                      onChange={(e) => updateExperienceEntry(index, 'position', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Company</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="UIU Computer Club" 
                      value={exp.company || ''}
                      onChange={(e) => updateExperienceEntry(index, 'company', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Location</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="UIU Permanent Campus" 
                      value={exp.location || ''}
                      onChange={(e) => updateExperienceEntry(index, 'location', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Period</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="2022 - Present" 
                      value={exp.period || ''}
                      onChange={(e) => updateExperienceEntry(index, 'period', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Description</label>
                  <textarea 
                    className="form-control" 
                    rows="5" 
                    placeholder="During my time with the UIU Computer Club, I actively contributed to various tech-related initiatives..."
                    value={exp.description || ''}
                    onChange={(e) => updateExperienceEntry(index, 'description', e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <i className="fas fa-briefcase"></i>
            <p>No experience entries yet. Add your work experience.</p>
          </div>
        )}
      </div>
      
      <div className="section-footer">
        <button 
          className="btn-add-experience" 
          onClick={addExperienceEntry}
        >
          <i className="fas fa-plus"></i> Add New Experience
        </button>
      </div>
      
      {showDeleteConfirm && (
        <div className="delete-confirm-modal">
          <div className="delete-confirm-content">
            <h4>Delete Experience Entry</h4>
            <p>Are you sure you want to delete this experience entry? This action cannot be undone.</p>
            <div className="delete-confirm-actions">
              <button className="btn-danger" onClick={handleDelete}>
                Delete
              </button>
              <button className="btn-secondary" onClick={cancelDelete}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperienceEditor; 
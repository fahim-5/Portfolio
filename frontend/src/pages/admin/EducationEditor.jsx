import React from 'react';
import './adminDashboard.css';

const EducationEditor = ({
  educationEntries,
  addEducationEntry,
  updateEducationEntry,
  confirmDeleteEducation,
  deleteEducationEntry,
  cancelDeleteEducation,
  saveEducationChanges,
  showDeleteEducationConfirm,
  deleteEducationIndex,
  changeSection
}) => {
  return (
    <div className="content-section">
      <div className="editor-header">
        <h2>Edit Education</h2>
        <div className="editor-actions">
          <button 
            className="btn-primary"
            onClick={saveEducationChanges}
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
      
      <h3 className="section-subheader">Education Entries</h3>
      
      <div className="education-entries">
        {educationEntries.length > 0 ? (
          educationEntries.map((education, index) => (
            <div key={index} className="education-card">
              <div className="education-card-header">
                <h4 className="education-title">
                  {education.degree || 'Bachelor of Computer Science'} 
                  {education.institution && <span className="education-institution"> at {education.institution}</span>}
                </h4>
                <div className="card-actions">
                  <button className="btn-icon btn-move-up">
                    <i className="fas fa-arrow-up"></i>
                  </button>
                  <button className="btn-icon btn-move-down">
                    <i className="fas fa-arrow-down"></i>
                  </button>
                  <button 
                    className="btn-icon btn-delete"
                    onClick={() => confirmDeleteEducation(index)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              
              <div className="education-card-content">
                <div className="form-row">
                  <div className="form-group">
                    <label>Degree/Certificate</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Bachelor of Computer Science" 
                      value={education.degree || ''}
                      onChange={(e) => updateEducationEntry(index, 'degree', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Field of Study</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Software Engineering" 
                      value={education.field || ''}
                      onChange={(e) => updateEducationEntry(index, 'field', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Institution</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="United International University" 
                      value={education.institution || ''}
                      onChange={(e) => updateEducationEntry(index, 'institution', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Dhaka, Bangladesh" 
                      value={education.location || ''}
                      onChange={(e) => updateEducationEntry(index, 'location', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Start Date</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="2022-06" 
                      value={education.startDate || ''}
                      onChange={(e) => updateEducationEntry(index, 'startDate', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>End Date</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="2026-06" 
                      value={education.endDate || ''}
                      onChange={(e) => updateEducationEntry(index, 'endDate', e.target.value)}
                      disabled={education.current}
                    />
                    <div className="form-check">
                      <input 
                        type="checkbox" 
                        id={`eduCurrent${index}`}
                        className="form-check-input" 
                        checked={education.current || false}
                        onChange={(e) => updateEducationEntry(index, 'current', e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor={`eduCurrent${index}`}>
                        Currently studying here
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Description</label>
                  <textarea 
                    className="form-control" 
                    rows="5" 
                    placeholder="Enter your description. It's hard to put into words how much I miss the simplicity of school..."
                    value={education.description || ''}
                    onChange={(e) => updateEducationEntry(index, 'description', e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <i className="fas fa-graduation-cap"></i>
            <p>No education entries yet. Add your educational background.</p>
          </div>
        )}
      </div>
      
      <div className="section-footer">
        <button 
          className="btn-add-education" 
          onClick={addEducationEntry}
        >
          <i className="fas fa-plus"></i> Add New Education
        </button>
      </div>
      
      {showDeleteEducationConfirm && (
        <div className="delete-confirm-modal">
          <div className="delete-confirm-content">
            <h4>Delete Education Entry</h4>
            <p>Are you sure you want to delete this education entry? This action cannot be undone.</p>
            <div className="delete-confirm-actions">
              <button className="btn-danger" onClick={deleteEducationEntry}>
                Delete
              </button>
              <button className="btn-secondary" onClick={cancelDeleteEducation}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationEditor; 
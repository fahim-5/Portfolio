import React, { useState, useEffect } from 'react';
import './adminDashboard.css';

const HighlightsEditors = ({ highlights = [], onSave }) => {
  const [highlightList, setHighlightList] = useState(highlights);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  
  useEffect(() => {
    setHighlightList(highlights);
  }, [highlights]);

  const addNewHighlight = () => {
    const newHighlight = {
      id: Date.now(),
      title: "New Highlight",
      date: "",
      category: "award",
      description: ""
    };
    
    const updatedHighlights = [...highlightList, newHighlight];
    setHighlightList(updatedHighlights);
    
    // Save without showing notification
    if (onSave) {
      onSave(updatedHighlights);
    }
  };
  
  const updateHighlight = (index, field, value) => {
    const updatedHighlights = [...highlightList];
    updatedHighlights[index] = {
      ...updatedHighlights[index],
      [field]: value
    };
    
    setHighlightList(updatedHighlights);
    
    // Auto-save changes
    if (onSave) {
      onSave(updatedHighlights);
      showSaveMessage && clearTimeout(showSaveMessage);
      const timer = setTimeout(() => setShowSaveMessage(false), 2000);
      setShowSaveMessage(timer);
    }
  };
  
  const confirmDeleteHighlight = (index) => {
    setDeleteIndex(index);
    setShowDeleteConfirm(true);
  };
  
  const deleteHighlight = () => {
    if (deleteIndex === null) return;
    
    const updatedHighlights = highlightList.filter((_, index) => index !== deleteIndex);
    setHighlightList(updatedHighlights);
    
    // Save the updated highlight list
    if (onSave) {
      onSave(updatedHighlights);
    }
    
    // Close the confirm dialog
    setShowDeleteConfirm(false);
    setDeleteIndex(null);
  };
  
  const cancelDeleteHighlight = () => {
    setShowDeleteConfirm(false);
    setDeleteIndex(null);
  };
  
  const handleSaveChanges = () => {
    if (onSave) {
      onSave(highlightList);
      // Show alert for user feedback when Save Changes button is clicked
      alert('Highlights saved successfully!');
    }
  };

  return (
    <div className="content-section">
      <div className="editor-header">
        <h2>Edit Highlights</h2>
        <div className="editor-actions">
          <button className="btn-primary" onClick={handleSaveChanges}>
            Save Changes
          </button>
          <button className="btn-secondary">
            Cancel
          </button>
        </div>
      </div>
      
      <h3 className="section-subheader">Career Highlights</h3>
      
      <div className="education-entries">
        {highlightList.length > 0 ? (
          highlightList.map((highlight, index) => (
            <div key={index} className="education-card">
              <div className="education-card-header">
                <h4 className="education-title">
                  {highlight.title || 'New Highlight'} 
                  {highlight.date && (
                    <span className="education-institution">
                      {' - '}{highlight.date}
                    </span>
                  )}
                </h4>
                <div className="card-actions">
                  <button 
                    className="btn-icon btn-delete"
                    onClick={() => confirmDeleteHighlight(index)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              
              <div className="education-card-content">
                <div className="form-group">
                  <label>Title</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Award Title" 
                    value={highlight.title || ''}
                    onChange={(e) => updateHighlight(index, 'title', e.target.value)}
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Date</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="YYYY-MM" 
                      value={highlight.date || ''}
                      onChange={(e) => updateHighlight(index, 'date', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      className="form-control"
                      value={highlight.category || 'award'}
                      onChange={(e) => updateHighlight(index, 'category', e.target.value)}
                    >
                      <option value="award">Award</option>
                      <option value="certification">Certification</option>
                      <option value="achievement">Achievement</option>
                      <option value="publication">Publication</option>
                      <option value="speaking">Speaking</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Description</label>
                  <textarea 
                    className="form-control" 
                    rows="4" 
                    placeholder="Describe your highlight"
                    value={highlight.description || ''}
                    onChange={(e) => updateHighlight(index, 'description', e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <i className="fas fa-award"></i>
            <p>No highlights yet. Add your career achievements and milestones.</p>
          </div>
        )}
      </div>
      
      <div className="section-footer">
        <button 
          className="btn-add-education" 
          onClick={addNewHighlight}
        >
          <i className="fas fa-plus"></i> Add New Highlight
        </button>
      </div>
      
      {showDeleteConfirm && (
        <div className="delete-confirm-modal">
          <div className="delete-confirm-content">
            <h4>Delete Highlight</h4>
            <p>Are you sure you want to delete this highlight? This action cannot be undone.</p>
            <div className="delete-confirm-actions">
              <button className="btn-danger" onClick={deleteHighlight}>
                Delete
              </button>
              <button className="btn-secondary" onClick={cancelDeleteHighlight}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HighlightsEditors;

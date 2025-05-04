import React, { useState, useEffect } from 'react';
import './adminDashboard.css';

const ReferenceEditor = ({ references = [], onSave }) => {
  const [referenceList, setReferenceList] = useState(references);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  
  useEffect(() => {
    setReferenceList(references);
  }, [references]);
  
  const addNewReference = () => {
    const newReference = {
      id: Date.now(),
      name: "New Reference",
      position: "",
      company: "",
      image: "",
      quote: ""
    };
    
    const updatedReferences = [...referenceList, newReference];
    setReferenceList(updatedReferences);
    
    // Save without showing notification
    if (onSave) {
      onSave(updatedReferences);
    }
  };
  
  const updateReference = (index, field, value) => {
    const updatedReferences = [...referenceList];
    updatedReferences[index] = {
      ...updatedReferences[index],
      [field]: value
    };
    
    setReferenceList(updatedReferences);
    
    // Auto-save changes
    if (onSave) {
      onSave(updatedReferences);
      showSaveMessage && clearTimeout(showSaveMessage);
      const timer = setTimeout(() => setShowSaveMessage(false), 2000);
      setShowSaveMessage(timer);
    }
  };
  
  const confirmDeleteReference = (index) => {
    setDeleteIndex(index);
    setShowDeleteConfirm(true);
  };
  
  const deleteReference = () => {
    if (deleteIndex === null) return;
    
    const updatedReferences = referenceList.filter((_, index) => index !== deleteIndex);
    setReferenceList(updatedReferences);
    
    // Save the updated reference list
    if (onSave) {
      onSave(updatedReferences);
    }
    
    // Close the confirm dialog
    setShowDeleteConfirm(false);
    setDeleteIndex(null);
  };
  
  const cancelDeleteReference = () => {
    setShowDeleteConfirm(false);
    setDeleteIndex(null);
  };
  
  const handleSaveChanges = () => {
    if (onSave) {
      onSave(referenceList);
      // Show alert for user feedback when Save Changes button is clicked
      alert('References saved successfully!');
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
        updateReference(index, 'image', imageUrl);
      }
    };
    
    fileInput.click();
  };

  return (
    <div className="content-section">
      <div className="editor-header">
        <h2>Edit References</h2>
        <div className="editor-actions">
          <button className="btn-primary" onClick={handleSaveChanges}>
            Save Changes
          </button>
          <button className="btn-secondary">
            Cancel
          </button>
        </div>
      </div>
      
      <h3 className="section-subheader">Professional References</h3>
      
      <div className="education-entries">
        {referenceList.length > 0 ? (
          referenceList.map((reference, index) => (
            <div key={index} className="education-card">
              <div className="education-card-header">
                <h4 className="education-title">
                  {reference.name || 'New Reference'} 
                  {reference.position && reference.company && (
                    <span className="education-institution">
                      {' - '}{reference.position} at {reference.company}
                    </span>
                  )}
                </h4>
                <div className="card-actions">
                  <button 
                    className="btn-icon btn-delete"
                    onClick={() => confirmDeleteReference(index)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              
              <div className="education-card-content">
                <div className="form-row">
                  <div className="form-group">
                    <label>Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Sarah Johnson" 
                      value={reference.name || ''}
                      onChange={(e) => updateReference(index, 'name', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Position</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="CTO" 
                      value={reference.position || ''}
                      onChange={(e) => updateReference(index, 'position', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Company</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Tech Innovations Inc." 
                      value={reference.company || ''}
                      onChange={(e) => updateReference(index, 'company', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Image</label>
                  <div className="image-preview-container">
                    {reference.image ? (
                      <img src={reference.image} alt={reference.name} className="preview-image" />
                    ) : (
                      <div className="no-image-placeholder">
                        <i className="fas fa-user"></i>
                      </div>
                    )}
                    <div className="image-actions">
                      <button
                        className="upload-btn"
                        onClick={() => uploadImage(index)}
                      >
                        <i className="fas fa-upload"></i> Upload Image
                      </button>
                      
                      {reference.image && (
                        <button
                          className="remove-btn"
                          onClick={() => updateReference(index, 'image', '')}
                        >
                          <i className="fas fa-trash"></i> Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Quote</label>
                  <textarea 
                    className="form-control" 
                    rows="5" 
                    placeholder="Enter a quote or recommendation from this reference"
                    value={reference.quote || ''}
                    onChange={(e) => updateReference(index, 'quote', e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <i className="fas fa-user-friends"></i>
            <p>No references yet. Add professional references to increase your credibility.</p>
          </div>
        )}
      </div>
      
      <div className="section-footer">
        <button 
          className="btn-add-education" 
          onClick={addNewReference}
        >
          <i className="fas fa-plus"></i> Add New Reference
        </button>
      </div>
      
      {showDeleteConfirm && (
        <div className="delete-confirm-modal">
          <div className="delete-confirm-content">
            <h4>Delete Reference</h4>
            <p>Are you sure you want to delete this reference? This action cannot be undone.</p>
            <div className="delete-confirm-actions">
              <button className="btn-danger" onClick={deleteReference}>
                Delete
              </button>
              <button className="btn-secondary" onClick={cancelDeleteReference}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferenceEditor;

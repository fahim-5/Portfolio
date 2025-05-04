import React, { useState, useEffect } from 'react';
import './adminDashboard.css';

const PictureEditors = ({ pictures = [], onSave }) => {
  const [pictureList, setPictureList] = useState(pictures);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  
  useEffect(() => {
    setPictureList(pictures);
  }, [pictures]);

  const addNewPicture = () => {
    const newPicture = {
      id: Date.now(),
      title: "New Image",
      description: "",
      url: "",
      category: "general",
      fullSizeLink: ""
    };
    
    const updatedPictures = [...pictureList, newPicture];
    setPictureList(updatedPictures);
    
    // Save without showing notification
    if (onSave) {
      onSave(updatedPictures);
    }
  };
  
  const updatePicture = (index, field, value) => {
    const updatedPictures = [...pictureList];
    updatedPictures[index] = {
      ...updatedPictures[index],
      [field]: value
    };
    
    setPictureList(updatedPictures);
    
    // Auto-save changes
    if (onSave) {
      onSave(updatedPictures);
      showSaveMessage && clearTimeout(showSaveMessage);
      const timer = setTimeout(() => setShowSaveMessage(false), 2000);
      setShowSaveMessage(timer);
    }
  };
  
  const confirmDeletePicture = (index) => {
    setDeleteIndex(index);
    setShowDeleteConfirm(true);
  };
  
  const deletePicture = () => {
    if (deleteIndex === null) return;
    
    const updatedPictures = pictureList.filter((_, index) => index !== deleteIndex);
    setPictureList(updatedPictures);
    
    // Save the updated picture list
    if (onSave) {
      onSave(updatedPictures);
    }
    
    // Close the confirm dialog
    setShowDeleteConfirm(false);
    setDeleteIndex(null);
  };
  
  const cancelDeletePicture = () => {
    setShowDeleteConfirm(false);
    setDeleteIndex(null);
  };
  
  const handleSaveChanges = () => {
    if (onSave) {
      onSave(pictureList);
      // Show alert for user feedback when Save Changes button is clicked
      alert('Pictures saved successfully!');
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
        updatePicture(index, 'url', imageUrl);
      }
    };
    
    fileInput.click();
  };

  return (
    <div className="content-section">
      <div className="editor-header">
        <h2>Edit Pictures</h2>
        <div className="editor-actions">
          <button className="btn-primary" onClick={handleSaveChanges}>
            Save Changes
          </button>
          <button className="btn-secondary">
            Cancel
          </button>
        </div>
      </div>
      
      <h3 className="section-subheader">Photography Collection</h3>
      
      <div className="education-entries">
        {pictureList.length > 0 ? (
          pictureList.map((picture, index) => (
            <div key={index} className="education-card">
              <div className="education-card-header">
                <h4 className="education-title">
                  {picture.title || 'New Image'} 
                  {picture.category && (
                    <span className="education-institution">
                      {' - '}{picture.category}
                    </span>
                  )}
                </h4>
                <div className="card-actions">
                  <button 
                    className="btn-icon btn-delete"
                    onClick={() => confirmDeletePicture(index)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              
              <div className="education-card-content">
                <div className="form-row">
                  <div className="form-group">
                    <label>Title</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Image Title" 
                      value={picture.title || ''}
                      onChange={(e) => updatePicture(index, 'title', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Nature, Architecture, etc." 
                      value={picture.category || ''}
                      onChange={(e) => updatePicture(index, 'category', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Description</label>
                  <textarea 
                    className="form-control" 
                    rows="4" 
                    placeholder="Describe your image"
                    value={picture.description || ''}
                    onChange={(e) => updatePicture(index, 'description', e.target.value)}
                  ></textarea>
                </div>
                
                <div className="form-group">
                  <label>Image</label>
                  <div className="image-preview-container">
                    {picture.url ? (
                      <img src={picture.url} alt={picture.title} className="preview-image" />
                    ) : (
                      <div className="no-image-placeholder">
                        <i className="fas fa-image"></i>
                      </div>
                    )}
                    <div className="image-actions">
                      <button
                        className="upload-btn"
                        onClick={() => uploadImage(index)}
                      >
                        <i className="fas fa-upload"></i> Upload Image
                      </button>
                      
                      {picture.url && (
                        <button
                          className="remove-btn"
                          onClick={() => updatePicture(index, 'url', '')}
                        >
                          <i className="fas fa-trash"></i> Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Full Size Link</label>
                  <input 
                    type="text"
                    className="form-control"
                    placeholder="URL to full size image"
                    value={picture.fullSizeLink || ''}
                    onChange={(e) => updatePicture(index, 'fullSizeLink', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <i className="fas fa-camera"></i>
            <p>No pictures yet. Add your photography collection.</p>
          </div>
        )}
      </div>
      
      <div className="section-footer">
        <button 
          className="btn-add-education" 
          onClick={addNewPicture}
        >
          <i className="fas fa-plus"></i> Add New Picture
        </button>
      </div>
      
      {showDeleteConfirm && (
        <div className="delete-confirm-modal">
          <div className="delete-confirm-content">
            <h4>Delete Picture</h4>
            <p>Are you sure you want to delete this picture? This action cannot be undone.</p>
            <div className="delete-confirm-actions">
              <button className="btn-danger" onClick={deletePicture}>
                Delete
              </button>
              <button className="btn-secondary" onClick={cancelDeletePicture}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PictureEditors;

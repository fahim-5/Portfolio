import React, { useState, useEffect } from 'react';
import styles from './AdminPictures.module.css';
import portfolioService from '../../services/portfolioService';

const AdminPictures = () => {
  const [pictures, setPictures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentPicture, setCurrentPicture] = useState({
    id: null,
    title: '',
    category: '',
    description: '',
    link: '',
    image: ''
  });

  // Fetch pictures on component mount
  useEffect(() => {
    fetchPictures();
  }, []);

  // Fetch pictures directly from the database
  const fetchPictures = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('AdminPictures: Fetching pictures from database...');
      
      const data = await portfolioService.fetchPicturesData();
      console.log('AdminPictures: Pictures data received:', data);
      
      setPictures(data);
      setLoading(false);
    } catch (err) {
      console.error('AdminPictures: Error fetching pictures:', err);
      setError('Failed to load pictures. Please try again later.');
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentPicture(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission for create/update
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Add validation to ensure image URL is provided
    if (!currentPicture.image.trim()) {
      alert('Image URL is required');
      return;
    }
    
    // Add validation to ensure title is provided
    if (!currentPicture.title.trim()) {
      alert('Title is required');
      return;
    }
    
    try {
      setLoading(true);
      console.log(`${editMode ? 'Updating' : 'Creating'} picture:`, currentPicture);
      
      if (editMode) {
        // Update existing picture
        const updatedPicture = await portfolioService.updatePicture(currentPicture.id, currentPicture);
        
        // Update the pictures state with the updated picture
        setPictures(prevPictures => 
          prevPictures.map(pic => pic.id === updatedPicture.id ? updatedPicture : pic)
        );
        
        alert('Picture updated successfully!');
      } else {
        // Create new picture
        const newPicture = await portfolioService.createPicture(currentPicture);
        
        // Add the new picture to the pictures state
        setPictures(prevPictures => [...prevPictures, newPicture]);
        
        alert('Picture added successfully!');
      }
      
      // Reset form and exit edit mode
      resetForm();
      setLoading(false);
    } catch (err) {
      console.error('Error saving picture:', err);
      setLoading(false);
      alert(`Failed to save picture: ${err.message}`);
    }
  };

  // Handle picture edit
  const handleEdit = (picture) => {
    console.log('Edit button clicked for picture:', picture);
    
    if (!picture || !picture.id) {
      console.error('Invalid picture object for editing:', picture);
      alert('Error: Cannot edit this picture (invalid data)');
      return;
    }
    
    // Create a copy to avoid direct state modification
    setCurrentPicture({
      id: picture.id,
      title: picture.title || '',
      category: picture.category || '',
      description: picture.description || '',
      link: picture.link || '',
      image: picture.image || ''
    });
    
    setEditMode(true);
    
    // Scroll to the form
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Handle picture delete
  const handleDelete = async (id) => {
    console.log('Delete button clicked for picture id:', id);
    
    if (!id) {
      console.error('Invalid picture ID for deletion:', id);
      alert('Error: Cannot delete this picture (invalid ID)');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this picture?')) {
      try {
        console.log('Confirming deletion of picture with id:', id);
        setLoading(true);
        
        // Call the API to delete the picture
        const result = await portfolioService.deletePicture(id);
        console.log('Delete API response:', result);
        
        // Remove the deleted picture from the state
        setPictures(prevPictures => {
          const filtered = prevPictures.filter(pic => pic.id !== id);
          console.log(`Filtered ${prevPictures.length - filtered.length} pictures`);
          return filtered;
        });
        
        setLoading(false);
        alert('Picture deleted successfully!');
      } catch (err) {
        console.error('Error deleting picture:', err);
        setLoading(false);
        alert(`Failed to delete picture: ${err.message}`);
      }
    }
  };

  // Reset form and exit edit mode
  const resetForm = () => {
    setCurrentPicture({
      id: null,
      title: '',
      category: '',
      description: '',
      link: '',
      image: ''
    });
    setEditMode(false);
  };

  return (
    <div className={styles.adminPictures}>
      <h2>{editMode ? 'Edit Picture' : 'Add New Picture'}</h2>
      
      {/* Picture Form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <input 
          type="text" 
          name="title" 
          value={currentPicture.title} 
          onChange={handleChange} 
          placeholder="Title" 
          required 
        />
        
        <input 
          type="text" 
          name="category" 
          value={currentPicture.category} 
          onChange={handleChange} 
          placeholder="Category" 
        />
        
        <textarea 
          name="description" 
          value={currentPicture.description} 
          onChange={handleChange} 
          placeholder="Description" 
          rows="4"
        />
        
        <input 
          type="text" 
          name="link" 
          value={currentPicture.link} 
          onChange={handleChange} 
          placeholder="External Link (optional)" 
        />
        
        <input 
          type="text" 
          name="image" 
          value={currentPicture.image} 
          onChange={handleChange} 
          placeholder="Image URL" 
          required 
        />
        
        <div className={styles.formButtons}>
          <button type="submit">{editMode ? 'Update' : 'Save'}</button>
          {editMode && (
            <button type="button" onClick={resetForm} className={styles.cancelButton}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Pictures List */}
      <div className={styles.picturesList}>
        <h3>My Pictures</h3>
        
        {loading ? (
          <p>Loading pictures...</p>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : pictures.length === 0 ? (
          <p>No pictures found. Add your first one!</p>
        ) : (
          <div className={styles.picturesGrid}>
            {pictures.map((picture) => (
              <div key={picture.id} className={styles.pictureCard}>
                <div className={styles.pictureImage}>
                  <img src={picture.image} alt={picture.title} />
                </div>
                <div className={styles.pictureInfo}>
                  <h4>{picture.title}</h4>
                  <p className={styles.category}>{picture.category}</p>
                  <div className={styles.pictureActions}>
                    <button 
                      type="button"
                      onClick={() => {
                        console.log('Edit button clicked in UI for:', picture.id);
                        handleEdit(picture);
                      }}
                      className={styles.editButton}
                    >
                      Edit
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        console.log('Delete button clicked in UI for:', picture.id);
                        handleDelete(picture.id);
                      }}
                      className={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}></div>
        </div>
      )}
    </div>
  );
};

export default AdminPictures;

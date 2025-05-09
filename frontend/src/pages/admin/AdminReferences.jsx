import React, { useState, useEffect } from 'react';
import styles from './AdminReferences.module.css';
import portfolioService from '../../services/portfolioService';

const AdminReferences = () => {
  const [references, setReferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentReference, setCurrentReference] = useState({
    id: null,
    name: '',
    position: '',
    company: '',
    quote: '',
    image: ''
  });

  // Fetch references on component mount
  useEffect(() => {
    fetchReferences();
  }, []);

  // Fetch references directly from the database
  const fetchReferences = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('AdminReferences: Fetching references from database...');
      
      const data = await portfolioService.fetchReferencesData();
      console.log('AdminReferences: References data received:', data);
      
      setReferences(data);
      setLoading(false);
    } catch (err) {
      console.error('AdminReferences: Error fetching references:', err);
      setError('Failed to load references. Please try again later.');
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentReference(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission for create/update
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Add validation to ensure name and quote are provided
    if (!currentReference.name.trim()) {
      alert('Name is required');
      return;
    }
    
    if (!currentReference.quote.trim()) {
      alert('Quote is required');
      return;
    }
    
    try {
      setLoading(true);
      console.log(`${editMode ? 'Updating' : 'Creating'} reference:`, currentReference);
      
      if (editMode) {
        // Update existing reference
        const updatedReference = await portfolioService.updateReference(currentReference.id, currentReference);
        
        // Update the references state with the updated reference
        setReferences(prevReferences => 
          prevReferences.map(ref => ref.id === updatedReference.id ? updatedReference : ref)
        );
        
        alert('Reference updated successfully!');
      } else {
        // Create new reference
        const newReference = await portfolioService.createReference(currentReference);
        
        // Add the new reference to the references state
        setReferences(prevReferences => [...prevReferences, newReference]);
        
        alert('Reference added successfully!');
      }
      
      // Reset form and exit edit mode
      resetForm();
      setLoading(false);
    } catch (err) {
      console.error('Error saving reference:', err);
      setLoading(false);
      alert(`Failed to save reference: ${err.message}`);
    }
  };

  // Handle reference edit
  const handleEdit = (reference) => {
    console.log('Edit button clicked for reference:', reference);
    
    if (!reference || !reference.id) {
      console.error('Invalid reference object for editing:', reference);
      alert('Error: Cannot edit this reference (invalid data)');
      return;
    }
    
    // Create a copy to avoid direct state modification
    setCurrentReference({
      id: reference.id,
      name: reference.name || '',
      position: reference.position || '',
      company: reference.company || '',
      quote: reference.quote || '',
      image: reference.image || ''
    });
    
    setEditMode(true);
    
    // Scroll to the form
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Handle reference delete
  const handleDelete = async (id) => {
    console.log('Delete button clicked for reference id:', id);
    
    if (!id) {
      console.error('Invalid reference ID for deletion:', id);
      alert('Error: Cannot delete this reference (invalid ID)');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this reference?')) {
      try {
        console.log('Confirming deletion of reference with id:', id);
        setLoading(true);
        
        // Call the API to delete the reference
        const result = await portfolioService.deleteReference(id);
        console.log('Delete API response:', result);
        
        // Remove the deleted reference from the state
        setReferences(prevReferences => {
          const filtered = prevReferences.filter(ref => ref.id !== id);
          console.log(`Filtered ${prevReferences.length - filtered.length} references`);
          return filtered;
        });
        
        setLoading(false);
        alert('Reference deleted successfully!');
      } catch (err) {
        console.error('Error deleting reference:', err);
        setLoading(false);
        alert(`Failed to delete reference: ${err.message}`);
      }
    }
  };

  // Reset form and exit edit mode
  const resetForm = () => {
    setCurrentReference({
      id: null,
      name: '',
      position: '',
      company: '',
      quote: '',
      image: ''
    });
    setEditMode(false);
  };

  return (
    <div className={styles.adminReferences}>
      <h2>{editMode ? 'Edit Reference' : 'Add New Reference'}</h2>
      
      {/* Reference Form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <input 
          type="text" 
          name="name" 
          value={currentReference.name} 
          onChange={handleChange} 
          placeholder="Name" 
          required 
        />
        
        <input 
          type="text" 
          name="position" 
          value={currentReference.position} 
          onChange={handleChange} 
          placeholder="Position" 
        />
        
        <input 
          type="text" 
          name="company" 
          value={currentReference.company} 
          onChange={handleChange} 
          placeholder="Company" 
        />
        
        <textarea 
          name="quote" 
          value={currentReference.quote} 
          onChange={handleChange} 
          placeholder="Quote" 
          rows="4"
          required
        />
        
        <input 
          type="text" 
          name="image" 
          value={currentReference.image} 
          onChange={handleChange} 
          placeholder="Image URL (optional)" 
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

      {/* References List */}
      <div className={styles.referencesList}>
        <h3>My References</h3>
        
        {loading ? (
          <p>Loading references...</p>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : references.length === 0 ? (
          <p>No references found. Add your first one!</p>
        ) : (
          <div className={styles.referencesGrid}>
            {references.map((reference) => (
              <div key={reference.id} className={styles.referenceCard}>
                <div className={styles.referenceInfo}>
                  <div className={styles.referenceHeader}>
                    {reference.image && (
                      <div className={styles.referenceImage}>
                        <img src={reference.image} alt={reference.name} />
                      </div>
                    )}
                    <div>
                      <h4>{reference.name}</h4>
                      {reference.position && <p className={styles.position}>{reference.position}</p>}
                      {reference.company && <p className={styles.company}>{reference.company}</p>}
                    </div>
                  </div>
                  <div className={styles.quoteContainer}>
                    <p className={styles.quote}>"{reference.quote}"</p>
                  </div>
                  <div className={styles.referenceActions}>
                    <button 
                      type="button"
                      onClick={() => {
                        console.log('Edit button clicked in UI for:', reference.id);
                        handleEdit(reference);
                      }}
                      className={styles.editButton}
                    >
                      Edit
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        console.log('Delete button clicked in UI for:', reference.id);
                        handleDelete(reference.id);
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

export default AdminReferences;

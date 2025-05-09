import React, { useState, useEffect } from 'react';
import styles from './AdminExperience.module.css';
import portfolioService from '../../services/portfolioService';

const AdminExperience = () => {
  const [experienceData, setExperienceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    position: '',
    company: '',
    location: '',
    period: '',
    description: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Fetch experience data
  const fetchExperienceData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching experience data in AdminExperience component...');
      
      // Ensure portfolioService is initialized
      console.log('portfolioService available:', !!portfolioService);
      console.log('fetchExperienceData method available:', !!portfolioService.fetchExperienceData);
      
      const data = await portfolioService.fetchExperienceData();
      console.log('Experience data received in component:', data);
      
      if (data === null) {
        console.warn('Received null data from portfolioService');
        setExperienceData([]);
        setError('Failed to fetch experience data from the server');
      } else {
        setExperienceData(data || []);
        console.log('Experience data state updated with', data ? data.length : 0, 'items');
      }
    } catch (error) {
      console.error('Error fetching experience data in component:', error);
      setError('An error occurred while fetching experience data: ' + error.message);
      setExperienceData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperienceData();
    
    // Add event listener for data changes
    const handleDataChange = () => {
      console.log('Local data changed event detected, refreshing experience data');
      fetchExperienceData();
    };
    
    window.addEventListener('localDataChanged', handleDataChange);
    
    // Cleanup event listener
    return () => {
      window.removeEventListener('localDataChanged', handleDataChange);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      position: '',
      company: '',
      location: '',
      period: '',
      description: ''
    });
    setEditMode(false);
    setCurrentId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await portfolioService.updateExperience(currentId, formData);
        alert('Experience entry updated successfully!');
      } else {
        await portfolioService.createExperience(formData);
        alert('Experience entry added successfully!');
      }
      resetForm();
      fetchExperienceData();
    } catch (error) {
      console.error('Error saving experience:', error);
      alert('Failed to save experience entry.');
    }
  };

  const handleEdit = (experience) => {
    setFormData({
      position: experience.position,
      company: experience.company,
      location: experience.location || '',
      period: experience.period || '',
      description: experience.description || ''
    });
    setEditMode(true);
    setCurrentId(experience.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this experience entry?')) {
      try {
        await portfolioService.deleteExperience(id);
        alert('Experience entry deleted successfully!');
        fetchExperienceData();
      } catch (error) {
        console.error('Error deleting experience:', error);
        alert('Failed to delete experience entry.');
      }
    }
  };

  // Create a dummy experience item for testing
  const createDummyExperience = async () => {
    try {
      const dummyData = {
        position: 'Test Position',
        company: 'Test Company',
        location: 'Test Location',
        period: 'Jan 2023 - Present',
        description: 'This is a test experience entry to verify the API is working.'
      };
      
      console.log('Creating dummy experience with data:', dummyData);
      await portfolioService.createExperience(dummyData);
      alert('Dummy experience created successfully!');
      fetchExperienceData();
    } catch (error) {
      console.error('Error creating dummy experience:', error);
      alert('Failed to create dummy experience: ' + error.message);
    }
  };

  return (
    <div className={styles.adminExperience}>
      <h2>{editMode ? 'Edit' : 'Add'} Experience Entry</h2>
      
      {error && (
        <div className={styles.errorMessage}>
          <p>Error: {error}</p>
          <p>
            This might be because the experience table doesn't exist in your database.
            Try creating it by adding your first experience entry.
          </p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <input 
          type="text" 
          name="position" 
          value={formData.position} 
          onChange={handleChange} 
          placeholder="Position" 
          required 
        />
        <input 
          type="text" 
          name="company" 
          value={formData.company} 
          onChange={handleChange} 
          placeholder="Company" 
          required 
        />
        <input 
          type="text" 
          name="location" 
          value={formData.location} 
          onChange={handleChange} 
          placeholder="Location" 
        />
        <input 
          type="text" 
          name="period" 
          value={formData.period} 
          onChange={handleChange} 
          placeholder="e.g. Jan 2023 - Present" 
        />
        <textarea 
          name="description" 
          value={formData.description} 
          onChange={handleChange} 
          placeholder="Description"
          rows="4"
        ></textarea>
        <div className={styles.formButtons}>
          <button type="submit" className={styles.submitButton}>
            {editMode ? 'Update' : 'Submit'}
          </button>
          {editMode && (
            <button 
              type="button" 
              onClick={resetForm} 
              className={styles.cancelButton}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className={styles.debugSection}>
        <button 
          onClick={createDummyExperience} 
          className={styles.debugButton}
        >
          Create Test Experience Entry
        </button>
        <button 
          onClick={fetchExperienceData} 
          className={styles.debugButton}
        >
          Refresh Data
        </button>
      </div>

      <h2>Experience Entries</h2>
      {loading ? (
        <p>Loading experience data...</p>
      ) : experienceData.length > 0 ? (
        <div className={styles.experienceList}>
          {experienceData.map((exp) => (
            <div key={exp.id} className={styles.experienceCard}>
              <h3>{exp.position}</h3>
              <h4>{exp.company}</h4>
              <p className={styles.location}>{exp.location}</p>
              <p className={styles.period}>{exp.period}</p>
              <p className={styles.description}>{exp.description}</p>
              <div className={styles.cardActions}>
                <button 
                  onClick={() => handleEdit(exp)} 
                  className={styles.editButton}
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(exp.id)} 
                  className={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <p>No experience entries found. Add your first one above!</p>
          <p className={styles.debugInfo}>
            Make sure the 'experience' table exists in your database.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminExperience;

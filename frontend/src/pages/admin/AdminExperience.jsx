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

  const fetchExperienceData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await portfolioService.fetchExperienceData();
      if (data === null) {
        setExperienceData([]);
        setError('Failed to fetch experience data from the server');
      } else {
        setExperienceData(data || []);
      }
    } catch (error) {
      setError('An error occurred while fetching experience data: ' + error.message);
      setExperienceData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperienceData();
    const handleDataChange = () => fetchExperienceData();
    window.addEventListener('localDataChanged', handleDataChange);
    return () => window.removeEventListener('localDataChanged', handleDataChange);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  const createDummyExperience = async () => {
    try {
      const dummyData = {
        position: 'Test Position',
        company: 'Test Company',
        location: 'Test Location',
        period: 'Jan 2023 - Present',
        description: 'This is a test experience entry to verify the API is working.'
      };
      await portfolioService.createExperience(dummyData);
      alert('Dummy experience created successfully!');
      fetchExperienceData();
    } catch (error) {
      console.error('Error creating dummy experience:', error);
      alert('Failed to create dummy experience: ' + error.message);
    }
  };

  return (
    <div className={styles.adminContainer}>
      <div className={styles.formSection}>
        <h2 className={styles.sectionTitle}>{editMode ? 'Edit' : 'Add'} Experience</h2>
        
        {error && (
          <div className={styles.errorMessage}>
            <p>Error: {error}</p>
            <p>This might be because the experience table doesn't exist in your database.</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <input 
              type="text" 
              name="position" 
              value={formData.position} 
              onChange={handleChange} 
              placeholder="Position" 
              required 
            />
          </div>
          <div className={styles.formGroup}>
            <input 
              type="text" 
              name="company" 
              value={formData.company} 
              onChange={handleChange} 
              placeholder="Company" 
              required 
            />
          </div>
          <div className={styles.formGroup}>
            <input 
              type="text" 
              name="location" 
              value={formData.location} 
              onChange={handleChange} 
              placeholder="Location" 
            />
          </div>
          <div className={styles.formGroup}>
            <input 
              type="text" 
              name="period" 
              value={formData.period} 
              onChange={handleChange} 
              placeholder="e.g. Jan 2023 - Present" 
            />
          </div>
          <div className={styles.formGroup}>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              placeholder="Description"
              rows="4"
            />
          </div>
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.primaryButton}>
              {editMode ? 'Update' : 'Add Experience'}
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
      </div>

      {/* <div className={styles.debugSection}>
        <button onClick={createDummyExperience} className={styles.debugButton}>
          Create Test Entry
        </button>
        <button onClick={fetchExperienceData} className={styles.debugButton}>
          Refresh Data
        </button>
      </div> */}

      <div className={styles.listSection}>
        <h2 className={styles.sectionTitle}>Experience Entries</h2>
        {loading ? (
          <div className={styles.loading}>Loading experience data...</div>
        ) : experienceData.length > 0 ? (
          <div className={styles.experienceList}>
            {experienceData.map((exp) => (
              <div key={exp.id} className={styles.experienceItem}>
                <div className={styles.itemHeader}>
                  <div>
                    <h3 className={styles.itemTitle}>{exp.position}</h3>
                    <h4 className={styles.itemCompany}>{exp.company}</h4>
                  </div>
                  <div className={styles.itemActions}>
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
                {exp.location && <div className={styles.itemLocation}>{exp.location}</div>}
                {exp.period && <div className={styles.itemDuration}>{exp.period}</div>}
                {exp.description && <div className={styles.itemDescription}>{exp.description}</div>}
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>No experience entries found. Add your first one above!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminExperience;
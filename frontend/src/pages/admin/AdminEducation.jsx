import React, { useState, useEffect } from 'react';
import styles from './AdminEducation.module.css';
import portfolioService from '../../services/portfolioService';

const AdminEducation = () => {
  const [educationData, setEducationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    degree: '',
    institution: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Fetch education data
  const fetchEducationData = async () => {
    setLoading(true);
    try {
      console.log('Fetching education data in AdminEducation component...');
      const data = await portfolioService.fetchEducationData();
      console.log('Education data received in component:', data);
      setEducationData(data || []);
    } catch (error) {
      console.error('Error fetching education data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducationData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setFormData({
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    });
    setEditMode(false);
    setCurrentId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await portfolioService.updateEducation(currentId, formData);
        alert('Education entry updated successfully!');
      } else {
        await portfolioService.createEducation(formData);
        alert('Education entry added successfully!');
      }
      resetForm();
      fetchEducationData();
    } catch (error) {
      console.error('Error saving education:', error);
      alert('Failed to save education entry.');
    }
  };

  const handleEdit = (education) => {
    setFormData({
      degree: education.degree,
      institution: education.institution,
      location: education.location || '',
      startDate: education.startDate || '',
      endDate: education.endDate || '',
      current: education.current || false,
      description: education.description || ''
    });
    setEditMode(true);
    setCurrentId(education.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this education entry?')) {
      try {
        await portfolioService.deleteEducation(id);
        alert('Education entry deleted successfully!');
        fetchEducationData();
      } catch (error) {
        console.error('Error deleting education:', error);
        alert('Failed to delete education entry.');
      }
    }
  };

  return (
    <div className={styles.adminEducation}>
      <h2>{editMode ? 'Edit' : 'Add'} Education Entry</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input 
          type="text" 
          name="degree" 
          value={formData.degree} 
          onChange={handleChange} 
          placeholder="Degree" 
          required 
        />
        <input 
          type="text" 
          name="institution" 
          value={formData.institution} 
          onChange={handleChange} 
          placeholder="Institution" 
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
          type="month" 
          name="startDate" 
          value={formData.startDate} 
          onChange={handleChange} 
          placeholder="Start Date" 
        />
        {!formData.current && (
          <input 
            type="month" 
            name="endDate" 
            value={formData.endDate} 
            onChange={handleChange} 
            placeholder="End Date" 
          />
        )}
        <label className={styles.checkboxLabel}>
          <input 
            type="checkbox" 
            name="current" 
            checked={formData.current} 
            onChange={handleChange} 
          />
          <span>Currently Studying</span>
        </label>
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

      <h2>Education Entries</h2>
      {loading ? (
        <p>Loading education data...</p>
      ) : educationData.length > 0 ? (
        <div className={styles.educationList}>
          {educationData.map((edu) => (
            <div key={edu.id} className={styles.educationCard}>
              <h3>{edu.degree}</h3>
              <h4>{edu.institution}</h4>
              <p className={styles.location}>{edu.location}</p>
              <p className={styles.dates}>
                {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
              </p>
              <p className={styles.description}>{edu.description}</p>
              <div className={styles.cardActions}>
                <button 
                  onClick={() => handleEdit(edu)} 
                  className={styles.editButton}
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(edu.id)} 
                  className={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No education entries found. Add your first one above!</p>
      )}
    </div>
  );
};

export default AdminEducation;

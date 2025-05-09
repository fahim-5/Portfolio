import React, { useState } from 'react';
import axios from 'axios';
import styles from './AdminEducation.module.css'; // Create this CSS for styling

const AdminEducation = () => {
  const [formData, setFormData] = useState({
    degree: '',
    institution: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/education', formData); // Update with your actual endpoint
      alert('Education entry added successfully!');
      setFormData({
        degree: '',
        institution: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      });
      window.dispatchEvent(new Event('localDataChanged')); // Notify front-end
    } catch (error) {
      console.error('Error adding education:', error);
      alert('Failed to add education entry.');
    }
  };

  return (
    <div className={styles.adminEducation}>
      <h2>Add Education Entry</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="text" name="degree" value={formData.degree} onChange={handleChange} placeholder="Degree" required />
        <input type="text" name="institution" value={formData.institution} onChange={handleChange} placeholder="Institution" required />
        <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location" />
        <input type="month" name="startDate" value={formData.startDate} onChange={handleChange} placeholder="Start Date" />
        {!formData.current && (
          <input type="month" name="endDate" value={formData.endDate} onChange={handleChange} placeholder="End Date" />
        )}
        <label>
          <input type="checkbox" name="current" checked={formData.current} onChange={handleChange} />
          Currently Studying
        </label>
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description"></textarea>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AdminEducation;

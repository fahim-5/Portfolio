import React, { useState } from 'react';
import axios from 'axios';
import styles from './AdminExperience.module.css'; // Style this as you wish

const AdminExperience = () => {
  const [formData, setFormData] = useState({
    position: '',
    company: '',
    location: '',
    period: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/experience', formData); // Update endpoint as needed
      alert('Experience entry added successfully!');
      setFormData({
        position: '',
        company: '',
        location: '',
        period: '',
        description: ''
      });
      window.dispatchEvent(new Event('localDataChanged')); // Trigger UI sync
    } catch (error) {
      console.error('Error adding experience:', error);
      alert('Failed to add experience entry.');
    }
  };

  return (
    <div className={styles.adminExperience}>
      <h2>Add Work Experience</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="text" name="position" value={formData.position} onChange={handleChange} placeholder="Position" required />
        <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Company" required />
        <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location" />
        <input type="text" name="period" value={formData.period} onChange={handleChange} placeholder="e.g. Jan 2023 - Present" />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description"></textarea>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AdminExperience;

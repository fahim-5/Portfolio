import React, { useState } from 'react';
import axios from 'axios';
import styles from './AdminAbout.module.css'; // Create your own styles here

const AdminAbout = () => {
  const [formData, setFormData] = useState({
    aboutImageUrl: '',
    bio: '',
    linkedin: '',
    github: '',
    twitter: '',
    instagram: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/about', formData); // Adjust your endpoint if needed
      alert('About section updated successfully!');
      window.dispatchEvent(new Event('localDataChanged')); // Sync with UI if needed
    } catch (error) {
      console.error('Error updating about section:', error);
      alert('Failed to update about section.');
    }
  };

  return (
    <div className={styles.adminAbout}>
      <h2>Update About Section</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="text" name="aboutImageUrl" value={formData.aboutImageUrl} onChange={handleChange} placeholder="Profile Image URL" />
        <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Short bio paragraph(s)"></textarea>
        <input type="text" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="LinkedIn URL" />
        <input type="text" name="github" value={formData.github} onChange={handleChange} placeholder="GitHub URL" />
        <input type="text" name="twitter" value={formData.twitter} onChange={handleChange} placeholder="Twitter URL" />
        <input type="text" name="instagram" value={formData.instagram} onChange={handleChange} placeholder="Instagram URL" />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default AdminAbout;

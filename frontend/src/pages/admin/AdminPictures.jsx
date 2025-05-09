import React, { useState } from 'react';
import axios from 'axios';
import styles from './AdminPictures.module.css'; // Create your CSS module as needed

const AdminPictures = () => {
  const [picture, setPicture] = useState({
    title: '',
    category: '',
    description: '',
    link: '',
    image: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPicture(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/pictures', picture); // Update route if needed
      alert('Picture added successfully!');
      setPicture({
        title: '',
        category: '',
        description: '',
        link: '',
        image: ''
      });
      window.dispatchEvent(new Event('localDataChanged')); // Sync with UI if needed
    } catch (err) {
      console.error('Error adding picture:', err);
      alert('Failed to add picture');
    }
  };

  return (
    <div className={styles.adminPictures}>
      <h2>Add New Picture</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="text" name="title" value={picture.title} onChange={handleChange} placeholder="Title" required />
        <input type="text" name="category" value={picture.category} onChange={handleChange} placeholder="Category" />
        <textarea name="description" value={picture.description} onChange={handleChange} placeholder="Description" />
        <input type="text" name="link" value={picture.link} onChange={handleChange} placeholder="External Link (optional)" />
        <input type="text" name="image" value={picture.image} onChange={handleChange} placeholder="Image URL" required />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default AdminPictures;

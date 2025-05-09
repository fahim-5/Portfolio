import React, { useState } from 'react';
import axios from 'axios';
import styles from './AdminReferences.module.css'; // Create this CSS module

const AdminReferences = () => {
  const [reference, setReference] = useState({
    name: '',
    position: '',
    company: '',
    quote: '',
    image: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReference(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/references', reference); // Backend endpoint
      alert('Reference added successfully!');
      setReference({
        name: '',
        position: '',
        company: '',
        quote: '',
        image: ''
      });
      window.dispatchEvent(new Event('localDataChanged'));
    } catch (err) {
      console.error('Error saving reference:', err);
      alert('Failed to add reference.');
    }
  };

  return (
    <div className={styles.adminReferences}>
      <h2>Add New Reference</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="text" name="name" value={reference.name} onChange={handleChange} placeholder="Name" required />
        <input type="text" name="position" value={reference.position} onChange={handleChange} placeholder="Position" required />
        <input type="text" name="company" value={reference.company} onChange={handleChange} placeholder="Company" />
        <textarea name="quote" value={reference.quote} onChange={handleChange} placeholder="Quote" />
        <input type="text" name="image" value={reference.image} onChange={handleChange} placeholder="Image URL" />
        <button type="submit">Save Reference</button>
      </form>
    </div>
  );
};

export default AdminReferences;

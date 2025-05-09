import React, { useState } from 'react';
import axios from 'axios';
import styles from './AdminPortfolio.module.css'; // Create this CSS module

const AdminPortfolio = () => {
  const [project, setProject] = useState({
    title: '',
    category: '',
    description: '',
    image: '',
    technologies: '',
    demoUrl: '',
    repoUrl: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/projects', project); // Adjust the endpoint if needed
      alert('Project added successfully!');
      setProject({
        title: '',
        category: '',
        description: '',
        image: '',
        technologies: '',
        demoUrl: '',
        repoUrl: ''
      });
      window.dispatchEvent(new Event('localDataChanged')); // Sync with the portfolio UI
    } catch (err) {
      console.error('Error saving project:', err);
      alert('Failed to add project.');
    }
  };

  return (
    <div className={styles.adminPortfolio}>
      <h2>Add New Project</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="text" name="title" value={project.title} onChange={handleChange} placeholder="Project Title" required />
        <input type="text" name="category" value={project.category} onChange={handleChange} placeholder="Category" />
        <textarea name="description" value={project.description} onChange={handleChange} placeholder="Description" />
        <input type="text" name="image" value={project.image} onChange={handleChange} placeholder="Image URL" required />
        <input type="text" name="technologies" value={project.technologies} onChange={handleChange} placeholder="Technologies (comma-separated)" />
        <input type="text" name="demoUrl" value={project.demoUrl} onChange={handleChange} placeholder="Live Demo URL (optional)" />
        <input type="text" name="repoUrl" value={project.repoUrl} onChange={handleChange} placeholder="GitHub Repo URL (optional)" />
        <button type="submit">Save Project</button>
      </form>
    </div>
  );
};

export default AdminPortfolio;

// AdminSkillsManager.jsx
import React, { useState, useEffect } from 'react';
import styles from './AdminSkillsManager.module.css';
import portfolioService from '../../services/portfolioService';
import axios from 'axios';

const AdminSkillsManager = () => {
  const [skillsData, setSkillsData] = useState({ technical: [], soft: [], languages: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'technical',
    level: 'intermediate'
  });

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      setIsAuthenticated(!!token);
    };
    
    checkAuth();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use axios directly instead of portfolioService
      const response = await axios.get('http://localhost:5000/api/admin/skills');
      console.log('Fetched skills:', response.data);
      
      if (response.data) {
        setSkillsData(response.data);
      }
    } catch (err) {
      console.error('Error fetching skills:', err);
      setError('Failed to load skills. Please try again.');
      
      // Try localStorage as fallback
      const localData = portfolioService.getSectionData('skills');
      if (localData) {
        setSkillsData(localData);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'technical',
      level: 'intermediate'
    });
    setEditingSkill(null);
    setShowForm(false);
  };

  const getHeaders = () => {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Skill name is required');
      return;
    }
    
    try {
      console.log('Submitting skill data:', formData);
      setError(null);
      
      // Convert category selection to lowercase for backend
      const skillData = {
        ...formData,
        category: formData.category.toLowerCase()
      };
      
      // Use axios directly with headers
      const headers = getHeaders();
      console.log('Using headers:', headers);
      
      let response;
      
      if (editingSkill) {
        // Update existing skill
        console.log('Updating skill with ID:', editingSkill.id);
        response = await axios.put(
          `http://localhost:5000/api/admin/skills/${editingSkill.id}`, 
          skillData,
          { headers }
        );
      } else {
        // Create new skill
        console.log('Creating new skill');
        response = await axios.post(
          'http://localhost:5000/api/admin/skills', 
          skillData,
          { headers }
        );
      }
      
      console.log('API response:', response.data);
      
      if (response.data && response.data.success) {
        await fetchSkills();
        resetForm();
      } else {
        setError(response.data?.message || 'Operation failed. Please try again.');
      }
    } catch (err) {
      console.error('Error saving skill:', err);
      if (err.response) {
        console.error('Server response:', err.response.data);
        
        // Handle authentication errors
        if (err.response.status === 401 || err.response.status === 403) {
          setError('Authentication required. Please log in.');
          setIsAuthenticated(false);
        } else {
          setError(err.response.data?.message || 'Server error. Please try again.');
        }
      } else {
        setError('Failed to connect to server. Please try again.');
      }
    }
  };

  const deleteSkill = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) {
      return;
    }
    
    try {
      console.log(`Deleting skill with ID: ${id}`);
      setError(null);
      
      // Use axios directly with headers
      const headers = getHeaders();
      
      const response = await axios.delete(
        `http://localhost:5000/api/admin/skills/${id}`,
        { headers }
      );
      
      console.log('Delete response:', response.data);
      
      if (response.data && response.data.success) {
        await fetchSkills();
      } else {
        setError(response.data?.message || 'Failed to delete skill. Please try again.');
      }
    } catch (err) {
      console.error('Error deleting skill:', err);
      if (err.response) {
        console.error('Server response:', err.response.data);
        
        // Handle authentication errors
        if (err.response.status === 401 || err.response.status === 403) {
          setError('Authentication required. Please log in.');
          setIsAuthenticated(false);
        } else {
          setError(err.response.data?.message || 'Server error. Please try again.');
        }
      } else {
        setError('Failed to connect to server. Please try again.');
      }
    }
  };

  const editSkill = (skill) => {
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level || 'intermediate'
    });
    setEditingSkill(skill);
    setShowForm(true);
  };

  const renderSkillLevel = (level) => {
    const levels = {
      'beginner': 'Beginner',
      'elementary': 'Elementary',
      'intermediate': 'Intermediate',
      'advanced': 'Advanced',
      'expert': 'Expert',
      'native': 'Native'
    };
    
    return levels[level] || level;
  };

  if (loading) {
    return <div className={styles.loader}>Loading skills...</div>;
  }

  return (
    <div className={styles.adminSkillsManager}>
      <h2>Skills Manager</h2>
      
      {error && <div className={styles.error}>{error}</div>}
      
      <button 
        className={`${styles.addButton} ${showForm ? styles.hideForm : ''}`}
        onClick={() => {
          resetForm();
          setShowForm(true);
        }}
      >
        Add New Skill
      </button>
      
      {showForm && (
        <div className={styles.formContainer}>
          <h3>{editingSkill ? 'Edit Skill' : 'Add New Skill'}</h3>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Skill Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="e.g. React, Communication, English"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="technical">Technical Skill</option>
                <option value="soft">Soft Skill</option>
                <option value="languages">Language</option>
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="level">Proficiency Level</label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleInputChange}
              >
                <option value="beginner">Beginner</option>
                <option value="elementary">Elementary</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
                {formData.category === 'languages' && <option value="native">Native</option>}
              </select>
            </div>
            
            <div className={styles.formActions}>
              <button type="submit" className={styles.submitButton}>
                {editingSkill ? 'Update Skill' : 'Add Skill'}
              </button>
              <button 
                type="button" 
                className={styles.cancelButton}
                onClick={resetForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      {['technical', 'soft', 'languages'].map((category) => (
        <div key={category} className={styles.categorySection}>
          <h3>{category.charAt(0).toUpperCase() + category.slice(1)} Skills</h3>
          {skillsData[category]?.length > 0 ? (
            <ul className={styles.skillList}>
              {skillsData[category].map((skill) => (
                <li key={skill.id} className={styles.skillItem}>
                  <div className={styles.skillInfo}>
                    <strong>{skill.name}</strong>
                    {skill.level && <span className={styles.skillLevel}>{renderSkillLevel(skill.level)}</span>}
                  </div>
                  <div className={styles.skillActions}>
                    <button
                      className={styles.editBtn}
                      onClick={() => editSkill(skill)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => deleteSkill(skill.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.noSkills}>No skills available in this category.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminSkillsManager;

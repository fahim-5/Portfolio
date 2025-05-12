import React, { useState, useEffect } from 'react';
import styles from './AdminSkillsManager.module.css';
import portfolioService from '../../services/portfolioService';
import axios from 'axios';

const AdminSkillsManager = () => {
  const [skillsData, setSkillsData] = useState({ 
    technical: [], 
    soft: [], 
    languages: [] 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'technical',
    level: 'intermediate'
  });

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
      const response = await axios.get('http://localhost:5000/api/admin/skills');
      if (response.data) {
        setSkillsData(response.data);
      }
    } catch (err) {
      console.error('Error fetching skills:', err);
      setError('Failed to load skills. Please try again.');
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
    setFormData(prev => ({ ...prev, [name]: value }));
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
      const skillData = {
        ...formData,
        category: formData.category.toLowerCase()
      };
      
      const headers = getHeaders();
      let response;
      
      if (editingSkill) {
        response = await axios.put(
          `http://localhost:5000/api/admin/skills/${editingSkill.id}`, 
          skillData,
          { headers }
        );
      } else {
        response = await axios.post(
          'http://localhost:5000/api/admin/skills', 
          skillData,
          { headers }
        );
      }
      
      if (response.data && response.data.success) {
        await fetchSkills();
        resetForm();
      } else {
        setError(response.data?.message || 'Operation failed. Please try again.');
      }
    } catch (err) {
      console.error('Error saving skill:', err);
      if (err.response) {
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
    if (!window.confirm('Are you sure you want to delete this skill?')) return;
    
    try {
      const headers = getHeaders();
      const response = await axios.delete(
        `http://localhost:5000/api/admin/skills/${id}`,
        { headers }
      );
      
      if (response.data && response.data.success) {
        await fetchSkills();
      } else {
        setError(response.data?.message || 'Failed to delete skill. Please try again.');
      }
    } catch (err) {
      console.error('Error deleting skill:', err);
      if (err.response) {
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
    return (
      <div className={styles.adminContainer}>
        <div className={styles.loading}>Loading skills...</div>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <div className={styles.header}>
        <h2>Skills Manager</h2>
        <p>Add, edit or remove skills from your portfolio</p>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <p>{error}</p>
        </div>
      )}

      <div className={styles.controls}>
        <button 
          className={`${styles.primaryButton} ${showForm ? styles.hidden : ''}`}
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          Add New Skill
        </button>
      </div>

      {showForm && (
        <div className={styles.formSection}>
          <h3>{editingSkill ? 'Edit Skill' : 'Add New Skill'}</h3>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Skill Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="e.g. React, Communication, English"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Category *</label>
              <select
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
              <label>Proficiency Level</label>
              <select
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
              <button type="submit" className={styles.primaryButton}>
                {editingSkill ? 'Update Skill' : 'Add Skill'}
              </button>
              <button 
                type="button" 
                className={styles.secondaryButton}
                onClick={resetForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.skillsContainer}>
        {['technical', 'soft', 'languages'].map((category) => (
          <div key={category} className={styles.categorySection}>
            <h3>
              {category.charAt(0).toUpperCase() + category.slice(1)} Skills
              <span className={styles.countBadge}>{skillsData[category]?.length || 0}</span>
            </h3>
            
            {skillsData[category]?.length > 0 ? (
              <ul className={styles.skillsList}>
                {skillsData[category].map((skill) => (
                  <li key={skill.id} className={styles.skillItem}>
                    <div className={styles.skillInfo}>
                      <h4>{skill.name}</h4>
                      {skill.level && (
                        <span className={styles.skillLevel}>
                          {renderSkillLevel(skill.level)}
                        </span>
                      )}
                    </div>
                    <div className={styles.skillActions}>
                      <button
                        className={styles.editButton}
                        onClick={() => editSkill(skill)}
                      >
                        Edit
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => deleteSkill(skill.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className={styles.emptyState}>
                No skills available in this category
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSkillsManager;
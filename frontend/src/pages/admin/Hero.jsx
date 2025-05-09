import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Hero.module.css';

const Hero = () => {
  const [heroData, setHeroData] = useState({
    greeting: '',
    name: '',
    last_name: '',
    description: '',
    job_title: '',
    button_text: '',
    profile_image_url: '',
    email: '',
    phone: '',
    location: '',
    linkedin_url: '',
    github_url: '',
    twitter_url: '',
    instagram_url: '',
    stats: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await axios.get('/api/admin/hero');
        setHeroData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching hero data:', error);
        setErrorMessage('Failed to load hero data');
        setIsLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHeroData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatChange = (index, field, value) => {
    const updatedStats = [...heroData.stats];
    updatedStats[index][field] = value;
    setHeroData(prev => ({
      ...prev,
      stats: updatedStats
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await axios.put('/api/admin/hero', heroData);
      setSuccessMessage('Hero section updated successfully!');
    } catch (error) {
      console.error('Error updating hero data:', error);
      setErrorMessage('Failed to update hero data');
    } finally {
      setIsSaving(false);
      setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 3000);
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading hero data...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Edit Hero Section</h1>
      
      {successMessage && <div className={styles.success}>{successMessage}</div>}
      {errorMessage && <div className={styles.error}>{errorMessage}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Greeting Text</label>
          <input
            type="text"
            name="greeting"
            value={heroData.greeting}
            onChange={handleInputChange}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>First Name</label>
            <input
              type="text"
              name="name"
              value={heroData.name}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Last Name</label>
            <input
              type="text"
              name="last_name"
              value={heroData.last_name || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Job Title</label>
          <input
            type="text"
            name="job_title"
            value={heroData.job_title}
            onChange={handleInputChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Description</label>
          <textarea
            name="description"
            value={heroData.description}
            onChange={handleInputChange}
            rows="5"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Button Text</label>
          <input
            type="text"
            name="button_text"
            value={heroData.button_text}
            onChange={handleInputChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Profile Image URL</label>
          <input
            type="text"
            name="profile_image_url"
            value={heroData.profile_image_url || ''}
            onChange={handleInputChange}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={heroData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={heroData.phone}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={heroData.location}
            onChange={handleInputChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Social Links</label>
          <div className={styles.socialLinks}>
            <input
              type="text"
              placeholder="LinkedIn URL"
              name="linkedin_url"
              value={heroData.linkedin_url || ''}
              onChange={handleInputChange}
            />
            <input
              type="text"
              placeholder="GitHub URL"
              name="github_url"
              value={heroData.github_url || ''}
              onChange={handleInputChange}
            />
            <input
              type="text"
              placeholder="Twitter URL"
              name="twitter_url"
              value={heroData.twitter_url || ''}
              onChange={handleInputChange}
            />
            <input
              type="text"
              placeholder="Instagram URL"
              name="instagram_url"
              value={heroData.instagram_url || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Stats</label>
          <div className={styles.statsContainer}>
            {heroData.stats.map((stat, index) => (
              <div key={index} className={styles.statItem}>
                <input
                  type="text"
                  placeholder="Value"
                  value={stat.value}
                  onChange={(e) => handleStatChange(index, 'value', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Label"
                  value={stat.label}
                  onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className={styles.saveButton}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default Hero;
import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Hero.module.css';

const HeroAdmin = () => {
  const [hero, setHero] = useState({
    greeting: 'Hello, I\'m',
    name: '',
    last_name: '',
    description: '',
    job_title: '',
    button_text: 'Get In Touch',
    profile_image_url: '',
    email: '',
    phone: '',
    location: '',
    linkedin_url: '',
    github_url: '',
    twitter_url: '',
    instagram_url: '',
    stats: [
      { value: '', label: '' },
      { value: '', label: '' },
      { value: '', label: '' }
    ]
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/admin/hero');
        setHero({
          ...response.data,
          stats: response.data.stats || [
            { value: '', label: '' },
            { value: '', label: '' },
            { value: '', label: '' }
          ]
        });
        setLoading(false);
      } catch (error) {
        console.error('Fetch error:', error);
        setNotification({ type: 'error', message: 'Failed to load hero data' });
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHero(prev => ({ ...prev, [name]: value }));
  };

  const handleStatChange = (index, field, value) => {
    const updatedStats = [...hero.stats];
    updatedStats[index][field] = value;
    setHero(prev => ({ ...prev, stats: updatedStats }));
  };

  const addStatField = () => {
    setHero(prev => ({
      ...prev,
      stats: [...prev.stats, { value: '', label: '' }]
    }));
  };

  const removeStatField = (index) => {
    if (hero.stats.length <= 1) return;
    const updatedStats = hero.stats.filter((_, i) => i !== index);
    setHero(prev => ({ ...prev, stats: updatedStats }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setNotification({ type: '', message: '' });

    try {
      await axios.put('/api/admin/hero', hero);
      setNotification({ type: 'success', message: 'Hero section updated successfully!' });
    } catch (error) {
      console.error('Update error:', error);
      setNotification({ type: 'error', message: 'Failed to update hero data' });
    } finally {
      setSaving(false);
      setTimeout(() => setNotification({ type: '', message: '' }), 3000);
    }
  };

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.spinner}></div>
        <p>Loading hero data...</p>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <header className={styles.header}>
        <h2>Hero Section Editor</h2>
        <p>Manage the main hero section content</p>
      </header>

      {notification.message && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          {notification.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <section className={styles.section}>
          <h3>Basic Information</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Greeting Text</label>
              <input
                type="text"
                name="greeting"
                value={hero.greeting}
                onChange={handleChange}
                placeholder="e.g., Hello, I'm"
              />
            </div>

            <div className={styles.formGroup}>
              <label>First Name *</label>
              <input
                type="text"
                name="name"
                value={hero.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Last Name</label>
              <input
                type="text"
                name="last_name"
                value={hero.last_name}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Job Title *</label>
              <input
                type="text"
                name="job_title"
                value={hero.job_title}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h3>Profile Content</h3>
          <div className={styles.formGroup}>
            <label>Description *</label>
            <textarea
              name="description"
              value={hero.description}
              onChange={handleChange}
              rows={5}
              required
            />
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Button Text</label>
              <input
                type="text"
                name="button_text"
                value={hero.button_text}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Profile Image URL</label>
              <input
                type="url"
                name="profile_image_url"
                value={hero.profile_image_url}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h3>Contact Information</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={hero.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={hero.phone}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={hero.location}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h3>Social Links</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>LinkedIn URL</label>
              <input
                type="url"
                name="linkedin_url"
                value={hero.linkedin_url}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div className={styles.formGroup}>
              <label>GitHub URL</label>
              <input
                type="url"
                name="github_url"
                value={hero.github_url}
                onChange={handleChange}
                placeholder="https://github.com/username"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Twitter URL</label>
              <input
                type="url"
                name="twitter_url"
                value={hero.twitter_url}
                onChange={handleChange}
                placeholder="https://twitter.com/username"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Instagram URL</label>
              <input
                type="url"
                name="instagram_url"
                value={hero.instagram_url}
                onChange={handleChange}
                placeholder="https://instagram.com/username"
              />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>Statistics</h3>
            <button
              type="button"
              onClick={addStatField}
              className={styles.addButton}
            >
              Add Stat
            </button>
          </div>
          
          <div className={styles.statsGrid}>
            {hero.stats.map((stat, index) => (
              <div key={index} className={styles.statGroup}>
                <div className={styles.formGroup}>
                  <label>Value</label>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => handleStatChange(index, 'value', e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Label</label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                  />
                </div>
                {hero.stats.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStatField(index)}
                    className={styles.removeButton}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        <div className={styles.formActions}>
          <button
            type="submit"
            className={styles.saveButton}
            disabled={saving}
          >
            {saving ? (
              <>
                <span className={styles.spinner}></span>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HeroAdmin;
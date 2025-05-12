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
    bio: '',
    aboutImageUrl: '',
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
      // Log the data being submitted
      console.log('Submitting hero data:', hero);
      console.log('About fields:', {
        bio: hero.bio,
        aboutImageUrl: hero.aboutImageUrl
      });
      
      // Ensure fields are not undefined
      const dataToSubmit = {
        ...hero,
        bio: hero.bio || '',
        aboutImageUrl: hero.aboutImageUrl || ''
      };
      
      console.log('Final data for submission:', dataToSubmit);
      
      // Use explicit axios call with full configuration
      const response = await axios({
        method: 'put',
        url: '/api/admin/hero',
        data: dataToSubmit,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Update response:', response.data);
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
    <div className={styles.adminDashboard}>
      <div className={styles.adminContainer}>
        <header className={styles.header}>
          <h2>Hero Section Editor</h2>
          <p className={styles.subtitle}>Manage the main hero section content</p>
        </header>

        {notification.message && (
          <div className={`${styles.notification} ${styles[notification.type]}`}>
            {notification.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Basic Information</h3>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Greeting Text</label>
                <input
                  type="text"
                  name="greeting"
                  value={hero.greeting}
                  onChange={handleChange}
                  placeholder="e.g., Hello, I'm"
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={hero.name}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>

              
              <div className={styles.formGroup}>
                <label className={styles.label}>Job Title *</label>
                <input
                  type="text"
                  name="job_title"
                  value={hero.job_title}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>
            </div>
          </section>

          {/* Profile Content Section */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Profile Content</h3>
            <div className={styles.formGroup}>
              <label className={styles.label}>Description *</label>
              <textarea
                name="description"
                value={hero.description}
                onChange={handleChange}
                rows={5}
                required
                className={`${styles.input} ${styles.textarea}`}
              />
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Button Text</label>
                <input
                  type="text"
                  name="button_text"
                  value={hero.button_text}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Profile Image URL</label>
                <input
                  type="url"
                  name="profile_image_url"
                  value={hero.profile_image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className={styles.input}
                />
              </div>
            </div>
          </section>

          {/* About Information Section */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>About Information</h3>
            <div className={styles.formGroup}>
              <label className={styles.label}>Bio (About Me) *</label>
              <textarea
                name="bio"
                value={hero.bio || ''}
                onChange={handleChange}
                rows={6}
                placeholder="Share your professional background, skills, and what makes you unique..."
                className={`${styles.input} ${styles.textarea}`}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>About Section Image URL</label>
              <input
                type="url"
                name="aboutImageUrl"
                value={hero.aboutImageUrl || ''}
                onChange={handleChange}
                placeholder="https://example.com/about-image.jpg"
                className={styles.input}
              />
              <p className={styles.hintText}>This image will be displayed in the About section</p>
            </div>
          </section>

          {/* Contact Information Section */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Contact Information</h3>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={hero.email}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={hero.phone}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Location</label>
                <input
                  type="text"
                  name="location"
                  value={hero.location}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>
            </div>
          </section>

          {/* Social Links Section */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Social Links</h3>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>LinkedIn URL</label>
                <input
                  type="url"
                  name="linkedin_url"
                  value={hero.linkedin_url}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>GitHub URL</label>
                <input
                  type="url"
                  name="github_url"
                  value={hero.github_url}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Twitter URL</label>
                <input
                  type="url"
                  name="twitter_url"
                  value={hero.twitter_url}
                  onChange={handleChange}
                  placeholder="https://twitter.com/username"
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Instagram URL</label>
                <input
                  type="url"
                  name="instagram_url"
                  value={hero.instagram_url}
                  onChange={handleChange}
                  placeholder="https://instagram.com/username"
                  className={styles.input}
                />
              </div>
            </div>
          </section>

          {/* Statistics Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Statistics</h3>
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
                    <label className={styles.label}>Value</label>
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => handleStatChange(index, 'value', e.target.value)}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Label</label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                      className={styles.input}
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
    </div>
  );
};

export default HeroAdmin;
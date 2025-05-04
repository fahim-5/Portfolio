import React, { useEffect } from 'react';
import styles from './adminDashboard.module.css';
import profileImage from '../../assets/profile.jpg';

const PersonalInfoEditor = ({ 
  personalInfo, 
  updatePersonalInfo, 
  savePersonalInfoChanges, 
  changeSection,
  showNotification
}) => {
  // Debug logs
  useEffect(() => {
    console.log('PersonalInfoEditor mounted with data:', personalInfo);
    
    // Check required fields
    if (!personalInfo) {
      console.error('PersonalInfoEditor: personalInfo is null or undefined');
    } else if (typeof personalInfo !== 'object') {
      console.error('PersonalInfoEditor: personalInfo is not an object:', typeof personalInfo);
    } else {
      console.log('PersonalInfoEditor: data looks valid');
      console.log('Name:', personalInfo.name);
      console.log('Job Title:', personalInfo.jobTitle);
      console.log('Has hero object:', !!personalInfo.hero);
    }
  }, [personalInfo]);

  // Return early with fallback UI if no valid data
  if (!personalInfo || typeof personalInfo !== 'object') {
    return (
      <div className="content-section">
        <div className="section-header">
          <h2>Edit Personal Information</h2>
        </div>
        <div className="error-message">
          <p>Error: Could not load personal information data.</p>
          <p>Please try refreshing the page or going back to the dashboard.</p>
        </div>
      </div>
    );
  }

  const handleProfileImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      showNotification?.('Uploading and processing image...', 'info');
      
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          updatePersonalInfo('hero.profileImageUrl', event.target.result);
          showNotification?.('Profile image updated successfully!', 'success');
        }
      };
      
      reader.onerror = () => {
        showNotification?.('Failed to read the image file.', 'error');
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleAboutImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      showNotification?.('Uploading and processing image...', 'info');
      
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          updatePersonalInfo('aboutImageUrl', event.target.result);
          showNotification?.('About image updated successfully!', 'success');
        }
      };
      
      reader.onerror = () => {
        showNotification?.('Failed to read the image file.', 'error');
      };
      
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="content-section">
      <div className="editor-header">
        <h2>Edit Personal Information</h2>
        <div className="editor-actions">
          <button className="btn-primary" onClick={savePersonalInfoChanges}>
            Save Changes
          </button>
          <button className="btn-secondary" onClick={() => changeSection('dashboard')}>
            Cancel
          </button>
        </div>
      </div>

      <div className="section-content">
        <div className="editor-section">
          <h3>Profile & Image</h3>
          
          <div className="form-group">
            <label>Profile Image</label>
            <div className="about-image-container">
              {personalInfo.hero?.profileImageUrl ? (
                <img 
                  src={personalInfo.hero?.profileImageUrl} 
                  alt="Profile" 
                />
              ) : (
                <div className="no-image">
                  <i className="fas fa-user"></i>
                </div>
              )}
              <div className="image-actions">
                <button className="btn-cyan" onClick={() => document.getElementById('profileImage').click()}>
                  <i className="fas fa-upload"></i> Upload Image
                </button>
                <input 
                  type="file" 
                  id="profileImage" 
                  accept="image/*" 
                  style={{display: 'none'}} 
                  onChange={handleProfileImageUpload}
                />
                {personalInfo.hero?.profileImageUrl && (
                  <button className="btn-secondary" onClick={() => updatePersonalInfo('hero.profileImageUrl', null)}>
                    <i className="fas fa-trash"></i> Remove
                  </button>
                )}
              </div>
              <div className="form-helper-text">
                This profile picture appears in your Hero section, Header, and About page
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="personalName">Full Name</label>
              <input 
                type="text" 
                id="personalName"
                className="form-control" 
                placeholder="Your full name" 
                value={personalInfo.name || ""}
                onChange={(e) => updatePersonalInfo('name', e.target.value)}
              />
              <span className="helper-text">Used in your Hero section, Header and throughout the site</span>
            </div>
            <div className="form-group">
              <label htmlFor="personalJobTitle">Job Title</label>
              <input 
                type="text" 
                id="personalJobTitle"
                className="form-control" 
                placeholder="e.g. Web Developer" 
                value={personalInfo.jobTitle || ""}
                onChange={(e) => updatePersonalInfo('jobTitle', e.target.value)}
              />
              <span className="helper-text">Appears below your name in the Hero section and Header</span>
            </div>
          </div>
        </div>
        
        <div className="editor-section">
          <h3>Hero & Header Content</h3>
          
          <div className="form-group">
            <label htmlFor="greeting">Greeting Text</label>
            <input 
              type="text" 
              id="greeting"
              className="form-control" 
              placeholder="e.g. Hello, I'm" 
              value={personalInfo.hero?.greeting || "Hello, I'm"}
              onChange={(e) => updatePersonalInfo('hero.greeting', e.target.value)}
            />
            <span className="helper-text">Appears above your name in the Hero section</span>
          </div>

          <div className="form-group">
            <label htmlFor="heroDescription">Hero Description</label>
            <textarea 
              id="heroDescription"
              className="form-control" 
              rows="4" 
              placeholder="A Full-Stack Web Developer & Data Enthusiast..."
              value={personalInfo.hero?.description || ""}
              onChange={(e) => updatePersonalInfo('hero.description', e.target.value)}
            ></textarea>
            <span className="helper-text">Will fall back to your introduction if left empty</span>
          </div>

          <div className="form-group">
            <label htmlFor="buttonText">Button Text</label>
            <input 
              type="text" 
              id="buttonText"
              className="form-control" 
              placeholder="e.g. Get In Touch" 
              value={personalInfo.hero?.buttonText || "Get In Touch"}
              onChange={(e) => updatePersonalInfo('hero.buttonText', e.target.value)}
            />
            <span className="helper-text">Text on the call-to-action button in your Hero section</span>
          </div>

          <h4>Hero Stats</h4>
          <p className="form-helper-text">These statistics are displayed in your hero section</p>
          
          {(personalInfo.hero?.stats || []).map((stat, index) => (
            <div key={index} className="stat-row">
              <div className="stat-label">Value</div>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. 5+" 
                value={stat.value || ""}
                onChange={(e) => {
                  const updatedStats = [...(personalInfo.hero?.stats || [])];
                  updatedStats[index] = { ...updatedStats[index], value: e.target.value };
                  updatePersonalInfo('hero.stats', updatedStats);
                }}
              />
              
              <div className="stat-label">Label</div>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. Years Experience" 
                value={stat.label || ""}
                onChange={(e) => {
                  const updatedStats = [...(personalInfo.hero?.stats || [])];
                  updatedStats[index] = { ...updatedStats[index], label: e.target.value };
                  updatePersonalInfo('hero.stats', updatedStats);
                }}
              />
              
              <button 
                className="btn-delete"
                onClick={() => {
                  const updatedStats = personalInfo.hero?.stats.filter((_, i) => i !== index);
                  updatePersonalInfo('hero.stats', updatedStats);
                }}
              >
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
          ))}
          
          <button 
            className="btn-add-stat"
            onClick={() => {
              const currentStats = [...(personalInfo.hero?.stats || [])];
              const updatedStats = [...currentStats, { value: "", label: "" }];
              updatePersonalInfo('hero.stats', updatedStats);
            }}
          >
            <i className="fas fa-plus"></i> Add Stat
          </button>
        </div>
          
        <div className="editor-section">
          <h3>About Section</h3>
          <div className="form-group">
            <label>About Section Image</label>
            <div className="about-image-container">
              {personalInfo.aboutImageUrl ? (
                <img 
                  src={personalInfo.aboutImageUrl} 
                  alt="About section" 
                />
              ) : (
                <div className="no-image">
                  <i className="fas fa-user"></i>
                </div>
              )}
              <div className="image-actions">
                <button className="btn-cyan" onClick={() => document.getElementById('aboutImage').click()}>
                  <i className="fas fa-upload"></i> Upload Image
                </button>
                <input 
                  type="file" 
                  id="aboutImage" 
                  accept="image/*" 
                  style={{display: 'none'}} 
                  onChange={handleAboutImageUpload}
                />
                {personalInfo.aboutImageUrl && (
                  <button className="btn-secondary" onClick={() => updatePersonalInfo('aboutImageUrl', null)}>
                    <i className="fas fa-trash"></i> Remove
                  </button>
                )}
              </div>
              <div className="form-helper-text">
                This image appears in your About section
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="biography">Biography</label>
            <textarea 
              id="biography"
              className="form-control" 
              rows="6" 
              placeholder="Write about yourself, your skills, expertise, and career objectives"
              value={personalInfo.bio || ""}
              onChange={(e) => updatePersonalInfo('bio', e.target.value)}
            ></textarea>
            <span className="helper-text">Displayed in your About section</span>
          </div>
        </div>
        
        <div className="editor-section">
          <h3>Contact Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email"
                className="form-control" 
                placeholder="Your email address" 
                value={personalInfo.email || ""}
                onChange={(e) => updatePersonalInfo('email', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input 
                type="text" 
                id="phone"
                className="form-control" 
                placeholder="Your phone number" 
                value={personalInfo.phone || ""}
                onChange={(e) => updatePersonalInfo('phone', e.target.value)}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input 
                type="text" 
                id="location"
                className="form-control" 
                placeholder="Your location (city, country)" 
                value={personalInfo.location || ""}
                onChange={(e) => updatePersonalInfo('location', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="website">Website</label>
              <input 
                type="text" 
                id="website"
                className="form-control" 
                placeholder="Your website URL" 
                value={personalInfo.website || ""}
                onChange={(e) => updatePersonalInfo('website', e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="editor-section">
          <h3>Social Media Links</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="linkedin">LinkedIn URL</label>
              <input 
                type="text" 
                id="linkedin"
                className="form-control" 
                placeholder="LinkedIn profile URL" 
                value={personalInfo.socialLinks?.linkedin || ""}
                onChange={(e) => updatePersonalInfo('socialLinks.linkedin', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="github">GitHub URL</label>
              <input 
                type="text" 
                id="github"
                className="form-control" 
                placeholder="GitHub profile URL" 
                value={personalInfo.socialLinks?.github || ""}
                onChange={(e) => updatePersonalInfo('socialLinks.github', e.target.value)}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="twitter">Twitter URL</label>
              <input 
                type="text" 
                id="twitter"
                className="form-control" 
                placeholder="Twitter profile URL" 
                value={personalInfo.socialLinks?.twitter || ""}
                onChange={(e) => updatePersonalInfo('socialLinks.twitter', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="instagram">Instagram URL</label>
              <input 
                type="text" 
                id="instagram"
                className="form-control" 
                placeholder="Instagram profile URL" 
                value={personalInfo.socialLinks?.instagram || ""}
                onChange={(e) => updatePersonalInfo('socialLinks.instagram', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoEditor; 
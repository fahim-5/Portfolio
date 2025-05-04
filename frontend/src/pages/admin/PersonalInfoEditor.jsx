import React, { useEffect, useState } from 'react';
import styles from './adminDashboard.module.css';
import axios from 'axios';

// Use hardcoded API URL instead of environment variable
const API_URL = 'http://localhost:5001/api';

// Flag to use mock data when real API is unavailable
const USE_MOCK_API = true; // Set to true to use mock endpoints

// Add a timeout for API requests
axios.defaults.timeout = 10000; // 10 seconds timeout

// Add CSS for spin animation
const spinnerStyle = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const PersonalInfoEditor = ({ 
  personalInfo, 
  updatePersonalInfo, 
  savePersonalInfoChanges, 
  changeSection,
  showNotification
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isBackendAvailable, setIsBackendAvailable] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const [useMockData, setUseMockData] = useState(USE_MOCK_API);
  const [lastSaveTime, setLastSaveTime] = useState(0); // Add timestamp tracking for save operations
  const [fetchAttempts, setFetchAttempts] = useState(0); // Track number of fetch attempts

  // Helper to get the correct endpoint based on availability
  const getApiEndpoint = (endpoint) => {
    if (useMockData) {
      // Convert normal endpoints to mock endpoints
      return endpoint.replace('/profile/1', '/profile/mock/1');
    }
    return endpoint;
  };

  // Check if backend is available
  const checkBackendStatus = async () => {
    try {
      // Use a direct fetch with timeout to avoid axios configuration issues
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(`http://localhost:5001/api/health`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        setIsBackendAvailable(true);
        return true;
      } else {
        throw new Error(`Server responded with status: ${response.status}`);
      }
    } catch (err) {
      console.error('Backend server not available:', err);
      setIsBackendAvailable(false);
      showNotification?.('Unable to connect to server. Using mock data instead.', 'warning');
      setUseMockData(true); // Switch to mock data automatically
      return false;
    }
  };

  // Retry connection to backend
  const retryConnection = async () => {
    setIsRetrying(true);
    const isAvailable = await checkBackendStatus();
    setIsRetrying(false);
    
    if (isAvailable) {
      // If connection is restored, try to use real data
      setUseMockData(false);
      fetchUserProfile();
    }
  };

  // Fetch user data from API
  const fetchUserProfile = async () => {
    // Prevent too many recursive calls
    setFetchAttempts(prev => prev + 1);
    if (fetchAttempts > 3) {
      console.error('Too many fetch attempts, stopping to prevent infinite loop');
      setIsLoading(false);
      setError('Failed to load profile after multiple attempts. Please refresh the page.');
      showNotification?.('Failed to load profile after multiple attempts. Please refresh the page.', 'error');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    // First check if backend is available if we're not using mock data
    if (!useMockData && !await checkBackendStatus()) {
      // Will automatically switch to mock data if real API is unavailable
      setIsLoading(false);
      setUseMockData(true); // Set mock data flag
      fetchUserProfile(); // Try again with mock data
      return;
    }
    
    try {
      const endpoint = getApiEndpoint(`${API_URL}/profile/1`);
      console.log('Fetching profile from:', endpoint);
      
      const response = await axios.get(endpoint);
      if (response.data.success) {
        setUserData(response.data.data);
        // Reset fetch attempts counter on success
        setFetchAttempts(0);
        // Update parent component's state with fresh data
        if (typeof updatePersonalInfo === 'function') {
          // Set entire userData object
          Object.keys(response.data.data).forEach(key => {
            if (key !== 'id') {
              updatePersonalInfo(key, response.data.data[key]);
            }
          });
        }
        
        if (useMockData) {
          showNotification?.('Using mock data - changes will not be saved to database', 'info');
        }
      } else {
        throw new Error(response.data.message || 'Failed to fetch profile');
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      if (err.code === 'ECONNABORTED') {
        setError('Request timed out. Server might be down or unreachable.');
        showNotification?.('Request timed out. Switching to mock data.', 'warning');
        setUseMockData(true);
        setTimeout(() => fetchUserProfile(), 100); // Use setTimeout to avoid immediate recursion
      } else if (err.response) {
        if (err.response.status === 404 && !useMockData) {
          // If it's a 404 and we're not using mock data, try with mock data
          setUseMockData(true);
          showNotification?.('API endpoint not found. Using mock data instead.', 'warning');
          setTimeout(() => fetchUserProfile(), 100); // Use setTimeout to avoid immediate recursion
        } else {
          // Other server errors
          setError(err.response.data?.message || `Error ${err.response.status}: ${err.response.statusText}`);
          showNotification?.('Failed to load profile data. Please try again.', 'error');
        }
      } else if (err.request) {
        // Request made but no response received
        setError('No response from server. Please check your connection.');
        showNotification?.('No response from server. Using mock data.', 'warning');
        setUseMockData(true);
        setTimeout(() => fetchUserProfile(), 100); // Use setTimeout to avoid immediate recursion
      } else {
        // Error setting up request
        setError(err.message || 'Failed to load profile data');
        showNotification?.('Failed to load profile data. Please try again.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Run on component mount - use empty dependency array to run only once
  useEffect(() => {
    fetchUserProfile();
  }, []); // Empty dependency array to ensure it only runs once on mount

  // Handle save changes - Fixed with guaranteed loading state reset for mock data
  const handleSaveChanges = async () => {
    console.log('Save button clicked, current state:', { isLoading, useMockData });
    
    // If already saving, prevent multiple clicks
    if (isLoading) {
      console.log('Already saving, ignoring click');
      return;
    }
    
    // Prevent multiple rapid saves (must be at least 2 seconds apart)
    const now = Date.now();
    if (now - lastSaveTime < 2000) {
      console.log('Save attempted too quickly after last save, ignoring');
      return;
    }
    setLastSaveTime(now);
    
    // Show saving state immediately
    setIsLoading(true);
    setError(null);
    
    // Safety timeout - will ALWAYS reset loading state after 5 seconds max
    // This prevents the button from getting stuck in saving state
    const safetyTimeout = setTimeout(() => {
      console.log('⚠️ Safety timeout triggered - forcing reset of loading state');
      setIsLoading(false);
    }, 5000);
    
    // If using mock data, we'll just simulate a save with a short fixed delay
    if (useMockData) {
      console.log('Using mock data - simulating save with fixed delay');
      
      try {
        // Fixed delay of 1 second for mock saving
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Clear safety timeout since we're handling it here
        clearTimeout(safetyTimeout);
        
        // Always reset loading state and show success message
        console.log('Mock save completed successfully');
        setIsLoading(false);
        showNotification?.('Profile updated successfully (mock data)!', 'success');
        
        // If parent component has a save function, call it
        if (typeof savePersonalInfoChanges === 'function') {
          savePersonalInfoChanges();
        }
      } catch (err) {
        // This shouldn't happen with the mock timeout, but just in case
        console.error('Error in mock save:', err);
        clearTimeout(safetyTimeout);
        setIsLoading(false);
      }
      
      return;
    }
    
    // Try to check server connection first
    let serverAvailable = false;
    try {
      serverAvailable = await checkBackendStatus();
    } catch (err) {
      console.error('Error checking server status:', err);
    }
    
    // If server isn't available, show error and exit save operation
    if (!serverAvailable) {
      setIsLoading(false);
      showNotification?.('Server not available. Switched to mock data mode.', 'warning');
      setUseMockData(true);
      return;
    }
    
    // Use a timeout to ensure the loading state is always reset
    const saveTimeout = setTimeout(() => {
      setIsLoading(false);
      showNotification?.('Save operation timed out. Please try again.', 'error');
    }, 10000); // 10 second max timeout
    
    try {
      // Get the right endpoint based on mock flag
      const endpoint = getApiEndpoint(`${API_URL}/profile/1`);
      console.log('Saving profile to:', endpoint);
      
      // Attempt to save the data
      const response = await axios.put(endpoint, personalInfo, {
        timeout: 8000 // 8 second timeout for the request
      });
      
      // Clear the safety timeout since we got a response
      clearTimeout(saveTimeout);
      
      // Handle successful save
      if (response.data.success) {
        showNotification?.('Profile updated successfully!', 'success');
        
        // Call parent save function if it exists
        if (typeof savePersonalInfoChanges === 'function') {
          savePersonalInfoChanges();
        }
        
        // Update local state with fresh data
        setUserData(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to update profile');
      }
    } catch (err) {
      // Clear the safety timeout since we're handling the error
      clearTimeout(saveTimeout);
      
      console.error('Error updating profile:', err);
      
      if (err.code === 'ECONNABORTED') {
        setError('Request timed out. Server might be down or unreachable.');
        showNotification?.('Request timed out. Please try again later.', 'error');
      } else if (err.response) {
        // Server responded with error
        const errorMessage = err.response.data?.message || `Error ${err.response.status}: ${err.response.statusText}`;
        setError(errorMessage);
        showNotification?.(`Failed to update profile: ${errorMessage}`, 'error');
      } else if (err.request) {
        // Request made but no response received
        setError('No response from server. Please check your connection.');
        showNotification?.('No response from server. Please check your connection.', 'error');
      } else {
        // Error setting up request
        setError(err.message || 'Failed to update profile');
        showNotification?.(`Failed to update profile: ${err.message}`, 'error');
      }
    } finally {
      // ALWAYS reset loading state, no matter what happened
      setIsLoading(false);
    }
  };

  // Handle profile image upload
  const handleProfileImageUpload = async (e) => {
    if (isLoading) return; // Prevent uploads during loading states
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Create form data
      const formData = new FormData();
      formData.append('image', file);

      // Show loading notification
      showNotification?.('Uploading profile image...', 'info');
      setIsLoading(true);

      // If using mock data, simulate an upload with a delay
      if (useMockData) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create a mock image URL
        const mockImageUrl = 'mock-profile-image.jpg';
        
        // Update state with mock avatar URL
        updatePersonalInfo('avatar', mockImageUrl);
        updatePersonalInfo('hero.profileImageUrl', mockImageUrl);
        
        showNotification?.('Profile image uploaded successfully (mock data)!', 'success');
        setIsLoading(false);
        return;
      }

      try {
        // Upload the file to the correct endpoint
        const endpoint = getApiEndpoint(`${API_URL}/profile/avatar/1`);
        console.log('Uploading profile image to:', endpoint);
        
        const response = await axios.post(endpoint, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        console.log('Profile image upload response:', response.data);

        if (response.data.success) {
          // Update state with new avatar URL
          const avatarPath = response.data.data.avatar;
          console.log('Avatar path received:', avatarPath);
          
          // Ensure the path starts with a slash
          const formattedPath = avatarPath.startsWith('/') ? avatarPath : `/${avatarPath}`;
          
          updatePersonalInfo('avatar', formattedPath);
          
          // Also update hero profileImageUrl which uses the same avatar
          updatePersonalInfo('hero.profileImageUrl', formattedPath);
          
          showNotification?.('Profile image uploaded successfully!', 'success');
        } else {
          throw new Error(response.data.message || 'Failed to upload image');
        }
      } catch (err) {
        console.error('Error uploading profile image:', err);
        
        if (err.response?.status === 404) {
          // If endpoint not found, switch to mock data
          setUseMockData(true);
          showNotification?.('API endpoint not available. Switched to mock data.', 'warning');
          handleProfileImageUpload(e); // Try again with mock data
        } else {
          const errorMessage = err.response?.data?.message || err.message || 'Failed to upload profile image';
          showNotification?.(`Failed to upload profile image: ${errorMessage}`, 'error');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle about image upload
  const handleAboutImageUpload = async (e) => {
    if (isLoading) return; // Prevent uploads during loading states
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Create form data
      const formData = new FormData();
      formData.append('image', file);

      // Show loading notification
      showNotification?.('Uploading about image...', 'info');
      setIsLoading(true);

      // If using mock data, simulate an upload with a delay
      if (useMockData) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create a mock image URL
        const mockImageUrl = 'mock-about-image.jpg';
        
        // Update state with mock avatar URL
        updatePersonalInfo('aboutImageUrl', mockImageUrl);
        
        showNotification?.('About image uploaded successfully (mock data)!', 'success');
        setIsLoading(false);
        return;
      }

      try {
        // Upload the file to the correct endpoint
        const endpoint = getApiEndpoint(`${API_URL}/profile/about-image/1`);
        console.log('Uploading about image to:', endpoint);
        
        const response = await axios.post(endpoint, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        console.log('About image upload response:', response.data);

        if (response.data.success) {
          // Update state with new about image URL
          const aboutImageUrl = response.data.data.aboutImageUrl;
          console.log('About image path received:', aboutImageUrl);
          
          // Ensure the path starts with a slash
          const formattedPath = aboutImageUrl.startsWith('/') ? aboutImageUrl : `/${aboutImageUrl}`;
          
          updatePersonalInfo('aboutImageUrl', formattedPath);
          showNotification?.('About image uploaded successfully!', 'success');
        } else {
          throw new Error(response.data.message || 'Failed to upload image');
        }
      } catch (err) {
        console.error('Error uploading about image:', err);
        
        if (err.response?.status === 404) {
          // If endpoint not found, switch to mock data
          setUseMockData(true);
          showNotification?.('API endpoint not available. Switched to mock data.', 'warning');
          handleAboutImageUpload(e); // Try again with mock data
        } else {
          const errorMessage = err.response?.data?.message || err.message || 'Failed to upload about image';
          showNotification?.(`Failed to upload about image: ${errorMessage}`, 'error');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Return server connection error state
  if (!isBackendAvailable) {
    return (
      <div className={styles.contentSection || "content-section"}>
        <div className={styles.sectionHeader || "section-header"}>
          <h2>Edit Personal Information</h2>
        </div>
        <div className={styles.errorMessage || "error-message"}>
          <p>Error: Cannot connect to the server</p>
          <p>Please make sure the backend server is running at {API_URL}</p>
          <button 
            className={styles.btnPrimary || "btn-primary"}
            onClick={retryConnection}
            disabled={isRetrying}
          >
            {isRetrying ? 'Checking connection...' : 'Retry Connection'}
          </button>
        </div>
      </div>
    );
  }

  // Return loading state if data is being fetched
  if (isLoading && !personalInfo) {
    return (
      <div className={styles.contentSection || "content-section"}>
        <div className={styles.sectionHeader || "section-header"}>
          <h2>Edit Personal Information</h2>
        </div>
        <div className={styles.loadingMessage || "loading-message"}>
          <p>Loading profile information...</p>
        </div>
      </div>
    );
  }

  // Return error state if there was an error loading data
  if (error && !personalInfo) {
    return (
      <div className={styles.contentSection || "content-section"}>
        <div className={styles.sectionHeader || "section-header"}>
          <h2>Edit Personal Information</h2>
        </div>
        <div className={styles.errorMessage || "error-message"}>
          <p>Error: {error}</p>
          <p>Please try refreshing the page or going back to the dashboard.</p>
          <button 
            className={styles.btnPrimary || "btn-primary"}
            onClick={fetchUserProfile}
            disabled={isLoading}
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  // Return early with fallback UI if no valid data
  if (!personalInfo || typeof personalInfo !== 'object') {
    return (
      <div className={styles.contentSection || "content-section"}>
        <div className={styles.sectionHeader || "section-header"}>
          <h2>Edit Personal Information</h2>
        </div>
        <div className={styles.errorMessage || "error-message"}>
          <p>Error: Could not load personal information data.</p>
          <p>Please try refreshing the page or going back to the dashboard.</p>
          <button 
            className={styles.btnPrimary || "btn-primary"}
            onClick={fetchUserProfile}
            disabled={isLoading}
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.contentSection || "content-section"}>
      {/* Add the style tag for the spinner animation */}
      <style dangerouslySetInnerHTML={{ __html: spinnerStyle }} />
      
      {/* Add mock data warning banner */}
      {useMockData && (
        <div 
          style={{
            background: '#fff3cd',
            color: '#856404',
            border: '1px solid #ffeeba',
            borderRadius: '4px',
            padding: '12px 16px',
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <strong>Using Mock Data Mode</strong> - Changes will not be saved to the database.
            {!isBackendAvailable && <span> (Server is currently unavailable)</span>}
          </div>
          <button 
            className={styles.btnPrimary || "btn-primary"} 
            onClick={retryConnection}
            disabled={isRetrying || !isBackendAvailable}
            style={{ padding: '6px 12px', fontSize: '14px' }}
          >
            {isRetrying ? 'Checking...' : 'Try Real Data'}
          </button>
        </div>
      )}
      
      <div className={styles.editorHeader || "editor-header"}>
        <h2>Edit Personal Information</h2>
        <div className={styles.editorActions || "editor-actions"}>
          <button 
            className={`${styles.btnPrimary || "btn-primary"} ${isLoading ? styles.btnLoading || "btn-loading" : ""}`}
            onClick={(e) => {
              // Prevent any default behavior
              e.preventDefault();
              e.stopPropagation();
              // Call save function explicitly
              handleSaveChanges();
            }}
            disabled={isLoading}
            style={{ 
              minWidth: '120px',
              position: 'relative',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
            type="button" // Explicitly set as button type to avoid form submission behavior
          >
            {isLoading ? (
              <>
                <span 
                  className="loading-spinner" 
                  style={{
                    display: 'inline-block',
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderRadius: '50%',
                    borderTopColor: '#fff',
                    animation: 'spin 1s linear infinite',
                    marginRight: '8px',
                    verticalAlign: 'middle'
                  }}
                ></span>
                Saving...
              </>
            ) : 'Save Changes'}
          </button>
          <button 
            className={styles.btnSecondary || "btn-secondary"} 
            onClick={() => changeSection('dashboard')}
            disabled={isLoading}
            type="button" // Explicitly set as button type
          >
            Cancel
          </button>
        </div>
      </div>

      <div className={styles.sectionContent || "section-content"}>
        <div className={styles.editorSection || "editor-section"}>
          <h3>Profile & Image</h3>
          
          <div className={styles.formGroup || "form-group"}>
            <label>Profile Image</label>
            <div className={styles.aboutImageContainer || "about-image-container"}>
              {personalInfo.hero?.profileImageUrl ? (
                <img 
                  src={useMockData ? 
                    // When using mock data, use placeholder images
                    'https://via.placeholder.com/200x200?text=Profile+Image' : 
                    // Use full URL path with forward slashes for image display
                    personalInfo.hero.profileImageUrl.startsWith('http') ? 
                      personalInfo.hero.profileImageUrl : 
                      `${API_URL}/uploads${personalInfo.hero.profileImageUrl}`
                  } 
                  alt="Profile" 
                  style={{maxWidth: '100%', maxHeight: '200px'}}
                />
              ) : (
                <div className={styles.noImage || "no-image"}>
                  <i className="fas fa-user"></i>
                </div>
              )}
              <div className={styles.imageActions || "image-actions"}>
                <button 
                  className={styles.btnCyan || "btn-cyan"} 
                  onClick={() => document.getElementById('profileImage').click()}
                  disabled={isLoading}
                >
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
                  <button 
                    className={styles.btnSecondary || "btn-secondary"} 
                    onClick={async () => {
                      try {
                        await axios.put(`${API_URL}/profile/1`, {
                          avatar: null,
                          hero: {
                            ...personalInfo.hero,
                            profileImageUrl: null
                          }
                        });
                        updatePersonalInfo('hero.profileImageUrl', null);
                        updatePersonalInfo('avatar', null);
                        showNotification?.('Profile image removed successfully!', 'success');
                      } catch (err) {
                        console.error('Error removing profile image:', err);
                        showNotification?.('Failed to remove profile image. Please try again.', 'error');
                      }
                    }}
                    disabled={isLoading}
                  >
                    <i className="fas fa-trash"></i> Remove
                  </button>
                )}
              </div>
              <div className={styles.formHelperText || "form-helper-text"}>
                This profile picture appears in your Hero section, Header, and About page
              </div>
            </div>
          </div>

          <div className={styles.formRow || "form-row"}>
            <div className={styles.formGroup || "form-group"}>
              <label htmlFor="personalName">Full Name</label>
              <input 
                type="text" 
                id="personalName"
                className={styles.formControl || "form-control"} 
                placeholder="Your full name" 
                value={personalInfo.name || ""}
                onChange={(e) => updatePersonalInfo('name', e.target.value)}
                disabled={isLoading}
              />
              <span className={styles.helperText || "helper-text"}>Used in your Hero section, Header and throughout the site</span>
            </div>
            <div className={styles.formGroup || "form-group"}>
              <label htmlFor="personalJobTitle">Job Title</label>
              <input 
                type="text" 
                id="personalJobTitle"
                className={styles.formControl || "form-control"} 
                placeholder="e.g. Web Developer" 
                value={personalInfo.jobTitle || ""}
                onChange={(e) => updatePersonalInfo('jobTitle', e.target.value)}
                disabled={isLoading}
              />
              <span className={styles.helperText || "helper-text"}>Appears below your name in the Hero section and Header</span>
            </div>
          </div>
        </div>
        
        <div className={styles.editorSection || "editor-section"}>
          <h3>Hero & Header Content</h3>
          
          <div className={styles.formGroup || "form-group"}>
            <label htmlFor="greeting">Greeting Text</label>
            <input 
              type="text" 
              id="greeting"
              className={styles.formControl || "form-control"} 
              placeholder="e.g. Hello, I'm" 
              value={personalInfo.hero?.greeting || "Hello, I'm"}
              onChange={(e) => updatePersonalInfo('hero.greeting', e.target.value)}
              disabled={isLoading}
            />
            <span className={styles.helperText || "helper-text"}>Appears above your name in the Hero section</span>
          </div>

          <div className={styles.formGroup || "form-group"}>
            <label htmlFor="heroDescription">Hero Description</label>
            <textarea 
              id="heroDescription"
              className={styles.formControl || "form-control"} 
              rows="4" 
              placeholder="A Full-Stack Web Developer & Data Enthusiast..."
              value={personalInfo.hero?.description || ""}
              onChange={(e) => updatePersonalInfo('hero.description', e.target.value)}
              disabled={isLoading}
            ></textarea>
            <span className={styles.helperText || "helper-text"}>Will fall back to your introduction if left empty</span>
          </div>

          <div className={styles.formGroup || "form-group"}>
            <label htmlFor="buttonText">Button Text</label>
            <input 
              type="text" 
              id="buttonText"
              className={styles.formControl || "form-control"} 
              placeholder="e.g. Get In Touch" 
              value={personalInfo.hero?.buttonText || "Get In Touch"}
              onChange={(e) => updatePersonalInfo('hero.buttonText', e.target.value)}
              disabled={isLoading}
            />
            <span className={styles.helperText || "helper-text"}>Text on the call-to-action button in your Hero section</span>
          </div>

          <h4>Hero Stats</h4>
          <p className={styles.formHelperText || "form-helper-text"}>These statistics are displayed in your hero section</p>
          
          {(personalInfo.hero?.stats || []).map((stat, index) => (
            <div key={index} className={styles.statRow || "stat-row"}>
              <div className={styles.statLabel || "stat-label"}>Value</div>
              <input 
                type="text" 
                className={styles.formControl || "form-control"} 
                placeholder="e.g. 5+" 
                value={stat.value || ""}
                onChange={(e) => {
                  const updatedStats = [...(personalInfo.hero?.stats || [])];
                  updatedStats[index] = { ...updatedStats[index], value: e.target.value };
                  updatePersonalInfo('hero.stats', updatedStats);
                }}
                disabled={isLoading}
              />
              
              <div className={styles.statLabel || "stat-label"}>Label</div>
              <input 
                type="text" 
                className={styles.formControl || "form-control"} 
                placeholder="e.g. Years Experience" 
                value={stat.label || ""}
                onChange={(e) => {
                  const updatedStats = [...(personalInfo.hero?.stats || [])];
                  updatedStats[index] = { ...updatedStats[index], label: e.target.value };
                  updatePersonalInfo('hero.stats', updatedStats);
                }}
                disabled={isLoading}
              />
              
              <button 
                className={styles.btnDelete || "btn-delete"}
                onClick={() => {
                  const updatedStats = personalInfo.hero?.stats.filter((_, i) => i !== index);
                  updatePersonalInfo('hero.stats', updatedStats);
                }}
                disabled={isLoading}
              >
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
          ))}
          
          <button 
            className={styles.btnAddStat || "btn-add-stat"}
            onClick={() => {
              const currentStats = [...(personalInfo.hero?.stats || [])];
              const updatedStats = [...currentStats, { value: "", label: "" }];
              updatePersonalInfo('hero.stats', updatedStats);
            }}
            disabled={isLoading}
          >
            <i className="fas fa-plus"></i> Add Stat
          </button>
        </div>
          
        <div className={styles.editorSection || "editor-section"}>
          <h3>About Section</h3>
          <div className={styles.formGroup || "form-group"}>
            <label>About Section Image</label>
            <div className={styles.aboutImageContainer || "about-image-container"}>
              {personalInfo.aboutImageUrl ? (
                <img 
                  src={useMockData ? 
                    // When using mock data, use placeholder images
                    'https://via.placeholder.com/400x300?text=About+Image' : 
                    // Use full URL path with forward slashes for image display
                    personalInfo.aboutImageUrl.startsWith('http') ?
                      personalInfo.aboutImageUrl :
                      `${API_URL}/uploads${personalInfo.aboutImageUrl}`
                  } 
                  alt="About section"
                  style={{maxWidth: '100%', maxHeight: '200px'}} 
                />
              ) : (
                <div className={styles.noImage || "no-image"}>
                  <i className="fas fa-user"></i>
                </div>
              )}
              <div className={styles.imageActions || "image-actions"}>
                <button 
                  className={styles.btnCyan || "btn-cyan"} 
                  onClick={() => document.getElementById('aboutImage').click()}
                  disabled={isLoading}
                >
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
                  <button 
                    className={styles.btnSecondary || "btn-secondary"} 
                    onClick={async () => {
                      try {
                        await axios.put(`${API_URL}/profile/1`, {
                          aboutImageUrl: null
                        });
                        updatePersonalInfo('aboutImageUrl', null);
                        showNotification?.('About image removed successfully!', 'success');
                      } catch (err) {
                        console.error('Error removing about image:', err);
                        showNotification?.('Failed to remove about image. Please try again.', 'error');
                      }
                    }}
                    disabled={isLoading}
                  >
                    <i className="fas fa-trash"></i> Remove
                  </button>
                )}
              </div>
              <div className={styles.formHelperText || "form-helper-text"}>
                This image appears in your About section
              </div>
            </div>
          </div>
          
          <div className={styles.formGroup || "form-group"}>
            <label htmlFor="biography">Biography</label>
            <textarea 
              id="biography"
              className={styles.formControl || "form-control"} 
              rows="6" 
              placeholder="Write about yourself, your skills, expertise, and career objectives"
              value={personalInfo.bio || ""}
              onChange={(e) => updatePersonalInfo('bio', e.target.value)}
              disabled={isLoading}
            ></textarea>
            <span className={styles.helperText || "helper-text"}>Displayed in your About section</span>
          </div>
        </div>
        
        <div className={styles.editorSection || "editor-section"}>
          <h3>Contact Information</h3>
          <div className={styles.formRow || "form-row"}>
            <div className={styles.formGroup || "form-group"}>
              <label htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email"
                className={styles.formControl || "form-control"} 
                placeholder="Your email address" 
                value={personalInfo.email || ""}
                onChange={(e) => updatePersonalInfo('email', e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className={styles.formGroup || "form-group"}>
              <label htmlFor="phone">Phone Number</label>
              <input 
                type="text" 
                id="phone"
                className={styles.formControl || "form-control"} 
                placeholder="Your phone number" 
                value={personalInfo.phone || ""}
                onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className={styles.formRow || "form-row"}>
            <div className={styles.formGroup || "form-group"}>
              <label htmlFor="location">Location</label>
              <input 
                type="text" 
                id="location"
                className={styles.formControl || "form-control"} 
                placeholder="Your location (city, country)" 
                value={personalInfo.location || ""}
                onChange={(e) => updatePersonalInfo('location', e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className={styles.formGroup || "form-group"}>
              <label htmlFor="website">Website</label>
              <input 
                type="text" 
                id="website"
                className={styles.formControl || "form-control"} 
                placeholder="Your website URL" 
                value={personalInfo.website || ""}
                onChange={(e) => updatePersonalInfo('website', e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
        
        <div className={styles.editorSection || "editor-section"}>
          <h3>Social Media Links</h3>
          <div className={styles.formRow || "form-row"}>
            <div className={styles.formGroup || "form-group"}>
              <label htmlFor="linkedin">LinkedIn URL</label>
              <input 
                type="text" 
                id="linkedin"
                className={styles.formControl || "form-control"} 
                placeholder="LinkedIn profile URL" 
                value={personalInfo.socialLinks?.linkedin || ""}
                onChange={(e) => updatePersonalInfo('socialLinks.linkedin', e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className={styles.formGroup || "form-group"}>
              <label htmlFor="github">GitHub URL</label>
              <input 
                type="text" 
                id="github"
                className={styles.formControl || "form-control"} 
                placeholder="GitHub profile URL" 
                value={personalInfo.socialLinks?.github || ""}
                onChange={(e) => updatePersonalInfo('socialLinks.github', e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className={styles.formRow || "form-row"}>
            <div className={styles.formGroup || "form-group"}>
              <label htmlFor="twitter">Twitter URL</label>
              <input 
                type="text" 
                id="twitter"
                className={styles.formControl || "form-control"} 
                placeholder="Twitter profile URL" 
                value={personalInfo.socialLinks?.twitter || ""}
                onChange={(e) => updatePersonalInfo('socialLinks.twitter', e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className={styles.formGroup || "form-group"}>
              <label htmlFor="instagram">Instagram URL</label>
              <input 
                type="text" 
                id="instagram"
                className={styles.formControl || "form-control"} 
                placeholder="Instagram profile URL" 
                value={personalInfo.socialLinks?.instagram || ""}
                onChange={(e) => updatePersonalInfo('socialLinks.instagram', e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoEditor; 
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './adminLogin.module.css';
import portfolioService from '../services/portfolioService';

const AdminLogin = () => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [usernameOnly, setUsernameOnly] = useState(false);
  const [portfolioName, setPortfolioName] = useState('Portfolio Dashboard');
  
  // Load saved login ID and portfolio info if present
  useEffect(() => {
    const savedLoginId = localStorage.getItem('portfolio_remember_login');
    if (savedLoginId) {
      setLoginId(savedLoginId);
      setRememberMe(true);
    }

    // Get portfolio owner's name
    const personalInfo = portfolioService.getSectionData('personalInfo') || portfolioService.getSectionData('personal');
    if (personalInfo && personalInfo.name) {
      setPortfolioName(personalInfo.name);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Get settings with auth info from localStorage
    const settings = portfolioService.getSectionData('settings');
    
    // Check if settings has auth data
    if (!settings || !settings.auth) {
      // Default credentials for first-time setup
      if ((loginId === 'admin' || loginId === 'admin@example.com') && (usernameOnly || password === '1234')) {
        handleSuccessfulLogin('admin');
        return;
      }
      
      setErrorMessage('Invalid username/email or password');
      return;
    }
    
    const { username, email, passwordHash } = settings.auth;
    
    // Check if login matches username or email
    const isLoginMatch = loginId === username || loginId === email;
    const userToUse = username || 'admin';
    
    // If username-only login is enabled, allow login without password check
    if (usernameOnly && isLoginMatch) {
      handleSuccessfulLogin(userToUse);
      return;
    }
    
    // Simple password verification (in a real app, you would use a proper hash comparison)
    const isPasswordMatch = passwordHash ? atob(passwordHash) === password : password === '1234';
    
    if (isLoginMatch && isPasswordMatch) {
      handleSuccessfulLogin(userToUse);
    } else {
      setErrorMessage('Invalid username/email or password');
    }
  };
  
  const handleSuccessfulLogin = (username) => {
    // Save login ID if remember me is checked
    if (rememberMe) {
      localStorage.setItem('portfolio_remember_login', loginId);
    } else {
      localStorage.removeItem('portfolio_remember_login');
    }
    
    // Set auth session (in a real app, you would use proper session handling)
    sessionStorage.setItem('portfolio_auth', 'true');
    sessionStorage.setItem('portfolio_username', username);
    
    // Redirect to dashboard with username in the path
    window.location.href = `/admin/${username}/dashboard`;
  };

  return (
    <div className={styles['login-page']}>
      {/* Floating elements for decoration */}
      <div className={`${styles['floating-element']} ${styles['float-1']}`}></div>
      <div className={`${styles['floating-element']} ${styles['float-2']}`}></div>
      <div className={`${styles['floating-element']} ${styles['float-3']}`}></div>
      
      <div className={styles['login-container']}>
        <div className={styles['login-box']}>
          <div className={styles['login-header']}>
            <h1>Fahim Faysal</h1>
            <p>Sign in to manage your portfolio</p>
          </div>
          <form id="loginForm" className={styles['login-form']} onSubmit={handleSubmit}>
            <div className={styles['form-group']}>
              <label htmlFor="loginId">Username or Email</label>
              <input 
                type="text" 
                id="loginId" 
                placeholder="Enter your username or email" 
                required 
                autoComplete="off"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
              />
            </div>
            <div className={styles['form-group']}>
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                placeholder="Enter your password" 
                required={!usernameOnly}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className={styles['form-checkbox']}>
              <label>
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
            </div>
            
            <button type="submit" className={styles['login-btn']}>
              Sign In <i className="fas fa-arrow-right"></i>
            </button>
            <div id="errorMessage" className={styles['error-message']}>
              {errorMessage}
            </div>
          </form>
          <div className={styles['back-to-portfolio']}>
            <Link to="/"><i className="fas fa-arrow-left"></i> Back to Portfolio</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin; 
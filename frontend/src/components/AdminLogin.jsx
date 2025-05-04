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

  useEffect(() => {
    const savedLoginId = localStorage.getItem('portfolio_remember_login');
    if (savedLoginId) {
      setLoginId(savedLoginId);
      setRememberMe(true);
    }

    const personalInfo = portfolioService.getSectionData('personalInfo') || portfolioService.getSectionData('personal');
    if (personalInfo?.name) {
      setPortfolioName(personalInfo.name);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const settings = portfolioService.getSectionData('settings');
    
    if (!settings?.auth) {
      if ((loginId === 'admin' || loginId === 'admin@example.com') && (usernameOnly || password === '1234')) {
        handleSuccessfulLogin('admin');
        return;
      }
      setErrorMessage('Invalid username/email or password');
      return;
    }
    
    const { username, email, passwordHash } = settings.auth;
    const isLoginMatch = loginId === username || loginId === email;
    const userToUse = username || 'admin';
    
    if (usernameOnly && isLoginMatch) {
      handleSuccessfulLogin(userToUse);
      return;
    }
    
    const isPasswordMatch = passwordHash ? atob(passwordHash) === password : password === '1234';
    
    isLoginMatch && isPasswordMatch 
      ? handleSuccessfulLogin(userToUse)
      : setErrorMessage('Invalid username/email or password');
  };
  
  const handleSuccessfulLogin = (username) => {
    rememberMe
      ? localStorage.setItem('portfolio_remember_login', loginId)
      : localStorage.removeItem('portfolio_remember_login');
    
    sessionStorage.setItem('portfolio_auth', 'true');
    sessionStorage.setItem('portfolio_username', username);
    window.location.href = `/admin/${username}/dashboard`;
  };

  return (
    <div className={styles['login-page']}>
      <div className={`${styles['floating-element']} ${styles['float-1']}`}></div>
      <div className={`${styles['floating-element']} ${styles['float-2']}`}></div>
      <div className={`${styles['floating-element']} ${styles['float-3']}`}></div>
      
      <div className={styles['login-layout']}>
        

        {/* Login Container */}
        <div className={styles['login-container']}>
          <div className={styles['login-box']}>
            <div className={styles['login-header']}>
              <h1>Fahim Faysal</h1>
              <p>Sign in to manage your portfolio</p>
            </div>
            
            <form className={styles['login-form']} onSubmit={handleSubmit}>
              <div className={styles['form-group']}>
                <label htmlFor="loginId">Username or Email</label>
                <input 
                  type="text" 
                  id="loginId"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder="Enter your username or email"
                  required 
                  autoComplete="off"
                />
              </div>
              
              <div className={styles['form-group']}>
                <label htmlFor="password">Password</label>
                <input 
                  type="password" 
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required={!usernameOnly}
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
              
              {errorMessage && (
                <div className={styles['error-message']}>{errorMessage}</div>
              )}
            </form>
            
            <div className={styles['back-to-portfolio']}>
              <Link to="/">
                <i className="fas fa-arrow-left"></i> Back to Portfolio
              </Link>
            </div>
          </div>
        </div>

        {/* Ethical Warning Container */}
        <div className={styles['warning-container']}>
          <div className={styles['warning-box']}>
            <div className={styles['warning-header']}>
              <i className={`fas fa-exclamation-triangle ${styles['warning-icon']}`}></i>
              <h2>Ethical Risk Indicator</h2>
            </div>
            <div className={styles['warning-content']}>
              <p>Accessing <strong>{portfolioName}'s</strong> administrative interface:</p>
              <p>  Authorized use only. Unauthorized access may result in:</p>
              <ul className={styles['warning-list']}>
                <li>Privacy rights violation</li>
                <li>Computer security law breaches</li>
                <li>Professional misconduct</li>
              </ul>
              <p className={styles['final-warning']}>
                If not {portfolioName} or authorized administrator, 
                close this interface immediately.
              </p>
            </div>
            <div className={styles['legal-disclaimer']}>
              Proceeding acknowledges acceptance of these terms
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default AdminLogin;
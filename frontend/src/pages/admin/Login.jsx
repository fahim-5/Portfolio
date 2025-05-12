import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import portfolioService from '../../services/portfolioService';
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAdminAlert, setShowAdminAlert] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setShowAdminAlert(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await portfolioService.login(email, password);
      if (success) {
        navigate('/admin/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!recoveryEmail) {
      setError('Please enter your email address');
      return;
    }
    
    setLoading(true);
    try {
      await portfolioService.requestPasswordReset(recoveryEmail);
      setShowForgotPassword(false);
      setError('');
      alert('Password reset instructions have been sent to your email');
    } catch (err) {
      setError('Failed to send reset instructions. Please try again.');
      console.error('Password reset error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      {showAdminAlert && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Authorized Personnel Only</h3>
            <p>
              This page is restricted to portfolio administrators. 
              If you're not an administrator, please return to the portfolio.
              Unauthorized access attempts may be logged and reported.
            </p>
            
            <div className={styles.modalActions}>
              <button 
                className={styles.secondaryButton} 
                onClick={() => navigate('/')}
              >
                Back to Portfolio
              </button>
              <button 
                className={styles.primaryButton} 
                onClick={() => setShowAdminAlert(false)}
              >
                I'm an Administrator
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showForgotPassword && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Reset Password</h3>
            <p>Enter your email address to receive password reset instructions.</p>
            {error && <div className={styles.error}>{error}</div>}
            <form onSubmit={handleForgotPassword}>
              <div className={styles.formGroup}>
                <label htmlFor="recoveryEmail">Email</label>
                <input
                  type="email"
                  id="recoveryEmail"
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className={styles.loginformInput}
                />
              </div>
              <div className={styles.modalActions}>
                <button 
                  type="button" 
                  className={styles.secondaryButton} 
                  onClick={() => {
                    setShowForgotPassword(false);
                    setError('');
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={styles.primaryButton}
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Instructions'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <div className={styles.loginBox}>
        <div className={styles.profileImage}></div>
        <div className={styles.loginCard}>
          <h2 className={styles.loginTitle}>Admin Portal</h2>
          <p className={styles.loginSubtitle}>Sign in to manage your portfolio</p>
          
          {error && <div className={styles.error}>{error}</div>}
          
          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className={styles.loginformInput}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className={styles.loginformInput}
              />
              <div className={styles.forgotPasswordContainer}>
                <button 
                  type="button" 
                  className={styles.forgotPasswordLink}
                  onClick={() => setShowForgotPassword(true)}
                >
                  Forgot password?
                </button>
              </div>
            </div>
            
            <button 
              type="submit" 
              className={styles.signInButton} 
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          
          <div className={styles.loginFooter}>
            <button 
              type="button" 
              className={styles.backLink}
              onClick={() => navigate('/')}
            >
              ← Back to Portfolio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
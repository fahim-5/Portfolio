import React, { useState, useEffect } from 'react';
import portfolioService from '../services/portfolioService';

// Notification component for displaying messages
export const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;
  
  return (
    <div className={`notification ${type}`}>
      <div className="notificationContent">
        <span className="notificationIcon">
          {type === 'success' && '✅'}
          {type === 'error' && '❌'}
          {type === 'warning' && '⚠️'}
          {type === 'info' && 'ℹ️'}
        </span>
        <p>{message}</p>
      </div>
      <button 
        className="notificationClose" 
        onClick={onClose}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

// Data recovery notice component
export const DataRecoveryNotice = ({ onRestore, onDismiss }) => {
  return (
    <div className="dataRecoveryNotice">
      <div className="noticeIcon">⚠️</div>
      <div className="noticeContent">
        <h4>Data Recovery Available</h4>
        <p>We found backed up data that might be more recent than what's currently displayed.</p>
      </div>
      <div className="noticeActions">
        <button 
          className="restoreButton" 
          onClick={onRestore}
        >
          Restore Data
        </button>
        <button 
          className="dismissButton" 
          onClick={onDismiss}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

const DataRecovery = () => {
  const [showRecovery, setShowRecovery] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // idle, success, error, loading
  const [backupData, setBackupData] = useState(null);
  const [backupFound, setBackupFound] = useState(false);
  const [heroImageIssue, setHeroImageIssue] = useState(false);

  // Check for backup data and hero image issues on mount
  useEffect(() => {
    try {
      // Check for backup data
      const backupStr = localStorage.getItem('portfolio_complete_backup');
      if (backupStr) {
        const backup = JSON.parse(backupStr);
        if (backup && backup.data && backup.timestamp) {
          setBackupData(backup);
          setBackupFound(true);
        }
      }
      
      // Check for hero image issues
      const personalInfo = portfolioService.getSectionData('personalInfo');
      if (personalInfo) {
        // If hero is missing or hero.profileImageUrl is undefined (but should have a value)
        if (!personalInfo.hero || (personalInfo.aboutImageUrl && !personalInfo.hero?.profileImageUrl)) {
          setHeroImageIssue(true);
        }
      }
    } catch (error) {
      console.error('Error checking for issues:', error);
    }
  }, []);

  // Function to trigger a backup
  const createBackup = () => {
    setStatus('loading');
    setMessage('Creating backup...');
    
    try {
      if (typeof window.backupPortfolioData === 'function') {
        window.backupPortfolioData();
        setStatus('success');
        setMessage('Backup created successfully!');
        
        // Refresh backup data
        const backupStr = localStorage.getItem('portfolio_complete_backup');
        if (backupStr) {
          const backup = JSON.parse(backupStr);
          if (backup && backup.data && backup.timestamp) {
            setBackupData(backup);
            setBackupFound(true);
          }
        }
      } else {
        throw new Error('Backup function not available');
      }
    } catch (error) {
      console.error('Error creating backup:', error);
      setStatus('error');
      setMessage('Error creating backup: ' + error.message);
    }
    
    // Reset status after 3 seconds
    setTimeout(() => {
      setStatus('idle');
      setMessage('');
    }, 3000);
  };

  // Function to restore from backup
  const restoreFromBackup = () => {
    if (!backupFound) {
      setStatus('error');
      setMessage('No backup found to restore from');
      return;
    }
    
    setStatus('loading');
    setMessage('Restoring from backup...');
    
    try {
      if (typeof window.restoreFromBackup === 'function') {
        const success = window.restoreFromBackup();
        if (success) {
          setStatus('success');
          setMessage('Data restored successfully! Reloading page...');
          
          // Force reload the page after 1.5 seconds to apply restored data
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          throw new Error('Restore operation failed');
        }
      } else {
        throw new Error('Restore function not available');
      }
    } catch (error) {
      console.error('Error restoring from backup:', error);
      setStatus('error');
      setMessage('Error restoring data: ' + error.message);
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    }
  };

  // Function to force re-initialization of storage
  const forceReInitialize = () => {
    setStatus('loading');
    setMessage('Re-initializing storage...');
    
    try {
      // Reset everything first
      portfolioService.resetToDefault();
      
      // Then re-initialize
      portfolioService.initializeStorage();
      
      setStatus('success');
      setMessage('Storage re-initialized successfully! Reloading page...');
      
      // Force reload the page after 1.5 seconds
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error re-initializing storage:', error);
      setStatus('error');
      setMessage('Error re-initializing storage: ' + error.message);
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    }
  };
  
  // Function to fix hero image issues
  const fixHeroImageIssues = () => {
    setStatus('loading');
    setMessage('Fixing hero image data...');
    
    try {
      // Log current state
      portfolioService.debugPortfolioData();
      
      // Get personal info
      const personalInfo = portfolioService.getSectionData('personalInfo');
      if (!personalInfo) {
        throw new Error('Personal info not found');
      }
      
      // Fix the hero object if it's missing
      const success = portfolioService.fixHeroImageData(personalInfo.aboutImageUrl || null);
      
      if (success) {
        setStatus('success');
        setMessage('Hero image fixed successfully! Reloading page...');
        setHeroImageIssue(false);
        
        // Force reload the page after 1.5 seconds
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        throw new Error('Fix operation failed');
      }
    } catch (error) {
      console.error('Error fixing hero image issues:', error);
      setStatus('error');
      setMessage('Error fixing hero image: ' + error.message);
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    }
  };

  if (!showRecovery) {
    return (
      <div 
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
          background: '#1e1e2d',
          boxShadow: '0 0 15px rgba(0, 0, 0, 0.3)',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          border: '2px solid #00bcd4'
        }}
        onClick={() => setShowRecovery(true)}
        title="Data Recovery Options"
      >
        <span style={{ fontSize: '24px' }}>🛟</span>
      </div>
    );
  }

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        background: '#1e1e2d',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
        borderRadius: '8px',
        padding: '16px',
        width: '300px',
        fontFamily: 'Arial, sans-serif',
        color: '#ffffff',
        border: '1px solid #00bcd4'
      }}
    >
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '15px',
        borderBottom: '1px solid #2e2e42',
        paddingBottom: '10px'
      }}>
        <h3 style={{ 
          margin: 0, 
          fontSize: '18px', 
          color: '#00bcd4', 
          fontWeight: '600' 
        }}>
          Data Recovery
        </h3>
        <button 
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer',
            color: '#888899'
          }}
          onClick={() => setShowRecovery(false)}
        >
          ✖
        </button>
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <button 
          style={{
            background: '#00bcd4',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            padding: '10px 12px',
            width: '100%',
            cursor: 'pointer',
            marginBottom: '10px',
            fontWeight: '500',
            fontSize: '14px',
            transition: 'background 0.2s',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
            opacity: status === 'loading' ? '0.7' : '1'
          }}
          onClick={createBackup}
          disabled={status === 'loading'}
        >
          Create Data Backup
        </button>
        
        <button 
          style={{
            background: backupFound ? '#7986cb' : '#2e2e42',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            padding: '10px 12px',
            width: '100%',
            cursor: backupFound ? 'pointer' : 'not-allowed',
            marginBottom: '10px',
            fontWeight: '500',
            fontSize: '14px',
            transition: 'background 0.2s',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
            opacity: (!backupFound || status === 'loading') ? '0.7' : '1'
          }}
          onClick={restoreFromBackup}
          disabled={!backupFound || status === 'loading'}
        >
          Restore from Backup
        </button>
        
        {/* Hero image fix button */}
        {heroImageIssue && (
          <button 
            style={{
              background: '#4caf50',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              padding: '10px 12px',
              width: '100%',
              cursor: 'pointer',
              marginBottom: '10px',
              fontWeight: '500',
              fontSize: '14px',
              transition: 'background 0.2s',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
              opacity: status === 'loading' ? '0.7' : '1'
            }}
            onClick={fixHeroImageIssues}
            disabled={status === 'loading'}
          >
            Fix Hero Image Issues
          </button>
        )}
        
        <button 
          style={{
            background: '#e57373',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            padding: '10px 12px',
            width: '100%',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '14px',
            transition: 'background 0.2s',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
            opacity: status === 'loading' ? '0.7' : '1'
          }}
          onClick={forceReInitialize}
          disabled={status === 'loading'}
        >
          Reset to Defaults
        </button>
      </div>
      
      {message && (
        <div style={{ 
          padding: '10px', 
          marginTop: '10px',
          textAlign: 'center',
          background: status === 'success' ? 'rgba(0, 150, 136, 0.2)' : 
                       status === 'error' ? 'rgba(229, 115, 115, 0.2)' : 
                       'rgba(0, 188, 212, 0.2)',
          color: status === 'success' ? '#4caf50' : 
                 status === 'error' ? '#e57373' : 
                 '#00bcd4',
          borderRadius: '4px',
          fontSize: '14px',
          border: status === 'success' ? '1px solid #4caf5080' :
                  status === 'error' ? '1px solid #e5737380' :
                  '1px solid #00bcd480'
        }}>
          {message}
        </div>
      )}
      
      {backupFound && backupData && (
        <div style={{ 
          fontSize: '12px', 
          marginTop: '15px', 
          color: '#888899',
          borderTop: '1px solid #2e2e42',
          paddingTop: '12px'
        }}>
          <p style={{ margin: '0 0 4px 0' }}>
            Last backup: <span style={{ color: '#00bcd4' }}>{new Date(backupData.timestamp).toLocaleString()}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default DataRecovery; 
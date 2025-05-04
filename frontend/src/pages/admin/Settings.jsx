import React from 'react';
import './adminDashboard.css';

const Settings = () => {
  return (
    <div className="content-section">
      <div className="section-header">
        <h2>Settings</h2>
      </div>
      <div className="section-content">
        <div className="settings-panel">
          <div className="settings-group">
            <h3>Account Settings</h3>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" className="form-control" placeholder="Your email address" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" className="form-control" placeholder="Current password" />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input type="password" id="newPassword" className="form-control" placeholder="New password" />
            </div>
            <button className="btn-primary">Update Account</button>
          </div>
          
          <div className="settings-group">
            <h3>Portfolio Settings</h3>
            <div className="form-group">
              <label htmlFor="portfolioUrl">Portfolio URL</label>
              <input type="text" id="portfolioUrl" className="form-control" placeholder="Your portfolio URL" />
            </div>
            <div className="form-group">
              <label>Portfolio Visibility</label>
              <div className="toggle-switch">
                <input type="checkbox" id="portfolioVisibility" />
                <label htmlFor="portfolioVisibility"></label>
                <span>Public</span>
              </div>
            </div>
            <button className="btn-primary">Save Settings</button>
          </div>
          
          <div className="settings-group">
            <h3>Data Management</h3>
            <div className="action-buttons settings-actions">
              <button className="btn-secondary">Export Data</button>
              <button className="btn-secondary">Backup Data</button>
              <button className="btn-danger">Delete Account</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

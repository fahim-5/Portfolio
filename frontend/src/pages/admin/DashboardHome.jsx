import React from 'react';
import './adminDashboard.css';

const DashboardHome = ({ 
  portfolioData, 
  recentActivity,
  formatRelativeDate,
  changeSection
}) => {
  return (
    <div id="dashboardHome" className="content-section">
      <div className="welcome-stats">
        <div className="welcome-message">
          <h1>Welcome back, Fahim!</h1>
          <p>Here's a summary of your portfolio stats</p>
        </div>
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-briefcase"></i>
            </div>
            <div className="stat-info">
              <h3>{portfolioData.projectsCount || 3}</h3>
              <p>Projects</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-graduation-cap"></i>
            </div>
            <div className="stat-info">
              <h3>{portfolioData.educationCount || 3}</h3>
              <p>Education</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-laptop-code"></i>
            </div>
            <div className="stat-info">
              <h3>{portfolioData.skillsCount || 18}</h3>
              <p>Skills</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-eye"></i>
            </div>
            <div className="stat-info">
              <h3>{portfolioData.portfolioViews || 384}</h3>
              <p>Portfolio Views</p>
            </div>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button className="action-btn" onClick={() => changeSection('projects')}>
            <i className="fas fa-plus"></i> Add Project
          </button>
          <button className="action-btn" onClick={() => changeSection('skills')}>
            <i className="fas fa-plus"></i> Add Skill
          </button>
          <button className="action-btn" onClick={() => changeSection('education')}>
            <i className="fas fa-plus"></i> Add Education
          </button>
          <button className="action-btn" onClick={() => changeSection('pictures')}>
            <i className="fas fa-plus"></i> Upload Image
          </button>
        </div>
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-timeline">
          {recentActivity.length > 0 ? (
            recentActivity.slice(0, 3).map((activity, index) => (
              <div className="activity-item" key={index}>
                <div className="activity-icon">
                  {activity.type === 'edit' && <i className="fas fa-edit"></i>}
                  {activity.type === 'add' && <i className="fas fa-plus"></i>}
                  {activity.type === 'delete' && <i className="fas fa-trash"></i>}
                </div>
                <div className="activity-details">
                  <p>You updated your Personal Information</p>
                  <span className="activity-time">{formatRelativeDate(activity.timestamp)}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-activity">
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome; 
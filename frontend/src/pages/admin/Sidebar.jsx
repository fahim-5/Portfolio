import React from 'react';
import { Link } from 'react-router-dom';
import './adminDashboard.css';

const Sidebar = ({ 
  sidebarCollapsed,
  activeSection, 
  changeSection, 
  portfolioData
}) => {
  const sections = [
    { id: 'dashboard', name: 'Dashboard', icon: <i className="fas fa-tachometer-alt"></i> },
    { id: 'personalInfo', name: 'Personal Info', icon: <i className="fas fa-user"></i> },
    { id: 'education', name: 'Education', icon: <i className="fas fa-graduation-cap"></i> },
    { id: 'experience', name: 'Experience', icon: <i className="fas fa-briefcase"></i> },
    { id: 'skills', name: 'Skills', icon: <i className="fas fa-laptop-code"></i> },
    { id: 'highlights', name: 'Highlights', icon: <i className="fas fa-star"></i> },
    { id: 'projects', name: 'Projects', icon: <i className="fas fa-code"></i> },
    { id: 'pictures', name: 'Pictures', icon: <i className="fas fa-images"></i> },
    { id: 'references', name: 'References', icon: <i className="fas fa-users"></i> },
    { id: 'settings', name: 'Settings', icon: <i className="fas fa-cog"></i> }
  ];
  
  return (
    <div className={`sidebar ${sidebarCollapsed ? 'sidebarCollapsed' : ''}`}>
      <div className="userInfo">
        <div className="userAvatar">
          <img src="/portfolio-avatar.jpg" alt="Profile" onError={(e) => {
            e.target.onerror = null;
            e.target.style.display = 'none';
            e.target.parentNode.innerText = portfolioData?.name?.charAt(0) || 'F';
          }} />
        </div>
        {!sidebarCollapsed && (
          <div className="userDetails">
            <h4>Fahim Faysal</h4>
            <p>Web Developer</p>
          </div>
        )}
      </div>
      
      <nav className="sidebarNav">
        <ul>
          {sections.map(section => (
            <li key={section.id}>
              <button
                className={`sidebarLink ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => changeSection(section.id)}
              >
                <span className="sidebarIcon">{section.icon}</span>
                {!sidebarCollapsed && <span className="sidebarText">{section.name}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="sidebarFooter">
        <Link to="/" className="viewSiteLink">
          <span className="sidebarIcon"><i className="fas fa-eye"></i></span>
          {!sidebarCollapsed && <span className="sidebarText">View Portfolio</span>}
        </Link>
        
        <button className="logoutBtn">
          <span className="sidebarIcon"><i className="fas fa-sign-out-alt"></i></span>
          {!sidebarCollapsed && <span className="sidebarText">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 
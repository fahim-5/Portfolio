import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './adminDashboard.css';

const DashboardHeader = ({ toggleSidebar, changeSection }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // For now, just navigate to the home page
    window.location.href = '/';
  };

  return (
    <div className="dashboardHeader">
      <div className="headerLeft">
        <button className="sidebarToggle" onClick={toggleSidebar}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className="dashboardTitle">
          <i className="fas fa-tachometer-alt"></i>
          <span>Portfolio Dashboard</span>
        </div>
      </div>

      <div className="headerRight">
        <div className="searchContainer">
          <input 
            type="text" 
            className="searchInput" 
            placeholder="Search..." 
          />
          <button className="searchButton">
            <i className="fas fa-search"></i>
          </button>
        </div>

        <div className="userDropdown" ref={dropdownRef}>
          <button className="userDropdownToggle" onClick={toggleDropdown}>
            <span>Fahim Faysal</span>
            <i className={`fas fa-chevron-${dropdownOpen ? 'up' : 'down'}`}></i>
          </button>
          
          {dropdownOpen && (
            <div className="dropdownMenu">
              <div className="dropdownHeader">
                <h3>Fahim Faysal</h3>
                <p>Web Developer</p>
              </div>
              <ul className="dropdownItems">
                <li>
                  <button 
                    className="dropdownItem"
                    onClick={() => {
                      changeSection('personalInfo');
                      setDropdownOpen(false);
                    }}
                  >
                    <i className="fas fa-user"></i>
                    <span>Profile</span>
                  </button>
                </li>
                <li>
                  <button 
                    className="dropdownItem" 
                    onClick={() => {
                      changeSection('settings');
                      setDropdownOpen(false);
                    }}
                  >
                    <i className="fas fa-cog"></i>
                    <span>Settings</span>
                  </button>
                </li>
                <li>
                  <button className="dropdownItem dropdownLogout" onClick={() => window.location.href = '/admin/login'}>
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader; 
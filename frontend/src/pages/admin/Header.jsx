import React from 'react';
import './adminDashboard.css';

const Header = ({ 
  toggleSidebar, 
  portfolioData,
  searchQuery,
  handleSearch,
  showSearchResults,
  searchResults,
  setShowSearchResults,
  changeSection,
  setSearchQuery,
  userDropdownOpen,
  toggleUserDropdown,
  handleLogout
}) => {
  return (
    <header className="dashboardHeader">
      <div className="headerLeft">
        <button 
          className="sidebarToggle" 
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <h1 className="dashboardTitle">
          <i className="fas fa-bars"></i> Fahim Faysal's Portfolio Dashboard
        </h1>
      </div>
      
      <div className="headerRight">
        <div className="searchContainer">
          <input
            type="text"
            placeholder="Search..."
            className="searchInput"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
          />
          <button 
            className="searchButton" 
            onClick={() => handleSearch(searchQuery)}
            aria-label="Search"
          >
            <i className="fas fa-search"></i>
          </button>
          
          {showSearchResults && searchResults.length > 0 && (
            <div className="searchResults">
              <h4>Search Results</h4>
              <ul>
                {searchResults.map((result, index) => (
                  <li key={index} className="searchResultItem">
                    <span className="resultType">{result.type}</span>
                    <span className="resultName">{result.title}</span>
                    <button 
                      className="viewButton"
                      onClick={() => {
                        if (result.section) {
                          changeSection(result.section);
                          setShowSearchResults(false);
                        }
                      }}
                    >
                      View
                    </button>
                  </li>
                ))}
              </ul>
              <button 
                className="closeResults"
                onClick={() => setShowSearchResults(false)}
              >
                Close
              </button>
            </div>
          )}
        </div>
        
        <div className="userProfile">
          <button 
            className="userProfileButton" 
            onClick={toggleUserDropdown}
          >
            <span className="userName">Fahim Faysal</span>
            <span className="dropdownArrow">▼</span>
          </button>
          
          {userDropdownOpen && (
            <div className="userDropdown">
              <ul>
                <li>
                  <button 
                    className="dropdownItem"
                    onClick={() => changeSection('personalInfo')}
                  >
                    <i className="fas fa-user"></i> Profile
                  </button>
                </li>
                <li>
                  <button 
                    className="dropdownItem"
                    onClick={() => changeSection('settings')}
                  >
                    <i className="fas fa-cog"></i> Settings
                  </button>
                </li>
                <li>
                  <button 
                    className="dropdownItem" 
                    onClick={handleLogout}
                  >
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 
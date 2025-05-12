import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import styles from "./AdminNavbar.module.css";
import axios from "axios";
import {
  FaBars,
  FaTimes,
  FaSearch,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaTachometerAlt,
  FaPortrait,
  FaGraduationCap,
  FaBriefcase,
  FaTools,
  FaProjectDiagram,
  FaImages,
  FaComments,
  FaArrowLeft,
} from "react-icons/fa";

// Define sections array outside the component to avoid recreating it on each render
const searchableSections = [
  {
    id: "dashboard",
    title: "Dashboard",
    path: "/admin/dashboard",
    keywords: ["dashboard", "home", "main", "overview"],
  },
  {
    id: "hero",
    title: "Hero Section",
    path: "/admin/hero",
    keywords: ["hero", "about", "intro", "introduction", "profile"],
  },
  {
    id: "education",
    title: "Education Section",
    path: "/admin/education",
    keywords: [
      "education",
      "school",
      "college",
      "university",
      "degree",
      "academic",
    ],
  },
  {
    id: "experience",
    title: "Experience Section",
    path: "/admin/experience",
    keywords: ["experience", "work", "job", "career", "employment"],
  },
  {
    id: "skills",
    title: "Skills Section",
    path: "/admin/skills",
    keywords: ["skills", "abilities", "expertise", "technologies", "tools"],
  },
  {
    id: "projects",
    title: "Projects Section",
    path: "/admin/projects",
    keywords: ["projects", "portfolio", "works", "creations"],
  },
  {
    id: "pictures",
    title: "Pictures Gallery",
    path: "/admin/pictures",
    keywords: ["pictures", "gallery", "images", "photos"],
  },
  {
    id: "references",
    title: "References Section",
    path: "/admin/references",
    keywords: ["references", "testimonials", "recommendations"],
  },
  {
    id: "settings",
    title: "Account Settings",
    path: "/admin/settings",
    keywords: ["settings", "account", "profile", "configuration"],
  },
];

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Use consistent API URL
  const API_URL = "http://localhost:5000/api";

  // Focus search box when pressing / key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "/" && document.activeElement.tagName !== "INPUT") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }

      // Close search results on escape key
      if (e.key === "Escape" && showSearchResults) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showSearchResults]);

  useEffect(() => {
    // Fetch user data from database
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // Get token from localStorage
        const token = localStorage.getItem("authToken");

        if (token) {
          try {
            // Fetch user data from API
            const response = await axios.get(`${API_URL}/user/profile`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            console.log("Profile API response:", response.data);

            if (response.data && response.data.success) {
              setUser(response.data.user);
              // Also update localStorage for compatibility with other components
              localStorage.setItem("user", JSON.stringify(response.data.user));
            } else {
              console.error("Failed to load user data:", response.data);
              // Fall back to localStorage if API fails
              const userData = localStorage.getItem("user");
              if (userData) {
                setUser(JSON.parse(userData));
              } else {
                // Set default user data if no data available
                setUser({ name: "Guest Admin", email: "admin@example.com" });
              }
            }
          } catch (apiError) {
            console.error("API error in fetchUserData:", apiError);
            // Fall back to localStorage on API error
            const userData = localStorage.getItem("user");
            if (userData) {
              setUser(JSON.parse(userData));
            } else {
              // Set default user data if no data available
              setUser({ name: "Guest Admin", email: "admin@example.com" });
            }
          }
        } else {
          // Important: Don't redirect here, as it prevents login page from working
          console.log("No authentication token found");
          // Set a default user data for demo purposes
          setUser({ name: "Guest Admin", email: "admin@example.com" });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Set default user data on error
        setUser({ name: "Guest Admin", email: "admin@example.com" });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [API_URL]);

  // Close the profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const profileSection = document.querySelector(
        `.${styles.profileSection}`
      );
      if (profileSection && !profileSection.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const searchContainer = document.querySelector(
        `.${styles.searchContainer}`
      );
      if (searchContainer && !searchContainer.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Search as you type effect
  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch(searchQuery);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchQuery]);

  const handleLogout = () => {
    // Clear authentication data - using the correct key "authToken"
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    // Redirect to login page
    navigate("/");
  };

  const handleLogoutPanel = () => {
    // Clear authentication data - using the correct key "authToken"
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    // Redirect to login page
    navigate("/admin/login");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Separate search logic for reuse
  const performSearch = (query) => {
    if (!query.trim()) return;

    const searchTerms = query
      .toLowerCase()
      .split(/\s+/)
      .filter((term) => term.length > 0);

    try {
      // Search through sections and their keywords
      const results = searchableSections.filter((section) => {
        // Check if search terms are in the title
        const titleMatch = searchTerms.some((term) =>
          section.title.toLowerCase().includes(term)
        );

        // Check if search terms are in keywords
        const keywordMatch = searchTerms.some((term) =>
          section.keywords.some((keyword) => keyword.includes(term))
        );

        return titleMatch || keywordMatch;
      });

      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    console.log("Searching for:", searchQuery);

    // If we already have results and one matches exactly, navigate to it
    const exactMatch = searchResults.find(
      (result) => result.title.toLowerCase() === searchQuery.toLowerCase()
    );

    if (exactMatch) {
      navigate(exactMatch.path);
      setShowSearchResults(false);
      setSearchQuery("");
      return;
    }

    // If we only have one result, navigate to it
    if (searchResults.length === 1) {
      navigate(searchResults[0].path);
      setShowSearchResults(false);
      setSearchQuery("");
      return;
    }

    // If we have search results but no exact match, keep showing them
    if (searchResults.length > 0) {
      return;
    }

    // Fallback: Try a full search again just to be sure
    performSearch(searchQuery);
  };

  const handleSearchItemClick = (path) => {
    navigate(path);
    setShowSearchResults(false);
    setSearchQuery("");
  };

  const navItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { path: "/admin/hero", label: "Hero", icon: <FaPortrait /> },
    { path: "/admin/education", label: "Education", icon: <FaGraduationCap /> },
    { path: "/admin/experience", label: "Experience", icon: <FaBriefcase /> },
    { path: "/admin/skills", label: "Skills", icon: <FaTools /> },
    { path: "/admin/projects", label: "Projects", icon: <FaProjectDiagram /> },
    { path: "/admin/pictures", label: "Pictures", icon: <FaImages /> },
    { path: "/admin/references", label: "References", icon: <FaComments /> },
    { path: "/admin/settings", label: "Settings", icon: <FaCog /> },
  ];

  return (
    <div className={styles.adminLayout}>
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.leftSection}>
            <button className={styles.menuToggle} onClick={toggleSidebar}>
              {sidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
            <div className={styles.logo}>
              <h1>{loading ? "Portfolio Admin" : `${user?.name}`}</h1>
            </div>
          </div>

          <div className={styles.searchContainer}>
            <form onSubmit={handleSearch} className={styles.searchForm}>
              <div className={styles.searchInputWrapper}>
                <FaSearch className={styles.searchIcon} />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search sections"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (searchQuery.trim()) {
                      setShowSearchResults(true);
                    }
                  }}
                  className={styles.searchInput}
                />
                <button type="submit" className={styles.searchButton}>
                  Search
                </button>
              </div>
              {showSearchResults && (
                <div className={styles.searchResults}>
                  {searchResults.length > 0 ? (
                    searchResults.map((result) => (
                      <div
                        key={result.id}
                        className={styles.searchResultItem}
                        onClick={() => handleSearchItemClick(result.path)}
                      >
                        <span className={styles.searchResultIcon}>
                          <FaSearch />
                        </span>
                        <span className={styles.searchResultText}>
                          {result.title}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className={styles.noResults}>
                      No results found for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>

          <div className={styles.profileSection}>
            <button
              className={styles.profileButton}
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <span className={styles.username}>
                {loading ? "Loading..." : user?.name || "Admin"}
              </span>
            </button>

            {profileOpen && (
              <div className={styles.profileDropdown}>
                <div className={styles.profileHeader}>
                  <span className={styles.profileName}>
                    {loading ? "Loading..." : user?.name || "Admin"}
                  </span>
                  <span className={styles.profileEmail}>
                    {loading
                      ? "Loading..."
                      : user?.email || "admin@example.com"}
                  </span>
                </div>
                <ul className={styles.profileMenu}>
                  <li>
                    <Link
                      to="/admin/settings"
                      onClick={() => setProfileOpen(false)}
                    >
                      <FaCog /> Settings
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleLogout}>
                      <FaSignOutAlt /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>

      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ""}`}>
        <nav className={styles.sidebarNav}>
          <ul className={styles.sidebarNavList}>
            {navItems.map((item) => (
              <li key={item.path} className={styles.sidebarNavItem}>
                {item.external ? (
                  <a
                    href={item.path}
                    className={`${styles.sidebarNavLink} ${
                      item.label === "Logout" ? styles.logoutLink : ""
                    }`}
                  >
                    <span className={styles.navIcon}>{item.icon}</span>
                    <span>{item.label}</span>
                  </a>
                ) : (
                  <Link
                    to={item.path}
                    className={`${styles.sidebarNavLink} ${
                      location.pathname === item.path ? styles.active : ""
                    }`}
                  >
                    <span className={styles.navIcon}>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                )}
              </li>
            ))}
            <li className={styles.sidebarNavItem}>
              <button
                onClick={handleLogout}
                className={`${styles.sidebarNavLink} ${styles.backToPortfolioBtn}`}
              >
                <span className={styles.navIcon}>
                  <FaArrowLeft />
                </span>
                <span>Back to Portfolio</span>
              </button>
            </li>
            <li className={styles.sidebarNavItem}>
              <button
                onClick={handleLogoutPanel}
                className={`${styles.sidebarNavLink} ${styles.logoutBtn}`}
              >
                <span className={styles.navIcon}>
                  <FaSignOutAlt />
                </span>
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <main
        className={`${styles.mainContent} ${
          sidebarOpen ? styles.sidebarOpen : ""
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default AdminNavbar;

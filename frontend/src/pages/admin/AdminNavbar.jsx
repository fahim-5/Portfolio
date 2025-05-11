import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import styles from "./AdminNavbar.module.css";
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

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

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

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to login page
    navigate("/");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search functionality here
    console.log("Searching for:", searchQuery);
    // Reset search after searching
    setSearchQuery("");
  };

  const navItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { path: "/admin/hero", label: "Hero & About", icon: <FaPortrait /> },
    { path: "/admin/education", label: "Education", icon: <FaGraduationCap /> },
    { path: "/admin/experience", label: "Experience", icon: <FaBriefcase /> },
    { path: "/admin/skills", label: "Skills", icon: <FaTools /> },
    { path: "/admin/projects", label: "Projects", icon: <FaProjectDiagram /> },
    { path: "/admin/pictures", label: "Pictures", icon: <FaImages /> },
    { path: "/admin/references", label: "References", icon: <FaComments /> },
    { path: "/admin/settings", label: "Settings", icon: <FaCog /> },
    {
      path: "/",
      label: "Back to Portfolio",
      icon: <FaArrowLeft />,
      external: true,
    },
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
              <h1>Portfolio Admin</h1>
            </div>
          </div>

          <div className={styles.searchContainer}>
            <form onSubmit={handleSearch}>
              <div className={styles.searchInputWrapper}>
                <FaSearch className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
                <button type="submit" className={styles.searchButton}>
                  Search
                </button>
              </div>
            </form>
          </div>

          <div className={styles.profileSection}>
            <button
              className={styles.profileButton}
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <div className={styles.profileAvatar}>
                <FaUser />
              </div>
              <span className={styles.username}>{user?.name || "Admin"}</span>
            </button>

            {profileOpen && (
              <div className={styles.profileDropdown}>
                <div className={styles.profileHeader}>
                  <div className={styles.profileAvatarLarge}>
                    <FaUser />
                  </div>
                  <span className={styles.profileName}>
                    {user?.name || "Admin"}
                  </span>
                  <span className={styles.profileEmail}>
                    {user?.email || "admin@example.com"}
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
        <div className={styles.sidebarHeader}>
          <span>MAIN NAVIGATION</span>
        </div>
        <nav className={styles.sidebarNav}>
          <ul className={styles.sidebarNavList}>
            {navItems.map((item, index) => (
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
                className={`${styles.sidebarNavLink} ${styles.logoutLink}`}
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

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./AdminNavbar.module.css";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "education", label: "Education" },
    { id: "experience", label: "Experience" },
    { id: "skills", label: "Skills" },
    { id: "portfolio", label: "Portfolio" },
    { id: "references", label: "References" },
  ];

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to login page
    navigate("/");
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <h1>Fahim Faysal</h1>
        </div>
        <nav>
          <ul className={styles.navList}>
            {navItems.map((item) => (
              <li key={item.id} className={styles.navItem}>
                <a
                  href={`#${item.id}`}
                  className={styles.navLink}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(item.id)?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}

            <li className={styles.navItem}>
              <Link to="/admin/hero" className={styles.navLink}>
                Hero-secion
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/admin/settings" className={styles.navLink}>
                Settings
              </Link>
            </li>
            <li className={styles.navItem}>
              <button
                onClick={handleLogout}
                className={`${styles.navLink} ${styles.logoutBtn}`}
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default AdminNavbar;

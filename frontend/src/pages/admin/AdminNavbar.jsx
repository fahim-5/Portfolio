import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./AdminNavbar.module.css";

const AdminNavbar = () => {
  const navigate = useNavigate();

  
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
              <Link to="/admin/settings" className={styles.navLink}>
                Education
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

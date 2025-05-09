import React, { useState, useEffect } from "react";
import AdminNavbar from "./AdminNavbar";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      <AdminNavbar />
      <main className={styles.dashboardContent}>
        <div className={styles.welcomeSection}>
          <h1>Welcome to Admin Dashboard</h1>
          {user && <p>Hello, {user.name || "Admin"}</p>}
          <p className={styles.instructions}>
            Use the navigation menu to manage your portfolio content. For
            account settings, click on the "Settings" link.
          </p>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3>Portfolio Sections</h3>
            <p className={styles.statValue}>7</p>
          </div>
          <div className={styles.statCard}>
            <h3>Projects</h3>
            <p className={styles.statValue}>12</p>
          </div>
          <div className={styles.statCard}>
            <h3>Skills</h3>
            <p className={styles.statValue}>24</p>
          </div>
          <div className={styles.statCard}>
            <h3>Last Login</h3>
            <p className={styles.statValue}>
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

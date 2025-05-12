import React, { useState } from "react";
import styles from "./Dashboard.module.css";
import { FaChartBar, FaCode, FaUserCircle } from "react-icons/fa";

const Dashboard = () => {
  const [user] = useState({ name: "Admin" }); // Example user data

  return (
    <div className={styles.dashboard}>
      <div className={styles.welcomeCard}>
        <h1>Welcome to Admin Dashboard</h1>
        <p className={styles.greeting}>Hello, {user.name}</p>
        
        <div className={styles.instructions}>
          <h2>Getting Started</h2>
          <ul>
            <li>Use the sidebar to navigate between different sections</li>
            <li>All changes are saved automatically to the database</li>
            <li>Manage your portfolio content easily with the editor</li>
            <li>Preview changes before publishing</li>
          </ul>

          <h3>Quick Tips</h3>
          <ul>
            <li>Keep project descriptions concise but informative</li>
            <li>Update skills regularly to reflect your current expertise</li>
            <li>Use high-quality images for better presentation</li>
            <li>Regularly check your profile information for accuracy</li>
          </ul>
        </div>
      </div>

      <div className={styles.quickAccess}>
        <h2>Quick Actions</h2>
        <div className={styles.quickGrid}>
          <a href="/admin/projects" className={styles.quickCard}>
            <FaCode className={styles.icon} />
            <span>Manage Projects</span>
            <p>Add, edit or remove your portfolio projects</p>
          </a>
          <a href="/admin/skills" className={styles.quickCard}>
            <FaChartBar className={styles.icon} />
            <span>Update Skills</span>
            <p>Modify your technical and soft skills</p>
          </a>
          <a href="/admin/hero" className={styles.quickCard}>
            <FaUserCircle className={styles.icon} />
            <span>Edit Profile</span>
            <p>Update your personal information</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";
import { 
  FaChartBar, 
  FaFolder, 
  FaCode, 
  FaCalendarCheck,
  FaUserCircle,
  FaBell
} from "react-icons/fa";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Welcome to your new dashboard!",
      time: "Just now"
    },
    {
      id: 2,
      message: "You have 3 new messages",
      time: "2 hours ago"
    }
  ]);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div className={styles.dashboardContent}>
      <div className={styles.topSection}>
        <div className={styles.welcomeSection}>
          <h1>Welcome to Admin Dashboard</h1>
          {user && <p>Hello, {user.name || "Admin"}</p>}
          <p className={styles.instructions}>
            Use the sidebar menu to manage your portfolio content.
          </p>
        </div>

        <div className={styles.notificationSection}>
          <div className={styles.notificationHeader}>
            <FaBell className={styles.notificationIcon} />
            <h3>Notifications</h3>
          </div>
          <div className={styles.notificationList}>
            {notifications.map(notification => (
              <div key={notification.id} className={styles.notificationItem}>
                <p>{notification.message}</p>
                <span className={styles.notificationTime}>{notification.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIconWrapper}>
            <FaFolder className={styles.statIcon} />
          </div>
          <div className={styles.statInfo}>
            <h3>Portfolio Sections</h3>
            <p className={styles.statValue}>7</p>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: '70%', background: 'linear-gradient(90deg, #4a6bff, #7c3aed)' }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIconWrapper}>
            <FaCode className={styles.statIcon} />
          </div>
          <div className={styles.statInfo}>
            <h3>Projects</h3>
            <p className={styles.statValue}>12</p>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: '60%', background: 'linear-gradient(90deg, #41d7a7, #2ecc71)' }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIconWrapper}>
            <FaChartBar className={styles.statIcon} />
          </div>
          <div className={styles.statInfo}>
            <h3>Skills</h3>
            <p className={styles.statValue}>24</p>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: '80%', background: 'linear-gradient(90deg, #ff9f43, #ff6b6b)' }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIconWrapper}>
            <FaCalendarCheck className={styles.statIcon} />
          </div>
          <div className={styles.statInfo}>
            <h3>Last Login</h3>
            <p className={styles.statValue}>
              {new Date().toLocaleDateString()}
            </p>
            <p className={styles.statSubtext}>
              {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.quickAccess}>
        <h2>Quick Access</h2>
        <div className={styles.quickAccessGrid}>
          <a href="/admin/projects" className={styles.quickAccessCard}>
            <FaCode />
            <span>Projects</span>
          </a>
          <a href="/admin/skills" className={styles.quickAccessCard}>
            <FaChartBar />
            <span>Skills</span>
          </a>
          <a href="/admin/hero" className={styles.quickAccessCard}>
            <FaUserCircle />
            <span>Profile</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

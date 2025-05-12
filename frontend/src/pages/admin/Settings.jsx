import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Settings.module.css";

const Settings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("profile");

  // Form states
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Use consistent API URL
  const API_URL = "http://localhost:5000/api";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        console.log("Fetching user profile data...");

        // Get token from localStorage
        const token = localStorage.getItem("authToken");

        console.log("Authentication token exists:", !!token);

        if (!token) {
          setError("You are not logged in. Please log in again.");
          setLoading(false);
          return;
        }

        // Test API connection first
        try {
          console.log("Testing API connection...");
          const testResponse = await fetch(`${API_URL}/status`);
          console.log("API status check response:", testResponse.status);

          if (!testResponse.ok) {
            throw new Error(
              `API server not responding properly: ${testResponse.status}`
            );
          }
        } catch (connectionError) {
          console.error("API connection test failed:", connectionError);
          setError(
            "Cannot connect to the API server. Please check your connection."
          );
          setLoading(false);
          return;
        }

        // Make the actual API request
        console.log("Making request to /user/profile endpoint");
        const response = await axios.get(`${API_URL}/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Profile API response:", response.data);

        if (response.data && response.data.success) {
          setUser(response.data.user);
          setEmail(response.data.user.email || "");
          setName(response.data.user.name || "");
          console.log("User data loaded successfully");
        } else {
          console.error("Failed to load user data:", response.data);
          setError(
            "Failed to load user data. " + (response.data?.message || "")
          );
        }
      } catch (error) {
        console.error("Error in fetchUserData:", error);

        if (error.response) {
          // The request was made and the server responded with an error status
          console.error(
            "Server error response:",
            error.response.status,
            error.response.data
          );

          if (error.response.status === 401) {
            setError("Authentication failed. Please log in again.");
            localStorage.removeItem("authToken"); // Clear invalid token
          } else {
            setError(
              "Error loading user data: " +
                (error.response.data?.message || error.message)
            );
          }
        } else if (error.request) {
          // The request was made but no response was received
          console.error("No response received:", error.request);
          setError("No response from server. Please try again later.");
        } else {
          // Something happened in setting up the request
          console.error("Request setup error:", error.message);
          setError("Error setting up request: " + error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [API_URL]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("You are not logged in. Please log in again.");
        return;
      }

      console.log("Updating profile with data:", { name, email });

      const response = await axios.put(
        `${API_URL}/user/profile`,
        { name, email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Update profile response:", response.data);

      if (response.data && response.data.success) {
        setSuccess("Profile updated successfully");
        setUser(response.data.user || { ...user, name, email });

        // Update local storage if needed
        try {
          const userData = JSON.parse(localStorage.getItem("user"));
          if (userData) {
            localStorage.setItem(
              "user",
              JSON.stringify({ ...userData, name, email })
            );
          }
        } catch (storageError) {
          console.warn("Error updating localStorage:", storageError);
          // Non-critical error, don't show to user
        }
      } else {
        setError(response.data?.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);

      if (error.response) {
        setError(
          "Error updating profile: " +
            (error.response.data?.message || error.message)
        );
      } else if (error.request) {
        setError("No response from server. Please try again later.");
      } else {
        setError("Error: " + error.message);
      }
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate passwords
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("You are not logged in. Please log in again.");
        return;
      }

      console.log("Changing password");

      const response = await axios.put(
        `${API_URL}/user/password`,
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Change password response:", response.data);

      if (response.data && response.data.success) {
        setSuccess("Password changed successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(response.data?.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);

      if (error.response) {
        // Special handling for incorrect password
        if (error.response.status === 401) {
          setError("Current password is incorrect");
        } else {
          setError(
            "Error changing password: " +
              (error.response.data?.message || error.message)
          );
        }
      } else if (error.request) {
        setError("No response from server. Please try again later.");
      } else {
        setError("Error: " + error.message);
      }
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading user data...</div>;
  }

  if (!user && !error) {
    return (
      <div className={styles.error}>
        User not found. Please <a href="/admin/login">log in</a> again.
      </div>
    );
  }

  return (
    <div className={styles.settingsPage}>
      <div className={styles.container}>
        <h1 className={styles.title}>Account Settings</h1>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <div className={styles.tabs}>
          <button
            className={`${styles.tabButton} ${
              activeTab === "profile" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button
            className={`${styles.tabButton} ${
              activeTab === "password" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("password")}
          >
            Password
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === "profile" && (
            <form onSubmit={handleUpdateProfile} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                />
              </div>

              <button type="submit" className={styles.button}>
                Update Profile
              </button>
            </form>
          )}

          {activeTab === "password" && (
            <form
              onSubmit={handleChangePassword}
              className={styles.form}
              autoComplete="off"
              data-lpignore="true"
            >
              <div className={styles.formGroup}>
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="current-password-no-autofill"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  autoComplete="off"
                  data-lpignore="true"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="new-password-no-autofill"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  minLength="6"
                  autoComplete="new-password"
                  data-lpignore="true"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirm-password-no-autofill"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  minLength="6"
                  autoComplete="new-password"
                  data-lpignore="true"
                  required
                />
              </div>

              {/* Hidden input to trick browser password managers */}
              <input type="text" style={{ display: "none" }} />
              <input type="password" style={{ display: "none" }} />

              <button type="submit" className={styles.button}>
                Change Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./adminLogin.module.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const portfolioName = "Fahim Faysal";

  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      if (response.data.success) {
        // Store token and user data
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        navigate("/admin/dashboard");
      } else {
        setMessage(response.data.message || "Login failed");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setShowForgotPassword(true);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, {
        email: resetEmail,
      });

      if (response.data.success) {
        // Store the token from the response if available
        if (response.data.token) {
          localStorage.setItem("resetToken", response.data.token);
        }
        setMessage("Reset instructions sent to your email");
        setShowForgotPassword(false);
        setShowResetPassword(true);
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("Passwords don't match");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await axios.post(`${API_URL}/auth/reset-password`, {
        email: resetEmail,
        newPassword,
      });

      if (response.data.success) {
        setMessage("Password changed successfully");
        // Remove the reset token from localStorage
        localStorage.removeItem("resetToken");
        setTimeout(() => {
          setShowResetPassword(false);
          setMessage("");
        }, 1500);
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  const closeModals = () => {
    setShowForgotPassword(false);
    setShowResetPassword(false);
    setResetEmail("");
    setNewPassword("");
    setConfirmPassword("");
    setMessage("");
  };

  return (
    <div className={styles.loginPage}>
      {/* ... (keep your existing floating elements and styling) ... */}

      <div className={styles.loginLayout}>
        <div className={styles.loginContainer}>
          <div className={styles.loginBox}>
            <div className={styles.loginHeader}>
              <h1>{portfolioName}</h1>
              <p>Sign in to manage your portfolio</p>
            </div>

            {message && !showForgotPassword && !showResetPassword && (
              <div className={styles.message}>{message}</div>
            )}

            <form className={styles.loginForm} onSubmit={handleLogin}>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className={styles.formOptions}>
                <div className={styles.formCheckbox}>
                  <label>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  className={styles.forgotPasswordBtn}
                  onClick={handleForgotPassword}
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className={styles.loginBtn}
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className={styles.backToPortfolio}>
              <Link to="/">
                <i className="fas fa-arrow-left"></i> Back to Portfolio
              </Link>
            </div>
          </div>
        </div>

        {/* ... (keep your existing warning container) ... */}
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Reset Password</h3>
              <button onClick={closeModals} className={styles.closeBtn}>
                &times;
              </button>
            </div>
            <form onSubmit={handleEmailSubmit}>
              <div className={styles.formGroup}>
                <label>Enter your email</label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="admin@gmail.com"
                  required
                />
              </div>
              {message && <div className={styles.message}>{message}</div>}
              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={closeModals}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.primaryBtn}
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetPassword && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Create New Password</h3>
              <button onClick={closeModals} className={styles.closeBtn}>
                &times;
              </button>
            </div>
            <form onSubmit={handleResetSubmit}>
              <div className={styles.formGroup}>
                <label>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  minLength="6"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  minLength="6"
                />
              </div>
              {message && <div className={styles.message}>{message}</div>}
              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={closeModals}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.primaryBtn}
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLogin;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./adminLogin.module.css";

const AdminLogin = () => {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const portfolioName = "Fahim Faysal";

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/admin/dashboard");
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setShowForgotPassword(true);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email === "admin@gmail.com") {
      setShowForgotPassword(false);
      setShowResetPassword(true);
      setMessage("");
    } else {
      setMessage("Email not found");
    }
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords don't match");
      return;
    }
    setMessage("Password changed");
    setTimeout(() => {
      setShowResetPassword(false);
      setMessage("");
    }, 1500);
  };

  const closeModals = () => {
    setShowForgotPassword(false);
    setShowResetPassword(false);
    setEmail("");
    setNewPassword("");
    setConfirmPassword("");
    setMessage("");
  };

  return (
    <div className={styles.loginPage}>
      <div className={`${styles.floatingElement} ${styles.float1}`}></div>
      <div className={`${styles.floatingElement} ${styles.float2}`}></div>
      <div className={`${styles.floatingElement} ${styles.float3}`}></div>

      <div className={styles.loginLayout}>
        <div className={styles.loginContainer}>
          <div className={styles.loginBox}>
            <div className={styles.loginHeader}>
              <h1>{portfolioName}</h1>
              <p>Sign in to manage your portfolio</p>
            </div>

            <form className={styles.loginForm} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="loginId">Username or Email</label>
                <input
                  type="text"
                  id="loginId"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
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
                  className={styles.forgotPasswordBtn}
                  onClick={handleForgotPassword}
                >
                  Forgot Password?
                </button>
              </div>

              <button type="submit" className={styles.loginBtn}>
                Login
              </button>
            </form>

            <div className={styles.backToPortfolio}>
              <Link to="/">
                <i className="fas fa-arrow-left"></i> Back to Portfolio
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.warningContainer}>
          <div className={styles.warningBox}>
            <div className={styles.warningHeader}>
              <i className={`fas fa-exclamation-triangle ${styles.warningIcon}`}></i>
              <h2>Ethical Risk Indicator</h2>
            </div>
            <div className={styles.warningContent}>
              <p>
                Accessing <strong>{portfolioName}'s</strong> administrative
                interface:
              </p>
              <p>Authorized use only. Unauthorized access may result in:</p>
              <ul className={styles.warningList}>
                <li>Privacy rights violation</li>
                <li>Computer security law breaches</li>
                <li>Professional misconduct</li>
              </ul>
              <p className={styles.finalWarning}>
                If not {portfolioName} or authorized administrator, close this
                interface immediately.
              </p>
            </div>
            <div className={styles.legalDisclaimer}>
              Proceeding acknowledges acceptance of these terms
            </div>
          </div>
        </div>
      </div>

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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gmail.com"
                  required
                />
              </div>
              {message && <div className={styles.message}>{message}</div>}
              <div className={styles.modalActions}>
                <button type="button" onClick={closeModals}>
                  Cancel
                </button>
                <button type="submit" className={styles.primaryBtn}>
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                />
              </div>
              {message && <div className={styles.message}>{message}</div>}
              <div className={styles.modalActions}>
                <button type="button" onClick={closeModals}>
                  Cancel
                </button>
                <button type="submit" className={styles.primaryBtn}>
                  Save
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
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import portfolioService from "../../services/portfolioService";
import styles from "./Login.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAdminAlert, setShowAdminAlert] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showVerificationCode, setShowVerificationCode] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setShowAdminAlert(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = await portfolioService.login(email, password);
      if (success) {
        navigate("/admin/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!recoveryEmail) {
      setError("Please enter your email address");
      return;
    }
    
    setLoading(true);
    try {
      const result = await portfolioService.requestPasswordReset(recoveryEmail);

      if (result.success) {
        if (result.isAdmin) {
          setError("");
      setShowForgotPassword(false);
          setShowVerificationCode(true);
          setSuccess(
            "Verification code sent! Please check your email inbox and spam folder."
          );
        } else {
          setError("Email not found in our records");
        }
      } else {
        setError(result.error || "Failed to send reset instructions");
      }
    } catch (err) {
      setError("Failed to send reset instructions. Please try again.");
      console.error("Password reset error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationCode = async (e) => {
    e.preventDefault();
    if (!verificationCode) {
      setError("Please enter verification code");
      return;
    }

    setLoading(true);
    try {
      const result = await portfolioService.verifyResetCode(verificationCode);

      if (result.success) {
        setError("");
        setShowVerificationCode(false);
        setShowNewPassword(true);
      } else {
        setError(result.error || "Invalid verification code");
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
      console.error("Verification error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    // Password validation
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const result = await portfolioService.completePasswordReset(newPassword);

      if (result.success) {
        setError("");
        // Automatically log in the user
        const loginSuccess = await portfolioService.login(
          recoveryEmail,
          newPassword
        );
        if (loginSuccess) {
          navigate("/admin/dashboard");
        } else {
          // If automatic login fails, redirect to login page
          resetAllStates();
          setError(
            "Password reset successful. Please log in with your new password."
          );
        }
      } else {
        setError(result.error || "Failed to reset password");
      }
    } catch (err) {
      setError("Password reset failed. Please try again.");
      console.error("Password reset error:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetAllStates = () => {
    setShowForgotPassword(false);
    setShowVerificationCode(false);
    setShowNewPassword(false);
    setRecoveryEmail("");
    setVerificationCode("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
  };

  const handleCancel = () => {
    resetAllStates();
    setShowAdminAlert(true);
  };

  return (
    <div className={styles.loginContainer}>
      {showAdminAlert && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Authorized Personnel Only</h3>
            <p>
              This page is restricted to portfolio administrators. If you're not
              an administrator, please return to the portfolio. Unauthorized
              access attempts may be logged and reported.
            </p>
            
            <div className={styles.modalActions}>
              <button 
                className={styles.secondaryButton} 
                onClick={() => navigate("/")}
              >
                Back to Portfolio
              </button>
              <button 
                className={styles.primaryButton} 
                onClick={() => setShowAdminAlert(false)}
              >
                I'm an Administrator
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showForgotPassword && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Reset Password</h3>
            <p>Enter your email address to receive a verification code.</p>
            {error && <div className={styles.error}>{error}</div>}
            <form onSubmit={handleForgotPassword}>
              <div className={styles.formGroup}>
                <label htmlFor="recoveryEmail">Email</label>
                <input
                  type="email"
                  id="recoveryEmail"
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className={styles.loginformInput}
                />
              </div>
              <div className={styles.modalActions}>
                <button 
                  type="button" 
                  className={styles.secondaryButton} 
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.primaryButton}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Verification Code"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showVerificationCode && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Enter Verification Code</h3>
            <p>
              Please enter the 6-digit verification code sent to your email.
            </p>
            {success && <div className={styles.success}>{success}</div>}
            {error && <div className={styles.error}>{error}</div>}
            <form onSubmit={handleVerificationCode}>
              <div className={styles.formGroup}>
                <label htmlFor="verificationCode">Verification Code</label>
                <input
                  type="text"
                  id="verificationCode"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                  maxLength={6}
                  placeholder="Enter 6-digit code"
                  className={styles.loginformInput}
                />
              </div>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.primaryButton}
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify Code"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showNewPassword && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Set New Password</h3>
            <p>Please enter and confirm your new password.</p>
            {error && <div className={styles.error}>{error}</div>}
            <form onSubmit={handlePasswordReset}>
              <div className={styles.formGroup}>
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Enter new password"
                  className={styles.loginformInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm new password"
                  className={styles.loginformInput}
                />
              </div>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={styles.primaryButton}
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <div className={styles.loginBox}>
        <div className={styles.profileImage}></div>
        <div className={styles.loginCard}>
          <h2 className={styles.loginTitle}>Admin Portal</h2>
          <p className={styles.loginSubtitle}>
            Sign in to manage your portfolio
          </p>
          
          {error && <div className={styles.error}>{error}</div>}
          
          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className={styles.loginformInput}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className={styles.loginformInput}
              />
              <div className={styles.forgotPasswordContainer}>
                <button 
                  type="button" 
                  className={styles.forgotPasswordLink}
                  onClick={() => {
                    setShowForgotPassword(true);
                    setError("");
                  }}
                >
                  Forgot password?
                </button>
              </div>
            </div>
            
            <button 
              type="submit" 
              className={styles.signInButton} 
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
          
          <div className={styles.loginFooter}>
            <button 
              type="button" 
              className={styles.backLink}
              onClick={() => navigate("/")}
            >
              ← Back to Portfolio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./adminLogin.module.css";

const AdminLogin = () => {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const portfolioName = "Fahim Faysal";

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // TEMP: Simulate success (bypass real auth for now)
    navigate("/admin/dashboard");
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
                  autoComplete="off"
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
              <i
                className={`fas fa-exclamation-triangle ${styles.warningIcon}`}
              ></i>
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
    </div>
  );
};

export default AdminLogin;

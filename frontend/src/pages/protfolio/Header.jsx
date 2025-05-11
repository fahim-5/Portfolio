import React, { useState, useEffect } from "react";
import styles from "./Header.module.css";
import portfolioService from "../../services/portfolioService";

const Header = () => {
  const [personalInfo, setPersonalInfo] = useState({
    name: "Portfolio",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load data from database
  useEffect(() => {
    const loadHeaderData = async () => {
      console.log("Loading header data from database...");
      setLoading(true);

      try {
        // Fetch directly from database via API using the same method as Hero
        const data = await portfolioService.fetchHeroData();

        if (data) {
          console.log("Header data fetched successfully from database:", data);
          setPersonalInfo({
            name: data.name || "Portfolio",
          });
        } else {
          console.log(
            "No data returned from database, falling back to localStorage"
          );
          // Fall back to localStorage if API fails
          const localData =
            portfolioService.getSectionData("personalInfo") ||
            portfolioService.getSectionData("personal");
          if (localData && localData.name) {
            setPersonalInfo(localData);
          }
        }
      } catch (error) {
        console.error("Error fetching header data from database:", error);
        setError(error.message);

        // Fall back to localStorage on error
        const localData =
          portfolioService.getSectionData("personalInfo") ||
          portfolioService.getSectionData("personal");
        if (localData && localData.name) {
          setPersonalInfo(localData);
        }
      } finally {
        setLoading(false);
      }
    };

    loadHeaderData();
  }, []);

  // Listen for storage updates (for backward compatibility)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "portfolio_personal_info" || e.key === "lastUpdate") {
        const localData =
          portfolioService.getSectionData("personalInfo") ||
          portfolioService.getSectionData("personal");
        if (localData && localData.name) {
          setPersonalInfo(localData);
        }
      }
    };

    // Also listen for custom local data changed events
    const handleLocalDataChanged = (e) => {
      if (e.detail?.key === "portfolio_personal_info") {
        const localData =
          portfolioService.getSectionData("personalInfo") ||
          portfolioService.getSectionData("personal");
        if (localData && localData.name) {
          setPersonalInfo(localData);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("localDataChanged", handleLocalDataChanged);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("localDataChanged", handleLocalDataChanged);
    };
  }, []);

  if (loading) {
    return (
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.logo}>
            <h1>Loading...</h1>
          </div>
          <nav>
            <ul>
              <li>
                <a href="#home">Home</a>
              </li>
              <li>
                <a href="#about">About</a>
              </li>
              <li>
                <a href="#education">Education</a>
              </li>
              <li>
                <a href="#experience">Experience</a>
              </li>
              <li>
                <a href="#skills">Skills</a>
              </li>
              <li>
                <a href="#portfolio">Portfolio</a>
              </li>
              <li>
                <a href="#pictures">Pictures</a>
              </li>
              <li>
                <a href="#references">References</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <h1>{personalInfo.name}</h1>
        </div>
        <nav>
          <ul>
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#education">Education</a>
            </li>
            <li>
              <a href="#experience">Experience</a>
            </li>
            <li>
              <a href="#skills">Skills</a>
            </li>
            <li>
              <a href="#portfolio">Portfolio</a>
            </li>
            <li>
              <a href="#pictures">Pictures</a>
            </li>
            <li>
              <a href="#references">References</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;

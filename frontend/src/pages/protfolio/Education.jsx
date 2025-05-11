import React, { useEffect, useRef, useState } from "react";
import styles from "./Education.module.css";
import portfolioService from "../../services/portfolioService";

const Education = () => {
  const educationItems = useRef([]);
  const [educationData, setEducationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch education data directly from the database
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log("Fetching education data from database...");

        // Use the portfolioService to fetch data from API only
        const data = await portfolioService.fetchEducationData();

        if (data) {
          console.log("Education data loaded from database:", data);
          setEducationData(data);
        } else {
          console.log("No education data returned from database");
          setEducationData([]);
        }
      } catch (err) {
        console.error("Error fetching education data:", err);
        setError(err.message);
        setEducationData([]);
      } finally {
        setLoading(false);
      }
    };

    // Initial data fetch
    fetchData();

    // Set up intersection observer for animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.revealed);
          }
        });
      },
      { threshold: 0.2 }
    );

    // Update observer for items
    const updateObserver = () => {
      const currentItems = educationItems.current;

      if (currentItems && currentItems.forEach) {
        currentItems.forEach((item) => {
          if (item) observer.observe(item);
        });
      }
    };

    // Set up observer after data is loaded
    if (educationData.length > 0) {
      setTimeout(updateObserver, 100);
    }

    return () => {
      // Cleanup observer
      const currentItems = educationItems.current;
      if (currentItems && currentItems.forEach) {
        currentItems.forEach((item) => {
          if (item) observer.unobserve(item);
        });
      }
    };
  }, [educationData.length]);

  // Format a date from YYYY-MM to a readable format
  const formatDate = (dateString) => {
    if (!dateString) return "";

    try {
      const [year, month] = dateString.split("-");
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const monthIndex = parseInt(month, 10) - 1;
      return `${monthNames[monthIndex]} ${year}`;
    } catch (error) {
      return dateString;
    }
  };

  // If loading, show a loading indicator
  if (loading) {
    return (
      <section id="education" className={styles.education}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Education</h2>
          <div className={styles.loading}>
            Loading education data from database...
          </div>
        </div>
      </section>
    );
  }

  // If error, show error message
  if (error) {
    return (
      <section id="education" className={styles.education}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Education</h2>
          <div className={styles.error}>Error loading data: {error}</div>
        </div>
      </section>
    );
  }

  // Check if we have education data
  if (educationData.length === 0) {
    return (
      <section id="education" className={styles.education}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Education</h2>
          <div className={styles.empty}>No education data available.</div>
        </div>
      </section>
    );
  }

  return (
    <section id="education" className={styles.education}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Education</h2>

        <div className={styles.educationGrid}>
          {educationData.map((edu, index) => (
            <div
              key={edu.id || index}
              className={styles.eduItem}
              ref={(el) => (educationItems.current[index] = el)}
            >
              <h3>{edu.degree}</h3>
              <h4>{edu.institution}</h4>
              <h5>
                {edu.location} |{" "}
                {edu.current ? (
                  <>
                    Current <span className={styles.current}>Active</span>
                  </>
                ) : (
                  `${formatDate(edu.startDate)}${
                    edu.endDate ? ` - ${formatDate(edu.endDate)}` : ""
                  }`
                )}
              </h5>
              <p>{edu.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative elements */}
      <div className={`${styles.floatingDot} ${styles.dot1}`}></div>
      <div className={`${styles.floatingDot} ${styles.dot2}`}></div>
    </section>
  );
};

export default Education;

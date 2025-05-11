import React, { useEffect, useRef, useState } from "react";
import styles from "./References.module.css";
import portfolioService from "../../services/portfolioService";
import placeholderImage from "../../assets/placeholder.js";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Import fallback images
import managerImage from "../../assets/references/manager.jpg";
import professorImage from "../../assets/references/professor.jpg";
import jenniferImage from "../../assets/jennifer.jpg";
import donaldImage from "../../assets/donald.jpg";

const References = () => {
  const referenceItems = useRef([]);
  const [referencesData, setReferencesData] = useState([]);
  const [imageSources, setImageSources] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  // Number of references to show per page
  const itemsPerPage = 2;

  // Fallback images
  const fallbackImages = {
    manager: managerImage,
    professor: professorImage,
    jennifer: jenniferImage,
    donald: donaldImage,
  };

  // Handler for image loading errors
  const handleImageError = (name) => {
    setImageSources((prev) => ({
      ...prev,
      [name]: placeholderImage,
    }));
  };

  // Fetch references data with retry logic
  const fetchReferences = async (retryCount = 3) => {
    setLoading(true);
    setError(null);

    try {
      // Try API first
      const apiData = await portfolioService.fetchReferencesData();

      if (apiData && Array.isArray(apiData) && apiData.length > 0) {
        setReferencesData(apiData);
        setLastUpdate(Date.now());
        console.log("References data loaded from API:", apiData);
        return;
      }

      // Fall back to localStorage if API returns empty or invalid data
      const localData = portfolioService.getSectionData("references");
      if (localData && localData.length > 0) {
        setReferencesData(localData);
        setLastUpdate(Date.now());
        console.log("References data loaded from localStorage:", localData);
        return;
      }

      // If both sources failed, throw error
      throw new Error("No valid references data available");
    } catch (error) {
      console.error("Error fetching references:", error);

      if (retryCount > 0) {
        console.log(`Retrying... (${retryCount} attempts left)`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return fetchReferences(retryCount - 1);
      }

      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Set up continuous data fetching
  useEffect(() => {
    // Initial fetch
    fetchReferences();

    // Set up refresh interval (every 30 seconds)
    const refreshInterval = setInterval(() => {
      fetchReferences();
    }, 30000);

    // Set up IntersectionObserver for animations
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

    // Update observer when referencesData changes
    const updateObserver = () => {
      if (referenceItems.current.forEach) {
        referenceItems.current.forEach((item) => {
          if (item) observer.observe(item);
        });
      }
    };

    if (referencesData.length > 0) {
      updateObserver();
    }

    // Cleanup
    return () => {
      clearInterval(refreshInterval);
      if (referenceItems.current.forEach) {
        referenceItems.current.forEach((item) => {
          if (item) observer.unobserve(item);
        });
      }
    };
  }, [referencesData.length, refreshKey]);

  // Handle storage changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "portfolio_references" || e.key === "lastUpdate") {
        console.log("Storage change detected, refreshing references");
        fetchReferences();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Get appropriate image source for a reference
  const getImageSource = (reference, index) => {
    // First try the imageSources state (for error handling)
    if (imageSources[reference.name]) {
      return imageSources[reference.name];
    }

    // Then try the reference's image URL
    if (reference.image) {
      return reference.image;
    }

    // Then try fallback images by name
    const lowerName = reference.name.toLowerCase();
    for (const [key, image] of Object.entries(fallbackImages)) {
      if (lowerName.includes(key)) {
        return image;
      }
    }

    // Finally fall back to placeholder
    return placeholderImage;
  };

  // Pagination handlers
  const nextPage = () => {
    if ((currentPage + 1) * itemsPerPage < referencesData.length) {
      setCurrentPage(currentPage + 1);
      setRefreshKey((prev) => prev + 1); // Force refresh for animations
      referenceItems.current = [];
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setRefreshKey((prev) => prev + 1); // Force refresh for animations
      referenceItems.current = [];
    }
  };

  // Calculate pagination data
  const totalPages = Math.ceil(referencesData.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, referencesData.length);
  const currentReferences = referencesData.slice(startIndex, endIndex);

  // Loading state
  if (loading && referencesData.length === 0) {
    return (
      <section id="references" className={styles.references}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>References</h2>
          <div className={styles.loadingIndicator}>
            <p>Loading references...</p>
            <div className={styles.spinner}></div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section id="references" className={styles.references}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>References</h2>
          <div className={styles.errorContainer}>
            <p className={styles.errorMessage}>
              Error loading references: {error}
            </p>
            <button
              onClick={() => fetchReferences()}
              className={styles.retryButton}
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (referencesData.length === 0) {
    return (
      <section id="references" className={styles.references}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>References</h2>
          <div className={styles.emptyState}>
            <p>No references available at this time.</p>
            <button
              onClick={() => fetchReferences()}
              className={styles.retryButton}
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Main render
  return (
    <section id="references" className={styles.references}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>References</h2>

        <div className={styles.referencesIntro}>
          Here's what my clients and colleagues have to say about working with
          me.
        </div>

        <div className={styles.referencesGrid}>
          {currentReferences.map((reference, index) => (
            <div
              key={`${reference.name}-${startIndex + index}`}
              className={`${styles.referenceCard} ${styles.glassCard}`}
              ref={(el) => (referenceItems.current[index] = el)}
            >
              <div className={styles.referenceHeader}>
                <div className={styles.referenceImage}>
                  <img
                    src={getImageSource(reference, index)}
                    alt={reference.name}
                    onError={() => handleImageError(reference.name)}
                    loading="lazy"
                  />
                </div>
                <div className={styles.referenceInfo}>
                  <h3>{reference.name}</h3>
                  <h4>{reference.position}</h4>
                  <h5>@ {reference.company}</h5>
                </div>
              </div>
              <div className={styles.referenceQuote}>
                <p>"{reference.quote}"</p>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className={styles.paginationControls}>
            <button
              className={`${styles.paginationArrow} ${
                currentPage === 0 ? styles.disabled : ""
              }`}
              onClick={prevPage}
              disabled={currentPage === 0}
            >
              <FaChevronLeft />
            </button>

            <div className={styles.paginationDots}>
              {[...Array(totalPages)].map((_, i) => (
                <span
                  key={i}
                  className={`${styles.paginationDot} ${
                    i === currentPage ? styles.activeDot : ""
                  }`}
                  onClick={() => {
                    setCurrentPage(i);
                    setRefreshKey((prev) => prev + 1);
                    referenceItems.current = [];
                  }}
                />
              ))}
            </div>

            <button
              className={`${styles.paginationArrow} ${
                currentPage >= totalPages - 1 ? styles.disabled : ""
              }`}
              onClick={nextPage}
              disabled={currentPage >= totalPages - 1}
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default References;

import React, { useEffect, useRef, useState } from "react";
import styles from "./Pictures.module.css";
import portfolioService from "../../services/portfolioService";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Pictures = () => {
  const pictureItems = useRef([]);
  const [picturesData, setPicturesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  // Number of items to show per page
  const itemsPerPage = 3;

  // Calculate pagination data
  const totalPages = Math.ceil((picturesData?.length || 0) / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = Math.min(
    startIndex + itemsPerPage,
    picturesData?.length || 0
  );
  const currentItems = picturesData?.slice(startIndex, endIndex) || [];

  // Pagination handlers
  const nextPage = () => {
    if ((currentPage + 1) * itemsPerPage < picturesData.length) {
      setCurrentPage(currentPage + 1);
      setRefreshKey((prev) => prev + 1); // Force refresh for animations
      pictureItems.current = [];
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setRefreshKey((prev) => prev + 1); // Force refresh for animations
      pictureItems.current = [];
    }
  };

  useEffect(() => {
    // Fetch pictures data directly from the database
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Fetching pictures data from database...");

        // Use the portfolioService to fetch data from API only
        const data = await portfolioService.fetchPicturesData();

        if (data) {
          console.log("Pictures data loaded from database:", data);
          setPicturesData(data);
        } else {
          console.log("No pictures data returned from database");
          setPicturesData([]);
        }
      } catch (err) {
        console.error("Error fetching pictures data:", err);
        setError(err.message);
        setPicturesData([]);
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
      const currentItems = pictureItems.current;

      if (currentItems && currentItems.forEach) {
        currentItems.forEach((item) => {
          if (item) observer.observe(item);
        });
      }
    };

    // Set up observer after data is loaded
    if (picturesData.length > 0) {
      setTimeout(updateObserver, 100);
    }

    return () => {
      // Cleanup observer
      const currentItems = pictureItems.current;
      if (currentItems && currentItems.forEach) {
        currentItems.forEach((item) => {
          if (item) observer.unobserve(item);
        });
      }
    };
  }, [picturesData.length, refreshKey]);

  // If loading, show a loading indicator
  if (loading) {
    return (
      <section id="pictures" className={styles.pictures}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Photography</h2>
          <div className={styles.loading}>
            Loading photography data from database...
          </div>
        </div>
      </section>
    );
  }

  // If error, show error message
  if (error) {
    return (
      <section id="pictures" className={styles.pictures}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Photography</h2>
          <div className={styles.error}>Error loading data: {error}</div>
        </div>
      </section>
    );
  }

  // Check if we have pictures data
  if (picturesData.length === 0) {
    return (
      <section id="pictures" className={styles.pictures}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Photography</h2>
          <div className={styles.emptyMessage}>
            No photography items found. Add some in the admin panel.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="pictures" className={styles.pictures}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Photography</h2>

        <div className={styles.picturesGrid}>
          {currentItems.map((picture, index) => (
            <div
              key={index}
              className={`${styles.pictureCard}`}
              ref={(el) => (pictureItems.current[index] = el)}
            >
              <div className={styles.pictureImage}>
                <img
                  src={picture.image || ""}
                  alt={picture.title}
                  className={styles.pictureImg}
                />
              </div>
              <div className={styles.pictureContent}>
                <span className={styles.pictureTag}>{picture.category}</span>
                <h3>{picture.title}</h3>
                <p>{picture.description}</p>
                {picture.link && (
                  <a
                    href={picture.link}
                    className={styles.viewPicture}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Full Size <i className="fas fa-external-link-alt"></i>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {picturesData.length > 3 && (
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
                    pictureItems.current = [];
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

export default Pictures;

import React, { useEffect, useRef, useState } from "react";
import styles from "./Portfolio.module.css";
import portfolioService from "../../services/portfolioService";
import placeholderImage from "../../assets/placeholder.js";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Import fallback images if needed
import portfolioImage from "../../assets/projects/portfolio.jpg";
import tradingChartImage from "../../assets/trading-chart1.jpg";
import cyberfuturismImage from "../../assets/cyberfuturism.jpg";
import profileSmilingImage from "../../assets/profile-smiling.jpg";
import japanShoreImage from "../../assets/japan-shore.jpg";
import cryptoResearchImage from "../../assets/projects/crypto-research.jpg";

const Portfolio = () => {
  const projectItems = useRef([]);
  const [projectsData, setProjectsData] = useState([]);
  const [imageSources, setImageSources] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  // Number of projects to show per page
  const itemsPerPage = 3;

  // Handler for image loading errors
  const handleImageError = (title) => {
    setImageSources((prev) => ({
      ...prev,
      [title]: placeholderImage,
    }));
  };

  // Fallback images for demo purposes
  const fallbackImages = [
    portfolioImage,
    tradingChartImage,
    cyberfuturismImage,
    profileSmilingImage,
    japanShoreImage,
    cryptoResearchImage,
  ];

  useEffect(() => {
    // Initialize localStorage if needed
    portfolioService.initializeStorage();

    // Increment portfolio views count
    portfolioService.incrementPortfolioViews();

    // Fetch projects data from API first, then fall back to localStorage if needed
    const fetchData = async () => {
      try {
        // First try API
        const apiData = await portfolioService.fetchProjectsData();
        if (apiData) {
          setProjectsData(apiData);
          console.log("Projects data loaded from API:", apiData);
        } else {
          // Fall back to localStorage if API fails
          const localData = portfolioService.getSectionData("projects");
          setProjectsData(localData || []);
          console.log("Projects data loaded from localStorage:", localData);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        // Fall back to localStorage on error
        const localData = portfolioService.getSectionData("projects");
        setProjectsData(localData || []);
      }
    };

    // Initial data fetch
    fetchData();

    // Listen for changes to localStorage
    const handleStorageChange = (e) => {
      if (e.key === "portfolio_projects" || e.key === "lastUpdate") {
        console.log("Storage change detected for projects");
        const localData = portfolioService.getSectionData("projects");
        setProjectsData(localData || []);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Also check periodically for changes
    const interval = setInterval(fetchData, 30000); // Check every 30 seconds

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
      const currentItems = projectItems.current;

      if (currentItems && currentItems.forEach) {
        currentItems.forEach((item) => {
          if (item) observer.observe(item);
        });
      }
    };

    // Set up observer after data is loaded
    if (projectsData.length > 0) {
      setTimeout(updateObserver, 100);
    }

    return () => {
      // Cleanup observer
      const currentItems = projectItems.current;
      if (currentItems && currentItems.forEach) {
        currentItems.forEach((item) => {
          if (item) observer.unobserve(item);
        });
      }

      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [projectsData.length]);

  // Manually force an update to the component when localStorage is changed from this window
  useEffect(() => {
    const handleLocalChange = () => {
      const data = portfolioService.getSectionData("projects");
      setProjectsData(data || []);
    };

    window.addEventListener("localDataChanged", handleLocalChange);

    return () => {
      window.removeEventListener("localDataChanged", handleLocalChange);
    };
  }, []);

  // Pagination handlers
  const nextPage = () => {
    if ((currentPage + 1) * itemsPerPage < projectsData.length) {
      setCurrentPage(currentPage + 1);
      setRefreshKey((prev) => prev + 1); // Force refresh for animations
      projectItems.current = [];
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setRefreshKey((prev) => prev + 1); // Force refresh for animations
      projectItems.current = [];
    }
  };

  // Calculate pagination data
  const totalPages = Math.ceil(projectsData.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, projectsData.length);
  const currentProjects = projectsData.slice(startIndex, endIndex);

  // Check if we have projects data
  if (projectsData.length === 0) {
    return null; // Don't render the section if no data
  }

  return (
    <section id="portfolio" className={styles.portfolio}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Portfolio</h2>

        <div className={styles.portfolioGrid}>
          {currentProjects.map((project, index) => (
            <div
              key={index}
              className={`${styles.projectCard}`}
              ref={(el) => (projectItems.current[index] = el)}
            >
              <div className={styles.projectImage}>
                <img
                  src={
                    imageSources[project.title] ||
                    project.image ||
                    fallbackImages[index % fallbackImages.length]
                  }
                  alt={project.title}
                  onError={() => handleImageError(project.title)}
                />
              </div>
              <div className={styles.projectContent}>
                <span className={styles.projectTag}>{project.category}</span>
                <h3>{project.title}</h3>
                <p>{project.description}</p>

                {project.technologies && (
                  <div className={styles.projectTools}>
                    <h4>Technologies Used:</h4>
                    <div className={styles.toolsContainer}>
                      {project.technologies
                        .split(",")
                        .map((tech, techIndex) => (
                          <span key={techIndex} className={styles.toolTag}>
                            {tech.trim()}
                          </span>
                        ))}
                    </div>
                  </div>
                )}

                <div className={styles.projectLinks}>
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      className={styles.viewProject}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Live Demo <i className="fas fa-external-link-alt"></i>
                    </a>
                  )}
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      className={styles.viewSource}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Source <i className="fab fa-github"></i>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {projectsData.length > 3 && (
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
                    projectItems.current = [];
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

export default Portfolio;

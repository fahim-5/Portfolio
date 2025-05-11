import React, { useState, useEffect } from "react";
import styles from "./Hero.module.css";
import portfolioService from "../../services/portfolioService";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCopy,
  FaCheck,
} from "react-icons/fa";

const Hero = () => {
  const [heroData, setHeroData] = useState({
    greeting: "Hello, I'm",
    name: "",
    lastName: "",
    description: "",
    jobTitle: "",
    stats: [],
    buttonText: "Get In Touch",
    profileImageUrl: null,
  });

  const [showContactModal, setShowContactModal] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    email: "",
    phone: "",
    location: "",
    socialLinks: {
      linkedin: "",
      github: "",
      twitter: "",
      instagram: "",
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add states for copied elements
  const [copied, setCopied] = useState({
    email: false,
    phone: false,
  });

  // Function to copy text to clipboard
  const copyToClipboard = (text, type) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied({ ...copied, [type]: true });

        // Reset the copied state after 2 seconds
        setTimeout(() => {
          setCopied({ ...copied, [type]: false });
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  // Load hero data directly from database
  useEffect(() => {
    const loadHeroData = async () => {
      console.log("Loading hero data from database...");
      setLoading(true);

      try {
        // Fetch directly from database via API
        const data = await portfolioService.fetchHeroData();

        if (data) {
          console.log("Hero data fetched successfully from database:", data);
          setHeroData({
            greeting: data.greeting || "Hello, I'm",
            name: data.name || "",
            lastName: data.lastName || "",
            description: data.description || "",
            jobTitle: data.jobTitle || "",
            stats: data.stats || [],
            buttonText: data.buttonText || "Get In Touch",
            profileImageUrl: data.profileImageUrl || null,
          });

          setPersonalInfo({
            email: data.email || "",
            phone: data.phone || "",
            location: data.location || "",
            socialLinks: data.socialLinks || {
              linkedin: "",
              github: "",
              twitter: "",
              instagram: "",
            },
          });
        } else {
          setError("Failed to fetch data from database");
        }
      } catch (error) {
        console.error("Error fetching hero data from database:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadHeroData();
  }, []);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const modal = document.querySelector(`.${styles.contactModal}`);
      if (modal && !modal.contains(event.target) && showContactModal) {
        setShowContactModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showContactModal]);

  if (loading) {
    return (
      <section id="home" className={styles.hero}>
        <div className={styles.container}>
          <p>Loading hero information from database...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="home" className={styles.hero}>
        <div className={styles.container}>
          <p>Error loading data: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="home" className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.heroContent}>
          <div className={styles.intro}>
            <h2>{heroData.greeting}</h2>
            <h1 className={styles.gradientText}>{heroData.name}</h1>
            <p>{heroData.description}</p>

            <div className={styles.stats}>
              {heroData.stats.map((stat, index) => (
                <div
                  key={index}
                  className={`${styles.statItem} ${styles.glassCard}`}
                >
                  <h3>{stat.value}</h3>
                  <p>{stat.label}</p>
                </div>
              ))}
            </div>

            <button
              className={styles.btn}
              onClick={() => setShowContactModal(true)}
            >
              {heroData.buttonText}
            </button>
          </div>

          <div className={styles.heroImage}>
            {heroData.profileImageUrl ? (
              <img src={heroData.profileImageUrl} alt={heroData.name} />
            ) : (
              <div className={styles.placeholderImage}></div>
            )}
            {heroData.jobTitle && (
              <div className={styles.caption}>{heroData.jobTitle}</div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Modal/Popup */}
      {showContactModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.contactModal}>
            <button
              className={styles.closeButton}
              onClick={() => setShowContactModal(false)}
            >
              ×
            </button>
            <h2>Get In Touch</h2>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>
                  <FaEnvelope />
                </div>
                <p>{personalInfo.email}</p>
                <button
                  className={styles.copyButton}
                  onClick={() => copyToClipboard(personalInfo.email, "email")}
                  aria-label="Copy email address"
                >
                  {copied.email ? (
                    <FaCheck className={styles.checkIcon} />
                  ) : (
                    <FaCopy />
                  )}
                </button>
              </div>
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>
                  <FaPhone />
                </div>
                <p>{personalInfo.phone}</p>
                <button
                  className={styles.copyButton}
                  onClick={() => copyToClipboard(personalInfo.phone, "phone")}
                  aria-label="Copy phone number"
                >
                  {copied.phone ? (
                    <FaCheck className={styles.checkIcon} />
                  ) : (
                    <FaCopy />
                  )}
                </button>
              </div>
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>
                  <FaMapMarkerAlt />
                </div>
                <p>{personalInfo.location}</p>
              </div>
            </div>
            <div className={styles.socialLinks}>
              <a
                href={personalInfo.socialLinks?.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a
                href={personalInfo.socialLinks?.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-github"></i>
              </a>
              <a
                href={personalInfo.socialLinks?.twitter}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href={personalInfo.socialLinks?.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Decorative elements */}
      <div className={`${styles.floatingElement} ${styles.float1}`}></div>
      <div className={`${styles.floatingElement} ${styles.float2}`}></div>
      <div className={`${styles.floatingElement} ${styles.float3}`}></div>
    </section>
  );
};

export default Hero;

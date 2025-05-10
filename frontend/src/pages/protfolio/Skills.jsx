import React, { useState, useEffect, useRef } from 'react';
import styles from './Skills.module.css';
import portfolioService from '../../services/portfolioService';

const Skills = () => {
  const [activeTab, setActiveTab] = useState('technical');
  const [skillsData, setSkillsData] = useState({ technical: [], soft: [], languages: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const skillItems = useRef([]);
  
  useEffect(() => {
    // Fetch skills data from API
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch from API only, no localStorage fallback
        const apiData = await portfolioService.fetchSkillsData();
        if (apiData) {
          setSkillsData(apiData);
        } else {
          setError('No skills data returned from API');
        }
      } catch (error) {
        console.error('Error fetching skills:', error);
        setError('Failed to fetch skills data from the database');
      } finally {
        setLoading(false);
      }
    };
    
    // Initial data fetch
    fetchData();
    
    // Set up intersection observer for animation on scroll
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
    
    // Make sure all skill items are initially visible
    setTimeout(() => {
      const currentItems = skillItems.current;
      currentItems.forEach((item) => {
        if (item) item.classList.add(styles.revealed);
      });
    }, 100);
    
    const currentItems = skillItems.current;
    
    currentItems.forEach((item) => {
      if (item) observer.observe(item);
    });
    
    return () => {
      currentItems.forEach((item) => {
        if (item) observer.unobserve(item);
      });
    };
  }, []);

  // Helper function to get icon based on skill name
  const getIconForSkill = (skillName) => {
    const skillIconMap = {
      'React': 'react',
      'JavaScript': 'js-square',
      'HTML': 'html5',
      'CSS': 'css3-alt',
      'Node.js': 'node-js',
      'Angular': 'angular',
      'Vue.js': 'vuejs',
      'TypeScript': 'code',
      'Python': 'python',
      'Java': 'java',
      'PHP': 'php',
      'Database': 'database',
      'MongoDB': 'database',
      'SQL': 'database',
      'MySQL': 'database',
      'PostgreSQL': 'database',
      'Firebase': 'fire',
      'Git': 'git-alt',
      'Docker': 'docker',
      'AWS': 'aws',
      'Communication': 'comments',
      'Teamwork': 'users',
      'Problem Solving': 'puzzle-piece',
      'Leadership': 'users-cog',
      'Time Management': 'clock',
      'Project Management': 'tasks',
      'Adaptability': 'sync',
      'Critical Thinking': 'brain',
      'Creativity': 'lightbulb',
      'Attention to Detail': 'search',
      'English': 'language',
      'Spanish': 'language',
      'French': 'language',
      'German': 'language',
      'Chinese': 'language',
      'Japanese': 'language',
      'Bengali': 'language',
      'Hindi': 'language',
      'Arabic': 'language'
    };
    
    return skillIconMap[skillName] || 'star'; // Default to 'star' if no mapping found
  };
  
  // Get level description for display
  const getLevelDescription = (level) => {
    const descriptions = {
      'beginner': 'Basic knowledge with some practical experience',
      'elementary': 'Good working knowledge with limited experience',
      'intermediate': 'Solid understanding with regular application',
      'advanced': 'Deep knowledge with extensive practical experience',
      'expert': 'Mastery level with the ability to teach others',
      'native': 'Native proficiency'
    };
    
    return descriptions[level] || '';
  };
  
  // Function to render the appropriate active skills
  const getActiveSkills = () => {
    return skillsData[activeTab] || [];
  };
  
  // Check if we have skills data
  const hasSkills = Object.values(skillsData).some(category => category.length > 0);
  if (!hasSkills && !loading && !error) {
    return null; // Don't render the section if no data and not loading
  }
  
  const hasLanguages = skillsData.languages && skillsData.languages.length > 0;
  
  if (loading) {
    return (
      <section id="skills" className={styles.skills}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Skills & Expertise</h2>
          <p>Loading skills...</p>
        </div>
      </section>
    );
  }
  
  if (error) {
    return (
      <section id="skills" className={styles.skills}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Skills & Expertise</h2>
          <p className={styles.errorMessage}>Error: {error}</p>
        </div>
      </section>
    );
  }
  
  return (
    <section id="skills" className={styles.skills}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Skills & Expertise</h2>
        
        <p className={styles.skillsIntro}>
          With a diverse set of skills spanning technical and soft competencies, I bring a well-rounded approach to every project.
          My passion for continuous learning keeps my skills current with the latest technologies and best practices.
        </p>
        
        <div className={styles.skillsHeader}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'technical' ? styles.active : ''}`}
            onClick={() => setActiveTab('technical')}
          >
            Technical Skills
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'soft' ? styles.active : ''}`}
            onClick={() => setActiveTab('soft')}
          >
            Soft Skills
          </button>
          {hasLanguages && (
            <button 
              className={`${styles.tabButton} ${activeTab === 'languages' ? styles.active : ''}`}
              onClick={() => setActiveTab('languages')}
            >
              Languages
            </button>
          )}
        </div>
        
        <div className={styles.skillsGrid}>
          {getActiveSkills().map((skill, index) => (
            <div 
              key={index} 
              className={`${styles.skillCard} ${styles.glassCard}`}
              ref={el => skillItems.current[index] = el}
            >
              <div className={styles.skillIcon}>
                <i className={`fas fa-${getIconForSkill(skill.name)}`}></i>
              </div>
              <div className={styles.skillContent}>
                <h3>{skill.name}</h3>
                {skill.level && (
                  <div className={styles.skillLevel}>
                    <div className={`${styles.skillLevelBar} ${styles[skill.level]}`}></div>
                    <p className={styles.skillLevelText}>{skill.level.charAt(0).toUpperCase() + skill.level.slice(1)}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills; 
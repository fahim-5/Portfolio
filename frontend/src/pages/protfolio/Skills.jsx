import React, { useState, useEffect, useRef } from 'react';
import styles from './Skills.module.css';
import portfolioService from '../../services/portfolioService';

const Skills = () => {
  const [activeTab, setActiveTab] = useState('technical');
  const [skillsData, setSkillsData] = useState({
    technical: [],
    soft: [],
    languages: []
  });
  const [loading, setLoading] = useState({
    technical: false,
    soft: false,
    languages: false
  });
  const [error, setError] = useState(null);
  const skillItems = useRef([]);
  
  // Fetch skills data for a specific category
  const fetchSkillsData = async (category) => {
    setLoading(prev => ({ ...prev, [category]: true }));
    setError(null);
    
    try {
      const data = await portfolioService.fetchSkillsData(category);
      if (data) {
        setSkillsData(prev => ({ 
          ...prev, 
          [category]: data[category] || [] 
        }));
      } else {
        setError(`No ${category} skills data returned from API`);
      }
    } catch (error) {
      console.error(`Error fetching ${category} skills:`, error);
      setError(`Failed to fetch ${category} skills data`);
    } finally {
      setLoading(prev => ({ ...prev, [category]: false }));
    }
  };

  // Initial data fetch for all categories
  useEffect(() => {
    fetchSkillsData('technical');
    fetchSkillsData('soft');
    fetchSkillsData('languages');
  }, []);

  // Set up intersection observer for animation
  useEffect(() => {
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
    
    const currentItems = skillItems.current;
    
    currentItems.forEach((item) => {
      if (item) observer.observe(item);
    });
    
    return () => {
      currentItems.forEach((item) => {
        if (item) observer.unobserve(item);
      });
    };
  }, [skillsData[activeTab]]);

  // Icon mapping for skills
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
    
    return skillIconMap[skillName] || 'star';
  };
  
  const getActiveSkills = () => skillsData[activeTab] || [];
  const hasSkills = Object.values(skillsData).some(category => category.length > 0);

  if (!hasSkills && (loading.technical || loading.soft || loading.languages)) {
    return (
      <section id="skills" className={styles.skills}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Skills & Expertise</h2>
          <div className={styles.loadingSpinner}></div>
        </div>
      </section>
    );
  }
  
  if (error) {
    return (
      <section id="skills" className={styles.skills}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Skills & Expertise</h2>
          <p className={styles.errorMessage}>{error}</p>
          <button 
            className={styles.retryButton}
            onClick={() => {
              fetchSkillsData('technical');
              fetchSkillsData('soft');
              fetchSkillsData('languages');
            }}
          >
            Retry
          </button>
        </div>
      </section>
    );
  }
  
  return (
    <section id="skills" className={styles.skills}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Skills & Expertise</h2>
        
        <p className={styles.skillsIntro}>
          Combining technical proficiency with strong interpersonal skills to deliver comprehensive solutions.
        </p>
        
        <div className={styles.skillsHeader}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'technical' ? styles.active : ''}`}
            onClick={() => setActiveTab('technical')}
            disabled={loading.technical}
          >
            {loading.technical ? 'Loading...' : 'Technical'}
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'soft' ? styles.active : ''}`}
            onClick={() => setActiveTab('soft')}
            disabled={loading.soft}
          >
            {loading.soft ? 'Loading...' : 'Soft Skills'}
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'languages' ? styles.active : ''}`}
            onClick={() => setActiveTab('languages')}
            disabled={loading.languages}
          >
            {loading.languages ? 'Loading...' : 'Languages'}
          </button>
        </div>
        
        <div className={styles.skillsGrid}>
          {loading[activeTab] ? (
            <div className={styles.loadingMessage}>
              <div className={styles.loadingSpinner}></div>
              Loading {activeTab} skills...
            </div>
          ) : getActiveSkills().length > 0 ? (
            getActiveSkills().map((skill, index) => (
              <div 
                key={`${activeTab}-${index}`} 
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
                      <span className={styles.skillLevelText}>
                        {skill.level.charAt(0).toUpperCase() + skill.level.slice(1)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noSkillsMessage}>
              {activeTab === 'languages' 
                ? "Language proficiency not specified" 
                : `No ${activeTab} skills listed`}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Skills;
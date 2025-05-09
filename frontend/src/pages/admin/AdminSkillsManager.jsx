// AdminSkillsManager.jsx
import React, { useState, useEffect } from 'react';
import portfolioService from '../../services/portfolioService';
import styles from './AdminSkillsManager.module.css';

const AdminSkillsManager = () => {
  const [skillsData, setSkillsData] = useState({ technical: [], soft: [], languages: [] });

  const fetchSkills = async () => {
    const data = await portfolioService.getSectionData('skills');
    if (data) setSkillsData(data);
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const deleteSkill = async (category, index) => {
    const updated = { ...skillsData };
    updated[category].splice(index, 1); // remove by index
    setSkillsData(updated);
    await portfolioService.saveSectionData('skills', updated); // save to localStorage or backend
  };

  return (
    <div className={styles.adminSkillsManager}>
      <h2>Admin Skill Manager</h2>

      {['technical', 'soft', 'languages'].map((category) => (
        <div key={category}>
          <h3>{category.charAt(0).toUpperCase() + category.slice(1)} Skills</h3>
          {skillsData[category]?.length > 0 ? (
            <ul className={styles.skillList}>
              {skillsData[category].map((skill, index) => (
                <li key={index} className={styles.skillItem}>
                  <strong>{skill.name}</strong> {skill.level && `(${skill.level})`}
                  <button
                    className={styles.deleteBtn}
                    onClick={() => deleteSkill(category, index)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No skills available in this category.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminSkillsManager;

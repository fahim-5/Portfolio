/**
 * Utility for clearing localStorage data
 */

const STORAGE_KEYS = {
  PERSONAL_INFO: 'portfolio_personal_info',
  EDUCATION: 'portfolio_education',
  EXPERIENCE: 'portfolio_experience',
  SKILLS: 'portfolio_skills',
  PROJECTS: 'portfolio_projects',
  PICTURES: 'portfolio_pictures',
  REFERENCES: 'portfolio_references',
  VIEWS: 'portfolio_views',
  LAST_UPDATE: 'lastUpdate'
};

/**
 * Clear all cached data in localStorage
 */
export function clearAllCache() {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  console.log('All portfolio cache cleared');
}

/**
 * Clear specific section's cache
 * @param {string} section - The section to clear (e.g., 'projects', 'skills')
 */
export function clearSectionCache(section) {
  const key = STORAGE_KEYS[section.toUpperCase()] || `portfolio_${section.toLowerCase()}`;
  localStorage.removeItem(key);
  localStorage.setItem(STORAGE_KEYS.LAST_UPDATE, Date.now().toString());
  console.log(`Cache for ${section} cleared`);
}

export default {
  clearAllCache,
  clearSectionCache,
  STORAGE_KEYS
}; 
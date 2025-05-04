const db = require('../utils/database');

/**
 * Get user profile by ID
 * @param {number} id - User ID
 * @returns {Promise<Object>} User profile
 */
const getUserById = async (id) => {
  const user = await db.getById('users', id);
  return user;
};

/**
 * Get user profile with additional personal info
 * @param {number} id - User ID
 * @returns {Promise<Object>} User profile with personal info
 */
const getUserProfileById = async (id) => {
  const sql = `
    SELECT u.*, 
           p.bio, p.location, p.website, p.job_title, p.phone,
           p.hero_greeting, p.hero_description, p.hero_button_text,
           p.hero_stats, p.about_image_url
    FROM users u
    LEFT JOIN user_profiles p ON u.id = p.user_id
    WHERE u.id = ?
  `;
  
  const results = await db.query(sql, [id]);
  return results[0] || null;
};

/**
 * Update user's basic information
 * @param {number} id - User ID
 * @param {Object} userData - User data to update
 * @returns {Promise<Object>} Updated user
 */
const updateUser = async (id, userData) => {
  return await db.update('users', id, userData);
};

/**
 * Create or update user profile
 * @param {number} userId - User ID
 * @param {Object} profileData - Profile data
 * @returns {Promise<Object>} Updated profile
 */
const updateUserProfile = async (userId, profileData) => {
  // Check if profile exists
  const checkSql = 'SELECT id FROM user_profiles WHERE user_id = ?';
  const profiles = await db.query(checkSql, [userId]);
  
  if (profiles.length > 0) {
    // Update existing profile
    return await db.update('user_profiles', profiles[0].id, {
      ...profileData,
      user_id: userId
    });
  } else {
    // Create new profile
    return await db.insert('user_profiles', {
      ...profileData,
      user_id: userId
    });
  }
};

/**
 * Update user social links
 * @param {number} userId - User ID
 * @param {Object} socialData - Social links data
 * @returns {Promise<Object>} Updated social links
 */
const updateUserSocialLinks = async (userId, socialData) => {
  // Check if social links exist
  const checkSql = 'SELECT id FROM user_social_links WHERE user_id = ?';
  const links = await db.query(checkSql, [userId]);
  
  if (links.length > 0) {
    // Update existing links
    return await db.update('user_social_links', links[0].id, {
      ...socialData,
      user_id: userId
    });
  } else {
    // Create new links
    return await db.insert('user_social_links', {
      ...socialData,
      user_id: userId
    });
  }
};

/**
 * Get user's social links
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Social links
 */
const getUserSocialLinks = async (userId) => {
  const links = await db.getAll('user_social_links', {
    where: { user_id: userId }
  });
  return links[0] || null;
};

/**
 * Get user's hero stats
 * @param {number} userId - User ID
 * @returns {Promise<Array>} Hero stats
 */
const getUserHeroStats = async (userId) => {
  return await db.getAll('user_hero_stats', {
    where: { user_id: userId },
    orderBy: 'display_order ASC'
  });
};

/**
 * Update user's hero stats
 * @param {number} userId - User ID
 * @param {Array} stats - Hero stats
 * @returns {Promise<boolean>} Success status
 */
const updateUserHeroStats = async (userId, stats) => {
  // First delete all existing stats
  const deleteSql = 'DELETE FROM user_hero_stats WHERE user_id = ?';
  await db.query(deleteSql, [userId]);
  
  // Insert new stats
  if (stats && stats.length > 0) {
    for (let i = 0; i < stats.length; i++) {
      const stat = stats[i];
      await db.insert('user_hero_stats', {
        user_id: userId,
        value: stat.value,
        label: stat.label,
        display_order: i
      });
    }
  }
  
  return true;
};

module.exports = {
  getUserById,
  getUserProfileById,
  updateUser,
  updateUserProfile,
  updateUserSocialLinks,
  getUserSocialLinks,
  getUserHeroStats,
  updateUserHeroStats
}; 
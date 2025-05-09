const db = require('../config/db'); // Your MySQL connection

const Hero = {
  async getHero() {
    // Get hero main data
    const [rows] = await db.query('SELECT * FROM hero LIMIT 1');
    if (!rows.length) return null;
    const hero = rows[0];

    // Get stats
    const [stats] = await db.query('SELECT value, label FROM hero_stats WHERE hero_id = ?', [hero.id]);
    hero.stats = stats;

    return hero;
  },

  async updateHero(data) {
    // Update hero main table
    const {
      greeting, name, last_name, description, job_title, button_text,
      profile_image_url, email, phone, location,
      linkedin_url, github_url, twitter_url, instagram_url, stats
    } = data;

    // Update hero table (assume id=1)
    await db.query(
      `UPDATE hero SET greeting=?, name=?, last_name=?, description=?, job_title=?, button_text=?, profile_image_url=?, email=?, phone=?, location=?, linkedin_url=?, github_url=?, twitter_url=?, instagram_url=? WHERE id=1`,
      [greeting, name, last_name, description, job_title, button_text, profile_image_url, email, phone, location, linkedin_url, github_url, twitter_url, instagram_url]
    );

    // Update stats: delete old, insert new
    await db.query('DELETE FROM hero_stats WHERE hero_id=1');
    for (const stat of stats) {
      if (stat.value && stat.label) {
        await db.query('INSERT INTO hero_stats (hero_id, value, label) VALUES (?, ?, ?)', [1, stat.value, stat.label]);
      }
    }
  }
};

module.exports = Hero;
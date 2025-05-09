const db = require('../config/db'); // Your MySQL connection

const Hero = {
  async getHero() {
    // Get hero main data
    console.log('Fetching hero data...');
    const [rows] = await db.query('SELECT * FROM hero LIMIT 1');
    if (!rows.length) return null;
    const hero = rows[0];
    
    // Debug log for about fields
    console.log('Hero data retrieved with about fields:', {
      bio: hero.bio,
      aboutImageUrl: hero.aboutImageUrl
    });

    // Get stats
    const [stats] = await db.query('SELECT value, label FROM hero_stats WHERE hero_id = ?', [hero.id]);
    hero.stats = stats;

    return hero;
  },

  async updateHero(data) {
    // Debug log for about fields in update
    console.log('Updating hero with about fields:', {
      bio: data.bio,
      aboutImageUrl: data.aboutImageUrl
    });
    
    // Update hero main table
    const {
      greeting, name, last_name, description, job_title, button_text,
      profile_image_url, email, phone, location, bio, aboutImageUrl,
      linkedin_url, github_url, twitter_url, instagram_url, stats
    } = data;

    try {
      // First update the main fields
      const mainUpdateQuery = `
        UPDATE hero SET 
          greeting=?, 
          name=?, 
          last_name=?, 
          description=?, 
          job_title=?, 
          button_text=?,
          profile_image_url=?, 
          email=?, 
          phone=?, 
          location=?, 
          linkedin_url=?, 
          github_url=?, 
          twitter_url=?, 
          instagram_url=? 
        WHERE id=1
      `;
      
      const mainParams = [
        greeting, 
        name, 
        last_name, 
        description, 
        job_title, 
        button_text,
        profile_image_url, 
        email, 
        phone, 
        location, 
        linkedin_url, 
        github_url, 
        twitter_url, 
        instagram_url
      ];
      
      console.log('Main update query:', mainUpdateQuery);
      console.log('Main update params:', mainParams);
      
      const [mainResult] = await db.query(mainUpdateQuery, mainParams);
      console.log('Main update result:', mainResult);
      
      // Now specifically update the bio and aboutImageUrl with a separate query
      console.log('Executing separate update for bio and aboutImageUrl...');
      const aboutUpdateQuery = 'UPDATE hero SET bio=?, aboutImageUrl=? WHERE id=1';
      console.log('About update query:', aboutUpdateQuery);
      console.log('About update params:', [bio || '', aboutImageUrl || '']);
      
      const [aboutResult] = await db.query(aboutUpdateQuery, [bio || '', aboutImageUrl || '']);
      console.log('About update result:', aboutResult);
      
      // Verify the update worked
      const [verification] = await db.query('SELECT bio, aboutImageUrl FROM hero WHERE id=1');
      console.log('Verification after update:', verification[0]);

      // Update stats: delete old, insert new
      await db.query('DELETE FROM hero_stats WHERE hero_id=1');
      for (const stat of stats) {
        if (stat.value && stat.label) {
          await db.query('INSERT INTO hero_stats (hero_id, value, label) VALUES (?, ?, ?)', [1, stat.value, stat.label]);
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error in updateHero:', error);
      throw error;
    }
  }
};

module.exports = Hero;
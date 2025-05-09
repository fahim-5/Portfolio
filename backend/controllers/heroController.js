const Hero = require('../models/heroModel');

const heroController = {
  async getHero(req, res) {
    try {
      console.log('heroController: Getting hero data...');
      const hero = await Hero.getHero();
      
      if (!hero) {
        console.log('heroController: No hero data found');
        return res.status(404).json({ success: false, message: 'Hero not found' });
      }
      
      console.log('heroController: Hero data retrieved successfully');
      console.log('heroController: About fields:', {
        bio: hero.bio,
        aboutImageUrl: hero.aboutImageUrl
      });
      
      res.json(hero);
    } catch (err) {
      console.error('heroController getHero error:', err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  async updateHero(req, res) {
    try {
      console.log('heroController: Updating hero data...');
      console.log('heroController: Request body:', req.body);
      console.log('heroController: About fields in request:', {
        bio: req.body.bio,
        aboutImageUrl: req.body.aboutImageUrl
      });
      
      // Validate that required fields are present
      if (!req.body) {
        return res.status(400).json({ success: false, message: 'No data provided' });
      }
      
      // Ensure about fields are included
      const dataToUpdate = {
        ...req.body,
        bio: req.body.bio || '',
        aboutImageUrl: req.body.aboutImageUrl || ''
      };
      
      await Hero.updateHero(dataToUpdate);
      console.log('heroController: Hero updated successfully');
      
      res.json({ success: true, message: 'Hero updated' });
    } catch (err) {
      console.error('heroController updateHero error:', err);
      res.status(500).json({ 
        success: false, 
        message: 'Server error', 
        error: err.message 
      });
    }
  }
};

module.exports = heroController;
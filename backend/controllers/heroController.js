const Hero = require('../models/heroModel');

const heroController = {
  async getHero(req, res) {
    try {
      const hero = await Hero.getHero();
      if (!hero) return res.status(404).json({ success: false, message: 'Hero not found' });
      res.json(hero);
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  async updateHero(req, res) {
    try {
      await Hero.updateHero(req.body);
      res.json({ success: true, message: 'Hero updated' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
};

module.exports = heroController;
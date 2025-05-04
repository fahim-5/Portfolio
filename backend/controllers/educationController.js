const Education = require('../models/Education');

const educationController = {
  getEducation: async (req, res) => {
    try {
      const educations = await Education.findAll({
        where: { user_id: req.user.id },
        order: [['created_at', 'ASC']]
      });
      res.json(educations);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching education' });
    }
  },

  createEducation: async (req, res) => {
    try {
      const education = await Education.create({
        ...req.body,
        userId: req.user.id
      });
      res.status(201).json(education);
    } catch (error) {
      res.status(400).json({ message: 'Error creating education entry' });
    }
  },

  updateEducation: async (req, res) => {
    try {
      const education = await Education.findOne({
        where: { id: req.params.id, user_id: req.user.id }
      });
      
      if (!education) return res.status(404).json({ message: 'Education entry not found' });
      
      const updated = await education.update(req.body);
      res.json(updated);
    } catch (error) {
      res.status(400).json({ message: 'Error updating education entry' });
    }
  },

  deleteEducation: async (req, res) => {
    try {
      const education = await Education.findOne({
        where: { id: req.params.id, user_id: req.user.id }
      });
      
      if (!education) return res.status(404).json({ message: 'Education entry not found' });
      
      await education.destroy();
      res.json({ message: 'Education entry deleted' });
    } catch (error) {
      res.status(400).json({ message: 'Error deleting education entry' });
    }
  }
};

module.exports = educationController;
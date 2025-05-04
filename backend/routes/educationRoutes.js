const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Education = require('../models/Education');

// Protected POST route
router.post('/', auth, async (req, res) => {
  try {
    const education = await Education.create(req.body);
    res.status(201).json(education);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Public GET route
router.get('/', async (req, res) => {
  try {
    const educations = await Education.findAll();
    res.json(educations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
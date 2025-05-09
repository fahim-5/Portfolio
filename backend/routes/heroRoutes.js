const express = require('express');
const router = express.Router();
const heroController = require('../controllers/heroController');

// GET /api/admin/hero
router.get('/', heroController.getHero);

// PUT /api/admin/hero
router.put('/', heroController.updateHero);

module.exports = router;
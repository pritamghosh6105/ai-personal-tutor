const express = require('express');
const router = express.Router();
const { getDailyQuote, getRandomQuote } = require('../controllers/quoteController');
const { protect } = require('../middleware/auth');

// Get daily motivational quote
router.get('/daily', protect, getDailyQuote);

// Get random motivational quote
router.get('/random', protect, getRandomQuote);

module.exports = router;

const express = require('express');
const router = express.Router();
const { searchVideos } = require('../controllers/youtubeController');
const { protect } = require('../middleware/auth');

// All routes are protected (require authentication)
router.use(protect);

// @route   GET /api/youtube/search
// @desc    Search YouTube videos
// @access  Private
router.get('/search', searchVideos);

module.exports = router;

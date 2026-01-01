const express = require('express');
const router = express.Router();
const { searchBookReferences } = require('../controllers/booksController');
const { protect } = require('../middleware/auth');

// All routes are protected (require authentication)
router.use(protect);

// @route   GET /api/books/search
// @desc    Search books
// @access  Private
router.get('/search', searchBookReferences);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getFlashcards, updateFlashcard } = require('../controllers/flashcardController');
const { protect } = require('../middleware/auth');

router.get('/:topicId', protect, getFlashcards);
router.put('/:id', protect, updateFlashcard);

module.exports = router;

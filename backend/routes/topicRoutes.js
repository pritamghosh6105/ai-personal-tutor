const express = require('express');
const router = express.Router();
const { 
  generateTopic, 
  getTopics, 
  getTopicById, 
  deleteTopic,
  explainSimply,
  explainWithExample,
  explainInLanguage,
  generateKeyPoints,
  extractKeywords,
  askAboutText,
  generateTopicQA,
  toggleBookmark,
  updateNotes,
  updateProgress
} = require('../controllers/topicController');
const { protect } = require('../middleware/auth');

router.post('/generate', protect, generateTopic);
router.get('/', protect, getTopics);
router.get('/:id', protect, getTopicById);
router.delete('/:id', protect, deleteTopic);

// Learning boost endpoints
router.post('/explain-simply', protect, explainSimply);
router.post('/explain-example', protect, explainWithExample);
router.post('/explain-language', protect, explainInLanguage);
router.post('/:id/key-points', protect, generateKeyPoints);
router.post('/:id/keywords', protect, extractKeywords);
router.post('/ask-about-text', protect, askAboutText);
router.post('/:id/generate-qa', protect, generateTopicQA);

// Learning management endpoints
router.put('/:id/bookmark', protect, toggleBookmark);
router.put('/:id/notes', protect, updateNotes);
router.put('/:id/progress', protect, updateProgress);

module.exports = router;

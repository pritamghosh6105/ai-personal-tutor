const express = require('express');
const router = express.Router();
const { askDoubt, getDoubtsByTopic } = require('../controllers/doubtController');
const { protect } = require('../middleware/auth');

router.post('/ask', protect, askDoubt);
router.get('/:topicId', protect, getDoubtsByTopic);

module.exports = router;

const express = require('express');
const router = express.Router();
const { convertTextToSpeech } = require('../controllers/ttsController');
const { protect } = require('../middleware/auth');

router.post('/', protect, convertTextToSpeech);

module.exports = router;

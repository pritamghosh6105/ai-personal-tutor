const { textToSpeech } = require('../services/ttsService');

/**
 * @desc    Convert text to speech
 * @route   POST /api/tts
 * @access  Private
 */
const convertTextToSpeech = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Please provide text' });
    }

    if (text.length > 5000) {
      return res.status(400).json({ message: 'Text is too long (max 5000 characters)' });
    }

    const result = await textToSpeech(text);
    res.json(result);
  } catch (error) {
    console.error('Error in TTS controller:', error);
    res.status(500).json({ 
      message: 'Failed to convert text to speech',
      error: error.message 
    });
  }
};

module.exports = {
  convertTextToSpeech
};

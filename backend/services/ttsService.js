const getAudioStream = require('google-tts-api');

/**
 * Convert text to speech URL
 */
const textToSpeech = async (text) => {
  try {
    // Split text into chunks if it's too long (Google TTS has length limits)
    const maxLength = 200;
    const chunks = [];
    
    if (text.length <= maxLength) {
      chunks.push(text);
    } else {
      let currentChunk = '';
      const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [text];
      
      for (const sentence of sentences) {
        if ((currentChunk + sentence).length <= maxLength) {
          currentChunk += sentence;
        } else {
          if (currentChunk) chunks.push(currentChunk);
          currentChunk = sentence;
        }
      }
      if (currentChunk) chunks.push(currentChunk);
    }

    // Generate audio URLs for each chunk
    const audioUrls = [];
    for (const chunk of chunks) {
      const url = getAudioStream(chunk, {
        lang: 'en',
        slow: false,
        host: 'https://translate.google.com'
      });
      audioUrls.push(url);
    }

    return {
      audioUrls,
      chunks: chunks.length,
      text
    };
  } catch (error) {
    console.error('Error in text-to-speech:', error);
    throw new Error('Failed to convert text to speech');
  }
};

module.exports = {
  textToSpeech
};

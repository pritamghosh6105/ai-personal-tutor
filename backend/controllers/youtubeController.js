const { searchYouTubeVideos } = require('../services/youtubeService');

/**
 * @desc    Search YouTube videos for a topic
 * @route   GET /api/youtube/search
 * @access  Private
 */
const searchVideos = async (req, res) => {
  try {
    const { query, maxResults = 5 } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Please provide a search query' });
    }

    console.log('🔍 Searching YouTube videos for:', query);
    
    const videos = await searchYouTubeVideos(query, parseInt(maxResults));
    
    console.log(`✅ Found ${videos.length} videos`);
    
    res.json({
      success: true,
      count: videos.length,
      videos
    });
  } catch (error) {
    console.error('❌ Error in searchVideos controller:', error);
    res.status(500).json({ 
      message: 'Error searching YouTube videos',
      error: error.message 
    });
  }
};

module.exports = {
  searchVideos
};

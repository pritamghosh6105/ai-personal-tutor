const axios = require('axios');

/**
 * Search for YouTube videos related to a topic
 * @param {string} query - The search query
 * @param {number} maxResults - Maximum number of results (default: 5)
 * @returns {Promise<Array>} - Array of video objects
 */
const searchYouTubeVideos = async (query, maxResults = 5) => {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    
    if (!apiKey || apiKey === 'YOUR_YOUTUBE_API_KEY_HERE') {
      console.warn('⚠️ YouTube API key not configured');
      // Return mock data when API key is not available
      return getMockVideos(query);
    }

    // Enhance query with educational keywords for better results
    const enhancedQuery = `${query} tutorial explained learn course`;

    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: enhancedQuery,
        type: 'video',
        maxResults: maxResults,
        key: apiKey,
        order: 'relevance',
        videoEmbeddable: 'true',
        videoDuration: 'medium', // Filter for videos between 4-20 minutes
        relevanceLanguage: 'en',
        safeSearch: 'strict',
        videoDefinition: 'any',
        videoCaption: 'any'
      }
    });

    const videos = response.data.items.map(item => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      embedUrl: `https://www.youtube.com/embed/${item.id.videoId}`
    }));

    return videos;
  } catch (error) {
    console.error('❌ Error fetching YouTube videos:', error.message);
    
    // Fallback to mock data on error
    return getMockVideos(query);
  }
};

/**
 * Get mock video data when API is not available
 * @param {string} query - The search query
 * @returns {Array} - Array of mock video objects
 */
const getMockVideos = (query) => {
  // Return empty array or mock data
  console.log('📺 Returning mock YouTube videos for:', query);
  
  return [
    {
      videoId: 'dQw4w9WgXcQ',
      title: `Learn ${query} - Complete Tutorial`,
      description: `A comprehensive tutorial covering all aspects of ${query}. Perfect for beginners and advanced learners.`,
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
      channelTitle: 'Educational Channel',
      publishedAt: new Date().toISOString(),
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
      embedUrl: null // Don't allow embedding for mock videos
    },
    {
      videoId: 'sample2',
      title: `${query} Explained Simply`,
      description: `Easy to understand explanation of ${query} with real-world examples.`,
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
      channelTitle: 'Learn With Us',
      publishedAt: new Date().toISOString(),
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
      embedUrl: null
    }
  ];
};

module.exports = {
  searchYouTubeVideos
};

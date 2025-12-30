const Doubt = require('../models/Doubt');
const Topic = require('../models/Topic');
const Lesson = require('../models/Lesson');
const { answerDoubt } = require('../services/aiService');

/**
 * @desc    Ask a doubt/question
 * @route   POST /api/doubts/ask
 * @access  Private
 */
const askDoubt = async (req, res) => {
  try {
    const { topicId, question } = req.body;

    if (!topicId || !question) {
      return res.status(400).json({ message: 'Please provide topicId and question' });
    }

    // Verify topic exists and user has access
    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    if (topic.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Get lesson content for context
    const lesson = await Lesson.findOne({ topicId });
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Generate answer using AI
    console.log('🤖 Generating AI answer to doubt:', question.substring(0, 50) + '...');
    console.log('📚 Topic:', topic.title);
    
    let answer;
    try {
      answer = await answerDoubt(question, topic.title, lesson.content);
      console.log('✅ AI answer generated successfully');
    } catch (aiError) {
      console.error('❌ AI service error:', aiError.message);
      // Return specific error to user
      return res.status(503).json({ 
        message: aiError.message || 'AI service temporarily unavailable',
        error: 'AI_SERVICE_ERROR'
      });
    }

    // Save doubt and answer
    const doubt = await Doubt.create({
      topicId,
      userId: req.user._id,
      question,
      answer
    });

    console.log('💾 Doubt saved to database');
    res.status(201).json(doubt);
  } catch (error) {
    console.error('❌ Error in askDoubt controller:', error);
    res.status(500).json({ 
      message: 'Failed to process your question. Please try again.',
      error: error.message 
    });
  }
};

/**
 * @desc    Get all doubts for a topic
 * @route   GET /api/doubts/:topicId
 * @access  Private
 */
const getDoubtsByTopic = async (req, res) => {
  try {
    const { topicId } = req.params;

    // Verify topic exists and user has access
    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    if (topic.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Get all doubts for this topic
    const doubts = await Doubt.find({ topicId }).sort({ createdAt: -1 });

    res.json(doubts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  askDoubt,
  getDoubtsByTopic
};

const Topic = require('../models/Topic');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const Flashcard = require('../models/Flashcard');
const { 
  generateLesson, 
  generateQuiz, 
  generateFlashcards,
  explainSimply: explainSimplyAI,
  explainWithExample: explainWithExampleAI,
  explainInLanguage: explainInLanguageAI,
  generateKeyPoints: generateKeyPointsAI,
  extractKeywords: extractKeywordsAI,
  askQuestionAboutText: askQuestionAboutTextAI,
  generateQA: generateQAAI
} = require('../services/aiService');

/**
 * @desc    Generate a new topic with AI content
 * @route   POST /api/topics/generate
 * @access  Private
 */
const generateTopic = async (req, res) => {
  try {
    const { title, level } = req.body;

    if (!title || !level) {
      return res.status(400).json({ message: 'Please provide title and level' });
    }

    // Create topic
    const topic = await Topic.create({
      userId: req.user._id,
      title,
      level
    });

    // Generate lesson content using AI
    console.log('🤖 Generating lesson content...');
    const lessonContent = await generateLesson(title, level);

    // Save lesson
    const lesson = await Lesson.create({
      topicId: topic._id,
      content: lessonContent
    });

    // Generate quiz questions
    console.log('🤖 Generating quiz questions...');
    const quizQuestions = await generateQuiz(title, level, lessonContent);

    // Save quiz
    const quiz = await Quiz.create({
      topicId: topic._id,
      questions: quizQuestions
    });

    // Generate flashcards
    console.log('🤖 Generating flashcards...');
    const flashcardsData = await generateFlashcards(title, level, lessonContent);

    // Save flashcards
    const flashcards = await Flashcard.insertMany(
      flashcardsData.map(fc => ({
        topicId: topic._id,
        userId: req.user._id,
        front: fc.front,
        back: fc.back
      }))
    );

    res.status(201).json({
      topic,
      lesson,
      quiz,
      flashcards,
      message: 'Topic generated successfully!'
    });
  } catch (error) {
    console.error('Error generating topic:', error);
    res.status(500).json({ 
      message: 'Failed to generate topic',
      error: error.message 
    });
  }
};

/**
 * @desc    Get all topics for logged-in user
 * @route   GET /api/topics
 * @access  Private
 */
const getTopics = async (req, res) => {
  try {
    const topics = await Topic.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(topics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get single topic with all content
 * @route   GET /api/topics/:id
 * @access  Private
 */
const getTopicById = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    // Check ownership
    if (topic.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Get associated content in parallel for faster loading
    const [lesson, quiz, flashcards] = await Promise.all([
      Lesson.findOne({ topicId: topic._id }).lean(),
      Quiz.findOne({ topicId: topic._id }).lean(),
      Flashcard.find({ topicId: topic._id }).lean()
    ]);

    res.json({
      topic,
      lesson,
      quiz,
      flashcards
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Delete a topic and all associated content
 * @route   DELETE /api/topics/:id
 * @access  Private
 */
const deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    // Check ownership
    if (topic.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete all associated content
    await Lesson.deleteMany({ topicId: topic._id });
    await Quiz.deleteMany({ topicId: topic._id });
    await Flashcard.deleteMany({ topicId: topic._id });
    await topic.deleteOne();

    res.json({ message: 'Topic deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get simple explanation
 * @route   POST /api/topics/explain-simply
 * @access  Private
 */
const explainSimply = async (req, res) => {
  try {
    const { text, topicTitle } = req.body;
    if (!text) return res.status(400).json({ message: 'Text required' });

    const explanation = await explainSimplyAI(text, topicTitle);
    res.json({ explanation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get explanation with example
 * @route   POST /api/topics/explain-example
 * @access  Private
 */
const explainWithExample = async (req, res) => {
  try {
    const { text, topicTitle } = req.body;
    if (!text) return res.status(400).json({ message: 'Text required' });

    const explanation = await explainWithExampleAI(text, topicTitle);
    res.json({ explanation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Explain in Indian language
 * @route   POST /api/topics/explain-language
 * @access  Private
 */
const explainInLanguage = async (req, res) => {
  try {
    const { text, language, topicTitle } = req.body;
    if (!text || !language) return res.status(400).json({ message: 'Text and language required' });

    const explanation = await explainInLanguageAI(text, language, topicTitle);
    res.json({ explanation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Generate key points summary
 * @route   POST /api/topics/:id/key-points
 * @access  Private
 */
const generateKeyPoints = async (req, res) => {
  try {
    const lesson = await Lesson.findOne({ topicId: req.params.id });
    const topic = await Topic.findById(req.params.id);
    
    if (!lesson || !topic) return res.status(404).json({ message: 'Lesson not found' });

    const keyPoints = await generateKeyPointsAI(lesson.content, topic.title);
    res.json({ keyPoints });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Extract exam keywords
 * @route   POST /api/topics/:id/keywords
 * @access  Private
 */
const extractKeywords = async (req, res) => {
  try {
    const lesson = await Lesson.findOne({ topicId: req.params.id });
    const topic = await Topic.findById(req.params.id);
    
    if (!lesson || !topic) return res.status(404).json({ message: 'Lesson not found' });

    const keywords = await extractKeywordsAI(lesson.content, topic.title);
    res.json({ keywords });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Ask question about selected text
 * @route   POST /api/topics/ask-about-text
 * @access  Private
 */
const askAboutText = async (req, res) => {
  try {
    const { text, question, topicTitle } = req.body;
    if (!text || !question) return res.status(400).json({ message: 'Text and question required' });

    const answer = await askQuestionAboutTextAI(text, question, topicTitle);
    res.json({ answer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Generate Q&A for topic
 * @route   POST /api/topics/:id/generate-qa
 * @access  Private
 */
const generateTopicQA = async (req, res) => {
  try {
    console.log('📝 Generating Q&A for topic:', req.params.id);
    const { id } = req.params;
    const lesson = await Lesson.findOne({ topic: id });
    const topic = await Topic.findById(id);
    
    if (!lesson || !topic) {
      console.log('❌ Lesson or topic not found');
      return res.status(404).json({ message: 'Lesson not found' });
    }
    
    console.log('✓ Found topic:', topic.title);
    
    // Combine lesson content
    const lessonText = `
${lesson.content.introduction}

${lesson.content.steps.map(s => `${s.title}: ${s.content}`).join('\n\n')}

Key Points:
${lesson.content.summary.join('\n')}
    `.trim();
    
    console.log('🤖 Calling AI to generate Q&A...');
    const qaList = await generateQAAI(lessonText, topic.title);
    console.log('✅ Q&A generated:', qaList.length, 'items');
    res.json({ qaList });
  } catch (error) {
    console.error('❌ Error generating Q&A:', error.message);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Toggle bookmark status
 * @route   PUT /api/topics/:id/bookmark
 * @access  Private
 */
const toggleBookmark = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) return res.status(404).json({ message: 'Topic not found' });
    if (topic.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    topic.isBookmarked = !topic.isBookmarked;
    await topic.save();
    res.json({ isBookmarked: topic.isBookmarked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update topic notes
 * @route   PUT /api/topics/:id/notes
 * @access  Private
 */
const updateNotes = async (req, res) => {
  try {
    const { notes } = req.body;
    const topic = await Topic.findById(req.params.id);
    if (!topic) return res.status(404).json({ message: 'Topic not found' });
    if (topic.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    topic.notes = notes;
    await topic.save();
    res.json({ notes: topic.notes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update progress status
 * @route   PUT /api/topics/:id/progress
 * @access  Private
 */
const updateProgress = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['not-started', 'in-progress', 'understood', 'revise-later'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const topic = await Topic.findById(req.params.id);
    if (!topic) return res.status(404).json({ message: 'Topic not found' });
    if (topic.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    topic.progressStatus = status;
    await topic.save();
    res.json({ progressStatus: topic.progressStatus });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};

const Flashcard = require('../models/Flashcard');
const Topic = require('../models/Topic');

/**
 * @desc    Get flashcards for a topic
 * @route   GET /api/flashcards/:topicId
 * @access  Private
 */
const getFlashcards = async (req, res) => {
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

    const flashcards = await Flashcard.find({ topicId });
    res.json(flashcards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Update flashcard status
 * @route   PUT /api/flashcards/:id
 * @access  Private
 */
const updateFlashcard = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['new', 'learning', 'mastered'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const flashcard = await Flashcard.findById(req.params.id);

    if (!flashcard) {
      return res.status(404).json({ message: 'Flashcard not found' });
    }

    // Check ownership
    if (flashcard.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    flashcard.status = status;
    await flashcard.save();

    res.json(flashcard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getFlashcards,
  updateFlashcard
};

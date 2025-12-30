const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  level: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  isBookmarked: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    default: ''
  },
  progressStatus: {
    type: String,
    enum: ['not-started', 'in-progress', 'understood', 'revise-later'],
    default: 'not-started'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Topic', topicSchema);

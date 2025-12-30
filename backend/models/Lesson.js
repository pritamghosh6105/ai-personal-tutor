const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  content: {
    introduction: {
      type: String,
      required: true
    },
    steps: [{
      title: String,
      content: String
    }],
    analogies: [{
      type: String
    }],
    summary: [{
      type: String
    }]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Lesson', lessonSchema);

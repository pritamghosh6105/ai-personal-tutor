const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');

// Load env vars from root directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Connect to database
connectDB();

// Initialize express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/topics', require('./routes/topicRoutes'));
app.use('/api/doubts', require('./routes/doubtRoutes'));
app.use('/api/flashcards', require('./routes/flashcardRoutes'));
app.use('/api/tts', require('./routes/ttsRoutes'));
app.use('/api/quotes', require('./routes/quoteRoutes'));
app.use('/api/youtube', require('./routes/youtubeRoutes'));
app.use('/api/books', require('./routes/booksRoutes'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'AI Personal Tutor API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
});

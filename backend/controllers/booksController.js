const { searchBooks } = require('../services/booksService');

/**
 * @desc    Search books for a topic
 * @route   GET /api/books/search
 * @access  Private
 */
const searchBookReferences = async (req, res) => {
  try {
    const { query, maxResults = 10 } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Please provide a search query' });
    }

    console.log('📚 Searching books for:', query);
    
    const books = await searchBooks(query, parseInt(maxResults));
    
    console.log(`✅ Found ${books.length} books`);
    
    res.json({
      success: true,
      count: books.length,
      books
    });
  } catch (error) {
    console.error('❌ Error in searchBookReferences controller:', error);
    res.status(500).json({ 
      message: 'Error searching books',
      error: error.message 
    });
  }
};

module.exports = {
  searchBookReferences
};

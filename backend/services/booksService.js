const axios = require('axios');

/**
 * Search for books related to a topic using Google Books API
 * @param {string} query - The search query
 * @param {number} maxResults - Maximum number of results (default: 10)
 * @returns {Promise<Array>} - Array of book objects
 */
const searchBooks = async (query, maxResults = 10) => {
  try {
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    
    // Google Books API works without API key but with limits
    // With API key, you get higher quota
    const baseUrl = 'https://www.googleapis.com/books/v1/volumes';
    
    const params = {
      q: `${query} programming OR computer science OR tutorial OR guide`,
      maxResults: maxResults,
      orderBy: 'relevance',
      printType: 'books',
      langRestrict: 'en'
    };

    if (apiKey && apiKey !== 'YOUR_GOOGLE_BOOKS_API_KEY_HERE') {
      params.key = apiKey;
    }

    const response = await axios.get(baseUrl, { params });

    if (!response.data.items || response.data.items.length === 0) {
      console.log('⚠️ No books found for query:', query);
      return getMockBooks(query);
    }

    const books = response.data.items.map(item => {
      const volumeInfo = item.volumeInfo;
      const saleInfo = item.saleInfo;
      const accessInfo = item.accessInfo;
      
      // Extract ISBN for alternative sources
      const isbn13 = volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier || '';
      const isbn10 = volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_10')?.identifier || '';
      const isbn = isbn13 || isbn10;
      
      // Determine available formats
      const formats = [];
      if (accessInfo?.pdf?.isAvailable) formats.push('PDF');
      if (accessInfo?.epub?.isAvailable) formats.push('EPUB');
      if (volumeInfo.printType === 'BOOK') formats.push('Print');
      
      // Get download links if available
      const downloadLinks = {};
      if (accessInfo?.pdf?.acsTokenLink) downloadLinks.pdf = accessInfo.pdf.acsTokenLink;
      if (accessInfo?.epub?.acsTokenLink) downloadLinks.epub = accessInfo.epub.acsTokenLink;
      if (accessInfo?.pdf?.downloadLink) downloadLinks.pdfDownload = accessInfo.pdf.downloadLink;
      if (accessInfo?.epub?.downloadLink) downloadLinks.epubDownload = accessInfo.epub.downloadLink;
      
      // Generate alternative source links
      const alternativeSources = {};
      if (isbn) {
        alternativeSources.openLibrary = `https://openlibrary.org/isbn/${isbn}`;
        alternativeSources.archive = `https://archive.org/search.php?query=${encodeURIComponent(volumeInfo.title + ' ' + (volumeInfo.authors?.[0] || ''))}`;
        alternativeSources.worldcat = `https://www.worldcat.org/search?q=${encodeURIComponent(volumeInfo.title)}`;
      } else {
        alternativeSources.openLibrary = `https://openlibrary.org/search?q=${encodeURIComponent(volumeInfo.title)}`;
        alternativeSources.archive = `https://archive.org/search.php?query=${encodeURIComponent(volumeInfo.title)}`;
        alternativeSources.worldcat = `https://www.worldcat.org/search?q=${encodeURIComponent(volumeInfo.title)}`;
      }
      
      return {
        id: item.id,
        title: volumeInfo.title || 'Unknown Title',
        authors: volumeInfo.authors || ['Unknown Author'],
        publisher: volumeInfo.publisher || 'Unknown Publisher',
        publishedDate: volumeInfo.publishedDate || 'Unknown',
        description: volumeInfo.description || 'No description available.',
        pageCount: volumeInfo.pageCount || 0,
        categories: volumeInfo.categories || [],
        averageRating: volumeInfo.averageRating || 0,
        ratingsCount: volumeInfo.ratingsCount || 0,
        thumbnail: volumeInfo.imageLinks?.thumbnail || volumeInfo.imageLinks?.smallThumbnail || '',
        previewLink: volumeInfo.previewLink || '',
        infoLink: volumeInfo.infoLink || '',
        buyLink: saleInfo?.buyLink || '',
        isEbook: saleInfo?.isEbook || false,
        price: saleInfo?.listPrice ? `${saleInfo.listPrice.amount} ${saleInfo.listPrice.currencyCode}` : 'N/A',
        isbn: isbn,
        formats: formats,
        downloadLinks: downloadLinks,
        alternativeSources: alternativeSources,
        accessViewStatus: accessInfo?.accessViewStatus || 'NONE',
        publicDomain: accessInfo?.publicDomain || false
      };
    });

    console.log(`✅ Found ${books.length} books for: ${query}`);
    return books;
  } catch (error) {
    console.error('❌ Error fetching books:', error.message);
    return getMockBooks(query);
  }
};

/**
 * Get mock book data when API is not available or fails
 * @param {string} query - The search query
 * @returns {Array} - Array of mock book objects
 */
const getMockBooks = (query) => {
  console.log('📚 Returning mock books for:', query);
  
  return [
    {
      id: 'mock1',
      title: `Complete Guide to ${query}`,
      authors: ['Expert Author'],
      publisher: 'Educational Press',
      publishedDate: '2024',
      description: `A comprehensive guide covering all aspects of ${query}. Perfect for beginners and advanced learners alike.`,
      pageCount: 450,
      categories: ['Education', 'Technology'],
      averageRating: 4.5,
      ratingsCount: 125,
      thumbnail: 'https://via.placeholder.com/128x192/4A90E2/FFFFFF?text=Book',
      previewLink: `https://www.google.com/search?q=${encodeURIComponent(query + ' book')}`,
      infoLink: `https://www.google.com/search?q=${encodeURIComponent(query + ' book')}`,
      buyLink: '',
      isEbook: true,
      price: 'N/A',
      isbn: '',
      formats: ['PDF', 'EPUB'],
      downloadLinks: {},
      alternativeSources: {
        openLibrary: `https://openlibrary.org/search?q=${encodeURIComponent(query)}`,
        archive: `https://archive.org/search.php?query=${encodeURIComponent(query)}`,
        worldcat: `https://www.worldcat.org/search?q=${encodeURIComponent(query)}`
      },
      accessViewStatus: 'NONE',
      publicDomain: false
    },
    {
      id: 'mock2',
      title: `${query}: From Basics to Advanced`,
      authors: ['John Doe', 'Jane Smith'],
      publisher: 'Tech Books',
      publishedDate: '2023',
      description: `Master ${query} with this step-by-step guide that takes you from foundational concepts to advanced techniques.`,
      pageCount: 320,
      categories: ['Education'],
      averageRating: 4.2,
      ratingsCount: 89,
      thumbnail: 'https://via.placeholder.com/128x192/E24A90/FFFFFF?text=Book',
      previewLink: `https://www.google.com/search?q=${encodeURIComponent(query + ' book')}`,
      infoLink: `https://www.google.com/search?q=${encodeURIComponent(query + ' book')}`,
      buyLink: '',
      isEbook: false,
      price: 'N/A',
      isbn: '',
      formats: ['Print'],
      downloadLinks: {},
      alternativeSources: {
        openLibrary: `https://openlibrary.org/search?q=${encodeURIComponent(query)}`,
        archive: `https://archive.org/search.php?query=${encodeURIComponent(query)}`,
        worldcat: `https://www.worldcat.org/search?q=${encodeURIComponent(query)}`
      },
      accessViewStatus: 'NONE',
      publicDomain: false
    }
  ];
};

module.exports = {
  searchBooks
};

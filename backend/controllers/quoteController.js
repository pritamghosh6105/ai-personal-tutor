const motivationalQuotes = [
  "The expert in anything was once a beginner.",
  "Learning is not attained by chance, it must be sought for with ardor and diligence.",
  "Education is the most powerful weapon which you can use to change the world.",
  "The beautiful thing about learning is that no one can take it away from you.",
  "Live as if you were to die tomorrow. Learn as if you were to live forever.",
  "An investment in knowledge pays the best interest.",
  "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.",
  "Learning never exhausts the mind.",
  "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
  "Education is not preparation for life; education is life itself.",
  "The only person who is educated is the one who has learned how to learn and change.",
  "Develop a passion for learning. If you do, you will never cease to grow.",
  "Tell me and I forget. Teach me and I remember. Involve me and I learn.",
  "The mind is not a vessel to be filled, but a fire to be kindled.",
  "Learning is a treasure that will follow its owner everywhere.",
  "In learning you will teach, and in teaching you will learn.",
  "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.",
  "The roots of education are bitter, but the fruit is sweet.",
  "Anyone who stops learning is old, whether at twenty or eighty.",
  "Don't let what you cannot do interfere with what you can do.",
  "Success is the sum of small efforts repeated day in and day out.",
  "The secret of getting ahead is getting started.",
  "You don't have to be great to start, but you have to start to be great.",
  "Every accomplishment starts with the decision to try.",
  "Believe you can and you're halfway there.",
  "Your only limit is you.",
  "Push yourself, because no one else is going to do it for you.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it.",
  "Success doesn't just find you. You have to go out and get it.",
  "The harder you work for something, the greater you'll feel when you achieve it.",
  "Dream bigger. Do bigger.",
  "Don't stop when you're tired. Stop when you're done.",
  "Wake up with determination. Go to bed with satisfaction.",
  "Do something today that your future self will thank you for.",
  "Little things make big days.",
  "It's going to be hard, but hard does not mean impossible.",
  "Don't wait for opportunity. Create it.",
  "Sometimes we're tested not to show our weaknesses, but to discover our strengths.",
  "The key to success is to focus on goals, not obstacles.",
  "Dream it. Believe it. Build it.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "Your limitation—it's only your imagination.",
  "Strive for progress, not perfection.",
  "Knowledge is power, but enthusiasm pulls the switch.",
  "Study while others are sleeping; work while others are loafing.",
  "The expert in anything was once confused.",
  "Learning is a journey, not a destination.",
  "The only way to do great work is to love what you learn.",
  "Your brain is a muscle. Train it daily.",
  "Small steps every day lead to big achievements.",
  "Consistency is the key to mastery.",
  "Every expert was once a beginner who refused to give up.",
  "The more you learn, the more you earn.",
  "Knowledge has no boundaries.",
  "Stay curious, stay hungry, stay learning.",
  "Today's learner is tomorrow's leader.",
  "Learning is not a sprint, it's a marathon.",
  "Your future is created by what you do today, not tomorrow.",
  "Be the change you wish to see in your learning.",
  "The best time to start was yesterday. The next best time is now."
];

// Get daily motivational quote based on date
exports.getDailyQuote = async (req, res) => {
  try {
    // Get current date and use it as seed for consistent daily quote
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    
    // Use day of year to select quote (will be same quote all day)
    const quoteIndex = dayOfYear % motivationalQuotes.length;
    const quote = motivationalQuotes[quoteIndex];
    
    res.json({
      success: true,
      quote: quote,
      date: today.toDateString()
    });
  } catch (error) {
    console.error('Error getting daily quote:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get daily quote',
      error: error.message
    });
  }
};

// Get random motivational quote
exports.getRandomQuote = async (req, res) => {
  try {
    // Get a random quote from the collection
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    const quote = motivationalQuotes[randomIndex];
    
    res.json({
      success: true,
      quote: quote,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting random quote:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get random quote',
      error: error.message
    });
  }
};

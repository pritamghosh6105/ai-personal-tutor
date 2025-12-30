const OpenAI = require('openai');

// Initialize Groq API client (OpenAI-compatible, FREE and FAST!)
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || 'gsk_placeholder',
  baseURL: 'https://api.groq.com/openai/v1',
});

/**
 * Generate a complete lesson using Groq API
 */
const generateLesson = async (title, level) => {
  const prompt = `You are a friendly personal tutor. Create a comprehensive explanation for the topic: "${title}" for a ${level} student.

Structure your response as a JSON object with the following format:
{
  "introduction": "A friendly introduction to the topic (2-3 sentences)",
  "steps": [
    {
      "title": "Step 1 title",
      "content": "Detailed explanation of this step"
    }
  ],
  "analogies": [
    "Real-life analogy 1",
    "Real-life analogy 2"
  ],
  "summary": [
    "Key point 1",
    "Key point 2",
    "Key point 3",
    "Key point 4",
    "Key point 5"
  ]
}

Guidelines:
- Use simple, clear language appropriate for the level
- Include 4-6 steps for the explanation
- Provide 2 real-world analogies
- Create exactly 5 bullet points for the summary
- Make it engaging and easy to understand
- Use concrete examples where possible

Output only valid JSON, no additional text.`;

  try {
    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'You are a helpful tutor. Always respond with valid JSON only, no additional text.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
    });
    
    const content = completion.choices[0].message.content.trim();
    
    // Remove markdown code blocks if present
    const jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const lessonData = JSON.parse(jsonContent);
    
    return lessonData;
  } catch (error) {
    console.error('Error generating lesson:', error);
    throw new Error('Failed to generate lesson content');
  }
};

/**
 * Generate quiz questions using Groq API
 */
const generateQuiz = async (title, level, lessonContent) => {
  const prompt = `Based on the topic "${title}" for a ${level} student, create 5 multiple-choice questions.

Context from the lesson:
${JSON.stringify(lessonContent)}

Structure your response as a JSON object:
{
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Why this answer is correct"
    }
  ]
}

Guidelines:
- Create exactly 5 questions
- Each question should have 4 options
- correctIndex should be 0-3 (array index of correct answer)
- Mix difficulty levels (easy, medium, hard)
- Include clear explanations
- Questions should test understanding, not just memory

Output only valid JSON, no additional text.`;

  try {
    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'You are a helpful tutor. Always respond with valid JSON only, no additional text.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
    });
    
    const content = completion.choices[0].message.content.trim();
    
    // Remove markdown code blocks if present
    const jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const quizData = JSON.parse(jsonContent);
    
    return quizData.questions;
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw new Error('Failed to generate quiz questions');
  }
};

/**
 * Generate flashcards using Groq API
 */
const generateFlashcards = async (title, level, lessonContent) => {
  const prompt = `Based on the topic "${title}" for a ${level} student, create 8 flashcards.

Context from the lesson:
${JSON.stringify(lessonContent)}

Structure your response as a JSON object:
{
  "flashcards": [
    {
      "front": "Question, term, or concept",
      "back": "Answer, definition, or explanation"
    }
  ]
}

Guidelines:
- Create exactly 8 flashcards
- Include key terms, concepts, formulas, or definitions
- Front should be concise (1-2 lines)
- Back should be clear but comprehensive
- Mix different types: definitions, examples, applications
- Ensure they cover the main points of the lesson

Output only valid JSON, no additional text.`;

  try {
    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'You are a helpful tutor. Always respond with valid JSON only, no additional text.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
    });
    
    const content = completion.choices[0].message.content.trim();
    
    // Remove markdown code blocks if present
    const jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const flashcardsData = JSON.parse(jsonContent);
    
    return flashcardsData.flashcards;
  } catch (error) {
    console.error('Error generating flashcards:', error);
    throw new Error('Failed to generate flashcards');
  }
};

/**
 * Answer a doubt/question using Groq API
 */
const answerDoubt = async (question, topicTitle, lessonContent) => {
  // Extract key lesson content for context
  const contextSummary = `
Topic: ${topicTitle}
Introduction: ${lessonContent.introduction}
Key Points: ${lessonContent.summary?.join(', ') || 'N/A'}
`;

  const prompt = `You are an expert AI tutor helping a student learn about "${topicTitle}".

📚 LESSON CONTEXT:
${contextSummary}

❓ STUDENT'S QUESTION:
"${question}"

🎯 YOUR TASK:
Provide a comprehensive, well-formatted answer that:

1. **Directly answers their specific question**
2. **Uses simple, clear language** - No jargon unless necessary
3. **Provides step-by-step explanation** if needed
4. **Includes a real-world example or analogy** to make it relatable
5. **Connects to the lesson content** when relevant
6. **Is encouraging and supportive** - boost their confidence
7. **Suggests next steps** if applicable

✍️ FORMATTING GUIDELINES:
- Start with a brief introduction paragraph
- Use **bold text** for important terms and key concepts
- Break complex answers into clear paragraphs
- Use numbered points (1. 2. 3.) for step-by-step explanations
- Use bullet points (•) for lists of related items
- End with a concluding sentence or encouragement

Write your response in markdown format with proper formatting.`;

  try {
    console.log('🤖 Asking AI to answer doubt about:', topicTitle);
    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { 
          role: 'system', 
          content: 'You are a patient, knowledgeable AI tutor who explains concepts clearly with examples and encouragement. Always provide thoughtful, personalized answers.' 
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });
    
    const answer = completion.choices[0].message.content.trim();
    console.log('✅ AI generated answer successfully');
    return answer;
  } catch (error) {
    console.error('❌ Error answering doubt:', error.message);
    
    // Provide helpful fallback based on error type
    if (error.message.includes('API key')) {
      throw new Error('AI service configuration error. Please contact support.');
    } else if (error.message.includes('rate limit')) {
      throw new Error('Too many questions at once. Please wait a moment and try again.');
    } else {
      throw new Error('Unable to generate answer right now. Please try again in a moment.');
    }
  }
};

/**
 * Generate simple explanation for text
 */
const explainSimply = async (text, topicTitle = '') => {
  const prompt = `Explain this in the SIMPLEST way possible for a student:

Topic: ${topicTitle}
Text: "${text}"

Rules:
- Use everyday language (no jargon)
- Make it short (2-3 sentences max)
- Use simple words a 10-year-old would understand
- Be clear and direct

Simple Explanation:`;

  try {
    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'You simplify complex concepts into easy-to-understand language.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 250,
    });
    
    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error in explainSimply:', error.message);
    throw new Error('Unable to generate simple explanation.');
  }
};

/**
 * Generate explanation with example
 */
const explainWithExample = async (text, topicTitle = '') => {
  const prompt = `Provide a clear real-world EXAMPLE for this concept:

Topic: ${topicTitle}
Concept: "${text}"

Rules:
- Give ONE relatable, practical example from everyday life
- Show HOW it connects to the concept
- Keep it brief (3-4 sentences)
- Make it memorable

Example:`;

  try {
    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'You teach through practical, relatable examples.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 300,
    });
    
    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error in explainWithExample:', error.message);
    throw new Error('Unable to generate example.');
  }
};

/**
 * Translate/Explain in Indian languages
 */
const explainInLanguage = async (text, language, topicTitle = '') => {
  const languageInstructions = {
    hindi: 'Explain in HINDI (देवनागरी script). Use simple Hindi words.',
    hinglish: 'Explain in HINGLISH (Hindi words with English script). Mix Hindi and English naturally like: "Yeh concept bahut simple hai..."'
  };

  const prompt = `${languageInstructions[language]}

Topic: ${topicTitle}
Text to explain: "${text}"

Rules:
- Keep it conversational and easy to understand
- Use simple vocabulary
- 2-4 sentences
- Be natural and friendly

Explanation:`;

  try {
    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: `You are a friendly tutor who explains concepts in ${language}.` },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 400,
    });
    
    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error in explainInLanguage:', error.message);
    throw new Error(`Unable to generate ${language} explanation.`);
  }
};

/**
 * Generate key points summary
 */
const generateKeyPoints = async (lessonContent, topicTitle) => {
  const contentText = `
Introduction: ${lessonContent.introduction}
Steps: ${lessonContent.steps.map(s => s.content).join(' ')}
Summary: ${lessonContent.summary.join(' ')}
  `.substring(0, 3000);

  const prompt = `Extract the MOST IMPORTANT key points from this lesson on "${topicTitle}":

${contentText}

Create 5-7 bullet points that:
- Highlight the core concepts
- Are exam-focused and memorable
- Use clear, concise language
- Include important keywords
- Can be quickly reviewed

Format as bullet points with • symbol.`;

  try {
    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'You extract key learning points for effective revision.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.6,
      max_tokens: 500,
    });
    
    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating key points:', error.message);
    throw new Error('Unable to generate key points.');
  }
};

/**
 * Extract important exam keywords
 */
const extractKeywords = async (lessonContent, topicTitle) => {
  const contentText = `
Introduction: ${lessonContent.introduction}
Steps: ${lessonContent.steps.map(s => s.content).join(' ')}
  `.substring(0, 2500);

  const prompt = `Identify the MOST IMPORTANT exam keywords and terms from this lesson on "${topicTitle}":

${contentText}

Extract 8-12 keywords/terms that:
- Are essential for exams
- Should be memorized
- Are frequently tested
- Represent core concepts

Format: Return as comma-separated terms (e.g., "photosynthesis, chlorophyll, glucose")`;

  try {
    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'You identify critical exam-focused keywords.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.5,
      max_tokens: 200,
    });
    
    const keywords = completion.choices[0].message.content.trim();
    // Convert to array
    return keywords.split(',').map(k => k.trim()).filter(k => k.length > 0);
  } catch (error) {
    console.error('Error extracting keywords:', error.message);
    throw new Error('Unable to extract keywords.');
  }
};

/**
 * Answer question about selected text (context-aware Q&A)
 */
const askQuestionAboutText = async (text, question, topicTitle = '') => {
  const prompt = `You are a helpful tutor. Answer the student's question about this text:

Selected Text: "${text}"

Student's Question: ${question}

Instructions:
- Answer the question directly and helpfully
- Focus on the selected text
- Be educational and clear
- Use simple language
- If asking for meaning/definition, explain what it means
- Don't refuse or redirect unless the question is completely unrelated
- Keep answer to 2-4 sentences

Answer:`;

  try {
    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'You are a friendly and helpful tutor. Answer questions about text selections clearly and concisely. Never refuse reasonable questions.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 400,
    });
    
    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error in askQuestionAboutText:', error.message);
    throw new Error('Unable to answer question right now.');
  }
};

/**
 * Generate Q&A for a topic
 */
const generateQA = async (lessonContent, topicTitle) => {
  const prompt = `Based on this lesson content about "${topicTitle}", generate 5 important questions and their detailed answers that will help students understand the topic better.

Lesson Content:
${lessonContent}

Create questions that:
- Cover key concepts from the lesson
- Are educational and thought-provoking
- Have clear, detailed answers (2-3 sentences each)
- Help reinforce learning

Format your response as a JSON array:
[
  {
    "question": "Question text?",
    "answer": "Detailed answer explaining the concept"
  }
]

Output only valid JSON, no additional text.`;

  try {
    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'You are a helpful tutor creating educational Q&A. Always respond with valid JSON only.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });
    
    const content = completion.choices[0].message.content.trim();
    const jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    return JSON.parse(jsonContent);
  } catch (error) {
    console.error('Error in generateQA:', error.message);
    throw new Error('Unable to generate Q&A right now.');
  }
};

module.exports = {
  generateLesson,
  generateQuiz,
  generateFlashcards,
  answerDoubt,
  explainSimply,
  explainWithExample,
  explainInLanguage,
  generateKeyPoints,
  extractKeywords,
  askQuestionAboutText,
  generateQA
};

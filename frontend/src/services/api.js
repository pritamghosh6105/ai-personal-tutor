import axios from 'axios';

// Use environment variable for API URL in production, fallback to /api for development
const API_BASE = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api` : '/api';

// Topics
export const generateTopic = async (title, level) => {
  const { data } = await axios.post(`${API_BASE}/topics/generate`, {
    title,
    level
  });
  return data;
};

export const getTopics = async () => {
  const { data } = await axios.get(`${API_BASE}/topics`);
  return data;
};

export const getTopicById = async (id) => {
  const { data } = await axios.get(`${API_BASE}/topics/${id}`);
  return data;
};

export const deleteTopic = async (id) => {
  const { data } = await axios.delete(`${API_BASE}/topics/${id}`);
  return data;
};

// Doubts
export const askDoubt = async (topicId, question) => {
  const { data } = await axios.post(`${API_BASE}/doubts/ask`, {
    topicId,
    question
  });
  return data;
};

export const getDoubtsByTopic = async (topicId) => {
  const { data } = await axios.get(`${API_BASE}/doubts/${topicId}`);
  return data;
};

// Flashcards
export const getFlashcards = async (topicId) => {
  const { data } = await axios.get(`${API_BASE}/flashcards/${topicId}`);
  return data;
};

export const updateFlashcard = async (id, status) => {
  const { data } = await axios.put(`${API_BASE}/flashcards/${id}`, {
    status
  });
  return data;
};

// Text-to-Speech
export const textToSpeech = async (text) => {
  const { data } = await axios.post(`${API_BASE}/tts`, { text });
  return data;
};

// Learning Boost Features
export const explainSimply = async (text, topicTitle) => {
  const { data } = await axios.post(`${API_BASE}/topics/explain-simply`, {
    text,
    topicTitle
  });
  return data;
};

export const explainWithExample = async (text, topicTitle) => {
  const { data } = await axios.post(`${API_BASE}/topics/explain-example`, {
    text,
    topicTitle
  });
  return data;
};

export const explainInLanguage = async (text, language, topicTitle) => {
  const { data} = await axios.post(`${API_BASE}/topics/explain-language`, {
    text,
    language,
    topicTitle
  });
  return data;
};

export const generateKeyPoints = async (topicId) => {
  const { data } = await axios.post(`${API_BASE}/topics/${topicId}/key-points`);
  return data;
};

export const extractKeywords = async (topicId) => {
  const { data } = await axios.post(`${API_BASE}/topics/${topicId}/keywords`);
  return data;
};

export const askAboutText = async (text, question, topicTitle) => {
  const { data } = await axios.post(`${API_BASE}/topics/ask-about-text`, {
    text,
    question,
    topicTitle
  });
  return data;
};

export const generateTopicQA = async (topicId) => {
  const { data } = await axios.post(`${API_BASE}/topics/${topicId}/generate-qa`);
  return data;
};

export const toggleBookmark = async (topicId) => {
  const { data } = await axios.put(`${API_BASE}/topics/${topicId}/bookmark`);
  return data;
};

export const updateNotes = async (topicId, notes) => {
  const { data } = await axios.put(`${API_BASE}/topics/${topicId}/notes`, { notes });
  return data;
};

export const updateProgress = async (topicId, status) => {
  const { data } = await axios.put(`${API_BASE}/topics/${topicId}/progress`, { status });
  return data;
};

// Quotes
export const getDailyQuote = async () => {
  const { data } = await axios.get(`${API_BASE}/quotes/daily`);
  return data;
};

export const getRandomQuote = async () => {
  const { data } = await axios.get(`${API_BASE}/quotes/random`);
  return data;
};

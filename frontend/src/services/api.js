import axios from 'axios';

// Use environment variable for API URL in production, fallback to /api for development
const API_BASE = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api` : '/api';

// Create axios instance with base URL
export const api = axios.create({
  baseURL: API_BASE
});

// Topics
export const generateTopic = async (title, level) => {
  const { data } = await api.post('/topics/generate', {
    title,
    level
  });
  return data;
};

export const getTopics = async () => {
  const { data } = await api.get('/topics');
  return data;
};

export const getTopicById = async (id) => {
  const { data } = await api.get(`/topics/${id}`);
  return data;
};

export const deleteTopic = async (id) => {
  const { data } = await api.delete(`/topics/${id}`);
  return data;
};

// Doubts
export const askDoubt = async (topicId, question) => {
  const { data } = await api.post('/doubts/ask', {
    topicId,
    question
  });
  return data;
};

export const getDoubtsByTopic = async (topicId) => {
  const { data } = await api.get(`/doubts/${topicId}`);
  return data;
};

// Flashcards
export const getFlashcards = async (topicId) => {
  const { data } = await api.get(`/flashcards/${topicId}`);
  return data;
};

export const updateFlashcard = async (id, status) => {
  const { data } = await api.put(`/flashcards/${id}`, {
    status
  });
  return data;
};

// Text-to-Speech
export const textToSpeech = async (text) => {
  const { data } = await api.post('/tts', { text });
  return data;
};

// Learning Boost Features
export const explainSimply = async (text, topicTitle) => {
  const { data } = await api.post('/topics/explain-simply', {
    text,
    topicTitle
  });
  return data;
};

export const explainWithExample = async (text, topicTitle) => {
  const { data } = await api.post('/topics/explain-example', {
    text,
    topicTitle
  });
  return data;
};

export const explainInLanguage = async (text, language, topicTitle) => {
  const { data} = await api.post('/topics/explain-language', {
    text,
    language,
    topicTitle
  });
  return data;
};

export const generateKeyPoints = async (topicId) => {
  const { data } = await api.post(`/topics/${topicId}/key-points`);
  return data;
};

export const extractKeywords = async (topicId) => {
  const { data } = await api.post(`/topics/${topicId}/keywords`);
  return data;
};

export const askAboutText = async (text, question, topicTitle) => {
  const { data } = await api.post('/topics/ask-about-text', {
    text,
    question,
    topicTitle
  });
  return data;
};

export const generateTopicQA = async (topicId) => {
  const { data } = await api.post(`/topics/${topicId}/generate-qa`);
  return data;
};

export const toggleBookmark = async (topicId) => {
  const { data } = await api.put(`/topics/${topicId}/bookmark`);
  return data;
};

export const updateNotes = async (topicId, notes) => {
  const { data } = await api.put(`/topics/${topicId}/notes`, { notes });
  return data;
};

export const updateProgress = async (topicId, status) => {
  const { data } = await api.put(`/topics/${topicId}/progress`, { status });
  return data;
};

// Quotes
export const getDailyQuote = async () => {
  const { data } = await api.get('/quotes/daily');
  return data;
};

export const getRandomQuote = async () => {
  const { data } = await api.get('/quotes/random');
  return data;
};

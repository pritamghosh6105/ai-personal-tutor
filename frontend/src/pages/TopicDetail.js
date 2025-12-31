import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { BookOpen, HelpCircle, CreditCard, CheckCircle, XCircle, Play, Pause, Square, Lightbulb, BookA, Key, FileText, MessageCircle, Bookmark, StickyNote, ThumbsUp, Clock } from 'lucide-react';
import { getTopicById, askDoubt, getDoubtsByTopic, updateFlashcard, textToSpeech, explainSimply, explainWithExample, explainInLanguage, generateKeyPoints, extractKeywords, askAboutText, toggleBookmark, updateNotes, updateProgress, generateTopicQA } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './TopicDetail.css';

const TopicDetail = () => {
  const { id } = useParams();
  const [topic, setTopic] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('lesson');
  
  // Quiz state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Flashcard state
  const [currentFlashcard, setCurrentFlashcard] = useState(0);
  const [flipped, setFlipped] = useState(false);

  // Doubt state
  const [doubtQuestion, setDoubtQuestion] = useState('');
  const [askingDoubt, setAskingDoubt] = useState(false);

  // TTS state
  const [playingAudio, setPlayingAudio] = useState(false);

  // AI Reading Mode state
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [readingSpeed, setReadingSpeed] = useState(1);
  const [readingVolume, setReadingVolume] = useState(1);
  const [currentReadingIndex, setCurrentReadingIndex] = useState(0);
  const [totalReadingItems, setTotalReadingItems] = useState(0);
  const speechRef = useRef(null);
  const lessonTextRef = useRef([]);
  const isReadingRef = useRef(false);
  const readingVolumeRef = useRef(1);
  const readingSpeedRef = useRef(1);
  const currentReadingIndexRef = useRef(0);
  const currentCharIndexRef = useRef(0);

  // Learning Boost state
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanationType, setExplanationType] = useState(''); // 'simple', 'example', 'hindi', 'hinglish'
  const [explanationText, setExplanationText] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const [keyPoints, setKeyPoints] = useState('');
  const [qaList, setQaList] = useState([]);
  const [showKeyPointsModal, setShowKeyPointsModal] = useState(false);
  const [showQAListModal, setShowQAListModal] = useState(false);

  // Ask AI Q&A state
  const [showQAModal, setShowQAModal] = useState(false);
  const [qaQuestion, setQaQuestion] = useState('');
  const [qaAnswer, setQaAnswer] = useState('');
  const [loadingQA, setLoadingQA] = useState(false);

  // Bookmark, Notes, Progress state
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notesContent, setNotesContent] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [progressStatus, setProgressStatus] = useState('not-started');

  useEffect(() => {
    fetchTopicData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchTopicData = async () => {
    try {
      const data = await getTopicById(id);
      setTopic(data.topic);
      setLesson(data.lesson);
      setQuiz(data.quiz);
      setFlashcards(data.flashcards);
      
      // Set bookmark, notes, and progress status
      setIsBookmarked(data.topic.isBookmarked || false);
      setNotesContent(data.topic.notes || '');
      setProgressStatus(data.topic.progressStatus || 'not-started');
      
      const doubtsData = await getDoubtsByTopic(id);
      setDoubts(doubtsData);
    } catch (error) {
      console.error('Error fetching topic:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAskDoubt = async (e) => {
    e.preventDefault();
    if (!doubtQuestion.trim()) return;

    setAskingDoubt(true);
    try {
      const newDoubt = await askDoubt(id, doubtQuestion);
      setDoubts([newDoubt, ...doubts]);
      setDoubtQuestion('');
    } catch (error) {
      console.error('Error asking doubt:', error);
      alert('Failed to ask question. Please try again.');
    } finally {
      setAskingDoubt(false);
    }
  };

  const handleQuizAnswer = (index) => {
    setSelectedAnswer(index);
    setShowResult(true);
    
    if (index === quiz.questions[currentQuestion].correctIndex) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizCompleted(false);
  };

  const handleFlashcardStatus = async (status) => {
    try {
      await updateFlashcard(flashcards[currentFlashcard]._id, status);
      const updatedFlashcards = [...flashcards];
      updatedFlashcards[currentFlashcard].status = status;
      setFlashcards(updatedFlashcards);
      
      // Move to next flashcard
      if (currentFlashcard < flashcards.length - 1) {
        setCurrentFlashcard(currentFlashcard + 1);
        setFlipped(false);
      }
    } catch (error) {
      console.error('Error updating flashcard:', error);
    }
  };

  const handlePlayAudio = async () => {
    if (!lesson) return;
    
    setPlayingAudio(true);
    try {
      const text = `${lesson.content.introduction}. ${lesson.content.steps.map(s => s.content).join('. ')}`;
      const result = await textToSpeech(text.substring(0, 1000)); // Limit text length
      
      // Play first audio URL
      if (result.audioUrls && result.audioUrls.length > 0) {
        const audio = new Audio(result.audioUrls[0]);
        audio.play();
        audio.onended = () => setPlayingAudio(false);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      alert('Failed to generate audio. Please try again.');
      setPlayingAudio(false);
    }
  };

  // AI Reading Mode Functions
  const prepareLessonText = () => {
    if (!lesson) return [];
    
    const texts = [];
    
    // Add introduction
    texts.push({ 
      type: 'intro', 
      content: lesson.content.introduction,
      label: 'Introduction'
    });
    
    // Add each step with title
    lesson.content.steps.forEach((step, index) => {
      const stepTitle = step.title || `Step ${index + 1}`;
      texts.push({ 
        type: 'step', 
        content: `${stepTitle}. ${step.content}`, 
        index,
        label: stepTitle
      });
    });
    
    // Add analogies
    if (lesson.content.analogies && lesson.content.analogies.length > 0) {
      lesson.content.analogies.forEach((analogy, index) => {
        texts.push({ 
          type: 'analogy', 
          content: `Real life analogy: ${analogy}`, 
          index,
          label: `Analogy ${index + 1}`
        });
      });
    }
    
    // Add summary points
    lesson.content.summary.forEach((point, index) => {
      texts.push({ 
        type: 'summary', 
        content: `Key point: ${point}`, 
        index,
        label: `Takeaway ${index + 1}`
      });
    });
    
    return texts;
  };

  const startReading = () => {
    if ('speechSynthesis' in window) {
      // Cancel any existing speech
      window.speechSynthesis.cancel();
      
      // Check for selected text first
      const selection = window.getSelection().toString().trim();
      
      if (selection && selection.length > 10) {
        // Priority 1: Read selected text
        console.log('📖 Reading selected text:', selection.substring(0, 50) + '...');
        lessonTextRef.current = [{ 
          type: 'selected', 
          content: selection,
          label: 'Selected Text'
        }];
        setTotalReadingItems(1);
        setCurrentReadingIndex(0);
        currentReadingIndexRef.current = 0;
        setIsReading(true);
        setIsPaused(false);
        isReadingRef.current = true;
        speakText(0);
      } else if (isPaused && currentReadingIndex > 0) {
        // Priority 2: Resume from paused position
        console.log('▶️ Resuming from position:', currentReadingIndex);
        setIsReading(true);
        setIsPaused(false);
        isReadingRef.current = true;
        speakText(currentReadingIndex);
      } else {
        // Priority 3: Start from beginning (first time only)
        console.log('🎬 Starting from beginning');
        lessonTextRef.current = prepareLessonText();
        setTotalReadingItems(lessonTextRef.current.length);
        setCurrentReadingIndex(0);
        currentReadingIndexRef.current = 0;
        setIsReading(true);
        setIsPaused(false);
        isReadingRef.current = true;
        speakText(0);
      }
    } else {
      alert('Text-to-speech is not supported in your browser.');
    }
  };

  const speakText = (index, startFromChar = 0) => {
    // Check if we've finished all items
    if (index >= lessonTextRef.current.length) {
      stopReading();
      return;
    }

    // Check if reading was stopped
    if (!isReadingRef.current) {
      return;
    }

    // Update index immediately (synchronously) before creating utterance
    setCurrentReadingIndex(index);
    currentReadingIndexRef.current = index;
    currentCharIndexRef.current = startFromChar;
    console.log(`📍 Speaking index ${index} from char ${startFromChar}: ${lessonTextRef.current[index].label}`);

    const textItem = lessonTextRef.current[index];
    // If starting from middle, use substring
    const textToSpeak = startFromChar > 0 ? textItem.content.substring(startFromChar) : textItem.content;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = readingSpeedRef.current;
    utterance.pitch = 1;
    utterance.volume = readingVolumeRef.current;
    utterance.lang = 'en-US';

    utterance.onstart = () => {
      highlightCurrentText(textItem);
      console.log(`▶️ Started reading: ${textItem.label} (${index + 1}/${lessonTextRef.current.length})`);
    };

    utterance.onboundary = (event) => {
      // Track character position for precise resume
      if (event.charIndex !== undefined) {
        currentCharIndexRef.current = startFromChar + event.charIndex;
      }
    };

    utterance.onend = () => {
      // Use ref to check if still reading (more reliable than state)
      if (isReadingRef.current) {
        // Small delay between sections for natural pacing
        setTimeout(() => {
          if (isReadingRef.current) {
            speakText(index + 1);
          }
        }, 300);
      }
    };

    utterance.onerror = (error) => {
      console.error('Speech synthesis error:', error);
      // Don't stop on minor errors, try to continue
      if (error.error === 'interrupted') {
        console.log('Speech interrupted, continuing...');
      } else {
        stopReading();
      }
    };

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const highlightCurrentText = (textItem) => {
    // Remove previous highlights
    document.querySelectorAll('.reading-highlight').forEach(el => {
      el.classList.remove('reading-highlight');
    });

    // Skip highlighting for selected text (no specific element to highlight)
    if (textItem.type === 'selected') {
      console.log('📖 Reading selected text (no highlight)');
      return;
    }

    // Add highlight to current text
    let selector = '';
    if (textItem.type === 'intro') {
      selector = '.lesson-intro-text';
    } else if (textItem.type === 'step') {
      selector = `.step-content-${textItem.index}`;
    } else if (textItem.type === 'analogy') {
      selector = `.analogy-text-${textItem.index}`;
    } else if (textItem.type === 'summary') {
      selector = `.summary-point-${textItem.index}`;
    }

    // Only query if we have a valid selector
    if (selector) {
      const element = document.querySelector(selector);
      if (element) {
        element.classList.add('reading-highlight');
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const pauseReading = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsPaused(true);
      setIsReading(false);
      isReadingRef.current = false;
      console.log('⏸️ Paused at position:', currentReadingIndex);
    }
  };

  const resumeReading = () => {
    console.log('▶️ Resuming from position:', currentReadingIndex);
    setIsPaused(false);
    setIsReading(true);
    isReadingRef.current = true;
    // Continue from current position
    speakText(currentReadingIndex);
  };

  const stopReading = () => {
    if (window.speechSynthesis.speaking || window.speechSynthesis.paused) {
      window.speechSynthesis.cancel();
    }
    setIsReading(false);
    setIsPaused(false);
    setCurrentReadingIndex(0);
    currentReadingIndexRef.current = 0;
    currentCharIndexRef.current = 0;
    setTotalReadingItems(0);
    isReadingRef.current = false;
    
    // Remove all highlights
    document.querySelectorAll('.reading-highlight').forEach(el => {
      el.classList.remove('reading-highlight');
    });
  };

  const changeReadingSpeed = (speed) => {
    console.log('⚡ Changing speed to:', speed);
    setReadingSpeed(speed);
    readingSpeedRef.current = speed;
    
    // Just update the ref - it will apply on next section automatically
    // No need to restart the current sentence
    console.log('⚡ Speed updated - will apply to next section');
  };

  const changeVolume = (volume) => {
    console.log('🔊 Changing volume to:', volume);
    setReadingVolume(volume);
    readingVolumeRef.current = volume;
    
    // If currently speaking, restart from current word position with new volume
    if (isReadingRef.current && !isPaused && window.speechSynthesis.speaking) {
      const currentIndex = currentReadingIndexRef.current;
      const currentChar = currentCharIndexRef.current;
      console.log('🔊 Restarting from index:', currentIndex, 'char:', currentChar);
      window.speechSynthesis.cancel();
      setTimeout(() => {
        if (isReadingRef.current) {
          speakText(currentIndex, currentChar);
        }
      }, 50);
    }
  };

  // Learning Boost Functions
  const handleTextSelection = (event) => {
    // Capture selection immediately for instant feedback
    const selection = window.getSelection().toString().trim();
    console.log('📝 Text selected:', selection);
    if (selection && selection.length > 3) {
      setSelectedText(selection);
      setShowExplanation(false); // Reset explanation when new text is selected
      console.log('✅ Selection saved, length:', selection.length);
    } else if (selection) {
      console.log('⚠️ Selection too short (less than 4 characters)');
    }
  };

  const handleExplainSimply = async (e) => {
    // Prevent default behavior to avoid clearing selection on mobile
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Try to get current selection if selectedText is empty (fallback)
    let textToExplain = selectedText;
    if (!textToExplain) {
      const currentSelection = window.getSelection().toString().trim();
      if (currentSelection && currentSelection.length > 3) {
        textToExplain = currentSelection;
        setSelectedText(currentSelection);
      }
    }
    
    console.log('🔍 Explain Simply clicked, selectedText:', textToExplain);
    
    if (!textToExplain) {
      alert('Please select some text first by highlighting it!');
      return;
    }
    
    setLoadingExplanation(true);
    setExplanationType('simple');
    setShowExplanation(true);
    
    try {
      console.log('📤 Sending request with text:', textToExplain);
      const result = await explainSimply(textToExplain, topic?.title || 'Topic');
      console.log('✅ Received response:', result);
      setExplanationText(result.explanation);
    } catch (error) {
      console.error('❌ Error in handleExplainSimply:', error);
      console.error('Error details:', error.response?.data || error.message);
      setExplanationText('Unable to generate explanation. Please try again.');
    } finally {
      setLoadingExplanation(false);
    }
  };

  const handleExplainWithExample = async (e) => {
    // Prevent default behavior to avoid clearing selection on mobile
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Try to get current selection if selectedText is empty (fallback)
    let textToExplain = selectedText;
    if (!textToExplain) {
      const currentSelection = window.getSelection().toString().trim();
      if (currentSelection && currentSelection.length > 3) {
        textToExplain = currentSelection;
        setSelectedText(currentSelection);
      }
    }
    
    if (!textToExplain) {
      alert('Please select some text first by highlighting it!');
      return;
    }
    
    setLoadingExplanation(true);
    setExplanationType('example');
    setShowExplanation(true);
    
    try {
      const { explanation } = await explainWithExample(textToExplain, topic.title);
      setExplanationText(explanation);
    } catch (error) {
      console.error('Error:', error);
      setExplanationText('Unable to generate example. Please try again.');
    } finally {
      setLoadingExplanation(false);
    }
  };

  const handleExplainInLanguage = async (language, e) => {
    // Prevent default behavior to avoid clearing selection on mobile
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Try to get current selection if selectedText is empty (fallback)
    let textToExplain = selectedText;
    if (!textToExplain) {
      const currentSelection = window.getSelection().toString().trim();
      if (currentSelection && currentSelection.length > 3) {
        textToExplain = currentSelection;
        setSelectedText(currentSelection);
      }
    }
    
    if (!textToExplain) {
      alert('Please select some text first by highlighting it!');
      return;
    }
    
    setLoadingExplanation(true);
    setExplanationType(language);
    setShowExplanation(true);
    
    try {
      const { explanation } = await explainInLanguage(textToExplain, language, topic.title);
      setExplanationText(explanation);
    } catch (error) {
      console.error('Error:', error);
      setExplanationText(`Unable to generate ${language} explanation. Please try again.`);
    } finally {
      setLoadingExplanation(false);
    }
  };

  const handleGenerateKeyPoints = async () => {
    setShowKeyPointsModal(true);
    if (keyPoints) return; // Already generated
    
    try {
      const { keyPoints: generated } = await generateKeyPoints(id);
      setKeyPoints(generated);
    } catch (error) {
      console.error('Error:', error);
      setKeyPoints('Unable to generate key points. Please try again later.');
    }
  };

  const handleGenerateQA = async () => {
    setShowQAListModal(true);
    if (qaList.length > 0) return; // Already generated
    
    try {
      const { qaList: generated } = await generateTopicQA(id);
      setQaList(generated);
    } catch (error) {
      console.error('Error:', error);
      setQaList([{ question: 'Unable to generate Q&A', answer: 'Please try again later.' }]);
    }
  };

  // Ask AI Q&A Handler
  const handleAskAI = (e) => {
    // Prevent default behavior to avoid clearing selection on mobile
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Try to get current selection if selectedText is empty (fallback)
    let textToAsk = selectedText;
    if (!textToAsk) {
      const currentSelection = window.getSelection().toString().trim();
      if (currentSelection && currentSelection.length > 3) {
        textToAsk = currentSelection;
        setSelectedText(currentSelection);
      }
    }
    
    if (!textToAsk) {
      alert('Please select some text first by highlighting it!');
      return;
    }
    setShowQAModal(true);
    setQaQuestion('');
    setQaAnswer('');
  };

  const handleSubmitQuestion = async () => {
    if (!qaQuestion.trim()) {
      alert('Please enter a question!');
      return;
    }

    setLoadingQA(true);
    try {
      const { answer } = await askAboutText(selectedText, qaQuestion, topic?.title || 'Topic');
      setQaAnswer(answer);
    } catch (error) {
      console.error('Error:', error);
      setQaAnswer('Unable to get answer. Please try again.');
    } finally {
      setLoadingQA(false);
    }
  };

  // Bookmark Handler
  const handleToggleBookmark = async () => {
    try {
      const { isBookmarked: newStatus } = await toggleBookmark(id);
      setIsBookmarked(newStatus);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update bookmark');
    }
  };

  // Notes Handlers
  const handleOpenNotes = () => {
    setShowNotesModal(true);
  };

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      await updateNotes(id, notesContent);
      setShowNotesModal(false);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save notes');
    } finally {
      setSavingNotes(false);
    }
  };

  // Progress Status Handler
  const handleUpdateProgress = async (status) => {
    try {
      await updateProgress(id, status);
      setProgressStatus(status);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update progress');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      isReadingRef.current = false;
    };
  }, []);

  // Calculate reading progress percentage
  const readingProgress = totalReadingItems > 0 
    ? Math.round(((currentReadingIndex + 1) / totalReadingItems) * 100) 
    : 0;

  if (loading) {
    return <LoadingSpinner message="Loading topic..." />;
  }

  if (!topic) {
    return <div className="container"><p>Topic not found</p></div>;
  }

  return (
    <div className="topic-detail-page">
      <div className="container">
        <div className="topic-header">
          <div>
            <h1>{topic.title}</h1>
            <span className="level-badge">{topic.level}</span>
          </div>
          <div className="topic-actions">
            <button 
              className="btn-action"
              onClick={handleOpenNotes}
              title="Add Personal Notes"
            >
              <StickyNote size={18} />
              Notes
            </button>
          </div>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'lesson' ? 'active' : ''}`}
            onClick={() => setActiveTab('lesson')}
          >
            <BookOpen size={20} />
            Lesson
          </button>
          <button
            className={`tab ${activeTab === 'quiz' ? 'active' : ''}`}
            onClick={() => setActiveTab('quiz')}
          >
            <CheckCircle size={20} />
            Quiz
          </button>
          <button
            className={`tab ${activeTab === 'flashcards' ? 'active' : ''}`}
            onClick={() => setActiveTab('flashcards')}
          >
            <CreditCard size={20} />
            Q/A
          </button>
          <button
            className={`tab ${activeTab === 'doubts' ? 'active' : ''}`}
            onClick={() => setActiveTab('doubts')}
          >
            <HelpCircle size={20} />
            Doubts
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'lesson' && lesson && (
            <div className="lesson-content">
              {/* Learning Boost Toolbar */}
              <div className="learning-boost-toolbar">
                <div className="boost-section">
                  <span className="boost-label">📝 Select text, then:</span>
                  {selectedText && (
                    <div className="text-selection-indicator">
                      <span className="selection-icon"></span>
                      <span>{selectedText.length} chars selected</span>
                    </div>
                  )}
                  <button 
                    className="btn-boost" 
                    onMouseDown={(e) => e.preventDefault()} 
                    onClick={handleExplainSimply} 
                    onTouchStart={(e) => e.preventDefault()}
                    title="Simpler explanation"
                  >
                    <Lightbulb size={16} />
                    Explain Simply
                  </button>
                  <button 
                    className="btn-boost" 
                    onMouseDown={(e) => e.preventDefault()} 
                    onClick={handleExplainWithExample} 
                    onTouchStart={(e) => e.preventDefault()}
                    title="Real-world example"
                  >
                    <BookA size={16} />
                    With Example
                  </button>
                  <button 
                    className="btn-boost" 
                    onMouseDown={(e) => e.preventDefault()} 
                    onClick={handleAskAI} 
                    onTouchStart={(e) => e.preventDefault()}
                    title="Ask a question about this text"
                  >
                    <MessageCircle size={16} />
                    Ask AI
                  </button>
                </div>

                <div className="boost-section">
                  <span className="boost-label">🌏 Language:</span>
                  <button 
                    className="btn-boost-lang" 
                    onMouseDown={(e) => e.preventDefault()} 
                    onClick={(e) => handleExplainInLanguage('hindi', e)}
                    onTouchStart={(e) => e.preventDefault()}
                  >
                    हिंदी
                  </button>
                  <button 
                    className="btn-boost-lang" 
                    onMouseDown={(e) => e.preventDefault()} 
                    onClick={(e) => handleExplainInLanguage('hinglish', e)}
                    onTouchStart={(e) => e.preventDefault()}
                  >
                    Hinglish
                  </button>
                </div>

                <div className="boost-section">
                  <button className="btn-boost-primary" onClick={handleGenerateKeyPoints}>
                    <Key size={16} />
                    Key Points
                  </button>
                </div>
              </div>

              {/* Explanation Box */}
              {showExplanation && (
                <div className="explanation-box">
                  <div className="explanation-header">
                    <div className="explanation-title">
                      {explanationType === 'simple' && '💡 Simple Explanation'}
                      {explanationType === 'example' && '📖 Example'}
                      {explanationType === 'hindi' && '🇮🇳 Hindi Explanation'}
                      {explanationType === 'hinglish' && '🇮🇳 Hinglish Explanation'}
                    </div>
                    <button className="btn-close-explanation" onClick={() => setShowExplanation(false)}>✕</button>
                  </div>
                  <div className="explanation-content">
                    <div className="selected-text-preview">
                      <strong>Selected:</strong> "{selectedText}"
                    </div>
                    {loadingExplanation ? (
                      <div className="loading-explanation">🤔 Generating explanation...</div>
                    ) : (
                      <div className="explanation-result">{explanationText}</div>
                    )}
                  </div>
                </div>
              )}

              {/* AI Reading Mode Controls */}
              <div className="ai-reading-controls">
                <div className="reading-controls-left">
                  {!isReading ? (
                    <button
                      className="btn-reading-primary"
                      onClick={startReading}
                    >
                      <Play size={20} />
                      <span>🔊 Read Aloud</span>
                    </button>
                  ) : (
                    <div className="reading-active-controls">
                      {!isPaused ? (
                        <button
                          className="btn-reading-control"
                          onClick={pauseReading}
                          title="Pause"
                        >
                          <Pause size={18} />
                        </button>
                      ) : (
                        <button
                          className="btn-reading-control"
                          onClick={resumeReading}
                          title="Resume"
                        >
                          <Play size={18} />
                        </button>
                      )}
                      <button
                        className="btn-reading-control stop"
                        onClick={stopReading}
                        title="Stop"
                      >
                        <Square size={18} />
                      </button>
                      <div className="reading-status">
                        <span className="reading-pulse"></span>
                        <span className="reading-text">
                          AI Reading... {readingProgress}%
                        </span>
                      </div>
                      <div className="reading-progress-bar">
                        <div 
                          className="reading-progress-fill" 
                          style={{ width: `${readingProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Lesson Content */}
              <div 
                className="lesson-card" 
                onMouseUp={handleTextSelection}
                onTouchEnd={handleTextSelection}
              >
                <div className="lesson-section">
                  <h3 className="lesson-section-title">
                    <span className="section-icon">📘</span>
                    Introduction
                  </h3>
                  <p className="lesson-intro-text">{lesson.content.introduction}</p>
                </div>

                <div className="lesson-section">
                  <h3 className="lesson-section-title">
                    <span className="section-icon">🧩</span>
                    Step-by-Step Explanation
                  </h3>
                  {lesson.content.steps.map((step, index) => (
                    <div key={index} className="lesson-step">
                      <div className="step-number">{index + 1}</div>
                      <div className="step-content">
                        <h4 className="step-title">{step.title || `Step ${index + 1}`}</h4>
                        <p className={`step-content-${index}`}>{step.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {lesson.content.analogies && lesson.content.analogies.length > 0 && (
                  <div className="lesson-section">
                    <h3 className="lesson-section-title">
                      <span className="section-icon">💡</span>
                      Real-Life Analogies
                    </h3>
                    {lesson.content.analogies.map((analogy, index) => (
                      <div key={index} className="lesson-analogy">
                        <p className={`analogy-text-${index}`}>{analogy}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="lesson-section">
                  <h3 className="lesson-section-title">
                    <span className="section-icon">🔍</span>
                    Key Takeaways
                  </h3>
                  <ul className="lesson-summary">
                    {lesson.content.summary.map((point, index) => (
                      <li key={index} className={`summary-point-${index}`}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Key Points Modal */}
              {showKeyPointsModal && (
                <div className="modal-overlay" onClick={() => setShowKeyPointsModal(false)}>
                  <div className="modal-content key-points-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                      <h2>🔑 Key Points Summary</h2>
                      <button className="btn-close-modal" onClick={() => setShowKeyPointsModal(false)}>✕</button>
                    </div>
                    <div className="modal-body">
                      {keyPoints ? (
                        <div className="key-points-content">
                          <ReactMarkdown>{keyPoints}</ReactMarkdown>
                        </div>
                      ) : (
                        <div className="loading-modal">🤔 Generating key points...</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Keywords Modal */}
              {showQAListModal && (
                <div className="modal-overlay" onClick={() => setShowQAListModal(false)}>
                  <div className="modal-content qa-list-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                      <h2>❓ Questions & Answers</h2>
                      <button className="btn-close-modal" onClick={() => setShowQAListModal(false)}>✕</button>
                    </div>
                    <div className="modal-body">
                      {qaList.length > 0 ? (
                        <div className="qa-list">
                          {qaList.map((qa, index) => (
                            <div key={index} className="qa-item">
                              <div className="qa-question">
                                <strong>Q{index + 1}:</strong> {qa.question}
                              </div>
                              <div className="qa-answer">
                                <strong>A:</strong> {qa.answer}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="loading-modal">🤔 Generating Q&A...</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Ask AI Q&A Modal */}
              {showQAModal && (
                <div className="modal-overlay" onClick={() => setShowQAModal(false)}>
                  <div className="modal-content qa-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                      <h2>💬 Ask AI About This</h2>
                      <button className="btn-close-modal" onClick={() => setShowQAModal(false)}>✕</button>
                    </div>
                    <div className="modal-body">
                      <div className="selected-context">
                        <strong>Selected Text:</strong>
                        <p>"{selectedText}"</p>
                      </div>
                      <div className="qa-input-section">
                        <label>Your Question:</label>
                        <textarea
                          value={qaQuestion}
                          onChange={(e) => setQaQuestion(e.target.value)}
                          placeholder="What would you like to know about this text?"
                          rows="3"
                        />
                        <button 
                          className="btn-submit-question" 
                          onClick={handleSubmitQuestion}
                          disabled={loadingQA}
                        >
                          {loadingQA ? '🤔 Thinking...' : '🚀 Ask AI'}
                        </button>
                      </div>
                      {qaAnswer && (
                        <div className="qa-answer">
                          <strong>Answer:</strong>
                          <p>{qaAnswer}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'quiz' && quiz && (
            <div className="quiz-content">
              {!quizCompleted ? (
                <>
                  <div className="quiz-progress">
                    Question {currentQuestion + 1} of {quiz.questions.length}
                  </div>

                  <div className="card">
                    <h3>{quiz.questions[currentQuestion].question}</h3>
                    
                    <div className="quiz-options">
                      {quiz.questions[currentQuestion].options.map((option, index) => (
                        <button
                          key={index}
                          className={`quiz-option ${
                            showResult
                              ? index === quiz.questions[currentQuestion].correctIndex
                                ? 'correct'
                                : index === selectedAnswer
                                ? 'incorrect'
                                : ''
                              : selectedAnswer === index
                              ? 'selected'
                              : ''
                          }`}
                          onClick={() => !showResult && handleQuizAnswer(index)}
                          disabled={showResult}
                        >
                          {option}
                          {showResult && index === quiz.questions[currentQuestion].correctIndex && (
                            <CheckCircle size={20} />
                          )}
                          {showResult && index === selectedAnswer && index !== quiz.questions[currentQuestion].correctIndex && (
                            <XCircle size={20} />
                          )}
                        </button>
                      ))}
                    </div>

                    {showResult && (
                      <div className="quiz-explanation">
                        <h4>Explanation:</h4>
                        <p>{quiz.questions[currentQuestion].explanation}</p>
                        <button className="btn btn-primary" onClick={handleNextQuestion}>
                          {currentQuestion < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="quiz-results">
                  <h2>Quiz Completed! 🎉</h2>
                  <div className="score">
                    <div className="score-circle">
                      {Math.round((score / quiz.questions.length) * 100)}%
                    </div>
                    <p>You got {score} out of {quiz.questions.length} correct!</p>
                  </div>
                  <button className="btn btn-primary" onClick={resetQuiz}>
                    Retake Quiz
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'flashcards' && (
            <div className="flashcards-content">
              {flashcards.length > 0 ? (
                <>
                  <div className="flashcard-progress">
                    Q/A {currentFlashcard + 1} of {flashcards.length}
                  </div>

                  <div className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(!flipped)}>
                    <div className="flashcard-inner">
                      <div className="flashcard-front">
                        <p>{flashcards[currentFlashcard].front}</p>
                        <span className="flip-hint">Click to flip</span>
                      </div>
                      <div className="flashcard-back">
                        <p>{flashcards[currentFlashcard].back}</p>
                        <span className="flip-hint">Click to flip</span>
                      </div>
                    </div>
                  </div>

                  <div className="flashcard-nav">
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setCurrentFlashcard(Math.max(0, currentFlashcard - 1));
                        setFlipped(false);
                      }}
                      disabled={currentFlashcard === 0}
                    >
                      Previous
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setCurrentFlashcard(Math.min(flashcards.length - 1, currentFlashcard + 1));
                        setFlipped(false);
                      }}
                      disabled={currentFlashcard === flashcards.length - 1}
                    >
                      Next
                    </button>
                  </div>
                </>
              ) : (
                <p>No Q/A available</p>
              )}
            </div>
          )}

          {activeTab === 'doubts' && (
            <div className="doubts-content">
              <div className="ask-question-card">
                <div className="ask-question-header">
                  <h3>Ask AI Tutor</h3>
                  <span className="ai-badge">✨ AI-Powered</span>
                </div>
                <p className="ask-description">
                  Ask anything about this topic! Our AI tutor will provide personalized explanations.
                </p>
                <form onSubmit={handleAskDoubt}>
                  <textarea
                    className="doubt-input"
                    rows="4"
                    placeholder="Example: Can you explain this concept using a real-world example? 🚀"
                    value={doubtQuestion}
                    onChange={(e) => setDoubtQuestion(e.target.value)}
                    disabled={askingDoubt}
                  />
                  <button
                    type="submit"
                    className="btn-ask-question"
                    disabled={askingDoubt || !doubtQuestion.trim()}
                  >
                    {askingDoubt ? (
                      <>
                        <span className="asking-spinner"></span>
                        AI is thinking...
                      </>
                    ) : (
                      <>
                        <HelpCircle size={20} />
                        Ask AI Tutor
                      </>
                    )}
                  </button>
                </form>
              </div>

              <div className="doubts-list">
                <h4 className="doubts-list-title">📚 Previous Questions & Answers</h4>
                {doubts.length > 0 ? (
                  doubts.map((doubt, index) => (
                    <div key={doubt._id} className="doubt-card" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="doubt-question">
                        <div className="question-icon">❓</div>
                        <div className="question-content">
                          <span className="question-label">Your Question:</span>
                          <p>{doubt.question}</p>
                        </div>
                      </div>
                      <div className="doubt-answer">
                        <div className="answer-icon">🤖</div>
                        <div className="answer-content">
                          <span className="answer-label">
                            <span className="ai-tutor-badge">AI Tutor</span>
                            answered:
                          </span>
                          <div className="markdown-answer">
                            <ReactMarkdown>{doubt.answer}</ReactMarkdown>
                          </div>
                        </div>
                      </div>
                      <div className="doubt-footer">
                        <span className="doubt-date">
                          ⏰ {new Date(doubt.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-doubts">
                    <div className="empty-icon">💭</div>
                    <h4>No questions yet</h4>
                    <p>Be the first to ask! Our AI tutor is ready to help you understand this topic better.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Notes Modal - Available from all tabs */}
        {showNotesModal && (
          <div className="modal-overlay" onClick={() => setShowNotesModal(false)}>
            <div className="modal-content notes-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>📝 Personal Notes</h2>
                <button className="btn-close-modal" onClick={() => setShowNotesModal(false)}>✕</button>
              </div>
              <div className="modal-body">
                <textarea
                  className="notes-textarea"
                  value={notesContent}
                  onChange={(e) => setNotesContent(e.target.value)}
                  placeholder="Write your notes here... These are private and only visible to you."
                  rows="10"
                />
                <button 
                  className="btn-save-notes" 
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                >
                  {savingNotes ? '💾 Saving...' : '💾 Save Notes'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicDetail;

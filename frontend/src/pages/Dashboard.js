import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, BookOpen, Trash2, Search, ArrowLeft, Sparkles, RefreshCw } from 'lucide-react';
import { generateTopic, getTopics, deleteTopic, getDailyQuote, getRandomQuote } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './Dashboard.css';

const Dashboard = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    level: 'beginner'
  });
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState({ title: '', notes: '' });
  const [dailyQuote, setDailyQuote] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchTopics();
    fetchDailyQuote();
  }, []);

  const fetchTopics = async () => {
    try {
      const data = await getTopics();
      setTopics(data);
    } catch (error) {
      console.error('Error fetching topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDailyQuote = async () => {
    try {
      const data = await getDailyQuote();
      setDailyQuote(data.quote);
    } catch (error) {
      console.error('Error fetching daily quote:', error);
      setDailyQuote('Keep learning, keep growing! 🌟');
    }
  };

  const handleRefreshQuote = async () => {
    try {
      const data = await getRandomQuote();
      setDailyQuote(data.quote);
    } catch (error) {
      console.error('Error fetching random quote:', error);
    }
  };

  const handleGenerateTopic = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title) {
      setError('Please enter a topic title');
      return;
    }

    setGenerating(true);

    try {
      const data = await generateTopic(formData.title, formData.level);
      setTopics([data.topic, ...topics]);
      setShowModal(false);
      setFormData({ title: '', level: 'beginner' });
      navigate(`/topic/${data.topic._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate topic');
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteTopic = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this topic?')) {
      try {
        await deleteTopic(id);
        setTopics(topics.filter(t => t._id !== id));
      } catch (error) {
        console.error('Error deleting topic:', error);
      }
    }
  };

  const handleViewNotes = (topic, e) => {
    e.stopPropagation();
    setSelectedNotes({ title: topic.title, notes: topic.notes });
    setShowNotesModal(true);
  };

  const filteredTopics = topics.filter(topic =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner message="Loading your topics..." />;
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        <button className="btn-back" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
          Back to Home
        </button>

        {dailyQuote && (
          <div className="daily-quote-card">
            <div className="quote-icon">
              <Sparkles size={24} />
            </div>
            <div className="quote-content">
              <p className="quote-text">"{dailyQuote}"</p>
              <span className="quote-label">Daily Motivation</span>
            </div>
            <button className="quote-refresh-btn" onClick={handleRefreshQuote} title="Get new quote">
              <RefreshCw size={20} />
            </button>
          </div>
        )}
        
        <div className="dashboard-header">
          <div>
            <h1>My Learning Dashboard</h1>
            <p>Explore your personalized learning topics</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={20} />
            New Topic
          </button>
        </div>

        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input"
          />
        </div>

        {filteredTopics.length === 0 ? (
          <div className="empty-state">
            <BookOpen size={64} />
            <h3>No topics yet</h3>
            <p>Create your first topic to start learning!</p>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={20} />
              Create Topic
            </button>
          </div>
        ) : (
          <div className="topics-grid">
            {filteredTopics.map(topic => (
              <div
                key={topic._id}
                className="topic-card"
                onClick={() => navigate(`/topic/${topic._id}`)}
              >
                <div className="topic-card-header">
                  <BookOpen size={24} className="topic-icon" />
                  <button
                    className="delete-btn"
                    onClick={(e) => handleDeleteTopic(topic._id, e)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <h3>{topic.title}</h3>
                <div className="topic-meta">
                  <span className="level-badge">{topic.level}</span>
                  <span className="date">
                    {new Date(topic.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {topic.notes && (
                  <div className="topic-notes" onClick={(e) => handleViewNotes(topic, e)}>
                    <strong>📝 Notes:</strong>
                    <p>{topic.notes.substring(0, 100)}{topic.notes.length > 100 ? '...' : ''}</p>
                    <span className="view-more">Click to view full notes →</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={() => !generating && setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Generate New Topic</h2>
              {error && <div className="error">{error}</div>}
              
              <form onSubmit={handleGenerateTopic}>
                <div className="form-group">
                  <label>Topic Title</label>
                  <input
                    type="text"
                    placeholder="e.g., CPU Pipelining, Photosynthesis, Quantum Physics"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input"
                    disabled={generating}
                  />
                </div>

                <div className="form-group">
                  <label>Level</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="input"
                    disabled={generating}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                    disabled={generating}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={generating}
                  >
                    {generating ? 'Generating... (This may take 30s)' : 'Generate Topic'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showNotesModal && (
          <div className="modal-overlay" onClick={() => setShowNotesModal(false)}>
            <div className="modal-content notes-view-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>📝 Notes: {selectedNotes.title}</h2>
                <button className="close-btn" onClick={() => setShowNotesModal(false)}>✕</button>
              </div>
              <div className="modal-body">
                <div className="notes-display">
                  {selectedNotes.notes}
                </div>
              </div>
              <div className="modal-actions">
                <button className="btn btn-primary" onClick={() => setShowNotesModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Sparkles, Brain, MessageCircle, Zap, Target } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStartLearning = () => {
    if (user) {
      // User is logged in, redirect to dashboard
      navigate('/dashboard');
    } else {
      // User is not logged in, redirect to signup
      navigate('/signup');
    }
  };

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-background">
          <div className="hero-gradient"></div>
        </div>
        <div className="container">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>Powered by Advanced AI</span>
          </div>
          <h1 className="hero-title">
            Master Any Topic with
            <span className="hero-highlight"> AI-Powered Learning</span>
          </h1>
          <p className="hero-subtitle">
            MindSpark is your intelligent learning companion that transforms complex topics into easy-to-understand lessons. Get AI-generated content, interactive flashcards, instant doubt resolution, and personalized quizzes tailored to your learning pace and style.
          </p>
          <div className="hero-buttons">
            <button onClick={handleStartLearning} className="btn btn-primary btn-large">
              <Zap size={20} />
              Start Learning Free
            </button>
            <Link to="/login" className="btn btn-secondary btn-large">
              Sign In
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">Free Forever</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">AI-First</div>
              <div className="stat-label">Personalized</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Available</div>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Everything You Need to Excel</h2>
            <p className="section-subtitle">
              Intelligent tools designed to accelerate your learning journey
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <BookOpen className="feature-icon" size={32} />
              </div>
              <h3>Personalized Lessons</h3>
              <p>Get custom explanations tailored to your learning level and style, making complex topics easy to understand.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Brain className="feature-icon" size={32} />
              </div>
              <h3>Smart Quizzes</h3>
              <p>Test your knowledge with AI-generated questions that adapt to your progress and challenge you appropriately.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Sparkles className="feature-icon" size={32} />
              </div>
              <h3>Interactive Q/A</h3>
              <p>Master key concepts with intelligent Q/A cards that focus on what you need to practice most.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <MessageCircle className="feature-icon" size={32} />
              </div>
              <h3>Instant Doubt Solving</h3>
              <p>Ask questions anytime and receive clear, detailed explanations powered by advanced AI technology.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <Target className="cta-icon" size={48} />
            <h2 className="cta-title">Ready to Transform Your Learning?</h2>
            <p className="cta-text">
              Join thousands of students already learning smarter with MindSpark.
              Start your journey today — completely free.
            </p>
            <Link to="/signup" className="btn btn-primary btn-large btn-cta">
              <Zap size={20} />
              Get Started Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

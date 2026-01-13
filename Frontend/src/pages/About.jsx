import { Link } from 'react-router-dom'
import './About.css'

export default function About() {
  const capabilities = [
    { icon: '🌐', label: 'Global Knowledge' },
    { icon: '💻', label: 'Code Assistance' },
    { icon: '✍️', label: 'Creative Writing' },
    { icon: '🔒', label: 'Enterprise Security' }
  ]

  return (
    <div className="about">
      <section className="about-hero">
        <div className="container">
          <h1>Driven by <span style={{ color: '#6366f1' }}>Innovation</span></h1>
          <p>We are building the bridge between human curiosity and artificial intelligence, one conversation at a time.</p>
        </div>
      </section>

      <section className="mission-section">
        <div className="mission-grid">
          <div className="mission-text">
            <h2>Our Mission</h2>
            <p>
              Launched in 2025, AI-ChatBot was born from a simple idea: making advanced AI accessible,
              intuitive, and helpful for everyone.
            </p>
            <p>
              We believe that AI shouldn't just answer questions—it should inspire ideas, solve complex
              problems, and act as a force multiplier for human potential.
            </p>
            <div className="tech-stack">
              <span className="tech-tag">React 18</span>
              <span className="tech-tag">Gemini AI</span>
              <span className="tech-tag">WebSockets</span>
              <span className="tech-tag">Express.js</span>
              <span className="tech-tag">MongoDB</span>
            </div>
          </div>

          <div className="mission-visual">
            <div className="about-features">
              {capabilities.map((cap, index) => (
                <div key={index} className="about-feature-card">
                  <span className="feature-emoji">{cap.icon}</span>
                  <span className="feature-name">{cap.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="cta-banner">
          <h2>Experience the Future</h2>
          <p>Start your first conversation today and see why millions choose our AI Assistant.</p>
          <Link to="/signup" className="btn btn-primary" style={{ margin: '0 auto' }}>
            Join AI-ChatBot Now
          </Link>
        </div>
      </section>
    </div>
  )
}
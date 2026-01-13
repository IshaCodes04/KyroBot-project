import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import './Home.css'

export default function Home() {
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      navigate('/chat')
    }
  }, [token, navigate])

  const features = [
    {
      icon: '🧠',
      title: 'Advanced AI Brain',
      description: 'Powered by state-of-the-art language models to provide human-like responses and reasoning.'
    },
    {
      icon: '⚡',
      title: 'Real-time Processing',
      description: 'Experience lightning-fast interactions with our optimized real-time messaging pipeline.'
    },
    {
      icon: '🔒',
      title: 'Privacy Focused',
      description: 'Your conversations are encrypted and secure. We value your data privacy above all else.'
    }
  ]

  return (
    <div className="home">
      <div className="aurora-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <section className="hero">
        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-icon">✨</span>
              Next Gen Artificial Intelligence
            </div>
            <h1 className="hero-title">
              Intelligence that <span className="gradient-text">Feels Personal</span>
            </h1>
            <p className="hero-description">
              Experience the next evolution of conversational AI. Designed to think,
              solve, and grow alongside you. Professional grade intelligence,
              simplified for everyone.
            </p>
            <div className="hero-buttons">
              <Link to="/signup" className="btn btn-primary">Start Chatting Free</Link>
              <Link to="/about" className="btn btn-secondary">Learn How it Works</Link>
            </div>
          </div>

          <div className="hero-visual">
            <div className="glass-card main-preview">
              <div className="preview-header">
                <div className="dot"></div><div className="dot"></div><div className="dot"></div>
              </div>
              <div className="preview-chat">
                <div className="chat-bubble ai">Hello! How can I help you today?</div>
                <div className="chat-bubble user">Analyze this financial report...</div>
                <div className="chat-bubble ai">I've identified 3 key trends in your data...</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="professional-stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">99.9%</div>
              <div className="stat-label">System Uptime</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">Instant</div>
              <div className="stat-label">Model Response</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">256-bit</div>
              <div className="stat-label">AES Encryption</div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Built for Performance</h2>
            <p className="section-subtitle">Everything you need to boost your productivity in one place.</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon-box">{feature.icon}</div>
                <h3 className="feature-h3">{feature.title}</h3>
                <p className="feature-p">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

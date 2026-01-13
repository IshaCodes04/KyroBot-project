import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './AuthPage.css'
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Bot,
  MessageSquare,
  Zap,
  Shield,
  ChevronRight
} from 'lucide-react'

export default function AuthPage({ type = 'login' }) {
  const [authType, setAuthType] = useState(type)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      const endpoint = authType === 'login' ? '/api/auth/login' : '/api/auth/signup'
      const response = await axios.post(`http://localhost:3000${endpoint}`, formData)

      if (response.data.success) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify({
          fullName: response.data.fullName,
          email: response.data.email
        }))
        navigate('/chat')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left">
          <Link to="/" className="back-link">
            <ArrowLeft size={20} /> Back to explore
          </Link>

          <h1 className="auth-title">
            {authType === 'login' ? 'Great to see you again' : 'Join the revolution'}
          </h1>
          <p className="auth-subtitle">
            {authType === 'login'
              ? 'Empower your daily tasks with intelligent conversations.'
              : 'Experience the next generation of AI-driven productivity.'}
          </p>

          {error && <div className="auth-error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            {authType === 'signup' && (
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <div className="input-wrapper">
                  <User className="input-icon" size={20} />
                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    placeholder="e.g. Isha Singh"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required={authType === 'signup'}
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={20} />
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={20} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-submit"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : (authType === 'login' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="auth-footer">
            {authType === 'login' ? (
              <>
                New to AI-ChatBot?{' '}
                <button className="auth-switch-btn" onClick={() => setAuthType('signup')}>
                  Start for free
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button className="auth-switch-btn" onClick={() => setAuthType('login')}>
                  Sign in here
                </button>
              </>
            )}
          </div>
        </div>

        <div className="auth-right">
          <div className="echo-container">
            <h2 className="echo-title">
              Meet the <br /> <span>Echo Mind!</span>
            </h2>

            <div className="echo-visual-section">
              <div className="thought-bubble">
                Need our help now?
              </div>
              <div className="thought-dots">
                <div className="dot-1"></div>
                <div className="dot-2"></div>
                <div className="dot-3"></div>
              </div>
              <div className="robot-glow"></div>
              <img
                src="/assets/images/robot.png"
                alt="Echo Mind Robot"
                className="echo-robot"
              />
            </div>

            <div className="echo-bottom-bar">
              <div className="echo-start-btn">
                <div className="chevron-circle">
                  <ChevronRight size={24} />
                </div>
                <span className="btn-text">Get Started</span>
                <div className="arrows">
                  <ChevronRight size={14} />
                  <ChevronRight size={14} />
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

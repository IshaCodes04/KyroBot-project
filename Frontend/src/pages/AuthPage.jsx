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
  Shield
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


          <div className="auth-content">
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
        </div>

        <div className="auth-right">
          <div className="bot-panel">
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              marginBottom: '32px'
            }}>
              <MessageSquare size={32} color="#6366f1" />
              <Zap size={32} color="#a855f7" />
              <Shield size={32} color="#ec4899" />
            </div>
            <h2 className="bot-title">More than just a Chat</h2>
            <p className="bot-subtitle">
              Our AI is designed to understand context, solve problems, and grow with you.
              Join a community of forward-thinkers.
            </p>

            <div className="bot-visual" style={{ background: 'none' }}>
              {/* Decorative elements instead of missing image */}
              <div style={{
                width: '200px',
                height: '200px',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.4), rgba(168, 85, 247, 0.4))',
                borderRadius: '50%',
                margin: '0 auto',
                filter: 'blur(40px)',
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: -1
              }}></div>
              <Bot size={120} style={{ animation: 'float 4s ease-in-out infinite' }} />
            </div>

            <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{
                  width: i === 2 ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: i === 2 ? '#6366f1' : 'rgba(255,255,255,0.1)'
                }}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

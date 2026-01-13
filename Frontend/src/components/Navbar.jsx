import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Bot, LogOut } from 'lucide-react'
import './Navbar.css'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const isChatPage = location.pathname === '/chat'

  const token = localStorage.getItem('token')
  const authStatus = !!token

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  // If on Chat page, only show the Logout button in a minimalist way
  if (isChatPage) {
    return (
      <nav className="navbar chat-navbar">
        <div className="navbar-container container">
          <div className="navbar-brand">
            <div className="logo">
              <div style={{
                background: 'var(--aurora-gradient)',
                padding: '6px',
                borderRadius: '8px',
                color: 'white',
                display: 'flex'
              }}>
                <Bot size={20} />
              </div>
              <span className="brand-name">AI Console</span>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn-cute">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav >
    )
  }

  return (
    <nav className="navbar">
      <div className="navbar-container container">
        <Link to="/" className="navbar-brand">
          <div className="logo">
            <div style={{
              background: 'var(--aurora-gradient)',
              padding: '6px',
              borderRadius: '8px',
              color: 'white',
              display: 'flex'
            }}>
              <Bot size={24} />
            </div>
            <span className="brand-name">AI-ChatBot</span>
          </div>
        </Link>

        <div className="navbar-menu">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
          {authStatus && <Link to="/chat" className="nav-link">Chat Console</Link>}
        </div>
      </div>
    </nav>
  )
}

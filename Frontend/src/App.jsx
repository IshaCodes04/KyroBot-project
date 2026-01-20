import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import AuthPage from './pages/AuthPage'
import Chat from './pages/Chat'
import './App.css'

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const isChatPage = location.pathname === '/chat';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userStr = params.get('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);

        // Navigate
        navigate('/chat');
      } catch (e) {
        console.error("Failed to parse user data from URL", e);
      }
    }
  }, [location, navigate]);

  if (isChatPage) {
    return (
      <Routes>
        <Route path="/chat" element={<Chat />} />
      </Routes>
    );
  }

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<AuthPage type="login" />} />
        <Route path="/signup" element={<AuthPage type="signup" />} />
      </Routes>
    );
  }

  return (
    <div className="main-app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import AuthPage from './pages/AuthPage'
import Chat from './pages/Chat'
import './App.css'

function AppContent() {
  const location = useLocation();
  const isChatPage = location.pathname === '/chat';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

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

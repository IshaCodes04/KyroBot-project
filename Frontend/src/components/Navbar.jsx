import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight } from 'lucide-react';
import KyraLogo from './KyraLogo';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isChatPage = location.pathname === '/chat';
  const token = localStorage.getItem('token');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (isChatPage) return null;

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-zd-surface/80 backdrop-blur-md border-b border-zd-border shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2 group" onClick={() => setIsOpen(false)}>
              <KyraLogo size="md" />
              <div className="flex flex-col leading-none">
                <span className="text-xl font-bold text-zd-ink tracking-tight">
                  KyroBot
                </span>
              </div>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-8 flex items-baseline space-x-6">
              <Link to="/" className="text-sm font-medium text-zd-muted hover:text-zd-ink transition-colors">Home</Link>
              <Link to="/about" className="text-sm font-medium text-zd-muted hover:text-zd-ink transition-colors">About</Link>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center gap-4">
              {token ? (
                <div className="flex items-center gap-3">
                  <Link
                    to="/chat"
                    className="text-zd-muted hover:text-zd-ink px-2.5 py-2 text-sm font-medium transition-colors"
                  >
                    Open Chat
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-red-500 hover:text-red-600 px-2.5 py-2 text-sm font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/login" className="text-zd-muted hover:text-zd-ink px-2.5 py-2 text-sm font-medium transition-colors">
                    Log In
                  </Link>
                  <Link to="/signup" className="group relative px-3.5 py-2 bg-zd-brand hover:bg-zd-brand2 text-white text-sm font-bold rounded-full transition-all duration-300 shadow-[0_0_18px_rgba(125,89,255,0.22)] hover:shadow-[0_0_26px_rgba(125,89,255,0.32)]">
                    <span className="relative z-10 flex items-center gap-1">
                      Get Started <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-zd-muted hover:text-zd-ink hover:bg-zd-surface2 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-zd-surface/95 backdrop-blur-xl border-b border-zd-border">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-zd-ink hover:bg-zd-surface2">Home</Link>
            <Link to="/about" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-zd-muted hover:text-zd-ink hover:bg-zd-surface2">About</Link>
            {!token && (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-zd-muted hover:text-zd-ink hover:bg-zd-surface2">Log In</Link>
                <Link to="/signup" onClick={() => setIsOpen(false)} className="block w-full text-center mt-4 px-5 py-3 rounded-lg bg-zd-brand hover:bg-zd-brand2 text-white font-bold">
                  Get Started
                </Link>
              </>
            )}
            {token && (
              <>
                <Link
                  to="/chat"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-zd-muted hover:text-zd-ink hover:bg-zd-surface2"
                >
                  Open Chat
                </Link>
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-500 hover:text-red-600 hover:bg-zd-surface2"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

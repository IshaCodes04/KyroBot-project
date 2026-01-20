import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bot, Menu, X, ChevronRight } from 'lucide-react';

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
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg group-hover:scale-105 transition-transform duration-300 text-white">
                <Bot className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                AI Bot
              </span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/" className="text-sm font-medium text-slate-600 hover:text-cyan-600 transition-colors">Home</Link>
              <Link to="/about" className="text-sm font-medium text-slate-600 hover:text-cyan-600 transition-colors">About</Link>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center gap-4">
              {token ? (
                <button onClick={handleLogout} className="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium transition-colors">
                  Logout
                </button>
              ) : (
                <>
                  <Link to="/login" className="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium transition-colors">
                    Log In
                  </Link>
                  <Link to="/signup" className="group relative px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-bold rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]">
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
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-slate-900 hover:bg-slate-50">Home</Link>
            <Link to="/about" className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50">About</Link>
            {!token && (
              <>
                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50">Log In</Link>
                <Link to="/signup" className="block w-full text-center mt-4 px-5 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold">
                  Get Started
                </Link>
              </>
            )}
            {token && (
              <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50">
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

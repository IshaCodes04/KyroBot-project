import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Chrome, Sparkles, Activity, Zap, Stars, User } from 'lucide-react';

export default function AuthPage({ type }) {
  const isLogin = type === 'login';
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Animation state
  const [loadState, setLoadState] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoadState(true), 10);
    return () => {
      clearTimeout(t);
      setLoadState(false);
    };
  }, [type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dummy authentication logic
    const userData = isLogin ? { email } : { fullName, email };
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('user', JSON.stringify(userData));
    navigate('/chat');
  };

  return (
    <div className="min-h-screen bg-zd-canvas flex flex-col lg:flex-row items-center justify-center p-4 sm:p-6 lg:p-12 relative overflow-x-hidden overflow-y-auto">
      {/* Background Decorations */}
      <div className="absolute top-10 left-10 text-zd-brand/15 animate-bounce delay-700">
        <Sparkles size={48} />
      </div>
      <div className="absolute bottom-20 left-1/4 text-zd-brand2/10 animate-pulse delay-1000">
        <Stars size={32} />
      </div>
      <div className="absolute top-1/2 right-10 text-zd-brand/10 animate-bounce delay-500">
        <Zap size={40} />
      </div>
      <div className="absolute top-20 right-1/4 text-zd-brand2/10 animate-spin-slow" style={{ animationDuration: '10s' }}>
        <Activity size={64} />
      </div>

      {/* Left Side - Text & Visuals */}
      <div className={`w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-20 relative z-10 mb-1 lg:mb-0 text-center lg:text-left transition-all duration-700 ${loadState ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <Link to="/" className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-zd-surface border border-zd-border text-zd-muted hover:text-zd-ink transition-all mb-12 self-center lg:self-start shadow-sm hover:shadow-md group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </Link>

        <h1 className="text-3xl xs:text-4xl md:text-5xl lg:text-6xl font-extrabold text-zd-ink leading-tight mb-4 sm:mb-6">
          {isLogin ? 'Welcome back' : 'Create your account'} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zd-brand to-zd-brand2">
            {isLogin ? 'Let’s pick up where you left off.' : 'Start building with AI today.'}
          </span>
        </h1>

        <p className="text-lg text-zd-muted mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed">
          {isLogin
            ? "Sign in to access your workspace and continue conversations with your assistant."
            : "Create an account to unlock faster workflows—better writing, clearer answers, and cleaner code in one place."}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center lg:justify-start text-xs sm:text-sm font-medium text-zd-muted">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-zd-brand"></div> No credit card required
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-zd-brand2"></div> Free tier available
          </div>
        </div>
      </div>

      {/* Right Side - Form Card */}
      <div className={`w-full lg:w-1/2 max-w-md w-full relative z-10 transition-all duration-1000 delay-200 ${loadState ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
        <div className="bg-zd-surface rounded-3xl shadow-xl border border-zd-border p-8 sm:p-10 mx-auto">
          <h2 className="text-2xl font-bold text-zd-ink mb-8 text-center">
            {isLogin ? 'Sign in' : 'Sign up'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-zd-ink ml-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-zd-muted/70" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-zd-surface2 border border-zd-border rounded-xl text-zd-ink placeholder-zd-muted/70 focus:outline-none focus:ring-2 focus:ring-zd-brand/20 focus:border-zd-brand transition-all"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zd-ink ml-1">Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-4 py-3.5 bg-zd-surface2 border border-zd-border rounded-xl text-zd-ink placeholder-zd-muted/70 focus:outline-none focus:ring-2 focus:ring-zd-brand/20 focus:border-zd-brand transition-all"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zd-ink ml-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-4 py-3.5 bg-zd-surface2 border border-zd-border rounded-xl text-zd-ink placeholder-zd-muted/70 focus:outline-none focus:ring-2 focus:ring-zd-brand/20 focus:border-zd-brand transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-zd-ink ml-1">Confirm Password</label>
                <div className="relative">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full px-4 py-3.5 bg-zd-surface2 border border-zd-border rounded-xl text-zd-ink placeholder-zd-muted/70 focus:outline-none focus:ring-2 focus:ring-zd-brand/20 focus:border-zd-brand transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            )}

            <button type="submit" className="w-full py-3.5 px-6 bg-zd-brand hover:bg-zd-brand2 text-white font-bold rounded-xl shadow-lg shadow-[rgba(125,89,255,0.25)] transform hover:-translate-y-0.5 transition-all duration-200 mt-2">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zd-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-wider">
                <span className="px-4 bg-zd-surface text-zd-muted font-medium">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => window.location.href = import.meta.env.PROD ? '/auth/google' : 'http://localhost:3000/auth/google'}
              className="w-full py-3.5 px-6 bg-zd-surface hover:bg-zd-surface2 border border-zd-border text-zd-ink font-bold rounded-xl flex items-center justify-center gap-3 transition-all shadow-sm hover:shadow-md"
            >
              <Chrome className="w-5 h-5 text-zd-ink" />
              Continue with Google
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-zd-muted">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Link to={isLogin ? "/signup" : "/login"} className="text-zd-brand hover:text-zd-brand2 font-bold hover:underline transition-all">
              {isLogin ? 'Sign Up' : 'Log In'}
            </Link>
          </p>
        </div>

        <div className="mt-8 flex justify-center gap-6 text-xs text-zd-muted/80">
          <a href="#" className="hover:text-zd-ink transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-zd-ink transition-colors">Terms of Service</a>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, Chrome, Sparkles, Activity, Zap, Stars, User } from 'lucide-react';

export default function AuthPage({ type }) {
  const isLogin = type === 'login';
  const navigate = useNavigate();
  const location = useLocation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Animation state
  const [loadState, setLoadState] = useState(false);

  useEffect(() => {
    setLoadState(true);
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
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row items-center justify-center p-4 lg:p-12 relative overflow-x-hidden overflow-y-auto">
      {/* Background Decorations */}
      <div className="absolute top-10 left-10 text-cyan-500/20 animate-bounce delay-700">
        <Sparkles size={48} />
      </div>
      <div className="absolute bottom-20 left-1/4 text-blue-500/20 animate-pulse delay-1000">
        <Stars size={32} />
      </div>
      <div className="absolute top-1/2 right-10 text-cyan-400/20 animate-bounce delay-500">
        <Zap size={40} />
      </div>
      <div className="absolute top-20 right-1/4 text-blue-400/10 animate-spin-slow" style={{ animationDuration: '10s' }}>
        <Activity size={64} />
      </div>

      {/* Left Side - Text & Visuals */}
      <div className={`w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-20 relative z-10 mb-1 lg:mb-0 text-center lg:text-left transition-all duration-700 ${loadState ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <Link to="/" className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-cyan-600 hover:border-cyan-200 transition-all mb-12 self-center lg:self-start shadow-sm hover:shadow-md group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </Link>

        <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
          {isLogin ? 'Welcome' : 'Create Your'} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">
            {isLogin ? 'Back Again!' : 'AI Account'}
          </span>
        </h1>

        <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed">
          {isLogin
            ? "Ready to pick up where you left off? Your AI assistant is waiting."
            : "Join thousands of users using AI Bot to simplify tasks and boost productivity with intelligent automation."}
        </p>

        <div className="flex items-center gap-4 justify-center lg:justify-start text-sm font-medium text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-500"></div> No credit card required
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div> Free tier available
          </div>
        </div>
      </div>

      {/* Right Side - Form Card */}
      <div className={`w-full lg:w-1/2 max-w-md w-full relative z-10 transition-all duration-1000 delay-200 ${loadState ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-10 mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            {isLogin ? 'Log In to Your Account' : 'Create Account'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Confirm Password</label>
                <div className="relative">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            )}

            <button type="submit" className="w-full py-3.5 px-6 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 transform hover:-translate-y-0.5 transition-all duration-200 mt-2">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-wider">
                <span className="px-4 bg-white text-slate-400 font-medium">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => window.location.href = 'http://localhost:3000/auth/google'}
              className="w-full py-3.5 px-6 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-3 transition-all hover:border-slate-300 shadow-sm hover:shadow-md"
            >
              <Chrome className="w-5 h-5 text-slate-900" />
              Continue with Google
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Link to={isLogin ? "/signup" : "/login"} className="text-cyan-600 hover:text-cyan-700 font-bold hover:underline transition-all">
              {isLogin ? 'Sign Up' : 'Log In'}
            </Link>
          </p>
        </div>

        <div className="mt-8 flex justify-center gap-6 text-xs text-slate-400">
          <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
        </div>
      </div>
    </div>
  );
}

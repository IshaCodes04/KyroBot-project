export default function KyraLogo({ size = 'md' }) {
  const sizeClasses =
    size === 'sm'
      ? 'w-8 h-8'
      : size === 'lg'
        ? 'w-12 h-12'
        : 'w-10 h-10';

  return (
    <div className={`${sizeClasses} flex items-center justify-center transition-transform hover:scale-110 duration-300`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="kyraMech" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        {/* The 'K' as a robot frame */}
        <rect x="25" y="15" width="12" height="70" rx="6" fill="url(#kyraMech)" />
        <path d="M37 50 L70 20 M37 50 L70 80" fill="none" stroke="url(#kyraMech)" strokeWidth="14" strokeLinecap="round" />
        {/* Robot Head on the K vertical */}
        <rect x="21" y="10" width="20" height="16" rx="5" fill="#1E293B" stroke="url(#kyraMech)" strokeWidth="2" />
        <circle cx="27" cy="18" r="2" fill="#06B6D4" />
        <circle cx="35" cy="18" r="2" fill="#06B6D4" />
      </svg>
    </div>
  );
}


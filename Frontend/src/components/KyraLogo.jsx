export default function KyraLogo({ size = 'md' }) {
  const sizeClasses =
    size === 'sm'
      ? 'w-8 h-8 text-xs'
      : size === 'lg'
      ? 'w-11 h-11 text-lg'
      : 'w-9 h-9 text-sm';

  return (
    <div
      className={`rounded-2xl bg-gradient-to-br from-zd-brand to-zd-brand2 flex items-center justify-center text-white shadow-lg shadow-[rgba(125,89,255,0.35)] border border-white/10 ${sizeClasses}`}
    >
      <span className="font-extrabold tracking-tight">
        K
      </span>
    </div>
  );
}


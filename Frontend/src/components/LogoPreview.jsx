import React from 'react';

const LogoCard = ({ title, children, code }) => (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center gap-4 hover:bg-white/10 transition-all duration-300 group">
        <div className="w-24 h-24 flex items-center justify-center bg-zinc-900 rounded-xl shadow-inner border border-white/5 group-hover:scale-110 transition-transform duration-300">
            {children}
        </div>
        <div className="text-center">
            <h3 className="text-white font-bold text-lg mb-1">{title}</h3>
            <p className="text-zinc-400 text-xs font-mono bg-black/40 px-2 py-1 rounded truncate w-full max-w-[180px]">
                {title.toLowerCase().replace(/\s+/g, '_')}.svg
            </p>
        </div>
        <button
            onClick={() => navigator.clipboard.writeText(code)}
            className="mt-2 text-xs px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-full transition-colors"
        >
            Copy SVG Code
        </button>
    </div>
);

const LogoPreview = () => {
    const logos = [
        {
            title: "Mechframe K-Bot",
            code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="mech" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8B5CF6" />
      <stop offset="100%" style="stop-color:#06B6D4" />
    </linearGradient>
  </defs>
  <rect x="25" y="15" width="12" height="70" rx="6" fill="url(#mech)" />
  <path d="M37 50 L70 20 M37 50 L70 80" fill="none" stroke="url(#mech)" stroke-width="14" stroke-linecap="round" />
  <rect x="21" y="10" width="20" height="16" rx="5" fill="#1E293B" stroke="url(#mech)" stroke-width="2" />
  <circle cx="27" cy="18" r="2" fill="#06B6D4" />
  <circle cx="35" cy="18" r="2" fill="#06B6D4" />
</svg>`,
            element: (
                <svg viewBox="0 0 100 100" className="w-16 h-16">
                    <defs>
                        <linearGradient id="mech1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#8B5CF6" />
                            <stop offset="100%" stopColor="#06B6D4" />
                        </linearGradient>
                    </defs>
                    <rect x="25" y="15" width="12" height="70" rx="6" fill="url(#mech1)" />
                    <path d="M37 50 L70 20 M37 50 L70 80" fill="none" stroke="url(#mech1)" strokeWidth="14" strokeLinecap="round" />
                    <rect x="21" y="10" width="20" height="16" rx="5" fill="#1E293B" stroke="url(#mech1)" strokeWidth="2" />
                    <circle cx="27" cy="18" r="2" fill="#06B6D4" />
                    <circle cx="35" cy="18" r="2" fill="#06B6D4" />
                </svg>
            )
        },
        {
            title: "Visor-K Head",
            code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="45" fill="#1E293B" stroke="#7D59FF" stroke-width="2" />
  <path d="M35 30 V70 M35 50 L65 30 M35 50 L65 70" fill="none" stroke="#7D59FF" stroke-width="10" stroke-linecap="round" />
  <path d="M20 50 H80" stroke="#7D59FF" stroke-width="1" opacity="0.3" />
</svg>`,
            element: (
                <svg viewBox="0 0 100 100" className="w-16 h-16">
                    <circle cx="50" cy="50" r="45" fill="#1E293B" stroke="#7D59FF" strokeWidth="2" />
                    <path d="M35 30 V70 M35 50 L65 30 M35 50 L65 70" fill="none" stroke="#7D59FF" strokeWidth="10" stroke-linecap="round" />
                </svg>
            )
        },
        {
            title: "Antenna Bot K",
            code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M35 25 V85 M35 55 L70 25 M35 55 L70 85" fill="none" stroke="#F59E0B" stroke-width="12" stroke-linecap="round" />
  <path d="M35 25 Q35 10 25 10 M35 25 Q35 10 45 10" fill="none" stroke="#F59E0B" stroke-width="4" stroke-linecap="round" />
  <circle cx="25" cy="10" r="3" fill="#F59E0B" />
  <circle cx="45" cy="10" r="3" fill="#F59E0B" />
</svg>`,
            element: (
                <svg viewBox="0 0 100 100" className="w-16 h-16">
                    <path d="M35 25 V85 M35 55 L70 25 M35 55 L70 85" fill="none" stroke="#F59E0B" strokeWidth="12" strokeLinecap="round" />
                    <path d="M35 25 Q35 10 25 10 M35 25 Q35 10 45 10" fill="none" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
                    <circle cx="25" cy="10" r="3" fill="#F59E0B" />
                    <circle cx="45" cy="10" r="3" fill="#F59E0B" />
                </svg>
            )
        },
        {
            title: "Cyber-Visor",
            code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="25" y="25" width="50" height="50" rx="15" fill="#0F172A" stroke="#10B981" stroke-width="3" />
  <path d="M40 35 V65 M40 50 L60 35 M40 50 L60 65" fill="none" stroke="#10B981" stroke-width="8" stroke-linecap="round" />
  <circle cx="40" cy="50" r="2" fill="white" className="animate-pulse" />
</svg>`,
            element: (
                <svg viewBox="0 0 100 100" className="w-16 h-16">
                    <rect x="25" y="25" width="50" height="50" rx="15" fill="#0F172A" stroke="#10B981" strokeWidth="3" />
                    <path d="M40 35 V65 M40 50 L60 35 M40 50 L60 65" fill="none" stroke="#10B981" strokeWidth="8" strokeLinecap="round" />
                </svg>
            )
        },
        {
            title: "Mechanical K",
            code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M30 20 V80 M30 50 L60 20 M30 50 L60 80" fill="none" stroke="#A855F7" stroke-width="12" stroke-linecap="round" />
  <circle cx="30" cy="50" r="4" fill="white" />
  <rect x="55" y="15" width="10" height="10" rx="2" fill="#A855F7" opacity="0.5" />
  <rect x="55" y="75" width="10" height="10" rx="2" fill="#A855F7" opacity="0.5" />
</svg>`,
            element: (
                <svg viewBox="0 0 100 100" className="w-16 h-16">
                    <path d="M30 20 V80 M30 50 L60 20 M30 50 L60 80" fill="none" stroke="#A855F7" strokeWidth="12" strokeLinecap="round" />
                    <circle cx="30" cy="50" r="4" fill="white" />
                    <rect x="55" y="15" width="10" height="10" rx="2" fill="#A855F7" opacity="0.5" />
                    <rect x="55" y="75" width="10" height="10" rx="2" fill="#A855F7" opacity="0.5" />
                </svg>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-zinc-950 p-10 text-white font-sans">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                        Kyrobot Logo Preview
                    </h1>
                    <p className="text-zinc-400">Choose your favorite design to replace the Vite favicon.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    {logos.map((logo, idx) => (
                        <LogoCard key={idx} title={logo.title} code={logo.code}>
                            {logo.element}
                        </LogoCard>
                    ))}
                </div>

                <section className="mt-16 bg-white/5 border border-white/10 rounded-3xl p-8">
                    <h2 className="text-2xl font-bold mb-4">How to Update Favicon</h2>
                    <ol className="list-decimal list-inside space-y-4 text-zinc-300">
                        <li>Choose a logo above and click <strong>"Copy SVG Code"</strong>.</li>
                        <li>Go to your <code className="bg-black/40 px-2 py-1 rounded text-purple-400">public/</code> folder.</li>
                        <li>Open <code className="bg-black/40 px-2 py-1 rounded text-purple-400">favicon.svg</code> (or create it).</li>
                        <li>Paste the code and save.</li>
                        <li>Check <code className="bg-black/40 px-2 py-1 rounded text-purple-400">index.html</code> for the <code className="bg-black/40 px-2 py-1 rounded text-zinc-500">{"<link rel=\"icon\" ... / >"}</code> tag.</li>
                    </ol>
                </section>
            </div>
        </div>
    );
};

export default LogoPreview;

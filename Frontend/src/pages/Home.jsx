import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Zap, Shield, Cpu, GraduationCap, Code, PenTool, ArrowRight, Github, Twitter, Linkedin } from 'lucide-react';
import NeuralNetwork from '../components/NeuralNetwork';
import KyraLogo from '../components/KyraLogo';

export default function Home() {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            // navigate('/chat'); 
        }
    }, [token, navigate]);

    return (
        <div className="min-h-screen bg-zd-canvas overflow-x-hidden pt-16">
            <div className="absolute top-0 left-0 w-full h-[320px] sm:h-[420px] lg:h-[500px] bg-gradient-to-b from-zd-surface2 to-zd-canvas pointer-events-none"></div>

            {/* Hero Section */}
            <section className="relative pt-16 pb-16 md:pt-20 md:pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zd-surface border border-zd-border text-zd-ink text-sm font-medium mb-6 animate-pulse-slow">
                                <span className="w-2 h-2 rounded-full bg-zd-brand"></span>
                                Live System Status: Optimal
                            </div>
                            <h1 className="text-4xl xs:text-5xl md:text-6xl lg:text-7xl font-bold text-zd-ink mb-6 leading-tight tracking-tight">
                                KyroBot: <span className="text-transparent bg-clip-text bg-gradient-to-r from-zd-brand to-zd-brand2">AI, Evolved.</span>
                            </h1>
                            <p className="text-lg md:text-xl text-zd-muted mb-8 max-w-lg mx-auto lg:mx-0">
                                Get clear answers, stronger writing, and better code in seconds. Built for teams, students, and builders who care about quality, privacy, and consistency.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                                {token ? (
                                    <Link to="/chat" className="px-8 py-4 bg-zd-brand hover:bg-zd-brand2 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-[rgba(125,89,255,0.20)] hover:shadow-[rgba(125,89,255,0.28)] flex items-center gap-2 transform hover:-translate-y-1">
                                        Open Chat <ChevronRight className="w-5 h-5" />
                                    </Link>
                                ) : (
                                    <Link to="/signup" className="px-8 py-4 bg-zd-brand hover:bg-zd-brand2 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-[rgba(125,89,255,0.20)] hover:shadow-[rgba(125,89,255,0.28)] flex items-center gap-2 transform hover:-translate-y-1">
                                        Start Chatting <ChevronRight className="w-5 h-5" />
                                    </Link>
                                )}
                                <Link to="/about" className="px-8 py-4 bg-zd-surface hover:bg-zd-surface2 text-zd-ink border border-zd-border rounded-xl font-bold text-lg transition-all shadow-sm">
                                    See how it works
                                </Link>
                            </div>
                        </div>
                        <div className="relative h-[260px] sm:h-[340px] lg:h-[500px] w-full overflow-hidden">
                            <NeuralNetwork />
                        </div>
                    </div>
                </div>
            </section>

            {/* Metrics */}
            <section className="py-12 border-y border-zd-border bg-zd-surface/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
                        {[
                            { value: "100ms", label: "Avg Latency" },
                            { value: "99.9%", label: "Uptime" },
                            { value: "50M+", label: "Requests" },
                            { value: "Zero", label: "Logs Stored" },
                        ].map((stat, index) => (
                            <div key={index} className="text-center group">
                                <div className="text-2xl xs:text-3xl md:text-5xl font-bold text-zd-brand mb-1 group-hover:scale-110 transition-transform duration-300">{stat.value}</div>
                                <div className="text-[10px] md:text-sm font-bold text-zd-muted uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Use Cases */}
            <section className="py-20 md:py-24 bg-zd-surface relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] lg:w-[600px] lg:h-[600px] bg-zd-brandSoft rounded-full blur-3xl pointer-events-none opacity-50"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-zd-ink mb-4">Tailored for Every Workflow</h2>
                        <p className="text-zd-muted max-w-2xl mx-auto text-lg">Purpose-built modes that keep responses focused, structured, and ready to use.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: GraduationCap, title: "Study & Research", desc: "Understand concepts faster with step-by-step explanations, summaries, and exam-ready notes." },
                            { icon: Code, title: "Engineering", desc: "Debug, refactor, and ship features with clean suggestions and production-minded outputs." },
                            { icon: PenTool, title: "Content & Communication", desc: "Draft emails, posts, and docs with the right tone — concise, clear, and on-brand." },
                        ].map((item, i) => (
                            <div key={i} className="p-8 rounded-2xl bg-zd-surface border border-zd-border hover:border-zd-brand/40 transition-all group hover:-translate-y-2 shadow-sm hover:shadow-lg">
                                <div className="w-14 h-14 bg-zd-brandSoft rounded-xl flex items-center justify-center mb-6 border border-zd-border group-hover:border-zd-brand/40 transition-colors">
                                    <item.icon className="w-7 h-7 text-zd-brand group-hover:text-zd-brand2 transition-colors" />
                                </div>
                                <h3 className="text-2xl font-bold text-zd-ink mb-3">{item.title}</h3>
                                <p className="text-zd-muted leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Core Capabilities */}
            <section className="py-20 md:py-24 bg-zd-canvas">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-zd-ink">Core Capabilities</h2>
                        <div className="flex gap-2 text-zd-muted mt-4 md:mt-0">
                            <span className="w-3 h-3 rounded-full bg-zd-brand animate-pulse"></span>
                            Online & Ready
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Zap, title: "Fast by design", desc: "Low-latency answers that keep your flow uninterrupted — from quick questions to deep work." },
                            { icon: Shield, title: "Privacy-first", desc: "Designed with safety and data minimization in mind, so you stay in control of what you share." },
                            { icon: Cpu, title: "Context-aware", desc: "Understands your intent and adapts to your style — technical, creative, or analytical." },
                        ].map((cap, i) => (
                            <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-zd-surface transition-all hover:shadow-md">
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-zd-surface flex items-center justify-center border border-zd-border text-zd-brand shadow-sm">
                                    <cap.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-zd-ink mb-2">{cap.title}</h3>
                                    <p className="text-zd-muted text-sm leading-relaxed">{cap.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 md:py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-zd-brandSoft to-zd-surface2 opacity-70"></div>
                <div className="max-w-4xl mx-auto px-4 relative z-10 text-center bg-zd-surface p-12 rounded-3xl border border-zd-border shadow-xl">
                    <h2 className="text-3xl md:text-5xl font-bold text-zd-ink mb-6">Ready to build the future?</h2>
                    <p className="text-lg md:text-xl text-zd-muted mb-10">Start in minutes. Ask better questions, get better outputs, and move faster — without the fluff.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        {token ? (
                            <Link to="/chat" className="w-full sm:w-auto px-10 py-4 bg-zd-brand hover:bg-zd-brand2 text-white rounded-full font-bold text-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[rgba(125,89,255,0.18)]">
                                Continue to Chat <ArrowRight className="w-5 h-5" />
                            </Link>
                        ) : (
                            <Link to="/signup" className="w-full sm:w-auto px-10 py-4 bg-zd-brand hover:bg-zd-brand2 text-white rounded-full font-bold text-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[rgba(125,89,255,0.18)]">
                                Get Started Free <ArrowRight className="w-5 h-5" />
                            </Link>
                        )}
                        <button className="w-full sm:w-auto px-10 py-4 bg-transparent border border-zd-border hover:bg-zd-surface2 text-zd-ink rounded-full font-bold text-lg transition-colors">
                            Contact Sales
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-zd-surface py-10 md:py-12 border-t border-zd-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <KyraLogo size="sm" />
                                <span className="text-2xl font-bold text-zd-ink tracking-tight">KyroBot</span>
                            </div>
                            <p className="text-[10px] font-bold text-zd-brand uppercase tracking-widest mb-4">
                                AI, Evolved.
                            </p>
                            <p className="text-zd-muted max-w-xs">The world's most advanced AI platform for the next generation of digital creators and builders.</p>
                        </div>
                        <div>
                            <h4 className="text-zd-ink font-bold mb-4 uppercase tracking-wider text-sm">Product</h4>
                            <ul className="space-y-2 text-sm text-zd-muted">
                                <li><a href="#" className="hover:text-zd-ink transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-zd-ink transition-colors">API</a></li>
                                <li><a href="#" className="hover:text-zd-ink transition-colors">Security</a></li>
                                <li><a href="#" className="hover:text-zd-ink transition-colors">Pricing</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-zd-ink font-bold mb-4 uppercase tracking-wider text-sm">Company</h4>
                            <ul className="space-y-2 text-sm text-zd-muted">
                                <li><Link to="/about" className="hover:text-zd-ink transition-colors">About</Link></li>
                                <li><a href="#" className="hover:text-zd-ink transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-zd-ink transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-zd-ink transition-colors">Press</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-zd-border flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-zd-muted text-sm">© 2026 KyroBot Technologies Inc.</div>
                        <div className="flex gap-4">
                            <a href="https://x.com/isha_singh06" target="_blank" rel="noopener noreferrer" className="text-zd-muted/70 hover:text-zd-ink transition-colors"><Twitter size={20} /></a>
                            <a href="https://github.com/IshaCodes04" target="_blank" rel="noopener noreferrer" className="text-zd-muted/70 hover:text-zd-ink transition-colors"><Github size={20} /></a>
                            <a href="https://www.linkedin.com/in/isha-singh-b00715300/" target="_blank" rel="noopener noreferrer" className="text-zd-muted/70 hover:text-zd-ink transition-colors"><Linkedin size={20} /></a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

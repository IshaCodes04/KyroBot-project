import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Zap, Shield, Cpu, GraduationCap, Code, PenTool, ArrowRight, Github, Twitter, Linkedin } from 'lucide-react';
import NeuralNetwork from '../components/NeuralNetwork';

export default function Home() {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            // navigate('/chat'); 
        }
    }, [token, navigate]);

    return (
        <div className="min-h-screen bg-slate-50 overflow-x-hidden pt-16">
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-50 to-slate-50 pointer-events-none"></div>

            {/* Hero Section */}
            <section className="relative pt-20 pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-600 text-sm font-medium mb-6 animate-pulse-slow">
                                <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                                Live System Status: Optimal
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
                                Intelligence Reimagined for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">Next Gen</span>
                            </h1>
                            <p className="text-xl text-slate-600 mb-8 max-w-lg mx-auto lg:mx-0">
                                Bridging the gap between complex data and creative output. Designed for students, developers, and creators who demand excellence in every interaction.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                                <Link to="/signup" className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 flex items-center gap-2 transform hover:-translate-y-1">
                                    Start Chatting <ChevronRight className="w-5 h-5" />
                                </Link>
                                <Link to="/about" className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-bold text-lg transition-all shadow-sm">
                                    Read the Whitepaper
                                </Link>
                            </div>
                        </div>
                        <div className="relative h-[400px] lg:h-[500px] w-full overflow-hidden">
                            <NeuralNetwork />
                        </div>
                    </div>
                </div>
            </section>

            {/* Metrics */}
            <section className="py-12 border-y border-slate-200 bg-white/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { value: "100ms", label: "Avg Latency" },
                            { value: "99.9%", label: "Uptime Guarantee" },
                            { value: "50M+", label: "Queries Handled" },
                            { value: "Zero", label: "Data Retention" },
                        ].map((stat, index) => (
                            <div key={index} className="text-center group">
                                <div className="text-3xl md:text-5xl font-bold text-cyan-600 mb-2 group-hover:scale-110 transition-transform duration-300">{stat.value}</div>
                                <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Use Cases */}
            <section className="py-24 bg-white relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl pointer-events-none opacity-50"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Tailored for Every Workflow</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto text-lg">We've built specialized contexts to help you achieve more in your specific field of expertise.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: GraduationCap, title: "Academic Excellence", desc: "Empowering students to master complex subjects with instant, cited explanations and personalized study plans." },
                            { icon: Code, title: "Rapid Prototyping", desc: "A developer's companion for debugging, architecting next-gen apps, and generating boilerplate in seconds." },
                            { icon: PenTool, title: "Creative Expression", desc: "Unleashing new possibilities for artists, writers, and content creators with high-fidelity creative assistance." },
                        ].map((item, i) => (
                            <div key={i} className="p-8 rounded-2xl bg-white border border-slate-200 hover:border-cyan-500/50 transition-all group hover:-translate-y-2 shadow-sm hover:shadow-lg">
                                <div className="w-14 h-14 bg-cyan-50 rounded-xl flex items-center justify-center mb-6 border border-cyan-100 group-hover:border-cyan-500 transition-colors">
                                    <item.icon className="w-7 h-7 text-cyan-600 group-hover:text-cyan-700 transition-colors" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Core Capabilities */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Core Capabilities</h2>
                        <div className="flex gap-2 text-slate-600 mt-4 md:mt-0">
                            <span className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse"></span>
                            Online & Ready
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Zap, title: "Fast Responses", desc: "Low-latency processing powered by global edge computing for near-instant answers to any query." },
                            { icon: Shield, title: "Secure Conversations", desc: "Enterprise-grade AES-256 encryption ensuring your proprietary data and privacy are always protected." },
                            { icon: Cpu, title: "Smart AI", desc: "Context-aware transformer models that learn your specific workflow and style over time." },
                        ].map((cap, i) => (
                            <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-white transition-all hover:shadow-md">
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white flex items-center justify-center border border-slate-200 text-cyan-600 shadow-sm">
                                    <cap.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">{cap.title}</h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">{cap.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-50 to-blue-50 opacity-50"></div>
                <div className="max-w-4xl mx-auto px-4 relative z-10 text-center bg-white p-12 rounded-3xl border border-slate-200 shadow-xl">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Ready to build the future?</h2>
                    <p className="text-xl text-slate-600 mb-10">Join over 500,000 users who are already leveraging the power of our next-generation AI platform.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/signup" className="px-10 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full font-bold text-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-200">
                            Get Started Free <ArrowRight className="w-5 h-5" />
                        </Link>
                        <button className="px-10 py-4 bg-transparent border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-full font-bold text-lg transition-colors">
                            Contact Sales
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white py-12 border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-1.5 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg text-white">
                                    <Cpu size={24} />
                                </div>
                                <span className="text-2xl font-bold text-slate-900">AI Bot</span>
                            </div>
                            <p className="text-slate-600 max-w-xs">The world's most advanced AI platform for the next generation of digital creators and builders.</p>
                        </div>
                        <div>
                            <h4 className="text-slate-900 font-bold mb-4 uppercase tracking-wider text-sm">Product</h4>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li><a href="#" className="hover:text-cyan-600 transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-cyan-600 transition-colors">API</a></li>
                                <li><a href="#" className="hover:text-cyan-600 transition-colors">Security</a></li>
                                <li><a href="#" className="hover:text-cyan-600 transition-colors">Pricing</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-slate-900 font-bold mb-4 uppercase tracking-wider text-sm">Company</h4>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li><Link to="/about" className="hover:text-cyan-600 transition-colors">About</Link></li>
                                <li><a href="#" className="hover:text-cyan-600 transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-cyan-600 transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-cyan-600 transition-colors">Press</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-slate-600 text-sm">© 2024 AI Bot Technologies Inc.</div>
                        <div className="flex gap-4">
                            <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors"><Github size={20} /></a>
                            <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors"><Linkedin size={20} /></a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

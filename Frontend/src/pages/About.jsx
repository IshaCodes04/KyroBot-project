import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Globe, Users, Code2, Cpu, ShieldCheck, Zap } from 'lucide-react';
import NeuralNetwork from '../components/NeuralNetwork';

export default function About() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-50 overflow-hidden pt-16">
      {/* Background with Neural Network - Fixed Position for Parallax-like feel */}
      <div className="fixed inset-0 z-0 opacity-40">
        <NeuralNetwork />
      </div>

      {/* Gradient Overlay */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-slate-50/50 via-slate-50/80 to-slate-50 pointer-events-none"></div>


      <div className="relative z-10">

        {/* Hero Section */}
        <section className="relative py-12 lg:py-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <div style={{ transform: `translateY(${scrollY * 0.2}px)` }} className="transition-transform duration-75">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-600 text-sm font-medium mb-8">
                <span className="animate-pulse">●</span> Our Story
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 tracking-tight">
                We are building the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">Mind of the Future</span>
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Born from a vision to democratize super-intelligence. We're bridging the gap between human creativity and artificial capability.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section with Glassmorphism */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "Active Users", value: "120K+", icon: Users },
                { label: "Daily Queries", value: "2M+", icon: Zap },
                { label: "Countries", value: "150+", icon: Globe },
                { label: "Uptime", value: "99.99%", icon: CheckCircle2 }
              ].map((stat, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white border border-slate-200 backdrop-blur-md hover:shadow-lg transition-all group text-center shadow-sm">
                  <stat.icon className="w-8 h-8 text-cyan-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-500 uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <h2 className="text-4xl font-bold text-slate-900">Engineering the impossible</h2>
                <div className="space-y-6">
                  <div className="flex gap-4 p-4 rounded-xl bg-white border border-slate-200 hover:border-cyan-500/30 transition-colors shadow-sm">
                    <div className="flex-shrink-0 w-12 h-12 bg-cyan-50 rounded-lg flex items-center justify-center text-cyan-600">
                      <Cpu className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Technological Supremacy</h3>
                      <p className="text-slate-600">Our proprietary LLM architecture delivers 3x faster inference at half the computational cost of competitors.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-4 rounded-xl bg-white border border-slate-200 hover:border-cyan-500/30 transition-colors shadow-sm">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Ethical Core</h3>
                      <p className="text-slate-600">We believe in transparent, bias-aware AI development that prioritizes user safety and data privacy.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-4 rounded-xl bg-white border border-slate-200 hover:border-cyan-500/30 transition-colors shadow-sm">
                    <div className="flex-shrink-0 w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
                      <Code2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Developer First</h3>
                      <p className="text-slate-600">Built by developers, for developers. Our API allows deep integration into any tech stack within minutes.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-200 to-blue-200 rounded-2xl opacity-50 blur-xl"></div>
                <div className="relative rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-2xl p-8">
                  <div className="space-y-4 font-mono text-sm text-slate-600">
                    <div className="flex items-center gap-2 text-slate-400 border-b border-slate-100 pb-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="ml-2">mission.config.json</span>
                    </div>
                    <p><span className="text-purple-600">"vision"</span>: <span className="text-green-600">"Universal Access"</span>,</p>
                    <p><span className="text-purple-600">"target"</span>: <span className="text-green-600">"Augment Human Intellect"</span>,</p>
                    <p><span className="text-purple-600">"values"</span>: [</p>
                    <p className="pl-4"><span className="text-green-600">"Transparency"</span>,</p>
                    <p className="pl-4"><span className="text-green-600">"Innovation"</span>,</p>
                    <p className="pl-4"><span className="text-green-600">"User-Centricity"</span></p>
                    <p>],</p>
                    <p><span className="text-purple-600">"status"</span>: <span className="text-blue-600">"EXECUTING..."</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partners */}
        <section className="py-20 border-t border-slate-200 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-slate-500 mb-12 uppercase tracking-widest font-semibold text-sm">Trusted by Industry Leaders</p>
            <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Placeholder logos using text for now, could be replaced with SVGs */}
              {['TECHCORP', 'NEXUS AI', 'CYBERDYNE', 'MASSIVE DYNAMIC', 'Hooli'].map((partner) => (
                <div key={partner} className="text-2xl font-bold text-slate-400 hover:text-slate-600 flex items-center gap-2">
                  <div className="w-8 h-8 bg-slate-200 rounded-md"></div>
                  {partner}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 text-center">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Join the Revolution</h2>
            <p className="text-xl text-slate-600 mb-10">Don't just watch the future happen. Build it with us.</p>
            <Link to="/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-cyan-600/25">
              Start Building Now <ArrowRight size={20} />
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
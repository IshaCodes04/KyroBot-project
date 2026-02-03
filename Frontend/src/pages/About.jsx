import { useEffect, useState } from 'react';
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
    <div className="relative min-h-screen bg-zd-canvas overflow-hidden pt-16">
      {/* Background with Neural Network - Fixed Position for Parallax-like feel */}
      <div className="fixed inset-0 z-0 opacity-40">
        <NeuralNetwork />
      </div>

      {/* Gradient Overlay */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-zd-canvas/50 via-zd-canvas/80 to-zd-canvas pointer-events-none"></div>


      <div className="relative z-10">

        {/* Hero Section */}
        <section className="relative py-12 lg:py-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <div style={{ transform: `translateY(${scrollY * 0.2}px)` }} className="transition-transform duration-75">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zd-surface border border-zd-border text-zd-ink text-sm font-medium mb-8">
                <span className="animate-pulse">●</span> Our Story
              </div>
              <h1 className="text-4xl xs:text-5xl md:text-7xl font-bold text-zd-ink mb-8 tracking-tight px-2">
                We build AI that helps people do <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-zd-brand to-zd-brand2">their best work</span>
              </h1>
              <p className="text-xl text-zd-muted max-w-2xl mx-auto leading-relaxed">
                We focus on clarity, speed, and trust—so students, creators, and teams can move from idea to outcome with confidence.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section with Glassmorphism */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {[
                { label: "Active Users", value: "120K+", icon: Users },
                { label: "Daily Queries", value: "2M+", icon: Zap },
                { label: "Countries", value: "150+", icon: Globe },
                { label: "Uptime", value: "99.99%", icon: CheckCircle2 }
              ].map((stat, i) => (
                <div key={i} className="p-4 sm:p-6 rounded-2xl bg-zd-surface border border-zd-border backdrop-blur-md hover:shadow-lg transition-all group text-center shadow-sm">
                  <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-zd-brand mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform" />
                  <div className="text-xl sm:text-3xl font-bold text-zd-ink mb-1">{stat.value}</div>
                  <div className="text-[10px] sm:text-sm text-zd-muted uppercase tracking-widest">{stat.label}</div>
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
                <h2 className="text-4xl font-bold text-zd-ink">Built for real work</h2>
                <div className="space-y-6">
                  <div className="flex gap-4 p-4 rounded-xl bg-zd-surface border border-zd-border hover:border-zd-brand/30 transition-colors shadow-sm">
                    <div className="flex-shrink-0 w-12 h-12 bg-zd-brandSoft rounded-lg flex items-center justify-center text-zd-brand">
                      <Cpu className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-zd-ink mb-2">Quality-first responses</h3>
                      <p className="text-zd-muted">Structured outputs, better reasoning, and less fluff—so you can act on answers, not decode them.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-4 rounded-xl bg-zd-surface border border-zd-border hover:border-zd-brand/30 transition-colors shadow-sm">
                    <div className="flex-shrink-0 w-12 h-12 bg-zd-brandSoft rounded-lg flex items-center justify-center text-zd-brand2">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-zd-ink mb-2">Privacy & safety</h3>
                      <p className="text-zd-muted">Designed with data minimization and user control in mind—your conversations should stay yours.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-4 rounded-xl bg-zd-surface border border-zd-border hover:border-zd-brand/30 transition-colors shadow-sm">
                    <div className="flex-shrink-0 w-12 h-12 bg-zd-brandSoft rounded-lg flex items-center justify-center text-zd-brand">
                      <Code2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-zd-ink mb-2">Made for builders</h3>
                      <p className="text-zd-muted">From quick prototyping to production help—use it as a teammate that understands your workflow.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-zd-brandSoft to-zd-surface2 rounded-2xl opacity-70 blur-xl"></div>
                <div className="relative rounded-2xl bg-zd-surface border border-zd-border overflow-hidden shadow-2xl p-8">
                  <div className="space-y-4 font-mono text-sm text-zd-muted">
                    <div className="flex items-center gap-2 text-zd-muted/80 border-b border-zd-border pb-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="ml-2">mission.config.json</span>
                    </div>
                    <p><span className="text-zd-brand2">"vision"</span>: <span className="text-green-600">"Universal Access"</span>,</p>
                    <p><span className="text-zd-brand2">"target"</span>: <span className="text-green-600">"Augment Human Intellect"</span>,</p>
                    <p><span className="text-zd-brand2">"values"</span>: [</p>
                    <p className="pl-4"><span className="text-green-600">"Transparency"</span>,</p>
                    <p className="pl-4"><span className="text-green-600">"Innovation"</span>,</p>
                    <p className="pl-4"><span className="text-green-600">"User-Centricity"</span></p>
                    <p>],</p>
                    <p><span className="text-zd-brand2">"status"</span>: <span className="text-zd-ink">"EXECUTING..."</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What you can expect */}
        <section className="py-20 border-t border-zd-border bg-zd-canvas">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-zd-muted uppercase tracking-widest font-semibold text-sm mb-4">What you can expect</p>
              <h2 className="text-4xl font-bold text-zd-ink mb-5">A faster way to go from question to outcome</h2>
              <p className="text-lg text-zd-muted leading-relaxed">
                Built to be dependable in real workflows—clear answers, useful structure, and a calm experience that stays out of your way.
              </p>
            </div>

            <div className="mt-12 grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Zap,
                  title: "Clear and actionable",
                  desc: "Structured responses that are easy to apply—steps, checklists, drafts, and decisions.",
                },
                {
                  icon: ShieldCheck,
                  title: "Trust by default",
                  desc: "Privacy-first design principles, so you can share only what you choose—nothing more.",
                },
                {
                  icon: Users,
                  title: "Made for humans",
                  desc: "Helpful tone, fewer distractions, and outputs that feel consistent across sessions.",
                },
              ].map((item, i) => (
                <div key={i} className="p-7 rounded-2xl bg-zd-surface border border-zd-border shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-zd-brandSoft border border-zd-border flex items-center justify-center text-zd-brand mb-5">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-zd-ink mb-2">{item.title}</h3>
                  <p className="text-zd-muted leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 text-center">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-zd-ink mb-6">Ready to try it?</h2>
            <p className="text-xl text-zd-muted mb-10">
              Create your account and start asking better questions—get sharper answers, cleaner drafts, and faster progress.
            </p>
            <Link to="/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-zd-brand hover:bg-zd-brand2 text-white rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-[rgba(125,89,255,0.25)]">
              Get started free <ArrowRight size={20} />
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
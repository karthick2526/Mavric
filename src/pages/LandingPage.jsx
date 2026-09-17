import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  TrendingUp,
  Target,
  Sliders,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Play
} from 'lucide-react';

export const LandingPage = ({ onNavigateLogin, onEnterApp }) => {
  return (
    <div className="min-h-screen bg-[#191A17] text-[#F1E8D7] selection:bg-[#C9704C]/30 selection:text-[#F1E8D7]">
      {/* Landing Navbar */}
      <header className="sticky top-0 z-40 bg-[#191A17]/85 backdrop-blur-md border-b border-[#2D2F2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#C9704C] to-[#C4A16A] flex items-center justify-center text-[#191A17] font-serif font-bold text-xl shadow-lg shadow-[#C9704C]/20">
              M
            </div>
            <span className="font-serif font-bold text-2xl tracking-tight text-[#F1E8D7]">
              Mavric
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#F1E8D7]/75">
            <a href="#features" className="hover:text-[#F1E8D7] transition-colors">Home</a>
            <a href="#features" className="hover:text-[#F1E8D7] transition-colors">Features</a>
            <a href="#story" className="hover:text-[#F1E8D7] transition-colors">Philosophy</a>
            <a href="#story" className="hover:text-[#F1E8D7] transition-colors">About</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onNavigateLogin}
              className="text-xs sm:text-sm font-medium text-[#F1E8D7]/80 hover:text-[#F1E8D7] px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
            >
              Login
            </button>
            <button
              type="button"
              onClick={onEnterApp}
              className="px-4 sm:px-5 py-2.5 rounded-xl bg-[#C9704C] hover:bg-[#b05f3d] text-[#F1E8D7] text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-lg shadow-[#C9704C]/25 cursor-pointer flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Cinematic Editorial Mood */}
      <section className="relative pt-16 pb-20 overflow-hidden">
        {/* Subtle background ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-[#C9704C]/10 via-[#C4A16A]/10 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#2D2F2A] bg-[#20221D]/80 text-xs font-semibold text-[#C4A16A] mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PERSONAL FINANCE WORKSPACE & SCENARIO ENGINE</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight max-w-4xl mx-auto leading-[1.1] text-[#F1E8D7]">
            Plan your income, control your expenses, reach your goals.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-[#F1E8D7]/70 max-w-2xl mx-auto leading-relaxed font-normal">
            Mavric helps you understand how financial choices affect savings, goals, monthly cushion, and future cash flow <span className="text-[#C4A16A] font-medium">before committing to them</span>.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={onEnterApp}
              className="px-7 py-3.5 rounded-xl bg-[#C9704C] hover:bg-[#b05f3d] text-white text-sm font-semibold tracking-wide shadow-xl shadow-[#C9704C]/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Start Planning</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onEnterApp}
              className="px-6 py-3.5 rounded-xl border border-[#2D2F2A] bg-[#20221D] hover:bg-[#282B24] text-[#F1E8D7] text-sm font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current text-[#C4A16A]" />
              <span>Explore Interactive Demo</span>
            </button>
          </div>

          {/* Social Proof Metric Bar */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 sm:gap-14 border-y border-[#2D2F2A]/60 py-6 max-w-3xl mx-auto text-[#F1E8D7]">
            <div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-[#F1E8D7]">10K+</div>
              <div className="text-xs text-[#F1E8D7]/50 mt-0.5">Active Planners</div>
            </div>
            <div className="w-px h-8 bg-[#2D2F2A] hidden sm:block" />
            <div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-[#C4A16A]">4.8/5</div>
              <div className="text-xs text-[#F1E8D7]/50 mt-0.5">User Rating</div>
            </div>
            <div className="w-px h-8 bg-[#2D2F2A] hidden sm:block" />
            <div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-[#69745B]">100%</div>
              <div className="text-xs text-[#F1E8D7]/50 mt-0.5">Data Privacy & Sandbox</div>
            </div>
          </div>

          {/* Hero 3D Dashboard Mockup Device Presentation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-14 max-w-5xl mx-auto perspective-1000"
          >
            <div className="rounded-2xl p-2 sm:p-3 bg-[#20221D] border border-[#2D2F2A] shadow-2xl shadow-black/80 transform sm:rotate-x-3 hover:rotate-x-0 transition-transform duration-500">
              {/* Device Frame Window */}
              <div className="rounded-xl bg-[#191A17] border border-[#2D2F2A] overflow-hidden text-left">
                {/* Window top bar */}
                <div className="px-4 py-3 bg-[#141512] border-b border-[#2D2F2A] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#C9704C]/80" />
                    <div className="w-3 h-3 rounded-full bg-[#C4A16A]/80" />
                    <div className="w-3 h-3 rounded-full bg-[#69745B]/80" />
                    <span className="ml-3 text-xs text-[#F1E8D7]/50 font-mono">mavric.app / workspace / karthick</span>
                  </div>
                  <div className="text-xs text-[#C4A16A] font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#69745B] animate-pulse" />
                    Pulse 78/100 Stable
                  </div>
                </div>

                {/* Inside Dashboard Sneak Peek */}
                <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-gradient-to-b from-[#191A17] to-[#141512]">
                  <div className="p-4 rounded-xl bg-[#20221D] border border-[#2D2F2A]">
                    <span className="text-[11px] text-[#F1E8D7]/50 uppercase font-semibold">Monthly Income</span>
                    <div className="text-2xl font-bold text-[#F1E8D7] mt-1">₹48,500</div>
                    <span className="text-xs text-[#69745B] font-semibold mt-1 inline-block">+12% vs benchmark</span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#20221D] border border-[#2D2F2A]">
                    <span className="text-[11px] text-[#F1E8D7]/50 uppercase font-semibold">Living Expenses</span>
                    <div className="text-2xl font-bold text-[#F1E8D7] mt-1">₹31,800</div>
                    <span className="text-xs text-[#69745B] font-semibold mt-1 inline-block">-8% controlled</span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#20221D] border border-[#C4A16A]/30">
                    <span className="text-[11px] text-[#C4A16A] uppercase font-semibold">Available Cushion</span>
                    <div className="text-2xl font-bold text-[#C4A16A] mt-1">₹16,700</div>
                    <span className="text-xs text-[#F1E8D7]/60 mt-1 inline-block">+34% cash flow buffer</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Strip as specified on Page 6 */}
      <section id="features" className="py-16 bg-[#141512] border-y border-[#2D2F2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest text-[#C4A16A] font-semibold">
              The Signature Advantage
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#F1E8D7] mt-2">
              Everything built for explainable foresight
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                icon: TrendingUp,
                title: 'Track Everything',
                desc: 'Manage income, expenses, and recurring bills in one place.'
              },
              {
                icon: Target,
                title: 'Set & Achieve Goals',
                desc: 'Build your future with structured priority goal planning.'
              },
              {
                icon: Sliders,
                title: 'Explore Scenarios',
                desc: 'See how changes impact your finances before you act.'
              },
              {
                icon: Sparkles,
                title: 'Get Actionable Insights',
                desc: 'Understand your money with clear, diagnostic insights.'
              },
              {
                icon: ShieldCheck,
                title: 'Stay in Control',
                desc: 'Make confident decisions backed by financial stress tests.'
              }
            ].map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-[#191A17] border border-[#2D2F2A] hover:border-[#C4A16A]/30 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-[#20221D] border border-[#2D2F2A] flex items-center justify-center text-[#C4A16A] group-hover:text-[#F1E8D7] group-hover:bg-[#C9704C] transition-colors mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif text-lg text-[#F1E8D7] mb-2 font-medium">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-[#F1E8D7]/60 leading-relaxed font-normal">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Storytelling Section as specified on Page 3 & 6 */}
      <section id="story" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left text column */}
            <div>
              <span className="text-xs uppercase tracking-widest text-[#C4A16A] font-semibold">
                The Mavric Difference
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-[#F1E8D7] mt-3 leading-tight">
                More than a budget.<br />A smarter financial journey.
              </h2>
              <p className="text-[#F1E8D7]/75 mt-5 leading-relaxed text-sm sm:text-base">
                Whether you want to save for a dream, plan a big purchase, or simply get better with money — Mavric gives you the clarity and tools to make it happen without guesswork.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  'Test "what-if" scenarios without altering real ledger records',
                  'Simulate salary shocks and evaluate automated recovery modes',
                  'Detect goal collisions before monthly commitments fall behind',
                  'Generate audit-ready Decision Receipts for major purchases'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#69745B]/20 text-[#69745B] flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs sm:text-sm text-[#F1E8D7]/80">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <button
                  type="button"
                  onClick={onEnterApp}
                  className="px-6 py-3 rounded-xl bg-[#20221D] border border-[#2D2F2A] hover:border-[#C4A16A] text-[#F1E8D7] text-xs sm:text-sm font-semibold transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Launch Mavric Workspace</span>
                  <ArrowRight className="w-4 h-4 text-[#C4A16A]" />
                </button>
              </div>
            </div>

            {/* Right card: Editorial visual story block */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#20221D] to-[#141512] border border-[#2D2F2A] shadow-2xl relative overflow-hidden">
              <div className="p-6 rounded-2xl bg-[#191A17] border border-[#2D2F2A] mb-6">
                <div className="flex items-center justify-between pb-3 border-b border-[#2D2F2A]">
                  <span className="font-serif font-bold text-sm text-[#F1E8D7]">YOUR FINANCIAL PLAN</span>
                  <span className="text-[11px] text-[#69745B] font-semibold">Active</span>
                </div>
                <div className="mt-4 space-y-2.5 text-xs text-[#F1E8D7]/75">
                  <div className="flex items-center gap-2 text-[#69745B]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Track Income & Expenses</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#69745B]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Build Goals & Emergency Cushion</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#C4A16A]">
                    <Sliders className="w-4 h-4" />
                    <span>Run Scenario Lab Simulations</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#F1E8D7]/50">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Secure Your Future Free of Debt Collisions</span>
                  </div>
                </div>
              </div>

              {/* Editorial Quote Stamp */}
              <div className="p-5 rounded-2xl bg-[#C4A16A]/10 border border-[#C4A16A]/30 text-center">
                <p className="font-serif italic text-lg sm:text-xl text-[#F1E8D7]">
                  "Small steps today. Big freedom tomorrow."
                </p>
                <span className="text-[11px] uppercase tracking-widest text-[#C4A16A] font-bold block mt-2">
                  The Mavric Philosophy
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Landing Footer */}
      <footer className="border-t border-[#2D2F2A] py-10 bg-[#141512] text-xs text-[#F1E8D7]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-serif font-bold text-base text-[#F1E8D7]">Mavric</span>
            <span>•</span>
            <span>Personal Finance Control & Scenario Planning</span>
          </div>
          <div>
            Built with React, Vite, and Axios for Karthick • Portfolio Demo
          </div>
        </div>
      </footer>
    </div>
  );
};

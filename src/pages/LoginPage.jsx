import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, ArrowRight, ShieldCheck, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export const LoginPage = ({ onNavigateLanding, onLoginSuccess }) => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('karthick@mavric.demo');
  const [password, setPassword] = useState('karthick123');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const res = await login(email, password);
    if (res.success) {
      if (onLoginSuccess) onLoginSuccess();
    } else {
      setError(res.error || 'Authentication error. Please check your credentials.');
    }
  };

  const handleFillDemo = () => {
    setEmail('karthick@mavric.demo');
    setPassword('karthick123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#141512] text-[#F1E8D7] flex flex-col justify-between relative overflow-hidden">
      {/* Background 3D Floating Financial Document Scene */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25">
        {/* Floating Document Layer 1 (Left Back) */}
        <motion.div
          animate={{ y: [0, -12, 0], rotate: [-6, -4, -6] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-10 -left-10 w-96 h-80 rounded-2xl bg-[#191A17] border border-[#2D2F2A] p-6 shadow-2xl"
        >
          <div className="flex justify-between items-center border-b border-[#2D2F2A] pb-3 mb-4">
            <span className="font-serif text-xs text-[#C4A16A]">FINANCIAL LEDGER // REF #2026-09</span>
            <span className="text-[10px] text-[#F1E8D7]/40">VERIFIED</span>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-3/4 bg-[#2D2F2A] rounded" />
            <div className="h-3 w-1/2 bg-[#2D2F2A] rounded" />
            <div className="h-3 w-5/6 bg-[#2D2F2A] rounded" />
          </div>
        </motion.div>

        {/* Floating Document Layer 2 (Right Bottom) */}
        <motion.div
          animate={{ y: [0, 15, 0], rotate: [8, 10, 8] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-16 -right-16 w-96 h-96 rounded-2xl bg-[#191A17] border border-[#2D2F2A] p-6 shadow-2xl"
        >
          <div className="flex justify-between items-center border-b border-[#2D2F2A] pb-3 mb-4">
            <span className="font-serif text-xs text-[#69745B]">SCENARIO SIMULATION MATRIX</span>
            <span className="text-[10px] text-[#F1E8D7]/40">CUSHION +34%</span>
          </div>
          <div className="space-y-3">
            <div className="h-8 w-full bg-[#2D2F2A]/50 rounded" />
            <div className="h-8 w-full bg-[#2D2F2A]/50 rounded" />
          </div>
        </motion.div>
      </div>

      {/* Top Header */}
      <header className="p-6 flex items-center justify-between relative z-10 max-w-6xl mx-auto w-full">
        <button
          type="button"
          onClick={onNavigateLanding}
          className="flex items-center gap-3 cursor-pointer text-left"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#C9704C] to-[#C4A16A] flex items-center justify-center text-[#191A17] font-serif font-bold text-lg shadow-md">
            M
          </div>
          <span className="font-serif font-bold text-xl text-[#F1E8D7]">Mavric</span>
        </button>

        <button
          type="button"
          onClick={onNavigateLanding}
          className="text-xs text-[#F1E8D7]/60 hover:text-[#F1E8D7] transition-colors cursor-pointer"
        >
          ← Back to Homepage
        </button>
      </header>

      {/* Center 3D Authentication Scene Card */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative"
        >
          {/* Depth Backing Shadow Layer */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#C9704C]/20 via-[#C4A16A]/10 to-[#75677D]/20 rounded-3xl blur-xl" />

          {/* Authentication Card */}
          <div className="relative rounded-3xl bg-[#191A17] border border-[#2D2F2A] p-8 shadow-2xl shadow-black/80">
            {/* Header with Welcome Back */}
            <div className="text-center mb-8">
              <div className="inline-flex p-3 rounded-2xl bg-[#20221D] border border-[#2D2F2A] text-[#C4A16A] mb-3 shadow-inner">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-3xl font-normal text-[#F1E8D7] tracking-tight">
                Sign In
              </h2>
              <p className="text-xs text-[#F1E8D7]/60 mt-1">
                Enter your details to access your scenario planning ledger
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-[#C9704C]/15 border border-[#C9704C]/30 text-xs text-[#F1E8D7] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C9704C]" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#F1E8D7]/75 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#F1E8D7]/40">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="karthick@mavric.demo"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#20221D] border border-[#2D2F2A] text-[#F1E8D7] placeholder-[#F1E8D7]/30 text-sm focus:outline-none focus:border-[#C4A16A] transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-[#F1E8D7]/75">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={handleFillDemo}
                    className="text-[11px] text-[#C4A16A] hover:underline cursor-pointer"
                  >
                    Use Demo Account
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#F1E8D7]/40">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#20221D] border border-[#2D2F2A] text-[#F1E8D7] placeholder-[#F1E8D7]/30 text-sm focus:outline-none focus:border-[#C4A16A] transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-[#F1E8D7]/70">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-[#20221D] border-[#2D2F2A] text-[#C4A16A] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <span>Remember me</span>
                </label>
                <span className="text-[11px] text-[#F1E8D7]/50">MockAPI Auth</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-[#C4A16A] hover:bg-[#b5935b] text-[#191A17] font-semibold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#C4A16A]/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Demo Credentials Box */}
            <div className="mt-6 pt-5 border-t border-[#2D2F2A] bg-[#20221D]/50 rounded-2xl p-3.5 text-xs">
              <div className="flex items-center justify-between text-[11px] text-[#F1E8D7]/50 mb-1">
                <span className="font-semibold uppercase tracking-wider text-[#C4A16A]">Demo Credentials</span>
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="text-[#69745B] hover:underline cursor-pointer"
                >
                  Click to Auto-fill
                </button>
              </div>
              <p className="font-mono text-[#F1E8D7]/80 text-[11px]">Email: karthick@mavric.demo</p>
              <p className="font-mono text-[#F1E8D7]/80 text-[11px]">Password: karthick123</p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-[#F1E8D7]/40 relative z-10">
        Mavric Financial Platform • Plan today. Understand tomorrow.
      </footer>
    </div>
  );
};

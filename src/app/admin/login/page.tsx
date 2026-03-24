'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, Loader2, AlertCircle } from 'lucide-react';
import Image from 'next/image';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedEmail = localStorage.getItem('admin_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (rememberMe) {
        localStorage.setItem('admin_email', email);
      } else {
        localStorage.removeItem('admin_email');
      }

      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error logging in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a1628] p-6 relative overflow-hidden font-sans">
      {/* Background Decorative patterns */}
      <div className="absolute inset-0 opacity-10 uzbek-pattern"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-azure rounded-full blur-[100px] opacity-20"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gold rounded-full blur-[100px] opacity-10"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-2xl relative z-10 overflow-hidden border border-border"
      >
        <div className="p-8 md:p-10">
          <div className="flex flex-col items-center mb-10">
            <div className="p-4 bg-pearl rounded-2xl mb-4 shadow-sm">
              <Image 
                src="/images/logo.svg" 
                alt="SieteViajes Logo" 
                width={80} 
                height={60} 
                className="object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Admin Dashboard</h1>
            <p className="text-slate-500 text-center text-sm">Sign in with your SieteViajes credentials</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-azure/20 focus:border-azure outline-none transition-all text-sm"
                  placeholder="admin@sieteviajes.com"
                  required
                />
                <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-azure/20 focus:border-azure outline-none transition-all text-sm"
                  placeholder="••••••••"
                  required
                />
                <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-azure rounded border-slate-300"
                />
                <span className="text-sm text-slate-500 group-hover:text-slate-700 transition-colors">Remember me</span>
              </label>
              <button type="button" className="text-sm text-azure font-medium hover:underline">Forgot password?</button>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-900/50 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm"
                >
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-azure hover:bg-azure-dark text-white font-bold rounded-2xl shadow-lg shadow-azure/20 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:hover:bg-azure"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign In
                  <Lock className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700/50 text-center">
          <p className="text-xs text-slate-400">© 2026 SieteViajes Silk Road — Backend Powered by Supabase</p>
        </div>
      </motion.div>
    </div>
  );
}

'use client';

import { ReactNode, useEffect, useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdminSubdomain, setIsAdminSubdomain] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    setIsAdminSubdomain(window.location.hostname.startsWith('admin') || window.location.hostname.startsWith('adminka'));
  }, []);

  const isLoginPage = pathname?.includes('/login') || pathname === '/admin/login';

  useEffect(() => {
    if (!mounted) return;

    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user && !isLoginPage) {
        router.push(isAdminSubdomain ? '/login' : '/admin/login');
      }
      setLoading(false);
    }
    checkAuth();
  }, [router, isLoginPage, isAdminSubdomain, mounted]);

  // Close sidebar on path change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  if (loading && !isLoginPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loader2 className="w-10 h-10 animate-spin text-azure" />
      </div>
    );
  }

  // Login page has no sidebar
  if (isLoginPage) return <>{children}</>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased flex flex-col lg:flex-row">
      {/* Mobile Top Header */}
      <div className="lg:hidden h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-border sticky top-0 z-50 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
             <img src="/images/logo.svg" alt="Logo" className="w-8 h-8 object-contain" />
             <span className="text-sm font-bold tracking-tight">Admin Terminal</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 active:scale-95 transition-all"
        >
          {isSidebarOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 12h16M4 6h16M4 18h16"/></svg>
          )}
        </button>
      </div>

      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="flex-1 overflow-x-hidden pt-4 pb-20 lg:pb-4 min-h-screen lg:min-h-0">
        {children}
      </main>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}

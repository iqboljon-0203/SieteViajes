'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  Users, 
  Map, 
  LogOut, 
  LayoutDashboard,
  Quote, 
  LayoutGrid,
  HelpCircle,
  Settings,
  XCircle,
  ArrowRight
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAdminSubdomain, setIsAdminSubdomain] = useState(false);
  
  useEffect(() => {
    setIsAdminSubdomain(window.location.hostname.startsWith('admin') || window.location.hostname.startsWith('adminka'));
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push(isAdminSubdomain ? '/login' : '/admin/login');
  };

  const navItems = [
    { href: isAdminSubdomain ? '/dashboard' : '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: isAdminSubdomain ? '/tours' : '/admin/tours', icon: Map, label: 'Manage Tours' },
    { href: isAdminSubdomain ? '/quiz' : '/admin/quiz', icon: HelpCircle, label: 'Interactive Quiz' },
    { href: isAdminSubdomain ? '/inquiries' : '/admin/inquiries', icon: Users, label: 'Inquiries' },
    { href: isAdminSubdomain ? '/reviews' : '/admin/reviews', icon: Quote, label: 'Traveler Reviews' },
    { href: isAdminSubdomain ? '/services' : '/admin/services', icon: LayoutGrid, label: 'Land. Page Details' },
    { href: isAdminSubdomain ? '/settings' : '/admin/settings', icon: Settings, label: 'Mission Control' },
  ];

  return (
    <>
    <aside className={`
      fixed inset-y-0 left-0 z-[60] w-64 bg-white dark:bg-slate-900 border-r border-border transform transition-all duration-500 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0
      ${isOpen ? 'translate-x-0 shadow-[20px_0_60px_-15px_rgba(0,0,0,0.3)]' : '-translate-x-full lg:translate-x-0'}
    `}>
      <div className="p-6 flex flex-col h-full overflow-y-auto scrollbar-hide relative">
        {/* Mobile Close Button */}
        <button 
          onClick={onClose}
          className="lg:hidden absolute top-6 right-6 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 active:scale-95 transition-all z-10"
        >
          <XCircle size={20} />
        </button>

        {/* Back to Site Link */}
        <a 
          href={isAdminSubdomain ? `https://${window.location.hostname.replace(/^(admin|adminka)\./, '')}` : '/'} 
          className="flex items-center gap-2 text-[9px] font-black uppercase text-gold tracking-[0.2em] mb-6 hover:translate-x-1 transition-transform group shrink-0"
        >
          <ArrowRight className="w-2.5 h-2.5 rotate-180 group-hover:-translate-x-1 transition-transform" />
          Back to Site
        </a>

        {/* Logo Section */}
        <div className="flex items-center gap-2.5 mb-8 transition-transform duration-300 hover:scale-[1.03] shrink-0">
          <Image 
            src="/images/logo.svg" 
            alt="Logo" 
            width={40} 
            height={32} 
            className="object-contain"
          />
          <div className="flex flex-col">
            <span className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">SieteViajes</span>
            <span className="text-[7px] uppercase tracking-[0.2em] text-gold -mt-1 font-black">Control Terminal</span>
          </div>
        </div>

        <nav className="space-y-1.5 flex-1 font-bold text-xs">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.label !== 'Dashboard' && pathname.startsWith(item.href));
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-azure text-white shadow-lg shadow-azure/20 translate-x-1' 
                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <item.icon size={16} className={isActive ? 'text-white' : 'group-hover:text-azure transition-colors'} />
                <span className="uppercase tracking-tight">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 font-black text-xs transition-all mt-6 group shrink-0"
        >
          <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="uppercase tracking-tight">Sign Out</span>
        </button>
      </div>
    </aside>
    </>
  );
}

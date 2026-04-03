'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { CurrencySelector } from '@/components/ui/CurrencySelector';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useTheme } from '@/context/ThemeContext';
import { useSettings } from '@/context/SettingsContext';

export function Navbar() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin') || (typeof window !== 'undefined' && (window.location.hostname.startsWith('admin') || window.location.hostname.startsWith('adminka')));
  
  const isHome = pathname === '/';
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const lanContext = useLanguage();
  const themeContext = useTheme();
  const settingsContext = useSettings();

  if (isAdmin) return null;

  const { t } = lanContext;
  const { theme } = themeContext;
  const { settings } = settingsContext;

  const isActuallyScrolled = scrolled || !isHome;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/tour-catalog', label: t('nav.tours') },
    { href: '/air-tickets', label: t('nav.air_tickets') },
    { href: '/train-tickets', label: t('nav.train_tickets') },
    { href: '/transport', label: t('nav.transport') },
    { href: '/#contact', label: t('nav.contact') },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isActuallyScrolled
          ? 'bg-surface/95 backdrop-blur-lg shadow-lg border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group relative h-full py-2">
            <Image 
              src={settings.site_logo || "/images/logo.svg"} 
              alt={`${settings.site_name} Logo`} 
              width={100} 
              height={75} 
              className="object-contain w-auto h-12 sm:h-14 group-hover:scale-[1.05] transition-transform duration-300 drop-shadow-md"
              priority
            />
            <div className="flex flex-col hidden sm:flex">
              <span className={`text-lg sm:text-xl font-bold font-heading tracking-tight transition-colors ${
                isActuallyScrolled ? (theme === 'dark' ? 'text-gold' : 'text-azure') : 'text-white'
              }`}>
                {settings.site_name?.split(' ')[0] || 'SieteViajes'}
              </span>
              <span className={`text-[10px] uppercase tracking-[0.2em] -mt-1 transition-colors ${
                isActuallyScrolled ? (theme === 'dark' ? 'text-gold-light' : 'text-gold-dark') : 'text-gold-light'
              }`}>
                {settings.site_name?.split(' ').slice(1).join(' ') || 'Silk Road'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[11px] xl:text-[12px] font-bold uppercase tracking-wider transition-colors hover:text-gold relative group ${
                  isActuallyScrolled ? 'text-text-dark' : 'text-white'
                }`}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}

            <div className="flex items-center gap-2 xl:gap-3 ml-2 pl-4 border-l border-gray-200/30">
              <CurrencySelector scrolled={isActuallyScrolled} />
              <LanguageToggle scrolled={isActuallyScrolled} />
              <ThemeToggle scrolled={isActuallyScrolled} />
            </div>

            <Link
              href="/tour-catalog"
              className="ml-2 px-5 py-2.5 rounded-full gold-gradient text-white text-[10px] font-black uppercase tracking-widest shadow-lg hover:shadow-gold transition-all duration-300 hover:scale-105 italic"
            >
              {t('nav.book')}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              isActuallyScrolled ? 'text-text-dark hover:bg-pearl' : 'text-white hover:bg-white/10'
            }`}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-surface border-t border-border shadow-xl max-h-[80vh] overflow-y-auto"
          >
            <div className="p-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block py-3 px-4 text-text-dark hover:text-gold hover:bg-pearl rounded-lg transition-all text-sm font-bold uppercase tracking-widest"
                >
                  {link.label}
                </Link>
              ))}

              <div className="flex items-center justify-between gap-4 py-3 px-4 bg-pearl-warm rounded-xl">
                <div className="flex gap-4">
                  <CurrencySelector scrolled={true} />
                  <LanguageToggle scrolled={true} />
                </div>
                <ThemeToggle scrolled={true} />
              </div>
              <Link
                href="/tour-catalog"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center py-4 rounded-full gold-gradient text-white font-black uppercase tracking-[0.2em] shadow-lg italic text-xs"
              >
                {t('nav.book')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

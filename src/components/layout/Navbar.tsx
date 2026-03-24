'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Plane } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { CurrencySelector } from '@/components/ui/CurrencySelector';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useTheme } from '@/context/ThemeContext';
import { useSettings } from '@/context/SettingsContext';

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { settings } = useSettings();

  const isActuallyScrolled = scrolled || !isHome;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/tour-catalog', label: t('nav.tours') },
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
                {settings.site_name.split(' ')[0]}
              </span>
              <span className={`text-[10px] uppercase tracking-[0.2em] -mt-1 transition-colors ${
                isActuallyScrolled ? (theme === 'dark' ? 'text-gold-light' : 'text-gold-dark') : 'text-gold-light'
              }`}>
                {settings.site_name.split(' ').slice(1).join(' ') || 'Silk Road'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-gold relative group ${
                  isActuallyScrolled ? 'text-text-dark' : 'text-white'
                }`}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}

            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200/30">
              <CurrencySelector scrolled={isActuallyScrolled} />
              <LanguageToggle scrolled={isActuallyScrolled} />
              <ThemeToggle scrolled={isActuallyScrolled} />
            </div>

            <Link
              href="/tour-catalog"
              className="ml-2 px-6 py-2.5 rounded-full gold-gradient text-white text-sm font-semibold shadow-lg hover:shadow-gold transition-all duration-300 hover:scale-105"
            >
              {t('nav.book')}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
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
            className="md:hidden bg-surface border-t border-border shadow-xl"
          >
            <div className="p-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block py-3 px-4 text-text-dark hover:text-azure hover:bg-pearl rounded-lg transition-all text-base font-medium"
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
                className="block w-full text-center py-3 rounded-full gold-gradient text-white font-semibold shadow-lg"
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

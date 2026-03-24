/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { type Locale } from '@/lib/i18n';

export function LanguageToggle({ scrolled }: { scrolled: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { locale, setLocale } = useLanguage();

  const locales: { id: Locale; label: string; flag: string }[] = [
    { id: 'en', label: 'English', flag: 'https://flagcdn.com/w40/gb.png' },
    { id: 'es', label: 'Español', flag: 'https://flagcdn.com/w40/es.png' },
    { id: 'ru', label: 'Русский', flag: 'https://flagcdn.com/w40/ru.png' },
    { id: 'uz', label: 'Oʻzbek', flag: 'https://flagcdn.com/w40/uz.png' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = locales.find((l) => l.id === locale) || locales[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Language"
        aria-expanded={isOpen}
        className={`text-xs font-bold px-3 py-2 rounded-lg border transition-all duration-200 flex items-center gap-2 ${
          scrolled
            ? 'border-border text-text-dark bg-surface shadow-sm hover:border-azure'
            : 'border-white/30 text-white hover:border-white/60 bg-white/10 backdrop-blur-md'
        }`}
      >
        <img 
          src={current.flag} 
          alt={`${current.label} Flag`} 
          className="w-5 h-auto rounded-sm object-cover" 
        />
        <span className="uppercase">{current.id}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-40 py-2 bg-surface rounded-xl shadow-xl border border-border z-50 overflow-hidden"
          >
            {locales.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setLocale(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  locale === item.id
                    ? 'bg-azure/10 text-azure font-semibold'
                    : 'text-text-dark hover:bg-pearl'
                }`}
              >
                <img src={item.flag} alt={item.label} className="w-5 h-auto rounded-sm" />
                <span>{item.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

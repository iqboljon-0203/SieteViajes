'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { type Currency } from '@/lib/currency';

export function CurrencySelector({ scrolled }: { scrolled: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { currency, setCurrency } = useCurrency();
  const options: Currency[] = ['USD', 'EUR', 'UZS'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`text-xs font-bold px-3 py-2 rounded-lg border transition-all duration-200 flex items-center gap-1.5 ${
          scrolled
            ? 'border-border text-text-dark bg-surface shadow-sm hover:border-azure'
            : 'border-white/30 text-white hover:border-white/60 bg-white/10 backdrop-blur-md'
        }`}
      >
        <span className="opacity-60">
          {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : 'UZS'}
        </span>
        <span>{currency}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 mt-2 w-32 py-2 bg-surface rounded-xl shadow-xl border border-border z-50 overflow-hidden"
          >
            {options.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setCurrency(item);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                  currency === item
                    ? 'bg-azure/10 text-azure font-semibold'
                    : 'text-text-dark hover:bg-pearl'
                }`}
              >
                <span>{item}</span>
                <span className="text-xs opacity-50">
                  {item === 'USD' ? '$' : item === 'EUR' ? '€' : 'UZS'}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

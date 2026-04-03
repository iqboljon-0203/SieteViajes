'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, Send, ArrowUp } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useSettings } from '@/context/SettingsContext';

export function FloatingButtons() {
  const pathname = usePathname();
  const lanContext = useLanguage();
  const setContext = useSettings();
  const [showScroll, setShowScroll] = useState(false);
  
  const { t } = lanContext;
  const { settings } = setContext;

  const telegramUser = settings.contact_telegram?.replace('@', '') || 'Villihabiy';
  const whatsappNum = settings.contact_whatsapp?.replace(/[^\d]/g, '') || '998909638875';

  useEffect(() => {
    const checkScroll = () => setShowScroll(window.scrollY > 500);
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const tooltips = {
    whatsapp: t('floating.whatsapp'),
    telegram: t('floating.telegram'),
    top: t('floating.top')
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3 pointer-events-none">
      <AnimatePresence>
        {showScroll && (
          <motion.button
            key="scroll-top"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            onClick={scrollToTop}
            className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 text-azure dark:text-gold shadow-xl flex items-center justify-center border border-border pointer-events-auto hover:bg-gold hover:text-white dark:hover:bg-gold transition-colors group"
            aria-label={tooltips.top}
          >
            <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
            <span className="absolute right-full mr-4 px-3 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {tooltips.top}
            </span>
          </motion.button>
        )}
        <motion.a
          key="telegram"
          href={`https://t.me/${telegramUser}`}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="w-14 h-14 rounded-full bg-[#0088cc] text-white flex items-center justify-center shadow-xl pointer-events-auto group relative"
          title="Telegram"
        >
          <Send className="w-6 h-6" />
          <span className="absolute right-full mr-4 px-3 py-1 bg-[#0088cc] text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-bold">
            {tooltips.telegram}
          </span>
        </motion.a>
        <motion.a
          key="whatsapp"
          href={`https://wa.me/${whatsappNum}`}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xl pointer-events-auto group relative"
          title="WhatsApp"
        >
          <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20 group-hover:hidden"></div>
          <MessageCircle className="w-7 h-7 fill-current" />
          <span className="absolute right-full mr-4 px-3 py-1 bg-[#25D366] text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-bold">
            {tooltips.whatsapp}
          </span>
        </motion.a>
      </AnimatePresence>
    </div>
  );
}

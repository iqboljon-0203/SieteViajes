'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MapPin, Clock, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface SmartItineraryProps {
  itinerary: any[]; // Flexible for normalized objects
}

export function SmartItinerary({ itinerary }: SmartItineraryProps) {
  const { t, locale } = useLanguage();
  const [openDay, setOpenDay] = useState<number | null>(0);

  return (
    <div className="space-y-12">
      <div className="flex items-center gap-4 px-2">
         <div className="w-12 h-12 rounded-[1.5rem] azure-gradient flex items-center justify-center text-white shadow-xl shadow-azure/20 ring-4 ring-azure/5">
            <Clock className="w-6 h-6" />
         </div>
         <div>
            <h2 className="font-heading text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                {t('detail.itinerary')}
            </h2>
            <p className="text-[10px] font-bold text-azure uppercase tracking-widest font-sans">Strategic Timeline</p>
         </div>
      </div>

      <div className="space-y-6">
        {itinerary.map((day, index) => {
          const isOpen = openDay === index;
          const title = day.title; // Already resolved in parent component
          const description = day.description; // Already resolved in parent component

          return (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden relative group ${
                isOpen ? 'border-azure/30 shadow-3xl bg-white dark:bg-slate-900 -translate-y-2' : 'border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:border-azure/20'
              }`}
            >
              {/* Sequential Indicator */}
              <div className="absolute top-0 right-0 p-8 text-slate-50 dark:text-slate-800/50 pointer-events-none font-bold text-4xl leading-none select-none transition-all">
                 {index + 1 < 10 ? `0${index + 1}` : index + 1}
              </div>

              <button
                onClick={() => setOpenDay(isOpen ? null : index)}
                className="w-full flex items-center gap-6 p-8 md:p-10 text-left relative z-10"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-md shrink-0 transition-all duration-300 shadow-lg ${
                  isOpen ? 'azure-gradient text-white shadow-azure/20 ring-4 ring-azure/5' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:scale-105 group-hover:bg-azure/10 group-hover:text-azure'
                }`}>
                  D{day.day}
                </div>
                <div className="flex-1 min-w-0 pr-8">
                  <h4 className={`text-lg md:text-xl font-bold transition-colors duration-500 ${isOpen ? 'text-azure' : 'text-slate-900 dark:text-white group-hover:text-azure'}`}>
                    {title}
                  </h4>
                  <div className={`mt-1 h-1 w-10 rounded-full transition-all duration-500 ${isOpen ? 'bg-gold w-20' : 'bg-slate-200 w-8 group-hover:bg-azure'}`}></div>
                </div>
                <div className={`w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 transition-all duration-500 ${isOpen ? 'rotate-180 bg-azure text-white shadow-lg' : 'group-hover:bg-azure/5 group-hover:text-azure'}`}>
                    <ChevronDown className="w-6 h-6" />
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'circOut' }}
                  >
                    <div className="px-8 md:px-10 pb-10">
                      <div className="border-t border-dashed border-slate-200 dark:border-slate-800 pt-10 ml-0 md:ml-2 relative z-10">
                        {day.image && (
                          <div className="relative w-full h-80 md:h-[450px] rounded-[3rem] overflow-hidden mb-10 shadow-2xl border-8 border-slate-50 dark:border-slate-800 group/img cursor-zoom-in">
                            <Image
                              src={day.image}
                              alt={title}
                              fill
                              className="object-cover group-hover/img:scale-110 transition-transform duration-1000"
                              quality={100}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                          </div>
                        )}
                        <div className="max-w-4xl">
                           <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg font-medium italic mb-10 opacity-90">"{description}"</p>
                           <div className="flex flex-wrap items-center gap-4 text-sm font-black uppercase tracking-widest text-azure bg-azure/5 p-4 rounded-2xl w-fit border border-azure/10">
                              <Sparkles className="w-5 h-5 text-gold animate-pulse" />
                              <span>{t('detail.day')} {day.day} Strategical Point: {title.split(':')[0]}</span>
                           </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Hotel, Car, Utensils, Headset, Map, Loader2, Sparkles, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';

const ICON_MAP: Record<string, any> = {
  ShieldCheck,
  Hotel,
  Car,
  Utensils,
  Headset,
  Map,
};

export function ServiceBento() {
  const { t, locale } = useLanguage();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      const { data } = await supabase
        .from('site_services')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (data) setServices(data);
      setLoading(false);
    }
    loadServices();
  }, []);

  const getClassName = (theme: string, idx: number) => {
    // Large tile for the first one for visual hierarchy
    const base = idx === 0 ? 'md:col-span-2 md:row-span-2 h-full' : 'h-full';
    
    if (theme === 'blue') return `${base} azure-gradient text-white shadow-xl shadow-azure/20 ring-1 ring-white/10`;
    if (theme === 'gold') return `${base} gold-gradient text-white shadow-xl shadow-gold/20 ring-1 ring-white/10`;
    if (theme === 'pearl') return `${base} bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-soft hover:border-azure/20`;
    return `${base} bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 shadow-soft`;
  };

  return (
    <section className="py-32 bg-white dark:bg-slate-950 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-azure/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="section-container relative z-10">
        <div className="text-center mb-24 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-azure/5 text-azure text-[10px] font-black uppercase tracking-[0.4em] mb-6"
          >
            <Sparkles size={14} className="text-gold" />
            Strategic Luxury Ecosystem
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-3xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-8"
          >
            {t('bento.title')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto opacity-80"
          >
            {t('bento.subtitle')}
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
               key="loader"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="flex justify-center py-20"
            >
              <Loader2 className="w-12 h-12 animate-spin text-azure" strokeWidth={1} />
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[220px]">
              {services.map((service, i) => {
                const IconComponent = ICON_MAP[service.icon_name] || Map;
                const className = getClassName(service.color_theme, i);
                const isDark = className.includes('azure-gradient') || className.includes('gold-gradient');
                
                // Content resolution for 4 languages
                const getTitle = () => {
                    if (locale === 'ru') return service.title_ru || service.title_en || service.title_es;
                    if (locale === 'uz') return service.title_uz || service.title_en || service.title_es;
                    if (locale === 'es') return service.title_es || service.title_en;
                    return service.title_en || service.title_es;
                };

                const getDescription = () => {
                    if (locale === 'ru') return service.desc_ru || service.desc_en || service.desc_es;
                    if (locale === 'uz') return service.desc_uz || service.desc_en || service.desc_es;
                    if (locale === 'es') return service.desc_es || service.desc_en;
                    return service.desc_en || service.desc_es;
                };

                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className={`rounded-[2.5rem] p-10 flex flex-col group relative overflow-hidden transition-all duration-700 hover:-translate-y-2 ${className}`}
                  >
                    {/* Decorative hover element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                    <div className={`mb-auto transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 ${isDark ? 'text-white' : 'text-azure'}`}>
                      <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center ${isDark ? 'bg-white/20 backdrop-blur-md shadow-xl' : 'bg-slate-50 dark:bg-slate-800 shadow-inner'}`}>
                         <IconComponent className="w-8 h-8" />
                      </div>
                    </div>

                    <div className="relative z-10">
                      <h3 className="font-bold text-lg md:text-xl mb-3 font-heading transition-all duration-700">
                        {getTitle()}
                      </h3>
                      <p className={`text-sm font-medium leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all duration-700 ${isDark ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                        {getDescription()}
                      </p>
                    </div>

                    <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-700">
                       <ChevronRight className={isDark ? 'text-white' : 'text-azure'} size={24} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

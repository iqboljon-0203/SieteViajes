'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, Loader2, MapPin, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';

export function Testimonials() {
  const { locale, t } = useLanguage();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReviews() {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching reviews:', error);
      } else if (data) {
        setReviews(data);
      }
      setLoading(false);
    }
    loadReviews();
  }, []);

  const sectionTitle = t('testimonials.title');
  const sectionSubtitle = t('testimonials.subtitle');

  return (
    <section className="py-32 bg-pearl dark:bg-slate-950 relative overflow-hidden">
      {/* Decorative Ornaments */}
      <div className="absolute top-0 left-0 w-80 h-80 azure-gradient rounded-full blur-[120px] opacity-10 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 gold-gradient rounded-full blur-[120px] opacity-10 translate-x-1/2 translate-y-1/2"></div>

      <div className="section-container relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-azure/5 text-azure text-[10px] font-black uppercase tracking-[0.4em] mb-6"
          >
            <Sparkles size={14} className="text-gold" />
            Social Proof Manifesto
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-3xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-6"
          >
            {sectionTitle}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto opacity-80"
          >
            {sectionSubtitle}
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
              <div className="relative w-20 h-20">
                 <Loader2 className="w-full h-full animate-spin text-azure" strokeWidth={1} />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-gold animate-ping"></div>
                 </div>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {reviews.map((testimonial, idx) => {
                // Resolved content for EN/ES/RU/UZ
                const commentResolved = () => {
                    if (locale === 'ru') return testimonial.text_ru || testimonial.text_en || testimonial.text_es;
                    if (locale === 'uz') return testimonial.text_uz || testimonial.text_en || testimonial.text_es;
                    if (locale === 'es') return testimonial.text_es || testimonial.text_en;
                    return testimonial.text_en || testimonial.text_es;
                };
                
                const comment = commentResolved();

                return (
                  <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: idx * 0.1 }}
                    className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 shadow-soft hover:shadow-3xl transition-all duration-700 relative group flex flex-col h-full border border-slate-50 dark:border-slate-800/50 hover:-translate-y-3"
                  >
                    <Quote className="absolute top-10 right-10 w-16 h-16 text-slate-50 dark:text-slate-800 transition-colors group-hover:text-azure/10 duration-700 pointer-events-none" />
                    
                    <div className="flex gap-1.5 mb-10 bg-slate-50 dark:bg-slate-800/50 w-fit px-5 py-3 rounded-2xl shadow-inner">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                      ))}
                      {[...Array(5 - (testimonial.rating || 5))].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-slate-200" />
                      ))}
                    </div>
                    
                    <p className="text-slate-600 dark:text-slate-300 font-medium text-lg md:text-xl leading-relaxed mb-12 italic line-clamp-6 group-hover:line-clamp-none transition-all duration-700">
                      "{comment}"
                    </p>
                    
                    <div className="flex items-center gap-6 mt-auto pt-8 border-t border-dashed border-slate-100 dark:border-slate-800">
                      <div className="w-20 h-20 rounded-[2.5rem] overflow-hidden bg-white dark:bg-slate-800 border-4 border-white dark:border-slate-800 shadow-xl shadow-azure/10 ring-8 ring-azure/5 relative">
                        {testimonial.avatar_url ? (
                          <img src={testimonial.avatar_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={testimonial.name} />
                        ) : (
                          <div className="w-full h-full azure-gradient flex items-center justify-center text-white font-black text-2xl uppercase italic">
                            {testimonial.name.slice(0, 2)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-lg md:text-xl leading-none mb-2">{testimonial.name}</h4>
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest italic group-hover:text-azure transition-colors">
                           <MapPin size={12} className="text-azure" />
                           {testimonial.country}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>

        {!loading && reviews.length === 0 && (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[4rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
             <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Awaiting Narrative Hydration...</p>
          </div>
        )}
      </div>
    </section>
  );
}

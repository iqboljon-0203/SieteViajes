'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { TourCard } from './TourCard';
import { supabase } from '@/lib/supabase';

export function FeaturedTours() {
  const { t, locale } = useLanguage();
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      const { data } = await supabase
        .from('tours')
        .select('*')
        .eq('is_featured', true)
        .limit(3);
      
      if (data) setTours(data);
      setLoading(false);
    }
    loadFeatured();
  }, []);

  return (
    <section className="py-20 bg-surface relative overflow-hidden">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-azure/10 text-azure dark:bg-azure/20 dark:text-gold text-sm font-medium mb-6">
            ✨ {t('catalog.featured_badge')}
          </div>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-text-dark mb-4">
            {t('catalog.title')}
          </h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">{t('catalog.subtitle')}</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-azure" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map((tour, index) => (
              <TourCard key={tour.id} tour={tour} index={index} />
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            href="/tour-catalog"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full azure-gradient text-white font-semibold text-lg shadow-lg hover:shadow-elevated transition-all duration-300 hover:scale-105"
          >
            {t('catalog.view_all')}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

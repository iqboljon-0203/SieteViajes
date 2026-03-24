'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { TourCard } from '@/components/sections/TourCard';
import { TourFilters, type FilterState } from '@/components/sections/TourFilters';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export default function TourCatalogPage() {
  const { t, locale } = useLanguage();
  const [dbTours, setDbTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 5000],
    duration: [1, 30],
    stars: 0,
    cities: [],
    type: '',
  });

  useEffect(() => {
    async function fetchAllTours() {
      setLoading(true);
      const { data } = await supabase
        .from('tours')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setDbTours(data);
      setLoading(false);
    }
    fetchAllTours();
  }, []);

  const filteredTours = useMemo(() => {
    return dbTours.filter((tour) => {
      // Normalize price and duration as they might be snake_case or camelCase in DB vs filter expectations
      const price = tour.price_usd || tour.priceUSD || 0;
      const duration = tour.duration_days || tour.duration || 0;
      const stars = tour.stars_count || tour.stars || 0;
      const cities = tour.cities || [];
      const type = tour.tour_type || tour.type || '';

      if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false;
      if (duration < filters.duration[0] || duration > filters.duration[1]) return false;
      if (filters.stars > 0 && stars < filters.stars) return false;
      if (filters.cities.length > 0 && !filters.cities.some((c) => cities.includes(c))) return false;
      if (filters.type && type !== filters.type) return false;
      return true;
    });
  }, [dbTours, filters]);

  return (
    <div className="pt-32 md:pt-36 pb-20 bg-pearl min-h-screen">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-text-dark mb-4 group inline-block relative">
            {t('catalog.title')}
            <span className="absolute -bottom-2 left-0 w-0 h-1 bg-azure group-hover:w-full transition-all duration-500"></span>
          </h1>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">{t('catalog.subtitle')}</p>
          <div className="flex items-center justify-center gap-3 mt-6">
             <span className="h-px w-8 bg-azure/30"></span>
             <p className="text-sm font-black text-azure uppercase tracking-widest">{filteredTours.length} {t('catalog.found')}</p>
             <span className="h-px w-8 bg-azure/30"></span>
          </div>
        </motion.div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <TourFilters filters={filters} setFilters={setFilters} />
          </div>

          {/* Tour Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-40 gap-4">
                 <Loader2 className="w-12 h-12 animate-spin text-azure" />
                 <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">Scanning Silk Road...</p>
              </div>
            ) : filteredTours.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTours.map((tour, index) => (
                  <TourCard key={tour.id} tour={tour} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white/50 rounded-[3rem] border-2 border-dashed border-slate-200">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                   <Loader2 className="w-10 h-10 rotate-45" />
                </div>
                <p className="text-text-muted text-xl font-bold mb-6">{t('catalog.no_results')}</p>
                <button
                  onClick={() =>
                    setFilters({
                      priceRange: [0, 5000],
                      duration: [1, 30],
                      stars: 0,
                      cities: [],
                      type: '',
                    })
                  }
                  className="px-8 py-3 rounded-2xl bg-azure text-white font-black text-sm hover:scale-105 transition-all shadow-lg shadow-azure/20"
                >
                  {t('catalog.filter.clear')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

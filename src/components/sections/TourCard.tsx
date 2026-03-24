'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, Star, MapPin, ArrowRight } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { useLanguage } from '@/context/LanguageContext';
import { getFormattedPrice } from '@/lib/currency';

interface TourCardProps {
  tour: any; // Flexible for DB object
  index?: number;
}

export function TourCard({ tour, index = 0 }: TourCardProps) {
  const { currency } = useCurrency();
  const { t, locale } = useLanguage();

  // Helper to resolve localized content from DB/Static objects
  const resolveContent = (field: string) => {
    const fieldEn = `${field}_en`;
    const fieldEs = field; 
    const fieldRu = `${field}_ru`;
    const fieldUz = `${field}_uz`;
    
    const fieldEnJs = `${field}_en_js`;
    const fieldEsJs = `${field}_js`;
    const fieldRuJs = `${field}_ru_js`;
    const fieldUzJs = `${field}_uz_js`;

    const staticFieldEn = `${field}En`;

    if (locale === 'ru') return tour[fieldRuJs] || tour[fieldRu] || tour[`${field}Ru`] || tour[fieldEnJs] || tour[fieldEn] || tour[staticFieldEn] || tour[fieldEsJs] || tour[fieldEs];
    if (locale === 'uz') return tour[fieldUzJs] || tour[fieldUz] || tour[`${field}Uz`] || tour[fieldEnJs] || tour[fieldEn] || tour[staticFieldEn] || tour[fieldEsJs] || tour[fieldEs];
    if (locale === 'es') return tour[fieldEsJs] || tour[fieldEs] || tour[field] || tour[fieldEnJs] || tour[fieldEn] || tour[staticFieldEn];
    
    return tour[fieldEnJs] || tour[fieldEn] || tour[staticFieldEn] || tour[fieldEsJs] || tour[fieldEs] || tour[field];
  };

  const title = resolveContent('title');
  const citiesRaw = resolveContent('cities') || [];
  const cities = Array.isArray(citiesRaw) ? citiesRaw : [];
  
  const price = tour.price_usd || tour.priceUSD;
  const duration = tour.duration_days || tour.duration;
  const nights = tour.nights_count || tour.nights;
  const stars = tour.stars_rating || tour.stars_count || tour.stars || 4;
  const type = tour.tour_type || tour.type || 'cultural';
  const isHot = tour.is_hot_deal || tour.hotDeal;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-surface rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2 flex flex-col h-full border border-border/50"
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={tour.image || tour.image_url || '/images/hero-registan.png'}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Badges Overlay */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {isHot && (
            <span className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-[10px] font-bold shadow-md uppercase tracking-wider">
              🔥 {t('badge.hot')}
            </span>
          )}
          <span className="px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-bold shadow-md flex items-center gap-1.5 uppercase tracking-wider border border-white/10">
            {type === 'cultural' && '🏛️'}
            {type === 'adventure' && '🏔️'}
            {type === 'luxury' && '👑'}
            {type === 'gastronomic' && '🍽️'}
            {t(`search.type.${type}`)}
          </span>
        </div>

        {/* Price Floating Badge */}
        <div className="absolute top-4 right-4">
          <div className="px-4 py-2 rounded-xl azure-gradient text-white text-sm font-bold shadow-xl border border-white/10">
            {t('catalog.card.from')} {getFormattedPrice(price, currency)}
          </div>
        </div>

        {/* Duration Footer */}
        <div className="absolute bottom-6 left-6 flex items-center gap-3 text-white">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
             <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
             <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">Duration</p>
             <p className="text-sm font-bold drop-shadow-sm">{duration} {t('catalog.card.days')} / {nights} {t('catalog.card.nights')}</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8 flex flex-col flex-1 bg-white dark:bg-slate-800">
        <h3 className="font-heading text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-azure transition-colors leading-tight">
          {title}
        </h3>

        {/* Stars Metric */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${i < stars ? 'text-gold fill-gold' : 'text-slate-200'}`}
              />
            ))}
          </div>
          <span className="w-px h-3 bg-slate-200"></span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            {stars} {t('badge.stars')}
          </span>
        </div>

        {/* Routing/Cities */}
        <div className="flex items-center gap-4 text-sm text-slate-500 mb-8 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-border/50 group/route">
          <div className="w-8 h-8 rounded-xl bg-azure/10 text-azure flex items-center justify-center shrink-0 group-hover/route:bg-azure group-hover/route:text-white transition-all">
             <MapPin className="w-4 h-4" />
          </div>
          <span className="font-medium line-clamp-2 text-xs opacity-80">
             {cities.length > 0 ? cities.join(' → ') : 'Multiple Cities'}
          </span>
        </div>

        {/* Interactive CTA */}
        <Link
          href={`/tour/${tour.slug}`}
          className="flex items-center justify-center gap-3 w-full py-4 rounded-xl border border-azure/20 text-azure font-bold text-sm hover:azure-gradient hover:text-white hover:border-transparent transition-all duration-300 mt-auto group/btn active:scale-95"
        >
          {t('catalog.card.details')}
          <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-2" />
        </Link>
      </div>
    </motion.div>
  );
}

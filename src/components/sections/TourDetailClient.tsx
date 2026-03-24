'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Star, MapPin, Clock, CheckCircle, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCurrency } from '@/context/CurrencyContext';
import { getFormattedPrice } from '@/lib/currency';
import { SmartItinerary } from '@/components/sections/SmartItinerary';
import { TravelCalculator } from '@/components/sections/TravelCalculator';
import { BookingForm } from '@/components/sections/BookingForm';

export function TourDetailClient({ tour }: { tour: any }) {
  const { locale, t } = useLanguage();
  const { currency } = useCurrency();

  // Unified content resolver for all 4 locales
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
  const subtitle = resolveContent('subtitle');
  const highlights = resolveContent('highlights') || [];
  const cities = resolveContent('cities') || [];
  
  const gallery = tour.gallery || [];
  const duration = tour.duration_days || tour.duration;
  const nights = tour.nights_count || tour.nights;
  const stars = tour.stars_rating || tour.stars_count || tour.stars || 4;
  const price = tour.price_usd || tour.priceUSD;
  const image = tour.image_url || tour.image;
  const type = tour.tour_type || tour.type || 'cultural';
  
  // Normalized localized itinerary
  const itinerary = (tour.itineraries || tour.itinerary || []).map((item: any) => {
    const resolveItem = (f: string) => {
        const fEn = `${f}_en`;
        const fEs = f;
        const fRu = `${f}_ru`;
        const fUz = `${f}_uz`;
        const sEn = `${f}En`;
        
        if (locale === 'ru') return item[fRu] || item[`${f}Ru`] || item[fEn] || item[sEn] || item[fEs];
        if (locale === 'uz') return item[fUz] || item[`${f}Uz`] || item[fEn] || item[sEn] || item[fEs];
        if (locale === 'es') return item[fEs] || item[f] || item[fEn] || item[sEn];
        return item[fEn] || item[sEn] || item[fEs] || item[f];
    };

    return {
        day: item.day || item.day_number,
        title: resolveItem('title'),
        description: resolveItem('description'),
        image: item.image || item.image_url
    };
  });

  return (
    <div className="bg-pearl dark:bg-slate-950 min-h-screen">
      <section className="relative min-h-[600px] h-[75vh] flex items-end pb-16 md:pb-24 pt-32 w-full overflow-hidden">
        <Image
          src={image || '/images/hero-registan.png'}
          alt={title}
          fill
          className="object-cover scale-105"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

        <div className="relative z-10 section-container w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <Link
              href="/tour-catalog"
              className="inline-flex items-center gap-3 text-white/60 hover:text-white mb-6 text-xs font-bold uppercase tracking-wider transition-all p-3 bg-white/5 backdrop-blur-md rounded-xl border border-white/10"
            >
              <ArrowLeft className="w-4 h-4 text-gold" />
              {t('catalog.title')}
            </Link>

            <div className="space-y-6">
                <span className="px-5 py-2 rounded-xl bg-azure/20 backdrop-blur-xl border border-azure/30 text-azure text-[10px] font-black uppercase tracking-[0.3em] inline-block shadow-2xl">
                   {t(`search.type.${type}`)} Experience
                </span>
                <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight max-w-4xl">
                {title}
                </h1>
                <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl font-medium leading-relaxed">
                {subtitle}
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              <div className="flex flex-col gap-1">
                 <span className="text-[10px] font-bold uppercase text-white/50 tracking-wider">Duration</span>
                 <span className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl text-white text-sm font-bold border border-white/10">
                    <Clock className="w-4 h-4 text-gold" />
                    {duration} {t('catalog.card.days')} / {nights} {t('catalog.card.nights')}
                 </span>
              </div>
              <div className="flex flex-col gap-1">
                 <span className="text-[10px] font-bold uppercase text-white/50 tracking-wider">Destinations</span>
                 <span className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl text-white text-sm font-bold border border-white/10">
                    <MapPin className="w-4 h-4 text-azure" />
                    {cities.join(' → ')}
                 </span>
              </div>
              <div className="flex flex-col gap-1">
                 <span className="text-[10px] font-bold uppercase text-white/50 tracking-wider">Rating</span>
                 <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 h-[52px]">
                    {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < stars ? 'fill-gold text-gold' : 'text-white/20'}`} />
                    ))}
                 </span>
              </div>
              <div className="md:ml-auto self-end">
                <span className="px-8 py-4 rounded-2xl azure-gradient font-bold text-white shadow-xl text-lg uppercase tracking-wider transform hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                    <Globe size={20} className="animate-spin-slow opacity-50" />
                    {t('catalog.card.from')} {getFormattedPrice(price, currency)}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-pearl dark:bg-slate-950 relative">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-24">
            <div className="lg:col-span-2 space-y-20">
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-900 rounded-[4rem] p-10 md:p-16 shadow-soft border border-border/50 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-16 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000 group-hover:rotate-12">
                  <Star className="w-80 h-80 text-gold fill-gold" />
                </div>
                
                <div className="flex items-center gap-6 mb-16 relative z-10">
                  <div className="w-16 h-16 rounded-[2rem] gold-gradient flex items-center justify-center text-white shadow-2xl shadow-gold/20">
                    <Star className="w-8 h-8 fill-white" />
                  </div>
                  <div>
                    <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
                        Experience Metrics
                    </h2>
                    <p className="text-[10px] font-bold text-gold uppercase tracking-widest font-sans">
                        {t('detail.highlights_title')}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                  {highlights.map((highlight: string, i: number) => (
                    <div key={i} className="flex items-center gap-6 p-6 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:border-gold/30 hover:bg-white dark:hover:bg-slate-800 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group/item">
                      <div className="w-12 h-12 rounded-2xl bg-azure/5 flex items-center justify-center text-azure group-hover/item:bg-azure group-hover/item:text-white transition-all duration-500 shadow-sm shrink-0">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                      <span className="text-slate-700 dark:text-white font-bold text-sm tracking-tight">{highlight}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {gallery.length > 0 && (
                <div className="space-y-10">
                   <div className="flex items-center gap-4 px-2">
                        <span className="h-px w-10 bg-gold/30"></span>
                        <h2 className="font-heading text-xs font-black text-slate-400 uppercase tracking-[0.5em]">
                            {t('detail.gallery_title')}
                        </h2>
                   </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-6"
                  >
                    {gallery.map((img: string, i: number) => (
                      <div key={i} className={`relative aspect-square rounded-[2rem] overflow-hidden shadow-2xl group cursor-zoom-in border-4 border-white dark:border-slate-800 hover:border-azure transition-all ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
                        <Image
                          src={img}
                          alt={`${title} - ${i + 1}`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-1000"
                          sizes="(max-width: 768px) 50vw, 33vw"
                        />
                      </div>
                    ))}
                  </motion.div>
                </div>
              )}

              <SmartItinerary itinerary={itinerary} />
              
              <div id="booking-section" className="scroll-mt-32">
                <BookingForm tourName={title} />
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-32">
                <TravelCalculator tour={tour} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Flame, Clock } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCurrency } from '@/context/CurrencyContext';
import { getHotDealTour, getTourTranslation } from '@/lib/tours';
import { getFormattedPrice } from '@/lib/currency';

function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const update = () => {
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

export function EarlyBirdCountdown() {
  const { t, locale } = useLanguage();
  const { currency } = useCurrency();
  const tour = getHotDealTour();

  const timeLeft = useCountdown(tour?.hotDealEndDate || '2026-04-15T23:59:59');

  if (!tour) return null;

  const { title: translatedTitle, subtitle: translatedSubtitle, cities: translatedCities } = getTourTranslation(tour, locale);
  const savings = (tour.originalPriceUSD || 0) - tour.priceUSD;

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src={tour.image}
          alt={translatedTitle}
          fill
          className="object-cover"
          quality={80}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/95 via-[#0a1628]/85 to-[#0a1628]/70" />
      </div>

      <div className="section-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 text-red-400 text-sm font-semibold mb-6">
              <Flame className="w-4 h-4" />
              {t('countdown.title')}
            </div>

            <h2 className="font-heading text-3xl md:text-5xl font-bold text-white mb-4">
              {translatedTitle}
            </h2>
            <p className="text-gray-300 text-lg mb-6 leading-relaxed">{translatedSubtitle}</p>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-4xl font-bold text-gold">
                {getFormattedPrice(tour.priceUSD, currency)}
              </span>
              {tour.originalPriceUSD && (
                <span className="text-xl text-gray-500 line-through">
                  {getFormattedPrice(tour.originalPriceUSD, currency)}
                </span>
              )}
              {savings > 0 && (
                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-semibold">
                  {t('countdown.save')} {getFormattedPrice(savings, currency)}
                </span>
              )}
            </div>

            {/* Countdown */}
            <div className="grid grid-cols-4 gap-4 mb-8 max-w-md">
              {[
                { value: timeLeft.days, label: t('countdown.days') },
                { value: timeLeft.hours, label: t('countdown.hours') },
                { value: timeLeft.minutes, label: t('countdown.minutes') },
                { value: timeLeft.seconds, label: t('countdown.seconds') },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10"
                >
                  <motion.span
                    key={item.value}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="block text-3xl md:text-4xl font-bold text-white font-heading"
                  >
                    {String(item.value).padStart(2, '0')}
                  </motion.span>
                  <span className="text-xs text-gray-400 uppercase tracking-wider">{item.label}</span>
                </div>
              ))}
            </div>

            <Link
              href={`/tour/${tour.slug}`}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full gold-gradient text-white font-semibold text-lg shadow-lg hover:shadow-gold transition-all duration-300 hover:scale-105"
              style={{ animation: 'pulse-gold 2s infinite' }}
            >
              <Clock className="w-5 h-5" />
              {t('countdown.cta')}
            </Link>
          </motion.div>

          {/* Right: Image Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ animation: 'float 6s ease-in-out infinite' }}>
              <Image
                src={tour.gallery[1] || tour.image}
                alt={translatedTitle}
                width={560}
                height={400}
                className="object-cover w-full h-80"
              />
              <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-red-500 text-white text-sm font-bold shadow-lg">
                -${savings}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white font-semibold">{tour.duration} {t('catalog.card.days')} / {tour.nights} {t('catalog.card.nights')}</p>
                <p className="text-gray-300 text-sm">{translatedCities.join(' → ')}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

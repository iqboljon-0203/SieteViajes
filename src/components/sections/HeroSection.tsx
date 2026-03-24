'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { SmartSearch } from './SmartSearch';

import { useSettings } from '@/context/SettingsContext';

export function HeroSection() {
  const { t } = useLanguage();
  const { settings } = useSettings();

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={settings.hero_background || "/images/hero-registan.png"}
          alt={settings.site_name || "Silk Road Journey"}
          fill
          className="object-cover"
          priority
          quality={100}
          sizes="100vw"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/75" />
        {/* Subtle animated particles */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gold rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>

      {/* Content — centered with proper padding */}
      <div className="relative z-10 section-container text-center w-full pt-32 pb-16 md:pt-40 md:pb-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-4xl mx-auto mt-12 md:mt-16"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-card-dark text-sm text-gold-light font-medium mb-4 md:mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            {t('hero.badge')}
          </motion.div>

          {/* Heading */}
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-5">
            {(() => {
              const words = t('hero.title').split(' ');
              if (words.length <= 1) return <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="block">{t('hero.title')}</motion.span>;
              const half = Math.ceil(words.length / 2);
              return (
                <>
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="block"
                  >
                    {words.slice(0, half).join(' ')}
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="block text-gradient-gold"
                  >
                    {words.slice(half).join(' ')}
                  </motion.span>
                </>
              );
            })()}
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-6 md:mb-8 leading-snug"
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
            style={{ marginBottom: '1rem' }}
          >
            <Link
              href="/tour-catalog"
              className="px-8 py-4 rounded-full gold-gradient text-white font-semibold text-lg shadow-lg hover:shadow-gold transition-all duration-300 hover:scale-105"
            >
              {t('hero.cta')}
            </Link>
            <a
              href={`https://wa.me/${(settings.contact_whatsapp || '998909638875').replace(/\+/g, '').replace(/\s/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-full border-2 border-white/30 text-white font-semibold text-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              {t('hero.cta2')}
            </a>
          </motion.div>
        </motion.div>

        {/* Smart Search — separate from CTA with clear spacing */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          style={{ marginTop: '3rem' }}
        >
          <SmartSearch />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown className="w-6 h-6 text-white/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}

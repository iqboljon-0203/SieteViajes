'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Camera, Heart, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useSettings } from '@/context/SettingsContext';

export function InstagramFeed() {
  const { t, locale } = useLanguage();
  const { settings } = useSettings();

  const title = t('instagram.title');
  const subtitle = t('instagram.subtitle');
  const followBtn = t('instagram.follow');

  // Default images if none uploaded in admin
  const defaultImages = [
    { image: '/images/hero-registan.png', likes: 284, comments: 32 },
    { image: '/images/tour-bukhara.png', likes: 198, comments: 21 },
    { image: '/images/tour-khiva.png', likes: 345, comments: 47 },
    { image: '/images/tour-samarkand.png', likes: 156, comments: 18 },
    { image: '/images/tour-tashkent.png', likes: 423, comments: 56 },
    { image: '/images/tour-silk-road.png', likes: 267, comments: 29 },
  ];

  const displayPosts = (settings.instagram_images && settings.instagram_images.length > 0)
    ? settings.instagram_images.map((img, i) => ({
        image: img,
        likes: Math.floor(Math.random() * 300) + 100,
        comments: Math.floor(Math.random() * 50) + 10
      }))
    : defaultImages;

  const instagramUrl = settings.instagram_url || "https://instagram.com/sieteviajessilkroad";
  const handle = instagramUrl.split('/').pop() || "SieteViajesSilkRoad";

  return (
    <section className="py-20 bg-surface">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 text-pink-600 dark:text-pink-400 text-sm font-medium mb-6 hover:scale-105 transition-transform duration-300">
            <Camera className="w-4 h-4" />
            @{handle}
          </a>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-text-dark mb-4">
            {title}
          </h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">{subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {displayPosts.map((post, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group relative aspect-square rounded-[2rem] overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              <Image
                src={post.image}
                alt={`Instagram moment ${index + 1}`}
                fill
                className="object-cover transition-transform duration-[2s] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-4 text-white">
                  <div className="flex items-center gap-6 font-bold text-lg">
                    <span className="flex items-center gap-2">
                       <Heart className="w-5 h-5 fill-rose-500 text-rose-500" /> {post.likes}
                    </span>
                    <span className="flex items-center gap-2">
                       <MessageCircle className="w-5 h-5 fill-white text-white" /> {post.comments}
                    </span>
                  </div>
                  <div className="px-4 py-1.5 rounded-full border border-white/30 bg-white/10 text-[10px] uppercase font-black tracking-widest">
                     Explore Artifact
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full border-2 border-azure text-azure font-black uppercase text-[10px] tracking-widest hover:bg-azure hover:text-white transition-all duration-500 shadow-xl shadow-azure/10"
          >
            <Camera className="w-5 h-5" />
            {followBtn}
          </a>
        </div>
      </div>
    </section>
  );
}

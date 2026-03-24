'use client';

import { motion } from 'framer-motion';
import { Map, ArrowLeft, Home } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

export default function NotFound() {
  const { t, locale } = useLanguage();

  const translations = {
    es: {
      title: '¡Vaya! Pareces perdido en el desierto.',
      desc: 'El camino que buscas ha sido borrado por las arenas de la Ruta de la Seda. Déjanos ayudarte a encontrar el camino de regreso a la civilización.',
      backHome: 'Volver al Inicio',
      goBack: 'Regresar'
    },
    en: {
      title: 'Oops! You seem lost in the desert.',
      desc: 'The path you are looking for has been washed away by the Silk Road sands. Let us help you find your way back to civilization.',
      backHome: 'Back to Home',
      goBack: 'Go Back'
    },
    ru: {
      title: 'Упс! Похоже, вы заблудились в пустыне.',
      desc: 'Путь, который вы ищете, занесло песками Шелкового пути. Позвольте нам помочь вам найти дорогу обратно к цивилизации.',
      backHome: 'На главную',
      goBack: 'Вернуться'
    },
    uz: {
      title: 'Voy! Choʻlda adashib qolganga oʻxshaysiz.',
      desc: 'Siz qidirayotgan yoʻlni Ipak yoʻli qumlari koʻmib yubordi. Sizga yana manzilingizni topishda yordam beramiz.',
      backHome: 'Bosh sahifa',
      goBack: 'Orqaga'
    }
  };

  const content = translations[locale as keyof typeof translations] || translations.en;

  return (
    <div className="min-h-screen bg-pearl flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative floating elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-azure/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-gold/5 rounded-full blur-3xl animate-pulse delay-700"></div>

      <div className="max-w-2xl w-full text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-12 relative"
        >
          <div className="relative z-10">
            <h1 className="text-[150px] md:text-[200px] font-black text-azure/10 leading-none select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Map className="w-24 h-24 md:w-32 md:h-32 text-gold drop-shadow-2xl" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold font-heading text-text-dark mb-6 tracking-tight">
            {content.title}
          </h2>
          <p className="text-text-muted text-lg mb-10 max-w-lg mx-auto leading-relaxed">
            {content.desc}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="px-10 py-4 rounded-full azure-gradient text-white font-bold shadow-xl hover:shadow-azure/40 transition-all duration-300 flex items-center gap-2 group"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {content.backHome}
            </Link>
            <button
               onClick={() => window.history.back()}
              className="px-10 py-4 rounded-full bg-white text-text-dark font-bold shadow-md hover:bg-gray-50 transition-all border border-gray-100 flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              {content.goBack}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none uzbek-pattern"></div>
    </div>
  );
}

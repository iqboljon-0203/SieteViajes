'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

interface SiteSettings {
  site_name: string;
  site_logo: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  contact_whatsapp: string | null;
  contact_telegram: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  footer_text_en: string | null;
  footer_text_es: string | null;
  footer_text_ru: string | null;
  footer_text_uz: string | null;
  address: string | null;
  instagram_images: string[];
  hero_background: string | null;
}

interface SettingsContextType {
  settings: SiteSettings;
  loading: boolean;
}

const defaultSettings: SiteSettings = {
  site_name: 'SieteViajes Silk Road',
  site_logo: null,
  contact_email: 'info@sieteviajes.com',
  contact_phone: '+998 90 963 88 75',
  contact_whatsapp: '+998909638875',
  contact_telegram: '@SieteViajes_bot',
  instagram_url: 'https://instagram.com/sieteviajes',
  facebook_url: 'https://facebook.com/sieteviajes',
  footer_text_en: 'Crafting exclusive Silk Road adventures through Uzbekistan since 2018.',
  footer_text_es: 'Creando aventuras exclusivas por la Ruta de la Seda en Uzbekistán desde 2018.',
  footer_text_ru: 'Создаем эксклюзивные приключения по Шелковому пути в Узбекистане с 2018 года.',
  footer_text_uz: '2018-yildan beri O‘zbekiston bo‘ylab Ipak Yo‘li bo‘yicha eksklyuziv sayohatlarni taqdim etib kelmoqdamiz.',
  address: 'Tashkent, Uzbekistan',
  instagram_images: [],
  hero_background: '/images/hero-registan.png'
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        // Explicitly listing columns can avoid certain 406/Not Acceptable issues in PostgREST
        const { data, error } = await supabase
          .from('site_settings')
          .select('id, site_name, site_logo, contact_email, contact_phone, contact_whatsapp, contact_telegram, instagram_url, facebook_url, footer_text_en, footer_text_es, footer_text_ru, footer_text_uz, address, instagram_images, hero_background')
          .limit(1);
        
        if (error) {
          console.error('Supabase settings fetch error:', error.message, error.code);
          return;
        }

        if (data && data.length > 0) {
          setSettings({
            ...defaultSettings,
            ...data[0]
          });
        }
      } catch (err) {
        console.error('Failed to load site settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

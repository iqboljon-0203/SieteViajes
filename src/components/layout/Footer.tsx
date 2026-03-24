'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Globe, Share2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useSettings } from '@/context/SettingsContext';

export function Footer() {
  const { t, locale } = useLanguage();
  const { settings } = useSettings();

  const footerText = locale === 'ru' ? settings.footer_text_ru : 
                     locale === 'uz' ? settings.footer_text_uz : 
                     locale === 'es' ? settings.footer_text_es : 
                     settings.footer_text_en;

  return (
    <footer className="bg-[#0a1628] text-white relative overflow-hidden">
      {/* Gold line separator at the very top */}
      <div className="h-1 gold-gradient w-full opacity-80 absolute top-0 left-0 z-20"></div>

      {/* Decorative uzbek pattern overlay */}
      <div className="absolute inset-0 opacity-5 uzbek-pattern"></div>
      
      <div className="max-w-7xl mx-auto relative z-10 py-24 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6 transition-transform duration-300 hover:scale-[1.03]">
              <Image 
                src={settings.site_logo || "/images/logo.svg"} 
                alt={`${settings.site_name} Logo`} 
                width={80} 
                height={60} 
                className="object-contain drop-shadow-md brightness-110"
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold font-heading">{settings.site_name.split(' ')[0]}</span>
                <span className="block text-[10px] uppercase tracking-[0.2em] text-gold -mt-1">{settings.site_name.split(' ').slice(1).join(' ') || 'Silk Road'}</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              {footerText || t('footer.description')}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gold mb-5">{t('footer.links')}</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link href="/tour-catalog" className="text-sm text-gray-400 hover:text-white transition-colors">
                  {t('nav.tours')}
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-sm text-gray-400 hover:text-white transition-colors">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gold mb-5">
              {t('footer.legal_title')}
            </h4>
            <ul className="space-y-3">
              <li>
                <span className="text-sm text-gray-400 cursor-pointer hover:text-white transition-colors">
                  {t('footer.legal')}
                </span>
              </li>
              <li>
                <span className="text-sm text-gray-400 cursor-pointer hover:text-white transition-colors">
                  {t('footer.privacy')}
                </span>
              </li>
              <li>
                <span className="text-sm text-gray-400 cursor-pointer hover:text-white transition-colors">
                  {t('footer.license')}
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gold mb-8">
              {t('footer.contact_info')}
            </h4>
            <ul className="flex flex-col gap-4">
              {settings.contact_phone && (
                <li className="flex items-center gap-3 text-sm text-gray-400">
                  <Phone className="w-4 h-4 text-gold shrink-0 transition-transform group-hover:scale-110" />
                  <a href={`tel:${settings.contact_phone.replace(/\s+/g, '')}`} className="hover:text-white transition-colors">
                    {settings.contact_phone}
                  </a>
                </li>
              )}
              {settings.contact_email && (
                <li className="flex items-center gap-3 text-sm text-gray-400">
                  <Mail className="w-4 h-4 text-gold shrink-0 transition-transform group-hover:scale-110" />
                  <a href={`mailto:${settings.contact_email}`} className="hover:text-white transition-colors">
                    {settings.contact_email}
                  </a>
                </li>
              )}
              {settings.address && (
                <li className="flex items-center gap-3 text-sm text-gray-400">
                  <MapPin className="w-4 h-4 text-gold shrink-0" />
                  <span className="cursor-default">{settings.address}</span>
                </li>
              )}
              <li className="flex items-center gap-4 mt-2">
                 {settings.instagram_url && (
                    <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-lg text-gold hover:bg-gold hover:text-white transition-all">
                       <Share2 size={16} />
                    </a>
                 )}
                 {settings.facebook_url && (
                    <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-lg text-gold hover:bg-gold hover:text-white transition-all">
                       <Globe size={16} />
                    </a>
                 )}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} SieteViajesSilkRoad.com — {t('footer.rights')}
          </p>
          <p className="text-xs text-gray-600">
            {t('footer.made_with')}
          </p>
        </div>
      </div>
    </footer>
  );
}

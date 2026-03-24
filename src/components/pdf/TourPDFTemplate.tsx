import React from 'react';
import { getFormattedPrice } from '@/lib/currency';
import { MapPin, Clock, Star, Calendar } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useSettings } from '@/context/SettingsContext';

export function TourPDFTemplate({ tour, currency, currentLang }: { tour: any, currency: any, currentLang: string }) {
  const { t } = useLanguage();
  const { settings } = useSettings();

  const resolveContent = (field: string) => {
    const isSpanish = currentLang === 'es';
    const fieldEnJs = `${field}_en_js`;
    const fieldRuJs = `${field}_ru_js`;
    const fieldUzJs = `${field}_uz_js`;
    const fieldEsJs = `${field}_js`; // Base _js field is Spanish
    
    const fieldEn = `${field}_en`;
    const fieldRu = `${field}_ru`;
    const fieldUz = `${field}_uz`;
    const fieldEs = field;
    
    const staticFieldEn = `${field}En`;
    const staticFieldRu = `${field}Ru`;
    const staticFieldUz = `${field}Uz`;

    if (currentLang === 'ru') return tour[fieldRuJs] || tour[fieldRu] || tour[staticFieldRu] || tour[fieldEnJs] || tour[fieldEn] || tour[staticFieldEn] || tour[fieldEsJs] || tour[fieldEs];
    if (currentLang === 'uz') return tour[fieldUzJs] || tour[fieldUz] || tour[staticFieldUz] || tour[fieldEnJs] || tour[fieldEn] || tour[staticFieldEn] || tour[fieldEsJs] || tour[fieldEs];
    if (currentLang === 'en') return tour[fieldEnJs] || tour[fieldEn] || tour[staticFieldEn] || tour[fieldEsJs] || tour[fieldEs];
    return tour[fieldEsJs] || tour[fieldEs] || tour[fieldEnJs] || tour[fieldEn] || tour[staticFieldEn];
  };

  const highlights = resolveContent('highlights') || [];
  const cities = resolveContent('cities') || [];
  const title = resolveContent('title');
  const subtitle = resolveContent('subtitle');

  return (
    <div id="tour-pdf-download-template" className="bg-white text-gray-900 absolute w-[1024px] pointer-events-none" style={{ left: '-9999px', top: '-9999px' }}>
      
      {/* PDF Header / Hero */}
      <div className="relative min-h-[450px] w-full bg-slate-100 flex items-end">
        <img src={tour.image || tour.image_url} alt="Tour Hero" className="absolute inset-0 w-full h-full object-cover" crossOrigin="anonymous" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-black/30"></div>
        
        {/* Floating Logo Top Left */}
        <div className="absolute top-10 left-12 z-20 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
          <img src={settings.site_logo || "/images/logo.svg"} alt={settings.site_name} className="w-40 object-contain drop-shadow-2xl" crossOrigin="anonymous" />
        </div>

        <div className="relative z-10 p-12 w-full text-white flex justify-between items-end">
          <div className="max-w-[700px]">
            <h1 className="text-5xl font-bold font-serif mb-4 leading-tight shadow-sm tracking-wide">{title}</h1>
            <p className="text-xl opacity-90">{subtitle}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl text-center min-w-[200px]">
            <p className="text-white/80 uppercase text-xs tracking-widest font-bold mb-1">{t('pdf.total_price')}</p>
            <p className="text-4xl font-bold text-yellow-400">{getFormattedPrice(tour.priceUSD || tour.price_usd, currency)}</p>
          </div>
        </div>
      </div>

      {/* Basic Info Bar */}
      <div className="flex bg-slate-900 text-white p-8">
        <div className="flex-1 flex items-center gap-4">
          <Clock className="w-8 h-8 text-blue-400" />
          <div>
            <p className="text-sm opacity-60 uppercase tracking-wider">{t('pdf.duration')}</p>
            <p className="font-bold text-lg">{tour.duration || tour.duration_days} {t('catalog.card.days')} / {tour.nights || tour.nights_count} {t('catalog.card.nights')}</p>
          </div>
        </div>
        <div className="flex-1 flex items-center gap-4">
          <MapPin className="w-8 h-8 text-blue-400" />
          <div>
            <p className="text-sm opacity-60 uppercase tracking-wider">{t('pdf.destinations')}</p>
            <p className="font-bold text-lg">{Array.isArray(cities) ? cities.join(' - ') : ''}</p>
          </div>
        </div>
        <div className="flex-1 flex items-center gap-4">
          <Star className="w-8 h-8 text-blue-400" />
          <div>
            <p className="text-sm opacity-60 uppercase tracking-wider">{t('pdf.comfort')}</p>
            <p className="font-bold text-lg">{tour.stars || tour.stars_count || tour.stars_rating} {t('badge.stars')}</p>
          </div>
        </div>
        <div className="flex-1 flex items-center gap-4">
          <Clock className="w-8 h-8 text-blue-400" />
          <div>
            <p className="text-sm opacity-60 uppercase tracking-wider">{t('pdf.validity')}</p>
            <p className="font-bold text-lg">{t('pdf.validity_all') || '12 Months'}</p>
          </div>
        </div>
      </div>

      <div className="p-12 pb-24">
        <div className="grid grid-cols-3 gap-12">
          
          <div className="col-span-2">
            <div className="space-y-8">
              {(tour.itinerary || tour.itineraries || []).map((day: any, idx: number) => {
                const dayTitle = day[`title_${currentLang === 'es' ? 'es_js' : currentLang}`] || day[`title_${currentLang}`] || day.title_uz || day.titleEn || day.title;
                const dayDesc = day[`description_${currentLang === 'es' ? 'es_js' : currentLang}`] || day[`description_${currentLang}`] || day.description_uz || day.descriptionEn || day.description;
                const dayNumber = day.day_number || day.day || (idx + 1);
                
                return (
                  <div key={idx} className="flex gap-6">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex flex-col items-center justify-center flex-shrink-0 font-bold border border-blue-100">
                      <span className="text-[10px] uppercase">{t('pdf.day')}</span>
                      <span className="text-xl">{dayNumber}</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-800 mb-2">{dayTitle}</h4>
                      <p className="text-slate-600 leading-relaxed text-justify">{dayDesc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="col-span-1 space-y-8">
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6">{t('pdf.highlights')}</h3>
              <ul className="space-y-4">
                {highlights && highlights.map((h: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 font-medium">{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-900 text-white p-8 rounded-3xl">
              <h3 className="text-xl font-bold mb-6">{settings.site_name}</h3>
              <div className="space-y-4 text-white/80 text-sm">
                <p>📞 {settings.contact_phone || settings.contact_whatsapp}</p>
                <p>📩 {settings.contact_email}</p>
                <p>📍 {settings.address || 'Uzbekistan'}</p>
                <div className="mt-6 pt-6 border-t border-white/20">
                  <p className="font-bold text-white mb-2">{t('pdf.notice')}</p>
                  <p className="text-xs leading-relaxed">{t('pdf.disclaimer')}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
}

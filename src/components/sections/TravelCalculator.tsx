'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, Baby, Shield, Car, UserCheck, Minus, Plus, FileDown, Calculator, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCurrency } from '@/context/CurrencyContext';
import { getFormattedPrice } from '@/lib/currency';
import { TourPDFTemplate } from '@/components/pdf/TourPDFTemplate';

import { TourDB } from '@/lib/supabase';

interface TravelCalculatorProps {
  tour: TourDB | any; // Use TourDB but allow fallback for static tours
}

export function TravelCalculator({ tour }: TravelCalculatorProps) {
  const { t, locale } = useLanguage();
  const { currency } = useCurrency();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Normalize data for both static and DB
  const priceUSD = tour.price_usd || tour.priceUSD;
  const childDiscount = tour.child_discount_pct ?? tour.child_discount ?? tour.childDiscount ?? 0;
  const addonPrices = tour.addon_prices_js || tour.addon_prices || tour.addonPrices || { visa: 0, transport: 0, guide: 0 };
  const title = locale === 'es' ? (tour.title || tour.title_es) : (tour.titleEn || tour.title_en);
  const subtitle = locale === 'es' ? (tour.subtitle || tour.subtitle_es) : (tour.subtitleEn || tour.subtitle_en);

  const translatedData = { title, subtitle };

  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [addons, setAddons] = useState({
    visa: false,
    transport: false,
    guide: false,
  });

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const { toJpeg } = await import('html-to-image');
      const { jsPDF } = await import('jspdf');

      const element = document.getElementById('tour-pdf-download-template');
      if (!element) throw new Error('PDF Template not found');

      element.style.left = '0';
      element.style.top = '0';
      element.style.zIndex = '-9999';

      const imgData = await toJpeg(element, {
        quality: 0.95,
        backgroundColor: '#ffffff',
        pixelRatio: 1.5,
      });

      element.style.left = '-9999px';
      element.style.top = '-9999px';

      const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (element.clientHeight * pdfWidth) / element.clientWidth;
      
      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`SieteViajes-${tour.slug}-${locale}.pdf`);
    } catch (err) {
      console.error(err);
      alert(t('detail.download_failed') || 'Failed to generate PDF.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const total = useMemo(() => {
    let sum = 0;
    sum += adults * priceUSD;
    sum += children * priceUSD * (1 - childDiscount / 100);
    if (addons.visa) sum += (adults + children) * (addonPrices.visa || 0);
    if (addons.transport) sum += (addonPrices.transport || 0);
    if (addons.guide) sum += (addonPrices.guide || 0);
    return Math.round(sum);
  }, [adults, children, addons, priceUSD, childDiscount, addonPrices]);

  const renderCounter = (value: number, onMinus: () => void, onPlus: () => void, min = 0) => (
    <div className="flex items-center gap-3 bg-pearl-warm/50 p-1 rounded-xl border border-gray-100 shadow-inner">
      <button
        onClick={onMinus}
        disabled={value <= min}
        className="w-10 h-10 rounded-lg bg-white border border-border flex items-center justify-center text-text-dark hover:border-azure hover:text-azure transition-all disabled:opacity-30 shadow-sm"
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="text-xl font-bold w-10 text-center font-heading">{value}</span>
      <button
        onClick={onPlus}
        className="w-10 h-10 rounded-lg bg-white border border-border flex items-center justify-center text-text-dark hover:border-azure hover:text-azure transition-all shadow-sm"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-border/50 overflow-hidden sticky top-28">
      {/* Header */}
      <div className="azure-gradient p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Calculator className="w-24 h-24" />
        </div>
        <div className="flex items-center gap-3 mb-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-heading text-xl font-bold">{t('detail.calculator')}</h3>
        </div>
        <p className="text-white/80 font-medium relative z-10 text-base">
          {t('catalog.card.from')} <span className="text-white font-bold text-xl">{getFormattedPrice(priceUSD, currency)}</span>
          <span className="text-xs ml-2 opacity-60">/ {t('detail.perperson')}</span>
        </p>
      </div>

      <div className="p-8 space-y-8">
        {/* Adults */}
        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-azure/5 flex items-center justify-center text-azure group-hover:bg-azure group-hover:text-white transition-colors duration-500">
              <Users className="w-5 h-5" />
            </div>
            <span className="font-bold text-text-dark">{t('detail.adults')}</span>
          </div>
          {renderCounter(adults, () => setAdults(Math.max(1, adults - 1)), () => setAdults(adults + 1), 1)}
        </div>

        {/* Children */}
        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-azure/5 flex items-center justify-center text-azure group-hover:bg-azure group-hover:text-white transition-colors duration-500">
              <Baby className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-text-dark">{t('detail.children')}</span>
               <span className="block text-[10px] font-bold text-gold uppercase tracking-wider">-{childDiscount}% OFF</span>
            </div>
          </div>
          {renderCounter(children, () => setChildren(Math.max(0, children - 1)), () => setChildren(children + 1))}
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Add-ons */}
        <div className="space-y-4">
          <h4 className="font-bold text-[10px] text-text-muted uppercase tracking-wider">{t('detail.addons')}</h4>
          <div className="grid grid-cols-1 gap-3">
            {[
              { key: 'visa' as const, label: t('detail.addon.visa'), icon: <Shield className="w-4 h-4" />, price: addonPrices.visa },
              { key: 'transport' as const, label: t('detail.addon.transport'), icon: <Car className="w-4 h-4" />, price: addonPrices.transport },
              { key: 'guide' as const, label: t('detail.addon.guide'), icon: <UserCheck className="w-4 h-4" />, price: addonPrices.guide },
            ].filter(addon => addon.price > 0).map((addon) => (
              <label
                key={addon.key}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                  addons[addon.key]
                    ? 'border-azure bg-azure/5 shadow-md scale-[1.02]'
                    : 'border-gray-50 bg-gray-50/30 hover:border-azure/20'
                }`}
              >
                <input
                  type="checkbox"
                  checked={addons[addon.key]}
                  onChange={(e) => setAddons({ ...addons, [addon.key]: e.target.checked })}
                  className="sr-only"
                />
                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                  addons[addon.key] ? 'border-azure bg-azure text-white' : 'border-gray-300 bg-white'
                }`}>
                  {addons[addon.key] && (
                    <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-4 h-4" viewBox="0 0 12 12">
                      <path d="M3 6l2 2 4-4" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                  )}
                </div>
                <div className="flex-1">
                   <div className="flex items-center gap-2 mb-0.5">
                     <span className="text-azure">{addon.icon}</span>
                     <span className="text-sm font-bold text-text-dark">{addon.label}</span>
                   </div>
                   <span className="text-xs font-bold text-gold">+{getFormattedPrice(addon.price, currency)}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-azure/[0.03] rounded-3xl p-6 border border-azure/5">
           <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-text-muted uppercase tracking-widest">{t('detail.total')}</span>
            <div className="text-right">
                <motion.div
                key={total}
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-heading text-3xl font-bold text-azure"
              >
                {getFormattedPrice(total, currency)}
              </motion.div>
            </div>
          </div>
        </div>

        <button
          className="w-full py-4 rounded-xl gold-gradient text-white font-bold text-md shadow-lg transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
          onClick={() => {
            const section = document.getElementById('booking-section');
            section?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          {t('detail.book')}
          <ArrowRight className="w-5 h-5" />
        </button>

        <button 
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF}
          className="w-full py-4 rounded-2xl bg-white border-2 border-azure/20 text-azure font-bold text-sm flex items-center justify-center gap-2 hover:bg-azure/5 transition-all duration-300"
        >
          {isGeneratingPDF ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
          {isGeneratingPDF ? 'GENERATING...' : t('detail.download').toUpperCase()}
        </button>
      </div>

      <TourPDFTemplate 
        tour={{...tour, priceUSD, childDiscount, addonPrices}} 
        currency={currency} 
        currentLang={locale} 
      />
    </div>
  );
}

const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

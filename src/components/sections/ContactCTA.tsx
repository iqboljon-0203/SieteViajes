'use client';

import { useState } from 'react';
import { Mail, Phone, CheckCircle2, Loader2, AlertCircle, MapPin, User, Clock } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useSettings } from '@/context/SettingsContext';

export function ContactCTA() {
  const { t, locale } = useLanguage();
  const { settings } = useSettings();
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const data = {
      type: 'contact_form' as const,
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      message: formData.get('message') as string,
      locale,
    };

    // Simple validation
    if (!data.phone || data.phone.length < 7) {
      setStatus('error');
      return;
    }

    setStatus('submitting');
    
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <section className="py-24 bg-azure text-white relative overflow-hidden" id="contact">
      <div className="absolute inset-0 opacity-10 uzbek-pattern"></div>
      
      <div className="section-container relative z-10">
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6">
                {t('contact.title')}
              </h2>
              <p className="text-white/80 text-lg mb-8">
                {t('contact.subtitle')}
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Rahbar</p>
                    <p className="font-bold text-sm md:text-base">Tursunov Valijon Salimjanovich</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Adres</p>
                    <p className="font-bold text-sm md:text-base">Olmazor tumani K. Umarov 13. Uy</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Email</p>
                    <p className="font-bold text-sm md:text-base break-all">Sieteviajessilkroad@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Tel</p>
                    <p className="font-bold text-sm md:text-base">{settings.contact_phone || '+998 90 963 88 75'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Ish vaqti</p>
                    <p className="font-bold text-sm md:text-base">Du-Juma 9:00-18:00</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-surface rounded-3xl p-8 lg:p-10 shadow-2xl relative overflow-hidden z-10">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                <Mail className="w-64 h-64 text-text-dark -mt-10 -mr-10" />
              </div>
              
              {status === 'success' ? (
                <div className="flex flex-col items-center justify-center py-10 text-center relative z-10 h-full">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold font-heading text-text-dark mb-4">
                    {t('contact.success_title')}
                  </h3>
                  <p className="text-text-muted text-lg mb-8 max-w-sm">
                    {t('contact.success_message')}
                  </p>
                  <button 
                    onClick={() => setStatus('idle')}
                    className="px-8 py-3 rounded-full bg-azure/5 text-azure hover:bg-azure hover:text-white transition-all duration-300 font-bold border border-azure/20"
                  >
                    {locale === 'es' ? 'Enviar otro mensaje' : locale === 'ru' ? 'Отправить новое сообщение' : locale === 'uz' ? 'Yana xabar yuborish' : 'Send another message'}
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="font-heading text-text-dark font-bold text-2xl md:text-3xl mb-8 relative z-10">
                    {t('contact.form_title')}
                  </h3>
                  
                  {status === 'error' && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-3 relative z-10">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm font-medium">An error occurred. Please try again.</span>
                    </div>
                  )}

                  <form className="space-y-5 relative z-10" onSubmit={handleSubmit}>
                    <input 
                      type="text" 
                      name="name"
                      placeholder={t('contact.name')} 
                      className="w-full px-5 py-4 bg-transparent border border-gray-200 dark:border-slate-700/60 focus:bg-pearl/30 focus:border-gold focus:ring-1 focus:ring-gold/50 rounded-2xl transition-all text-text-dark font-medium placeholder:text-gray-400/80 outline-none" 
                      required
                    />
                    <div className="relative">
                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      <input 
                        type="tel" 
                        name="phone"
                        placeholder={t('contact.phone')} 
                        className="w-full pl-12 pr-5 py-4 bg-transparent border border-gray-200 dark:border-slate-700/60 focus:bg-pearl/30 focus:border-gold focus:ring-1 focus:ring-gold/50 rounded-2xl transition-all text-text-dark font-medium placeholder:text-gray-400/80 outline-none" 
                        required
                      />
                    </div>
                    <textarea 
                      name="message"
                      placeholder={t('contact.message')} 
                      rows={4} 
                      className="w-full px-5 py-4 bg-transparent border border-gray-200 dark:border-slate-700/60 focus:bg-pearl/30 focus:border-gold focus:ring-1 focus:ring-gold/50 rounded-2xl transition-all text-text-dark font-medium placeholder:text-gray-400/80 outline-none resize-none"
                      required
                    ></textarea>
                    <button 
                      type="submit" 
                      disabled={status === 'submitting'}
                      className="w-full py-4 mt-2 rounded-2xl gold-gradient text-white font-bold text-lg shadow-lg hover:shadow-gold/40 hover:-translate-y-1 transition-all duration-300 uppercase tracking-widest text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
                    >
                      {status === 'submitting' ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        t('contact.send')
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

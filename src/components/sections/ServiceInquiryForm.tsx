'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, AlertCircle, Loader2, Plane, Train, Car } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ServiceInquiryFormProps {
  serviceType: 'air' | 'train' | 'transport';
}

export function ServiceInquiryForm({ serviceType }: ServiceInquiryFormProps) {
  const { t, locale } = useLanguage();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    origin: '',
    destination: '',
    date: '',
    people: '1',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    const serviceLabel = {
      air: t('nav.air_tickets'),
      train: t('nav.train_tickets'),
      transport: t('nav.transport')
    }[serviceType];

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          type: 'service_inquiry',
          tourName: `${serviceLabel}: ${formData.origin} -> ${formData.destination}`,
          preferences: {
              serviceSubtype: serviceType,
              travelDate: formData.date
          },
          locale
        }),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', phone: '', email: '', origin: '', destination: '', date: '', people: '1', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 dark:bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] border border-black/5 dark:border-white/10 text-center space-y-4"
      >
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold font-heading text-text-dark uppercase italic tracking-tight">{t('contact.success_title')}</h3>
        <p className="text-text-muted font-medium max-w-sm mx-auto">{t('contact.success_message')}</p>
        <button 
          onClick={() => setStatus('idle')}
          className="px-8 py-3 bg-azure text-white font-bold text-[10px] uppercase tracking-widest rounded-xl hover:bg-gold transition-all shadow-lg"
        >
          {t('nav.back')}
        </button>
      </motion.div>
    );
  }

  const Icon = {
    air: Plane,
    train: Train,
    transport: Car
  }[serviceType];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase text-text-muted tracking-widest pl-2">
            {t('contact.name')}
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-6 py-4 bg-pearl-warm border border-border rounded-2xl text-text-dark placeholder:text-text-muted/40 focus:outline-none focus:border-gold transition-all"
            placeholder="John Doe"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase text-text-muted tracking-widest pl-2">
            {t('contact.phone')}
          </label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-6 py-4 bg-pearl-warm border border-border rounded-2xl text-text-dark placeholder:text-text-muted/40 focus:outline-none focus:border-gold transition-all"
            placeholder="+1 234 567 89 00"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase text-text-muted tracking-widest pl-2">
            {t('services.form.origin')}
          </label>
          <input
            type="text"
            required
            value={formData.origin}
            onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
            className="w-full px-6 py-4 bg-pearl-warm border border-border rounded-2xl text-text-dark placeholder:text-text-muted/40 focus:outline-none focus:border-gold transition-all"
            placeholder="Samarkand"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase text-text-muted tracking-widest pl-2">
            {t('services.form.destination')}
          </label>
          <input
            type="text"
            required
            value={formData.destination}
            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
            className="w-full px-6 py-4 bg-pearl-warm border border-border rounded-2xl text-text-dark placeholder:text-text-muted/40 focus:outline-none focus:border-gold transition-all"
            placeholder="Bukhara"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase text-text-muted tracking-widest pl-2">
            {t('services.form.date')}
          </label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-6 py-4 bg-pearl-warm border border-border rounded-2xl text-text-dark focus:outline-none focus:border-gold transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase text-text-muted tracking-widest pl-2">
            {t('services.form.passengers')}
          </label>
          <select
            value={formData.people}
            onChange={(e) => setFormData({ ...formData, people: e.target.value })}
            className="w-full px-6 py-4 bg-pearl-warm border border-border rounded-2xl text-text-dark focus:outline-none focus:border-gold transition-all appearance-none"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
              <option key={n} value={n} className="bg-surface text-text-dark">{n}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase text-text-muted tracking-widest pl-2">
          {t('contact.message')}
        </label>
        <textarea
          rows={3}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-6 py-4 bg-pearl-warm border border-border rounded-2xl text-text-dark placeholder:text-text-muted/40 focus:outline-none focus:border-gold transition-all resize-none"
          placeholder="..."
        ></textarea>
      </div>

      {status === 'error' && (
        <div className="p-4 bg-rose-500/20 rounded-xl flex items-center gap-3 text-rose-200 text-sm italic">
          <AlertCircle size={18} />
          {t('booking.error_title')}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-5 gold-gradient rounded-2xl text-white font-bold text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100"
      >
        {status === 'loading' ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <Icon className="w-5 h-5" />
            {t('services.form.request')}
          </>
        )}
      </button>
    </form>
  );
}

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Check, User, Mail, Phone, Calendar, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface BookingFormProps {
  tourName: string;
}

export function BookingForm({ tourName }: BookingFormProps) {
  const { t, locale } = useLanguage();
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [form, setForm] = useState({
    name: '',
    people: '2',
    phone: '',
    date: '',
    message: '',
  });


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!form.phone || form.phone.length < 7) {
      setStatus('error');
      return;
    }

    setStatus('submitting');

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'booking',
          tourName,
          locale,
          ...form,
        }),
      });

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-surface rounded-2xl p-10 shadow-card text-center border border-green-500/20"
        id="booking"
      >
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-green-50 border-2 border-green-200">
          <Check className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="font-heading text-xl font-bold text-text-dark mb-3">{t('booking.success')}</h3>
        <p className="text-text-muted leading-relaxed">{t('booking.success_desc')}</p>
      </motion.div>
    );
  }

  if (status === 'error') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-surface rounded-2xl p-10 shadow-card text-center border border-red-500/20"
        id="booking"
      >
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-red-50 border-2 border-red-200">
          <MessageSquare className="w-10 h-10 text-red-500" />
        </div>
        <h3 className="font-heading text-xl font-bold text-text-dark mb-3">{t('booking.error_title')}</h3>
        <p className="text-text-muted leading-relaxed mb-6">{t('booking.error_desc')}</p>
        <button 
          onClick={() => setStatus('idle')}
          className="px-6 py-3 bg-azure text-white rounded-xl font-bold hover:bg-azure-light transition-all"
        >
          {t('booking.try_again')}
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-surface rounded-2xl shadow-card overflow-hidden border border-border"
      id="booking"
    >
      {/* Header */}
      <div className="azure-gradient" style={{ padding: '1.5rem 2rem' }}>
        <h3 className="font-heading text-xl font-bold text-white">{t('booking.title')}</h3>
        <p className="text-white/80 text-sm mt-1">{tourName}</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Name */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-azure">
              <User className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder={t('booking.name')}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full pl-12 pr-5 py-4 bg-transparent border border-gray-200 dark:border-slate-700/60 focus:bg-pearl/30 focus:border-gold focus:ring-1 focus:ring-gold/50 rounded-2xl transition-all text-text-dark font-medium placeholder:text-gray-400/80 outline-none"
              disabled={status === 'submitting'}
            />
          </div>

          {/* People Count */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-azure">
              <User className="w-5 h-5" />
            </div>
            <input
              type="number"
              min="1"
              max="50"
              placeholder={t('detail.adults')}
              value={form.people}
              onChange={(e) => setForm({ ...form, people: e.target.value })}
              required
              className="w-full pl-12 pr-5 py-4 bg-transparent border border-gray-200 dark:border-slate-700/60 focus:bg-pearl/30 focus:border-gold focus:ring-1 focus:ring-gold/50 rounded-2xl transition-all text-text-dark font-medium placeholder:text-gray-400/80 outline-none"
              disabled={status === 'submitting'}
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-azure">
              <Phone className="w-5 h-5" />
            </div>
            <input
              type="tel"
              placeholder={t('booking.phone')}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
              className="w-full pl-12 pr-5 py-4 bg-transparent border border-gray-200 dark:border-slate-700/60 focus:bg-pearl/30 focus:border-gold focus:ring-1 focus:ring-gold/50 rounded-2xl transition-all text-text-dark font-medium placeholder:text-gray-400/80 outline-none"
              disabled={status === 'submitting'}
            />
          </div>

          {/* Date */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-azure">
              <Calendar className="w-5 h-5" />
            </div>
            <input
              type="date"
              placeholder={t('booking.date')}
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full pl-12 pr-5 py-4 bg-transparent border border-gray-200 dark:border-slate-700/60 focus:bg-pearl/30 focus:border-gold focus:ring-1 focus:ring-gold/50 rounded-2xl transition-all text-text-dark font-medium placeholder:text-gray-400/80 outline-none cursor-pointer"
              disabled={status === 'submitting'}
            />
          </div>

          {/* Message */}
          <div className="relative">
            <div className="absolute left-4 top-[1.1rem] text-azure">
              <MessageSquare className="w-5 h-5" />
            </div>
            <textarea
              placeholder={t('booking.message')}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={4}
              className="w-full pl-12 pr-5 py-4 bg-transparent border border-gray-200 dark:border-slate-700/60 focus:bg-pearl/30 focus:border-gold focus:ring-1 focus:ring-gold/50 rounded-2xl transition-all text-text-dark font-medium placeholder:text-gray-400/80 outline-none resize-none"
              disabled={status === 'submitting'}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl gold-gradient text-white font-bold text-base shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex justify-center items-center gap-2 mt-2 disabled:opacity-70"
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t('booking.sending')}
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                {t('booking.submit')}
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

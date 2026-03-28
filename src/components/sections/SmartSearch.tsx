'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Calendar, Users, Compass } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function SmartSearch() {
  const { t, locale } = useLanguage();
  const router = useRouter();
  const [city, setCity] = useState('');
  const [date, setDate] = useState('');
  const [group, setGroup] = useState('');
  const [type, setType] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (date) params.set('date', date);
    if (group) params.set('group', group);
    if (type) params.set('type', type);
    router.push(`/tour-catalog?${params.toString()}`);
  };

  const selectStyle: React.CSSProperties = {
    width: '100%',
    paddingLeft: '2.2rem',
    paddingRight: '0.75rem',
    paddingTop: '0.75rem',
    paddingBottom: '0.75rem',
    fontSize: '0.75rem',
    backgroundColor: 'var(--color-surface)',
    borderRadius: '0.75rem',
    border: '1px solid var(--color-border)',
    outline: 'none',
    color: 'var(--color-text-dark)',
    cursor: 'pointer',
    appearance: 'none' as const,
    fontWeight: '600'
  };

  const inputStyle: React.CSSProperties = {
    ...selectStyle,
    appearance: 'auto' as const,
    cursor: 'text',
  };

  return (
    <div className="glass-card dark:bg-slate-900/60 p-2 sm:p-2.5 rounded-2xl sm:rounded-[1.5rem] w-full max-w-[56rem] mx-auto shadow-2xl">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-2.5 items-center">
        {/* City */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-azure" />
          <select value={city} onChange={(e) => setCity(e.target.value)} style={selectStyle}>
            <option value="">{t('search.city.all')}</option>
            <option value="samarkand">{t('search.city.samarkand')}</option>
            <option value="bukhara">{t('search.city.bukhara')}</option>
            <option value="khiva">{t('search.city.khiva')}</option>
            <option value="tashkent">{t('search.city.tashkent')}</option>
          </select>
        </div>

        {/* Date */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-azure" />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
        </div>

        {/* Group */}
        <div className="relative">
          <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-azure" />
          <select value={group} onChange={(e) => setGroup(e.target.value)} style={selectStyle}>
            <option value="">{t('search.group')}</option>
            <option value="1">1 {t('search.group.person')}</option>
            <option value="2">2 {t('search.group.people')}</option>
            <option value="3-5">3-5 {t('search.group.people')}</option>
            <option value="6+">6+ {t('search.group.people')}</option>
          </select>
        </div>

        {/* Type */}
        <div className="relative">
          <Compass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-azure" />
          <select value={type} onChange={(e) => setType(e.target.value)} style={selectStyle}>
            <option value="">{t('search.type.all')}</option>
            <option value="cultural">{t('search.type.cultural')}</option>
            <option value="adventure">{t('search.type.adventure')}</option>
            <option value="luxury">{t('search.type.luxury')}</option>
            <option value="gastronomic">{t('search.type.gastronomic')}</option>
          </select>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="gold-gradient col-span-2 sm:col-span-1 h-[42px] sm:h-full flex items-center justify-center gap-2 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-[1.02] transition-all"
        >
          <Search className="w-4 h-4" />
          {t('search.button')}
        </button>
      </div>
    </div>
  );
}

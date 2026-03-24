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
    paddingLeft: '2.5rem',
    paddingRight: '1rem',
    paddingTop: '0.875rem',
    paddingBottom: '0.875rem',
    fontSize: '0.875rem',
    backgroundColor: 'var(--color-surface)',
    borderRadius: '0.75rem',
    border: '1px solid var(--color-border)',
    outline: 'none',
    color: 'var(--color-text-dark)',
    cursor: 'pointer',
    appearance: 'none' as const,
  };

  const inputStyle: React.CSSProperties = {
    ...selectStyle,
    appearance: 'auto' as const,
    cursor: 'text',
  };

  return (
    <div className="glass-card dark:bg-slate-900/40" style={{ borderRadius: '1rem', padding: '0.5rem', maxWidth: '56rem', margin: '0 auto', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }} className="search-grid">
        {/* City */}
        <div style={{ position: 'relative' }}>
          <MapPin style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: 'var(--color-azure)' }} />
          <select value={city} onChange={(e) => setCity(e.target.value)} style={selectStyle}>
            <option value="">{t('search.city.all')}</option>
            <option value="samarkand">{t('search.city.samarkand')}</option>
            <option value="bukhara">{t('search.city.bukhara')}</option>
            <option value="khiva">{t('search.city.khiva')}</option>
            <option value="tashkent">{t('search.city.tashkent')}</option>
          </select>
        </div>

        {/* Date */}
        <div style={{ position: 'relative' }}>
          <Calendar style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: 'var(--color-azure)' }} />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
        </div>

        {/* Group */}
        <div style={{ position: 'relative' }}>
          <Users style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: 'var(--color-azure)' }} />
          <select value={group} onChange={(e) => setGroup(e.target.value)} style={selectStyle}>
            <option value="">{t('search.group')}</option>
            <option value="1">1 {t('search.group.person')}</option>
            <option value="2">2 {t('search.group.people')}</option>
            <option value="3-5">3-5 {t('search.group.people')}</option>
            <option value="6+">6+ {t('search.group.people')}</option>
          </select>
        </div>

        {/* Type */}
        <div style={{ position: 'relative' }}>
          <Compass style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: 'var(--color-azure)' }} />
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
          className="gold-gradient"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.875rem 1.5rem',
            borderRadius: '0.75rem',
            color: 'white',
            fontWeight: '600',
            fontSize: '0.875rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transition: 'all 300ms',
          }}
        >
          <Search style={{ width: '1rem', height: '1rem' }} />
          {t('search.button')}
        </button>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .search-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .search-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

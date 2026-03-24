'use client';

import { useState } from 'react';
import { SlidersHorizontal, Star, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCurrency } from '@/context/CurrencyContext';
import { getFormattedPrice } from '@/lib/currency';

interface FilterState {
  priceRange: [number, number];
  duration: [number, number];
  stars: number;
  cities: string[];
  type: string;
}

interface TourFiltersProps {
  filters: FilterState;
  setFilters: (f: FilterState) => void;
}

export function TourFilters({ filters, setFilters }: TourFiltersProps) {
  const { t } = useLanguage();
  const { currency } = useCurrency();
  const [mobileOpen, setMobileOpen] = useState(false);

  const cityOptions = [
    { value: 'Taskent', label: t('search.city.tashkent') },
    { value: 'Samarcanda', label: t('search.city.samarkand') },
    { value: 'Bujará', label: t('search.city.bukhara') },
    { value: 'Jiva', label: t('search.city.khiva') },
  ];

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 5000],
      duration: [1, 14],
      stars: 0,
      cities: [],
      type: '',
    });
  };

  const renderFilterContent = () => (
    <div className="space-y-8">
      {/* Price Range */}
      <div>
        <h4 className="text-sm font-semibold text-text-dark mb-3">{t('catalog.filter.price')}</h4>
        <div className="space-y-2">
          <input
            type="range"
            min={0}
            max={5000}
            step={100}
            value={filters.priceRange[1]}
            onChange={(e) => setFilters({ ...filters, priceRange: [filters.priceRange[0], Number(e.target.value)] })}
            className="w-full accent-azure"
          />
          <div className="flex justify-between text-xs text-text-muted">
            <span>{getFormattedPrice(filters.priceRange[0], currency)}</span>
            <span>{getFormattedPrice(filters.priceRange[1], currency)}</span>
          </div>
        </div>
      </div>

      {/* Duration */}
      <div>
        <h4 className="text-sm font-semibold text-text-dark mb-3">{t('catalog.filter.duration')}</h4>
        <div className="space-y-2">
          <input
            type="range"
            min={1}
            max={14}
            value={filters.duration[1]}
            onChange={(e) => setFilters({ ...filters, duration: [filters.duration[0], Number(e.target.value)] })}
            className="w-full accent-azure"
          />
          <div className="flex justify-between text-xs text-text-muted">
            <span>{filters.duration[0]} {t('catalog.card.days')}</span>
            <span>{filters.duration[1]} {t('catalog.card.days')}</span>
          </div>
        </div>
      </div>

      {/* Stars */}
      <div>
        <h4 className="text-sm font-semibold text-text-dark mb-3">{t('catalog.filter.stars')}</h4>
        <div className="flex gap-2">
          {[0, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setFilters({ ...filters, stars: star })}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm border transition-all ${
                filters.stars === star
                  ? 'border-azure bg-azure/10 text-azure font-semibold'
                  : 'border-border text-text-muted hover:border-azure/30'
              }`}
            >
              {star === 0 ? 'All' : (
                <>
                  {star} <Star className="w-3 h-3 fill-gold text-gold" />
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Cities */}
      <div>
        <h4 className="text-sm font-semibold text-text-dark mb-3">{t('catalog.filter.cities')}</h4>
        <div className="space-y-2">
          {cityOptions.map((city) => {
            const isChecked = filters.cities.includes(city.value);
            return (
              <label 
                key={city.value} 
                className="flex items-center gap-3 cursor-pointer group"
                onClick={(e) => {
                  e.preventDefault();
                  // Single selection logic: if clicking already selected, clear it. Otherwise set to this city.
                  const newCities = isChecked ? [] : [city.value];
                  setFilters({ ...filters, cities: newCities });
                }}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  isChecked
                    ? 'bg-azure border-azure'
                    : 'border-border group-hover:border-azure/50'
                }`}>
                  {isChecked && (
                    <div className="w-2.5 h-2.5 rounded-full bg-white" />
                  )}
                </div>
                <span className={`text-sm transition-colors ${isChecked ? 'text-azure font-semibold' : 'text-text-dark'}`}>
                  {city.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Tour Type */}
      <div>
        <h4 className="text-sm font-semibold text-text-dark mb-3">{t('search.type')}</h4>
        <div className="space-y-2">
          {['cultural', 'adventure', 'luxury', 'gastronomic'].map((type) => (
            <button
              key={type}
              onClick={() => setFilters({ ...filters, type: filters.type === type ? '' : type })}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                filters.type === type
                  ? 'bg-azure/10 text-azure font-semibold border border-azure/20'
                  : 'text-text-muted hover:bg-pearl border border-transparent'
              }`}
            >
              {t(`search.type.${type}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={clearFilters}
        className="w-full py-3 rounded-xl border-2 border-border text-text-muted font-semibold text-sm hover:border-red-300 hover:text-red-500 transition-all"
      >
        {t('catalog.filter.clear')}
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-24 left-1/2 -translate-x-1/2 z-40 px-6 py-3 rounded-full azure-gradient text-white font-semibold shadow-xl flex items-center gap-2"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filtros
      </button>

      {/* Mobile Filter Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute right-0 top-0 bottom-0 w-80 bg-surface p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading text-xl font-bold">Filtros</h3>
              <button onClick={() => setMobileOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            {renderFilterContent()}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block bg-surface rounded-2xl shadow-card p-6 border border-border sticky top-24">
        <div className="flex items-center gap-2 mb-6">
          <SlidersHorizontal className="w-5 h-5 text-azure" />
          <h3 className="font-heading text-lg font-bold">Filtros</h3>
        </div>
        {renderFilterContent()}
      </div>
    </>
  );
}

export type { FilterState };

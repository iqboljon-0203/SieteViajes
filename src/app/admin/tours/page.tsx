'use client';

import { useState, useEffect } from 'react';
import Link from 'next/image';
import { 
  Plus, Search, Edit2, Trash2, ExternalLink, 
  TrendingUp, Calendar, MapPin, DollarSign,
  Star, Filter, MoreVertical, Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function AdminToursPage() {
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const router = useRouter();

  async function fetchTours() {
    setLoading(true);
    const { data, error } = await supabase
      .from('tours')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setTours(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchTours();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tour? This will also delete its itinerary.')) return;
    
    // Itinerary will be deleted automatically if CASCADE is setup, 
    // but just in case or to be safe we can delete it manually or rely on foreign key.
    const { error } = await supabase.from('tours').delete().eq('id', id);
    if (error) alert(error.message);
    else fetchTours();
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from('tours')
      .update({ is_featured: !current })
      .eq('id', id);
    
    if (!error) fetchTours();
  };

  const filteredTours = tours.filter(tour => {
    const matchesSearch = tour.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tour.slug?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || tour.tour_type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-azure" />
            Tour Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
            Manage your Silk Road experiences.
          </p>
        </div>
        <button 
          onClick={() => router.push('/admin/tours/new')}
          className="azure-gradient text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-azure/20 hover:scale-105 transition-all"
        >
          <Plus className="w-4 h-4" />
          Create New
        </button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-border shadow-soft">
             <div className="flex items-center gap-2 text-azure mb-1">
                <Calendar className="w-4 h-4" />
                <span className="font-bold text-[9px] uppercase tracking-widest opacity-60">Total</span>
             </div>
             <div className="text-xl font-black">{tours.length}</div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-border shadow-soft">
             <div className="flex items-center gap-2 text-emerald-500 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="font-bold text-[9px] uppercase tracking-widest opacity-60">Featured</span>
             </div>
             <div className="text-xl font-black">{tours.filter(t => t.is_featured).length}</div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-border shadow-soft">
             <div className="flex items-center gap-2 text-gold mb-1">
                <Star className="w-4 h-4" />
                <span className="font-bold text-[9px] uppercase tracking-widest opacity-60">Hot Deals</span>
             </div>
             <div className="text-xl font-black">{tours.filter(t => t.is_hot_deal).length}</div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-border shadow-soft">
             <div className="flex items-center gap-2 text-rose-500 mb-1">
                <MapPin className="w-4 h-4" />
                <span className="font-bold text-[9px] uppercase tracking-widest opacity-60">Types</span>
             </div>
             <div className="text-xl font-black">{new Set(tours.map(t => t.tour_type)).size}</div>
          </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-border shadow-soft flex flex-col md:flex-row gap-3 items-center">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-azure transition-colors" />
          <input 
            type="text"
            placeholder="Search tours..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 font-bold text-sm rounded-xl outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-40">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border-none font-bold text-[10px] uppercase tracking-widest rounded-xl outline-none appearance-none cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="cultural">🏛️ Cultural</option>
              <option value="adventure">🏔️ Adventure</option>
              <option value="luxury">👑 Luxury</option>
              <option value="gastronomic">🍽️ Gastronomic</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tours List */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-azure" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredTours.map((tour) => (
            <div key={tour.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-border shadow-soft hover:shadow-xl transition-all duration-300 group overflow-hidden">
              <div className="flex flex-col md:flex-row items-center p-3 gap-4">
                {/* Image Preview */}
                <div className="relative w-full md:w-32 h-20 rounded-xl overflow-hidden shrink-0">
                  <Image 
                    src={tour.image_url || '/images/hero-registan.png'} 
                    alt={tour.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {tour.is_hot_deal && (
                    <div className="absolute top-1.5 left-1.5 bg-rose-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-lg uppercase tracking-tight">
                      HOT
                    </div>
                  )}
                </div>

                {/* Tour Info */}
                <div className="flex-1 w-full text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 mb-0.5">
                    <span className="px-1.5 py-0.5 rounded bg-azure/10 text-azure text-[8px] font-black uppercase tracking-wider">
                      {tour.tour_type}
                    </span>
                    <span className="text-slate-400 text-[10px] font-bold">/{tour.slug}</span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white line-clamp-1 italic uppercase tracking-tighter">{tour.title}</h3>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-[11px] text-slate-500 mt-0.5 font-bold italic">
                    <div className="flex items-center gap-1 text-azure">
                      <DollarSign className="w-3.5 h-3.5" />
                      {tour.price_usd}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {tour.duration_days}D / {tour.nights_count}N
                    </div>
                    <div className="flex items-center gap-1 text-gold">
                      <Star className="w-3.5 h-3.5 fill-gold" />
                      {tour.stars_count} Stars
                    </div>
                  </div>
                </div>

                {/* Quick Toggle Status */}
                <div className="flex items-center gap-4 px-2">
                   <div className="flex flex-col items-center gap-0.5">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Featured</span>
                      <button 
                        onClick={() => toggleFeatured(tour.id, tour.is_featured)}
                        className={`w-10 h-5 rounded-full p-0.5 transition-all duration-300 ${tour.is_featured ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                      >
                         <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${tour.is_featured ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                   </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 p-3 md:p-0">
                  <button 
                    onClick={() => router.push(`/admin/tours/edit/${tour.id}`)}
                    className="p-2.5 bg-slate-50 dark:bg-slate-700 hover:bg-azure hover:text-white dark:hover:bg-azure rounded-xl transition-all shadow-sm"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => window.open(`/tour/${tour.slug}`, '_blank')}
                    className="p-2.5 bg-slate-50 dark:bg-slate-700 hover:bg-gold hover:text-white dark:hover:bg-gold rounded-xl transition-all shadow-sm"
                    title="View"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(tour.id)}
                    className="p-2.5 bg-rose-50 dark:bg-rose-900/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl transition-all shadow-sm"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredTours.length === 0 && (
            <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-[3rem] border-2 border-dashed border-border">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <Search className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">No tours found</h3>
              <p className="text-slate-500">Try adjusting your filters or search term</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

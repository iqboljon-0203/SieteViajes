'use client';

import { useState, useEffect } from 'react';
import { 
  Save, ArrowLeft, Plus, Trash2, Image as ImageIcon, 
  MapPin, Star, DollarSign, Clock, LayoutGrid, Loader2,
  ChevronDown, ChevronUp, Layers, Globe
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { ImageUpload } from './ImageUpload';
import { GalleryUpload } from './GalleryUpload';

interface TourFormProps {
  tourId?: string; // If provided, we are editing
}

export function TourForm({ tourId }: TourFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!tourId);
  const [activeTab, setActiveTab] = useState('general'); // general, details, itinerary, media
  const [langTab, setLangTab] = useState('en'); // en, es, ru, uz

  // State for Tour
  const [formData, setFormData] = useState<any>({
    slug: '',
    title: '', title_en: '', title_ru: '', title_uz: '',
    subtitle: '', subtitle_en: '', subtitle_ru: '', subtitle_uz: '',
    price_usd: 0,
    duration_days: 1,
    nights_count: 0,
    stars_rating: 4,
    tour_type: 'cultural',
    image_url: '',
    is_featured: false,
    is_hot_deal: false,
    cities_js: [], cities_en_js: [], cities_ru_js: [], cities_uz_js: [],
    highlights_js: [], highlights_en_js: [], highlights_ru_js: [], highlights_uz_js: [],
    gallery: [],
    addon_prices_js: { visa: 80, transport: 350, guide: 200 },
    child_discount_pct: 30
  });

  // State for Itinerary
  const [itinerary, setItinerary] = useState<any[]>([]);

  useEffect(() => {
    if (tourId) {
      async function loadTour() {
        const { data: tour, error } = await supabase
          .from('tours')
          .select('*, itineraries(*)')
          .eq('id', tourId)
          .single();
        
        if (tour) {
          setFormData(tour);
          if (tour.itineraries) {
            setItinerary(tour.itineraries.sort((a: any, b: any) => a.day_number - b.day_number));
          }
        }
        setInitialLoading(false);
      }
      loadTour();
    }
  }, [tourId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tourDataToSave = { ...formData };
      delete tourDataToSave.itineraries;

      let currentTourId = tourId;

      if (tourId) {
        const { error } = await supabase.from('tours').update(tourDataToSave).eq('id', tourId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('tours').insert([tourDataToSave]).select().single();
        if (error) throw error;
        currentTourId = data.id;
      }

      if (tourId) {
        await supabase.from('itineraries').delete().eq('tour_id', tourId);
      }

      const itinToSave = itinerary.map((item, idx) => ({
        tour_id: currentTourId,
        day_number: idx + 1,
        title: item.title, title_en: item.title_en, title_ru: item.title_ru, title_uz: item.title_uz,
        description: item.description, description_en: item.description_en, description_ru: item.description_ru, description_uz: item.description_uz,
        image_url: item.image_url
      }));

      if (itinToSave.length > 0) {
        const { error: itinErr } = await supabase.from('itineraries').insert(itinToSave);
        if (itinErr) throw itinErr;
      }

      router.push('/admin/tours');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addItineraryDay = () => {
    setItinerary([...itinerary, { 
      day_number: itinerary.length + 1,
      title: '', title_en: '', title_ru: '', title_uz: '',
      description: '', description_en: '', description_ru: '', description_uz: '',
      image_url: '' 
    }]);
  };

  const updateItineraryItem = (idx: number, field: string, value: any) => {
    const newList = [...itinerary];
    newList[idx] = { ...newList[idx], [field]: value };
    setItinerary(newList);
  };

  const removeItineraryDay = (idx: number) => {
    setItinerary(itinerary.filter((_, i) => i !== idx));
  };

  const addListItem = (field: string, value: string) => {
    if (!value.trim()) return;
    setFormData({ ...formData, [field]: [...formData[field], value] });
  };

  const removeListItem = (field: string, idx: number) => {
    setFormData({ ...formData, [field]: formData[field].filter((_: any, i: number) => i !== idx) });
  };

  const handleLangTabClick = (lang: string) => setLangTab(lang);

  const LangSwitcher = () => (
    <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl w-fit mb-8">
       {['en', 'es', 'ru', 'uz'].map(l => (
         <button 
           key={l}
           type="button"
           onClick={() => handleLangTabClick(l)}
           className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${langTab === l ? 'bg-white dark:bg-slate-800 shadow-md text-azure' : 'text-slate-400'}`}
         >
           {l}
         </button>
       ))}
    </div>
  );

  if (initialLoading) return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-azure" /></div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-20 max-w-6xl mx-auto">
      {/* Header logic same as before... */}
      <div className="flex items-center justify-between sticky top-0 z-30 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md py-4 transition-all">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => router.back()} className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-border hover:bg-slate-50 shadow-sm"><ArrowLeft className="w-5 h-5" /></button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
              {tourId ? 'Refine Experience' : 'New Experience'}
            </h1>
            <p className="text-[10px] font-black text-azure uppercase tracking-widest">{formData.slug || 'PENDING PUBLICATION'}</p>
          </div>
        </div>
        <button type="submit" disabled={loading} className="azure-gradient text-white px-10 py-5 rounded-[2.5rem] font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl transition-all shadow-azure/20 disabled:opacity-50 active:scale-95">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {tourId ? 'Push Update' : 'Publish Live'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar same... */}
        <div className="lg:col-span-1 space-y-3">
           {[
             { id: 'general', label: 'Basics & Settings', icon: LayoutGrid },
             { id: 'details', label: 'Route & Features', icon: Layers },
             { id: 'itinerary', label: 'Day Timeline', icon: MapPin },
             { id: 'media', label: 'Media Lab', icon: ImageIcon },
           ].map(tab => (
             <button
               key={tab.id}
               type="button"
               onClick={() => setActiveTab(tab.id)}
               className={`w-full flex items-center justify-between px-6 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all ${
                 activeTab === tab.id 
                  ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/20 translate-x-2' 
                  : 'bg-white dark:bg-slate-800 text-slate-400 hover:bg-slate-100'
               }`}
             >
               <span className="flex items-center gap-3"><tab.icon size={18} /> {tab.label}</span>
               {activeTab === tab.id && <div className="w-2 h-2 rounded-full bg-azure"></div>}
             </button>
           ))}
        </div>

        <div className="lg:col-span-3 space-y-8 animate-in slide-in-from-right-10 duration-500">
           
           {activeTab === 'general' && (
             <div className="bg-white dark:bg-slate-800 p-10 rounded-[4rem] border border-border shadow-soft space-y-10">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Experience Slug (URL Unique)</label>
                    <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full px-6 py-5 bg-slate-50 dark:bg-slate-900 border-none rounded-3xl outline-none font-black text-xl italic text-azure" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Primary Archetype</label>
                    <select value={formData.tour_type} onChange={e => setFormData({...formData, tour_type: e.target.value})} className="w-full px-6 py-5 bg-slate-50 dark:bg-slate-900 border-none rounded-3xl outline-none font-black text-xs uppercase tracking-widest text-gold italic cursor-pointer">
                      <option value="cultural">🏛️ Cultural Legacy</option>
                      <option value="adventure">🏔️ Wild Adventure</option>
                      <option value="luxury">👑 Premium Luxury</option>
                      <option value="gastronomic">🍽️ Gastronomic Journey</option>
                    </select>
                  </div>
               </div>

               <div className="space-y-6">
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2 mb-6">
                    <Globe size={18} className="text-azure" /> 4-Language Content Resolution
                  </h3>
                  <LangSwitcher />
                  
                  <div className="grid grid-cols-1 gap-6">
                     <div className="space-y-4">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1 tracking-tight">Experience Title ({langTab})</label>
                           <input 
                             required
                             type="text" 
                             value={formData[langTab === 'es' ? 'title' : `title_${langTab}`]} 
                             onChange={e => setFormData({...formData, [langTab === 'es' ? 'title' : `title_${langTab}`]: e.target.value})}
                             className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-900 border-none rounded-[2rem] outline-none font-black text-2xl md:text-3xl italic tracking-tighter uppercase"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1 tracking-tight">Executive Summary ({langTab})</label>
                           <textarea 
                             rows={3}
                             value={formData[langTab === 'es' ? 'subtitle' : `subtitle_${langTab}`]} 
                             onChange={e => setFormData({...formData, [langTab === 'es' ? 'subtitle' : `subtitle_${langTab}`]: e.target.value})}
                             className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-900 border-none rounded-[2rem] outline-none font-bold text-lg leading-relaxed italic"
                           />
                        </div>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8 border-t border-dashed border-border/50">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><DollarSign size={14} /> Price Base</label>
                    <input type="number" value={formData.price_usd} onChange={e => setFormData({...formData, price_usd: parseInt(e.target.value)})} className="w-full px-6 py-5 bg-slate-50 dark:bg-slate-900 border-none rounded-3xl outline-none font-black text-3xl text-azure italic" />
                  </div>
                  <div className="space-y-2 md:col-span-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Clock size={14} /> Duration Lab</label>
                    <div className="flex items-center gap-4 py-4 bg-slate-100 dark:bg-slate-900/50 rounded-3xl px-6">
                       <input type="number" value={formData.duration_days} onChange={e => setFormData({...formData, duration_days: parseInt(e.target.value)})} className="w-12 bg-transparent text-center font-black text-xl" />
                       <span className="text-[8px] font-bold text-slate-400">D</span>
                       <div className="w-px h-8 bg-slate-200"></div>
                       <input type="number" value={formData.nights_count} onChange={e => setFormData({...formData, nights_count: parseInt(e.target.value)})} className="w-12 bg-transparent text-center font-black text-xl" />
                       <span className="text-[8px] font-bold text-slate-400">N</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-center">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Stars</label>
                    <div className="flex items-center justify-center gap-1 py-5">
                       {[1,2,3,4,5].map(s => (
                         <button key={s} type="button" onClick={() => setFormData({...formData, stars_rating: s})} className="transition-transform active:scale-95">
                           <Star size={20} className={`${s <= formData.stars_rating ? 'fill-gold text-gold' : 'text-slate-100'}`} />
                         </button>
                       ))}
                    </div>
                  </div>
                  <div className="space-y-6 pt-5">
                     <label className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 border border-transparent rounded-[2rem] cursor-pointer hover:border-azure transition-all">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Featured</span>
                        <input type="checkbox" checked={formData.is_featured} onChange={e => setFormData({...formData, is_featured: e.target.checked})} className="accent-azure w-5 h-5" />
                     </label>
                     <label className="flex items-center justify-between p-4 bg-rose-50 border border-transparent rounded-[2rem] cursor-pointer hover:border-rose-500 transition-all">
                        <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Hot Deal</span>
                        <input type="checkbox" checked={formData.is_hot_deal} onChange={e => setFormData({...formData, is_hot_deal: e.target.checked})} className="accent-rose-500 w-5 h-5" />
                     </label>
                  </div>
               </div>

               <div className="pt-10 border-t border-dashed border-border/50 space-y-8">
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2">
                    <DollarSign size={18} className="text-gold" /> Pricing Strategy & Tactical Overrides
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Child Discount (%)</label>
                        <input type="number" value={formData.child_discount_pct} onChange={e => setFormData({...formData, child_discount_pct: parseInt(e.target.value)})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl outline-none font-black text-xl text-gold italic" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Visa Support ($)</label>
                        <input type="number" value={formData.addon_prices_js?.visa} onChange={e => setFormData({...formData, addon_prices_js: {...formData.addon_prices_js, visa: parseInt(e.target.value)}})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl outline-none font-bold text-lg" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Transport ($)</label>
                        <input type="number" value={formData.addon_prices_js?.transport} onChange={e => setFormData({...formData, addon_prices_js: {...formData.addon_prices_js, transport: parseInt(e.target.value)}})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl outline-none font-bold text-lg" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Professional Guide ($)</label>
                        <input type="number" value={formData.addon_prices_js?.guide} onChange={e => setFormData({...formData, addon_prices_js: {...formData.addon_prices_js, guide: parseInt(e.target.value)}})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl outline-none font-bold text-lg" />
                     </div>
                  </div>
               </div>
             </div>
           )}

           {activeTab === 'details' && (
             <div className="space-y-10 animate-in fade-in duration-500">
                <div className="bg-white dark:bg-slate-800 p-10 rounded-[4rem] border border-border">
                   <h2 className="text-xl font-black mb-10 flex items-center gap-4 italic uppercase tracking-tighter">
                      <MapPin className="w-8 h-8 text-azure" /> Strategic Route ({langTab})
                   </h2>
                   <LangSwitcher />
                   <div className="space-y-8">
                     <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Insert Strategic Waypoint</label>
                           <input id="city-input" type="text" className="w-full px-6 py-5 bg-slate-50 dark:bg-slate-900 border-none rounded-3xl outline-none font-bold" placeholder="e.g. Samarkand..." />
                        </div>
                        <button type="button" onClick={() => {
                           const input = document.getElementById('city-input') as HTMLInputElement;
                           addListItem(langTab === 'es' ? 'cities_js' : `cities_${langTab}_js`, input.value);
                           input.value = '';
                        }} className="px-10 py-5 azure-gradient text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-lg shadow-azure/20 active:scale-95 transition-all">Add Waypoint</button>
                     </div>
                     <div className="flex flex-wrap gap-4 pt-4">
                        {(formData[langTab === 'es' ? 'cities_js' : `cities_${langTab}_js`] || []).map((city: string, i: number) => (
                           <div key={i} className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-4 group">
                              {city}
                              <div className="w-px h-4 bg-white/20"></div>
                              <button type="button" onClick={() => removeListItem(langTab === 'es' ? 'cities_js' : `cities_${langTab}_js`, i)} className="text-rose-400 hover:text-rose-600 transition-colors"><Trash2 size={14} /></button>
                           </div>
                        ))}
                     </div>
                   </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-10 rounded-[4rem] border border-border">
                   <h2 className="text-xl font-black mb-10 flex items-center gap-4 italic uppercase tracking-tighter">
                      <Star className="w-8 h-8 text-gold" /> Experience Highlights ({langTab})
                   </h2>
                   <LangSwitcher />
                   <div className="space-y-8">
                     <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Strategic Advantage</label>
                           <input id="hg-input" type="text" className="w-full px-6 py-5 bg-slate-50 dark:bg-slate-900 border-none rounded-3xl outline-none font-bold italic" placeholder="e.g. Luxury 5-star hotel..." />
                        </div>
                        <button type="button" onClick={() => {
                           const input = document.getElementById('hg-input') as HTMLInputElement;
                           addListItem(langTab === 'es' ? 'highlights_js' : `highlights_${langTab}_js`, input.value);
                           input.value = '';
                        }} className="px-10 py-5 bg-gold text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-lg shadow-gold/20 active:scale-95 transition-all">Add Highlight</button>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(formData[langTab === 'es' ? 'highlights_js' : `highlights_${langTab}_js`] || []).map((h: string, i: number) => (
                           <div key={i} className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-100 rounded-[2rem] flex items-center justify-between group hover:border-azure transition-all">
                              <span className="text-sm font-bold italic">{h}</span>
                              <button type="button" onClick={() => removeListItem(langTab === 'es' ? 'highlights_js' : `highlights_${langTab}_js`, i)} className="text-rose-400 p-2 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={16} /></button>
                           </div>
                        ))}
                     </div>
                   </div>
                </div>
             </div>
           )}

           {activeTab === 'itinerary' && (
             <div className="space-y-10 animate-in fade-in duration-500 pb-20">
                <LangSwitcher />
                {itinerary.map((day, idx) => (
                  <div key={idx} className="bg-white dark:bg-slate-800 p-12 rounded-[4rem] border border-border shadow-soft relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-12 text-slate-100 dark:text-slate-700 pointer-events-none font-black text-[120px] leading-none select-none">0{idx+1}</div>
                     <div className="flex items-center gap-6 mb-12 relative z-10">
                        <div className="w-16 h-16 rounded-[2rem] azure-gradient text-white flex items-center justify-center font-black text-2xl shadow-xl shadow-azure/20">
                           {idx + 1}
                        </div>
                        <h3 className="text-3xl font-black italic uppercase tracking-tighter">Timeline Entry {idx+1}</h3>
                        <button type="button" onClick={() => removeItineraryDay(idx)} className="ml-auto p-4 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"><Trash2 size={24} /></button>
                     </div>

                     <div className="grid grid-cols-1 gap-10 relative z-10">
                        <div className="grid grid-cols-1 gap-6">
                           <div className="space-y-3">
                             <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Primary Heading ({langTab})</label>
                             <input 
                               type="text" 
                               value={day[langTab === 'es' ? 'title' : `title_${langTab}`]} 
                               onChange={e => updateItineraryItem(idx, langTab === 'es' ? 'title' : `title_${langTab}`, e.target.value)}
                               className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-900 border-none rounded-[2rem] font-black text-xl italic uppercase"
                             />
                           </div>
                           <div className="space-y-3">
                             <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Operational Description ({langTab})</label>
                             <textarea 
                               rows={4}
                               value={day[langTab === 'es' ? 'description' : `description_${langTab}`]} 
                               onChange={e => updateItineraryItem(idx, langTab === 'es' ? 'description' : `description_${langTab}`, e.target.value)}
                               className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-900 border-none rounded-[2rem] font-bold text-lg italic leading-relaxed"
                             />
                           </div>
                        </div>
                        <div className="pt-8 border-t border-dashed border-border/50">
                           <ImageUpload 
                             defaultValue={day.image_url}
                             onUpload={(url) => updateItineraryItem(idx, 'image_url', url)}
                             label={`Asset Mapping: Milestone 0${idx+1}`}
                             bucket="images"
                           />
                        </div>
                     </div>
                  </div>
                ))}

                <button 
                  type="button" 
                  onClick={addItineraryDay}
                  className="w-full p-20 rounded-[5rem] border-4 border-dashed border-slate-200 dark:border-slate-800 text-slate-300 hover:text-azure hover:border-azure transition-all font-black text-2xl uppercase tracking-widest flex flex-col items-center justify-center gap-6 group bg-white/50"
                >
                   <div className="w-20 h-20 rounded-[2.5rem] bg-slate-100 dark:bg-slate-900 flex items-center justify-center group-hover:bg-azure group-hover:text-white transition-all shadow-xl">
                      <Plus size={40} />
                   </div>
                   Strategic Milestone {itinerary.length + 1}
                </button>
             </div>
           )}

           {activeTab === 'media' && (
             <div className="space-y-8 animate-in fade-in duration-500 pb-20">
                <div className="bg-white dark:bg-slate-800 p-12 rounded-[4rem] border border-border shadow-soft">
                   <h2 className="text-xl font-black mb-10 flex items-center gap-4 italic uppercase tracking-tighter text-azure">
                      <ImageIcon className="w-8 h-8" /> Hero Archetype Asset
                   </h2>
                   <div className="space-y-6">
                      <ImageUpload 
                        defaultValue={formData.image_url}
                        onUpload={(url) => setFormData({...formData, image_url: url})}
                        label="Primary Promotional Asset (High-Res)"
                        bucket="images"
                      />
                   </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-12 rounded-[4rem] border border-border shadow-soft">
                   <h2 className="text-xl font-black mb-10 flex items-center gap-4 italic uppercase tracking-tighter text-gold">
                      <LayoutGrid className="w-8 h-8" /> Sequential Narrative Gallery
                   </h2>
                   <div className="space-y-10">
                      <GalleryUpload 
                        defaultValues={formData.gallery}
                        onUpload={(urls) => setFormData({...formData, gallery: urls})}
                        bucket="images"
                      />
                   </div>
                </div>
             </div>
           )}

        </div>
      </div>
    </form>
  );
}

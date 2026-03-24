'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Plus, Layers, Edit2, Trash2, CheckCircle, 
  XCircle, Loader2, Save, Trash, Map, Hotel, 
  Car, Utensils, Headset, ShieldCheck, Palette, 
  GripVertical, Globe, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ICON_OPTIONS = [
  { name: 'Map', icon: Map },
  { name: 'Hotel', icon: Hotel },
  { name: 'Car', icon: Car },
  { name: 'Utensils', icon: Utensils },
  { name: 'Headset', icon: Headset },
  { name: 'ShieldCheck', icon: ShieldCheck },
];

const ICON_MAP: Record<string, any> = {
  Map,
  Hotel,
  Car,
  Utensils,
  Headset,
  ShieldCheck,
};

const THEME_OPTIONS = [
  { id: 'blue', label: 'Azure Sky', color: 'bg-azure' },
  { id: 'gold', label: 'Silk Gold', color: 'bg-gold' },
  { id: 'pearl', label: 'Desert Pearl', color: 'bg-pearl-warm' },
];

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    icon_name: 'Map',
    color_theme: 'blue',
    title_en: '',
    title_es: '',
    title_ru: '',
    title_uz: '',
    desc_en: '',
    desc_es: '',
    desc_ru: '',
    desc_uz: '',
    order_index: 0
  });

  async function fetchServices() {
    setLoading(true);
    const { data } = await supabase.from('site_services').select('*').order('order_index', { ascending: true });
    if (data) setServices(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (editingId) {
      await supabase.from('site_services').update(formData).eq('id', editingId);
    } else {
      await supabase.from('site_services').insert([formData]);
    }
    
    setEditingId(null);
    setIsAdding(false);
    setFormData({
      icon_name: 'Map',
      color_theme: 'blue',
      title_en: '',
      title_es: '',
      title_ru: '',
      title_uz: '',
      desc_en: '',
      desc_es: '',
      desc_ru: '',
      desc_uz: '',
      order_index: services.length
    });
    await fetchServices();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    await supabase.from('site_services').delete().eq('id', id);
    setServices(services.filter((s: any) => s.id !== id));
  };

  const startEdit = (service: any) => {
    setFormData({
      ...service,
      title_en: service.title_en || '',
      title_es: service.title_es || '',
      title_ru: service.title_ru || '',
      title_uz: service.title_uz || '',
      desc_en: service.desc_en || '',
      desc_es: service.desc_es || '',
      desc_ru: service.desc_ru || '',
      desc_uz: service.desc_uz || '',
    });
    setEditingId(service.id);
    setIsAdding(true);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3 italic uppercase tracking-tighter">
             <Layers className="w-6 h-6 text-azure" />
             Bento Ecosystem
          </h1>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-0.5 mt-0.5">Strategic Service Lab</p>
        </div>
        <button 
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
            setFormData({
              icon_name: 'Map',
              color_theme: 'blue',
              title_en: '',
              title_es: '',
              title_ru: '',
              title_uz: '',
              desc_en: '',
              desc_es: '',
              desc_ru: '',
              desc_uz: '',
              order_index: services.length
            });
          }}
          className="azure-gradient text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-azure/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          <Plus size={14} /> Add Module
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-border shadow-soft"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1.5">Iconography</label>
                        <div className="grid grid-cols-6 gap-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                           {ICON_OPTIONS.map(opt => (
                              <button 
                                key={opt.name}
                                type="button" 
                                onClick={() => setFormData({...formData, icon_name: opt.name})}
                                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${formData.icon_name === opt.name ? 'azure-gradient text-white shadow-lg' : 'text-slate-400 hover:bg-white dark:hover:bg-slate-800'}`}
                              >
                                 <opt.icon size={16} />
                              </button>
                           ))}
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1.5">Architectural Theme</label>
                        <div className="grid grid-cols-3 gap-2">
                           {THEME_OPTIONS.map(opt => (
                              <button 
                                key={opt.id}
                                type="button" 
                                onClick={() => setFormData({...formData, color_theme: opt.id})}
                                className={`py-2 rounded-xl font-black text-[8px] uppercase tracking-widest transition-all border-2 ${formData.color_theme === opt.id ? 'border-azure bg-azure/5 text-azure' : 'border-transparent bg-slate-50 dark:bg-slate-900 text-slate-400'}`}
                              >
                                 <div className={`w-2 h-2 rounded-full ${opt.color} mx-auto mb-1.5`}></div>
                                 {opt.label}
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1.5 flex items-center gap-2">
                           <Globe size={11} className="text-azure" /> EN Narrative
                        </label>
                        <input type="text" required value={formData.title_en || ''} onChange={e => setFormData({...formData, title_en: e.target.value})} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl font-bold italic text-sm" placeholder="Title (EN)" />
                        <textarea rows={2} value={formData.desc_en || ''} onChange={e => setFormData({...formData, desc_en: e.target.value})} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl font-medium italic resize-none text-xs" placeholder="Desc (EN)" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1.5 flex items-center gap-2">
                           <Globe size={11} className="text-gold" /> ES Narrative
                        </label>
                        <input type="text" required value={formData.title_es || ''} onChange={e => setFormData({...formData, title_es: e.target.value})} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl font-bold italic text-sm" placeholder="Título (ES)" />
                        <textarea rows={2} value={formData.desc_es || ''} onChange={e => setFormData({...formData, desc_es: e.target.value})} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl font-medium italic resize-none text-xs" placeholder="Desc (ES)" />
                     </div>
                  </div>
               </div>

               <div className="flex items-center justify-end gap-4 pt-6 border-t border-dashed border-border">
                  <button type="button" onClick={() => setIsAdding(false)} className="px-8 py-3.5 bg-slate-100 dark:bg-slate-700 text-slate-500 rounded-xl font-black text-[9px] uppercase tracking-widest">Cancel</button>
                  <button type="submit" className="px-10 py-3.5 azure-gradient text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-xl flex items-center gap-2 active:scale-95 transition-all">
                    <Save size={16} /> {editingId ? 'Push Update' : 'Initialize'}
                  </button>
               </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-azure" /></div>
        ) : (
          services.map((service: any, i: number) => {
             const Icon = ICON_MAP[service.icon_name] || Map;
             const theme = THEME_OPTIONS.find(t => t.id === service.color_theme);
             
             return (
               <motion.div 
                 layout
                 key={service.id}
                 initial={{ opacity: 0, scale: 0.98 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="bg-white dark:bg-slate-800 rounded-[2rem] border border-border shadow-soft group relative overflow-hidden flex flex-col h-[320px]"
               >
                  <div className="p-6 flex flex-col h-full">
                     <div className="flex items-center justify-between mb-6">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${theme?.color || 'bg-slate-100'} text-white shadow-xl group-hover:scale-110 transition-transform`}>
                           <Icon size={24} />
                        </div>
                        <div className="flex items-center gap-2">
                           <button onClick={() => startEdit(service)} className="p-3 bg-slate-50 dark:bg-slate-700 text-slate-400 hover:bg-gold hover:text-white rounded-xl transition-all"><Edit2 size={14} /></button>
                           <button onClick={() => handleDelete(service.id)} className="p-3 bg-rose-50 dark:bg-rose-900/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all"><Trash2 size={14} /></button>
                        </div>
                     </div>

                     <div className="space-y-2">
                        <h3 className="font-black text-lg italic uppercase tracking-tighter text-slate-900 dark:text-white leading-tight">{service.title_en}</h3>
                        <p className="text-[11px] font-bold text-slate-400 italic leading-relaxed line-clamp-3 uppercase tracking-tight">{service.desc_en}</p>
                     </div>

                     <div className="mt-auto pt-4 border-t border-dashed border-border flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                           <div className={`w-1.5 h-1.5 rounded-full ${theme?.color}`}></div>
                           <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">{theme?.label}</span>
                        </div>
                        <span className="text-[8px] font-black uppercase text-slate-300 tracking-widest italic">Idx: {service.order_index}</span>
                     </div>
                  </div>
               </motion.div>
             );
          })
        )}
      </div>
    </div>
  );
}

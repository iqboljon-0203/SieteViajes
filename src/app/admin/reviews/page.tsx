'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Plus, Search, Edit2, Trash2, CheckCircle, 
  XCircle, Star, Quote, Loader2, Save, 
  Trash, MessageSquare, MapPin, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageUpload } from '@/components/admin/ImageUpload';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    rating: 5,
    text_en: '',
    text_es: '',
    text_ru: '',
    text_uz: '',
    avatar_url: '',
    is_active: true
  });

  async function fetchReviews() {
    setLoading(true);
    const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
    if (data) setReviews(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (editingId) {
      await supabase.from('reviews').update(formData).eq('id', editingId);
    } else {
      await supabase.from('reviews').insert([formData]);
    }
    
    setEditingId(null);
    setIsAdding(false);
    setFormData({ name: '', country: '', rating: 5, text_en: '', text_es: '', text_ru: '', text_uz: '', avatar_url: '', is_active: true });
    await fetchReviews();
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    await supabase.from('reviews').update({ is_active: !current }).eq('id', id);
    setReviews(reviews.map(r => r.id === id ? { ...r, is_active: !current } : r));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    await supabase.from('reviews').delete().eq('id', id);
    setReviews(reviews.filter(r => r.id !== id));
  };

  const startEdit = (review: any) => {
    setFormData(review);
    setEditingId(review.id);
    setIsAdding(true);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3 italic uppercase tracking-tighter">
             <Quote className="w-6 h-6 text-azure" strokeWidth={3} />
             Traveler Reviews
          </h1>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1 mt-0.5">Manage social proof testimonials</p>
        </div>
        <button 
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
            setFormData({ name: '', country: '', rating: 5, text_en: '', text_es: '', text_ru: '', text_uz: '', avatar_url: '', is_active: true });
          }}
          className="azure-gradient text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-2xl shadow-azure/20 hover:scale-105 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Review
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-border shadow-soft"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="md:col-span-1">
                     <ImageUpload 
                       defaultValue={formData.avatar_url}
                       onUpload={(url) => setFormData({...formData, avatar_url: url})}
                       label="Portrait"
                       bucket="images"
                     />
                  </div>
                  <div className="md:col-span-3 space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                           <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1">Traveler Name</label>
                           <input 
                              required
                              type="text" 
                              value={formData.name}
                              onChange={e => setFormData({...formData, name: e.target.value})}
                              className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900 border-none rounded-xl font-bold text-sm italic"
                              placeholder="e.g. Maria Gonzalez"
                           />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1">Country</label>
                           <input 
                              type="text" 
                              value={formData.country}
                              onChange={e => setFormData({...formData, country: e.target.value})}
                              className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900 border-none rounded-xl font-bold text-sm italic"
                              placeholder="e.g. Mexico"
                           />
                        </div>
                     </div>
                     <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1">Rating</label>
                        <div className="flex items-center gap-2 py-3 bg-slate-50 dark:bg-slate-900 w-fit px-6 rounded-xl">
                           {[1,2,3,4,5].map(s => (
                              <button key={s} type="button" onClick={() => setFormData({...formData, rating: s})}>
                                 <Star className={`w-5 h-5 ${s <= formData.rating ? 'fill-gold text-gold' : 'text-slate-200'} transition-all hover:scale-110`} />
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-1">
                     <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1 flex items-center gap-2">
                        <Globe className="w-2.5 h-2.5 text-gold" /> ES Comment
                     </label>
                     <textarea 
                       required
                       rows={3}
                       value={formData.text_es}
                       onChange={e => setFormData({...formData, text_es: e.target.value})}
                       className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border-none rounded-[1.5rem] font-bold italic resize-none leading-relaxed text-[10px]"
                       placeholder="En español..."
                     />
                  </div>
                  <div className="space-y-1">
                     <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1 flex items-center gap-2">
                        <Globe className="w-2.5 h-2.5 text-azure" /> EN Comment
                     </label>
                     <textarea 
                       required
                       rows={3}
                       value={formData.text_en}
                       onChange={e => setFormData({...formData, text_en: e.target.value})}
                       className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border-none rounded-[1.5rem] font-bold italic resize-none leading-relaxed text-[10px]"
                       placeholder="In English..."
                     />
                  </div>
                  <div className="space-y-1">
                     <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1 flex items-center gap-2">
                        <Globe className="w-2.5 h-2.5 text-orange-400" /> RU Comment
                     </label>
                     <textarea 
                       rows={3}
                       value={formData.text_ru}
                       onChange={e => setFormData({...formData, text_ru: e.target.value})}
                       className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border-none rounded-[1.5rem] font-bold italic resize-none leading-relaxed text-[10px]"
                       placeholder="На русском..."
                     />
                  </div>
                  <div className="space-y-1">
                     <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1 flex items-center gap-2">
                        <Globe className="w-2.5 h-2.5 text-emerald-400" /> UZ Comment
                     </label>
                     <textarea 
                       rows={3}
                       value={formData.text_uz}
                       onChange={e => setFormData({...formData, text_uz: e.target.value})}
                       className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border-none rounded-[1.5rem] font-bold italic resize-none leading-relaxed text-[10px]"
                       placeholder="O'zbek tilida..."
                     />
                  </div>
               </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-dashed border-border/50">
                  <button 
                    type="button" 
                    onClick={() => setIsAdding(false)}
                    className="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-500 rounded-xl font-black text-[9px] uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-8 py-3 azure-gradient text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-xl flex items-center gap-2 active:scale-95 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    {editingId ? 'Update' : 'Publish'}
                  </button>
               </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      {loading && !isAdding ? (
        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-azure" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {reviews.map((review) => (
             <motion.div 
               layout
               key={review.id} 
               className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-border shadow-soft group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden relative"
             >
                <div className="p-6">
                   <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border-2 border-white dark:border-slate-800 shadow-xl shadow-azure/10">
                             {review.avatar_url ? (
                               <img src={review.avatar_url} className="w-full h-full object-cover" alt={review.name} />
                             ) : (
                               <div className="w-full h-full azure-gradient flex items-center justify-center text-white font-black text-xl italic uppercase">
                                  {review.name.charAt(0)}
                               </div>
                             )}
                          </div>
                          <div>
                             <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter italic text-base leading-none mb-1">{review.name}</h3>
                             <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase tracking-widest italic group-hover:text-azure transition-colors">
                                <MapPin className="w-3 h-3 text-azure" /> {review.country}
                             </div>
                          </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                         {[...Array(5)].map((_, i) => (
                           <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-gold text-gold' : 'text-slate-100'}`} />
                         ))}
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-2 mb-6">
                      <div className="p-2.5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-transparent hover:border-azure/20 transition-all group/es">
                         <span className="text-[6px] font-black text-gold/40 tracking-[0.3em] block mb-1 italic uppercase">ES</span>
                         <p className="text-[9px] font-black text-slate-600 dark:text-slate-400 line-clamp-1 italic leading-tight group-hover/es:line-clamp-none transition-all uppercase tracking-tight">"{review.text_es}"</p>
                      </div>
                      <div className="p-2.5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-transparent hover:border-gold/20 transition-all group/en">
                         <span className="text-[6px] font-black text-azure/40 tracking-[0.3em] block mb-1 italic uppercase">EN</span>
                         <p className="text-[9px] font-black text-slate-600 dark:text-slate-400 line-clamp-1 italic leading-tight group-hover/en:line-clamp-none transition-all uppercase tracking-tight">"{review.text_en}"</p>
                      </div>
                      <div className="p-2.5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-transparent hover:border-orange-400/20 transition-all group/ru">
                         <span className="text-[6px] font-black text-orange-400/40 tracking-[0.3em] block mb-1 italic uppercase">RU</span>
                         <p className="text-[9px] font-black text-slate-600 dark:text-slate-400 line-clamp-1 italic leading-tight group-hover/ru:line-clamp-none transition-all uppercase tracking-tight">"{review.text_ru || 'No translation'}"</p>
                      </div>
                      <div className="p-2.5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-transparent hover:border-emerald-400/20 transition-all group/uz">
                         <span className="text-[6px] font-black text-emerald-400/40 tracking-[0.3em] block mb-1 italic uppercase">UZ</span>
                         <p className="text-[9px] font-black text-slate-600 dark:text-slate-400 line-clamp-1 italic leading-tight group-hover/uz:line-clamp-none transition-all uppercase tracking-tight">"{review.text_uz || 'Tarjima yo\'q'}"</p>
                      </div>
                   </div>

                   <div className="flex items-center justify-between border-t border-dashed border-border/50 pt-4">
                      <div className="flex items-center gap-3">
                         <button 
                           onClick={() => handleToggleActive(review.id, review.is_active)}
                           className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shadow-xl ${
                             review.is_active 
                               ? 'azure-gradient text-white ring-2 ring-azure/10' 
                               : 'bg-slate-100 dark:bg-slate-900 text-slate-400'
                           }`}
                         >
                            {review.is_active ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                         </button>
                      </div>
                      <div className="flex items-center gap-2">
                         <button 
                           onClick={() => startEdit(review)}
                           className="w-9 h-9 bg-white dark:bg-slate-700 text-slate-400 hover:bg-gold hover:text-white rounded-xl transition-all shadow-soft flex items-center justify-center active:scale-90"
                         >
                            <Edit2 size={14} />
                         </button>
                         <button 
                           onClick={() => handleDelete(review.id)}
                           className="w-9 h-9 bg-white dark:bg-slate-700 text-rose-300 hover:bg-rose-500 hover:text-white rounded-xl transition-all shadow-soft flex items-center justify-center active:scale-90"
                         >
                            <Trash2 size={14} />
                         </button>
                      </div>
                   </div>
                </div>
             </motion.div>
           ))}
        </div>
      )}
    </div>
  );
}

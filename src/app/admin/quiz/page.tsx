'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Plus, HelpCircle, Edit2, Trash2, CheckCircle, 
  Save, Trash, Globe, LayoutGrid, ChevronRight, 
  ChevronDown, ChevronUp, Loader2, Sparkles, LayoutList,
  Target, Info, ArrowRight, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminQuizPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    question_en: '',
    question_es: '',
    question_ru: '',
    question_uz: '',
    order_index: 0,
    options_js: [
      { text_en: '', text_es: '', text_ru: '', text_uz: '', score_tag: 'culture' },
      { text_en: '', text_es: '', text_ru: '', text_uz: '', score_tag: 'nature' }
    ]
  });

  async function fetchQuestions() {
    setLoading(true);
    const { data } = await supabase.from('quiz_questions').select('*').order('order_index', { ascending: true });
    if (data) setQuestions(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (editingId) {
      await supabase.from('quiz_questions').update(formData).eq('id', editingId);
    } else {
      await supabase.from('quiz_questions').insert([formData]);
    }
    
    setEditingId(null);
    setIsAdding(false);
    setFormData({ 
      question_en: '', question_es: '', question_ru: '', question_uz: '', 
      order_index: questions.length, 
      options_js: [ 
        { text_en: '', text_es: '', text_ru: '', text_uz: '', score_tag: 'culture' }, 
        { text_en: '', text_es: '', text_ru: '', text_uz: '', score_tag: 'nature' } 
      ] 
    });
    await fetchQuestions();
  };

  const handleUpdateOption = (idx: number, field: string, value: string) => {
    const newOptions = [...formData.options_js];
    newOptions[idx] = { ...newOptions[idx], [field]: value };
    setFormData({ ...formData, options_js: newOptions });
  };

  const addOption = () => {
    setFormData({ 
      ...formData, 
      options_js: [...formData.options_js, { text_en: '', text_es: '', text_ru: '', text_uz: '', score_tag: 'culture' }] 
    });
  };

  const removeOption = (idx: number) => {
    if (formData.options_js.length <= 2) {
      alert('A quiz question must have at least 2 variants.');
      return;
    }
    setFormData({ 
      ...formData, 
      options_js: formData.options_js.filter((_, i) => i !== idx) 
    });
  };

  const startEdit = (q: any) => {
    setFormData(q);
    setEditingId(q.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quiz question?')) return;
    await supabase.from('quiz_questions').delete().eq('id', id);
    setQuestions(questions.filter(q => q.id !== id));
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3 italic uppercase tracking-tighter">
             <HelpCircle className="w-6 h-6 text-azure" />
             AI Discovery Logic
          </h1>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mt-0.5 pl-0.5">Strategic Configuration Hub</p>
        </div>
        <button 
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
            setFormData({ 
              question_en: '', question_es: '', question_ru: '', question_uz: '', 
              order_index: questions.length, 
              options_js: [ { text_en: '', text_es: '', text_ru: '', text_uz: '', score_tag: 'culture' }, { text_en: '', text_es: '', text_ru: '', text_uz: '', score_tag: 'nature' } ] 
            });
          }}
          className="azure-gradient text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-2xl shadow-azure/20 hover:scale-105 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Question Module
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-border shadow-soft relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none -rotate-12">
               <Sparkles size={80} />
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1.5">Primary Spanish Directive</label>
                      <input required type="text" value={formData.question_es} onChange={e => setFormData({...formData, question_es: e.target.value})} className="w-full px-6 py-3.5 bg-slate-50 dark:bg-slate-900 border-none rounded-xl font-black text-lg italic tracking-tight" placeholder="¿Qué tipo de viaje prefieres?" />
                    </div>
                    <div className="space-y-1.5 text-right">
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pr-1.5">English Narrative Blueprint</label>
                      <input required type="text" value={formData.question_en} onChange={e => setFormData({...formData, question_en: e.target.value})} className="w-full px-6 py-3.5 bg-slate-50 dark:bg-slate-900 border-none rounded-xl font-black text-lg italic tracking-tight" placeholder="What type of trip do you prefer?" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                       <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1.5">Eastern (RU) Localization</label>
                       <input type="text" value={formData.question_ru} onChange={e => setFormData({...formData, question_ru: e.target.value})} className="w-full px-6 py-3.5 bg-slate-50 dark:bg-slate-900 border-none rounded-xl font-bold text-sm italic" placeholder="Заголовок вопроса (RU)" />
                    </div>
                    <div className="space-y-1.5 text-right">
                       <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pr-1.5">Local (UZ) Identification</label>
                       <input type="text" value={formData.question_uz} onChange={e => setFormData({...formData, question_uz: e.target.value})} className="w-full px-6 py-3.5 bg-slate-50 dark:bg-slate-900 border-none rounded-xl font-bold text-sm italic" placeholder="Savol sarlavhasi (UZ)" />
                    </div>
                  </div>
               </div>

               {/* Options Editor */}
               <div className="space-y-4 bg-slate-50/50 dark:bg-slate-900/50 p-6 rounded-[2rem] border border-border/50">
                  <div className="flex items-center justify-between px-1 mb-2">
                     <div>
                        <h3 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-widest flex items-center gap-2">
                           <LayoutList className="w-4 h-4 text-azure" /> Variant Configuration
                        </h3>
                     </div>
                     <button type="button" onClick={addOption} className="azure-gradient text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-1.5">
                        <Plus size={14} /> Variant
                     </button>
                  </div>

                  <div className="space-y-4">
                     {formData.options_js.map((opt, idx) => (
                       <div key={idx} className="bg-white dark:bg-slate-800 p-5 rounded-[1.5rem] border border-border shadow-soft flex flex-col gap-4 relative group/opt transition-all hover:shadow-xl">
                          <div className="w-8 h-8 rounded-lg bg-azure/10 text-azure flex items-center justify-center font-black absolute -left-4 top-1/2 -translate-y-1/2 shadow-lg border-2 border-white dark:border-slate-800 z-10 text-xs">{idx+1}</div>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                             <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                   <label className="text-[7px] font-black uppercase text-slate-400 pl-1">ES Variant</label>
                                   <input type="text" value={opt.text_es} onChange={e => handleUpdateOption(idx, 'text_es', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border-none rounded-lg text-xs font-bold italic" placeholder="Respuesta..." required />
                                </div>
                                <div className="space-y-1">
                                   <label className="text-[7px] font-black uppercase text-slate-400 pl-1">EN Variant</label>
                                   <input type="text" value={opt.text_en} onChange={e => handleUpdateOption(idx, 'text_en', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border-none rounded-lg text-xs font-bold italic" placeholder="Response..." required />
                                </div>
                                <div className="space-y-1">
                                   <label className="text-[7px] font-black uppercase text-slate-400 pl-1">RU Variant</label>
                                   <input type="text" value={opt.text_ru} onChange={e => handleUpdateOption(idx, 'text_ru', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border-none rounded-lg text-xs font-bold italic" placeholder="Ответ..." />
                                </div>
                                <div className="space-y-1">
                                   <label className="text-[7px] font-black uppercase text-slate-400 pl-1">UZ Variant</label>
                                   <input type="text" value={opt.text_uz} onChange={e => handleUpdateOption(idx, 'text_uz', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border-none rounded-lg text-xs font-bold italic" placeholder="Javob..." />
                                </div>
                             </div>
                             
                             <div className="space-y-1">
                                <label className="text-[7px] font-black uppercase text-slate-400 pl-1">Alignment</label>
                                <select value={opt.score_tag} onChange={e => handleUpdateOption(idx, 'score_tag', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border-none rounded-lg text-[9px] font-black uppercase italic text-azure h-full min-h-[40px]">
                                   <option value="culture">🏛️ Culture</option>
                                   <option value="nature">🏔️ Nature</option>
                                   <option value="luxury">👑 Luxury</option>
                                   <option value="adventure">🏔️ Adventure</option>
                                   <option value="short">⏳ Essential</option>
                                   <option value="long">🕰️ Immersive</option>
                                </select>
                             </div>
                          </div>

                          <button type="button" onClick={() => removeOption(idx)} className="absolute -right-3 top-1/2 -translate-y-1/2 p-2.5 bg-rose-50 text-rose-500 rounded-xl opacity-0 group-hover/opt:opacity-100 transition-all hover:scale-110 shadow-lg hover:bg-rose-500 hover:text-white"><Trash2 size={16} /></button>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="flex items-center justify-end gap-4 pt-6 border-t border-dashed border-border/50">
                  <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-3.5 bg-slate-100 dark:bg-slate-700 text-slate-500 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all">Cancel</button>
                  <button type="submit" className="px-8 py-3.5 azure-gradient text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-2xl shadow-azure/20 flex items-center gap-2 active:scale-95 transition-all">
                    <Save className="w-4 h-4" />
                    {editingId ? 'Push Update' : 'Initialize Path'}
                  </button>
               </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Questions List */}
      <div className="space-y-8 px-4 pb-20">
         {loading && !isAdding ? (
           <div className="flex justify-center py-20 animate-pulse flex-col items-center gap-4">
              <Loader2 className="w-16 h-16 animate-spin text-azure" strokeWidth={1} />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Synchronizing logic...</span>
           </div>
         ) : (
           <>
              {questions.map((q, idx) => (
                <motion.div 
                  layout
                  key={q.id} 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white dark:bg-slate-800 rounded-[2rem] border border-border shadow-soft group hover:shadow-2xl transition-all duration-700 overflow-hidden relative"
                >
                   <div className="p-6 md:p-8 flex flex-col lg:flex-row items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl azure-gradient text-white flex items-center justify-center font-black text-2xl shadow-xl shadow-azure/20 shrink-0 italic translate-y-1 group-hover:translate-y-0 transition-transform duration-700">
                         {idx + 1}
                      </div>
                      
                      <div className="flex-1 space-y-4 text-center lg:text-left">
                         <div>
                            <span className="text-[8px] font-black uppercase text-azure/40 tracking-[0.3em] mb-1 block italic">Directive</span>
                            <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-tight mb-2 italic uppercase tracking-tighter group-hover:text-azure transition-colors duration-500">"{q.question_en}"</h3>
                            <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                               <span className="px-2 py-0.5 bg-slate-50 dark:bg-slate-900 rounded-md text-[7px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">ES: {q.question_es}</span>
                               <span className="px-2 py-0.5 bg-slate-50 dark:bg-slate-900 rounded-md text-[7px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">RU: {q.question_ru || 'Pending'}</span>
                               <span className="px-2 py-0.5 bg-slate-50 dark:bg-slate-900 rounded-md text-[7px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">UZ: {q.question_uz || 'Pending'}</span>
                            </div>
                         </div>
                         
                         <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                            {q.options_js?.map((opt: any, i: number) => (
                              <div key={i} className="px-4 py-2 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-transparent group/variant hover:border-azure/20 transition-all flex items-center gap-3">
                                 <div className="w-6 h-6 rounded-lg azure-gradient flex items-center justify-center text-white scale-90 group-hover/variant:scale-100 transition-all">
                                    <Zap size={10} />
                                 </div>
                                 <div>
                                    <p className="text-[10px] font-black text-slate-700 dark:text-white uppercase tracking-tight italic">{opt.text_en}</p>
                                    <p className="text-[8px] font-black text-azure uppercase tracking-widest">{opt.score_tag}</p>
                                 </div>
                              </div>
                            ))}
                         </div>
                      </div>
   
                      <div className="flex flex-row lg:flex-col gap-2 shrink-0">
                         <button 
                           onClick={() => startEdit(q)}
                           className="w-11 h-11 bg-white dark:bg-slate-700 text-slate-400 hover:bg-gold hover:text-white rounded-xl transition-all shadow-soft flex items-center justify-center group/btn active:scale-90"
                         >
                            <Edit2 size={16} className="group-hover/btn:rotate-12 transition-transform" />
                         </button>
                         <button 
                           onClick={() => handleDelete(q.id)}
                           className="w-11 h-11 bg-white dark:bg-slate-700 text-rose-300 hover:bg-rose-500 hover:text-white rounded-xl transition-all shadow-soft flex items-center justify-center group/btn active:scale-90"
                         >
                            <Trash2 size={16} className="group-hover/btn:scale-110 transition-transform" />
                         </button>
                      </div>
                   </div>
                </motion.div>
              ))}
   
              {questions.length === 0 && (
                <div className="text-center py-40 bg-white dark:bg-slate-800 rounded-[4rem] border-2 border-dashed border-border opacity-50 flex flex-col items-center justify-center gap-6">
                   <div className="w-32 h-32 rounded-[3.5rem] bg-slate-50 flex items-center justify-center text-slate-200">
                      <Target size={64} />
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-2xl font-black italic uppercase tracking-tighter">Awaiting Logic Initialization</h3>
                      <p className="font-bold text-slate-400 max-w-sm mx-auto">Initialize individual discovery segments to orchestrate the AI-assisted pathfinding flow.</p>
                   </div>
                   <button 
                     onClick={() => setIsAdding(true)}
                     className="px-10 py-5 bg-azure text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-azure/20 hover:scale-105 active:scale-95 transition-all"
                   >
                     Deploy Initial Directive
                   </button>
                </div>
              )}
           </>
         )}
      </div>
    </div>
  );
}

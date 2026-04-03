'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Mail, Phone, Calendar, Clock, MapPin, 
  Trash2, CheckCircle, AlertCircle, Search, 
  Filter, Loader2, ArrowRight, MessageSquare,
  Sparkles, Target, Zap, ShieldCheck, XCircle,
  Eye, Download, Share2, Globe, Flag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminInquiriesPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedLead, setSelectedLead] = useState<any | null>(null);

  async function fetchLeads() {
    setLoading(true);
    const { data } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setLeads(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus })
      .eq('id', id);
    
    if (!error) {
      setLeads(leads.map((l: any) => l.id === id ? { ...l, status: newStatus } : l));
      if (selectedLead?.id === id) setSelectedLead({...selectedLead, status: newStatus});
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this mission-critical lead?')) return;
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (!error) {
      setLeads(leads.filter((l: any) => l.id !== id));
      setSelectedLead(null);
    }
  };

  const filteredLeads = leads.filter((l: any) => {
    const matchesSearch = (l.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (l.phone || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (l.tour_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || l.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 animate-in fade-in duration-700">
      {/* Premium Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
           <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-[0.3em]">Operational Ingest</span>
           </div>
           <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3 italic uppercase tracking-tighter leading-none mb-1">
              Discovery Manifest
           </h1>
           <p className="text-slate-500 font-bold italic text-xs pl-0.5">Monitoring traveler potential.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="bg-azure/5 dark:bg-azure/10 border border-azure/20 px-4 py-2 rounded-xl flex flex-col items-end">
              <span className="text-[8px] font-black text-azure uppercase tracking-widest">Velocity</span>
              <span className="text-xl font-black text-slate-900 dark:text-white italic tracking-tighter">{leads.filter((l: any) => l.status === 'new').length} <span className="text-[10px] text-slate-400 italic">NEW</span></span>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
         {/* Sidebar: Lead List */}
         <div className="lg:col-span-12 space-y-4">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-[2rem] border border-border shadow-soft flex flex-col md:flex-row gap-4 items-center">
               <div className="relative flex-1 group w-full">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-azure transition-all duration-500" />
                  <input 
                    type="text"
                    placeholder="Search identity or destination..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-6 py-3 bg-slate-50 dark:bg-slate-900 border-none font-black italic rounded-xl outline-none text-sm transition-all"
                  />
               </div>
               <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center gap-3 border border-transparent hover:border-azure/20 transition-all group">
                     <Filter size={16} className="text-slate-400 group-hover:text-azure" />
                     <select 
                       value={filterStatus}
                       onChange={(e) => setFilterStatus(e.target.value)}
                       className="bg-transparent border-none font-black text-[9px] uppercase tracking-[0.2em] outline-none cursor-pointer text-slate-400"
                     >
                       <option value="all">Global</option>
                       <option value="new">New Ingest</option>
                       <option value="contacted">Active Comms</option>
                       <option value="booked">Success</option>
                       <option value="rejected">Archive</option>
                     </select>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {loading ? (
                  <div className="col-span-full py-20 flex flex-col items-center gap-3">
                     <Loader2 size={32} className="animate-spin text-azure" strokeWidth={1} />
                     <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Hydrating...</span>
                  </div>
               ) : (
                  <>
                    <AnimatePresence mode="popLayout">
                      {filteredLeads.map((lead, idx) => {
                         const isNew = lead.status === 'new';
                         const isBooked = lead.status === 'booked';
                         
                         return (
                           <motion.div 
                             layout
                             key={lead.id}
                             initial={{ opacity: 0, scale: 0.95 }}
                             animate={{ opacity: 1, scale: 1 }}
                             exit={{ opacity: 0, scale: 0.95 }}
                             transition={{ delay: idx * 0.05 }}
                             className={`bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 shadow-soft border border-border group relative overflow-hidden flex flex-col h-full hover:shadow-2xl transition-all duration-700 hover:-translate-y-1 ${isNew ? 'ring-1 ring-azure/20 shadow-xl shadow-azure/5' : ''}`}
                           >
                              {/* New Badge */}
                              {isNew && (
                                <div className="absolute top-0 right-0 p-6 pointer-events-none">
                                   <div className="bg-azure text-white px-2.5 py-1 rounded-lg text-[7px] font-black uppercase tracking-[0.2em] shadow-lg animate-pulse">
                                      NEW
                                   </div>
                                </div>
                              )}

                              <div className="flex items-center gap-4 mb-6">
                                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl italic shadow-xl relative ${isNew ? 'azure-gradient text-white shadow-azure/20' : 'bg-slate-50 dark:bg-slate-900 text-slate-300'}`}>
                                    {lead.name ? lead.name.charAt(0).toUpperCase() : '?'}
                                 </div>
                                 <div className="flex-1">
                                    <div className="flex items-center justify-between mb-0.5">
                                       <h3 className="text-base font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none truncate group-hover:text-azure transition-colors duration-500">{lead.name}</h3>
                                       <div className="flex items-center gap-1 px-1.5 py-0.5 bg-slate-50 dark:bg-slate-900 rounded-md border border-border text-[8px] font-black uppercase text-slate-400">
                                          {lead.locale || 'es'}
                                          {lead.locale === 'es' && '🇪🇸'}
                                          {lead.locale === 'en' && '🇬🇧'}
                                          {lead.locale === 'ru' && '🇷🇺'}
                                          {lead.locale === 'uz' && '🇺🇿'}
                                       </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest italic truncate max-w-[150px]">
                                       <MapPin size={10} className="text-azure" />
                                       {lead.tour_name ? lead.tour_name : 'General Exploration'}
                                    </div>
                                 </div>
                              </div>

                              <div className="space-y-4 mb-6 flex-1">
                                 {/* Primary Contact Ingest */}
                                 <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-transparent group-hover:border-azure/20 transition-all duration-700">
                                    <div className="flex flex-col gap-2">
                                       <p className="flex items-center gap-2 text-[13px] font-black text-slate-700 dark:text-white italic">
                                          <Phone size={14} className="text-azure shrink-0" /> 
                                          {lead.phone}
                                       </p>
                                       {lead.email && (
                                          <p className="flex items-center gap-2 text-[11px] font-medium text-slate-500 dark:text-slate-400 break-all">
                                             <Mail size={12} className="text-gold shrink-0" />
                                             {lead.email}
                                          </p>
                                       )}
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-between text-[8px] font-black uppercase text-slate-400 tracking-widest">
                                       <span>Ingest Date</span>
                                       <span className="text-slate-900 dark:text-white">
                                          {new Date(lead.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                       </span>
                                    </div>
                                 </div>

                                 {/* Discovery Metadata */}
                                 {(lead.message || lead.num_people || lead.type) && (
                                    <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-transparent hover:border-gold/20 transition-all duration-700 space-y-3">
                                       <div className="flex items-center justify-between">
                                          <span className="text-[8px] font-black uppercase text-gold/60 tracking-[0.2em] italic">Payload Manifesto</span>
                                          <span className={`px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-[7px] font-black uppercase tracking-widest border border-border ${
                                             lead.type === 'quiz' ? 'text-purple-500 border-purple-500/20' : 
                                             lead.type === 'tour' ? 'text-azure border-azure/20' : 'text-slate-400'
                                          }`}>
                                             {lead.type || 'contact'}
                                          </span>
                                       </div>
                                       
                                       {lead.num_people && (
                                          <div className="flex items-center gap-2 text-[10px] font-black text-slate-700 dark:text-white uppercase italic">
                                             <Zap size={10} className="text-gold" />
                                             Group: {lead.num_people} {lead.num_people === 1 ? 'Person' : 'People'}
                                          </div>
                                       )}

                                       {lead.message && (
                                          <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-border">
                                             <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed italic line-clamp-3 group-hover:line-clamp-none transition-all duration-500">
                                                "{lead.message}"
                                             </p>
                                          </div>
                                       )}
                                       
                                       {lead.preferences && (
                                          <div className="flex flex-wrap gap-1">
                                             {Object.entries(lead.preferences as any).map(([k, v]: [string, any], i) => (
                                                <span key={i} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-900 rounded text-[7px] font-bold text-slate-400 uppercase tracking-tighter">
                                                   {k}: {String(v)}
                                                </span>
                                             ))}
                                          </div>
                                       )}
                                    </div>
                                 )}
                              </div>

                              <div className="pt-6 border-t border-dashed border-border flex items-center justify-between mt-auto">
                                 <div className="flex items-center gap-3">
                                    <div className="relative">
                                       <select 
                                         value={lead.status}
                                         onChange={(e) => handleStatusUpdate(lead.id, e.target.value)}
                                         className={`pl-4 pr-8 py-2.5 rounded-xl font-black text-[8px] uppercase tracking-widest shadow-lg transition-all outline-none appearance-none cursor-pointer border-none ${
                                           isNew ? 'azure-gradient text-white shadow-azure/20' : 
                                           isBooked ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-slate-100 dark:bg-slate-900 text-slate-400'
                                         }`}
                                       >
                                          <option value="new">Discovery</option>
                                          <option value="contacted">Comms</option>
                                          <option value="booked">Success</option>
                                          <option value="rejected">Archive</option>
                                       </select>
                                       <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                                          <ArrowRight size={10} className="rotate-90" />
                                       </div>
                                    </div>
                                 </div>
                                 <button 
                                    onClick={() => handleDelete(lead.id)}
                                    className="w-10 h-10 bg-slate-50 dark:bg-slate-700 text-rose-300 hover:bg-rose-500 hover:text-white rounded-xl transition-all flex items-center justify-center group/btn active:scale-90"
                                    title="Exterminate Narrative"
                                 >
                                    <Trash2 size={16} className="group-hover/btn:rotate-12 transition-transform" />
                                 </button>
                              </div>
                           </motion.div>
                         );
                      })}
                    </AnimatePresence>
                  </>
               )}

               {filteredLeads.length === 0 && !loading && (
                  <div className="col-span-full py-40 bg-slate-50 dark:bg-slate-900/50 rounded-[5rem] border-2 border-dashed border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-8 text-center">
                     <div className="w-32 h-32 rounded-[3.5rem] bg-white dark:bg-slate-800 shadow-2xl flex items-center justify-center text-slate-100">
                        <Mail size={64} strokeWidth={1} />
                     </div>
                     <div className="space-y-2">
                        <h3 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">Quiet Sector</h3>
                        <p className="font-bold text-slate-400 max-w-sm mx-auto uppercase text-[10px] tracking-widest">No signals detected in the current frequency. Monitoring for incoming discovery narratives.</p>
                     </div>
                  </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}

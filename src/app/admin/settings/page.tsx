'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Settings, Loader2, Save, Globe, Info, 
  Mail, Phone, Share2, MapPin, 
  MessageCircle, Send, Plus, Trash2, Camera, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { GalleryUpload } from '@/components/admin/GalleryUpload';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({
    site_name: 'SieteViajes Silk Road',
    site_logo: '',
    contact_email: '',
    contact_phone: '',
    contact_whatsapp: '',
    contact_telegram: '',
    instagram_url: '',
    facebook_url: '',
    footer_text_en: '',
    footer_text_es: '',
    footer_text_ru: '',
    footer_text_uz: '',
    address: '',
    instagram_images: [],
    hero_background: ''
  });

  async function fetchSettings() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('site_settings').select('*').limit(1);
      if (error) {
        console.error('Error fetching settings:', error.message);
      } else if (data && data.length > 0) {
        const settingsData = data[0];
        setFormData({
          ...settingsData,
          site_name: settingsData.site_name || '',
          site_logo: settingsData.site_logo || '',
          contact_email: settingsData.contact_email || '',
          contact_phone: settingsData.contact_phone || '',
          contact_whatsapp: settingsData.contact_whatsapp || '',
          contact_telegram: settingsData.contact_telegram || '',
          instagram_url: settingsData.instagram_url || '',
          facebook_url: settingsData.facebook_url || '',
          footer_text_en: settingsData.footer_text_en || '',
          footer_text_es: settingsData.footer_text_es || '',
          footer_text_ru: settingsData.footer_text_ru || '',
          footer_text_uz: settingsData.footer_text_uz || '',
          address: settingsData.address || '',
          instagram_images: settingsData.instagram_images || [],
          hero_background: settingsData.hero_background || ''
        });
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const { error } = await supabase.from('site_settings').upsert(formData);
    
    if (error) {
       alert('Error saving settings: ' + error.message);
    } else {
       alert('Global settings updated successfully!');
    }
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-azure w-10 h-10" /></div>;

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
           <div className="flex items-center gap-1.5 mb-0.5">
              <Settings className="w-3 h-3 text-azure animate-spin-slow" />
              <span className="text-[8px] font-black uppercase text-slate-400 tracking-[0.2em]">Configuration</span>
           </div>
           <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5 italic uppercase tracking-tighter leading-none mb-0.5">
              Mission Control
           </h1>
           <p className="text-slate-500 font-bold italic text-[10px] pl-0.5">Global brand identity and communication.</p>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={saving}
          className="azure-gradient text-white px-6 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-[0.1em] shadow-xl shadow-azure/20 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin w-3.5 h-3.5" /> : <Save size={14} />}
          Push Update
        </button>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
         {/* Identity Hub */}
         <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-5 rounded-[2rem] border border-border shadow-soft flex flex-col items-center">
               <span className="text-[7px] font-black uppercase text-azure/60 tracking-[0.2em] mb-4 italic uppercase">Logo Archetype</span>
               <div className="w-full">
                  <ImageUpload 
                     defaultValue={formData.site_logo} 
                     onUpload={(url) => setFormData({...formData, site_logo: url})} 
                     label="Brand Signature"
                     bucket="images"
                  />
               </div>
              </div>

              <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-5 rounded-[2rem] border border-border shadow-soft flex flex-col items-center">
                 <span className="text-[7px] font-black uppercase text-azure/60 tracking-[0.2em] mb-4 italic uppercase">Hero Background</span>
                 <div className="w-full">
                    <ImageUpload 
                       defaultValue={formData.hero_background} 
                       onUpload={(url) => setFormData({...formData, hero_background: url})} 
                       label="Atmosphere"
                       bucket="images"
                    />
                 </div>
              </div>

            <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-5 rounded-[2rem] border border-border shadow-soft space-y-4">
               <span className="text-[7px] font-black uppercase text-gold/60 tracking-[0.2em] block italic uppercase">Brand Metadata</span>
               <div className="space-y-3">
                  <div className="space-y-1">
                     <label className="text-[8px] font-black uppercase text-slate-400 tracking-widest pl-1.5">Venture Name</label>
                     <input 
                       type="text" 
                       value={formData.site_name} 
                       onChange={e => setFormData({...formData, site_name: e.target.value})}
                       className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border-none rounded-xl font-black text-base italic tracking-tighter"
                       placeholder="Site Name"
                     />
                  </div>
                  <div className="space-y-1">
                     <label className="text-[8px] font-black uppercase text-slate-400 tracking-widest pl-1.5">Operational Hub</label>
                     <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-azure w-3.5 h-3.5" />
                        <input 
                          type="text" 
                          value={formData.address} 
                          onChange={e => setFormData({...formData, address: e.target.value})}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border-none rounded-xl font-bold italic text-xs"
                          placeholder="Address"
                        />
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Communication Relay */}
         <div className="lg:col-span-7 bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-border shadow-soft space-y-6">
            <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white flex items-center gap-2.5">
               <Info className="text-azure w-4 h-4" /> Engagement Vector
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
               <div className="space-y-1 group">
                  <label className="text-[8px] font-black uppercase text-slate-400 tracking-widest pl-1.5">Signal (Email)</label>
                  <div className="relative">
                     <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-azure transition-all" size={14} />
                     <input type="email" value={formData.contact_email} onChange={e => setFormData({...formData, contact_email: e.target.value})} className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border-none rounded-lg font-bold text-xs" placeholder="Email" />
                  </div>
               </div>
               <div className="space-y-1 group">
                  <label className="text-[8px] font-black uppercase text-slate-400 tracking-widest pl-1.5">Phone</label>
                  <div className="relative">
                     <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-azure transition-all" size={14} />
                     <input type="text" value={formData.contact_phone} onChange={e => setFormData({...formData, contact_phone: e.target.value})} className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border-none rounded-lg font-bold text-xs" placeholder="Phone" />
                  </div>
               </div>
               <div className="space-y-1 group">
                  <label className="text-[8px] font-black uppercase text-slate-400 tracking-widest pl-1.5">WhatsApp</label>
                  <div className="relative">
                     <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-all" size={14} />
                     <input type="text" value={formData.contact_whatsapp} onChange={e => setFormData({...formData, contact_whatsapp: e.target.value})} className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border-none rounded-lg font-bold text-xs" placeholder="WhatsApp" />
                  </div>
               </div>
               <div className="space-y-1 group">
                  <label className="text-[8px] font-black uppercase text-slate-400 tracking-widest pl-1.5">Telegram</label>
                  <div className="relative">
                     <Send className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-azure transition-all" size={14} />
                     <input type="text" value={formData.contact_telegram} onChange={e => setFormData({...formData, contact_telegram: e.target.value})} className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border-none rounded-lg font-bold text-xs" placeholder="Telegram" />
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-4 border-t border-dashed border-border/50">
               <div className="space-y-1 group">
                  <label className="text-[8px] font-black uppercase text-slate-400 tracking-widest pl-1.5">Instagram</label>
                  <div className="relative">
                     <Share2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-400 transition-all" size={14} />
                     <input type="text" value={formData.instagram_url} onChange={e => setFormData({...formData, instagram_url: e.target.value})} className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border-none rounded-lg font-bold italic text-xs" placeholder="Instagram URL" />
                  </div>
               </div>
               <div className="space-y-1 group">
                  <label className="text-[8px] font-black uppercase text-slate-400 tracking-widest pl-1.5">Facebook</label>
                  <div className="relative">
                     <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-all" size={14} />
                     <input type="text" value={formData.facebook_url} onChange={e => setFormData({...formData, facebook_url: e.target.value})} className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border-none rounded-lg font-bold italic text-xs" placeholder="Facebook URL" />
                  </div>
               </div>
            </div>
         </div>

         {/* Localization & Manifesto */}
         <div className="lg:col-span-5 bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-border shadow-soft flex flex-col">
            <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white mb-4 flex items-center gap-2.5">
               <Globe className="text-gold w-4 h-4" /> Global (Footer)
            </h3>
            
            <div className="space-y-3 flex-1">
               <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-0.5">
                     <label className="text-[6px] font-black uppercase text-azure tracking-[0.2em] pl-1">EN</label>
                     <textarea rows={2} value={formData.footer_text_en} onChange={e => setFormData({...formData, footer_text_en: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border-none rounded-lg text-[10px] font-black resize-none italic uppercase tracking-tight leading-tight" placeholder="EN text..." />
                  </div>
                  <div className="space-y-0.5">
                     <label className="text-[6px] font-black uppercase text-gold tracking-[0.2em] pl-1">ES</label>
                     <textarea rows={2} value={formData.footer_text_es} onChange={e => setFormData({...formData, footer_text_es: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border-none rounded-lg text-[10px] font-black resize-none italic uppercase tracking-tight leading-tight" placeholder="ES text..." />
                  </div>
                  <div className="space-y-0.5">
                     <label className="text-[6px] font-black uppercase text-orange-400 tracking-[0.2em] pl-1">RU</label>
                     <textarea rows={2} value={formData.footer_text_ru} onChange={e => setFormData({...formData, footer_text_ru: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border-none rounded-lg text-[10px] font-black resize-none italic uppercase tracking-tight leading-tight" placeholder="RU text..." />
                  </div>
                  <div className="space-y-0.5">
                     <label className="text-[6px] font-black uppercase text-emerald-400 tracking-[0.2em] pl-1">UZ</label>
                     <textarea rows={2} value={formData.footer_text_uz} onChange={e => setFormData({...formData, footer_text_uz: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border-none rounded-lg text-[10px] font-black resize-none italic uppercase tracking-tight leading-tight" placeholder="UZ text..." />
                  </div>
               </div>
            </div>

            <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-border/50 flex flex-col items-center gap-1.5 text-center">
               <ShieldCheck className="text-azure/20" size={24} strokeWidth={1} />
               <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-tight">Live DB Sync Active</p>
            </div>
         </div>
           {/* Instagram Feed / Gallery Matrix */}
           <div className="lg:col-span-12 bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-border shadow-soft space-y-6">
              <div className="flex items-center justify-between border-b border-dashed border-border pb-4">
                 <div>
                    <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white flex items-center gap-2.5">
                       <Camera className="text-rose-400 w-4 h-4" /> Instagram Grid
                    </h3>
                 </div>
              </div>
              
              <GalleryUpload 
                 defaultValues={formData.instagram_images}
                 onUpload={(urls) => setFormData({...formData, instagram_images: urls})}
                 bucket="images"
              />
           </div>
       </form>
    </div>
  );
}

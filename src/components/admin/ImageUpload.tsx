'use client';

import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { ImageIcon, X, Loader2, UploadCloud, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  defaultValue?: string;
  label?: string;
  bucket?: string;
}

export function ImageUpload({ onUpload, defaultValue = '', label = 'Featured Image', bucket = 'images' }: ImageUploadProps) {
  const [preview, setPreview] = useState(defaultValue);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WebP)');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      setUploadProgress(90);

      // Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      setPreview(publicUrl);
      onUpload(publicUrl);
      setUploadProgress(100);
    } catch (error: any) {
      console.error('Upload error:', error.message);
      alert('Error uploading image. Make sure the storage bucket exists and is public.');
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  const removeImage = () => {
    setPreview('');
    onUpload('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{label}</label>
        {preview && (
          <button 
            type="button" 
            onClick={removeImage}
            className="text-[10px] font-black uppercase text-rose-500 hover:text-rose-600 transition-colors flex items-center gap-1"
          >
            <X size={12} /> Remove
          </button>
        )}
      </div>

      <div 
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`relative group cursor-pointer overflow-hidden rounded-[2.5rem] border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center min-h-[220px] ${
          preview 
            ? 'border-azure/20 bg-white dark:bg-slate-900 border-none shadow-xl' 
            : 'border-slate-200 dark:border-slate-800 hover:border-azure/40 bg-slate-50 dark:bg-slate-900/50'
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleUpload} 
          className="hidden" 
          accept="image/*"
        />

        <AnimatePresence mode="wait">
          {isUploading ? (
            <motion.div 
              key="uploading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-4 py-10"
            >
              <div className="relative w-24 h-24 flex items-center justify-center">
                 <Loader2 className="w-full h-full text-azure animate-spin absolute" strokeWidth={1} />
                 <span className="font-black text-azure text-xs">{uploadProgress}%</span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Orchestrating Asset...</p>
            </motion.div>
          ) : preview ? (
            <motion.div 
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-full absolute inset-0 group"
            >
               <img src={preview} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="Preview" />
               <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <div className="px-6 py-3 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl scale-90 group-hover:scale-100 transition-all">Replace Image</div>
               </div>
               <div className="absolute top-4 right-4 p-2 bg-emerald-500 rounded-full text-white shadow-xl hover:scale-110 transition-transform">
                  <CheckCircle size={18} />
               </div>
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-4 py-10"
            >
               <div className="w-20 h-20 rounded-[2rem] bg-azure/5 text-azure flex items-center justify-center group-hover:bg-azure group-hover:text-white transition-all shadow-xl shadow-azure/10">
                  <UploadCloud size={32} />
               </div>
               <div className="text-center">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Drop Image Here</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">PNG, JPG, WebP up to 5MB</p>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

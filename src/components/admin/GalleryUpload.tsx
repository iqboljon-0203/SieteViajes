'use client';

import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Layers, X, Loader2, Plus, GripVertical, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GalleryUploadProps {
  onUpload: (urls: string[]) => void;
  defaultValues?: string[];
  bucket?: string;
}

export function GalleryUpload({ onUpload, defaultValues = [], bucket = 'images' }: GalleryUploadProps) {
  const [images, setImages] = useState<string[]>(defaultValues);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `gallery/${fileName}`;

        const { error } = await supabase.storage
          .from(bucket)
          .upload(filePath, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        return publicUrl;
      });

      const newUrls = await Promise.all(uploadPromises);
      const updatedImages = [...images, ...newUrls];
      setImages(updatedImages);
      onUpload(updatedImages);
    } catch (error: any) {
      console.error('Gallery upload error:', error.message);
      alert('Error uploading some images.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (idx: number) => {
    const updated = images.filter((_, i) => i !== idx);
    setImages(updated);
    onUpload(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center">
              <Layers size={18} />
           </div>
           <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Narrative Gallery</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Multi-Asset Selection Enabled</p>
           </div>
        </div>
        <button 
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="azure-gradient text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-azure/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus size={16} />}
          Append Assets
        </button>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleUpload} 
        className="hidden" 
        multiple 
        accept="image/*" 
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <AnimatePresence>
          {images.map((url, i) => (
            <motion.div 
              key={url}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative aspect-square group rounded-[2.5rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl hover:shadow-2xl hover:border-azure transition-all"
            >
               <img src={url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={`Gallery ${i}`} />
               <div className="absolute inset-0 bg-rose-500/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    type="button" 
                    onClick={() => removeImage(i)}
                    className="flex flex-col items-center gap-2 text-white"
                  >
                     <X size={24} />
                     <span className="text-[9px] font-black uppercase tracking-widest">Acknowledge Delete</span>
                  </button>
               </div>
               <div className="absolute top-3 left-3 w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white text-[10px] font-black group-hover:bg-azure group-hover:border-azure transition-all">
                  {i + 1}
               </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {!isUploading && images.length === 0 && (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="col-span-full py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-azure/30 transition-all group"
          >
             <div className="w-16 h-16 rounded-[2rem] bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center text-slate-300 group-hover:text-azure transition-colors">
                <ImageIcon size={24} />
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No assets mapped. Click to initiate upload.</p>
          </div>
        )}

        {isUploading && (
          <div className="aspect-square rounded-[2.5rem] bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-azure/20 flex flex-col items-center justify-center gap-2 animate-pulse">
             <Loader2 className="w-8 h-8 text-azure animate-spin" />
             <span className="text-[8px] font-black text-azure uppercase tracking-widest">Finalizing...</span>
          </div>
        )}
      </div>
    </div>
  );
}

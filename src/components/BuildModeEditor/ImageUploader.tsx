import React, { useState } from 'react';
import { useAdminDB } from '../../hooks/useAdminDB';
import { Upload, X, Check, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  className?: string;
}

export function ImageUploader({ value, onChange, folder = 'general', className }: ImageUploaderProps) {
  const { uploadImage, loading } = useAdminDB();
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    const { url, error } = await uploadImage(file, folder);

    if (error) {
      setError(error.message);
    } else if (url) {
      onChange(url);
    }
  };

  return (
    <div className={cn("relative group", className)}>
      {value ? (
        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-lg border-2 border-primary/20">
          <img src={value} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
            <label className="p-3 bg-white text-primary rounded-xl cursor-pointer hover:scale-110 transition-transform">
              <Upload size={20} />
              <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
            </label>
            <button 
              onClick={() => onChange('')}
              className="p-3 bg-white text-red-500 rounded-xl hover:scale-110 transition-transform"
            >
              <X size={20} />
            </button>
          </div>
          {loading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <label className={cn(
          "flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed rounded-[32px] cursor-pointer transition-all",
          loading ? "bg-neutral-50 border-neutral-100" : "bg-white border-neutral-200 hover:border-primary hover:bg-primary/5 shadow-sm"
        )}>
          {loading ? (
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Upload size={24} />
              </div>
              <div className="text-center">
                <p className="text-sm font-black text-gray-900 uppercase tracking-widest">Click to upload</p>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">SVG, PNG, JPG (max. 5MB)</p>
              </div>
            </>
          )}
          <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={loading} />
        </label>
      )}

      {error && (
        <div className="mt-2 text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
          <AlertCircle size={12} />
          {error}
        </div>
      )}
    </div>
  );
}

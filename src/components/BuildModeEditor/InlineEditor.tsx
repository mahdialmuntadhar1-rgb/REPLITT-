import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Save, X, Loader2, CheckCircle2, Upload, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { useAdminDB } from '../../hooks/useAdminDB';

export interface EditorField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'url' | 'number' | 'checkbox' | 'image';
  placeholder?: string;
  dir?: 'ltr' | 'rtl';
  folder?: string;
}

interface InlineEditorProps {
  fields: EditorField[];
  initialValues: any;
  onSave: (values: any) => Promise<void>;
  onCancel: () => void;
  title?: string;
}

export function InlineEditor({ fields, initialValues, onSave, onCancel, title }: InlineEditorProps) {
  const { user } = useAuthStore();
  const { uploadImage } = useAdminDB();
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (editorRef.current && !editorRef.current.contains(event.target as Node)) {
        onCancel();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onCancel]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const savePromise = (async () => {
      // Add administrative metadata
      const preparedValues = {
        ...values,
        updated_at: new Date().toISOString(),
        updated_by: user?.email || 'mahdialmuntadhar1@gmail.com'
      };
      await onSave(preparedValues);
      setSuccess(true);
      setTimeout(() => {
        onCancel();
      }, 1000);
    })();

    toast.promise(savePromise, {
      loading: 'Saving changes...',
      success: 'Changes saved successfully!',
      error: 'Failed to save changes.',
    });

    try {
      await savePromise;
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name: string, value: any) => {
    setValues((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (fieldName: string, file: File, folder: string = 'general') => {
    setUploading(fieldName);
    const { url, error } = await uploadImage(file, folder);
    if (!error && url) {
      handleChange(fieldName, url);
      toast.success('Image uploaded successfully!');
    } else {
      toast.error('Upload failed. Please try again.');
    }
    setUploading(null);
  };

  return (
    <motion.div
      ref={editorRef}
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute top-4 left-4 z-[10000] w-[320px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-neutral-100 overflow-hidden"
    >
      <div className="p-5 bg-[#F7F7F5] border-b border-neutral-100 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
          {title || 'Edit Content'}
        </span>
        <button onClick={onCancel} className="text-neutral-400 hover:text-red-500 transition-colors">
          <X size={16} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {fields.map((field) => (
          <div key={field.name} className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block">
              {field.label}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                value={values[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                className="w-full bg-neutral-50 border-none rounded-2xl px-4 py-3 text-xs font-bold ring-1 ring-neutral-100 focus:ring-2 ring-primary/20 transition-all outline-none"
                rows={3}
                placeholder={field.placeholder}
                dir={field.dir}
              />
            ) : field.type === 'image' ? (
              <div className="space-y-3">
                {values[field.name] && (
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-neutral-100 shadow-sm group/img">
                    <img src={values[field.name]} className="w-full h-full object-cover" alt="" />
                    <button 
                      type="button"
                      onClick={() => handleChange(field.name, '')}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover/img:opacity-100 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={values[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="flex-1 bg-neutral-50 border-none rounded-2xl px-4 py-3 text-[10px] font-bold ring-1 ring-neutral-100 focus:ring-2 ring-primary/20 transition-all outline-none"
                    placeholder="Image URL"
                  />
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(field.name, file, field.folder);
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <button
                      type="button"
                      className={cn(
                        "p-3 rounded-2xl transition-all shadow-sm",
                        uploading === field.name ? "bg-neutral-100 text-neutral-400" : "bg-primary text-white hover:scale-105 active:scale-95"
                      )}
                    >
                      {uploading === field.name ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            ) : field.type === 'checkbox' ? (
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={values[field.name] || false}
                  onChange={(e) => handleChange(field.name, e.target.checked)}
                  className="w-5 h-5 rounded-lg border-2 border-neutral-200 text-primary focus:ring-primary/20 transition-all cursor-pointer"
                />
                <span className="text-xs font-bold text-gray-600 group-hover:text-primary transition-colors">
                  Enabled / Active
                </span>
              </label>
            ) : (
              <input
                type={field.type}
                value={values[field.name] || ''}
                onChange={(e) => handleChange(field.name, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                className="w-full bg-neutral-50 border-none rounded-2xl px-4 py-3 text-xs font-bold ring-1 ring-neutral-100 focus:ring-2 ring-primary/20 transition-all outline-none"
                placeholder={field.placeholder}
                dir={field.dir}
              />
            )}
          </div>
        ))}

        <div className="pt-2 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-neutral-400 bg-neutral-50 hover:bg-neutral-100 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || success}
            className={cn(
              "flex-[2] px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg transition-all flex items-center justify-center gap-2",
              success ? "bg-green-500" : "bg-neutral-900 hover:bg-black"
            )}
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : success ? (
              <>
                <CheckCircle2 size={16} /> Saved
              </>
            ) : (
              <>
                <Save size={16} /> Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

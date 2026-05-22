import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Building2, Phone, MapPin, Tag, Globe, Check } from 'lucide-react';
import { CATEGORIES, GOVERNORATES, CITIES } from '../../constants';
import { useHomeStore } from '../../store/homeStore';
import { supabase } from '@/lib/supabaseClient';
import { cn } from '../../lib/utils';

interface AddBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddBusinessModal({ isOpen, onClose, onSuccess }: AddBusinessModalProps) {
  const { language } = useHomeStore();
  const isRtl = language === 'ar' || language === 'ku';

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    name_ar: '',
    category: '',
    governorate: '',
    city: '',
    phone: '',
    address: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('businesses').insert([{
        ...formData,
        is_active: true,
        is_verified: false,
        rating: 5.0,
        review_count: 0
      }]);

      if (error) throw error;
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-neutral-900/60 backdrop-blur-xl"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-[#F7F7F5] rounded-[48px] overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="bg-white p-10 flex items-center justify-between border-b border-neutral-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20">
                  <Building2 size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 leading-none mb-1">
                    {language === 'ar' ? 'أضف عملك' : 'List Your Business'}
                  </h2>
                  <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                    {language === 'ar' ? 'انضم إلى مجتمعنا المتنامي' : 'Join our growing community'}
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-12 h-12 bg-neutral-50 text-neutral-400 rounded-2xl flex items-center justify-center hover:bg-neutral-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Name EN */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                    <Building2 size={14} /> Business Name (English)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-white border-none rounded-2xl px-6 py-4 font-black text-sm ring-1 ring-neutral-100 focus:ring-2 ring-primary/20 transition-all"
                  />
                </div>

                {/* Name AR */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                    <Building2 size={14} /> {language === 'ar' ? 'اسم العمل (عربي)' : 'Business Name (Arabic)'}
                  </label>
                  <input
                    type="text"
                    required
                    dir="rtl"
                    value={formData.name_ar}
                    onChange={e => setFormData(prev => ({ ...prev, name_ar: e.target.value }))}
                    className="w-full bg-white border-none rounded-2xl px-6 py-4 font-black text-sm ring-1 ring-neutral-100 focus:ring-2 ring-primary/20 transition-all font-arabic"
                  />
                </div>

                {/* Category */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                    <Tag size={14} /> Category
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-white border-none rounded-2xl px-6 py-4 font-black text-sm ring-1 ring-neutral-100 focus:ring-2 ring-primary/20 transition-all appearance-none"
                  >
                    <option value="">Select Category</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.en}</option>
                    ))}
                  </select>
                </div>

                {/* Governorate */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                    <MapPin size={14} /> Governorate
                  </label>
                  <select
                    required
                    value={formData.governorate}
                    onChange={e => setFormData(prev => ({ ...prev, governorate: e.target.value, city: '' }))}
                    className="w-full bg-white border-none rounded-2xl px-6 py-4 font-black text-sm ring-1 ring-neutral-100 focus:ring-2 ring-primary/20 transition-all appearance-none"
                  >
                    <option value="">Select Governorate</option>
                    {GOVERNORATES.filter(g => g.id !== 'all').map(g => (
                      <option key={g.id} value={g.id}>{g.en}</option>
                    ))}
                  </select>
                </div>

                {/* City */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                    <MapPin size={14} /> City
                  </label>
                  <select
                    required
                    disabled={!formData.governorate}
                    value={formData.city}
                    onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full bg-white border-none rounded-2xl px-6 py-4 font-black text-sm ring-1 ring-neutral-100 focus:ring-2 ring-primary/20 transition-all appearance-none disabled:opacity-50"
                  >
                    <option value="">Select City</option>
                    {formData.governorate && CITIES[formData.governorate]?.map(city => (
                      <option key={city.id} value={city.id}>{city.en}</option>
                    ))}
                  </select>
                </div>

                {/* Phone */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                    <Phone size={14} /> Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="07XX XXX XXXX"
                    value={formData.phone}
                    onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-white border-none rounded-2xl px-6 py-4 font-black text-sm ring-1 ring-neutral-100 focus:ring-2 ring-primary/20 transition-all font-mono"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                  <Globe size={14} /> Full Address Details
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.address}
                  onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full bg-white border-none rounded-2xl px-6 py-8 font-black text-sm ring-1 ring-neutral-100 focus:ring-2 ring-primary/20 transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white p-8 rounded-[32px] font-black text-md uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Check size={24} />
                    {language === 'ar' ? 'سجل عملك الآن' : 'Submit Business'}
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

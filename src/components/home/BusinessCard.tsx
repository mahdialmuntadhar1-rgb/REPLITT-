import React from 'react';
import { Business } from '../../types';
import { Star, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { useHomeStore } from '../../store/homeStore';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';
import { EditableWrapper } from '../BuildModeEditor/EditableWrapper';
import { EditorField } from '../BuildModeEditor/InlineEditor';
import { useAdminDB } from '../../hooks/useAdminDB';
import { useAuthStore } from '../../store/authStore';
import { isAdmin as checkIsAdmin } from '../../lib/adminAuth';

interface BusinessCardProps {
  business: Business;
  onClick?: (business: Business) => void;
}

export function BusinessCard({ business, onClick }: BusinessCardProps) {
  const { language, isEditMode } = useHomeStore();
  const { profile } = useAuthStore();
  const { updateBusiness } = useAdminDB();
  const isRtl = language === 'ar' || language === 'ku';
  const isAdmin = checkIsAdmin(profile);

  const name = isRtl ? (business.name_ar || business.name) : business.name;

  const handleSave = async (values: any) => {
    const { error } = await updateBusiness(business.id, values);
    if (error) throw error;
  };

  const businessFields: EditorField[] = [
    { name: 'name', label: 'Name (EN)', type: 'text' },
    { name: 'name_ar', label: 'Name (AR)', type: 'text', dir: 'rtl' },
    { name: 'name_ku', label: 'Name (KU)', type: 'text', dir: 'rtl' },
    { name: 'category', label: 'Category', type: 'text' },
    { name: 'city', label: 'City', type: 'text' },
    { name: 'governorate', label: 'Governorate', type: 'text' },
    { name: 'image_url', label: 'Business image', type: 'image', folder: 'businesses' },
    { name: 'is_featured', label: 'Featured', type: 'checkbox' },
    { name: 'is_verified', label: 'Verified', type: 'checkbox' },
    { name: 'address', label: 'Address', type: 'text' },
    { name: 'phone', label: 'Phone', type: 'text' },
  ];

  return (
    <EditableWrapper
      title="Edit Business Card"
      fields={businessFields}
      initialValues={business}
      onSave={handleSave}
      isEnabled={isEditMode && isAdmin}
      overlayClassName="rounded-[40px]"
    >
      <motion.div
        whileHover={isEditMode ? {} : { y: -8, shadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
        onClick={() => !isEditMode && onClick?.(business)}
        className={cn(
          "bg-white rounded-[40px] overflow-hidden shadow-xl border border-neutral-50 flex flex-col h-full relative group",
          !isEditMode && "cursor-pointer"
        )}
      >
        <div className="relative aspect-square overflow-hidden">
          <img
            src={business.image_url || 'https://picsum.photos/seed/biz/800/800'}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          {/* Category Pill */}
          <div className={cn(
            "absolute top-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl flex items-center gap-2 shadow-lg",
            isRtl ? "right-6" : "left-6"
          )}>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">
              {business.category}
            </span>
          </div>
          
          {/* Verified Badge */}
          {business.is_verified && (
            <div className={cn(
              "absolute top-6",
              isRtl ? "left-6" : "right-6"
            )}>
              <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg">
                <ShieldCheck size={20} />
              </div>
            </div>
          )}
          
          {/* Featured Badge */}
          {business.is_featured && (
            <div className={cn(
              "absolute top-18 px-3 py-1 bg-accent text-white rounded-lg text-[8px] font-black uppercase tracking-widest shadow-lg",
              isRtl ? "right-6" : "left-6"
            )}>
              {language === 'ar' ? 'مميز' : 'Featured'}
            </div>
          )}
        </div>

        <div className="p-8 flex flex-col flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-black text-gray-900 leading-tight group-hover:text-primary transition-colors">
              {name}
            </h3>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1 text-accent">
              <Star size={16} fill="currentColor" />
              <span className="text-sm font-black">{business.rating || '5.0'}</span>
            </div>
            <div className="flex items-center gap-1 text-neutral-400">
              <MapPin size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {business.city || business.governorate}
              </span>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-neutral-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-neutral-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                <Phone size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                  {language === 'ar' ? 'اتصل الآن' : 'Call Now'}
                </span>
                <span className="text-xs font-black text-gray-900 font-mono">
                  {business.phone || '0770 000 0000'}
                </span>
              </div>
            </div>
            
            <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:translate-x-1 transition-transform">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={isRtl ? "rotate-180" : ""}>
                <path d="M5 12h14m-7-7 7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </motion.div>
    </EditableWrapper>
  );
}

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Phone, Globe, MapPin, Star, MessageCircle, Instagram, Facebook, ShieldCheck } from 'lucide-react';
import { Business } from '../../types';
import { useHomeStore } from '../../store/homeStore';
import { cn } from '../../lib/utils';

interface BusinessDetailModalProps {
  business: Business | null;
  onClose: () => void;
}

export function BusinessDetailModal({ business, onClose }: BusinessDetailModalProps) {
  const { language } = useHomeStore();
  const isRtl = language === 'ar' || language === 'ku';

  if (!business) return null;

  const name = isRtl ? (business.name_ar || business.name) : business.name;
  const description = isRtl ? (business.description_ar || business.description) : business.description;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-neutral-900/60 backdrop-blur-xl"
          onClick={onClose}
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-5xl h-[90vh] bg-white rounded-[48px] overflow-hidden shadow-2xl flex flex-col md:flex-row"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 z-50 w-12 h-12 bg-white/20 backdrop-blur-md text-white rounded-2xl flex items-center justify-center hover:bg-white hover:text-primary transition-all shadow-xl"
          >
            <X size={24} />
          </button>

          {/* Left Side: Images & Visuals */}
          <div className="md:w-1/2 h-64 md:h-full relative overflow-hidden group">
            <img 
              src={business.image_url || 'https://picsum.photos/seed/biz_detail/1200/1200'} 
              alt={name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            
            <div className="absolute bottom-12 left-12 right-12 text-white">
              <div className="flex items-center gap-2 mb-4">
                <div className="px-4 py-2 bg-primary rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                  {business.category}
                </div>
                {business.is_verified && (
                  <div className="w-10 h-10 bg-white text-primary rounded-2xl flex items-center justify-center shadow-lg">
                    <ShieldCheck size={20} />
                  </div>
                )}
              </div>
              <h2 className="text-4xl font-black mb-4 leading-tight">{name}</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-accent">
                  <Star size={20} fill="currentColor" />
                  <span className="text-lg font-black">{business.rating || '5.0'}</span>
                </div>
                <div className="flex items-center gap-1 text-white/60">
                  <MapPin size={20} />
                  <span className="text-sm font-bold uppercase tracking-widest">{business.city}, {business.governorate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Details & Actions */}
          <div className="md:w-1/2 h-full overflow-y-auto p-12 md:p-16 custom-scrollbar">
            <div className="space-y-12">
              {/* Gallery Mini Header */}
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <img 
                    key={i} 
                    src={`https://picsum.photos/seed/biz_gal_${i}/400/300`} 
                    className="rounded-3xl aspect-video object-cover shadow-sm hover:ring-2 ring-primary transition-all cursor-pointer"
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest">
                  {language === 'ar' ? 'عن العمل' : 'About the Business'}
                </h3>
                <p className="text-lg text-neutral-600 leading-relaxed font-medium">
                  {description || 'No description available for this business.'}
                </p>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest">
                    {language === 'ar' ? 'معلومات الاتصال' : 'Contact Information'}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 group">
                      <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <Phone size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Phone Number</p>
                        <p className="text-lg font-black text-gray-900 font-mono tracking-tighter">{business.phone || '0770 000 0000'}</p>
                      </div>
                    </div>
                    {business.website && (
                      <div className="flex items-center gap-4 group">
                        <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                          <Globe size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Website</p>
                          <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-lg font-black text-primary hover:underline">
                            Visit Site
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest">
                    {language === 'ar' ? 'وسائل التواصل' : 'Social Media'}
                  </h3>
                  <div className="flex gap-4">
                    <button className="w-14 h-14 bg-green-500/10 text-green-600 rounded-3xl flex items-center justify-center hover:bg-green-600 hover:text-white transition-all shadow-sm">
                      <MessageCircle size={24} />
                    </button>
                    <button className="w-14 h-14 bg-pink-500/10 text-pink-600 rounded-3xl flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all shadow-sm">
                      <Instagram size={24} />
                    </button>
                    <button className="w-14 h-14 bg-blue-500/10 text-blue-600 rounded-3xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                      <Facebook size={24} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest">
                  {language === 'ar' ? 'الموقع' : 'Location'}
                </h3>
                <div className="w-full aspect-video bg-neutral-100 rounded-[32px] overflow-hidden relative group">
                  <div className="absolute inset-0 flex items-center justify-center flex-col gap-2">
                    <MapPin size={48} className="text-neutral-300 group-hover:text-primary transition-colors" />
                    <span className="text-xs font-black text-neutral-400 uppercase tracking-widest">Interactive Map Ready</span>
                  </div>
                  {/* Map would go here */}
                </div>
                <p className="text-sm font-bold text-neutral-500 flex items-center gap-2">
                  <MapPin size={16} />
                  {business.address || `${business.neighborhood}, ${business.city}`}
                </p>
              </div>

              {/* Direct Call Action */}
              <div className="pt-8">
                <a 
                  href={`tel:${business.phone}`}
                  className="w-full bg-primary text-white p-8 rounded-[32px] flex items-center justify-center gap-4 text-xl font-black shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Phone size={28} />
                  {language === 'ar' ? 'اتصل الآن' : 'Call Business'}
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

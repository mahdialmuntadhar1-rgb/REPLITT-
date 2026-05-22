import React from 'react';
import { Business, Language } from '../types';
import { MapPin, Phone, Star, CheckCircle2, Globe, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useHomeStore } from '../store/homeStore';

export const BusinessCard: React.FC<{ business: Business }> = ({ business }) => {
  const { language, setSelectedBusiness } = useHomeStore();
  const isAr = language === 'ar';
  
  const name = isAr && business.name_ar ? business.name_ar : business.name;
  const address = isAr && business.neighborhood ? `${business.neighborhood}, ${business.city}` : business.address;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      onClick={() => setSelectedBusiness(business)}
      className="bg-white rounded-[40px] shadow-sm border border-neutral-100 overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 group cursor-pointer"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={business.image_url || 'https://picsum.photos/seed/biz/800/600'} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          {business.is_featured && (
            <span className="bg-accent text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg">
              Featured
            </span>
          )}
          {business.is_verified && (
            <span className="bg-primary text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1">
              <CheckCircle2 size={10} />
              Verified
            </span>
          )}
        </div>
      </div>
      
      <div className="p-8">
        <div className="flex items-center gap-2 mb-2 text-primary">
          <span className="text-[10px] font-black uppercase tracking-widest">{business.category}</span>
          <span className="w-1 h-1 rounded-full bg-neutral-200"></span>
          <div className="flex items-center gap-1 text-accent">
            <Star size={12} fill="currentColor" />
            <span className="text-xs font-black">{business.rating.toFixed(1)}</span>
            <span className="text-[10px] font-bold text-neutral-400">({business.review_count})</span>
          </div>
        </div>
        
        <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-1">{name}</h3>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-neutral-500 font-medium text-sm">
            <MapPin size={16} className="text-accent" />
            <span className="line-clamp-1">{address || business.governorate}</span>
          </div>
          {business.phone && (
            <div className="flex items-center gap-2 text-neutral-500 font-medium text-sm">
              <Phone size={16} className="text-accent" />
              <span>{business.phone}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 pt-4 border-t border-neutral-50">
          <button className="flex-1 bg-neutral-50 hover:bg-primary hover:text-white text-primary rounded-2xl py-3 font-bold text-sm transition-all flex items-center justify-center gap-2">
            Details
          </button>
          {business.website && (
            <a 
              href={business.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 bg-neutral-50 hover:bg-accent hover:text-white text-accent rounded-2xl flex items-center justify-center transition-all"
            >
              <ExternalLink size={18} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

import React from 'react';
import { Business } from '../../types';
import { BusinessCard } from './BusinessCard';
import { ChevronRight, ChevronLeft, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { useHomeStore } from '../../store/homeStore';
import { cn } from '../../lib/utils';

interface CategorySectionProps {
  id: string;
  title: string;
  subtitle?: string;
  businesses: Business[];
  onBusinessClick: (business: Business) => void;
  onViewAll?: () => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({ id, title, subtitle, businesses, onBusinessClick, onViewAll }) => {
  const { language } = useHomeStore();
  const isRtl = language === 'ar' || language === 'ku';

  if (businesses.length === 0) return null;

  return (
    <section id={id} className="py-12 scroll-mt-24">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl shadow-lg border border-neutral-50 flex items-center justify-center text-primary">
            <SlidersHorizontal size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 leading-none mb-1 font-arabic">
              {title}
            </h2>
            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">
              {subtitle || (language === 'ar' ? 'أفضل المتاجر في هذه الفئة' : 'Best places in this category')}
            </p>
          </div>
        </div>
        
        {onViewAll && (
          <button 
            onClick={onViewAll}
            className="group flex items-center gap-3 px-6 py-3 bg-white hover:bg-primary rounded-2xl border border-neutral-100 shadow-sm transition-all"
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 group-hover:text-white">
              {language === 'ar' ? 'عرض الكل' : 'View All'}
            </span>
            <ArrowRight size={16} className={cn("text-neutral-400 group-hover:text-white transition-transform group-hover:translate-x-1", isRtl ? "rotate-180" : "")} />
          </button>
        )}
      </div>

      <div className="relative group">
        <div className="flex overflow-x-auto gap-8 no-scrollbar pb-8 px-2 -mx-2">
          {businesses.map((business) => (
            <div key={business.id} className="flex-shrink-0 w-[320px] sm:w-[380px]">
              <BusinessCard business={business} onClick={onBusinessClick} />
            </div>
          ))}
          {/* View More Card */}
          {businesses.length >= 3 && (
            <div className="flex-shrink-0 w-[200px] flex items-center justify-center">
              <button 
                onClick={onViewAll}
                className="w-20 h-20 rounded-full bg-primary/5 hover:bg-primary text-primary hover:text-white transition-all flex items-center justify-center group/btn"
              >
                <ArrowRight size={32} className={cn("transition-transform group-hover/btn:translate-x-2", isRtl ? "rotate-180" : "")} />
              </button>
            </div>
          )}
        </div>
        
        {/* Indicators or Gradient Fade (Optional) */}
        <div className={cn(
          "absolute top-0 bottom-8 w-24 pointer-events-none bg-gradient-to-r from-[#F7F7F5] to-transparent z-10",
          isRtl ? "right-0 rotate-180" : "left-0"
        )} />
        <div className={cn(
          "absolute top-0 bottom-8 w-24 pointer-events-none bg-gradient-to-l from-[#F7F7F5] to-transparent z-10",
          isRtl ? "left-0 rotate-180" : "right-0"
        )} />
      </div>
    </section>
  );
}

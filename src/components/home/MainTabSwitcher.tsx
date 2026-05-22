import React from 'react';
import { useHomeStore } from '../../store/homeStore';
import { cn } from '../../lib/utils';
import { Map, Sparkles } from 'lucide-react';

export function MainTabSwitcher() {
  const { activeTab, setActiveTab, language } = useHomeStore();
  const isRtl = language === 'ar' || language === 'ku';

  const tabs = [
    { id: 'guide', label_ar: 'الدليل', label_en: 'Guide', icon: Map },
    { id: 'shakumaku', label_ar: 'شكو ماكو', label_en: 'Shaku Maku', icon: Sparkles }
  ];

  return (
    <div className="flex justify-center mb-12 px-6">
      <div className="bg-white p-2.5 rounded-[32px] shadow-2xl shadow-neutral-200/50 border border-neutral-50 flex items-center gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const label = isRtl ? tab.label_ar : tab.label_en;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "group flex items-center gap-3 px-8 py-4 rounded-[24px] transition-all duration-500 relative overflow-hidden",
                isActive 
                  ? "bg-primary text-white shadow-xl shadow-primary/30" 
                  : "bg-transparent text-neutral-400 hover:text-primary hover:bg-primary/5"
              )}
            >
              <Icon size={20} className={cn("transition-transform duration-500", isActive ? "scale-110" : "group-hover:rotate-12")} />
              <span className={cn(
                "text-sm font-black uppercase tracking-widest",
                isRtl ? "font-arabic" : ""
              )}>
                {label}
              </span>
              
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

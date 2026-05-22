import React from 'react';
import { useHomeStore } from '../store/homeStore';
import { cn } from '../lib/utils';
import { Grid, MessageSquare } from 'lucide-react';

export function MainTabSwitcher() {
  const { activeTab, setActiveTab, language } = useHomeStore();
  const isAr = language === 'ar';
  const isKu = language === 'ku';

  const tabs = [
    { id: 'guide', en: 'Guide', ar: 'الدليل', ku: 'ڕێبەر', icon: Grid },
    { id: 'shakumaku', en: 'Shaku Maku', ar: 'شكو ماكو', ku: 'شکو ماکو', icon: MessageSquare },
  ];

  return (
    <div className="flex justify-center mb-12">
      <div className="bg-white p-2 rounded-[32px] shadow-sm border border-neutral-100 flex gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const label = language === 'ar' ? tab.ar : language === 'ku' ? tab.ku : tab.en;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-3 px-8 py-4 rounded-[24px] font-black text-sm uppercase tracking-widest transition-all",
                isActive 
                  ? "bg-primary text-white shadow-xl shadow-primary/20 scale-105" 
                  : "text-neutral-400 hover:text-primary hover:bg-neutral-50"
              )}
            >
              <Icon size={20} />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

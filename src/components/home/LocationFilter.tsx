import React from 'react';
import { useHomeStore } from '../../store/homeStore';
import { GOVERNORATES, CITIES } from '../../constants';
import { cn } from '../../lib/utils';
import { MapPin, X } from 'lucide-react';

export function LocationFilter() {
  const { 
    selectedGovernorate, 
    selectedCity, 
    setFilters, 
    language,
    resetFilters 
  } = useHomeStore();

  const isRtl = language === 'ar' || language === 'ku';

  const handleGovernorateSelect = (id: string) => {
    if (id === 'all') {
      resetFilters();
    } else {
      setFilters({ selectedGovernorate: id, selectedCity: null });
    }
  };

  const currentGovernorate = GOVERNORATES.find(g => g.id === selectedGovernorate);
  const cities = selectedGovernorate ? CITIES[selectedGovernorate] || [] : [];

  return (
    <div className="max-w-6xl mx-auto px-6 mb-12 space-y-6">
      {/* Governorates */}
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          <MapPin size={20} />
        </div>
        <div className="flex-1 overflow-x-auto no-scrollbar py-2">
          <div className="flex gap-3">
            {GOVERNORATES.map((g) => (
              <button
                key={g.id}
                onClick={() => handleGovernorateSelect(g.id)}
                className={cn(
                  "flex-shrink-0 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all",
                  (selectedGovernorate === g.id || (g.id === 'all' && !selectedGovernorate))
                    ? "bg-primary text-white shadow-xl shadow-primary/20 scale-105"
                    : "bg-white text-neutral-500 hover:bg-neutral-50 border border-neutral-100"
                )}
              >
                {g[language] || g.en}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cities - Conditional */}
      {selectedGovernorate && selectedGovernorate !== 'all' && cities.length > 0 && (
        <div className="flex flex-wrap gap-2 pl-14 animate-in fade-in slide-in-from-top-4 duration-300">
          <button
            onClick={() => setFilters({ selectedCity: null })}
            className={cn(
              "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border",
              !selectedCity 
                ? "bg-accent text-white border-accent shadow-lg"
                : "bg-white text-neutral-400 border-neutral-100 hover:border-accent/40"
            )}
          >
            {language === 'ar' ? 'الكل' : language === 'ku' ? 'هەموو' : 'All Cities'}
          </button>
          {cities.map((city) => (
            <button
              key={city.id}
              onClick={() => setFilters({ selectedCity: city.id })}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border",
                selectedCity === city.id
                  ? "bg-accent text-white border-accent shadow-lg"
                  : "bg-white text-neutral-400 border-neutral-100 hover:border-accent/40 hover:text-accent"
              )}
            >
              {city[language] || city.en}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

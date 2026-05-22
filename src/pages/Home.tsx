import React, { useState, useMemo, useEffect } from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { FeaturesSection } from '../components/home/FeaturesSection';
import { MainTabSwitcher } from '../components/home/MainTabSwitcher';
import { LocationFilter } from '../components/home/LocationFilter';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { CategorySection } from '../components/home/CategorySection';
import { SocialFeed } from '../components/home/SocialFeed';
import { FeedHomeSection } from '../components/home/FeedHomeSection';
import { BusinessDetailModal } from '../components/home/BusinessDetailModal';
import { AddBusinessModal } from '../components/home/AddBusinessModal';
import { useBusinesses } from '../hooks/useBusinesses';
import { useHomeStore } from '../store/homeStore';
import { useAuthStore } from '../store/authStore';
import { useAdminDB } from '../hooks/useAdminDB';
import { CATEGORIES } from '../constants';
import { cn } from '../lib/utils';
import { BusinessMap } from '../components/BusinessMap';
import { Business } from '../types';
import { Plus, LayoutGrid, Map as MapIcon, MapPin, SearchX, RotateCcw } from 'lucide-react';
import { HeroSkeleton, CategorySkeleton, BusinessCardSkeleton } from '../components/ui/Skeleton';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';
import { EditableWrapper } from '../components/BuildModeEditor/EditableWrapper';
import { EditorField } from '../components/BuildModeEditor/InlineEditor';
import { isAdmin as checkIsAdmin } from '../lib/adminAuth';

export default function Home() {
  const { 
    activeTab, 
    viewMode, 
    setViewMode, 
    selectedGovernorate, 
    selectedCity, 
    selectedCategory,
    language,
    searchQuery,
    isEditMode,
    resetFilters
  } = useHomeStore();
  const { profile } = useAuthStore();
  const { fetchSettings, updateSetting } = useAdminDB();
  
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [isAddBusinessOpen, setIsAddBusinessOpen] = useState(false);
  const [settings, setSettings] = useState<any>({});

  const isRtl = language === 'ar' || language === 'ku';
  const isAdmin = checkIsAdmin(profile);

  useEffect(() => {
    async function loadSettings() {
      const { data } = await fetchSettings();
      if (data) {
        const s = data.reduce((acc: any, curr: any) => ({ ...acc, [curr.key]: curr }), {});
        setSettings(s);
      }
    }
    loadSettings();
  }, []);

  const handleUpdateSetting = async (key: string, values: any) => {
    const { error } = await updateSetting(key, values);
    if (!error) setSettings((prev: any) => ({ ...prev, [key]: { ...prev[key], ...values } }));
  };

  const titleFields: EditorField[] = [
    { name: 'value_en', label: 'Title (EN)', type: 'text' },
    { name: 'value_ar', label: 'Title (AR)', type: 'text', dir: 'rtl' },
    { name: 'value_ku', label: 'Title (KU)', type: 'text', dir: 'rtl' },
  ];

  const { businesses, loading, refresh } = useBusinesses({ 
    governorate: selectedGovernorate,
    city: selectedCity,
    category: selectedCategory,
    searchQuery: searchQuery
  });

  return (
    <div className={cn("min-h-screen bg-[#F7F7F5] pb-20", isRtl ? "font-arabic" : "font-sans")}>
      <main className="max-w-7xl mx-auto pt-32">
        <ErrorBoundary>
          {loading ? <HeroSkeleton /> : <HeroSection />}
        </ErrorBoundary>

        <FeaturesSection />
        
        <FeedHomeSection />

        <MainTabSwitcher />

        {activeTab === 'guide' ? (
          <div className="mt-12 space-y-12 animate-in fade-in duration-500">
            <LocationFilter />
            
            <div className="px-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <EditableWrapper
                  title="Edit Home Directory Title"
                  fields={titleFields}
                  initialValues={settings.directory_main_title || { value_en: 'Business Directory', value_ar: 'دليل الأعمال', value_ku: 'دلیل الأعمال' }}
                  onSave={(v) => handleUpdateSetting('directory_main_title', v)}
                  isEnabled={isEditMode && isAdmin}
                >
                  <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight font-arabic">
                    {settings.directory_main_title?.[`value_${language}`] || settings.directory_main_title?.value_en || (language === 'ar' ? 'دليل الأعمال' : 'Business Directory')}
                  </h2>
                </EditableWrapper>
                
                <EditableWrapper
                  title="Edit Home Directory Subtitle"
                  fields={titleFields}
                  initialValues={settings.directory_main_subtitle || { value_en: 'Discover the best local services', value_ar: 'استكشف أفضل الخدمات في منطقتك', value_ku: 'Discover the best local services' }}
                  onSave={(v) => handleUpdateSetting('directory_main_subtitle', v)}
                  isEnabled={isEditMode && isAdmin}
                >
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mt-1">
                    {settings.directory_main_subtitle?.[`value_${language}`] || settings.directory_main_subtitle?.value_en || (language === 'ar' ? 'استكشف أفضل الخدمات في منطقتك' : 'Discover the best local services')}
                  </p>
                </EditableWrapper>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsAddBusinessOpen(true)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-neutral-100 rounded-2xl text-[10px] font-black uppercase text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                >
                  <Plus size={16} />
                  {language === 'ar' ? 'أضف عملك' : 'Add Business'}
                </button>
                <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-neutral-100">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={cn("p-2.5 rounded-xl transition-all", viewMode === 'grid' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-neutral-400 hover:text-primary")}
                  >
                    <LayoutGrid size={20} />
                  </button>
                  <button 
                    onClick={() => setViewMode('map')}
                    className={cn("p-2.5 rounded-xl transition-all", viewMode === 'map' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-neutral-400 hover:text-primary")}
                  >
                    <MapIcon size={20} />
                  </button>
                </div>
              </div>
            </div>

            {loading ? <CategorySkeleton /> : <CategoryGrid />}
            
            <div id="directory-section" className="px-6 space-y-20">
              <ErrorBoundary>
                {viewMode === 'grid' ? (
                  loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {[1, 2, 3, 4, 5, 6].map(i => <BusinessCardSkeleton key={i} />)}
                    </div>
                  ) : (
                    <DirectoryContent 
                      businesses={businesses} 
                      onBusinessClick={setSelectedBusiness} 
                      selectedCategory={selectedCategory}
                      onReset={resetFilters}
                    />
                  )
                ) : (
                  <BusinessMap />
                )}
              </ErrorBoundary>
            </div>
          </div>
        ) : (
          <div className="mt-12 animate-in fade-in duration-500">
            <ErrorBoundary>
              <SocialFeed />
            </ErrorBoundary>
          </div>
        )}
      </main>

      {/* Modals */}
      <BusinessDetailModal 
        business={selectedBusiness} 
        onClose={() => setSelectedBusiness(null)} 
      />
      <AddBusinessModal 
        isOpen={isAddBusinessOpen} 
        onClose={() => setIsAddBusinessOpen(false)} 
        onSuccess={() => { refresh(); setIsAddBusinessOpen(false); }}
      />

      {/* Simple PWA Install Button Placeholder */}
      <button className="fixed bottom-8 left-8 p-4 bg-white rounded-full shadow-2xl border border-neutral-100 hidden md:flex items-center gap-3 hover:scale-105 transition-all z-40">
        <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white">
          <Plus size={16} />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 pr-2">Install App</span>
      </button>
    </div>
  );
}


function DirectoryContent({ 
  businesses, 
  onBusinessClick, 
  selectedCategory,
  onReset 
}: { 
  businesses: Business[], 
  onBusinessClick: (b: Business) => void, 
  selectedCategory: string | null,
  onReset: () => void
}) {
  const { language } = useHomeStore();
  
  // Group by category if no specific category selected
  const displayCategories = useMemo(() => {
    if (selectedCategory) {
      return CATEGORIES.filter(c => c.id === selectedCategory);
    }
    return CATEGORIES.slice(0, 8);
  }, [selectedCategory]);

  const hasAnyResults = businesses.length > 0;

  if (!hasAnyResults) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[40px] border-2 border-dashed border-neutral-100">
        <div className="w-20 h-20 bg-neutral-50 text-neutral-300 rounded-3xl flex items-center justify-center mb-6">
          <SearchX size={40} />
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-2 font-arabic">
          {language === 'ar' ? 'لا توجد نتائج' : 'No results found'}
        </h3>
        <p className="text-neutral-400 font-medium mb-8 max-w-xs">
          {language === 'ar' 
            ? 'حاول تغيير معايير البحث أو اختيار محافظة أخرى.' 
            : 'Try changing your search criteria or selecting a different governorate.'}
        </p>
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
        >
          <RotateCcw size={16} />
          {language === 'ar' ? 'إعادة ضبط الفلاتر' : 'Clear Filters'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {displayCategories.map(cat => {
        const catBiz = businesses.filter(b => b.category.toLowerCase() === cat.id);
        if (catBiz.length === 0) return null;

        return (
          <CategorySection
            key={cat.id}
            id={`category-section-${cat.id}`}
            title={language === 'ar' ? cat.ar : cat.en}
            businesses={catBiz}
            onBusinessClick={onBusinessClick}
            onViewAll={() => {}}
          />
        );
      })}
    </div>
  );
}

function NoResults() {
  const { language } = useHomeStore();
  return (
    <div className="text-center py-32 bg-white rounded-[48px] shadow-sm border border-neutral-100">
      <div className="w-20 h-20 bg-neutral-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 text-neutral-200">
        <MapPin size={40} />
      </div>
      <h3 className="text-2xl font-black text-gray-900 mb-2">
        {language === 'ar' ? 'لا توجد نتائج' : 'No results found'}
      </h3>
      <p className="text-neutral-400 font-bold text-sm tracking-widest uppercase">
        {language === 'ar' ? 'جرب تغيير المنطقة أو التصنيف' : 'Try changing your filters'}
      </p>
    </div>
  );
}



import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { CATEGORIES } from '../../constants';
import { useHomeStore } from '../../store/homeStore';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';
import { ChevronDown, Plus } from 'lucide-react';
import { useAdminDB } from '../../hooks/useAdminDB';
import { SiteCategory } from '../../types';
import { EditableWrapper } from '../BuildModeEditor/EditableWrapper';
import { EditorField } from '../BuildModeEditor/InlineEditor';
import { useAuthStore } from '../../store/authStore';
import { isAdmin as checkIsAdmin } from '../../lib/adminAuth';

export function CategoryGrid() {
  const { selectedCategory, setFilters, language, isEditMode } = useHomeStore();
  const { profile } = useAuthStore();
  const [showAll, setShowAll] = useState(false);
  const [categories, setCategories] = useState<SiteCategory[]>([]);
  const { fetchCategories, updateCategory, createCategory, deleteCategory, fetchSettings, updateSetting } = useAdminDB();
  const [settings, setSettings] = useState<any>({});
  const isAdmin = checkIsAdmin(profile);
  const isRtl = language === 'ar' || language === 'ku';

  useEffect(() => {
    async function loadData() {
      const { data, error } = await fetchCategories();
      if (!error && data && data.length > 0) {
        setCategories(data);
      } else {
        // Fallback or static initial load
        const initial = CATEGORIES.map((c, i) => ({
          id: c.id,
          slug: c.id,
          name_en: c.en,
          name_ar: c.ar,
          name_ku: c.ku,
          icon: c.icon,
          image_url: c.image,
          sort_order: i,
          is_active: true
        }));
        setCategories(initial as SiteCategory[]);
      }
    }
    async function loadSettings() {
      const { data } = await fetchSettings();
      if (data) {
        const s = data.reduce((acc: any, curr: any) => ({ ...acc, [curr.key]: curr }), {});
        setSettings(s);
      }
    }
    loadData();
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

  const handleSaveCategory = async (catId: string, values: any) => {
    const isNew = !categories.find(c => c.id === catId);
    if (isNew) {
      const { error } = await createCategory(values);
      if (!error) refreshData();
    } else {
      const { error } = await updateCategory(catId, values);
      if (!error) {
        setCategories(prev => prev.map(c => c.id === catId ? { ...c, ...values } : c));
      }
    }
  };

  const handleDeleteCategory = async (catId: string) => {
    const { error } = await deleteCategory(catId);
    if (!error) {
      setCategories(prev => prev.filter(c => c.id !== catId));
    }
  };

  const refreshData = async () => {
    const { data } = await fetchCategories();
    if (data) setCategories(data);
  };

  const categoryFields: EditorField[] = [
    { name: 'name_en', label: 'Name (EN)', type: 'text' },
    { name: 'name_ar', label: 'Name (AR)', type: 'text', dir: 'rtl' },
    { name: 'name_ku', label: 'Name (KU)', type: 'text', dir: 'rtl' },
    { name: 'slug', label: 'Slug', type: 'text' },
    { name: 'icon', label: 'Icon (Lucide name)', type: 'text' },
    { name: 'image_url', label: 'Category image', type: 'image', folder: 'categories' },
    { name: 'sort_order', label: 'Sort Order', type: 'number' },
    { name: 'is_active', label: 'Active', type: 'checkbox' },
  ];

  const displayedCategories = showAll ? categories : categories.slice(0, 10);

  return (
    <div className="max-w-6xl mx-auto px-6 mb-20 scroll-mt-24" id="categories">
      <div className="flex items-center justify-between mb-8">
        <div>
          <EditableWrapper
            title="Edit Directory Title"
            fields={titleFields}
            initialValues={settings.directory_title || { value_en: 'Browse Categories', value_ar: 'تصفح الفئات', value_ku: 'گەڕان بەپێی پۆلەکان' }}
            onSave={(v) => handleUpdateSetting('directory_title', v)}
            isEnabled={isEditMode && isAdmin}
          >
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight font-arabic">
              {settings.directory_title?.[`value_${language}`] || settings.directory_title?.value_en || (language === 'ar' ? 'تصفح الفئات' : language === 'ku' ? 'گەڕان بەپێی پۆلەکان' : 'Browse Categories')}
            </h2>
          </EditableWrapper>
          
          <EditableWrapper
            title="Edit Directory Subtitle"
            fields={titleFields}
            initialValues={settings.directory_subtitle || { value_en: 'Discover services in your city', value_ar: 'استكشف الخدمات في مدينتك', value_ku: 'خزمەتگوزارییەکان لە شارەکەت بدۆزەرەوە' }}
            onSave={(v) => handleUpdateSetting('directory_subtitle', v)}
            isEnabled={isEditMode && isAdmin}
          >
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em] mt-1">
              {settings.directory_subtitle?.[`value_${language}`] || settings.directory_subtitle?.value_en || (language === 'ar' ? 'استكشف الخدمات في مدينتك' : language === 'ku' ? 'خزمەتگوزارییەکان لە شارەکەت بدۆزەرەوە' : 'Discover services in your city')}
            </p>
          </EditableWrapper>
        </div>

        {isEditMode && isAdmin && (
          <EditableWrapper
            title="Add New Category"
            fields={categoryFields}
            initialValues={{ name_en: '', name_ar: '', name_ku: '', slug: '', icon: 'Briefcase', image_url: '', sort_order: categories.length, is_active: true }}
            onSave={(v) => handleSaveCategory('new-' + Date.now(), v)}
          >
            <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
              <Plus size={16} />
              Add Category
            </button>
          </EditableWrapper>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {displayedCategories.map((category, index) => {
          const IconComponent = (Icons as any)[category.icon || 'Briefcase'] || Icons.Briefcase;
          const isActive = selectedCategory === category.slug;

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative"
            >
              <EditableWrapper
                title="Edit Category"
                fields={categoryFields}
                initialValues={category}
                onSave={(v) => handleSaveCategory(category.id, v)}
                onDelete={() => handleDeleteCategory(category.id)}
                overlayClassName="rounded-[32px]"
                isEnabled={isEditMode && isAdmin}
              >
                <button
                  onClick={() => {
                    setFilters({ selectedCategory: category.slug });
                    document.getElementById('directory-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={cn(
                    "group relative w-full aspect-[4/5] rounded-[32px] overflow-hidden shadow-lg transition-all hover:-translate-y-2 hover:shadow-2xl",
                    isActive ? "ring-4 ring-primary ring-offset-4" : ""
                  )}
                >
                  <img 
                    src={category.image_url || 'https://picsum.photos/seed/category/400/500'} 
                    alt="" 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  
                  <div className={cn(
                    "absolute inset-0 transition-opacity duration-300",
                    isActive ? "bg-primary/80" : "bg-gradient-to-t from-black/90 via-black/20 to-transparent group-hover:from-primary/90"
                  )} />

                  <div className="absolute inset-0 p-6 flex flex-col items-center justify-center text-center">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300",
                      isActive ? "bg-white text-primary" : "bg-white/20 backdrop-blur-md text-white group-hover:bg-accent group-hover:text-white"
                    )}>
                      <IconComponent size={24} />
                    </div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-white">
                      {language === 'ar' ? (category.name_ar || category.name_en) : (category.name_en || category.name_ar)}
                    </h3>
                  </div>
                </button>
              </EditableWrapper>
            </motion.div>
          );
        })}
      </div>

      {!showAll && categories.length > 10 && (
        <div className="mt-12 text-center">
          <button
            onClick={() => setShowAll(true)}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-white border border-neutral-100 rounded-2xl shadow-xl hover:shadow-2xl transition-all"
          >
            <span className="text-xs font-black uppercase tracking-widest text-neutral-500 group-hover:text-primary">
              {language === 'ar' ? 'عرض الكل' : language === 'ku' ? 'هەمووی نیشان بدە' : 'Load More'}
            </span>
            <ChevronDown size={18} className="text-neutral-400 group-hover:text-primary animate-bounce" />
          </button>
        </div>
      )}
    </div>
  );
}

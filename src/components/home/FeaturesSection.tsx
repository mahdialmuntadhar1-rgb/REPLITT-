import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { useHomeStore } from '../../store/homeStore';
import { useAuthStore } from '../../store/authStore';
import { useAdminDB } from '../../hooks/useAdminDB';
import { Feature } from '../../types';
import { isAdmin as checkIsAdmin } from '../../lib/adminAuth';
import { EditableWrapper } from '../BuildModeEditor/EditableWrapper';
import { EditorField } from '../BuildModeEditor/InlineEditor';
import { cn } from '../../lib/utils';

export function FeaturesSection() {
  const { language, isEditMode } = useHomeStore();
  const { profile } = useAuthStore();
  const { fetchFeatures, updateFeature, createFeature, deleteFeature, fetchSettings, updateSetting } = useAdminDB();
  const [features, setFeatures] = useState<Feature[]>([]);
  const [settings, setSettings] = useState<any>({});
  const isAdmin = checkIsAdmin(profile);
  const isRtl = language === 'ar' || language === 'ku';

  useEffect(() => {
    async function loadData() {
      const { data, error } = await fetchFeatures();
      if (!error && data && data.length > 0) {
        setFeatures(data);
      } else {
        // Fallback or static initial load
        const fallback: Feature[] = [
          {
            id: 'f1',
            title_en: 'Verified Local Businesses',
            title_ar: 'أعمال محلية موثقة',
            title_ku: 'کارە ناوخۆییە باوەڕپێکراوەکان',
            description_en: 'We manually verify every business to ensure you get high quality service.',
            description_ar: 'نحن نتحقق يدوياً من كل شركة لضمان حصولك على خدمة عالية الجودة.',
            description_ku: 'ئێمە بە دەست هەموو کۆمپانیایەک دەپشکنین بۆ دڵنیابوون لەوەی خزمەتگوزارییەکی کوالێتی بەرزت پێدەگات.',
            icon: 'ShieldCheck',
            image_url: null,
            sort_order: 0,
            is_active: true
          }
        ];
        setFeatures(fallback);
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

  const featureFields: EditorField[] = [
    { name: 'title_en', label: 'Title (EN)', type: 'text' },
    { name: 'title_ar', label: 'Title (AR)', type: 'text', dir: 'rtl' },
    { name: 'title_ku', label: 'Title (KU)', type: 'text', dir: 'rtl' },
    { name: 'description_en', label: 'Description (EN)', type: 'textarea' },
    { name: 'description_ar', label: 'Description (AR)', type: 'textarea', dir: 'rtl' },
    { name: 'description_ku', label: 'Description (KU)', type: 'textarea', dir: 'rtl' },
    { name: 'icon', label: 'Icon (Lucide name)', type: 'text' },
    { name: 'image_url', label: 'Feature image', type: 'image', folder: 'features' },
    { name: 'sort_order', label: 'Sort Order', type: 'number' },
    { name: 'is_active', label: 'Active', type: 'checkbox' },
  ];

  const handleSaveFeature = async (id: string, values: any) => {
    const isNew = !features.find(f => f.id === id);
    if (isNew) {
      const { error } = await createFeature(values);
      if (!error) refreshData();
    } else {
      const { error } = await updateFeature(id, values);
      if (!error) {
        setFeatures(prev => prev.map(f => f.id === id ? { ...f, ...values } : f));
      }
    }
  };

  const handleDeleteFeature = async (id: string) => {
    const { error } = await deleteFeature(id);
    if (!error) setFeatures(prev => prev.filter(f => f.id !== id));
  };

  const refreshData = async () => {
    const { data } = await fetchFeatures();
    if (data) setFeatures(data);
  };

  return (
    <section className="max-w-6xl mx-auto px-6 mb-20">
      <div className="flex items-center justify-between mb-12">
        <div className={isRtl ? "text-right" : "text-left"}>
          <EditableWrapper
            title="Edit Features Title"
            fields={titleFields}
            initialValues={settings.features_title || { value_en: 'Why Shaku Maku?', value_ar: 'لماذا شكو ماكو؟', value_ku: 'بۆچی شکو ماکو؟' }}
            onSave={(v) => handleUpdateSetting('features_title', v)}
            isEnabled={isEditMode && isAdmin}
          >
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight font-arabic">
              {settings.features_title?.[`value_${language}`] || settings.features_title?.value_en || 'Why Shaku Maku?'}
            </h2>
          </EditableWrapper>
          
          <EditableWrapper
            title="Edit Features Subtitle"
            fields={titleFields}
            initialValues={settings.features_subtitle || { value_en: 'The best way to explore Iraq', value_ar: 'أفضل طريقة لاستكشاف العراق', value_ku: ' باشترین ڕێگە بۆ گەڕان لە عێراق' }}
            onSave={(v) => handleUpdateSetting('features_subtitle', v)}
            isEnabled={isEditMode && isAdmin}
          >
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mt-1">
              {settings.features_subtitle?.[`value_${language}`] || settings.features_subtitle?.value_en || 'The best way to explore Iraq'}
            </p>
          </EditableWrapper>
        </div>

        {isEditMode && isAdmin && (
          <EditableWrapper
            title="Add New Feature"
            fields={featureFields}
            initialValues={{ title_en: '', title_ar: '', title_ku: '', description_en: '', description_ar: '', description_ku_en: '', icon: 'Star', sort_order: features.length, is_active: true }}
            onSave={(v) => handleSaveFeature('new-' + Date.now(), v)}
          >
            <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
              <Plus size={16} />
              Add Feature
            </button>
          </EditableWrapper>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.filter(f => f.is_active || isEditMode).map((feature, index) => {
          const IconComponent = (Icons as any)[feature.icon || 'Star'] || Icons.Star;
          
          return (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <EditableWrapper
                title="Edit Feature"
                fields={featureFields}
                initialValues={feature}
                onSave={(v) => handleSaveFeature(feature.id, v)}
                onDelete={() => handleDeleteFeature(feature.id)}
                isEnabled={isEditMode && isAdmin}
                overlayClassName="rounded-[40px]"
              >
                <div className={cn(
                  "h-full p-8 rounded-[40px] bg-white border border-neutral-100 shadow-sm hover:shadow-xl transition-all group",
                  !feature.is_active && "opacity-50 grayscale"
                )}>
                  <div className="w-16 h-16 rounded-[24px] bg-primary/5 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <IconComponent size={32} />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-4 font-arabic">
                    {language === 'ar' ? (feature.title_ar || feature.title_en) : (feature.title_en || feature.title_ar)}
                  </h3>
                  <p className="text-neutral-500 font-medium leading-relaxed">
                    {language === 'ar' ? (feature.description_ar || feature.description_en) : (feature.description_en || feature.description_ar)}
                  </p>
                </div>
              </EditableWrapper>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

import React, { useEffect, useState } from 'react';
import { useHomeStore } from '../../store/homeStore';
import { useAuthStore } from '../../store/authStore';
import { useBuildModeStore } from '../../store/buildModeStore';
import { useAdminDB } from '../../hooks/useAdminDB';
import { cn } from '../../lib/utils';
import { Sparkles, ArrowRight, Heart, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
import { isAdmin as checkIsAdmin } from '../../lib/adminAuth';
import { EditableWrapper } from '../BuildModeEditor/EditableWrapper';
import { EditorField } from '../BuildModeEditor/InlineEditor';

export function FeedHomeSection() {
  const { language, isEditMode, setActiveTab } = useHomeStore();
  const { profile } = useAuthStore();
  const { fetchSettings, updateSetting } = useAdminDB();
  const { feedPosts } = useBuildModeStore();
  const [settings, setSettings] = useState<any>({});
  const isAdmin = checkIsAdmin(profile);
  const isRtl = language === 'ar' || language === 'ku';

  const posts = feedPosts.slice(0, 6);

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

  const handleUpdateTitle = async (values: any) => {
    const { error } = await updateSetting('feed_title', values);
    if (!error) setSettings((prev: any) => ({ ...prev, feed_title: { ...prev.feed_title, ...values } }));
  };

  const handleUpdateSubtitle = async (values: any) => {
    const { error } = await updateSetting('feed_subtitle', values);
    if (!error) setSettings((prev: any) => ({ ...prev, feed_subtitle: { ...prev.feed_subtitle, ...values } }));
  };

  const titleFields: EditorField[] = [
    { name: 'value_en', label: 'Title (EN)', type: 'text' },
    { name: 'value_ar', label: 'Title (AR)', type: 'text', dir: 'rtl' },
    { name: 'value_ku', label: 'Title (KU)', type: 'text', dir: 'rtl' },
  ];

  if (posts.length === 0) return null;

  const feedTitle = settings.feed_title?.[`value_${language}`] || settings.feed_title?.value_en || 'Shaku Maku Community';
  const feedSubtitle = settings.feed_subtitle?.[`value_${language}`] || settings.feed_subtitle?.value_en || 'Latest events & offers';

  return (
    <section className="py-16 scroll-mt-24 bg-white/50 backdrop-blur-sm mt-12 mb-12 border-y border-neutral-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
              <Sparkles size={28} />
            </div>
            <div>
              <EditableWrapper
                title="Edit Feed Title"
                fields={titleFields}
                initialValues={settings.feed_title || { value_en: 'Shaku Maku Community', value_ar: 'شكو ماكو', value_ku: 'شکو ماكو' }}
                onSave={handleUpdateTitle}
                isEnabled={isEditMode && isAdmin}
              >
                <h2 className={cn("text-3xl font-black text-gray-900 leading-tight", isRtl ? "font-arabic" : "")}>
                  {feedTitle}
                </h2>
              </EditableWrapper>
              
              <EditableWrapper
                title="Edit Feed Subtitle"
                fields={titleFields}
                initialValues={settings.feed_subtitle || { value_en: 'Latest events & offers', value_ar: 'أحدث الفعاليات والعروض', value_ku: 'Latest events & offers' }}
                onSave={handleUpdateSubtitle}
                isEnabled={isEditMode && isAdmin}
              >
                <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest mt-1">
                  {feedSubtitle}
                </p>
              </EditableWrapper>
            </div>
          </div>

          <button 
            onClick={() => setActiveTab('shakumaku')}
            className="group flex items-center gap-3 px-8 py-4 bg-white hover:bg-neutral-900 rounded-[24px] border border-neutral-100 shadow-xl transition-all"
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 group-hover:text-white">
              {language === 'ar' ? 'عرض الكل' : 'Visit Community'}
            </span>
            <ArrowRight size={18} className={cn("text-neutral-400 group-hover:text-white transition-transform group-hover:translate-x-1", isRtl ? "rotate-180" : "")} />
          </button>
        </div>

        <div className="relative">
          <div className="flex overflow-x-auto gap-8 no-scrollbar pb-12 px-2 -mx-2 snap-x snap-mandatory">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex-shrink-0 w-[300px] md:w-[350px] snap-center"
              >
                <div className="group bg-white rounded-[40px] overflow-hidden shadow-xl border border-neutral-100 hover:shadow-2xl transition-all h-full flex flex-col">
                  <div className="relative aspect-square overflow-hidden">
                    <img 
                      src={post.image_url} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-black text-[10px] uppercase ring-2 ring-white/10">
                             {post.businessName?.[0] || 'U'}
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[10px] font-black text-white uppercase tracking-wider">{post.businessName}</span>
                             <span className="text-[8px] font-bold text-white/60 uppercase">{new Date(post.created_at).toLocaleDateString()}</span>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <p className={cn("text-sm font-medium text-neutral-600 line-clamp-3 mb-6", isRtl ? "text-right font-arabic" : "text-left")}>
                      {post.caption}
                    </p>
                    
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-neutral-50">
                      <div className="flex items-center gap-5">
                        <div className="flex items-center gap-1.5 text-neutral-400 group-hover:text-red-500 transition-colors">
                          <Heart size={16} />
                          <span className="text-[10px] font-black">{post.likes || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-neutral-400 group-hover:text-primary transition-colors">
                          <MessageSquare size={16} />
                          <span className="text-[10px] font-black">24</span>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:text-primary transition-all">
                         <ArrowRight size={16} className={isRtl ? "rotate-180" : ""} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className={cn(
            "absolute top-0 bottom-12 w-24 pointer-events-none bg-gradient-to-r from-[#F7F7F5] to-transparent z-10",
            isRtl ? "right-0 rotate-180" : "left-0"
          )} />
          <div className={cn(
            "absolute top-0 bottom-12 w-24 pointer-events-none bg-gradient-to-l from-[#F7F7F5] to-transparent z-10",
            isRtl ? "left-0 rotate-180" : "right-0"
          )} />
        </div>
      </div>
    </section>
  );
}

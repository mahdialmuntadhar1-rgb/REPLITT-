import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Image as ImageIcon, LayoutGrid, Plus, Trash2, Edit3, Upload, Save, ChevronRight } from 'lucide-react';
import { useHomeStore } from '../store/homeStore';
import { useAdminDB } from '../hooks/useAdminDB';
import { useHeroSlides, usePosts } from '../hooks/useSupabaseData';
import { cn } from '../lib/utils';

export function BuildModePanel() {
  const { isBuildModeOpen, setIsBuildModeOpen } = useHomeStore();
  const [activeTab, setActiveTab] = useState<'hero' | 'feed'>('hero');
  const { slides, loading: slidesLoading } = useHeroSlides();
  const { posts, loading: postsLoading } = usePosts();
  const { updateHeroSlide, createHeroSlide, deleteHeroSlide, updatePost, createPost, deletePost, uploadImage, loading: actionLoading } = useAdminDB();

  if (!isBuildModeOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] pointer-events-none">
        {/* Backdrop for mobile */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsBuildModeOpen(false)}
          className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto md:hidden"
        />

        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl pointer-events-auto border-l border-neutral-100 flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-900 text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Settings size={18} className="text-white" />
              </div>
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-white">Build Mode</h2>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Platform Editor</p>
              </div>
            </div>
            <button 
              onClick={() => setIsBuildModeOpen(false)}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex p-4 gap-2 bg-neutral-100/50">
            <button 
              onClick={() => setActiveTab('hero')}
              className={cn(
                "flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border",
                activeTab === 'hero' ? "bg-white border-neutral-200 text-primary shadow-sm" : "text-neutral-500 border-transparent hover:bg-white/50"
              )}
            >
               Hero Slides
            </button>
            <button 
              onClick={() => setActiveTab('feed')}
              className={cn(
                "flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border",
                activeTab === 'feed' ? "bg-white border-neutral-200 text-primary shadow-sm" : "text-neutral-500 border-transparent hover:bg-white/50"
              )}
            >
              Feed Items
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === 'hero' ? (
              <SlidesEditor 
                slides={slides} 
                loading={slidesLoading || actionLoading} 
                onUpdate={updateHeroSlide}
                onCreate={createHeroSlide}
                onDelete={deleteHeroSlide}
                onUpload={uploadImage}
              />
            ) : (
              <FeedEditor 
                posts={posts} 
                loading={postsLoading || actionLoading}
                onUpdate={updatePost}
                onCreate={createPost}
                onDelete={deletePost}
                onUpload={uploadImage}
              />
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function Settings({ size, className }: any) {
  return <Edit3 size={size} className={className} />;
}

function SlidesEditor({ slides, loading, onUpdate, onCreate, onDelete, onUpload }: any) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest">Active Slides ({slides.length})</h3>
        <button 
          onClick={() => onCreate({ title_en: 'New Slide', is_active: true, sort_order: slides.length })}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/70"
        >
          <Plus size={14} /> Add New
        </button>
      </div>
      
      {slides.map((slide: any) => (
        <div key={slide.id} className="bg-neutral-50 rounded-2xl border border-neutral-100 overflow-hidden group">
          <div className="aspect-[21/9] relative bg-neutral-200">
            {slide.image_url && <img src={slide.image_url} alt="" className="w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <label className="cursor-pointer bg-white p-2 rounded-lg text-primary hover:scale-110 transition-transform">
                <Upload size={16} />
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const { url } = await onUpload(file);
                      if (url) onUpdate(slide.id, { image_url: url });
                    }
                  }} 
                />
              </label>
              <button 
                onClick={() => onDelete(slide.id)}
                className="bg-white p-2 rounded-lg text-red-500 hover:scale-110 transition-transform"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <input 
              className="w-full bg-white border border-neutral-200 rounded-xl p-3 text-xs font-bold"
              value={slide.title_en || ''}
              onChange={(e) => onUpdate(slide.id, { title_en: e.target.value })}
              placeholder="Title (English)"
            />
            <div className="flex gap-2">
              <input 
                className="flex-1 bg-white border border-neutral-200 rounded-xl p-3 text-[10px] font-medium"
                value={slide.cta_text_en || ''}
                onChange={(e) => onUpdate(slide.id, { cta_text_en: e.target.value })}
                placeholder="Button Text"
              />
              <input 
                className="flex-[2] bg-white border border-neutral-200 rounded-xl p-3 text-[10px] font-medium"
                value={slide.cta_link || ''}
                onChange={(e) => onUpdate(slide.id, { cta_link: e.target.value })}
                placeholder="Link URL"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function FeedEditor({ posts, loading, onUpdate, onCreate, onDelete, onUpload }: any) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest">Feed Content</h3>
        <button 
          onClick={() => onCreate({ caption: 'New update', is_active: true, post_type: 'normal' })}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/70"
        >
          <Plus size={14} /> Add Post
        </button>
      </div>

      {posts.map((post: any) => (
        <div key={post.id} className="bg-neutral-50 rounded-2xl border border-neutral-100 p-4 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-neutral-200 rounded-xl overflow-hidden flex-shrink-0 relative group">
              {post.image_url && <img src={post.image_url} alt="" className="w-full h-full object-cover" />}
              <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white">
                <Upload size={14} />
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const { url } = await onUpload(file);
                      if (url) onUpdate(post.id, { image_url: url });
                    }
                  }} 
                />
              </label>
            </div>
            <div className="flex-1 space-y-2">
              <textarea 
                className="w-full bg-white border border-neutral-200 rounded-xl p-3 text-xs font-medium min-h-[80px]"
                value={post.caption || ''}
                onChange={(e) => onUpdate(post.id, { caption: e.target.value })}
                placeholder="Write a caption..."
              />
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
            <button 
              onClick={() => onUpdate(post.id, { is_active: !post.is_active })}
              className={cn(
                "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all",
                post.is_active ? "bg-primary/10 text-primary border-primary/20" : "bg-neutral-100 text-neutral-400 border-neutral-200"
              )}
            >
              {post.is_active ? 'Visible' : 'Hidden'}
            </button>
            <button 
              onClick={() => onDelete(post.id)}
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

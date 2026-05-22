import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useHomeStore } from '../../store/homeStore';
import { useAuthStore } from '../../store/authStore';
import { useAdminDB } from '../../hooks/useAdminDB';
import { X, Wrench, Image as ImageIcon, Layout, Settings, Save, Trash2, ArrowUp, ArrowDown, Plus, ChevronLeft, Link as LinkIcon, Edit3 } from 'lucide-react';
import { HeroSlide, Post } from '../../types';
import { ImageUploader } from './ImageUploader';
import { cn } from '../../lib/utils';
import { isAdmin as checkIsAdmin } from '../../lib/adminAuth';

export function BuildModeEditor() {
  const { isBuildModeOpen, setIsBuildModeOpen } = useHomeStore();
  const { profile } = useAuthStore();
  const isAdmin = checkIsAdmin(profile);

  if (!isAdmin) return null;

  return (
    <>
      <button
        onClick={() => setIsBuildModeOpen(true)}
        className="fixed bottom-8 right-8 z-[9000] w-14 h-14 bg-primary text-white rounded-3xl shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
      >
        <Wrench size={24} />
      </button>

      <AnimatePresence>
        {isBuildModeOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBuildModeOpen(false)}
              className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-[9999]"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-screen w-full max-w-lg bg-white shadow-2xl z-[10000] flex flex-col"
            >
              <BuildModePanelContent onClose={() => setIsBuildModeOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function BuildModePanelContent({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'hero' | 'feed'>('hero');
  const { 
    fetchHeroSlides, fetchPosts, 
    updateHeroSlide, createHeroSlide, deleteHeroSlide, reorderHeroSlides,
    updatePost, createPost, deletePost, reorderPosts 
  } = useAdminDB();
  
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const loadItems = async () => {
    setLoading(true);
    if (activeTab === 'hero') {
      const { data } = await fetchHeroSlides();
      setItems(data || []);
    } else {
      const { data } = await fetchPosts();
      setItems(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadItems();
    setEditingItem(null);
    setIsAddingNew(false);
  }, [activeTab]);

  const handleSave = async (formData: any) => {
    setLoading(true);
    let error;
    
    if (activeTab === 'hero') {
      if (isAddingNew) {
        const { error: err } = await createHeroSlide({ ...formData, sort_order: items.length });
        error = err;
      } else {
        const { error: err } = await updateHeroSlide(editingItem.id, formData);
        error = err;
      }
    } else {
      if (isAddingNew) {
        const { error: err } = await createPost({ ...formData, sort_order: items.length, is_active: true });
        error = err;
      } else {
        const { error: err } = await updatePost(editingItem.id, formData);
        error = err;
      }
    }

    if (!error) {
      await loadItems();
      setEditingItem(null);
      setIsAddingNew(false);
    } else {
      alert('Error saving changes: ' + error.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    setLoading(true);
    const { error } = activeTab === 'hero' ? await deleteHeroSlide(id) : await deletePost(id);
    if (!error) {
      setItems(items.filter(item => item.id !== id));
    } else {
      alert('Delete failed: ' + error.message);
    }
    setLoading(false);
  };

  const handleReorder = async (startIndex: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? startIndex - 1 : startIndex + 1;
    if (newIndex < 0 || newIndex >= items.length) return;

    const newItems = [...items];
    const [removed] = newItems.splice(startIndex, 1);
    newItems.splice(newIndex, 0, removed);
    
    setItems(newItems);
    if (activeTab === 'hero') {
      await reorderHeroSlides(newItems);
    } else {
      await reorderPosts(newItems);
    }
  };

  if (editingItem || isAddingNew) {
    return (
      <ItemForm 
        item={editingItem} 
        type={activeTab} 
        onBack={() => { setEditingItem(null); setIsAddingNew(false); }}
        onSave={handleSave}
        loading={loading}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#F7F7F5]">
      {/* Header */}
      <div className="p-8 border-b border-neutral-100 flex items-center justify-between bg-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20">
            <Wrench size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 leading-none">Build Mode</h2>
            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mt-1">Shaku Maku Panel</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="w-10 h-10 bg-neutral-50 rounded-xl flex items-center justify-center text-neutral-400 hover:text-primary transition-all"
        >
          <X size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div className="p-4 bg-white border-b border-neutral-100 flex gap-2">
        <button
          onClick={() => setActiveTab('hero')}
          className={cn(
            "flex-1 py-4 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
            activeTab === 'hero' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-neutral-400 hover:bg-neutral-50"
          )}
        >
          Hero Slides
        </button>
        <button
          onClick={() => setActiveTab('feed')}
          className={cn(
            "flex-1 py-4 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
            activeTab === 'feed' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-neutral-400 hover:bg-neutral-50"
          )}
        >
          Community Feed
        </button>
      </div>

      {/* List Content */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
            {items.length} {activeTab === 'hero' ? 'Slides' : 'Posts'} Active
          </span>
          <button 
            onClick={() => setIsAddingNew(true)}
            className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
          >
            <Plus size={14} /> Add New
          </button>
        </div>

        {loading && items.length === 0 ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-24 bg-white rounded-3xl animate-pulse shadow-sm" />)}
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={item.id} className="group p-4 bg-white border border-neutral-100 rounded-[32px] hover:border-primary/40 hover:shadow-xl transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-neutral-100 overflow-hidden ring-1 ring-neutral-200">
                    <img src={item.image_url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-gray-900 truncate">
                      {activeTab === 'hero' ? (item.title_en || 'Untitled Slide') : (item.caption || 'Untitled Post')}
                    </p>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase mt-1">Position #{index + 1}</p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEditingItem(item)} className="p-3 text-neutral-400 hover:text-primary transition-colors"><Edit3 size={18} /></button>
                    <button onClick={() => handleReorder(index, 'up')} className="p-3 text-neutral-400 hover:text-primary transition-colors disabled:opacity-30" disabled={index === 0}><ArrowUp size={18} /></button>
                    <button onClick={() => handleReorder(index, 'down')} className="p-3 text-neutral-400 hover:text-primary transition-colors disabled:opacity-30" disabled={index === items.length - 1}><ArrowDown size={18} /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-3 text-neutral-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ItemForm({ item, type, onBack, onSave, loading }: { item: any, type: string, onBack: () => void, onSave: (data: any) => void, loading: boolean }) {
  const [formData, setFormData] = useState<any>(item || {});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-8 border-b border-neutral-100 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-neutral-400 hover:text-primary transition-all">
          <ChevronLeft size={20} />
          <span className="text-[10px] font-black uppercase tracking-widest">Back to List</span>
        </button>
        <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{item ? 'Editing' : 'Creating'} {type === 'hero' ? 'Slide' : 'Post'}</span>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
        {/* Image Upload */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Media Content</label>
          <ImageUploader 
            value={formData.image_url} 
            onChange={(url) => setFormData({ ...formData, image_url: url })}
            folder={type}
          />
        </div>

        {type === 'hero' ? (
          <>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Title (EN)</label>
                <input 
                  type="text" 
                  value={formData.title_en || ''}
                  onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  className="w-full bg-neutral-50 border-none rounded-2xl px-6 py-4 font-black text-sm ring-1 ring-neutral-100 focus:ring-2 ring-primary/20 transition-all"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-arabic">العنوان (AR)</label>
                <input 
                  type="text"
                  dir="rtl"
                  value={formData.title_ar || ''}
                  onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                  className="w-full bg-neutral-50 border-none rounded-2xl px-6 py-4 font-black text-sm ring-1 ring-neutral-100 focus:ring-2 ring-primary/20 transition-all font-arabic"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Subtitle (EN)</label>
                <textarea 
                  rows={2}
                  value={formData.subtitle_en || ''}
                  onChange={(e) => setFormData({ ...formData, subtitle_en: e.target.value })}
                  className="w-full bg-neutral-50 border-none rounded-2xl px-6 py-4 font-black text-sm ring-1 ring-neutral-100 focus:ring-2 ring-primary/20 transition-all"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-arabic">الوصف الفرعي (AR)</label>
                <textarea 
                  rows={2}
                  dir="rtl"
                  value={formData.subtitle_ar || ''}
                  onChange={(e) => setFormData({ ...formData, subtitle_ar: e.target.value })}
                  className="w-full bg-neutral-50 border-none rounded-2xl px-6 py-4 font-black text-sm ring-1 ring-neutral-100 focus:ring-2 ring-primary/20 transition-all font-arabic"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Button Text (EN)</label>
                <input 
                  type="text"
                  value={formData.cta_text_en || ''}
                  onChange={(e) => setFormData({ ...formData, cta_text_en: e.target.value })}
                  className="w-full bg-neutral-50 border-none rounded-2xl px-6 py-4 font-black text-sm ring-1 ring-neutral-100 focus:ring-2 ring-primary/20 transition-all"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-arabic">نص الزر (AR)</label>
                <input 
                  type="text"
                  dir="rtl"
                  value={formData.cta_text_ar || ''}
                  onChange={(e) => setFormData({ ...formData, cta_text_ar: e.target.value })}
                  className="w-full bg-neutral-50 border-none rounded-2xl px-6 py-4 font-black text-sm ring-1 ring-neutral-100 focus:ring-2 ring-primary/20 transition-all font-arabic"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                <LinkIcon size={14} /> CTA Link
              </label>
              <input 
                type="url"
                value={formData.cta_link || ''}
                onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })}
                className="w-full bg-neutral-50 border-none rounded-2xl px-6 py-4 font-black text-sm ring-1 ring-neutral-100 focus:ring-2 ring-primary/20 transition-all font-mono"
                placeholder="https://..."
              />
            </div>
          </>
        ) : (
          <>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Caption / Content</label>
              <textarea 
                rows={4}
                value={formData.caption || formData.content || ''}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value, content: e.target.value })}
                className="w-full bg-neutral-50 border-none rounded-2xl px-6 py-4 font-black text-sm ring-1 ring-neutral-100 focus:ring-2 ring-primary/20 transition-all"
                placeholder="Enter the post content or description..."
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Post Type</label>
                <select 
                  value={formData.post_type || 'standard'}
                  onChange={(e) => setFormData({ ...formData, post_type: e.target.value })}
                  className="w-full bg-neutral-50 border-none rounded-2xl px-6 py-4 font-black text-sm ring-1 ring-neutral-100 focus:ring-2 ring-primary/20 transition-all"
                >
                  <option value="standard">Standard Update</option>
                  <option value="offer">Special Offer</option>
                  <option value="event">Upcoming Event</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Business ID (Optional)</label>
                <input 
                  type="text"
                  value={formData.businessId || ''}
                  onChange={(e) => setFormData({ ...formData, businessId: e.target.value })}
                  className="w-full bg-neutral-50 border-none rounded-2xl px-6 py-4 font-black text-sm ring-1 ring-neutral-100 focus:ring-2 ring-primary/20 transition-all font-mono"
                  placeholder="UUID or leave empty for generic"
                />
              </div>
            </div>
          </>
        )}
      </form>

      <div className="p-8 bg-neutral-50 border-t border-neutral-100 flex gap-4">
        <button 
          onClick={onBack}
          className="flex-1 px-8 py-5 rounded-3xl font-black text-[10px] uppercase tracking-widest text-neutral-400 bg-white border border-neutral-100 hover:text-primary transition-all"
        >
          Cancel
        </button>
        <button 
          onClick={handleSubmit}
          disabled={loading || !formData.image_url}
          className="flex-[2] bg-neutral-900 text-white p-5 rounded-3xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:bg-black transition-all disabled:opacity-50"
        >
          {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : (
            <>
              <Save size={18} /> {item ? 'Save Changes' : 'Create Now'}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

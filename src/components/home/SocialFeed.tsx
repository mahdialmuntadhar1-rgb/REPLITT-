import React, { useState, useRef } from 'react';
import { useHomeStore } from '../../store/homeStore';
import { useBuildModeStore, MockPost } from '../../store/buildModeStore';
import { Sparkles, TrendingUp, Clock, MessageSquare, Heart, Share2, Bookmark, CheckCircle2, ChevronDown, PhoneOff, Plus, Camera, Send, Trash2, Edit2, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export function SocialFeed() {
  const { language } = useHomeStore();
  const { feedPosts, addPost, updatePost, deletePost } = useBuildModeStore();
  const [activeFilter, setActiveFilter] = useState<'recent' | 'trending'>('recent');
  
  // Post Box State
  const [newCaption, setNewCaption] = useState('');
  const [newImage, setNewImage] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isRtl = language === 'ar' || language === 'ku';

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePost = () => {
    if (!newCaption && !newImage) return;
    setIsPosting(true);
    setTimeout(() => {
      addPost({
        caption: newCaption,
        image_url: newImage || 'https://picsum.photos/seed/post/1000/1000',
        businessName: 'Guest User'
      });
      setNewCaption('');
      setNewImage(null);
      setIsPosting(false);
    }, 500);
  };

  const sortedPosts = [...feedPosts].sort((a, b) => {
    if (activeFilter === 'trending') return b.likes - a.likes;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="max-w-2xl mx-auto space-y-12 pb-20">
      {/* Feed Header */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div>
          <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3 font-arabic">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Sparkles size={24} />
            </div>
            {language === 'ar' ? 'شكو ماكو' : language === 'ku' ? 'شکو ماکو' : 'Shaku Maku'}
          </h2>
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mt-1 pl-1">
            {language === 'ar' ? 'أحدث الفعاليات والعروض' : 'Latest events & offers'}
          </p>
        </div>

        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-neutral-100">
          <button
            onClick={() => setActiveFilter('recent')}
            className={cn(
              "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              activeFilter === 'recent' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-neutral-400 hover:text-primary"
            )}
          >
            {language === 'ar' ? 'الأحدث' : 'Recent'}
          </button>
          <button
            onClick={() => setActiveFilter('trending')}
            className={cn(
              "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              activeFilter === 'trending' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-neutral-400 hover:text-primary"
            )}
          >
            {language === 'ar' ? 'شائع' : 'Trending'}
          </button>
        </div>
      </div>

      {/* Post Box */}
      <div className="bg-white rounded-[40px] p-6 shadow-2xl shadow-neutral-200/50 border border-neutral-50 relative overflow-hidden group">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-xl bg-neutral-100 flex-shrink-0 flex items-center justify-center text-neutral-400">
            <Camera size={20} />
          </div>
          <div className="flex-1 space-y-4">
            <textarea
              placeholder={language === 'ar' ? 'ماذا يدور في ذهنك؟' : 'What is on your mind?'}
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
              className={cn(
                "w-full bg-neutral-50 border-none rounded-2xl px-5 py-4 text-sm font-medium focus:ring-2 ring-primary/20 transition-all outline-none resize-none",
                isRtl ? "text-right font-arabic" : "text-left"
              )}
              rows={2}
            />
            
            {newImage && (
              <div className="relative aspect-video rounded-3xl overflow-hidden border border-neutral-100 group/img">
                <img src={newImage} className="w-full h-full object-cover" />
                <button 
                  onClick={() => setNewImage(null)}
                  className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-all"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 text-neutral-400 hover:text-primary transition-colors text-[10px] font-black uppercase tracking-widest"
              >
                <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center">
                  <Camera size={18} />
                </div>
                {language === 'ar' ? 'أضف صورة' : 'Add Photo'}
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect} />
              
              <button
                onClick={handlePost}
                disabled={isPosting || (!newCaption && !newImage)}
                className="bg-primary text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all flex items-center gap-2"
              >
                {isPosting ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Sparkles size={16} /></motion.div> : <Send size={16} />}
                {language === 'ar' ? 'نشر' : 'Post Now'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feed Posts */}
      <div className="space-y-12">
        <AnimatePresence mode="popLayout">
          {sortedPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
            >
              <FeedPostCard 
                post={post} 
                isRtl={isRtl}
                onDelete={() => deletePost(post.id)}
                onUpdate={(updates) => updatePost(post.id, updates)}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {sortedPosts.length === 0 && (
          <div className="bg-white rounded-[48px] py-20 px-8 text-center border-2 border-dashed border-neutral-100">
             <div className="w-20 h-20 bg-neutral-50 text-neutral-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <PhoneOff size={40} />
             </div>
             <h3 className="text-2xl font-black text-gray-900 mb-2 font-arabic">
               {language === 'ar' ? 'لا توجد منشورات بعد' : 'No posts yet'}
             </h3>
             <p className="text-neutral-400 font-medium">
               {language === 'ar' ? 'كن أول من يشارك تحديثاته مع المجتمع!' : 'Be the first to share updates with the community!'}
             </p>
          </div>
        )}

        {/* Load More Button */}
        {sortedPosts.length > 0 && (
          <div className="flex justify-center pt-8">
            <button
              className="group flex items-center gap-3 px-10 py-5 bg-white rounded-[32px] shadow-xl hover:shadow-2xl hover:bg-neutral-900 hover:text-white transition-all border border-neutral-50"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 group-hover:text-white">
                {language === 'ar' ? 'عرض المزيد' : 'Load More Content'}
              </span>
              <ChevronDown size={18} className="text-neutral-400 group-hover:text-white animate-bounce" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function FeedPostCard({ post, isRtl, onDelete, onUpdate }: { post: MockPost, isRtl: boolean, onDelete: () => void, onUpdate: (u: any) => void }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCaption, setEditedCaption] = useState(post.caption);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleImageReplace = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onUpdate({ image_url: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEdit = () => {
    onUpdate({ caption: editedCaption });
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-[56px] overflow-hidden shadow-2xl border border-neutral-50 group transition-all">
      {/* Post Header */}
      <div className="p-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-[22px] bg-gradient-to-br from-primary/10 to-primary/5 p-0.5 flex items-center justify-center">
            <div className="w-full h-full rounded-[20px] bg-white flex items-center justify-center text-primary font-black text-sm uppercase ring-2 ring-primary/5">
              {post.businessName?.[0] || 'U'}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-black text-gray-900 group-hover:text-primary transition-colors">
                {post.businessName || 'Guest User'}
              </h4>
              <CheckCircle2 size={16} className="text-primary fill-primary/10" />
            </div>
            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
              <Clock size={12} />
              {new Date(post.created_at).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US')}
            </p>
          </div>
        </div>
        
        {/* Post Actions (Hover Only) */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => setIsEditing(true)}
            className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 hover:text-primary hover:bg-primary/10 transition-all hover:scale-110"
          >
            <Edit2 size={18} />
          </button>
          <button 
            onClick={onDelete}
            className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-all hover:scale-110"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-3">
        <div className="relative aspect-square rounded-[44px] overflow-hidden shadow-inner group/media">
          <img 
            src={post.image_url} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            referrerPolicy="no-referrer"
          />
          
          {/* Replace Image Overlay */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/media:opacity-100 transition-opacity z-10">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-white text-neutral-900 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
            >
              <Camera size={16} />
              Replace Image
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageReplace} />
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {isEditing ? (
          <div className="space-y-4">
            <textarea
              value={editedCaption}
              onChange={(e) => setEditedCaption(e.target.value)}
              className={cn(
                "w-full bg-neutral-50 border-none rounded-2xl px-5 py-4 text-sm font-medium focus:ring-2 ring-primary/20 transition-all outline-none resize-none",
                isRtl ? "text-right font-arabic" : "text-left"
              )}
              rows={3}
              autoFocus
            />
            <div className="flex gap-3">
              <button 
                onClick={handleSaveEdit}
                className="flex-1 bg-neutral-900 text-white rounded-2xl py-3 font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-black transition-all"
              >
                Save Changes
              </button>
              <button 
                onClick={() => { setIsEditing(false); setEditedCaption(post.caption); }}
                className="px-6 bg-neutral-100 text-neutral-400 rounded-2xl py-3 font-black text-[10px] uppercase tracking-widest hover:bg-neutral-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className={cn(
            "text-lg font-medium text-neutral-700 leading-relaxed",
            isRtl ? "text-right font-arabic" : "text-left"
          )}>
            {post.caption}
          </p>
        )}

        {/* Action Bar */}
        <div className="flex items-center justify-between border-t border-neutral-50 pt-6">
          <div className="flex items-center gap-8">
            <button 
              onClick={handleLike}
              className={cn(
                "flex items-center gap-3 transition-all hover:scale-110",
                isLiked ? "text-red-500" : "text-neutral-400 hover:text-red-500"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                isLiked ? "bg-red-50 text-red-500" : "bg-neutral-50"
              )}>
                <Heart size={22} fill={isLiked ? "currentColor" : "none"} />
              </div>
              <span className="text-xs font-black tracking-widest">{likes}</span>
            </button>
            
            <button 
              className="flex items-center gap-3 text-neutral-400 hover:text-primary transition-all hover:scale-110"
            >
              <div className="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center">
                <MessageSquare size={22} />
              </div>
              <span className="text-xs font-black tracking-widest">24</span>
            </button>
          </div>

          <button className="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-400 hover:text-primary transition-all hover:rotate-12">
            <Share2 size={22} />
          </button>
        </div>

        {/* Profile Link */}
        <button className="w-full bg-neutral-50 hover:bg-primary text-neutral-400 hover:text-white p-6 rounded-[28px] font-black text-[10px] uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-3">
          Visit {post.businessName || 'Business'} Profile
          <Sparkles size={14} />
        </button>
      </div>
    </div>
  );
}

import React from 'react';
import { Post } from '../../types';
import { EditableWrapper } from '../BuildModeEditor/EditableWrapper';
import { EditorField } from '../BuildModeEditor/InlineEditor';
import { useAdminDB } from '../../hooks/useAdminDB';
import { motion } from 'motion/react';
import { Heart, MessageCircle, Share2, MoreHorizontal, ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useHomeStore } from '../../store/homeStore';

interface EditablePostProps {
  post: Post;
  onRefresh: () => void;
}

export function EditablePost({ post, onRefresh }: EditablePostProps) {
  const { updatePost, deletePost } = useAdminDB();
  const { language } = useHomeStore();
  const isRtl = language === 'ar' || language === 'ku';

  const postFields: EditorField[] = [
    { name: 'caption', label: 'Caption / Content', type: 'textarea', dir: isRtl ? 'rtl' : 'ltr' },
    { name: 'image_url', label: 'Image URL', type: 'url' },
    { name: 'businessName', label: 'Business Name', type: 'text' },
    { name: 'post_type', label: 'Post Type', type: 'text' },
    { name: 'sort_order', label: 'Sort Order', type: 'number' },
    { name: 'is_active', label: 'Active', type: 'checkbox' },
    { name: 'is_featured', label: 'Featured / Trending', type: 'checkbox' },
  ];

  const handleSave = async (values: any) => {
    const { error } = await updatePost(post.id, values);
    if (!error) {
      onRefresh();
    } else {
      throw error;
    }
  };

  const handleDelete = async () => {
    const { error } = await deletePost(post.id);
    if (!error) {
      onRefresh();
    } else {
      throw error;
    }
  };

  return (
    <EditableWrapper
      title="Edit Post"
      fields={postFields}
      initialValues={post}
      onSave={handleSave}
      onDelete={handleDelete}
      className="mb-6"
      overlayClassName="rounded-3xl"
    >
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
        {/* Post Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 overflow-hidden ring-1 ring-neutral-200">
              <img 
                src={post.businessAvatar || 'https://picsum.photos/seed/business/100/100'} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <h3 className="font-black text-gray-900 text-sm">{post.businessName || 'Local Business'}</h3>
                {post.isVerified && <ShieldCheck size={14} className="text-primary fill-primary/10" />}
              </div>
              <p className="text-[10px] font-bold text-neutral-400">
                {new Date(post.created_at).toLocaleDateString(isRtl ? 'ar-IQ' : 'en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>
          <button className="text-neutral-400 hover:text-gray-900">
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* Content */}
        <p className={cn("text-sm text-gray-700 leading-relaxed mb-4", isRtl && "font-arabic")}>
          {post.caption || post.content}
        </p>

        {/* Image */}
        {post.image_url && (
          <div className="rounded-[24px] overflow-hidden mb-4 aspect-video bg-neutral-50 border border-neutral-100">
            <img 
              src={post.image_url} 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-50">
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-neutral-400 hover:text-red-500 transition-colors">
              <Heart size={20} className={cn(post.likes > 0 && "fill-red-500 text-red-500")} />
              <span className="text-xs font-black">{post.likes || 0}</span>
            </button>
            <button className="flex items-center gap-2 text-neutral-400 hover:text-primary transition-colors">
              <MessageCircle size={20} />
              <span className="text-xs font-black">{post.commentsCount || 0}</span>
            </button>
          </div>
          <button className="text-neutral-400 hover:text-primary transition-colors">
            <Share2 size={20} />
          </button>
        </div>
      </div>
    </EditableWrapper>
  );
}

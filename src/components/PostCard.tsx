import React from 'react';
import { Post } from '../types';
import { Heart, MessageCircle, Share2, MoreHorizontal, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { formatDistanceToNow } from 'date-fns';

export const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-[40px] shadow-sm border border-neutral-100 overflow-hidden mb-8"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 overflow-hidden border border-neutral-100">
              <img 
                src={post.businessAvatar || 'https://picsum.photos/seed/business/200'} 
                alt={post.businessName || ''}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-black text-sm text-gray-900 lowercase leading-none">
                  @{post.businessName?.toLowerCase().replace(/\s+/g, '')}
                </h3>
                {post.isVerified && <CheckCircle2 size={14} className="text-primary fill-primary/10" />}
              </div>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mt-1">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
          <button className="p-2 text-neutral-400 hover:text-gray-900 transition-colors">
            <MoreHorizontal size={20} />
          </button>
        </div>

        {post.caption && (
          <p className="text-gray-800 font-medium text-sm leading-relaxed mb-4">
            {post.caption}
          </p>
        )}

        {post.image_url && (
          <div className="relative rounded-[32px] overflow-hidden bg-neutral-50 border border-neutral-100 mb-4 aspect-square md:aspect-video">
            <img 
              src={post.image_url} 
              alt="Post content" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-neutral-50 px-2 mt-4">
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-neutral-500 hover:text-red-500 transition-colors group">
              <Heart size={20} className="group-hover:fill-red-500/10" />
              <span className="text-xs font-black">{post.likes}</span>
            </button>
            <button className="flex items-center gap-2 text-neutral-500 hover:text-primary transition-colors group">
              <MessageCircle size={20} className="group-hover:fill-primary/10" />
              <span className="text-xs font-black">{post.commentsCount}</span>
            </button>
          </div>
          <button className="flex items-center gap-2 text-neutral-500 hover:text-accent transition-colors">
            <Share2 size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

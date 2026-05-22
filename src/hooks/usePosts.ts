import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Post } from '../types';
import { useAuthStore } from '../store/authStore';

interface UsePostsOptions {
  limit?: number;
  sortBy?: 'recent' | 'trending';
  isFeatured?: boolean;
}

export function usePosts({ limit = 10, sortBy = 'recent', isFeatured }: UsePostsOptions = {}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const { user } = useAuthStore();

  const fetchPosts = useCallback(async (isLoadMore = false) => {
    try {
      if (!isLoadMore) setLoading(true);
      setError(null);

      let query = supabase
        .from('posts_view') // Assuming a view that joins business info
        .select('*');

      if (isFeatured !== undefined) {
        query = query.eq('is_featured', isFeatured);
      }

      query = query.eq('is_active', true);

      if (sortBy === 'trending') {
        query = query.order('likes', { ascending: false });
      } else {
        query = query.order('sort_order', { ascending: true }).order('created_at', { ascending: false });
      }

      const from = page * limit;
      const to = from + limit - 1;

      const { data, error: fetchError } = await query.range(from, to);

      if (fetchError) {
        // Fallback to table if view doesn't exist
        const fallbackQuery = supabase.from('posts').select('*').eq('is_active', true);
        if (sortBy === 'trending') {
          fallbackQuery.order('likes', { ascending: false });
        } else {
          fallbackQuery.order('sort_order', { ascending: true }).order('created_at', { ascending: false });
        }
        const { data: fbData, error: fbError } = await fallbackQuery.range(from, to);
        if (fbError) throw fbError;
        
        const mappedData = (fbData || []).map(p => ({
          ...p,
          businessId: p.business_id || p.businessId,
          businessName: p.business_name || p.businessName,
          businessAvatar: p.business_avatar || p.businessAvatar,
          commentsCount: p.comments_count || p.commentsCount || 0,
          likes: p.likes || p.likes_count || 0,
          image_url: p.image_url || p.imageUrl || p.image
        }));

        if (isLoadMore) {
          setPosts(prev => [...prev, ...mappedData]);
        } else {
          setPosts(mappedData);
        }
        setHasMore(mappedData.length === limit);
      } else {
        if (isLoadMore) {
          setPosts(prev => [...prev, ...(data || [])]);
        } else {
          setPosts(data || []);
        }
        setHasMore((data || []).length === limit);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, limit, sortBy, isFeatured]);

  useEffect(() => {
    fetchPosts(false);
  }, [fetchPosts]);

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  const likePost = async (postId: string) => {
    if (!user) return { error: 'Auth required' };

    try {
      // Toggle like
      const { data: existingLike } = await supabase
        .from('likes')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        await supabase.from('likes').delete().eq('id', existingLike.id);
        await supabase.rpc('decrement_likes', { post_id_param: postId });
      } else {
        await supabase.from('likes').insert({ post_id: postId, user_id: user.id });
        await supabase.rpc('increment_likes', { post_id_param: postId });
      }
      // Optimistic update or refresh? Let's refresh item logic or full refresh
      return { success: true };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  const addComment = async (postId: string, content: string) => {
    if (!user) return { error: 'Auth required' };

    try {
      const { error: insertError } = await supabase.from('comments').insert({
        post_id: postId,
        user_id: user.id,
        content
      });

      if (insertError) throw insertError;

      await supabase.rpc('increment_comments', { post_id_param: postId });
      return { success: true };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  const fetchComments = async (postId: string) => {
    const { data, error } = await supabase
      .from('comments')
      .select('*, profiles(full_name, avatar_url)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    
    return { data, error };
  };

  const createPost = async (postData: any) => {
    const { data, error } = await supabase.from('posts').insert(postData).select().single();
    return { data, error };
  };

  const refreshPosts = () => {
    setPage(0);
    fetchPosts(false);
  };

  return {
    posts,
    loading,
    error,
    hasMore,
    loadMore,
    likePost,
    addComment,
    fetchComments,
    createPost,
    refreshPosts
  };
}

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { HeroSlide, Post, Feature, SiteCategory, Business } from '../types';


export function useAdminDB() {
  const [loading, setLoading] = useState(false);

  // Hero Slides
  const fetchHeroSlides = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .order('sort_order', { ascending: true });
    setLoading(false);
    return { data: data as HeroSlide[], error };
  };

  const updateHeroSlide = async (id: string, updates: Partial<HeroSlide>) => {
    setLoading(true);
    const { error } = await supabase.from('hero_slides').update(updates).eq('id', id);
    setLoading(false);
    return { error };
  };

  const createHeroSlide = async (slide: Partial<HeroSlide>) => {
    setLoading(true);
    const { error } = await supabase.from('hero_slides').insert([slide]);
    setLoading(false);
    return { error };
  };

  const deleteHeroSlide = async (id: string) => {
    setLoading(true);
    const { error } = await supabase.from('hero_slides').delete().eq('id', id);
    setLoading(false);
    return { error };
  };

  const reorderHeroSlides = async (slides: HeroSlide[]) => {
    setLoading(true);
    const updates = slides.map((s, i) => ({ id: s.id, sort_order: i }));
    const { error } = await supabase.from('hero_slides').upsert(updates);
    setLoading(false);
    return { error };
  };

  // Features
  const fetchFeatures = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('features')
      .select('*')
      .order('sort_order', { ascending: true });
    setLoading(false);
    return { data: data as Feature[], error };
  };

  const updateFeature = async (id: string, updates: Partial<Feature>) => {
    setLoading(true);
    const { error } = await supabase.from('features').update(updates).eq('id', id);
    setLoading(false);
    return { error };
  };

  const createFeature = async (feature: Partial<Feature>) => {
    setLoading(true);
    const { error } = await supabase.from('features').insert([feature]);
    setLoading(false);
    return { error };
  };

  const deleteFeature = async (id: string) => {
    setLoading(true);
    const { error } = await supabase.from('features').delete().eq('id', id);
    setLoading(false);
    return { error };
  };

  // Categories
  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('site_categories')
      .select('*')
      .order('sort_order', { ascending: true });
    setLoading(false);
    return { data: data as SiteCategory[], error };
  };

  const updateCategory = async (id: string, updates: Partial<SiteCategory>) => {
    setLoading(true);
    const { error } = await supabase.from('site_categories').update(updates).eq('id', id);
    setLoading(false);
    return { error };
  };

  const createCategory = async (category: Partial<SiteCategory>) => {
    setLoading(true);
    const { error } = await supabase.from('site_categories').insert([category]);
    setLoading(false);
    return { error };
  };

  const deleteCategory = async (id: string) => {
    setLoading(true);
    const { error } = await supabase.from('site_categories').delete().eq('id', id);
    setLoading(false);
    return { error };
  };

  // Feed Sections
  const fetchFeedSections = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('feed_sections')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    setLoading(false);
    return { data, error };
  };

  // Posts
  const fetchPosts = async (options: { is_featured?: boolean; post_type?: string } = {}) => {
    setLoading(true);
    let query = supabase.from('posts').select('*').eq('is_active', true);
    if (options.is_featured !== undefined) query = query.eq('is_featured', options.is_featured);
    if (options.post_type) query = query.eq('post_type', options.post_type);
    
    const { data, error } = await query.order('created_at', { ascending: false });
    setLoading(false);
    return { data: data as Post[], error };
  };

  const updatePost = async (id: string, updates: Partial<Post>) => {
    setLoading(true);
    const { error } = await supabase.from('posts').update(updates).eq('id', id);
    setLoading(false);
    return { error };
  };

  const createPost = async (post: Partial<Post>) => {
    setLoading(true);
    const { error } = await supabase.from('posts').insert([post]);
    setLoading(false);
    return { error };
  };

  const deletePost = async (id: string) => {
    setLoading(true);
    const { error } = await supabase.from('posts').delete().eq('id', id);
    setLoading(false);
    return { error };
  };

  const reorderPosts = async (posts: Post[]) => {
    setLoading(true);
    const updates = posts.map((p, i) => ({ id: p.id, sort_order: i }));
    const { error } = await supabase.from('posts').upsert(updates);
    setLoading(false);
    return { error };
  };

  // Businesses (Homepage Display)
  const updateBusiness = async (id: string, updates: Partial<Business>) => {
    setLoading(true);
    const { error } = await supabase.from('businesses').update(updates).eq('id', id);
    setLoading(false);
    return { error };
  };

  // Image Upload
  const uploadImage = async (file: File, folder: string = 'general') => {
    setLoading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('build-mode-images')
      .upload(filePath, file);

    if (uploadError) {
      setLoading(false);
      return { error: uploadError, url: null };
    }

    const { data: { publicUrl } } = supabase.storage
      .from('build-mode-images')
      .getPublicUrl(filePath);

    setLoading(false);
    return { error: null, url: publicUrl };
  };

  // Site Settings
  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('site_settings').select('*');
    setLoading(false);
    return { data, error };
  };

  const updateSetting = async (key: string, values: { value_en: string; value_ar: string; value_ku?: string }) => {
    setLoading(true);
    const { error } = await supabase.from('site_settings').update(values).eq('key', key);
    setLoading(false);
    return { error };
  };

  return {
    loading,
    fetchHeroSlides,
    updateHeroSlide,
    createHeroSlide,
    deleteHeroSlide,
    reorderHeroSlides,
    fetchFeatures,
    updateFeature,
    createFeature,
    deleteFeature,
    fetchCategories,
    updateCategory,
    createCategory,
    deleteCategory,
    fetchFeedSections,
    fetchPosts,
    updatePost,
    createPost,
    deletePost,
    reorderPosts,
    updateBusiness,
    uploadImage,
    fetchSettings,
    updateSetting
  };
}


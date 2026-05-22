import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Business, Post, HeroSlide } from '../types';

const FALLBACK_SLIDES: HeroSlide[] = [
  {
    id: 'fs1',
    title_en: 'Discover Best Food in Iraq',
    title_ar: 'اكتشف أفضل المأكولات في العراق',
    title_ku: 'باشترین خواردن لە عێراق بدۆزەرەوە',
    subtitle_en: 'Find the top rated restaurants in your neighborhood.',
    subtitle_ar: 'ابحث عن أفضل المطاعم في منطقتك.',

    subtitle_ku: 'باشترین چێشتخانەکان لە گەڕەکەکەت بدۆزەرەوە.',
    image_url: 'https://picsum.photos/seed/iraqifood/1920/1080',
    cta_text_en: 'Explore Now',
    cta_text_ar: 'استكشف الآن',
    cta_text_ku: 'ئێستا بگەڕێ',
    cta_link: '/directory?category=dining',
    sort_order: 1,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'fs2',
    title_en: 'Your Local Business Partner',
    title_ar: 'شريكك في الأعمال المحلية',
    title_ku: 'هاوبەشی بزنسی ناوخۆیی تۆ',
    subtitle_en: 'Grow your business with Shaku Maku platform.',
    subtitle_ar: 'نمِّ عملك مع منصة شكو ماكو.',
    subtitle_ku: 'بزنسی خۆت بەرز بکەرەوە لەگەڵ پلاتفۆرمی شکو ماکو.',
    image_url: 'https://picsum.photos/seed/iraqibiz/1920/1080',
    cta_text_en: 'Join Us',
    cta_text_ar: 'انضم إلينا',
    cta_text_ku: 'ببە بە ئەندام',
    cta_link: '/directory',
    sort_order: 2,
    is_active: true,
    created_at: new Date().toISOString()
  }

];

export function useHeroSlides() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSlides() {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (!error && data && data.length > 0) {
        setSlides(data);
      } else {
        setSlides(FALLBACK_SLIDES);
      }
      setLoading(false);
    }
    fetchSlides();
  }, []);

  return { slides, loading };
}


const FALLBACK_BUSINESSES: Business[] = [
  {
    id: 'fb1',
    name: 'Al-Mansour Restaurant',
    name_ar: 'مطعم المنصور',
    name_ku: 'خواردنگەی مەنسوور',
    category: 'dining',
    governorate: 'baghdad',
    city: 'baghdad',
    neighborhood: 'Mansour',
    address: 'Mansour Street, Baghdad',

    phone: '07700000000',
    phone_1: null,
    phone_2: null,
    rating: 4.8,
    review_count: 120,
    is_verified: true,
    is_featured: true,
    image_url: 'https://picsum.photos/seed/restaurant/800/600',
    website: null,
    social_links: {},
    description: 'The best Iraqi traditional food.',
    description_ar: 'أفضل الأكلات العراقية التقليدية.',
    lat: 33.3128,
    lng: 44.3615,
    owner_id: null,
    created_at: new Date().toISOString()
  },
  {
    id: 'fb2',
    name: 'Erbil Grand Hotel',
    name_ar: 'فندق أربيل الكبير',
    name_ku: 'وتێلی گەورەی هەولێر',
    category: 'hotels',
    governorate: 'erbil',
    city: 'erbil',
    neighborhood: 'Dream City',

    address: 'Erbil Main Road',
    phone: '07500000000',
    phone_1: null,
    phone_2: null,
    rating: 4.9,
    review_count: 85,
    is_verified: true,
    is_featured: true,
    image_url: 'https://picsum.photos/seed/hotel_fallback/800/600',
    website: null,
    social_links: {},
    description: 'Luxury stay in the heart of Erbil.',
    description_ar: 'إقامة فاخرة في قلب أربيل.',
    lat: 36.1901,
    lng: 44.0091,
    owner_id: null,
    created_at: new Date().toISOString()
  }
];


export function useBusinesses(filters: { governorate?: string | null; category?: string | null; search?: string }) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBusinesses() {
      setLoading(true);
      let query = supabase.from('businesses').select('*').eq('is_active', true);

      if (filters.governorate) query = query.eq('governorate', filters.governorate);
      if (filters.category) query = query.eq('category', filters.category);
      if (filters.search) query = query.ilike('name', `%${filters.search}%`);

      const { data, error } = await query.order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setBusinesses(data);
      } else {
        // Fallback to static businesses if Supabase is empty or filter yields nothing
        setBusinesses(FALLBACK_BUSINESSES.filter(b => 
          (!filters.governorate || b.governorate.toLowerCase() === filters.governorate.toLowerCase()) &&
          (!filters.category || b.category.toLowerCase() === filters.category.toLowerCase())
        ));
      }
      setLoading(false);
    }
    fetchBusinesses();
  }, [filters.governorate, filters.category, filters.search]);

  return { businesses, loading };
}


export function usePosts(limit = 10) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  async function fetchPosts(page = 0) {
    if (page === 0) setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range(page * limit, (page + 1) * limit - 1);

    if (!error && data) {
      if (data.length < limit) setHasMore(false);
      setPosts(prev => page === 0 ? data : [...prev, ...data]);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchPosts(0);
  }, []);

  return { posts, loading, hasMore, loadMore: (page: number) => fetchPosts(page) };
}

export function useFeedSections() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSections() {
      const { data, error } = await supabase.from('feed_sections').select('*').order('sort_order');
      if (!error && data) setSections(data);
      setLoading(false);
    }
    fetchSections();
  }, []);

  return { sections, loading };
}



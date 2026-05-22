import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Business } from '../types';

const FALLBACK_BUSINESSES: Business[] = [
  {
    id: 'fb1',
    name: 'Rotana Erbil',
    name_ar: 'روتانا أربيل',
    name_ku: 'ڕۆتانا هەولێر',
    category: 'hotels',
    governorate: 'erbil',
    city: 'erbil',
    neighborhood: 'Gulan St',
    address: 'Gulan Street, Erbil',
    phone: '+964 66 210 5555',
    phone_1: null,
    phone_2: null,
    rating: 4.9,
    review_count: 1250,
    is_verified: true,
    is_featured: true,
    image_url: 'https://picsum.photos/seed/rotana/800/600',
    website: 'https://www.rotana.com',
    social_links: {},
    description: 'Luxury hotel in the heart of Erbil.',
    description_ar: 'فندق فاخر في قلب أربيل.',
    lat: 36.1901,
    lng: 44.0091,
    owner_id: null,
    created_at: new Date().toISOString()
  },
  {
    id: 'fb2',
    name: 'Babylon Rotana',
    name_ar: 'بابل روتانا',
    name_ku: 'بیبلۆن ڕۆتانا',
    category: 'hotels',
    governorate: 'baghdad',
    city: 'baghdad',
    neighborhood: 'Jadriya',
    address: 'Al Jadriya, Baghdad',
    phone: '+964 780 916 6166',
    phone_1: null,
    phone_2: null,
    rating: 4.8,
    review_count: 980,
    is_verified: true,
    is_featured: true,
    image_url: 'https://picsum.photos/seed/babylon/800/600',
    website: null,
    social_links: {},
    description: 'Iconic hotel overlooking the Tigris River.',
    description_ar: 'فندق أيقوني يطل على نهر دجلة.',
    lat: 33.2985,
    lng: 44.3948,
    owner_id: null,
    created_at: new Date().toISOString()
  },
  {
    id: 'fb3',
    name: 'Saj Al-Reef',
    name_ar: 'صاج الريف',
    name_ku: 'ساج الریف',
    category: 'dining',
    governorate: 'baghdad',
    city: 'baghdad',
    neighborhood: 'Mansour',
    address: 'Al-Mansour, Baghdad',
    phone: '+964 770 123 4567',
    phone_1: null,
    phone_2: null,
    rating: 4.6,
    review_count: 3400,
    is_verified: true,
    is_featured: true,
    image_url: 'https://picsum.photos/seed/saj/800/600',
    website: null,
    social_links: {},
    description: 'Authentic Iraqi shawarma and pastries.',
    description_ar: 'شاورما ومعجنات عراقية أصيلة.',
    lat: 33.3128,
    lng: 44.3615,
    owner_id: null,
    created_at: new Date().toISOString()
  },
  {
    id: 'fb4',
    name: 'Erbil Citadel Cafe',
    name_ar: 'مقهى قلعة أربيل',
    name_ku: 'قاوەخانەی قەڵای هەولێر',
    category: 'cafe',
    governorate: 'erbil',
    city: 'erbil',
    neighborhood: 'Citadel',
    address: 'Erbil Citadel, Central Square',
    phone: '+964 750 000 0000',
    phone_1: null,
    phone_2: null,
    rating: 4.7,
    review_count: 560,
    is_verified: true,
    is_featured: true,
    image_url: 'https://picsum.photos/seed/citadel/800/600',
    website: null,
    social_links: {},
    description: 'Traditional tea house with a view of history.',
    description_ar: 'مقهى تقليدي مع إطلالة تاريخية.',
    lat: 36.1908,
    lng: 44.0101,
    owner_id: null,
    created_at: new Date().toISOString()
  },
  {
    id: 'fb5',
    name: 'Basra International Hotel',
    name_ar: 'فندق البصرة الدولي',
    name_ku: 'وتێلی نێودەوڵەتی بەسرە',
    category: 'hotels',
    governorate: 'basra',
    city: 'basra',
    neighborhood: 'Corner',
    address: 'Corner of Shatt Al-Arab',
    phone: '+964 780 000 0000',
    phone_1: null,
    phone_2: null,
    rating: 4.5,
    review_count: 420,
    is_verified: true,
    is_featured: true,
    image_url: 'https://picsum.photos/seed/basrahotel/800/600',
    website: null,
    social_links: {},
    description: 'Premier destination for business in the south.',
    description_ar: 'الوجهة الأولى للأعمال في الجنوب.',
    lat: 30.5081,
    lng: 47.8172,
    owner_id: null,
    created_at: new Date().toISOString()
  }
];

interface UseBusinessesProps {
  governorate?: string | null;
  city?: string | null;
  category?: string | null;
  searchQuery?: string | null;
}

export function useBusinesses({ governorate, city, category, searchQuery }: UseBusinessesProps = {}) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [featuredBusinesses, setFeaturedBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const pageSize = 100;

  const mapBusiness = (data: any): Business => ({
    ...data,
    name_ar: data.name_ar || data.nameAr,
    name_ku: data.name_ku || data.nameKu,
    image_url: data.image_url || data.imageUrl || data.image || 'https://picsum.photos/seed/placeholder/800/600',
    review_count: data.review_count || data.reviewCount || 0,
    is_verified: data.is_verified || data.isVerified || false,
    is_featured: data.is_featured || data.isFeatured || false,
    owner_id: data.owner_id || data.ownerId
  });

  const fetchBusinesses = useCallback(async (isLoadMore = false) => {
    try {
      if (!isLoadMore) setLoading(true);
      setError(null);

      let query = supabase
        .from('businesses')
        .select('*', { count: 'exact' })
        .eq('is_active', true);

      if (governorate && governorate !== 'all') query = query.eq('governorate', governorate);
      if (city) query = query.eq('city', city);
      if (category) query = query.eq('category', category);
      if (searchQuery) query = query.ilike('name', `%${searchQuery}%`);

      const from = page * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await query
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      const mappedData = (data || []).map(mapBusiness);

      if (isLoadMore) {
        setBusinesses(prev => [...prev, ...mappedData]);
      } else {
        setBusinesses(mappedData);
        setTotalCount(count || 0);
        // Extract featured
        setFeaturedBusinesses(mappedData.filter(b => b.is_featured));
      }

      setHasMore(mappedData.length === pageSize);

      if (!governorate && !category && !searchQuery && mappedData.length === 0) {
        setBusinesses(FALLBACK_BUSINESSES);
        setFeaturedBusinesses(FALLBACK_BUSINESSES.filter(b => b.is_featured));
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [governorate, city, category, searchQuery, page]);

  useEffect(() => {
    setPage(0);
    fetchBusinesses(false);
  }, [governorate, city, category, searchQuery]);

  useEffect(() => {
    if (page > 0) {
      fetchBusinesses(true);
    }
  }, [page]);

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  const refresh = () => {
    setPage(0);
    fetchBusinesses(false);
  };

  return {
    businesses,
    featuredBusinesses,
    loading,
    error,
    hasMore,
    totalCount,
    loadMore,
    refresh
  };
}

export type Language = 'en' | 'ar' | 'ku';

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  role: 'admin' | 'user';
  avatar_url: string | null;
  created_at: string;
}

export interface Business {
  id: string;
  name: string;
  name_ar: string | null;
  name_ku: string | null;
  category: string;
  governorate: string;
  city: string | null;
  neighborhood: string | null;
  address: string | null;
  phone: string | null;
  phone_1: string | null;
  phone_2: string | null;
  rating: number;
  review_count: number;
  is_featured: boolean;
  is_verified: boolean;
  image_url: string | null;
  website: string | null;
  social_links: any;
  description: string | null;
  description_ar: string | null;
  lat: number | null;
  lng: number | null;
  owner_id: string | null;
  created_at: string;
}

export interface Post {
  id: string;
  businessId: string | null;
  content: string | null;
  caption: string | null;
  image_url: string | null;
  likes: number;
  views: number;
  commentsCount: number;
  post_type: string;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  businessName: string | null;
  businessAvatar: string | null;
  isVerified: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface HeroSlide {
  id: string;
  title_en: string | null;
  title_ar: string | null;
  title_ku: string | null;
  subtitle_en: string | null;
  subtitle_ar: string | null;
  subtitle_ku: string | null;
  image_url: string;
  cta_text_en: string | null;
  cta_text_ar: string | null;
  cta_text_ku: string | null;
  cta_link: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface HeroContent {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage: string;
  updatedAt: string;
  updatedBy: string;
}

export interface FeedItem {
  id: string;
  title: string;
  description: string;
  image: string;
  order: number;
  active: boolean;
  updatedAt: string;
}

export interface SiteCategory {
  id: string;
  slug: string;
  name_en: string | null;
  name_ar: string | null;
  name_ku: string | null;
  icon: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface Feature {
  id: string;
  title_en: string | null;
  title_ar: string | null;
  title_ku: string | null;
  description_en: string | null;
  description_ar: string | null;
  description_ku: string | null;
  icon: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface FeedSection {
  id: string;
  title_en: string | null;
  title_ar: string | null;
  title_ku: string | null;
  description_en: string | null;
  description_ar: string | null;
  description_ku: string | null;
  section_type: string;
  sort_order: number;
  is_active: boolean;
  config: any;
  created_at: string;
}

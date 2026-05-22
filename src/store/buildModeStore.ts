import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MockHeroSlide {
  id: string;
  image_url: string;
}

export interface MockPost {
  id: string;
  caption: string;
  image_url: string;
  businessName?: string;
  created_at: string;
  likes: number;
}

interface BuildModeState {
  heroSlides: MockHeroSlide[];
  feedPosts: MockPost[];
  
  // Actions
  updateHeroImage: (id: string, imageUrl: string) => void;
  addPost: (post: Omit<MockPost, 'id' | 'created_at' | 'likes'>) => void;
  updatePost: (id: string, updates: Partial<MockPost>) => void;
  deletePost: (id: string) => void;
}

const MOCK_HERO_SLIDES: MockHeroSlide[] = [
  { id: 'h1', image_url: 'https://picsum.photos/seed/iraq_cafe/1080/1080' },
  { id: 'h2', image_url: 'https://picsum.photos/seed/iraq_rest/1080/1080' },
  { id: 'h3', image_url: 'https://picsum.photos/seed/iraq_bazaar/1080/1080' },
];

const MOCK_POSTS: MockPost[] = [
  {
    id: 'p1',
    caption: 'أفضل كوب قهوة في بغداد اليوم! ☕️',
    image_url: 'https://picsum.photos/seed/coffee/1000/1000',
    businessName: 'Ridha Alwan Coffee',
    created_at: new Date().toISOString(),
    likes: 124
  },
  {
    id: 'p2',
    caption: 'استمتعوا بأجواء المساء في مطعمنا الجديد بالمنصور. 🥘',
    image_url: 'https://picsum.photos/seed/dinner/1000/1000',
    businessName: 'Beit Sitti',
    created_at: new Date().toISOString(),
    likes: 89
  },
  {
    id: 'p3',
    caption: 'وصلتنا بضاعة جديدة من الملابس الراقية. زورونا الآن! ✨',
    image_url: 'https://picsum.photos/seed/fashion/1000/1000',
    businessName: 'Zayona Mall',
    created_at: new Date().toISOString(),
    likes: 56
  }
];

export const useBuildModeStore = create<BuildModeState>()(
  persist(
    (set) => ({
      heroSlides: MOCK_HERO_SLIDES,
      feedPosts: MOCK_POSTS,

      updateHeroImage: (id, image_url) => set((state) => ({
        heroSlides: state.heroSlides.map(s => s.id === id ? { ...s, image_url } : s)
      })),

      addPost: (post) => set((state) => ({
        feedPosts: [
          {
            ...post,
            id: 'post-' + Date.now(),
            created_at: new Date().toISOString(),
            likes: 0
          },
          ...state.feedPosts
        ]
      })),

      updatePost: (id, updates) => set((state) => ({
        feedPosts: state.feedPosts.map(p => p.id === id ? { ...p, ...updates } : p)
      })),

      deletePost: (id) => set((state) => ({
        feedPosts: state.feedPosts.filter(p => p.id !== id)
      })),
    }),
    {
      name: 'build-mode-store',
    }
  )
);

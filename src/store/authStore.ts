import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@supabase/supabase-js';
import { Profile } from '../types';
import { isAdmin as checkIsAdmin } from '../lib/adminAuth';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isInitialized: boolean;
  setAuth: (user: User | null, profile: Profile | null) => void;
  setInitialized: (val: boolean) => void;
  isAdmin: () => boolean;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      isInitialized: false,
      setAuth: (user, profile) => set({ user, profile }),
      setInitialized: (val) => set({ isInitialized: val }),
      isAdmin: () => checkIsAdmin(get().profile),
      signOut: () => set({ user: null, profile: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

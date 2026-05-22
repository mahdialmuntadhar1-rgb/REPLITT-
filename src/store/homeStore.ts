import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language, Business } from '../types';

interface HomeState {
  language: Language;
  activeTab: 'guide' | 'shakumaku';
  viewMode: 'grid' | 'map';
  selectedGovernorate: string | null;
  selectedCity: string | null;
  selectedCategory: string | null;
  selectedBusiness: Business | null;
  isAddBusinessOpen: boolean;
  isAuthModalOpen: boolean;
  isBuildModeOpen: boolean;
  isEditMode: boolean;
  searchQuery: string;
  setLanguage: (lang: Language) => void;
  setActiveTab: (tab: 'guide' | 'shakumaku') => void;
  setViewMode: (mode: 'grid' | 'map') => void;
  setSelectedBusiness: (business: Business | null) => void;
  setIsAddBusinessOpen: (isOpen: boolean) => void;
  setIsAuthModalOpen: (isOpen: boolean) => void;
  setIsBuildModeOpen: (isOpen: boolean) => void;
  setEditMode: (isOpen: boolean) => void;
  toggleEditMode: () => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<Pick<HomeState, 'selectedGovernorate' | 'selectedCity' | 'selectedCategory'>>) => void;

  resetFilters: () => void;
}

export const useHomeStore = create<HomeState>()(
  persist(
    (set) => ({
      language: 'ar',
      activeTab: 'guide',

      viewMode: 'grid',
      selectedGovernorate: null,
      selectedCity: null,
      selectedCategory: null,
      selectedBusiness: null,
      isAddBusinessOpen: false,
      isAuthModalOpen: false,
      isBuildModeOpen: false,
      isEditMode: false,
      searchQuery: '',
      setLanguage: (language) => set({ language }),
      setActiveTab: (activeTab) => set({ activeTab }),
      setViewMode: (viewMode) => set({ viewMode }),
      setSelectedBusiness: (selectedBusiness) => set({ selectedBusiness }),
      setIsAddBusinessOpen: (isAddBusinessOpen) => set({ isAddBusinessOpen }),
      setIsAuthModalOpen: (isAuthModalOpen) => set({ isAuthModalOpen }),
      setIsBuildModeOpen: (isBuildModeOpen) => set({ isBuildModeOpen }),
      setEditMode: (isEditMode) => set({ isEditMode }),
      toggleEditMode: () => set((state) => ({ isEditMode: !state.isEditMode })),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setFilters: (filters) => set((state) => ({ ...state, ...filters })),

      resetFilters: () => set({ selectedGovernorate: null, selectedCity: null, selectedCategory: null, searchQuery: '' }),
    }),
    {
      name: 'home-store',
    }
  )
);

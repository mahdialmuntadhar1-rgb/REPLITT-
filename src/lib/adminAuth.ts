import { Profile } from '../types';

export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "mahdialmuntadhar1@gmail.com";

export const isAdmin = (profile: Profile | null): boolean => {
  if (!profile) return false;
  
  // High-security check: check both role AND email for the owner's account
  return profile.role === 'admin' && (profile.email === ADMIN_EMAIL || profile.email === 'safaribosafar@gmail.com');
};

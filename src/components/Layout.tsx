import React from 'react';
import { HomeHeader } from './HomeHeader';
import { Footer } from './Footer';
import { useHomeStore } from '../store/homeStore';
import { AuthModal } from './auth/AuthModal';

export function Layout({ children }: { children: React.ReactNode }) {
  const { language, isAuthModalOpen, setIsAuthModalOpen } = useHomeStore();
  const isRtl = language === 'ar' || language === 'ku';

  return (
    <div className="min-h-screen flex flex-col" dir={isRtl ? 'rtl' : 'ltr'}>
      <HomeHeader />
      <main className="flex-1">
        {children}
      </main>
      <Footer />

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}





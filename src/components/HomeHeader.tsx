import React, { useState, useEffect } from 'react';
import { useHomeStore } from '../store/homeStore';
import { useAuthStore } from '../store/authStore';
import { cn } from '../lib/utils';
import { Search, Globe, User, LogIn, Settings, LogOut, Wrench, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HomeHeader() {
  const { language, setLanguage, setIsBuildModeOpen, setIsAuthModalOpen, searchQuery, setSearchQuery } = useHomeStore();
  const { user, profile, signOut } = useAuthStore();
  
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const isRtl = language === 'ar' || language === 'ku';
  const isAdmin = profile?.role === 'admin';

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearch);
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearch, setSearchQuery]);

  // Sync with global store (e.g. on reset)
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-2xl rounded-[32px] px-8 py-4 shadow-2xl shadow-neutral-200/50 border border-white/20 flex items-center justify-between">
          
          {/* Logo & Search */}
          <div className="flex items-center gap-12 flex-1">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20 group-hover:rotate-12 transition-transform">
                <span className="text-xl font-black">SM</span>
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-black text-gray-900 leading-none font-arabic">شكو ماكو</h1>
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mt-1">Shaku Maku</p>
              </div>
            </Link>

            <div className="hidden lg:flex items-center bg-neutral-50 px-6 py-3 rounded-2xl border border-neutral-100 flex-1 max-w-md group focus-within:ring-2 ring-primary/20 transition-all">
              <Search size={18} className="text-neutral-400 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder={isRtl ? 'ابحث عن مطاعم، فنادق، محلات...' : 'Search restaurants, hotels, shops...'}
                className="bg-transparent border-none outline-none px-4 text-xs font-bold text-gray-900 w-full placeholder:text-neutral-300"
              />
              {localSearch && (
                <button 
                  onClick={() => setLocalSearch('')}
                  className="text-neutral-300 hover:text-primary transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6">
            {/* Lang Switcher */}
            <div className="hidden sm:flex bg-neutral-50 p-1 rounded-xl border border-neutral-100">
              {['ar', 'en', 'ku'].map((l) => (
                <button
                  key={l}
                  onClick={() => setLanguage(l as any)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all",
                    language === l ? "bg-white text-primary shadow-sm" : "text-neutral-400 hover:text-primary"
                  )}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Admin Tools */}
            {isAdmin && (
              <div className="flex items-center gap-3">
                <Link 
                  to="/admin"
                  className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center hover:bg-primary transition-colors shadow-lg"
                  title="Admin Dashboard"
                >
                  <Settings size={18} />
                </Link>
                <button 
                  onClick={() => setIsBuildModeOpen(true)}
                  className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center hover:bg-primary transition-colors shadow-lg"
                  title="Open Build Mode"
                >
                  <Wrench size={18} />
                </button>
              </div>
            )}

            {/* Auth */}
            {user ? (
              <div className="flex items-center gap-4 pl-6 border-l border-neutral-100">
                <div className="hidden md:block text-right">
                  <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Welcome back</p>
                  <p className="text-xs font-black text-gray-900 truncate max-w-[120px]">{profile?.full_name || user.email}</p>
                </div>
                <button 
                  onClick={() => signOut()}
                  className="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-400 hover:text-primary transition-all overflow-hidden border border-neutral-100 group"
                >
                  <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-3 px-8 py-3.5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
              >
                <LogIn size={18} />
                <span>{isRtl ? 'دخول' : 'Sign In'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}


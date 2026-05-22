import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { LayoutDashboard, Building2, TrendingUp, Settings, LogOut, Search, Edit3, Trash2, CheckCircle, Star, User } from 'lucide-react';
import { cn } from '../lib/utils';
import { Business, Post } from '../types';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'businesses' | 'featured'>('overview');
  const { signOut, user } = useAuthStore();

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'businesses', label: 'Businesses', icon: Building2 },
    { id: 'featured', label: 'Featured Content', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-neutral-100 flex flex-col p-8 fixed h-full z-20">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-12 h-12 bg-neutral-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
            <Settings size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900 leading-none">Admin</h1>
            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mt-1">Shaku Maku Panel</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={cn(
                "w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all",
                activeTab === item.id 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-neutral-400 hover:bg-neutral-50 hover:text-primary"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="pt-8 border-t border-neutral-100">
          <div className="bg-neutral-50 rounded-2xl p-4 mb-6">
            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Logged in as</p>
            <p className="text-xs font-black text-gray-900 truncate">{user?.email}</p>
          </div>
          <button 
            onClick={() => signOut()}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-80 p-12">
        <header className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">
              {menuItems.find(i => i.id === activeTab)?.label}
            </h2>
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mt-1">Management Console</p>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-white border border-neutral-100 rounded-2xl text-xs font-black uppercase text-primary shadow-sm">
              System Health: OK
            </button>
            <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-100 flex items-center justify-center text-neutral-900 shadow-sm">
              <span className="text-xs font-black">Admin</span>
            </div>
          </div>
        </header>

        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'businesses' && <BusinessManager />}
        </section>
      </main>
    </div>
  );
}

function OverviewTab() {
  const [stats, setStats] = useState({ businesses: 0, posts: 0, users: 0 });

  useEffect(() => {
    async function loadStats() {
      const [{ count: bCount }, { count: pCount }, { count: uCount }] = await Promise.all([
        supabase.from('businesses').select('*', { count: 'exact', head: true }),
        supabase.from('posts').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
      ]);
      setStats({ businesses: bCount || 0, posts: pCount || 0, users: uCount || 0 });
    }
    loadStats();
  }, []);

  const cards = [
    { label: 'Total Businesses', value: stats.businesses, icon: Building2, color: 'text-primary' },
    { label: 'Community Posts', value: stats.posts, icon: TrendingUp, color: 'text-accent' },
    { label: 'Platform Users', value: stats.users, icon: User, color: 'text-blue-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {cards.map(card => (
        <div key={card.label} className="bg-white p-10 rounded-[40px] shadow-xl border border-neutral-50 flex flex-col items-center text-center group hover:scale-105 transition-all">
          <div className={cn("w-20 h-20 rounded-[32px] bg-neutral-50 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all", card.color)}>
            <card.icon size={32} />
          </div>
          <p className="text-xs font-black text-neutral-400 uppercase tracking-[0.2em] mb-2">{card.label}</p>
          <h3 className="text-4xl font-black text-gray-900">{card.value}</h3>
        </div>
      ))}
    </div>
  );
}

function BusinessManager() {
  const [search, setSearch] = useState('');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      let query = supabase.from('businesses').select('*');
      if (search) query = query.ilike('name', `%${search}%`);
      const { data } = await query.limit(20).order('created_at', { ascending: false });
      setBusinesses(data || []);
      setLoading(false);
    }
    load();
  }, [search]);

  return (
    <div className="space-y-8">
      <div className="bg-white p-4 rounded-[32px] border border-neutral-100 shadow-sm flex items-center gap-4">
        <Search size={20} className="text-neutral-400 ml-4" />
        <input 
          type="text" 
          placeholder="Search by business name, city, phone..."
          className="flex-1 bg-transparent border-none outline-none font-black text-xs uppercase tracking-widest text-gray-900"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-[40px] border border-neutral-100 shadow-xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-neutral-50">
              <th className="px-8 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Business</th>
              <th className="px-8 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Location</th>
              <th className="px-8 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {businesses.map(biz => (
              <tr key={biz.id} className="hover:bg-neutral-50 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-neutral-100 overflow-hidden">
                      <img src={biz.image_url || ''} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-900">{biz.name}</p>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase">{biz.category}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 text-xs font-bold text-neutral-500">{biz.city}, {biz.governorate}</td>
                <td className="px-8 py-6">
                  <div className="flex gap-2">
                    {biz.is_verified && <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-[10px] font-black">VERIFIED</span>}
                    {biz.is_featured && <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black">FEATURED</span>}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex gap-3">
                    <button className="p-2 bg-neutral-100 rounded-xl text-neutral-600 hover:bg-primary hover:text-white transition-all"><Edit3 size={16} /></button>
                    <button className="p-2 bg-neutral-100 rounded-xl text-neutral-600 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

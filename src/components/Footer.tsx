import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Apple, Play } from 'lucide-react';
import { useHomeStore } from '../store/homeStore';

export function Footer() {
  const { language } = useHomeStore();
  const isRtl = language === 'ar' || language === 'ku';

  const translations = {
    description: isRtl 
      ? "منصتك الأولى لاكتشاف أفضل الخدمات والأعمال في كل محافظة من محافظات العراق. شكو ماكو، صوتك ودليلك." 
      : "Iraq's premier lifestyle platform and business directory. Connecting voices and businesses across every governorate.",
    platform: isRtl ? "المنصة" : "Platform",
    browse: isRtl ? "تصفح الدليل" : "Browse Directory",
    feed: isRtl ? "المنشورات الحية" : "Live Feed",
    verified: isRtl ? "أعمال موثقة" : "Verified Businesses",
    admin: isRtl ? "دخول المسؤول" : "Admin Dashboard",
    company: isRtl ? "الشركة" : "Company",
    about: isRtl ? "عن بي لايف" : "About Belive",
    terms: isRtl ? "شروط الخدمة" : "Terms of Service",
    privacy: isRtl ? "سياسة الخصوصية" : "Privacy Policy",
    contact: isRtl ? "اتصل بنا" : "Contact Support",
    getApp: isRtl ? "حمل التطبيق" : "Get the App",
    appStore: isRtl ? "متجر التطبيقات" : "App Store",
    googlePlay: isRtl ? "جوجل بلاي" : "Google Play",
    copyright: isRtl ? "© 2025 شكو ماكو. جميع الحقوق محفوظة." : "© 2025 Shaku Maku Platform. All rights reserved.",
    status: isRtl ? "حالة النظام: متصل" : "System Status: Online"
  };

  return (
    <footer className="bg-white border-t border-neutral-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-xl font-arabic">
                ش
              </div>
              <h2 className="text-lg font-black tracking-tight text-primary uppercase">SHAKU MAKU</h2>
            </Link>
            <p className="text-neutral-400 font-medium text-sm leading-relaxed mb-8">
              {translations.description}
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={Instagram} />
              <SocialIcon icon={Facebook} />
              <SocialIcon icon={Twitter} />
            </div>
          </div>

          <div>
            <h4 className="font-black text-xs uppercase tracking-widest text-gray-900 mb-6">{translations.platform}</h4>
            <ul className="space-y-4">
              <FooterLink label={translations.browse} />
              <FooterLink label={translations.feed} />
              <FooterLink label={translations.verified} />
              <Link to="/admin" className="text-neutral-400 font-bold text-xs hover:text-primary transition-colors uppercase tracking-wider block">
                {translations.admin}
              </Link>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-xs uppercase tracking-widest text-gray-900 mb-6">{translations.company}</h4>
            <ul className="space-y-4">
              <FooterLink label={translations.about} />
              <FooterLink label={translations.terms} />
              <FooterLink label={translations.privacy} />
              <FooterLink label={translations.contact} />
            </ul>
          </div>

          <div>
            <h4 className="font-black text-xs uppercase tracking-widest text-gray-900 mb-6">{translations.getApp}</h4>
            <div className="space-y-4 text-center md:text-left">
              <button className="w-full bg-neutral-900 text-white rounded-2xl p-4 flex items-center gap-4 group hover:bg-black transition-all hover:-translate-y-1">
                <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20">
                  <Apple size={20} fill="currentColor" />
                </div>
                <div className={isRtl ? "text-right" : "text-left"}>
                  <p className="text-[10px] uppercase font-bold text-neutral-400">Download on the</p>
                  <p className="text-sm font-black uppercase tracking-tighter">{translations.appStore}</p>
                </div>
              </button>
              <button className="w-full bg-neutral-900 text-white rounded-2xl p-4 flex items-center gap-4 group hover:bg-black transition-all hover:-translate-y-1">
                <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20">
                  <Play size={20} fill="currentColor" />
                </div>
                <div className={isRtl ? "text-right" : "text-left"}>
                  <p className="text-[10px] uppercase font-bold text-neutral-400">Get it on</p>
                  <p className="text-sm font-black uppercase tracking-tighter">{translations.googlePlay}</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-10 border-t border-neutral-50 gap-6">
          <p className="text-neutral-400 font-bold text-[10px] uppercase tracking-widest">
            {translations.copyright}
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse"></span>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{translations.status}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon: Icon }: any) {
  return (
    <button className="w-10 h-10 bg-neutral-50 rounded-xl flex items-center justify-center text-neutral-400 hover:text-primary hover:bg-primary/5 transition-all outline-none border border-neutral-100 hover:scale-110 active:scale-90">
      <Icon size={18} />
    </button>
  );
}

function FooterLink({ label }: { label: string }) {
  return (
    <li>
      <button className="text-neutral-400 font-bold text-xs hover:text-primary transition-colors uppercase tracking-wider block">
        {label}
      </button>
    </li>
  );
}

import React from 'react';
import { Modal } from './Modal';
import { useHomeStore } from '../store/homeStore';
import { MapPin, Phone, Star, Globe, CheckCircle2, MessageSquare, ExternalLink, Calendar } from 'lucide-react';
import { cn, formatDate } from '../lib/utils';

export function BusinessDetailModal() {
  const { selectedBusiness, setSelectedBusiness, language } = useHomeStore();
  const isAr = language === 'ar';

  if (!selectedBusiness) return null;

  const name = isAr && selectedBusiness.name_ar ? selectedBusiness.name_ar : selectedBusiness.name;
  const desc = isAr && selectedBusiness.description_ar ? selectedBusiness.description_ar : selectedBusiness.description;

  return (
    <Modal 
      isOpen={!!selectedBusiness} 
      onClose={() => setSelectedBusiness(null)}
      className="max-w-4xl"
    >
      <div className="relative h-80 w-full">
        <img 
          src={selectedBusiness.image_url || 'https://picsum.photos/seed/biz/1200/800'} 
          className="w-full h-full object-cover" 
          alt={name}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-6 left-8 right-8 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-primary text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1">
                {selectedBusiness.category}
              </span>
              {selectedBusiness.is_verified && (
                <span className="bg-white text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1 border border-primary/10">
                  <CheckCircle2 size={10} /> Verified
                </span>
              )}
            </div>
            <h2 className="text-3xl font-black text-white leading-tight">{name}</h2>
          </div>
          <div className="flex items-center gap-1 bg-white px-4 py-2 rounded-2xl shadow-xl">
            <Star size={16} fill="#C8A96A" className="text-accent" />
            <span className="text-sm font-black text-gray-900">{selectedBusiness.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-8">
          <section>
            <h4 className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-4">About the Business</h4>
            <p className="text-neutral-600 font-medium leading-relaxed">
              {desc || "No description available for this business yet."}
            </p>
          </section>

          <section className="grid grid-cols-2 gap-4">
            <InfoCard icon={MapPin} label="Location" value={selectedBusiness.address || selectedBusiness.governorate} />
            <InfoCard icon={Phone} label="Phone" value={selectedBusiness.phone || "Not provided"} />
            <InfoCard icon={Globe} label="Website" value={selectedBusiness.website || "No website"} />
            <InfoCard icon={Calendar} label="Member Since" value={formatDate(selectedBusiness.created_at)} />
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-neutral-50 p-6 rounded-[32px] border border-neutral-100">
            <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-6">Contact & Links</h4>
            <div className="space-y-4">
              <button className="w-full bg-primary text-white rounded-2xl py-4 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                <Phone size={16} /> Call Business
              </button>
              {selectedBusiness.website && (
                <a 
                  href={selectedBusiness.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full bg-white border border-neutral-200 text-gray-900 rounded-2xl py-4 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <ExternalLink size={16} /> Visit Website
                </a>
              )}
            </div>
          </div>
          
          <button className="w-full bg-accent/10 text-accent rounded-2xl py-4 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-accent hover:text-white transition-all">
            <MessageSquare size={16} /> Write Review
          </button>
        </div>
      </div>
    </Modal>
  );
}

function InfoCard({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="bg-white border border-neutral-100 p-5 rounded-[24px]">
      <div className="w-8 h-8 bg-neutral-50 rounded-xl flex items-center justify-center text-accent mb-3">
        <Icon size={16} />
      </div>
      <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm font-bold text-gray-900 line-clamp-1">{value}</p>
    </div>
  );
}

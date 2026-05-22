import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useBusinesses } from '../hooks/useSupabaseData';
import { useHomeStore } from '../store/homeStore';
import L from 'leaflet';

// Fix Leaflet icon issue
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

export function BusinessMap() {
  const { selectedGovernorate, selectedCategory, setSelectedBusiness } = useHomeStore();
  const { businesses } = useBusinesses({ governorate: selectedGovernorate, category: selectedCategory });

  // Default to Baghdad coordinates
  const center: [number, number] = [33.3152, 44.3661];

  return (
    <div className="h-[600px] w-full rounded-[48px] overflow-hidden border border-neutral-100 shadow-sm relative z-0">
      <MapContainer center={center} zoom={6} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {businesses.map((biz) => {
          // If we had real lat/lng in the table, we'd use them. 
          // For now, let's mock positions if they are missing or just skip.
          if (!biz.latitude || !biz.longitude) return null;
          
          return (
            <Marker key={biz.id} position={[biz.latitude, biz.longitude]}>
              <Popup>
                <div className="p-2">
                  <h4 className="font-black text-gray-900">{biz.name}</h4>
                  <p className="text-[10px] text-neutral-400 font-bold uppercase">{biz.category}</p>
                  <button 
                    onClick={() => setSelectedBusiness(biz)}
                    className="mt-2 text-primary font-black text-[10px] uppercase tracking-widest"
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

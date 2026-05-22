import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Upload, Camera } from 'lucide-react';
import { useHomeStore } from '../../store/homeStore';
import { useBuildModeStore } from '../../store/buildModeStore';
import { cn } from '../../lib/utils';

export function HeroSection() {
  const { language } = useHomeStore();
  const { heroSlides, updateHeroImage } = useBuildModeStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      paginate(1);
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex, heroSlides.length]);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => (prev + newDirection + heroSlides.length) % heroSlides.length);
  };

  const currentSlide = heroSlides[currentIndex];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateHeroImage(currentSlide.id, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <section className="max-w-6xl mx-auto p-6 mb-12 relative">
      <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-[48px] overflow-hidden shadow-2xl bg-neutral-900 group">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="absolute inset-0"
          >
            <img 
              src={currentSlide.image_url} 
              alt=""
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            
            {/* Build Mode Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 z-20">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-white/90 backdrop-blur-md text-neutral-900 px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
              >
                <Camera size={18} />
                {language === 'ar' ? 'استبدال الصورة' : 'Replace Image'}
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange}
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <div className="absolute bottom-10 right-10 flex gap-4 z-30">
          <button 
            onClick={() => paginate(-1)}
            className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all shadow-xl"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={() => paginate(1)}
            className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all shadow-xl"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
          {heroSlides.map((_, i) => (
            <div 
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === currentIndex ? "w-8 bg-primary" : "w-2 bg-white/40"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

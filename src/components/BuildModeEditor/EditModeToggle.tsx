import React from 'react';
import { useHomeStore } from '../../store/homeStore';
import { useAuthStore } from '../../store/authStore';
import { motion } from 'motion/react';
import { Wrench, Eye, Edit3 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { isAdmin as checkIsAdmin } from '../../lib/adminAuth';

export function EditModeToggle() {
  const { isEditMode, toggleEditMode } = useHomeStore();
  const { profile } = useAuthStore();
  const isAdmin = checkIsAdmin(profile);

  if (!isAdmin) return null;

  return (
    <div className="fixed top-4 right-4 z-[9500] flex items-center gap-2">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleEditMode}
        className={cn(
          "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-xl backdrop-blur-md",
          isEditMode 
            ? "bg-primary text-white ring-4 ring-primary/20" 
            : "bg-white/90 text-neutral-400 hover:text-primary ring-1 ring-neutral-200"
        )}
      >
        {isEditMode ? (
          <>
            <Edit3 size={14} />
            <span>Edit Mode: ON</span>
          </>
        ) : (
          <>
            <Eye size={14} />
            <span>Edit Mode: OFF</span>
          </>
        )}
      </motion.button>
    </div>
  );
}

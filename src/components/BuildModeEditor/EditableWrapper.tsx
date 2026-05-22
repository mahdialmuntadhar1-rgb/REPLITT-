import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Edit3, Plus, Trash2 } from 'lucide-react';
import { useHomeStore } from '../../store/homeStore';
import { useAuthStore } from '../../store/authStore';
import { isAdmin as checkIsAdmin } from '../../lib/adminAuth';
import { cn } from '../../lib/utils';
import { InlineEditor, EditorField } from './InlineEditor';

interface EditableWrapperProps {
  children: React.ReactNode;
  fields: EditorField[];
  initialValues: any;
  onSave: (values: any) => Promise<void>;
  onDelete?: () => Promise<void>;
  onAdd?: () => Promise<void>;
  title?: string;
  className?: string;
  overlayClassName?: string;
  isEnabled?: boolean;
}

export function EditableWrapper({ 
  children, 
  fields, 
  initialValues, 
  onSave, 
  onDelete, 
  onAdd, 
  title, 
  className,
  overlayClassName,
  isEnabled = true
}: EditableWrapperProps) {
  const { isEditMode } = useHomeStore();
  const { profile } = useAuthStore();
  const isAdmin = checkIsAdmin(profile);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  if (!isEditMode || !isAdmin || !isEnabled) return <>{children}</>;

  return (
    <div 
      className={cn("relative group/editable", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Visual Overlay for Edit Mode */}
      <AnimatePresence>
        {isHovered && !isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "absolute inset-0 z-40 border-2 border-primary ring-4 ring-primary/20 bg-primary/5 rounded-[inherit] cursor-pointer pointer-events-none transition-all",
              overlayClassName
            )}
          />
        )}
      </AnimatePresence>

      {/* Control Buttons */}
      <AnimatePresence>
        {isHovered && !isEditing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-4 right-4 z-50 flex gap-2"
          >
            <button
              onClick={() => setIsEditing(true)}
              className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all"
            >
              <Edit3 size={18} />
            </button>
            {onDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="w-10 h-10 bg-white text-red-500 rounded-xl flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all border border-neutral-100"
              >
                <Trash2 size={18} />
              </button>
            )}
            {onAdd && (
              <button
                onClick={(e) => { e.stopPropagation(); onAdd(); }}
                className="w-10 h-10 bg-green-500 text-white rounded-xl flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all"
              >
                <Plus size={18} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Inline Editor Panel */}
      <AnimatePresence>
        {isEditing && (
          <InlineEditor
            title={title}
            fields={fields}
            initialValues={initialValues}
            onSave={onSave}
            onCancel={() => setIsEditing(false)}
          />
        )}
      </AnimatePresence>

      {/* Original Content */}
      {children}
    </div>
  );
}

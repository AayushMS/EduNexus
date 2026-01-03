'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence, useDragControls, PanInfo } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
  showHandle?: boolean;
  showCloseButton?: boolean;
  snapPoints?: number[];
  defaultSnap?: number;
}

export function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
  className,
  showHandle = true,
  showCloseButton = true,
  snapPoints = [0.5, 0.9],
  defaultSnap = 0,
}: BottomSheetProps) {
  const dragControls = useDragControls();
  const sheetRef = useRef<HTMLDivElement>(null);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const velocity = info.velocity.y;
    const offset = info.offset.y;

    // Close if dragged down with enough velocity or distance
    if (velocity > 500 || offset > 150) {
      onClose();
    }
  };

  const currentHeight = typeof window !== 'undefined' ? window.innerHeight * snapPoints[defaultSnap] : 400;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Sheet */}
          <motion.div
            ref={sheetRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag="y"
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.1, bottom: 0.5 }}
            onDragEnd={handleDragEnd}
            style={{ maxHeight: currentHeight }}
            className={cn(
              'fixed bottom-0 left-0 right-0 z-50',
              'bg-background rounded-t-2xl shadow-xl',
              'flex flex-col',
              className
            )}
          >
            {/* Drag handle */}
            {showHandle && (
              <div
                onPointerDown={(e) => dragControls.start(e)}
                className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
              >
                <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
              </div>
            )}

            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between px-4 pb-3 border-b">
                <h2 className="text-lg font-semibold">{title}</h2>
                {showCloseButton && (
                  <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Quick action sheet variant
interface ActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  actions: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    destructive?: boolean;
    disabled?: boolean;
  }>;
  title?: string;
  cancelLabel?: string;
}

export function ActionSheet({
  isOpen,
  onClose,
  actions,
  title,
  cancelLabel = 'Cancel',
}: ActionSheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} showHandle={false} showCloseButton={false}>
      <div className="p-4 space-y-2">
        {title && (
          <p className="text-sm text-muted-foreground text-center px-4 pb-2">{title}</p>
        )}

        <div className="bg-muted/50 rounded-xl overflow-hidden divide-y divide-border">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => {
                action.onClick();
                onClose();
              }}
              disabled={action.disabled}
              className={cn(
                'w-full px-4 py-3 text-center font-medium transition-colors',
                'hover:bg-muted active:bg-muted/80',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                action.destructive && 'text-red-500',
                'flex items-center justify-center gap-2'
              )}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full px-4 py-3 text-center font-semibold bg-muted/50 rounded-xl hover:bg-muted active:bg-muted/80 transition-colors"
        >
          {cancelLabel}
        </button>
      </div>
    </BottomSheet>
  );
}

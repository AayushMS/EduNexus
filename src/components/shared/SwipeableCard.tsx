'use client';

import { useState, useRef } from 'react';
import { motion, useAnimation, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { Heart, X, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onDoubleTap?: () => void;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  className?: string;
  threshold?: number;
  disabled?: boolean;
}

export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  onDoubleTap,
  leftAction,
  rightAction,
  className,
  threshold = 100,
  disabled = false,
}: SwipeableCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const controls = useAnimation();
  const x = useMotionValue(0);
  const lastTap = useRef(0);

  // Transform values based on drag position
  const leftOpacity = useTransform(x, [-threshold, 0], [1, 0]);
  const rightOpacity = useTransform(x, [0, threshold], [0, 1]);
  const scale = useTransform(x, [-threshold, 0, threshold], [0.98, 1, 0.98]);
  const rotate = useTransform(x, [-threshold, 0, threshold], [-5, 0, 5]);

  const handleDragStart = () => {
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragEnd = async (_: unknown, info: PanInfo) => {
    setIsDragging(false);

    if (disabled) return;

    const swipeThreshold = threshold;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    // Check if swipe was strong enough
    if (Math.abs(velocity) > 500 || Math.abs(offset) > swipeThreshold) {
      if (offset < 0 && onSwipeLeft) {
        // Swipe left
        await controls.start({ x: -200, opacity: 0, transition: { duration: 0.2 } });
        onSwipeLeft();
        await controls.start({ x: 0, opacity: 1, transition: { duration: 0 } });
      } else if (offset > 0 && onSwipeRight) {
        // Swipe right
        await controls.start({ x: 200, opacity: 0, transition: { duration: 0.2 } });
        onSwipeRight();
        await controls.start({ x: 0, opacity: 1, transition: { duration: 0 } });
      } else {
        controls.start({ x: 0, transition: { type: 'spring', stiffness: 500, damping: 30 } });
      }
    } else {
      controls.start({ x: 0, transition: { type: 'spring', stiffness: 500, damping: 30 } });
    }
  };

  const handleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTap.current < DOUBLE_TAP_DELAY && onDoubleTap) {
      onDoubleTap();
    }

    lastTap.current = now;
  };

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Left action indicator */}
      {leftAction && (
        <motion.div
          style={{ opacity: leftOpacity }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-0"
        >
          {leftAction}
        </motion.div>
      )}

      {/* Right action indicator */}
      {rightAction && (
        <motion.div
          style={{ opacity: rightOpacity }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-0"
        >
          {rightAction}
        </motion.div>
      )}

      {/* Card content */}
      <motion.div
        drag={disabled ? false : 'x'}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.5}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onTap={handleTap}
        animate={controls}
        style={{ x, scale, rotate }}
        className={cn(
          'relative z-10 touch-pan-y',
          isDragging && 'cursor-grabbing'
        )}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Pre-built swipe action indicators
export function SwipeLikeAction({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30',
        className
      )}
    >
      <Heart className="h-6 w-6 text-red-500 fill-red-500" />
    </div>
  );
}

export function SwipeDismissAction({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800',
        className
      )}
    >
      <X className="h-6 w-6 text-gray-500" />
    </div>
  );
}

export function SwipeUndoAction({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30',
        className
      )}
    >
      <RotateCcw className="h-6 w-6 text-blue-500" />
    </div>
  );
}

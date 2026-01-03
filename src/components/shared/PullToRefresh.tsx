'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { Loader2, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocaleStore } from '@/store/localeStore';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const PULL_THRESHOLD = 80;

export function PullToRefresh({
  onRefresh,
  children,
  className,
  disabled = false,
}: PullToRefreshProps) {
  const { locale } = useLocaleStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const pullDistance = useMotionValue(0);
  const controls = useAnimation();

  const pullProgress = useTransform(pullDistance, [0, PULL_THRESHOLD], [0, 1]);
  const opacity = useTransform(pullDistance, [0, PULL_THRESHOLD / 2], [0, 1]);
  const scale = useTransform(pullDistance, [0, PULL_THRESHOLD], [0.5, 1]);
  const rotate = useTransform(pullDistance, [0, PULL_THRESHOLD], [0, 180]);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (disabled || isRefreshing) return;

      const container = containerRef.current;
      if (!container || container.scrollTop > 0) return;

      startY.current = e.touches[0].clientY;
      setIsPulling(true);
    },
    [disabled, isRefreshing]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isPulling || disabled || isRefreshing) return;

      const container = containerRef.current;
      if (!container || container.scrollTop > 0) {
        pullDistance.set(0);
        return;
      }

      const currentY = e.touches[0].clientY;
      const diff = Math.max(0, (currentY - startY.current) * 0.5);
      pullDistance.set(Math.min(diff, PULL_THRESHOLD * 1.5));

      if (diff > 10) {
        e.preventDefault();
      }
    },
    [isPulling, disabled, isRefreshing, pullDistance]
  );

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling || disabled) return;

    setIsPulling(false);

    if (pullDistance.get() >= PULL_THRESHOLD && !isRefreshing) {
      setIsRefreshing(true);
      pullDistance.set(PULL_THRESHOLD);

      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        await controls.start({ y: 0 });
        pullDistance.set(0);
      }
    } else {
      await controls.start({ y: 0 });
      pullDistance.set(0);
    }
  }, [isPulling, disabled, isRefreshing, pullDistance, onRefresh, controls]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return (
    <div ref={containerRef} className={cn('relative overflow-auto', className)}>
      {/* Pull indicator */}
      <motion.div
        style={{ height: pullDistance, opacity }}
        className="absolute top-0 left-0 right-0 flex items-center justify-center overflow-hidden bg-background z-10"
      >
        <motion.div style={{ scale }} className="flex flex-col items-center gap-1">
          {isRefreshing ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="text-xs text-muted-foreground">
                {locale === 'en' ? 'Refreshing...' : 'रिफ्रेस हुँदैछ...'}
              </span>
            </>
          ) : (
            <>
              <motion.div style={{ rotate }}>
                <ArrowDown className="h-6 w-6 text-primary" />
              </motion.div>
              <span className="text-xs text-muted-foreground">
                {pullDistance.get() >= PULL_THRESHOLD
                  ? locale === 'en'
                    ? 'Release to refresh'
                    : 'रिफ्रेश गर्न छोड्नुहोस्'
                  : locale === 'en'
                  ? 'Pull to refresh'
                  : 'रिफ्रेश गर्न तान्नुहोस्'}
              </span>
            </>
          )}
        </motion.div>
      </motion.div>

      {/* Content */}
      <motion.div animate={controls} style={{ y: pullDistance }}>
        {children}
      </motion.div>
    </div>
  );
}

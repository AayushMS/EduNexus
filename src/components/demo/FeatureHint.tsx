'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocaleStore } from '@/store/localeStore';
import { Button } from '@/components/ui/button';
import { X, Lightbulb } from 'lucide-react';

interface FeatureHintProps {
  id: string;
  title: string;
  titleNe: string;
  description: string;
  descriptionNe: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  children: React.ReactNode;
}

export function FeatureHint({
  id,
  title,
  titleNe,
  description,
  descriptionNe,
  position = 'bottom',
  delay = 3000,
  children,
}: FeatureHintProps) {
  const { locale } = useLocaleStore();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if hint was already dismissed
    const dismissed = localStorage.getItem(`hint_${id}_dismissed`);
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    // Show hint after delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [id, delay]);

  const handleDismiss = () => {
    localStorage.setItem(`hint_${id}_dismissed`, 'true');
    setIsDismissed(true);
    setIsVisible(false);
  };

  const positionClasses = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-primary',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-primary',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-primary',
    right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-primary',
  };

  if (isDismissed) {
    return <>{children}</>;
  }

  return (
    <div className="relative inline-block">
      {children}

      {/* Pulsing indicator */}
      <AnimatePresence>
        {!isVisible && !isDismissed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 z-10"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint popup */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`absolute z-50 w-64 ${positionClasses[position]}`}
          >
            <div className="bg-primary text-primary-foreground rounded-lg shadow-lg p-3">
              {/* Arrow */}
              <div
                className={`absolute border-8 border-solid ${arrowClasses[position]}`}
              />

              {/* Content */}
              <div className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm">
                    {locale === 'en' ? title : titleNe}
                  </h4>
                  <p className="text-xs opacity-90 mt-1">
                    {locale === 'en' ? description : descriptionNe}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-white/20 shrink-0"
                  onClick={handleDismiss}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>

              <Button
                variant="secondary"
                size="sm"
                className="w-full mt-2 text-xs h-7"
                onClick={handleDismiss}
              >
                {locale === 'en' ? 'Got it!' : 'बुझें!'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

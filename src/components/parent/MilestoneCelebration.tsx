'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useLocaleStore } from '@/store/localeStore';
import { Trophy, Star, Share2, Download, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MilestoneCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  milestone: {
    title: { en: string; ne: string };
    description: { en: string; ne: string };
    childName: { en: string; ne: string };
    type: 'academic' | 'attendance' | 'behavior' | 'special';
    date: string;
    xpReward?: number;
  };
}

const milestoneIcons = {
  academic: '📚',
  attendance: '🎯',
  behavior: '⭐',
  special: '🏆',
};

const milestoneColors = {
  academic: 'from-blue-500 to-cyan-500',
  attendance: 'from-green-500 to-emerald-500',
  behavior: 'from-purple-500 to-pink-500',
  special: 'from-amber-500 to-orange-500',
};

export function MilestoneCelebration({
  isOpen,
  onClose,
  milestone,
}: MilestoneCelebrationProps) {
  const { locale } = useLocaleStore();
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Trigger confetti animation
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const handleShare = async () => {
    const shareText = locale === 'en'
      ? `🎉 ${milestone.childName.en} achieved: ${milestone.title.en}! #EduNexus #ProudParent`
      : `🎉 ${milestone.childName.ne} ले हासिल गर्नुभयो: ${milestone.title.ne}! #EduNexus #गर्विलो_अभिभावक`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: milestone.title[locale],
          text: shareText,
        });
      } catch {
        setShowShare(true);
      }
    } else {
      setShowShare(true);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="relative w-full max-w-md bg-card rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Header with gradient */}
            <div
              className={`bg-gradient-to-br ${milestoneColors[milestone.type]} p-8 text-white text-center`}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="text-7xl mb-4"
              >
                {milestoneIcons[milestone.type]}
              </motion.div>
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold mb-2"
              >
                {locale === 'en' ? '🎉 Congratulations!' : '🎉 बधाई छ!'}
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-white/90"
              >
                {milestone.childName[locale]}
              </motion.p>
            </div>

            {/* Content */}
            <div className="p-6 text-center">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="text-xl font-bold mb-2">{milestone.title[locale]}</h3>
                <p className="text-muted-foreground mb-4">
                  {milestone.description[locale]}
                </p>

                {milestone.xpReward && (
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                    <Star className="h-5 w-5" />
                    <span className="font-semibold">
                      +{milestone.xpReward} XP{' '}
                      {locale === 'en' ? 'earned!' : 'कमाइयो!'}
                    </span>
                  </div>
                )}

                {/* Certificate preview */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-2 border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Trophy className="h-5 w-5 text-amber-600" />
                    <span className="font-semibold text-amber-700 dark:text-amber-400">
                      {locale === 'en' ? 'Achievement Certificate' : 'उपलब्धि प्रमाणपत्र'}
                    </span>
                  </div>
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    {milestone.date}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    {locale === 'en' ? 'Share' : 'साझा गर्नुहोस्'}
                  </Button>
                  <Button className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    {locale === 'en' ? 'Download' : 'डाउनलोड'}
                  </Button>
                </div>
              </motion.div>
            </div>

            {/* Social share dropdown */}
            {showShare && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-popover border rounded-lg shadow-lg p-3"
              >
                <p className="text-sm text-muted-foreground mb-2">
                  {locale === 'en' ? 'Share on:' : 'मा साझा गर्नुहोस्:'}
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Facebook
                  </Button>
                  <Button size="sm" variant="outline">
                    WhatsApp
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

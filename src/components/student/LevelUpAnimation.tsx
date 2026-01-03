'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocaleStore, toDevanagariNumerals } from '@/store/localeStore';
import { getLevelName } from '@/store/gamificationStore';
import { Star, Sparkles, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';

interface LevelUpAnimationProps {
  isOpen: boolean;
  onClose: () => void;
  newLevel: number;
  xpEarned?: number;
  unlockedRewards?: {
    type: 'badge' | 'avatar' | 'title';
    name: { en: string; ne: string };
    icon: string;
  }[];
}

export function LevelUpAnimation({
  isOpen,
  onClose,
  newLevel,
  xpEarned,
  unlockedRewards = [],
}: LevelUpAnimationProps) {
  const { locale, useDevanagariNumerals } = useLocaleStore();
  const levelName = getLevelName(newLevel);

  const formatNumber = (num: number) => {
    if (useDevanagariNumerals && locale === 'ne') {
      return toDevanagariNumerals(num);
    }
    return num.toString();
  };

  useEffect(() => {
    if (isOpen) {
      // Multi-stage confetti
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;

      const colors = ['#9333ea', '#ec4899', '#f97316', '#fbbf24', '#22c55e'];

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });

        if (Date.now() < animationEnd) {
          requestAnimationFrame(frame);
        }
      };

      // Initial burst
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 },
        colors: colors,
      });

      frame();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.3, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm mx-4"
          >
            {/* Glowing background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-3xl blur-xl opacity-60"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.6, 0.8, 0.6],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Main card */}
            <div className="relative bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 rounded-3xl p-1">
              <div className="bg-background rounded-[22px] p-8 text-center">
                {/* Floating stars */}
                <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      initial={{
                        x: `${Math.random() * 100}%`,
                        y: `${Math.random() * 100}%`,
                        opacity: 0,
                      }}
                      animate={{
                        y: [null, '-20%'],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.3,
                        repeat: Infinity,
                      }}
                    >
                      <Sparkles className="h-4 w-4 text-yellow-400" />
                    </motion.div>
                  ))}
                </div>

                {/* Level up text */}
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 mb-2"
                >
                  {locale === 'en' ? '🎉 LEVEL UP! 🎉' : '🎉 स्तर माथि! 🎉'}
                </motion.div>

                {/* Level badge */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
                  className="relative inline-block mb-4"
                >
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-background flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          {formatNumber(newLevel)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <motion.div
                    className="absolute -top-2 -right-2"
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Star className="h-8 w-8 text-yellow-400 fill-yellow-400" />
                  </motion.div>
                </motion.div>

                {/* Level name */}
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl font-bold mb-2"
                >
                  {levelName[locale]}
                </motion.h2>

                {/* XP earned */}
                {xpEarned && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                    className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-4 py-2 rounded-full mb-4"
                  >
                    <Star className="h-4 w-4" />
                    <span className="font-semibold">+{formatNumber(xpEarned)} XP</span>
                  </motion.div>
                )}

                {/* Unlocked rewards */}
                {unlockedRewards.length > 0 && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-2 mb-6"
                  >
                    <p className="text-sm text-muted-foreground">
                      {locale === 'en' ? 'New unlocks:' : 'नयाँ अनलक:'}
                    </p>
                    <div className="flex justify-center gap-2">
                      {unlockedRewards.map((reward, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.7 + i * 0.1 }}
                          className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-full"
                        >
                          <span>{reward.icon}</span>
                          <span className="text-sm font-medium">
                            {reward.name[locale]}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Continue button */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <Button
                    onClick={onClose}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8"
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    {locale === 'en' ? 'Awesome!' : 'उत्कृष्ट!'}
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

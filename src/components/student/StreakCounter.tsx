'use client';

import { motion } from 'framer-motion';
import { useLocaleStore, toDevanagariNumerals } from '@/store/localeStore';
import { Flame, Calendar, Target } from 'lucide-react';

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
  streakType: 'homework' | 'attendance' | 'reading';
  lastActivityDate?: string;
}

const streakConfig = {
  homework: {
    icon: Target,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    label: { en: 'Homework Streak', ne: 'गृहकार्य स्ट्रिक' },
  },
  attendance: {
    icon: Calendar,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    label: { en: 'Attendance Streak', ne: 'उपस्थिति स्ट्रिक' },
  },
  reading: {
    icon: Target,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    label: { en: 'Reading Streak', ne: 'पढाइ स्ट्रिक' },
  },
};

export function StreakCounter({
  currentStreak,
  longestStreak,
  streakType,
  lastActivityDate,
}: StreakCounterProps) {
  const { locale, useDevanagariNumerals } = useLocaleStore();
  const config = streakConfig[streakType];
  const Icon = config.icon;

  const formatNumber = (num: number) => {
    if (useDevanagariNumerals && locale === 'ne') {
      return toDevanagariNumerals(num);
    }
    return num.toString();
  };

  const isOnFire = currentStreak >= 7;
  const isMilestone = currentStreak > 0 && currentStreak % 7 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${config.bgColor} rounded-xl p-4`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${config.color}`} />
          <span className="text-sm font-medium">{config.label[locale]}</span>
        </div>
        {isOnFire && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <Flame className="h-5 w-5 text-orange-500" />
          </motion.div>
        )}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <motion.div
            key={currentStreak}
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-baseline gap-1"
          >
            <span className={`text-4xl font-bold ${config.color}`}>
              {formatNumber(currentStreak)}
            </span>
            <span className="text-lg text-muted-foreground">
              {locale === 'en' ? 'days' : 'दिन'}
            </span>
          </motion.div>

          {isMilestone && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1 mt-1"
            >
              <span className="text-xs">🎉</span>
              <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                {locale === 'en' ? 'Milestone reached!' : 'माइलस्टोन पुग्यो!'}
              </span>
            </motion.div>
          )}
        </div>

        <div className="text-right">
          <p className="text-xs text-muted-foreground">
            {locale === 'en' ? 'Best' : 'सर्वश्रेष्ठ'}
          </p>
          <p className="text-sm font-semibold">
            {formatNumber(longestStreak)} {locale === 'en' ? 'days' : 'दिन'}
          </p>
        </div>
      </div>

      {/* Streak visualization */}
      <div className="flex gap-1 mt-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`
              flex-1 h-2 rounded-full
              ${i < currentStreak % 7 || (currentStreak >= 7 && currentStreak % 7 === 0)
                ? config.color.replace('text-', 'bg-')
                : 'bg-secondary'
              }
            `}
          />
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-2 text-center">
        {currentStreak % 7 === 0 && currentStreak > 0
          ? locale === 'en'
            ? '🔥 Week complete!'
            : '🔥 हप्ता पूरा!'
          : locale === 'en'
          ? `${7 - (currentStreak % 7)} days to next milestone`
          : `अर्को माइलस्टोनमा ${7 - (currentStreak % 7)} दिन`}
      </p>
    </motion.div>
  );
}

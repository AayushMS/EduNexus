'use client';

import { motion } from 'framer-motion';
import { useLocaleStore, toDevanagariNumerals } from '@/store/localeStore';
import { getLevelFromXP, getXPForLevel, getLevelName } from '@/store/gamificationStore';
import { Star, TrendingUp } from 'lucide-react';

interface XPProgressBarProps {
  currentXP: number;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeConfig = {
  sm: {
    bar: 'h-2',
    text: 'text-xs',
    icon: 'h-3 w-3',
    padding: 'p-2',
  },
  md: {
    bar: 'h-3',
    text: 'text-sm',
    icon: 'h-4 w-4',
    padding: 'p-3',
  },
  lg: {
    bar: 'h-4',
    text: 'text-base',
    icon: 'h-5 w-5',
    padding: 'p-4',
  },
};

export function XPProgressBar({
  currentXP,
  showDetails = true,
  size = 'md',
}: XPProgressBarProps) {
  const { locale, useDevanagariNumerals } = useLocaleStore();
  const config = sizeConfig[size];

  const currentLevel = getLevelFromXP(currentXP);
  const currentLevelXP = getXPForLevel(currentLevel - 1);
  const nextLevelXP = getXPForLevel(currentLevel);
  const xpInCurrentLevel = currentXP - currentLevelXP;
  const xpNeededForNextLevel = nextLevelXP - currentLevelXP;
  const progress = (xpInCurrentLevel / xpNeededForNextLevel) * 100;

  const levelName = getLevelName(currentLevel);

  const formatNumber = (num: number) => {
    if (useDevanagariNumerals && locale === 'ne') {
      return toDevanagariNumerals(num);
    }
    return num.toLocaleString();
  };

  return (
    <div className="space-y-2">
      {showDetails && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-1.5">
              <Star className={`${config.icon} text-white`} />
            </div>
            <div>
              <p className={`font-semibold ${config.text}`}>
                {locale === 'en' ? 'Level' : 'स्तर'} {formatNumber(currentLevel)}
              </p>
              <p className={`${config.text} text-muted-foreground`}>
                {levelName[locale]}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className={`font-bold ${config.text} text-purple-600 dark:text-purple-400`}>
              {formatNumber(currentXP)} XP
            </p>
            <p className={`${config.text} text-muted-foreground`}>
              {formatNumber(xpNeededForNextLevel - xpInCurrentLevel)} {locale === 'en' ? 'to next' : 'अगाडि'}
            </p>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className={`relative ${config.bar} bg-secondary rounded-full overflow-hidden`}>
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
            ease: 'linear',
          }}
        />
      </div>

      {!showDetails && (
        <div className={`flex justify-between ${config.text} text-muted-foreground`}>
          <span>{formatNumber(xpInCurrentLevel)}</span>
          <span>{formatNumber(xpNeededForNextLevel)}</span>
        </div>
      )}
    </div>
  );
}

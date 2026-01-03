'use client';

import { cn } from '@/lib/utils';
import type { Badge } from '@/types/gamification.types';

interface BadgeIconProps {
  badge: Badge;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showGlow?: boolean;
  isEarned?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-10 h-10 text-lg',
  md: 'w-14 h-14 text-2xl',
  lg: 'w-20 h-20 text-3xl',
  xl: 'w-28 h-28 text-4xl',
};

const rarityStyles = {
  common: {
    border: 'border-gray-300 dark:border-gray-600',
    bg: 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900',
    glow: '',
    ribbon: 'fill-gray-400',
  },
  rare: {
    border: 'border-blue-400',
    bg: 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40',
    glow: 'shadow-lg shadow-blue-400/30',
    ribbon: 'fill-blue-500',
  },
  epic: {
    border: 'border-purple-400',
    bg: 'bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40',
    glow: 'shadow-xl shadow-purple-400/40',
    ribbon: 'fill-purple-500',
  },
  legendary: {
    border: 'border-amber-400',
    bg: 'bg-gradient-to-br from-amber-100 via-yellow-100 to-orange-100 dark:from-amber-900/40 dark:via-yellow-900/40 dark:to-orange-900/40',
    glow: 'shadow-2xl shadow-amber-400/50 animate-pulse',
    ribbon: 'fill-amber-500',
  },
};

export function BadgeIcon({
  badge,
  size = 'md',
  showGlow = true,
  isEarned = true,
  className,
}: BadgeIconProps) {
  const style = rarityStyles[badge.rarity];

  return (
    <div
      className={cn(
        'relative rounded-xl border-2 flex items-center justify-center transition-all duration-300',
        sizeClasses[size],
        style.border,
        style.bg,
        showGlow && isEarned && style.glow,
        !isEarned && 'opacity-40 grayscale',
        className
      )}
    >
      {/* Badge icon (emoji) */}
      <span className="relative z-10">{badge.icon}</span>

      {/* Legendary shine effect */}
      {badge.rarity === 'legendary' && isEarned && (
        <div className="absolute inset-0 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>
      )}

      {/* Rarity ribbon */}
      {badge.rarity !== 'common' && (
        <svg
          className="absolute -top-1 -right-1 w-4 h-4"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M0 0L20 0L20 20L10 15L0 20L0 0Z"
            className={style.ribbon}
          />
        </svg>
      )}
    </div>
  );
}

// Badge display with category icon
interface CategoryBadgeProps {
  category: 'academic' | 'attendance' | 'behavior' | 'participation' | 'special';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const categoryIcons = {
  academic: { icon: '📚', color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30' },
  attendance: { icon: '✅', color: 'text-green-500 bg-green-100 dark:bg-green-900/30' },
  behavior: { icon: '⭐', color: 'text-amber-500 bg-amber-100 dark:bg-amber-900/30' },
  participation: { icon: '🎯', color: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30' },
  special: { icon: '🏆', color: 'text-rose-500 bg-rose-100 dark:bg-rose-900/30' },
};

const categorySizeClasses = {
  sm: 'w-6 h-6 text-sm',
  md: 'w-8 h-8 text-base',
  lg: 'w-10 h-10 text-lg',
};

export function CategoryBadge({ category, size = 'md', className }: CategoryBadgeProps) {
  const { icon, color } = categoryIcons[category];

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center',
        categorySizeClasses[size],
        color,
        className
      )}
    >
      {icon}
    </div>
  );
}

// XP Reward display
interface XPRewardProps {
  amount: number;
  size?: 'sm' | 'md' | 'lg';
  showPlus?: boolean;
  className?: string;
}

const xpSizeClasses = {
  sm: 'text-xs px-1.5 py-0.5',
  md: 'text-sm px-2 py-1',
  lg: 'text-base px-3 py-1.5',
};

export function XPReward({ amount, size = 'md', showPlus = true, className }: XPRewardProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 font-semibold',
        xpSizeClasses[size],
        className
      )}
    >
      {showPlus && '+'}
      {amount} XP
    </span>
  );
}

// Level badge display
interface LevelBadgeProps {
  level: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const levelSizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
};

export function LevelBadge({ level, size = 'md', className }: LevelBadgeProps) {
  // Color based on level tier
  const tierColor =
    level >= 50
      ? 'from-amber-400 to-orange-500 text-white'
      : level >= 20
      ? 'from-purple-400 to-pink-500 text-white'
      : level >= 10
      ? 'from-blue-400 to-indigo-500 text-white'
      : 'from-green-400 to-emerald-500 text-white';

  return (
    <div
      className={cn(
        'rounded-full bg-gradient-to-br flex items-center justify-center font-bold shadow-lg',
        levelSizeClasses[size],
        tierColor,
        className
      )}
    >
      {level}
    </div>
  );
}

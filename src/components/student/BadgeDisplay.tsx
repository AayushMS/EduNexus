'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocaleStore } from '@/store/localeStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge as BadgeUI } from '@/components/ui/badge';
import type { Badge } from '@/types/gamification.types';

interface BadgeDisplayProps {
  badges: Badge[];
  earnedBadgeIds: string[];
  maxDisplay?: number;
  showAll?: boolean;
}

const rarityColors = {
  common: {
    bg: 'bg-gray-100 dark:bg-gray-800',
    border: 'border-gray-300 dark:border-gray-600',
    glow: '',
    text: 'text-gray-600 dark:text-gray-400',
  },
  rare: {
    bg: 'bg-blue-50 dark:bg-blue-900/30',
    border: 'border-blue-400',
    glow: 'shadow-blue-400/30 shadow-lg',
    text: 'text-blue-600 dark:text-blue-400',
  },
  epic: {
    bg: 'bg-purple-50 dark:bg-purple-900/30',
    border: 'border-purple-400',
    glow: 'shadow-purple-400/50 shadow-xl',
    text: 'text-purple-600 dark:text-purple-400',
  },
  legendary: {
    bg: 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30',
    border: 'border-amber-400',
    glow: 'shadow-amber-400/60 shadow-2xl animate-pulse',
    text: 'text-amber-600 dark:text-amber-400',
  },
};

const rarityLabels = {
  common: { en: 'Common', ne: 'सामान्य' },
  rare: { en: 'Rare', ne: 'दुर्लभ' },
  epic: { en: 'Epic', ne: 'महाकाव्य' },
  legendary: { en: 'Legendary', ne: 'दन्तकथा' },
};

export function BadgeDisplay({
  badges,
  earnedBadgeIds,
  maxDisplay = 6,
  showAll = false,
}: BadgeDisplayProps) {
  const { locale } = useLocaleStore();
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [showAllModal, setShowAllModal] = useState(false);

  const earnedBadges = badges.filter((b) => earnedBadgeIds.includes(b.id));
  const displayBadges = showAll ? earnedBadges : earnedBadges.slice(0, maxDisplay);
  const remainingCount = earnedBadges.length - maxDisplay;

  const renderBadge = (badge: Badge, index: number) => {
    const isEarned = earnedBadgeIds.includes(badge.id);
    const colors = rarityColors[badge.rarity];

    return (
      <motion.button
        key={badge.id}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 15,
          delay: index * 0.1,
        }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setSelectedBadge(badge)}
        className={`
          relative w-16 h-16 rounded-xl border-2 flex items-center justify-center
          transition-all duration-300 cursor-pointer
          ${colors.bg} ${colors.border} ${isEarned ? colors.glow : 'opacity-40 grayscale'}
        `}
      >
        <span className="text-3xl">{badge.icon}</span>
        {isEarned && badge.rarity === 'legendary' && (
          <motion.div
            className="absolute inset-0 rounded-xl border-2 border-amber-400"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>
    );
  };

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">
            {locale === 'en' ? 'Badges' : 'ब्याजहरू'}
          </h3>
          <span className="text-sm text-muted-foreground">
            {earnedBadges.length}/{badges.length}{' '}
            {locale === 'en' ? 'earned' : 'कमाइएको'}
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          {displayBadges.map((badge, index) => renderBadge(badge, index))}

          {!showAll && remainingCount > 0 && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: maxDisplay * 0.1 }}
              onClick={() => setShowAllModal(true)}
              className="w-16 h-16 rounded-xl border-2 border-dashed border-muted-foreground/30 flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <span className="text-lg font-bold">+{remainingCount}</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Badge Detail Modal */}
      <Dialog open={!!selectedBadge} onOpenChange={() => setSelectedBadge(null)}>
        <DialogContent className="sm:max-w-sm">
          {selectedBadge && (
            <>
              <DialogHeader>
                <DialogTitle className="text-center">
                  {locale === 'en' ? selectedBadge.name : selectedBadge.nameNe}
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center py-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className={`
                    w-24 h-24 rounded-2xl border-3 flex items-center justify-center mb-4
                    ${rarityColors[selectedBadge.rarity].bg}
                    ${rarityColors[selectedBadge.rarity].border}
                    ${earnedBadgeIds.includes(selectedBadge.id)
                      ? rarityColors[selectedBadge.rarity].glow
                      : 'opacity-40 grayscale'
                    }
                  `}
                >
                  <span className="text-5xl">{selectedBadge.icon}</span>
                </motion.div>

                <BadgeUI
                  variant="outline"
                  className={rarityColors[selectedBadge.rarity].text}
                >
                  {rarityLabels[selectedBadge.rarity][locale]}
                </BadgeUI>

                <p className="text-center text-muted-foreground mt-4">
                  {locale === 'en'
                    ? selectedBadge.description
                    : selectedBadge.descriptionNe}
                </p>

                <div className="flex items-center gap-2 mt-4 text-purple-600 dark:text-purple-400">
                  <span className="text-lg font-bold">+{selectedBadge.xpReward} XP</span>
                </div>

                {!earnedBadgeIds.includes(selectedBadge.id) && (
                  <div className="mt-4 p-3 bg-secondary rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">
                      {locale === 'en' ? 'Requirement:' : 'आवश्यकता:'}
                    </p>
                    <p className="text-sm font-medium">
                      {locale === 'en'
                        ? selectedBadge.requirement.description
                        : selectedBadge.requirement.descriptionNe}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* View All Badges Modal */}
      <Dialog open={showAllModal} onOpenChange={setShowAllModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {locale === 'en' ? 'All Badges' : 'सबै ब्याजहरू'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-5 gap-3 py-4">
            {badges.map((badge, index) => renderBadge(badge, index))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

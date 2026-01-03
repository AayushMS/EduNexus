'use client';

import { motion } from 'framer-motion';
import { useLocaleStore, toDevanagariNumerals } from '@/store/localeStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, Star, Gift, Zap } from 'lucide-react';

interface Challenge {
  id: string;
  title: { en: string; ne: string };
  description: { en: string; ne: string };
  xpReward: number;
  progress: number;
  target: number;
  completed: boolean;
  icon: string;
}

interface DailyChallengesProps {
  challenges: Challenge[];
  onClaimReward?: (challengeId: string) => void;
}

export function DailyChallenges({ challenges, onClaimReward }: DailyChallengesProps) {
  const { locale, useDevanagariNumerals } = useLocaleStore();

  const formatNumber = (num: number) => {
    if (useDevanagariNumerals && locale === 'ne') {
      return toDevanagariNumerals(num);
    }
    return num.toString();
  };

  const completedCount = challenges.filter((c) => c.completed).length;
  const totalXP = challenges.reduce((sum, c) => sum + (c.completed ? c.xpReward : 0), 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            <CardTitle className="text-base">
              {locale === 'en' ? 'Daily Challenges' : 'दैनिक चुनौतीहरू'}
            </CardTitle>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>
              {formatNumber(completedCount)}/{formatNumber(challenges.length)}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {challenges.map((challenge, index) => {
          const progressPercent = Math.min((challenge.progress / challenge.target) * 100, 100);

          return (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                p-3 rounded-lg border transition-all
                ${challenge.completed
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-secondary/50 border-transparent hover:border-primary/20'
                }
              `}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div
                  className={`
                    w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0
                    ${challenge.completed ? 'bg-green-500/20' : 'bg-primary/10'}
                  `}
                >
                  {challenge.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="font-medium text-sm line-clamp-1">
                      {challenge.title[locale]}
                    </h4>
                    <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400 shrink-0">
                      <Star className="h-3 w-3" />
                      <span className="text-xs font-semibold">
                        +{formatNumber(challenge.xpReward)}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                    {challenge.description[locale]}
                  </p>

                  {/* Progress */}
                  <div className="flex items-center gap-2">
                    <Progress value={progressPercent} className="h-1.5 flex-1" />
                    <span className="text-xs text-muted-foreground shrink-0">
                      {formatNumber(challenge.progress)}/{formatNumber(challenge.target)}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <div className="shrink-0">
                  {challenge.completed ? (
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onClaimReward?.(challenge.id)}
                      className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white"
                    >
                      <Gift className="h-4 w-4" />
                    </motion.button>
                  ) : (
                    <div className="w-8 h-8 rounded-full border-2 border-muted-foreground/20 flex items-center justify-center">
                      <Circle className="h-4 w-4 text-muted-foreground/40" />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* All completed bonus */}
        {completedCount === challenges.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-center"
          >
            <div className="text-2xl mb-2">🎉</div>
            <p className="font-semibold text-sm">
              {locale === 'en' ? 'All challenges complete!' : 'सबै चुनौतीहरू पूरा!'}
            </p>
            <div className="flex items-center justify-center gap-1 text-purple-600 dark:text-purple-400 mt-1">
              <Star className="h-4 w-4" />
              <span className="text-sm font-bold">
                +{formatNumber(totalXP)} XP {locale === 'en' ? 'earned today' : 'आज कमाइयो'}
              </span>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

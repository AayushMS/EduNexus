'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useLocaleStore } from '@/store/localeStore';
import { Trophy, Star, Target, TrendingUp } from 'lucide-react';

interface ParentStatsProps {
  engagementScore: number;
  engagementLevel: 'bronze' | 'silver' | 'gold' | 'platinum';
  xp: number;
  activitiesThisWeek: number;
  badgeCount: number;
}

const levelColors = {
  bronze: 'from-amber-600 to-amber-800',
  silver: 'from-gray-400 to-gray-600',
  gold: 'from-yellow-400 to-yellow-600',
  platinum: 'from-cyan-400 to-blue-600',
};

const levelNames = {
  bronze: { en: 'Bronze', ne: 'कांस्य' },
  silver: { en: 'Silver', ne: 'चाँदी' },
  gold: { en: 'Gold', ne: 'सुन' },
  platinum: { en: 'Platinum', ne: 'प्लेटिनम' },
};

export function ParentStats({
  engagementScore,
  engagementLevel,
  xp,
  activitiesThisWeek,
  badgeCount,
}: ParentStatsProps) {
  const { locale } = useLocaleStore();

  const stats = [
    {
      icon: <Star className="h-4 w-4" />,
      label: { en: 'XP Earned', ne: 'XP कमाइएको' },
      value: xp,
      color: 'text-purple-500',
    },
    {
      icon: <Target className="h-4 w-4" />,
      label: { en: 'Activities', ne: 'गतिविधिहरू' },
      value: activitiesThisWeek,
      suffix: { en: 'this week', ne: 'यो हप्ता' },
      color: 'text-blue-500',
    },
    {
      icon: <Trophy className="h-4 w-4" />,
      label: { en: 'Badges', ne: 'ब्याजहरू' },
      value: badgeCount,
      color: 'text-amber-500',
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            {locale === 'en' ? 'Parent Engagement' : 'अभिभावक संलग्नता'}
          </CardTitle>
          <motion.div
            className={`px-3 py-1 rounded-full bg-gradient-to-r ${levelColors[engagementLevel]} text-white text-sm font-medium`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            {levelNames[engagementLevel][locale]}
          </motion.div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Engagement Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              {locale === 'en' ? 'Engagement Score' : 'संलग्नता स्कोर'}
            </span>
            <span className="text-sm font-semibold">{engagementScore}/100</span>
          </div>
          <Progress value={engagementScore} className="h-2" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label.en}
              className="text-center p-2 rounded-lg bg-secondary/50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`flex justify-center mb-1 ${stat.color}`}>
                {stat.icon}
              </div>
              <p className="text-lg font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">
                {stat.label[locale]}
              </p>
              {stat.suffix && (
                <p className="text-[10px] text-muted-foreground">
                  {stat.suffix[locale]}
                </p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Encouragement Message */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <TrendingUp className="h-5 w-5 text-primary" />
          <p className="text-sm">
            {locale === 'en'
              ? "Great job staying engaged! You're in the top 20% of parents."
              : 'संलग्न रहनुभएकोमा राम्रो! तपाईं शीर्ष २०% अभिभावकहरूमा हुनुहुन्छ।'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

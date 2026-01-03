'use client';

import { useState, useMemo } from 'react';
import { useLocaleStore } from '@/store/localeStore';
import { useMockData } from '@/hooks/useMockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BadgeIcon } from '@/components/shared';
import { ArrowLeft, Trophy, Star, Share2, Lock } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Mock achievement data
const mockAchievements = {
  summary: {
    totalBadges: 12,
    rank: 15,
    totalStudents: 150,
    xpEarned: 2450,
  },
  badges: [
    { id: '1', name: 'Math Whiz', nameNe: 'गणित विजार्ड', rarity: 'epic', unlocked: true, description: 'Score 95%+ in 3 math tests', icon: '🧮' },
    { id: '2', name: 'Perfect Attendance', nameNe: 'पूर्ण उपस्थिति', rarity: 'rare', unlocked: true, description: 'No absences for a month', icon: '✅' },
    { id: '3', name: 'Science Star', nameNe: 'विज्ञान तारा', rarity: 'rare', unlocked: true, description: 'Top 10 in science competition', icon: '🔬' },
    { id: '4', name: 'Bookworm', nameNe: 'पुस्तक प्रेमी', rarity: 'common', unlocked: true, description: 'Read 10 library books', icon: '📚' },
    { id: '5', name: 'Helper', nameNe: 'सहायक', rarity: 'common', unlocked: true, description: 'Help classmates 5 times', icon: '🤝' },
    { id: '6', name: 'Sports Champion', nameNe: 'खेल च्याम्पियन', rarity: 'epic', unlocked: true, description: 'Win inter-house sports', icon: '🏆' },
    { id: '7', name: 'Art Master', nameNe: 'कला मास्टर', rarity: 'rare', unlocked: true, description: 'Win art competition', icon: '🎨' },
    { id: '8', name: 'Early Bird', nameNe: 'चरा कुखुरा', rarity: 'common', unlocked: true, description: 'Arrive early 20 days', icon: '🌅' },
    { id: '9', name: 'Quiz King', nameNe: 'क्विज राजा', rarity: 'rare', unlocked: true, description: 'Win school quiz', icon: '🎯' },
    { id: '10', name: 'Team Player', nameNe: 'टिम प्लेयर', rarity: 'common', unlocked: true, description: 'Complete 5 group projects', icon: '👥' },
    { id: '11', name: 'Focus Master', nameNe: 'फोकस मास्टर', rarity: 'common', unlocked: true, description: 'Complete 10 focus sessions', icon: '🎯' },
    { id: '12', name: 'Homework Hero', nameNe: 'गृहकार्य हीरो', rarity: 'common', unlocked: true, description: 'Submit all homework on time', icon: '📝' },
    // Locked badges
    { id: '13', name: 'Legend', nameNe: 'लिजेन्ड', rarity: 'legendary', unlocked: false, description: 'Reach Level 50', icon: '👑', requirement: 'Level 50 required' },
    { id: '14', name: 'Genius', nameNe: 'प्रतिभा', rarity: 'legendary', unlocked: false, description: 'Score 100% in all subjects', icon: '🧠', requirement: 'Perfect scores needed' },
    { id: '15', name: 'Super Star', nameNe: 'सुपर तारा', rarity: 'epic', unlocked: false, description: 'Earn 5000 XP', icon: '⭐', requirement: '5000 XP needed' },
  ],
  recentAchievements: [
    { name: 'Homework Hero', nameNe: 'गृहकार्य हीरो', date: '2026-01-02', xp: 100 },
    { name: 'Focus Master', nameNe: 'फोकस मास्टर', date: '2025-12-28', xp: 150 },
    { name: 'Team Player', nameNe: 'टिम प्लेयर', date: '2025-12-20', xp: 100 },
  ],
};

function getRarityStyle(rarity: string, unlocked: boolean) {
  if (!unlocked) return 'opacity-50 grayscale';

  switch (rarity) {
    case 'legendary':
      return 'ring-2 ring-yellow-400 shadow-lg shadow-yellow-400/30 animate-pulse-glow';
    case 'epic':
      return 'ring-2 ring-purple-400 shadow-lg shadow-purple-400/20';
    case 'rare':
      return 'ring-2 ring-blue-400';
    default:
      return 'ring-1 ring-gray-300';
  }
}

function getRarityBadgeColor(rarity: string) {
  switch (rarity) {
    case 'legendary':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'epic':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
    case 'rare':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
  }
}

export default function AchievementsPage() {
  const { locale } = useLocaleStore();
  const { students, parents } = useMockData();

  // Get children for selector
  const children = useMemo(() => {
    const parent = parents[0];
    if (!parent) return [];
    return parent.childrenIds
      .map((id) => students.find((s) => s.id === id))
      .filter(Boolean);
  }, [parents, students]);

  const [selectedChildId, setSelectedChildId] = useState(children[0]?.id || '');

  const handleShare = (badgeName: string) => {
    toast.success(
      locale === 'en'
        ? `Sharing "${badgeName}" achievement!`
        : `"${badgeName}" उपलब्धि साझा गर्दै!`
    );
  };

  const unlockedBadges = mockAchievements.badges.filter((b) => b.unlocked);
  const lockedBadges = mockAchievements.badges.filter((b) => !b.unlocked);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/parent">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {locale === 'en' ? 'Achievements' : 'उपलब्धिहरू'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {locale === 'en'
                ? 'Badges, ranks, and accomplishments'
                : 'ब्याज, र्याङ्क, र उपलब्धिहरू'}
            </p>
          </div>
        </div>

        {/* Child Selector */}
        {children.length > 1 && (
          <Select value={selectedChildId} onValueChange={setSelectedChildId}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {children.map((child) => (
                <SelectItem key={child?.id} value={child?.id || ''}>
                  {locale === 'en' ? child?.name : child?.nameNe}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
          <CardContent className="pt-4 text-center">
            <Trophy className="h-8 w-8 mx-auto text-yellow-500 mb-2" />
            <p className="text-2xl font-bold">{mockAchievements.summary.totalBadges}</p>
            <p className="text-xs text-muted-foreground">
              {locale === 'en' ? 'Total Badges' : 'कुल ब्याजहरू'}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="pt-4 text-center">
            <Star className="h-8 w-8 mx-auto text-blue-500 mb-2" />
            <p className="text-2xl font-bold">#{mockAchievements.summary.rank}</p>
            <p className="text-xs text-muted-foreground">
              {locale === 'en'
                ? `of ${mockAchievements.summary.totalStudents}`
                : `${mockAchievements.summary.totalStudents} मध्ये`}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 col-span-2">
          <CardContent className="pt-4 text-center">
            <div className="text-3xl mb-2">⚡</div>
            <p className="text-2xl font-bold">{mockAchievements.summary.xpEarned.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">
              {locale === 'en' ? 'Total XP Earned' : 'कुल XP कमाइएको'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Badge Collection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            {locale === 'en' ? 'Badge Collection' : 'ब्याज संग्रह'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {unlockedBadges.map((badge) => (
              <div
                key={badge.id}
                className={cn(
                  'relative p-3 rounded-lg bg-card text-center cursor-pointer transition-transform hover:scale-105',
                  getRarityStyle(badge.rarity, badge.unlocked)
                )}
                onClick={() => handleShare(badge.name)}
              >
                <div className="text-3xl mb-1">{badge.icon}</div>
                <p className="text-xs font-medium truncate">
                  {locale === 'en' ? badge.name : badge.nameNe}
                </p>
                <Badge className={cn('text-[10px] mt-1', getRarityBadgeColor(badge.rarity))}>
                  {badge.rarity}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -top-1 -right-1 h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare(badge.name);
                  }}
                >
                  <Share2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Locked Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lock className="h-5 w-5" />
            {locale === 'en' ? 'Locked Badges' : 'लक गरिएका ब्याजहरू'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {lockedBadges.map((badge) => (
              <div
                key={badge.id}
                className={cn(
                  'relative p-3 rounded-lg bg-muted/50 text-center',
                  getRarityStyle(badge.rarity, badge.unlocked)
                )}
              >
                <div className="text-3xl mb-1 grayscale opacity-50">{badge.icon}</div>
                <p className="text-xs font-medium truncate text-muted-foreground">
                  {locale === 'en' ? badge.name : badge.nameNe}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">{badge.requirement}</p>
                <Lock className="absolute top-1 right-1 h-3 w-3 text-muted-foreground" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {locale === 'en' ? 'Recent Achievements' : 'हालका उपलब्धिहरू'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockAchievements.recentAchievements.map((achievement, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {locale === 'en' ? achievement.name : achievement.nameNe}
                    </p>
                    <p className="text-xs text-muted-foreground">{achievement.date}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-primary">
                  +{achievement.xp} XP
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

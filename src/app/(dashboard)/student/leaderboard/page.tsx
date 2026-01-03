'use client';

import { useState } from 'react';
import { useLocaleStore } from '@/store/localeStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Trophy, Medal, TrendingUp, TrendingDown, Minus, Crown, Star } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type PeriodType = 'week' | 'month' | 'all';
type CategoryType = 'xp' | 'homework' | 'attendance' | 'improved';

interface LeaderboardEntry {
  rank: number;
  name: string;
  nameNe: string;
  initials: string;
  score: number;
  change: 'up' | 'down' | 'same';
  changeAmount?: number;
  isCurrentUser?: boolean;
}

// Mock leaderboard data
const mockLeaderboards: Record<CategoryType, LeaderboardEntry[]> = {
  xp: [
    { rank: 1, name: 'Aarav Sharma', nameNe: 'आरव शर्मा', initials: 'AS', score: 4850, change: 'same' },
    { rank: 2, name: 'Priya Thapa', nameNe: 'प्रिया थापा', initials: 'PT', score: 4720, change: 'up', changeAmount: 2 },
    { rank: 3, name: 'Rohan Gurung', nameNe: 'रोहन गुरुङ', initials: 'RG', score: 4650, change: 'down', changeAmount: 1 },
    { rank: 4, name: 'Sita Poudel', nameNe: 'सीता पौडेल', initials: 'SP', score: 4500, change: 'up', changeAmount: 3 },
    { rank: 5, name: 'You', nameNe: 'तपाईं', initials: 'YO', score: 4350, change: 'up', changeAmount: 2, isCurrentUser: true },
    { rank: 6, name: 'Bikash Rai', nameNe: 'बिकाश राई', initials: 'BR', score: 4200, change: 'down', changeAmount: 2 },
    { rank: 7, name: 'Maya Tamang', nameNe: 'माया तामाङ', initials: 'MT', score: 4100, change: 'same' },
    { rank: 8, name: 'Dev Magar', nameNe: 'देव मगर', initials: 'DM', score: 3950, change: 'up', changeAmount: 1 },
    { rank: 9, name: 'Nisha Limbu', nameNe: 'निशा लिम्बु', initials: 'NL', score: 3800, change: 'down', changeAmount: 3 },
    { rank: 10, name: 'Sunil KC', nameNe: 'सुनिल केसी', initials: 'SK', score: 3700, change: 'same' },
  ],
  homework: [
    { rank: 1, name: 'Priya Thapa', nameNe: 'प्रिया थापा', initials: 'PT', score: 98, change: 'same' },
    { rank: 2, name: 'You', nameNe: 'तपाईं', initials: 'YO', score: 95, change: 'up', changeAmount: 1, isCurrentUser: true },
    { rank: 3, name: 'Aarav Sharma', nameNe: 'आरव शर्मा', initials: 'AS', score: 94, change: 'down', changeAmount: 1 },
    { rank: 4, name: 'Maya Tamang', nameNe: 'माया तामाङ', initials: 'MT', score: 92, change: 'up', changeAmount: 2 },
    { rank: 5, name: 'Sita Poudel', nameNe: 'सीता पौडेल', initials: 'SP', score: 90, change: 'same' },
  ],
  attendance: [
    { rank: 1, name: 'Sita Poudel', nameNe: 'सीता पौडेल', initials: 'SP', score: 100, change: 'same' },
    { rank: 2, name: 'Rohan Gurung', nameNe: 'रोहन गुरुङ', initials: 'RG', score: 99, change: 'same' },
    { rank: 3, name: 'You', nameNe: 'तपाईं', initials: 'YO', score: 98, change: 'up', changeAmount: 2, isCurrentUser: true },
    { rank: 4, name: 'Priya Thapa', nameNe: 'प्रिया थापा', initials: 'PT', score: 97, change: 'down', changeAmount: 1 },
    { rank: 5, name: 'Dev Magar', nameNe: 'देव मगर', initials: 'DM', score: 96, change: 'same' },
  ],
  improved: [
    { rank: 1, name: 'You', nameNe: 'तपाईं', initials: 'YO', score: 450, change: 'up', changeAmount: 5, isCurrentUser: true },
    { rank: 2, name: 'Bikash Rai', nameNe: 'बिकाश राई', initials: 'BR', score: 380, change: 'up', changeAmount: 3 },
    { rank: 3, name: 'Nisha Limbu', nameNe: 'निशा लिम्बु', initials: 'NL', score: 320, change: 'up', changeAmount: 2 },
    { rank: 4, name: 'Sunil KC', nameNe: 'सुनिल केसी', initials: 'SK', score: 280, change: 'same' },
    { rank: 5, name: 'Maya Tamang', nameNe: 'माया तामाङ', initials: 'MT', score: 250, change: 'up', changeAmount: 1 },
  ],
};

function getRankStyle(rank: number) {
  switch (rank) {
    case 1:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-300';
    case 2:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-300';
    case 3:
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-300';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return <Crown className="h-5 w-5 text-yellow-500" />;
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" />;
    case 3:
      return <Medal className="h-5 w-5 text-orange-500" />;
    default:
      return null;
  }
}

export default function LeaderboardPage() {
  const { locale } = useLocaleStore();
  const [period, setPeriod] = useState<PeriodType>('week');
  const [category, setCategory] = useState<CategoryType>('xp');

  const leaderboard = mockLeaderboards[category];
  const currentUserEntry = leaderboard.find((e) => e.isCurrentUser);
  const top3 = leaderboard.slice(0, 3);

  const categoryLabels: Record<CategoryType, { en: string; ne: string; unit: string }> = {
    xp: { en: 'XP Leaders', ne: 'XP लिडरहरू', unit: 'XP' },
    homework: { en: 'Homework Heroes', ne: 'गृहकार्य हीरो', unit: '%' },
    attendance: { en: 'Attendance Stars', ne: 'उपस्थिति तारा', unit: '%' },
    improved: { en: 'Most Improved', ne: 'सबैभन्दा सुधारिएको', unit: 'XP' },
  };

  const periodLabels: Record<PeriodType, { en: string; ne: string }> = {
    week: { en: 'This Week', ne: 'यो हप्ता' },
    month: { en: 'This Month', ne: 'यो महिना' },
    all: { en: 'All Time', ne: 'सबै समय' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/student">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {locale === 'en' ? 'Leaderboard' : 'लिडरबोर्ड'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {locale === 'en'
              ? 'See how you rank among your peers'
              : 'तपाईं आफ्ना साथीहरूमा कहाँ हुनुहुन्छ हेर्नुहोस्'}
          </p>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2">
        {(Object.keys(periodLabels) as PeriodType[]).map((p) => (
          <Button
            key={p}
            variant={period === p ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriod(p)}
          >
            {locale === 'en' ? periodLabels[p].en : periodLabels[p].ne}
          </Button>
        ))}
      </div>

      {/* Category Tabs */}
      <Tabs value={category} onValueChange={(v) => setCategory(v as CategoryType)}>
        <TabsList className="w-full flex-wrap h-auto">
          {(Object.keys(categoryLabels) as CategoryType[]).map((cat) => (
            <TabsTrigger key={cat} value={cat} className="flex-1 text-xs sm:text-sm">
              {locale === 'en' ? categoryLabels[cat].en : categoryLabels[cat].ne}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Top 3 Podium */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="pt-6">
          <div className="flex items-end justify-center gap-4">
            {/* 2nd Place */}
            {top3[1] && (
              <div className="text-center">
                <Avatar className="h-16 w-16 mx-auto border-4 border-gray-300">
                  <AvatarFallback className="text-lg bg-gray-100">
                    {top3[1].initials}
                  </AvatarFallback>
                </Avatar>
                <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-t-lg px-4 py-6 min-w-[80px]">
                  <Medal className="h-6 w-6 mx-auto text-gray-400" />
                  <p className="font-bold text-lg">2</p>
                </div>
                <p className="text-sm font-medium mt-2 truncate max-w-[80px]">
                  {locale === 'en' ? top3[1].name.split(' ')[0] : top3[1].nameNe.split(' ')[0]}
                </p>
                <p className="text-xs text-muted-foreground">
                  {top3[1].score} {categoryLabels[category].unit}
                </p>
              </div>
            )}

            {/* 1st Place */}
            {top3[0] && (
              <div className="text-center -mt-4">
                <Avatar className="h-20 w-20 mx-auto border-4 border-yellow-400 ring-4 ring-yellow-200">
                  <AvatarFallback className="text-xl bg-yellow-100">
                    {top3[0].initials}
                  </AvatarFallback>
                </Avatar>
                <div className="mt-2 bg-yellow-200 dark:bg-yellow-700 rounded-t-lg px-6 py-8 min-w-[100px]">
                  <Crown className="h-8 w-8 mx-auto text-yellow-500" />
                  <p className="font-bold text-2xl">1</p>
                </div>
                <p className="text-sm font-medium mt-2 truncate max-w-[100px]">
                  {locale === 'en' ? top3[0].name.split(' ')[0] : top3[0].nameNe.split(' ')[0]}
                </p>
                <p className="text-xs text-muted-foreground">
                  {top3[0].score} {categoryLabels[category].unit}
                </p>
              </div>
            )}

            {/* 3rd Place */}
            {top3[2] && (
              <div className="text-center">
                <Avatar className="h-16 w-16 mx-auto border-4 border-orange-300">
                  <AvatarFallback className="text-lg bg-orange-100">
                    {top3[2].initials}
                  </AvatarFallback>
                </Avatar>
                <div className="mt-2 bg-orange-200 dark:bg-orange-700 rounded-t-lg px-4 py-4 min-w-[80px]">
                  <Medal className="h-6 w-6 mx-auto text-orange-500" />
                  <p className="font-bold text-lg">3</p>
                </div>
                <p className="text-sm font-medium mt-2 truncate max-w-[80px]">
                  {locale === 'en' ? top3[2].name.split(' ')[0] : top3[2].nameNe.split(' ')[0]}
                </p>
                <p className="text-xs text-muted-foreground">
                  {top3[2].score} {categoryLabels[category].unit}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Full Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {locale === 'en' ? 'Full Rankings' : 'पूर्ण र्याङ्किङ'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {leaderboard.map((entry) => (
              <div
                key={entry.rank}
                className={cn(
                  'flex items-center gap-4 p-4 transition-colors',
                  entry.isCurrentUser && 'bg-primary/5'
                )}
              >
                {/* Rank */}
                <div
                  className={cn(
                    'h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold border',
                    getRankStyle(entry.rank)
                  )}
                >
                  {entry.rank <= 3 ? getRankIcon(entry.rank) : entry.rank}
                </div>

                {/* Avatar & Name */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={cn(entry.isCurrentUser && 'bg-primary text-primary-foreground')}>
                      {entry.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className={cn('font-medium truncate', entry.isCurrentUser && 'text-primary')}>
                      {locale === 'en' ? entry.name : entry.nameNe}
                      {entry.isCurrentUser && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          {locale === 'en' ? 'You' : 'तपाईं'}
                        </Badge>
                      )}
                    </p>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right">
                  <p className="font-bold">
                    {entry.score.toLocaleString()} {categoryLabels[category].unit}
                  </p>
                </div>

                {/* Change Indicator */}
                <div className="w-12 flex justify-end">
                  {entry.change === 'up' && (
                    <div className="flex items-center text-green-500">
                      <TrendingUp className="h-4 w-4" />
                      {entry.changeAmount && <span className="text-xs ml-1">{entry.changeAmount}</span>}
                    </div>
                  )}
                  {entry.change === 'down' && (
                    <div className="flex items-center text-red-500">
                      <TrendingDown className="h-4 w-4" />
                      {entry.changeAmount && <span className="text-xs ml-1">{entry.changeAmount}</span>}
                    </div>
                  )}
                  {entry.change === 'same' && (
                    <Minus className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Your Rank Card (Sticky on mobile) */}
      {currentUserEntry && (
        <div className="fixed bottom-20 left-4 right-4 md:static md:bottom-auto">
          <Card className="bg-primary text-primary-foreground shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary-foreground/20 flex items-center justify-center font-bold">
                    #{currentUserEntry.rank}
                  </div>
                  <div>
                    <p className="font-medium">
                      {locale === 'en' ? 'Your Rank' : 'तपाईंको र्याङ्क'}
                    </p>
                    <p className="text-sm opacity-80">
                      {currentUserEntry.score.toLocaleString()} {categoryLabels[category].unit}
                    </p>
                  </div>
                </div>
                {currentUserEntry.change === 'up' && (
                  <Badge className="bg-green-500">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{currentUserEntry.changeAmount}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

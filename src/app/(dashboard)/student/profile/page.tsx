'use client';

import { useState } from 'react';
import { useLocaleStore } from '@/store/localeStore';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ArrowLeft,
  Star,
  Trophy,
  Flame,
  Target,
  BookOpen,
  Calendar,
  Award,
  Sparkles,
  Edit,
  Camera,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface BadgeItem {
  id: string;
  name: string;
  nameNe: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earned: boolean;
  earnedDate?: string;
}

interface AvatarPart {
  id: string;
  category: string;
  name: string;
  icon: string;
  unlocked: boolean;
  cost?: number;
}

const mockBadges: BadgeItem[] = [
  { id: '1', name: 'First Steps', nameNe: 'पहिलो कदम', icon: '🎯', rarity: 'common', earned: true, earnedDate: '2025-09-15' },
  { id: '2', name: 'Homework Hero', nameNe: 'गृहकार्य हीरो', icon: '📚', rarity: 'rare', earned: true, earnedDate: '2025-10-20' },
  { id: '3', name: 'Math Master', nameNe: 'गणित मास्टर', icon: '🧮', rarity: 'epic', earned: true, earnedDate: '2025-11-05' },
  { id: '4', name: 'Perfect Attendance', nameNe: 'पूर्ण उपस्थिति', icon: '✅', rarity: 'rare', earned: true, earnedDate: '2025-12-01' },
  { id: '5', name: 'Study Champion', nameNe: 'अध्ययन च्याम्पियन', icon: '🏆', rarity: 'legendary', earned: false },
  { id: '6', name: 'Team Player', nameNe: 'टीम प्लेयर', icon: '🤝', rarity: 'common', earned: true, earnedDate: '2025-11-15' },
  { id: '7', name: 'Science Star', nameNe: 'विज्ञान तारा', icon: '🔬', rarity: 'epic', earned: false },
  { id: '8', name: 'Reading Wizard', nameNe: 'पढाइ जादुगर', icon: '📖', rarity: 'rare', earned: false },
];

const avatarParts: AvatarPart[] = [
  { id: '1', category: 'hair', name: 'Classic', icon: '💇', unlocked: true },
  { id: '2', category: 'hair', name: 'Spiky', icon: '💇‍♂️', unlocked: true },
  { id: '3', category: 'hair', name: 'Long', icon: '💁', unlocked: false, cost: 100 },
  { id: '4', category: 'outfit', name: 'School Uniform', icon: '👔', unlocked: true },
  { id: '5', category: 'outfit', name: 'Casual', icon: '👕', unlocked: true },
  { id: '6', category: 'outfit', name: 'Sports', icon: '🏃', unlocked: false, cost: 150 },
  { id: '7', category: 'accessory', name: 'Glasses', icon: '👓', unlocked: true },
  { id: '8', category: 'accessory', name: 'Cap', icon: '🧢', unlocked: false, cost: 75 },
];

function getRarityColor(rarity: string) {
  switch (rarity) {
    case 'common':
      return 'border-gray-400 bg-gray-50 dark:bg-gray-900/30';
    case 'rare':
      return 'border-blue-500 bg-blue-50 dark:bg-blue-900/30';
    case 'epic':
      return 'border-purple-500 bg-purple-50 dark:bg-purple-900/30';
    case 'legendary':
      return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30 shadow-lg shadow-yellow-500/20';
    default:
      return '';
  }
}

export default function ProfilePage() {
  const { locale } = useLocaleStore();
  const [activeTab, setActiveTab] = useState('badges');
  const [avatarCategory, setAvatarCategory] = useState('hair');

  // Mock student data
  const student = {
    name: 'Aarav Sharma',
    nameNe: 'आरव शर्मा',
    grade: '7',
    section: 'A',
    xp: 2750,
    level: 12,
    nextLevelXp: 3000,
    streak: 15,
    totalBadges: 5,
    rank: 3,
  };

  const xpProgress = ((student.xp % 250) / 250) * 100;

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
            {locale === 'en' ? 'My Profile' : 'मेरो प्रोफाइल'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {locale === 'en' ? 'Customize your avatar and view achievements' : 'आफ्नो अवतार अनुकूलन गर्नुहोस्'}
          </p>
        </div>
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-primary">
                <AvatarFallback className="text-2xl bg-gradient-to-br from-primary/20 to-primary/40">
                  {student.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="secondary"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
              >
                <Camera className="h-4 w-4" />
              </Button>
              <div className="absolute -top-2 -left-2 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                {student.level}
              </div>
            </div>

            {/* Name & Info */}
            <h2 className="mt-4 text-xl font-bold">
              {locale === 'en' ? student.name : student.nameNe}
            </h2>
            <p className="text-sm text-muted-foreground">
              {locale === 'en' ? 'Grade' : 'कक्षा'} {student.grade}
              {student.section}
            </p>

            {/* XP Progress */}
            <div className="w-full mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{locale === 'en' ? 'Level' : 'लेभल'} {student.level}</span>
                <span className="text-muted-foreground">{student.xp} / {student.nextLevelXp} XP</span>
              </div>
              <Progress value={xpProgress} className="h-3" />
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 mt-6 w-full">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <Flame className="h-5 w-5 mx-auto text-orange-500 mb-1" />
                <p className="text-lg font-bold">{student.streak}</p>
                <p className="text-xs text-muted-foreground">
                  {locale === 'en' ? 'Day Streak' : 'दिन स्ट्रिक'}
                </p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <Award className="h-5 w-5 mx-auto text-purple-500 mb-1" />
                <p className="text-lg font-bold">{student.totalBadges}</p>
                <p className="text-xs text-muted-foreground">
                  {locale === 'en' ? 'Badges' : 'ब्याजहरू'}
                </p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <Trophy className="h-5 w-5 mx-auto text-yellow-500 mb-1" />
                <p className="text-lg font-bold">#{student.rank}</p>
                <p className="text-xs text-muted-foreground">
                  {locale === 'en' ? 'Rank' : 'रैंक'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="badges" className="flex-1">
            <Award className="h-4 w-4 mr-2" />
            {locale === 'en' ? 'Badges' : 'ब्याजहरू'}
          </TabsTrigger>
          <TabsTrigger value="avatar" className="flex-1">
            <Sparkles className="h-4 w-4 mr-2" />
            {locale === 'en' ? 'Avatar' : 'अवतार'}
          </TabsTrigger>
        </TabsList>

        {/* Badges Tab */}
        <TabsContent value="badges" className="mt-4">
          <div className="grid grid-cols-2 gap-3">
            {mockBadges.map((badge) => (
              <Card
                key={badge.id}
                className={cn(
                  'transition-all',
                  badge.earned ? getRarityColor(badge.rarity) : 'opacity-50 grayscale'
                )}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">{badge.icon}</div>
                  <p className="font-medium text-sm">
                    {locale === 'en' ? badge.name : badge.nameNe}
                  </p>
                  <Badge
                    variant="outline"
                    className={cn(
                      'mt-2 text-xs capitalize',
                      badge.rarity === 'legendary' && 'border-yellow-500 text-yellow-600',
                      badge.rarity === 'epic' && 'border-purple-500 text-purple-600',
                      badge.rarity === 'rare' && 'border-blue-500 text-blue-600'
                    )}
                  >
                    {badge.rarity}
                  </Badge>
                  {badge.earned && badge.earnedDate && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(badge.earnedDate).toLocaleDateString()}
                    </p>
                  )}
                  {!badge.earned && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {locale === 'en' ? 'Locked' : 'लक गरिएको'}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Avatar Tab */}
        <TabsContent value="avatar" className="mt-4 space-y-4">
          {/* Avatar Preview */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-center">
                <div className="relative">
                  <Avatar className="h-32 w-32 border-4 border-primary">
                    <AvatarFallback className="text-4xl bg-gradient-to-br from-primary/20 to-primary/40">
                      {student.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button size="sm" className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                    <Edit className="h-3 w-3 mr-1" />
                    {locale === 'en' ? 'Edit' : 'सम्पादन'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Selector */}
          <div className="flex gap-2 justify-center">
            {['hair', 'outfit', 'accessory'].map((cat) => (
              <Button
                key={cat}
                variant={avatarCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAvatarCategory(cat)}
                className="capitalize"
              >
                {locale === 'en'
                  ? cat
                  : cat === 'hair'
                  ? 'कपाल'
                  : cat === 'outfit'
                  ? 'पोशाक'
                  : 'सहायक'}
              </Button>
            ))}
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-4 gap-3">
            {avatarParts
              .filter((part) => part.category === avatarCategory)
              .map((part) => (
                <Card
                  key={part.id}
                  className={cn(
                    'cursor-pointer transition-all hover:border-primary',
                    !part.unlocked && 'opacity-60'
                  )}
                >
                  <CardContent className="p-3 text-center">
                    <div className="text-2xl mb-1">{part.icon}</div>
                    <p className="text-xs truncate">{part.name}</p>
                    {!part.unlocked && part.cost && (
                      <Badge variant="secondary" className="text-xs mt-1">
                        {part.cost} XP
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* XP Balance */}
          <Card>
            <CardContent className="py-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {locale === 'en' ? 'Available XP' : 'उपलब्ध XP'}
                </span>
                <Badge variant="outline" className="text-primary">
                  <Star className="h-3 w-3 mr-1" />
                  {student.xp} XP
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

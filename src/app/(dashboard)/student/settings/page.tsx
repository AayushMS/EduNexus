'use client';

import { useState } from 'react';
import { useLocaleStore } from '@/store/localeStore';
import { useThemeStore } from '@/store/themeStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LanguageToggle, ThemeToggle } from '@/components/shared';
import {
  ArrowLeft,
  User,
  Bell,
  Palette,
  Globe,
  HelpCircle,
  Shield,
  Info,
  ChevronRight,
  Volume2,
  Gamepad2,
  Moon,
  Sun,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function StudentSettingsPage() {
  const { locale } = useLocaleStore();

  // Notification preferences
  const [notificationPrefs, setNotificationPrefs] = useState({
    pushNotifications: true,
    homeworkReminders: true,
    squadMessages: true,
    achievementAlerts: true,
    streakReminders: true,
  });

  // Game preferences
  const [gamePrefs, setGamePrefs] = useState({
    soundEffects: true,
    animations: true,
    showXPGains: true,
    showLeaderboardRank: true,
  });

  const handleNotificationChange = (key: keyof typeof notificationPrefs) => {
    setNotificationPrefs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    toast.success(
      locale === 'en' ? 'Preference updated' : 'प्राथमिकता अपडेट गरियो'
    );
  };

  const handleGamePrefChange = (key: keyof typeof gamePrefs) => {
    setGamePrefs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    toast.success(
      locale === 'en' ? 'Preference updated' : 'प्राथमिकता अपडेट गरियो'
    );
  };

  const handleLinkClick = (feature: string) => {
    toast.info(
      locale === 'en'
        ? `${feature} - Coming soon!`
        : `${feature} - छिट्टै आउँदैछ!`
    );
  };

  // Mock student data
  const student = {
    name: 'Aarav Sharma',
    nameNe: 'आरव शर्मा',
    email: 'aarav.sharma@school.edu.np',
    grade: '7',
    section: 'A',
    rollNo: '15',
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
            {locale === 'en' ? 'Settings' : 'सेटिङहरू'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {locale === 'en'
              ? 'Manage your preferences'
              : 'आफ्नो प्राथमिकताहरू व्यवस्थापन गर्नुहोस्'}
          </p>
        </div>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" />
            {locale === 'en' ? 'Profile' : 'प्रोफाइल'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg bg-primary/10 text-primary">
                {student.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">
                {locale === 'en' ? student.name : student.nameNe}
              </p>
              <p className="text-sm text-muted-foreground">{student.email}</p>
              <p className="text-sm text-muted-foreground">
                {locale === 'en' ? 'Grade' : 'कक्षा'} {student.grade}
                {student.section} • {locale === 'en' ? 'Roll No.' : 'रोल नं.'}{' '}
                {student.rollNo}
              </p>
            </div>
          </div>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/student/profile">
              {locale === 'en' ? 'Edit Profile & Avatar' : 'प्रोफाइल र अवतार सम्पादन'}
              <ChevronRight className="h-4 w-4 ml-auto" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Appearance Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Palette className="h-5 w-5" />
            {locale === 'en' ? 'Appearance' : 'उपस्थिति'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <Label>{locale === 'en' ? 'Language' : 'भाषा'}</Label>
            </div>
            <LanguageToggle />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4 text-muted-foreground" />
              <Label>{locale === 'en' ? 'Theme' : 'थिम'}</Label>
            </div>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>

      {/* Game Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Gamepad2 className="h-5 w-5" />
            {locale === 'en' ? 'Game Settings' : 'खेल सेटिङहरू'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm">
                {locale === 'en' ? 'Sound Effects' : 'ध्वनि प्रभावहरू'}
              </Label>
            </div>
            <Switch
              checked={gamePrefs.soundEffects}
              onCheckedChange={() => handleGamePrefChange('soundEffects')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">
              {locale === 'en' ? 'Animations' : 'एनिमेसनहरू'}
            </Label>
            <Switch
              checked={gamePrefs.animations}
              onCheckedChange={() => handleGamePrefChange('animations')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">
              {locale === 'en' ? 'Show XP Gains' : 'XP लाभहरू देखाउनुहोस्'}
            </Label>
            <Switch
              checked={gamePrefs.showXPGains}
              onCheckedChange={() => handleGamePrefChange('showXPGains')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">
              {locale === 'en' ? 'Show Leaderboard Rank' : 'लीडरबोर्ड रैंक देखाउनुहोस्'}
            </Label>
            <Switch
              checked={gamePrefs.showLeaderboardRank}
              onCheckedChange={() => handleGamePrefChange('showLeaderboardRank')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5" />
            {locale === 'en' ? 'Notifications' : 'सूचनाहरू'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm">
              {locale === 'en' ? 'Push Notifications' : 'पुश सूचनाहरू'}
            </Label>
            <Switch
              checked={notificationPrefs.pushNotifications}
              onCheckedChange={() => handleNotificationChange('pushNotifications')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">
              {locale === 'en' ? 'Homework Reminders' : 'गृहकार्य रिमाइन्डर'}
            </Label>
            <Switch
              checked={notificationPrefs.homeworkReminders}
              onCheckedChange={() => handleNotificationChange('homeworkReminders')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">
              {locale === 'en' ? 'Squad Messages' : 'स्क्वाड सन्देशहरू'}
            </Label>
            <Switch
              checked={notificationPrefs.squadMessages}
              onCheckedChange={() => handleNotificationChange('squadMessages')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">
              {locale === 'en' ? 'Achievement Alerts' : 'उपलब्धि अलर्टहरू'}
            </Label>
            <Switch
              checked={notificationPrefs.achievementAlerts}
              onCheckedChange={() => handleNotificationChange('achievementAlerts')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">
              {locale === 'en' ? 'Streak Reminders' : 'स्ट्रिक रिमाइन्डर'}
            </Label>
            <Switch
              checked={notificationPrefs.streakReminders}
              onCheckedChange={() => handleNotificationChange('streakReminders')}
            />
          </div>
        </CardContent>
      </Card>

      {/* About Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="h-5 w-5" />
            {locale === 'en' ? 'About' : 'बारेमा'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-between"
            onClick={() => handleLinkClick('Help Center')}
          >
            <span className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              {locale === 'en' ? 'Help Center' : 'सहायता केन्द्र'}
            </span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-between"
            onClick={() => handleLinkClick('Privacy Policy')}
          >
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              {locale === 'en' ? 'Privacy Policy' : 'गोपनीयता नीति'}
            </span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Separator className="my-2" />
          <div className="flex items-center justify-between py-2 px-4">
            <span className="text-sm text-muted-foreground">
              {locale === 'en' ? 'Version' : 'संस्करण'}
            </span>
            <span className="text-sm">1.0.0</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import { useLocaleStore } from '@/store/localeStore';
import { useThemeStore } from '@/store/themeStore';
import { useMockData } from '@/hooks/useMockData';
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
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { locale } = useLocaleStore();
  const { parents, students } = useMockData();

  // Get demo parent
  const demoParent = parents[0];
  const children = useMemo(() => {
    if (!demoParent) return [];
    return demoParent.childrenIds
      .map((id) => students.find((s) => s.id === id))
      .filter(Boolean);
  }, [demoParent, students]);

  // Notification preferences (local state for demo)
  const [notificationPrefs, setNotificationPrefs] = useState({
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    activityAlerts: true,
    feeReminders: true,
    eventReminders: true,
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

  const handleLinkClick = (feature: string) => {
    toast.info(
      locale === 'en'
        ? `${feature} - Coming soon!`
        : `${feature} - छिट्टै आउँदैछ!`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/parent">
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
                {demoParent?.name?.slice(0, 2).toUpperCase() || 'PA'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">
                {locale === 'en' ? demoParent?.name : demoParent?.nameNe}
              </p>
              <p className="text-sm text-muted-foreground">{demoParent?.email}</p>
              <p className="text-sm text-muted-foreground">{demoParent?.phone}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Children Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {locale === 'en' ? 'Children' : 'बच्चाहरू'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {children.map((child) => (
              <div
                key={child?.id}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="text-sm bg-primary/10 text-primary">
                      {child?.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">
                      {locale === 'en' ? child?.name : child?.nameNe}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {locale === 'en' ? 'Grade' : 'कक्षा'} {child?.grade}
                      {child?.section}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
              <Palette className="h-4 w-4 text-muted-foreground" />
              <Label>{locale === 'en' ? 'Theme' : 'थिम'}</Label>
            </div>
            <ThemeToggle />
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
              {locale === 'en' ? 'Email Notifications' : 'इमेल सूचनाहरू'}
            </Label>
            <Switch
              checked={notificationPrefs.emailNotifications}
              onCheckedChange={() => handleNotificationChange('emailNotifications')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">
              {locale === 'en' ? 'SMS Notifications' : 'SMS सूचनाहरू'}
            </Label>
            <Switch
              checked={notificationPrefs.smsNotifications}
              onCheckedChange={() => handleNotificationChange('smsNotifications')}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <Label className="text-sm">
              {locale === 'en' ? 'Activity Alerts' : 'गतिविधि अलर्टहरू'}
            </Label>
            <Switch
              checked={notificationPrefs.activityAlerts}
              onCheckedChange={() => handleNotificationChange('activityAlerts')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">
              {locale === 'en' ? 'Fee Reminders' : 'शुल्क रिमाइन्डरहरू'}
            </Label>
            <Switch
              checked={notificationPrefs.feeReminders}
              onCheckedChange={() => handleNotificationChange('feeReminders')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">
              {locale === 'en' ? 'Event Reminders' : 'कार्यक्रम रिमाइन्डरहरू'}
            </Label>
            <Switch
              checked={notificationPrefs.eventReminders}
              onCheckedChange={() => handleNotificationChange('eventReminders')}
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

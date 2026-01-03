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
  Baby,
  Calendar,
  Mail,
  Phone,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function PreschoolSettingsPage() {
  const { locale } = useLocaleStore();

  // Notification preferences
  const [notificationPrefs, setNotificationPrefs] = useState({
    pushNotifications: true,
    emailNotifications: true,
    parentMessages: true,
    activityReminders: true,
    reportReminders: true,
    dailySummary: true,
  });

  // Quick log preferences
  const [quickLogPrefs, setQuickLogPrefs] = useState({
    autoTagAllChildren: false,
    includeTimestamp: true,
    shareWithParents: true,
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

  const handleQuickLogChange = (key: keyof typeof quickLogPrefs) => {
    setQuickLogPrefs((prev) => ({
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

  // Mock teacher data
  const teacher = {
    name: 'Sunita Maharjan',
    nameNe: 'सुनिता महर्जन',
    email: 'sunita.maharjan@school.edu.np',
    phone: '+977 9845678901',
    role: 'Pre-school Teacher',
    roleNe: 'पूर्व-विद्यालय शिक्षिका',
    employeeId: 'PS-2024-003',
    classes: ['Butterfly', 'Sunshine'],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/preschool">
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
                {teacher.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium text-lg">
                {locale === 'en' ? teacher.name : teacher.nameNe}
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Baby className="h-3 w-3" />
                {locale === 'en' ? teacher.role : teacher.roleNe}
              </p>
              <p className="text-xs text-muted-foreground">
                ID: {teacher.employeeId}
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              {teacher.email}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              {teacher.phone}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {locale === 'en' ? 'Classes:' : 'कक्षाहरू:'} {teacher.classes.join(', ')}
            </div>
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

      {/* Quick Log Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {locale === 'en' ? 'Activity Log Settings' : 'गतिविधि लग सेटिङहरू'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">
                {locale === 'en' ? 'Auto-tag all children' : 'स्वचालित सबै बालबालिका ट्याग'}
              </Label>
              <p className="text-xs text-muted-foreground">
                {locale === 'en'
                  ? 'Automatically tag entire class in activities'
                  : 'गतिविधिहरूमा स्वचालित रूपमा सम्पूर्ण कक्षा ट्याग गर्नुहोस्'}
              </p>
            </div>
            <Switch
              checked={quickLogPrefs.autoTagAllChildren}
              onCheckedChange={() => handleQuickLogChange('autoTagAllChildren')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">
                {locale === 'en' ? 'Include timestamp' : 'टाइमस्ट्याम्प समावेश गर्नुहोस्'}
              </Label>
              <p className="text-xs text-muted-foreground">
                {locale === 'en'
                  ? 'Add time to all activity logs'
                  : 'सबै गतिविधि लगहरूमा समय थप्नुहोस्'}
              </p>
            </div>
            <Switch
              checked={quickLogPrefs.includeTimestamp}
              onCheckedChange={() => handleQuickLogChange('includeTimestamp')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">
                {locale === 'en' ? 'Auto-share with parents' : 'अभिभावकसँग स्वचालित साझा'}
              </Label>
              <p className="text-xs text-muted-foreground">
                {locale === 'en'
                  ? 'Automatically share activities with parents'
                  : 'अभिभावकहरूसँग स्वचालित रूपमा गतिविधिहरू साझा गर्नुहोस्'}
              </p>
            </div>
            <Switch
              checked={quickLogPrefs.shareWithParents}
              onCheckedChange={() => handleQuickLogChange('shareWithParents')}
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
              {locale === 'en' ? 'Email Notifications' : 'इमेल सूचनाहरू'}
            </Label>
            <Switch
              checked={notificationPrefs.emailNotifications}
              onCheckedChange={() => handleNotificationChange('emailNotifications')}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <Label className="text-sm">
              {locale === 'en' ? 'Parent Messages' : 'अभिभावक सन्देशहरू'}
            </Label>
            <Switch
              checked={notificationPrefs.parentMessages}
              onCheckedChange={() => handleNotificationChange('parentMessages')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">
              {locale === 'en' ? 'Activity Reminders' : 'गतिविधि रिमाइन्डरहरू'}
            </Label>
            <Switch
              checked={notificationPrefs.activityReminders}
              onCheckedChange={() => handleNotificationChange('activityReminders')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">
              {locale === 'en' ? 'Report Reminders' : 'रिपोर्ट रिमाइन्डरहरू'}
            </Label>
            <Switch
              checked={notificationPrefs.reportReminders}
              onCheckedChange={() => handleNotificationChange('reportReminders')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">
              {locale === 'en' ? 'Daily Summary' : 'दैनिक सारांश'}
            </Label>
            <Switch
              checked={notificationPrefs.dailySummary}
              onCheckedChange={() => handleNotificationChange('dailySummary')}
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

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
  BookOpen,
  Calendar,
  Mail,
  Phone,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function TeacherSettingsPage() {
  const { locale } = useLocaleStore();

  // Notification preferences
  const [notificationPrefs, setNotificationPrefs] = useState({
    pushNotifications: true,
    emailNotifications: true,
    leaveRequests: true,
    parentMessages: true,
    gradeReminders: true,
    attendanceReminders: true,
  });

  // Quick actions preferences
  const [quickActionPrefs, setQuickActionPrefs] = useState({
    autoNotifyParents: true,
    defaultAttendanceMarkAll: false,
    showKeyboardShortcuts: true,
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

  const handleQuickActionChange = (key: keyof typeof quickActionPrefs) => {
    setQuickActionPrefs((prev) => ({
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
    name: 'Ramesh Adhikari',
    nameNe: 'रमेश अधिकारी',
    email: 'ramesh.adhikari@school.edu.np',
    phone: '+977 9841234567',
    subject: 'Mathematics',
    subjectNe: 'गणित',
    employeeId: 'T-2024-001',
    classes: ['7A', '7B', '8A', '8B'],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/teacher">
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
                <BookOpen className="h-3 w-3" />
                {locale === 'en' ? teacher.subject : teacher.subjectNe} {locale === 'en' ? 'Teacher' : 'शिक्षक'}
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

      {/* Quick Actions Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {locale === 'en' ? 'Quick Actions' : 'द्रुत कार्यहरू'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">
                {locale === 'en' ? 'Auto-notify parents' : 'स्वचालित अभिभावक सूचना'}
              </Label>
              <p className="text-xs text-muted-foreground">
                {locale === 'en'
                  ? 'Notify parents after attendance/grades'
                  : 'उपस्थिति/ग्रेड पछि अभिभावकलाई सूचित गर्नुहोस्'}
              </p>
            </div>
            <Switch
              checked={quickActionPrefs.autoNotifyParents}
              onCheckedChange={() => handleQuickActionChange('autoNotifyParents')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">
                {locale === 'en' ? 'Default mark all present' : 'पूर्वनिर्धारित सबै उपस्थित'}
              </Label>
              <p className="text-xs text-muted-foreground">
                {locale === 'en'
                  ? 'Start attendance with all present'
                  : 'सबै उपस्थितसँग उपस्थिति सुरु गर्नुहोस्'}
              </p>
            </div>
            <Switch
              checked={quickActionPrefs.defaultAttendanceMarkAll}
              onCheckedChange={() => handleQuickActionChange('defaultAttendanceMarkAll')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">
                {locale === 'en' ? 'Show keyboard shortcuts' : 'किबोर्ड सर्टकटहरू देखाउनुहोस्'}
              </Label>
              <p className="text-xs text-muted-foreground">
                {locale === 'en'
                  ? 'Display hints for keyboard navigation'
                  : 'किबोर्ड नेभिगेसनको लागि संकेतहरू प्रदर्शन गर्नुहोस्'}
              </p>
            </div>
            <Switch
              checked={quickActionPrefs.showKeyboardShortcuts}
              onCheckedChange={() => handleQuickActionChange('showKeyboardShortcuts')}
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
              {locale === 'en' ? 'Leave Request Alerts' : 'बिदा अनुरोध अलर्टहरू'}
            </Label>
            <Switch
              checked={notificationPrefs.leaveRequests}
              onCheckedChange={() => handleNotificationChange('leaveRequests')}
            />
          </div>
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
              {locale === 'en' ? 'Grade Entry Reminders' : 'ग्रेड प्रविष्टि रिमाइन्डर'}
            </Label>
            <Switch
              checked={notificationPrefs.gradeReminders}
              onCheckedChange={() => handleNotificationChange('gradeReminders')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">
              {locale === 'en' ? 'Attendance Reminders' : 'उपस्थिति रिमाइन्डर'}
            </Label>
            <Switch
              checked={notificationPrefs.attendanceReminders}
              onCheckedChange={() => handleNotificationChange('attendanceReminders')}
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

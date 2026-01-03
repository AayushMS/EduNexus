'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocaleStore } from '@/store/localeStore';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Settings,
  RefreshCw,
  Users,
  Database,
  Palette,
  Globe,
  Trash2,
  Play,
  RotateCcw,
  Loader2,
} from 'lucide-react';

interface AdminPanelProps {
  onResetDemo?: () => void;
  onSwitchScenario?: (scenario: string) => void;
  onRegenerateData?: (dataType: string) => void;
}

export function AdminPanel({
  onResetDemo,
  onSwitchScenario,
  onRegenerateData,
}: AdminPanelProps) {
  const { locale, setLocale } = useLocaleStore();
  const { role: currentRole, setRole } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Listen for keyboard shortcut (Ctrl+Shift+D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const scenarios = [
    {
      id: 'default',
      name: { en: 'Default', ne: 'पूर्वनिर्धारित' },
      description: { en: 'Standard demo data', ne: 'मानक डेमो डाटा' },
    },
    {
      id: 'high_performer',
      name: { en: 'High Performer', ne: 'उच्च प्रदर्शनकर्ता' },
      description: { en: 'Student with top grades and badges', ne: 'शीर्ष ग्रेड र ब्याजहरू भएको विद्यार्थी' },
    },
    {
      id: 'struggling',
      name: { en: 'Struggling Student', ne: 'संघर्षरत विद्यार्थी' },
      description: { en: 'Student needing support', ne: 'सहयोग चाहिने विद्यार्थी' },
    },
    {
      id: 'new_student',
      name: { en: 'New Student', ne: 'नयाँ विद्यार्थी' },
      description: { en: 'Fresh profile, no history', ne: 'नयाँ प्रोफाइल, कुनै इतिहास छैन' },
    },
    {
      id: 'engaged_parent',
      name: { en: 'Engaged Parent', ne: 'संलग्न अभिभावक' },
      description: { en: 'Very active in child\'s education', ne: 'बच्चाको शिक्षामा धेरै सक्रिय' },
    },
  ];

  const dataTypes = [
    { id: 'activity_feed', name: { en: 'Activity Feed', ne: 'गतिविधि फिड' }, icon: '📱' },
    { id: 'attendance', name: { en: 'Attendance', ne: 'उपस्थिति' }, icon: '✓' },
    { id: 'grades', name: { en: 'Grades', ne: 'ग्रेडहरू' }, icon: '📊' },
    { id: 'badges', name: { en: 'Badges', ne: 'ब्याजहरू' }, icon: '🏆' },
    { id: 'milestones', name: { en: 'Milestones', ne: 'माइलस्टोनहरू' }, icon: '🎯' },
  ];

  const handleResetDemo = async () => {
    setIsResetting(true);
    // Clear all localStorage
    localStorage.clear();
    // Simulate regeneration
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsResetting(false);
    onResetDemo?.();
    window.location.reload();
  };

  const handleClearTours = () => {
    // Clear all tour-related localStorage items
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('tour_') || key.startsWith('welcome_') || key.startsWith('hint_')) {
        localStorage.removeItem(key);
      }
    });
    alert(locale === 'en' ? 'Tours reset! Refresh to see them again.' : 'टूरहरू रिसेट भयो! फेरि हेर्न रिफ्रेश गर्नुहोस्।');
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 z-40 h-12 w-12 rounded-full shadow-lg"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {locale === 'en' ? 'Demo Admin Panel' : 'डेमो एडमिन प्यानल'}
          </SheetTitle>
          <SheetDescription>
            {locale === 'en'
              ? 'Control demo settings and data. Press Ctrl+Shift+D to open.'
              : 'डेमो सेटिङहरू र डाटा नियन्त्रण गर्नुहोस्। Ctrl+Shift+D थिच्नुहोस्।'}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Quick Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Palette className="h-4 w-4" />
              {locale === 'en' ? 'Quick Settings' : 'द्रुत सेटिङहरू'}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{locale === 'en' ? 'Theme' : 'थिम'}</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      {locale === 'en' ? 'Light' : 'उज्यालो'}
                    </SelectItem>
                    <SelectItem value="dark">
                      {locale === 'en' ? 'Dark' : 'अँध्यारो'}
                    </SelectItem>
                    <SelectItem value="system">
                      {locale === 'en' ? 'System' : 'प्रणाली'}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{locale === 'en' ? 'Language' : 'भाषा'}</Label>
                <Select value={locale} onValueChange={(v) => setLocale(v as 'en' | 'ne')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ne">नेपाली</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Role Switcher */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Users className="h-4 w-4" />
              {locale === 'en' ? 'Current Role' : 'हालको भूमिका'}
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {['parent', 'student', 'teacher', 'preschool'].map((role) => (
                <Button
                  key={role}
                  variant={currentRole === role ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setRole(role as 'parent' | 'student' | 'teacher' | 'preschool');
                    window.location.href = `/${role}`;
                  }}
                  className="justify-start"
                >
                  {role === 'parent' && '👨‍👩‍👧'}
                  {role === 'student' && '🎓'}
                  {role === 'teacher' && '👩‍🏫'}
                  {role === 'preschool' && '🌈'}
                  <span className="ml-2 capitalize">{role}</span>
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Scenario Switcher */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Play className="h-4 w-4" />
              {locale === 'en' ? 'Demo Scenarios' : 'डेमो परिदृश्यहरू'}
            </h3>

            <div className="space-y-2">
              {scenarios.map((scenario) => (
                <Button
                  key={scenario.id}
                  variant="outline"
                  className="w-full justify-start h-auto py-3"
                  onClick={() => onSwitchScenario?.(scenario.id)}
                >
                  <div className="text-left">
                    <p className="font-medium">{scenario.name[locale]}</p>
                    <p className="text-xs text-muted-foreground">
                      {scenario.description[locale]}
                    </p>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Data Regeneration */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Database className="h-4 w-4" />
              {locale === 'en' ? 'Regenerate Data' : 'डाटा पुन: उत्पन्न गर्नुहोस्'}
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {dataTypes.map((type) => (
                <Button
                  key={type.id}
                  variant="outline"
                  size="sm"
                  onClick={() => onRegenerateData?.(type.id)}
                  className="justify-start"
                >
                  <span className="mr-2">{type.icon}</span>
                  {type.name[locale]}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Reset Actions */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              {locale === 'en' ? 'Reset Options' : 'रिसेट विकल्पहरू'}
            </h3>

            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleClearTours}
              >
                <Play className="h-4 w-4 mr-2" />
                {locale === 'en' ? 'Reset Tours & Hints' : 'टूर र संकेतहरू रिसेट गर्नुहोस्'}
              </Button>

              <Button
                variant="destructive"
                className="w-full justify-start"
                onClick={handleResetDemo}
                disabled={isResetting}
              >
                {isResetting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                {locale === 'en' ? 'Full Demo Reset' : 'पूर्ण डेमो रिसेट'}
              </Button>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="mt-8 p-4 bg-secondary/50 rounded-lg">
            <h4 className="font-medium text-sm mb-2">
              {locale === 'en' ? 'Keyboard Shortcuts' : 'किबोर्ड सर्टकटहरू'}
            </h4>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p><kbd className="px-1.5 py-0.5 bg-secondary rounded">Ctrl+Shift+D</kbd> - {locale === 'en' ? 'Open Admin Panel' : 'एडमिन प्यानल खोल्नुहोस्'}</p>
              <p><kbd className="px-1.5 py-0.5 bg-secondary rounded">Ctrl+Shift+L</kbd> - {locale === 'en' ? 'Toggle Language' : 'भाषा टगल गर्नुहोस्'}</p>
              <p><kbd className="px-1.5 py-0.5 bg-secondary rounded">Ctrl+Shift+T</kbd> - {locale === 'en' ? 'Toggle Theme' : 'थिम टगल गर्नुहोस्'}</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

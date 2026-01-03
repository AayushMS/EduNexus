'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocaleStore } from '@/store/localeStore';
import { useAuthStore } from '@/store/authStore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Play, X, Clock, Rocket } from 'lucide-react';

interface WelcomeModalProps {
  onStartTour: () => void;
  onSkip: () => void;
}

export function WelcomeModal({ onStartTour, onSkip }: WelcomeModalProps) {
  const { locale } = useLocaleStore();
  const { role: currentRole } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has seen the welcome modal for this role
    const key = `welcome_${currentRole}_seen`;
    const seen = localStorage.getItem(key);

    if (!seen && currentRole) {
      // Show modal after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentRole]);

  const handleStartTour = () => {
    localStorage.setItem(`welcome_${currentRole}_seen`, 'true');
    setIsOpen(false);
    onStartTour();
  };

  const handleSkip = () => {
    localStorage.setItem(`welcome_${currentRole}_seen`, 'true');
    setIsOpen(false);
    onSkip();
  };

  const roleConfig = {
    parent: {
      emoji: '👨‍👩‍👧',
      title: { en: 'Welcome, Parent!', ne: 'स्वागत छ, अभिभावक!' },
      subtitle: {
        en: 'Stay connected with your child\'s education journey.',
        ne: 'आफ्नो बच्चाको शैक्षिक यात्रासँग जोडिएको रहनुहोस्।',
      },
      features: [
        { en: 'Activity Feed', ne: 'गतिविधि फिड', icon: '📱' },
        { en: 'Quick Actions', ne: 'द्रुत कार्यहरू', icon: '⚡' },
        { en: 'Milestone Celebrations', ne: 'माइलस्टोन उत्सवहरू', icon: '🎉' },
      ],
    },
    student: {
      emoji: '🎓',
      title: { en: 'Welcome, Student!', ne: 'स्वागत छ, विद्यार्थी!' },
      subtitle: {
        en: 'Learn, earn XP, and level up your education!',
        ne: 'सिक्नुहोस्, XP कमाउनुहोस्, र आफ्नो शिक्षा लेभल अप गर्नुहोस्!',
      },
      features: [
        { en: 'XP & Badges', ne: 'XP र ब्याजहरू', icon: '🏆' },
        { en: 'Study Squads', ne: 'अध्ययन टोलीहरू', icon: '👥' },
        { en: 'Focus Mode', ne: 'फोकस मोड', icon: '🎯' },
      ],
    },
    teacher: {
      emoji: '👩‍🏫',
      title: { en: 'Welcome, Teacher!', ne: 'स्वागत छ, शिक्षक!' },
      subtitle: {
        en: 'Manage your classes efficiently with one-tap tools.',
        ne: 'एक-ट्याप उपकरणहरूसँग आफ्नो कक्षाहरू कुशलतापूर्वक व्यवस्थापन गर्नुहोस्।',
      },
      features: [
        { en: 'Quick Attendance', ne: 'द्रुत उपस्थिति', icon: '✓' },
        { en: 'Spreadsheet Grading', ne: 'स्प्रेडसिट ग्रेडिङ', icon: '📊' },
        { en: 'Moment Posting', ne: 'पल पोस्टिङ', icon: '📸' },
      ],
    },
    preschool: {
      emoji: '🌈',
      title: { en: 'Welcome, Pre-school Teacher!', ne: 'स्वागत छ, पूर्व-विद्यालय शिक्षक!' },
      subtitle: {
        en: 'Track development and share beautiful moments.',
        ne: 'विकास ट्र्याक गर्नुहोस् र सुन्दर पलहरू साझा गर्नुहोस्।',
      },
      features: [
        { en: 'Development Radar', ne: 'विकास रडार', icon: '📈' },
        { en: 'Activity Logging', ne: 'गतिविधि लगिङ', icon: '📝' },
        { en: 'HPRC Reports', ne: 'HPRC रिपोर्टहरू', icon: '📋' },
      ],
    },
  };

  const config = currentRole ? roleConfig[currentRole as keyof typeof roleConfig] : null;

  if (!config) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="text-center mb-2">
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              className="text-6xl block mb-4"
            >
              {config.emoji}
            </motion.span>
            <DialogTitle className="text-2xl">
              {config.title[locale]}
            </DialogTitle>
            <DialogDescription className="mt-2">
              {config.subtitle[locale]}
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Demo Mode Badge */}
        <div className="flex justify-center my-2">
          <Badge variant="outline" className="gap-1 text-amber-600 border-amber-300 bg-amber-50 dark:bg-amber-900/20">
            <Sparkles className="h-3 w-3" />
            {locale === 'en' ? 'Demo Mode - Sample Data' : 'डेमो मोड - नमूना डाटा'}
          </Badge>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-2 my-4">
          {config.features.map((feature, index) => (
            <motion.div
              key={feature.en}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="text-center p-3 rounded-lg bg-secondary/50"
            >
              <span className="text-2xl block mb-1">{feature.icon}</span>
              <span className="text-xs font-medium">{feature[locale]}</span>
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button className="w-full gap-2" onClick={handleStartTour}>
            <Play className="h-4 w-4" />
            {locale === 'en' ? 'Take a Quick Tour' : 'द्रुत टूर लिनुहोस्'}
            <Badge variant="secondary" className="ml-1 text-xs">
              <Clock className="h-3 w-3 mr-1" />
              30s
            </Badge>
          </Button>
          <Button variant="outline" className="w-full gap-2" onClick={handleSkip}>
            <Rocket className="h-4 w-4" />
            {locale === 'en' ? 'Skip & Explore' : 'छोड्नुहोस् र अन्वेषण गर्नुहोस्'}
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-2">
          {locale === 'en'
            ? 'You can restart the tour anytime from the help menu.'
            : 'तपाईं सहायता मेनुबाट कुनै पनि समय टूर पुन: सुरु गर्न सक्नुहुन्छ।'}
        </p>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocaleStore } from '@/store/localeStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

interface TourStep {
  targetSelector: string;
  title: string;
  titleNe: string;
  description: string;
  descriptionNe: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  highlight?: boolean;
}

interface InteractiveTourProps {
  tourId: string;
  steps: TourStep[];
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export function InteractiveTour({
  tourId,
  steps,
  isOpen,
  onClose,
  onComplete,
}: InteractiveTourProps) {
  const { locale } = useLocaleStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const currentStepData = steps[currentStep];

  const updateTargetPosition = useCallback(() => {
    if (!currentStepData) return;

    const target = document.querySelector(currentStepData.targetSelector);
    if (target) {
      const rect = target.getBoundingClientRect();
      setTargetRect(rect);

      // Calculate tooltip position based on step config
      const pos = currentStepData.position || 'bottom';
      const padding = 16;
      let top = 0;
      let left = 0;

      switch (pos) {
        case 'top':
          top = rect.top - padding - 150; // Approximate tooltip height
          left = rect.left + rect.width / 2 - 150; // Center horizontally
          break;
        case 'bottom':
          top = rect.bottom + padding;
          left = rect.left + rect.width / 2 - 150;
          break;
        case 'left':
          top = rect.top + rect.height / 2 - 75;
          left = rect.left - padding - 300;
          break;
        case 'right':
          top = rect.top + rect.height / 2 - 75;
          left = rect.right + padding;
          break;
      }

      // Keep tooltip in viewport
      top = Math.max(16, Math.min(top, window.innerHeight - 200));
      left = Math.max(16, Math.min(left, window.innerWidth - 320));

      setPosition({ top, left });
    }
  }, [currentStepData]);

  useEffect(() => {
    if (isOpen) {
      updateTargetPosition();
      window.addEventListener('resize', updateTargetPosition);
      window.addEventListener('scroll', updateTargetPosition);
    }

    return () => {
      window.removeEventListener('resize', updateTargetPosition);
      window.removeEventListener('scroll', updateTargetPosition);
    };
  }, [isOpen, updateTargetPosition]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Save completion to localStorage
    localStorage.setItem(`tour_${tourId}_completed`, 'true');
    setCurrentStep(0);
    onComplete?.();
    onClose();
  };

  const handleSkip = () => {
    localStorage.setItem(`tour_${tourId}_skipped`, 'true');
    setCurrentStep(0);
    onClose();
  };

  if (!isOpen || !currentStepData) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
          >
            {/* Spotlight cutout */}
            {targetRect && (
              <div
                className="absolute bg-transparent rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]"
                style={{
                  top: targetRect.top - 8,
                  left: targetRect.left - 8,
                  width: targetRect.width + 16,
                  height: targetRect.height + 16,
                  boxShadow: `
                    0 0 0 4px rgba(147, 51, 234, 0.5),
                    0 0 0 9999px rgba(0, 0, 0, 0.6)
                  `,
                }}
              />
            )}
          </motion.div>

          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed z-50"
            style={{ top: position.top, left: position.left }}
          >
            <Card className="w-[300px] shadow-2xl border-primary/20">
              <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">
                      {locale === 'en' ? currentStepData.title : currentStepData.titleNe}
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={handleSkip}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4">
                  {locale === 'en'
                    ? currentStepData.description
                    : currentStepData.descriptionNe}
                </p>

                {/* Progress */}
                <div className="flex items-center gap-1 mb-4">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        index <= currentStep ? 'bg-primary' : 'bg-secondary'
                      }`}
                    />
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {currentStep + 1} / {steps.length}
                  </span>
                  <div className="flex gap-2">
                    {currentStep > 0 && (
                      <Button variant="outline" size="sm" onClick={handlePrev}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                    )}
                    <Button size="sm" onClick={handleNext}>
                      {currentStep === steps.length - 1 ? (
                        locale === 'en' ? 'Finish' : 'समाप्त'
                      ) : (
                        <>
                          {locale === 'en' ? 'Next' : 'अर्को'}
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Tour configurations for each persona
export const TOUR_CONFIGS = {
  parent: [
    {
      targetSelector: '[data-tour="activity-feed"]',
      title: 'Activity Feed',
      titleNe: 'गतिविधि फिड',
      description: 'See real-time updates from your child\'s classroom. Photos, videos, and teacher posts appear here.',
      descriptionNe: 'आफ्नो बच्चाको कक्षाकोठाबाट वास्तविक-समय अपडेटहरू हेर्नुहोस्। फोटो, भिडियो, र शिक्षक पोस्टहरू यहाँ देखिन्छन्।',
      position: 'right' as const,
    },
    {
      targetSelector: '[data-tour="quick-actions"]',
      title: 'Quick Actions',
      titleNe: 'द्रुत कार्यहरू',
      description: 'Request leave, pay fees, or book PTM slots with just one tap!',
      descriptionNe: 'एक ट्यापमा बिदा अनुरोध गर्नुहोस्, शुल्क तिर्नुहोस्, वा PTM स्लट बुक गर्नुहोस्!',
      position: 'bottom' as const,
    },
    {
      targetSelector: '[data-tour="child-selector"]',
      title: 'Switch Children',
      titleNe: 'बच्चाहरू स्विच गर्नुहोस्',
      description: 'Have multiple children? Easily switch between their profiles here.',
      descriptionNe: 'धेरै बच्चाहरू छन्? यहाँ तिनीहरूको प्रोफाइलहरू बीच सजिलै स्विच गर्नुहोस्।',
      position: 'bottom' as const,
    },
    {
      targetSelector: '[data-tour="language-toggle"]',
      title: 'Language Toggle',
      titleNe: 'भाषा टगल',
      description: 'Switch between English and Nepali at any time.',
      descriptionNe: 'कुनै पनि समयमा अंग्रेजी र नेपाली बीच स्विच गर्नुहोस्।',
      position: 'bottom' as const,
    },
  ],
  student: [
    {
      targetSelector: '[data-tour="xp-bar"]',
      title: 'Your XP Progress',
      titleNe: 'तपाईंको XP प्रगति',
      description: 'Earn XP by completing homework, attending class, and participating. Level up to unlock rewards!',
      descriptionNe: 'गृहकार्य पूरा गरेर, कक्षामा उपस्थित भएर, र भाग लिएर XP कमाउनुहोस्। पुरस्कार अनलक गर्न लेभल अप गर्नुहोस्!',
      position: 'bottom' as const,
    },
    {
      targetSelector: '[data-tour="badges"]',
      title: 'Badge Collection',
      titleNe: 'ब्याज संग्रह',
      description: 'Collect badges for your achievements. Some are rare and legendary!',
      descriptionNe: 'तपाईंको उपलब्धिहरूको लागि ब्याजहरू संकलन गर्नुहोस्। केही दुर्लभ र किंवदंती छन्!',
      position: 'bottom' as const,
    },
    {
      targetSelector: '[data-tour="homework"]',
      title: 'Submit Homework',
      titleNe: 'गृहकार्य पेश गर्नुहोस्',
      description: 'Upload photos, files, or recordings of your homework. Earn XP for each submission!',
      descriptionNe: 'आफ्नो गृहकार्यको फोटो, फाइल, वा रेकर्डिङ अपलोड गर्नुहोस्। प्रत्येक पेशीको लागि XP कमाउनुहोस्!',
      position: 'left' as const,
    },
    {
      targetSelector: '[data-tour="streaks"]',
      title: 'Keep Your Streak',
      titleNe: 'आफ्नो स्ट्रिक राख्नुहोस्',
      description: 'Complete tasks daily to maintain your streak. Longer streaks = bonus XP!',
      descriptionNe: 'आफ्नो स्ट्रिक कायम राख्न दैनिक कार्यहरू पूरा गर्नुहोस्। लामो स्ट्रिक = बोनस XP!',
      position: 'bottom' as const,
    },
  ],
  teacher: [
    {
      targetSelector: '[data-tour="schedule"]',
      title: 'Today\'s Schedule',
      titleNe: 'आजको तालिका',
      description: 'See your daily classes at a glance. Current class is highlighted.',
      descriptionNe: 'एक नजरमा आफ्नो दैनिक कक्षाहरू हेर्नुहोस्। हालको कक्षा हाइलाइट गरिएको छ।',
      position: 'right' as const,
    },
    {
      targetSelector: '[data-tour="attendance"]',
      title: 'Quick Attendance',
      titleNe: 'द्रुत उपस्थिति',
      description: 'Mark attendance with a single tap. Use grid view for faster marking.',
      descriptionNe: 'एकल ट्यापमा उपस्थिति चिन्ह लगाउनुहोस्। छिटो चिन्ह लगाउन ग्रिड दृश्य प्रयोग गर्नुहोस्।',
      position: 'top' as const,
    },
    {
      targetSelector: '[data-tour="grades"]',
      title: 'Spreadsheet Grading',
      titleNe: 'स्प्रेडसिट ग्रेडिङ',
      description: 'Enter grades like a spreadsheet. Use Tab and Enter keys for quick navigation.',
      descriptionNe: 'स्प्रेडसिट जस्तो ग्रेडहरू प्रविष्ट गर्नुहोस्। द्रुत नेभिगेशनको लागि Tab र Enter कुञ्जीहरू प्रयोग गर्नुहोस्।',
      position: 'top' as const,
    },
    {
      targetSelector: '[data-tour="moment-post"]',
      title: 'Post Classroom Moments',
      titleNe: 'कक्षाकोठाका पलहरू पोस्ट गर्नुहोस्',
      description: 'Share photos and videos with parents instantly. They\'ll appear in the parent activity feed.',
      descriptionNe: 'तुरुन्त अभिभावकहरूसँग फोटो र भिडियो साझा गर्नुहोस्। तिनीहरू अभिभावक गतिविधि फिडमा देखिनेछन्।',
      position: 'bottom' as const,
    },
  ],
  preschool: [
    {
      targetSelector: '[data-tour="children-grid"]',
      title: 'Children Overview',
      titleNe: 'बालबालिकाहरूको सिंहावलोकन',
      description: 'See all children at a glance with their development progress bars.',
      descriptionNe: 'उनीहरूको विकास प्रगति बारहरूसँग एक नजरमा सबै बालबालिकाहरू हेर्नुहोस्।',
      position: 'bottom' as const,
    },
    {
      targetSelector: '[data-tour="radar-chart"]',
      title: 'Development Radar',
      titleNe: 'विकास रडार',
      description: 'Visual representation of a child\'s development across 5 domains. Compare with class average.',
      descriptionNe: '५ डोमेनहरूमा बच्चाको विकासको दृश्य प्रतिनिधित्व। कक्षा औसतसँग तुलना गर्नुहोस्।',
      position: 'right' as const,
    },
    {
      targetSelector: '[data-tour="activity-logger"]',
      title: 'Log Activities',
      titleNe: 'गतिविधिहरू लग गर्नुहोस्',
      description: 'Capture photos/videos, tag children, and map to development domains in one flow.',
      descriptionNe: 'एक प्रवाहमा फोटो/भिडियो क्याप्चर गर्नुहोस्, बालबालिकाहरूलाई ट्याग गर्नुहोस्, र विकास डोमेनहरूमा म्याप गर्नुहोस्।',
      position: 'bottom' as const,
    },
    {
      targetSelector: '[data-tour="report-generator"]',
      title: 'Generate Reports',
      titleNe: 'रिपोर्टहरू उत्पन्न गर्नुहोस्',
      description: 'Create beautiful HPRC reports with radar charts, photos, and teacher notes.',
      descriptionNe: 'रडार चार्ट, फोटो, र शिक्षक टिप्पणीहरूसँग सुन्दर HPRC रिपोर्टहरू सिर्जना गर्नुहोस्।',
      position: 'left' as const,
    },
  ],
};

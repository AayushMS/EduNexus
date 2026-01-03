'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LanguageToggle } from '@/components/shared/LanguageToggle';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { useLocaleStore } from '@/store/localeStore';
import { ArrowRight, Sparkles, Users, GraduationCap, BookOpen, Baby } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const { locale } = useLocaleStore();

  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: { en: 'Parent Portal', ne: 'अभिभावक पोर्टल' },
      description: {
        en: 'Stay connected with your child\'s education journey',
        ne: 'आफ्नो बच्चाको शिक्षा यात्रासँग जोडिएर रहनुहोस्',
      },
    },
    {
      icon: <GraduationCap className="h-6 w-6" />,
      title: { en: 'Student Gamification', ne: 'विद्यार्थी गेमिफिकेशन' },
      description: {
        en: 'Level up with XP, badges, and study squads',
        ne: 'XP, ब्याजहरू, र अध्ययन समूहहरूसँग स्तर बढाउनुहोस्',
      },
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: { en: 'Teacher Tools', ne: 'शिक्षक उपकरणहरू' },
      description: {
        en: 'Streamlined grading and attendance tracking',
        ne: 'सुव्यवस्थित ग्रेडिङ र उपस्थिति ट्र्याकिङ',
      },
    },
    {
      icon: <Baby className="h-6 w-6" />,
      title: { en: 'Pre-school Module', ne: 'पूर्व-विद्यालय मोड्युल' },
      description: {
        en: 'Visual developmental tracking with radar charts',
        ne: 'रडार चार्टहरूसँग दृश्य विकास ट्र्याकिङ',
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="flex items-center justify-between p-4 md:p-6">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">E</span>
          </div>
          <span className="font-bold text-2xl">EduNexus</span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">
              {locale === 'en' ? 'Next-Gen School Management' : 'नयाँ पुस्ताको विद्यालय व्यवस्थापन'}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            {locale === 'en' ? (
              <>
                Experience Education,{' '}
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Reimagined
                </span>
              </>
            ) : (
              <>
                शिक्षा,{' '}
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  नयाँ तरिकाले
                </span>
              </>
            )}
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {locale === 'en'
              ? 'A modern school management system designed for Nepal. Bilingual support, gamification for students, and intuitive tools for everyone.'
              : 'नेपालको लागि डिजाइन गरिएको आधुनिक विद्यालय व्यवस्थापन प्रणाली। द्विभाषिक समर्थन, विद्यार्थीहरूको लागि गेमिफिकेशन, र सबैको लागि सहज उपकरणहरू।'}
          </p>

          <Button
            size="lg"
            className="text-lg px-8 py-6 rounded-full"
            onClick={() => router.push('/role-select')}
          >
            {locale === 'en' ? 'Explore Demo' : 'डेमो अन्वेषण गर्नुहोस्'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-24">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-card border hover:shadow-lg transition-shadow"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">
                {feature.title[locale]}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description[locale]}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t mt-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>
            © 2024 EduNexus.{' '}
            {locale === 'en' ? 'All rights reserved.' : 'सर्वाधिकार सुरक्षित।'}
          </p>
          <p>
            {locale === 'en'
              ? 'Made with ❤️ for Nepal'
              : 'नेपालको लागि ❤️ सँग बनाइएको'}
          </p>
        </div>
      </footer>
    </div>
  );
}

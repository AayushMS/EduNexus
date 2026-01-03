'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LanguageToggle } from '@/components/shared/LanguageToggle';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { useLocaleStore } from '@/store/localeStore';
import { ArrowRight, Sparkles, Users, GraduationCap, BookOpen, Baby, Trophy, Camera, Target, BarChart3 } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

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
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <GraduationCap className="h-6 w-6" />,
      title: { en: 'Student Gamification', ne: 'विद्यार्थी गेमिफिकेशन' },
      description: {
        en: 'Level up with XP, badges, and study squads',
        ne: 'XP, ब्याजहरू, र अध्ययन समूहहरूसँग स्तर बढाउनुहोस्',
      },
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: { en: 'Teacher Tools', ne: 'शिक्षक उपकरणहरू' },
      description: {
        en: 'Streamlined grading and attendance tracking',
        ne: 'सुव्यवस्थित ग्रेडिङ र उपस्थिति ट्र्याकिङ',
      },
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: <Baby className="h-6 w-6" />,
      title: { en: 'Pre-school Module', ne: 'पूर्व-विद्यालय मोड्युल' },
      description: {
        en: 'Visual developmental tracking with radar charts',
        ne: 'रडार चार्टहरूसँग दृश्य विकास ट्र्याकिङ',
      },
      gradient: 'from-amber-500 to-orange-500',
    },
  ];

  const highlights = [
    { icon: <Camera className="h-5 w-5" />, text: { en: 'Activity Feed', ne: 'गतिविधि फिड' } },
    { icon: <Trophy className="h-5 w-5" />, text: { en: 'Gamification', ne: 'गेमिफिकेशन' } },
    { icon: <Target className="h-5 w-5" />, text: { en: 'Focus Mode', ne: 'फोकस मोड' } },
    { icon: <BarChart3 className="h-5 w-5" />, text: { en: 'Analytics', ne: 'एनालिटिक्स' } },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Header */}
      <motion.header
        className="relative flex items-center justify-between p-4 md:p-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-primary-foreground font-bold text-xl">E</span>
          </motion.div>
          <span className="font-bold text-2xl">EduNexus</span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </motion.header>

      {/* Hero Section */}
      <main className="relative container mx-auto px-4 py-12 md:py-20">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 mb-6"
            variants={fadeInUp}
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">
              {locale === 'en' ? 'Next-Gen School Management' : 'नयाँ पुस्ताको विद्यालय व्यवस्थापन'}
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            variants={fadeInUp}
          >
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
          </motion.h1>

          <motion.p
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            variants={fadeInUp}
          >
            {locale === 'en'
              ? 'A modern school management system designed for Nepal. Bilingual support, gamification for students, and intuitive tools for everyone.'
              : 'नेपालको लागि डिजाइन गरिएको आधुनिक विद्यालय व्यवस्थापन प्रणाली। द्विभाषिक समर्थन, विद्यार्थीहरूको लागि गेमिफिकेशन, र सबैको लागि सहज उपकरणहरू।'}
          </motion.p>

          {/* Highlight badges */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-8"
            variants={fadeInUp}
          >
            {highlights.map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-2 bg-secondary/50 rounded-full px-4 py-2 text-sm"
                whileHover={{ scale: 1.05, backgroundColor: 'var(--secondary)' }}
              >
                {item.icon}
                <span>{item.text[locale]}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Button
              size="lg"
              className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-shadow"
              onClick={() => router.push('/role-select')}
            >
              {locale === 'en' ? 'Explore Demo' : 'डेमो अन्वेषण गर्नुहोस्'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-20"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group p-6 rounded-2xl bg-card border hover:shadow-xl transition-all duration-300 cursor-pointer"
              variants={fadeInUp}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => router.push('/role-select')}
            >
              <motion.div
                className={`h-12 w-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-4`}
                whileHover={{ rotate: 5, scale: 1.1 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                {feature.title[locale]}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description[locale]}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {[
            { value: '500+', label: { en: 'Students', ne: 'विद्यार्थीहरू' } },
            { value: '20+', label: { en: 'Teachers', ne: 'शिक्षकहरू' } },
            { value: '30+', label: { en: 'Badges', ne: 'ब्याजहरू' } },
            { value: '100%', label: { en: 'Bilingual', ne: 'द्विभाषी' } },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {stat.label[locale]}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer
        className="relative container mx-auto px-4 py-8 border-t mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
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
      </motion.footer>
    </div>
  );
}

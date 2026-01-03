'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore, UserRole } from '@/store/authStore';
import { useLocaleStore } from '@/store/localeStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LanguageToggle } from '@/components/shared/LanguageToggle';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { Users, GraduationCap, BookOpen, Baby } from 'lucide-react';

const roles: {
  value: Exclude<UserRole, null>;
  icon: React.ReactNode;
  title: { en: string; ne: string };
  description: { en: string; ne: string };
  features: { en: string[]; ne: string[] };
  gradient: string;
}[] = [
  {
    value: 'parent',
    icon: <Users className="h-8 w-8" />,
    title: { en: 'Parent', ne: 'अभिभावक' },
    description: {
      en: 'Track your child\'s progress and stay connected with their school life.',
      ne: 'आफ्नो बच्चाको प्रगति ट्र्याक गर्नुहोस् र उनीहरूको विद्यालय जीवनसँग जोडिएर रहनुहोस्।',
    },
    features: {
      en: ['Activity Feed', 'One-Tap Actions', 'Milestone Celebrations'],
      ne: ['गतिविधि फिड', 'एक-ट्याप कार्यहरू', 'माइलस्टोन उत्सवहरू'],
    },
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    value: 'student',
    icon: <GraduationCap className="h-8 w-8" />,
    title: { en: 'Student', ne: 'विद्यार्थी' },
    description: {
      en: 'Level up your learning with XP, badges, and study squads.',
      ne: 'XP, ब्याजहरू, र अध्ययन समूहहरूसँग आफ्नो सिकाइ स्तर बढाउनुहोस्।',
    },
    features: {
      en: ['XP & Badges', 'Avatar Customization', 'Focus Mode'],
      ne: ['XP र ब्याजहरू', 'अवतार अनुकूलन', 'फोकस मोड'],
    },
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    value: 'teacher',
    icon: <BookOpen className="h-8 w-8" />,
    title: { en: 'Teacher', ne: 'शिक्षक' },
    description: {
      en: 'Streamline grading, attendance, and classroom moments.',
      ne: 'ग्रेडिङ, उपस्थिति, र कक्षा पलहरू सुव्यवस्थित गर्नुहोस्।',
    },
    features: {
      en: ['Spreadsheet Grading', 'One-Tap Attendance', 'Quick Moments'],
      ne: ['स्प्रेडशीट ग्रेडिङ', 'एक-ट्याप उपस्थिति', 'द्रुत पलहरू'],
    },
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    value: 'preschool',
    icon: <Baby className="h-8 w-8" />,
    title: { en: 'Pre-school', ne: 'पूर्व-विद्यालय' },
    description: {
      en: 'Track developmental milestones with visual progress reports.',
      ne: 'दृश्य प्रगति रिपोर्टहरूसँग विकास माइलस्टोनहरू ट्र्याक गर्नुहोस्।',
    },
    features: {
      en: ['Radar Charts', 'Activity Logging', 'HPRC Reports'],
      ne: ['रडार चार्टहरू', 'गतिविधि लगिङ', 'HPRC रिपोर्टहरू'],
    },
    gradient: 'from-amber-500 to-orange-500',
  },
];

// Demo users for each role
const demoUsers = {
  parent: {
    id: 'parent-001',
    name: 'Ramesh Sharma',
    nameNe: 'रमेश शर्मा',
    email: 'ramesh.sharma@demo.com',
    role: 'parent' as const,
  },
  student: {
    id: 'student-001',
    name: 'Aayush Shrestha',
    nameNe: 'आयुष श्रेष्ठ',
    email: 'aayush.shrestha@demo.com',
    role: 'student' as const,
  },
  teacher: {
    id: 'teacher-001',
    name: 'Sita Thapa',
    nameNe: 'सीता थापा',
    email: 'sita.thapa@demo.com',
    role: 'teacher' as const,
  },
  preschool: {
    id: 'preschool-001',
    name: 'Maya Gurung',
    nameNe: 'माया गुरुङ',
    email: 'maya.gurung@demo.com',
    role: 'preschool' as const,
  },
};

export default function RoleSelectPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const { locale } = useLocaleStore();

  const handleRoleSelect = (role: Exclude<UserRole, null>) => {
    const demoUser = demoUsers[role];
    setUser({
      ...demoUser,
      name: locale === 'en' ? demoUser.name : demoUser.nameNe,
    });
    router.push(`/${role}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
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

      {/* Demo Banner */}
      <div className="mx-4 md:mx-auto md:max-w-4xl mb-8">
        <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-lg px-4 py-2 text-center text-sm">
          🎭 {locale === 'en' ? 'Demo Mode - Select a role to explore the application' : 'डेमो मोड - एप्लिकेशन अन्वेषण गर्न भूमिका छान्नुहोस्'}
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {locale === 'en' ? 'Select Your Role' : 'आफ्नो भूमिका छान्नुहोस्'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {locale === 'en'
              ? 'Choose how you want to experience EduNexus. Each role offers a unique set of features designed for that persona.'
              : 'तपाईं EduNexus कसरी अनुभव गर्न चाहनुहुन्छ छान्नुहोस्। प्रत्येक भूमिकाले त्यो व्यक्तित्वको लागि डिजाइन गरिएको अद्वितीय सुविधाहरू प्रदान गर्दछ।'}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          {roles.map((role) => (
            <Card
              key={role.value}
              className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 hover:border-primary/50"
              onClick={() => handleRoleSelect(role.value)}
            >
              <CardHeader>
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${role.gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  {role.icon}
                </div>
                <CardTitle className="text-2xl">
                  {role.title[locale]}
                </CardTitle>
                <CardDescription className="text-base">
                  {role.description[locale]}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {role.features[locale].map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full mt-6 bg-gradient-to-r ${role.gradient} hover:opacity-90 transition-opacity`}
                >
                  {locale === 'en' ? 'Explore' : 'अन्वेषण गर्नुहोस्'} →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

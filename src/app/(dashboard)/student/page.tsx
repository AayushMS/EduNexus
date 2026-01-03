'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLocaleStore, toDevanagariNumerals } from '@/store/localeStore';
import { useMockData } from '@/hooks/useMockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XPProgressBar } from '@/components/student/XPProgressBar';
import { BadgeDisplay } from '@/components/student/BadgeDisplay';
import { StreakCounter } from '@/components/student/StreakCounter';
import { LevelUpAnimation } from '@/components/student/LevelUpAnimation';
import { HomeworkCard } from '@/components/student/HomeworkCard';
import { HomeworkSubmissionModal } from '@/components/student/HomeworkSubmissionModal';
import { DailyChallenges } from '@/components/student/DailyChallenges';
import { toast } from 'sonner';
import {
  Flame,
  BookOpen,
  Trophy,
  Target,
  Sparkles,
  Users,
  Gamepad2,
} from 'lucide-react';
import badgesJson from '@/data/seeds/badges.json';
import type { Badge } from '@/types/gamification.types';

const badgesData = badgesJson.badges as Badge[];

// Simplified assignment type for demo
interface DemoAssignment {
  id: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  title: string;
  titleNe: string;
  description: string;
  descriptionNe: string;
  dueDate: string;
  assignedDate: string;
  status: 'pending' | 'submitted' | 'graded' | 'late';
  xpReward: number;
  maxScore: number;
  grade?: {
    letterGrade: string;
    percentage: number;
  };
}

// Demo student ID
const DEMO_STUDENT_ID = 'student-1';

export default function StudentDashboard() {
  const { locale, useDevanagariNumerals } = useLocaleStore();
  const { students } = useMockData();

  // Modal states
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<DemoAssignment | null>(null);

  const formatNumber = (num: number) => {
    if (useDevanagariNumerals && locale === 'ne') {
      return toDevanagariNumerals(num);
    }
    return num.toString();
  };

  // Get demo student
  const demoStudent = useMemo(() => {
    return students.find((s) => s.id === DEMO_STUDENT_ID) || students[0];
  }, [students]);

  // Demo data
  const studentXP = demoStudent?.xp || 2450;
  const earnedBadgeIds = demoStudent?.badges || ['badge-1', 'badge-3', 'badge-5', 'badge-7'];
  const streakDays = demoStudent?.streaks?.homework || 12;

  // Demo assignments
  const demoAssignments: DemoAssignment[] = [
    {
      id: 'hw-1',
      classId: 'class-5a',
      subjectId: 'math',
      teacherId: 'teacher-1',
      title: 'Complete Exercise 4.2',
      titleNe: 'अभ्यास ४.२ पूरा गर्नुहोस्',
      description: 'Solve all questions from page 45-47',
      descriptionNe: 'पृष्ठ ४५-४७ बाट सबै प्रश्नहरू समाधान गर्नुहोस्',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      assignedDate: new Date().toISOString(),
      status: 'pending',
      xpReward: 50,
      maxScore: 100,
    },
    {
      id: 'hw-2',
      classId: 'class-5a',
      subjectId: 'english',
      teacherId: 'teacher-2',
      title: 'Write an essay on My Country',
      titleNe: 'मेरो देशमा निबन्ध लेख्नुहोस्',
      description: 'Write a 200-word essay about Nepal',
      descriptionNe: 'नेपालको बारेमा २०० शब्दको निबन्ध लेख्नुहोस्',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      assignedDate: new Date().toISOString(),
      status: 'pending',
      xpReward: 75,
      maxScore: 100,
    },
    {
      id: 'hw-3',
      classId: 'class-5a',
      subjectId: 'science',
      teacherId: 'teacher-3',
      title: 'Chapter 5 Questions',
      titleNe: 'अध्याय ५ प्रश्नहरू',
      description: 'Answer questions from the chapter',
      descriptionNe: 'अध्यायबाट प्रश्नहरूको जवाफ दिनुहोस्',
      dueDate: new Date().toISOString(),
      assignedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'submitted',
      xpReward: 50,
      maxScore: 100,
    },
  ];

  // Demo daily challenges
  const dailyChallenges = [
    {
      id: 'dc-1',
      title: { en: 'Complete 2 Homework', ne: '२ गृहकार्य पूरा गर्नुहोस्' },
      description: { en: 'Submit any 2 homework assignments', ne: 'कुनै २ गृहकार्य पेश गर्नुहोस्' },
      xpReward: 50,
      progress: 1,
      target: 2,
      completed: false,
      icon: '📚',
    },
    {
      id: 'dc-2',
      title: { en: 'Perfect Attendance', ne: 'पूर्ण उपस्थिति' },
      description: { en: 'Be present in all classes today', ne: 'आज सबै कक्षामा उपस्थित हुनुहोस्' },
      xpReward: 25,
      progress: 5,
      target: 5,
      completed: true,
      icon: '✅',
    },
    {
      id: 'dc-3',
      title: { en: 'Help a Friend', ne: 'साथीलाई मद्दत गर्नुहोस्' },
      description: { en: 'Help a classmate with their studies', ne: 'सहपाठीलाई पढाइमा मद्दत गर्नुहोस्' },
      xpReward: 30,
      progress: 0,
      target: 1,
      completed: false,
      icon: '🤝',
    },
  ];

  // Quick stats
  const quickStats = [
    {
      icon: <Flame className="h-5 w-5" />,
      label: { en: 'Day Streak', ne: 'दिन स्ट्रिक' },
      value: formatNumber(streakDays),
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      label: { en: 'Pending', ne: 'बाँकी' },
      value: formatNumber(demoAssignments.filter(a => a.status === 'pending').length),
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: <Trophy className="h-5 w-5" />,
      label: { en: 'Badges', ne: 'ब्याजहरू' },
      value: formatNumber(earnedBadgeIds.length),
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
    {
      icon: <Target className="h-5 w-5" />,
      label: { en: 'Rank', ne: 'रैंक' },
      value: `#${formatNumber(15)}`,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
  ];

  const handleSubmitHomework = (assignmentId: string) => {
    const assignment = demoAssignments.find((a) => a.id === assignmentId);
    if (assignment) {
      setSelectedAssignment(assignment);
    }
  };

  const handleHomeworkSubmitted = () => {
    toast.success(
      locale === 'en'
        ? 'Homework submitted! +50 XP'
        : 'गृहकार्य पेश गरियो! +५० XP'
    );
    setSelectedAssignment(null);
  };

  const handleClaimReward = (challengeId: string) => {
    toast.success(
      locale === 'en'
        ? 'Challenge reward claimed!'
        : 'चुनौती पुरस्कार दाबी गरियो!'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with greeting */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {locale === 'en'
              ? `Hey, ${demoStudent?.name?.split(' ')[0] || 'Student'}! 👋`
              : `नमस्ते, ${demoStudent?.nameNe?.split(' ')[0] || 'विद्यार्थी'}! 👋`}
          </h1>
          <p className="text-muted-foreground mt-1">
            {locale === 'en'
              ? "Let's make today awesome!"
              : 'आज उत्कृष्ट बनाउनुहोस्!'}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowLevelUp(true)}
          className="hidden sm:flex items-center gap-2"
        >
          <Sparkles className="h-4 w-4" />
          {locale === 'en' ? 'Demo Level Up' : 'डेमो लेभल अप'}
        </Button>
      </div>

      {/* XP Progress Card */}
      <Card className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 border-purple-500/20">
        <CardContent className="pt-6">
          <XPProgressBar currentXP={studentXP} size="lg" />
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.label.en}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`${stat.bgColor} ${stat.color} p-2 rounded-lg`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">
                      {stat.label[locale]}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Homework */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  {locale === 'en' ? 'Homework' : 'गृहकार्य'}
                </CardTitle>
                <Button variant="ghost" size="sm">
                  {locale === 'en' ? 'View All' : 'सबै हेर्नुहोस्'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {demoAssignments.map((assignment) => (
                <HomeworkCard
                  key={assignment.id}
                  assignment={assignment}
                  onSubmit={handleSubmitHomework}
                />
              ))}
            </CardContent>
          </Card>

          {/* Streak Section */}
          <div className="grid gap-4 md:grid-cols-2">
            <StreakCounter
              currentStreak={streakDays}
              longestStreak={21}
              streakType="homework"
            />
            <StreakCounter
              currentStreak={8}
              longestStreak={15}
              streakType="attendance"
            />
          </div>
        </div>

        {/* Right Column - Challenges & Badges */}
        <div className="space-y-6">
          <DailyChallenges
            challenges={dailyChallenges}
            onClaimReward={handleClaimReward}
          />

          <Card>
            <CardContent className="pt-6">
              <BadgeDisplay
                badges={badgesData}
                earnedBadgeIds={earnedBadgeIds}
                maxDisplay={6}
              />
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {locale === 'en' ? 'Quick Actions' : 'द्रुत कार्यहरू'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Users className="h-4 w-4" />
                {locale === 'en' ? 'Study Squads' : 'अध्ययन समूह'}
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Gamepad2 className="h-4 w-4" />
                {locale === 'en' ? 'Leaderboard' : 'लिडरबोर्ड'}
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Target className="h-4 w-4" />
                {locale === 'en' ? 'Focus Mode' : 'फोकस मोड'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Level Up Animation */}
      <LevelUpAnimation
        isOpen={showLevelUp}
        onClose={() => setShowLevelUp(false)}
        newLevel={25}
        xpEarned={150}
        unlockedRewards={[
          { type: 'badge', name: { en: 'Scholar', ne: 'विद्वान' }, icon: '🎓' },
          { type: 'avatar', name: { en: 'Cool Hat', ne: 'राम्रो टोपी' }, icon: '🎩' },
        ]}
      />

      {/* Homework Submission Modal */}
      {selectedAssignment && (
        <HomeworkSubmissionModal
          isOpen={!!selectedAssignment}
          onClose={() => setSelectedAssignment(null)}
          assignment={{
            id: selectedAssignment.id,
            title: { en: selectedAssignment.title, ne: selectedAssignment.titleNe },
            xpReward: selectedAssignment.xpReward,
          }}
          onSubmit={handleHomeworkSubmitted}
        />
      )}
    </div>
  );
}

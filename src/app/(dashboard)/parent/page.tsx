'use client';

import { useState, useMemo, useEffect } from 'react';
import { useLocaleStore } from '@/store/localeStore';
import { useMockData } from '@/hooks/useMockData';
import { ActivityFeed } from '@/components/parent/ActivityFeed';
import { ChildSelector } from '@/components/parent/ChildSelector';
import { QuickActions } from '@/components/parent/QuickActions';
import { ParentStats } from '@/components/parent/ParentStats';
import { LeaveRequestModal } from '@/components/parent/LeaveRequestModal';
import { FeePaymentModal } from '@/components/parent/FeePaymentModal';
import { PTMBookingModal } from '@/components/parent/PTMBookingModal';
import { MilestoneCelebration } from '@/components/parent/MilestoneCelebration';
import { Button } from '@/components/ui/button';
import type { ReactionType } from '@/types/activity.types';
import { toast } from 'sonner';
import { Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Demo parent ID (first parent in our mock data)
const DEMO_PARENT_ID = 'parent-1';

interface ChildInfo {
  id: string;
  name: string;
  nameNe: string;
  grade: number;
  section: string;
  avatarUrl?: string;
}

export default function ParentDashboard() {
  const { locale } = useLocaleStore();
  const { parents, students, activityFeed } = useMockData();

  const router = useRouter();

  // Modal states
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [isPTMModalOpen, setIsPTMModalOpen] = useState(false);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);

  // Get the demo parent
  const demoParent = useMemo(() => {
    return parents.find((p) => p.id === DEMO_PARENT_ID) || parents[0];
  }, [parents]);

  // Get children of the demo parent
  const children = useMemo((): ChildInfo[] => {
    if (!demoParent) return [];
    const result: ChildInfo[] = [];
    for (const childId of demoParent.childrenIds) {
      const student = students.find((s) => s.id === childId);
      if (student) {
        result.push({
          id: student.id,
          name: student.name,
          nameNe: student.nameNe,
          grade: student.grade,
          section: student.section,
          avatarUrl: student.avatarUrl,
        });
      }
    }
    return result;
  }, [demoParent, students]);

  // State for selected child
  const [selectedChild, setSelectedChild] = useState<ChildInfo | null>(null);

  // Set initial selected child when children are loaded
  useEffect(() => {
    if (children.length > 0 && !selectedChild) {
      setSelectedChild(children[0]);
    }
  }, [children, selectedChild]);

  // Filter activities for the selected child's class
  const childActivities = useMemo(() => {
    if (!selectedChild) return activityFeed;
    const student = students.find((s) => s.id === selectedChild.id);
    if (!student) return activityFeed;

    // Filter activities that include the child's class or are school-wide
    return activityFeed.filter(
      (activity) =>
        activity.taggedClassIds.includes(student.classId) ||
        activity.taggedClassIds.length === 0
    );
  }, [selectedChild, students, activityFeed]);

  // Handle reaction
  const handleReaction = (activityId: string, reaction: ReactionType) => {
    toast.success(
      locale === 'en'
        ? `You reacted with ${reaction}!`
        : `तपाईंले ${reaction} सँग प्रतिक्रिया दिनुभयो!`
    );
  };

  // Handle quick action click
  const handleActionClick = (actionId: string) => {
    switch (actionId) {
      case 'leave':
        setIsLeaveModalOpen(true);
        break;
      case 'fees':
        setIsFeeModalOpen(true);
        break;
      case 'ptm':
        setIsPTMModalOpen(true);
        break;
      case 'report':
        router.push('/parent/academics');
        break;
      case 'message':
        router.push('/parent/messages');
        break;
      case 'alerts':
        router.push('/parent/notifications');
        break;
      default:
        break;
    }
  };

  // Handle leave request submission
  const handleLeaveSubmit = () => {
    toast.success(
      locale === 'en'
        ? 'Leave request submitted successfully!'
        : 'बिदा अनुरोध सफलतापूर्वक पेश गरियो!'
    );
  };

  // Demo engagement stats
  const engagementStats = {
    engagementScore: 85,
    engagementLevel: 'gold' as const,
    xp: 2450,
    activitiesThisWeek: 12,
    badgeCount: 8,
  };

  // Demo milestone for celebration
  const demoMilestone = {
    title: {
      en: 'Perfect Attendance',
      ne: 'पूर्ण उपस्थिति',
    },
    description: {
      en: 'Achieved 100% attendance for the month of Poush!',
      ne: 'पुष महिनाको लागि १००% उपस्थिति हासिल गर्नुभयो!',
    },
    childName: selectedChild
      ? { en: selectedChild.name, ne: selectedChild.nameNe }
      : { en: 'Your Child', ne: 'तपाईंको बच्चा' },
    type: 'attendance' as const,
    date: '2026-01-03',
    xpReward: 500,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {locale === 'en' ? 'Parent Dashboard' : 'अभिभावक ड्यासबोर्ड'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {locale === 'en'
              ? "Welcome back! Here's what's happening with your child."
              : 'स्वागत छ! तपाईंको बच्चासँग के भइरहेको छ यहाँ छ।'}
          </p>
        </div>

        {/* Demo celebration trigger */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsCelebrationOpen(true)}
          className="hidden sm:flex items-center gap-2"
        >
          <Sparkles className="h-4 w-4" />
          {locale === 'en' ? 'Demo Celebration' : 'डेमो सेलिब्रेशन'}
        </Button>
      </div>

      {/* Child Selector */}
      {children.length > 0 && (
        <ChildSelector
          children={children}
          selectedChild={selectedChild}
          onSelectChild={setSelectedChild}
        />
      )}

      {/* Stats and Quick Actions Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ParentStats {...engagementStats} />
        <QuickActions onActionClick={handleActionClick} />
      </div>

      {/* Activity Feed Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {locale === 'en' ? 'Activity Feed' : 'गतिविधि फिड'}
        </h2>
        <ActivityFeed activities={childActivities} onReact={handleReaction} />
      </div>

      {/* Leave Request Modal */}
      <LeaveRequestModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        children={children.map((c) => ({
          id: c.id,
          name: c.name,
          nameNe: c.nameNe,
        }))}
        onSubmit={handleLeaveSubmit}
      />

      {/* Fee Payment Modal */}
      <FeePaymentModal
        isOpen={isFeeModalOpen}
        onClose={() => setIsFeeModalOpen(false)}
        children={children.map((c) => ({
          id: c.id,
          name: c.name,
          nameNe: c.nameNe,
        }))}
      />

      {/* PTM Booking Modal */}
      <PTMBookingModal
        isOpen={isPTMModalOpen}
        onClose={() => setIsPTMModalOpen(false)}
      />

      {/* Milestone Celebration Modal */}
      <MilestoneCelebration
        isOpen={isCelebrationOpen}
        onClose={() => setIsCelebrationOpen(false)}
        milestone={demoMilestone}
      />
    </div>
  );
}

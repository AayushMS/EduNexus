import {
  Home,
  Users,
  BookOpen,
  Calendar,
  MessageSquare,
  Trophy,
  Settings,
  ClipboardList,
  Camera,
  BarChart3,
  Gamepad2,
  Target,
  Smile,
  GraduationCap,
  FileText,
  Bell,
  Backpack,
  Wallet,
  History,
  type LucideIcon,
} from 'lucide-react';
import { UserRole } from '@/store/authStore';

export interface NavItem {
  title: { en: string; ne: string };
  href: string;
  icon: LucideIcon;
  badge?: number;
  children?: NavItem[];
}

export interface NavConfig {
  mainNav: NavItem[];
  secondaryNav: NavItem[];
}

export const navigationConfig: Record<Exclude<UserRole, null>, NavConfig> = {
  parent: {
    mainNav: [
      {
        title: { en: 'Dashboard', ne: 'ड्यासबोर्ड' },
        href: '/parent',
        icon: Home,
      },
      {
        title: { en: 'Activity Feed', ne: 'गतिविधि फिड' },
        href: '/parent/feed',
        icon: Camera,
      },
      {
        title: { en: 'Academics', ne: 'शैक्षिक' },
        href: '/parent/academics',
        icon: BookOpen,
      },
      {
        title: { en: 'Attendance', ne: 'उपस्थिति' },
        href: '/parent/attendance',
        icon: Calendar,
      },
      {
        title: { en: 'Messages', ne: 'सन्देशहरू' },
        href: '/parent/messages',
        icon: MessageSquare,
        badge: 3,
      },
      {
        title: { en: 'Achievements', ne: 'उपलब्धिहरू' },
        href: '/parent/achievements',
        icon: Trophy,
      },
      {
        title: { en: 'Fees & Billing', ne: 'शुल्क र बिलिंग' },
        href: '/parent/fees',
        icon: Wallet,
      },
    ],
    secondaryNav: [
      {
        title: { en: 'Notifications', ne: 'सूचनाहरू' },
        href: '/parent/notifications',
        icon: Bell,
      },
      {
        title: { en: 'Settings', ne: 'सेटिङ्स' },
        href: '/parent/settings',
        icon: Settings,
      },
    ],
  },
  student: {
    mainNav: [
      {
        title: { en: 'Dashboard', ne: 'ड्यासबोर्ड' },
        href: '/student',
        icon: Home,
      },
      {
        title: { en: 'Assignments', ne: 'कार्यहरू' },
        href: '/student/assignments',
        icon: ClipboardList,
        badge: 5,
      },
      {
        title: { en: 'Study Squads', ne: 'अध्ययन समूह' },
        href: '/student/squads',
        icon: Users,
      },
      {
        title: { en: 'Leaderboard', ne: 'लीडरबोर्ड' },
        href: '/student/leaderboard',
        icon: Trophy,
      },
      {
        title: { en: 'Focus Mode', ne: 'फोकस मोड' },
        href: '/student/focus',
        icon: Target,
      },
      {
        title: { en: 'My Avatar', ne: 'मेरो अवतार' },
        href: '/student/profile',
        icon: Gamepad2,
      },
    ],
    secondaryNav: [
      {
        title: { en: 'Mood Check', ne: 'मूड चेक' },
        href: '/student/mood',
        icon: Smile,
      },
      {
        title: { en: 'Settings', ne: 'सेटिङ्स' },
        href: '/student/settings',
        icon: Settings,
      },
    ],
  },
  teacher: {
    mainNav: [
      {
        title: { en: 'Dashboard', ne: 'ड्यासबोर्ड' },
        href: '/teacher',
        icon: Home,
      },
      {
        title: { en: 'Classes', ne: 'कक्षाहरू' },
        href: '/teacher/classes',
        icon: Users,
      },
      {
        title: { en: 'Attendance', ne: 'उपस्थिति' },
        href: '/teacher/attendance',
        icon: ClipboardList,
      },
      {
        title: { en: 'Grades', ne: 'ग्रेडहरू' },
        href: '/teacher/grades',
        icon: BarChart3,
      },
      {
        title: { en: 'Post Moment', ne: 'पल पोस्ट' },
        href: '/teacher/moments',
        icon: Camera,
      },
      {
        title: { en: 'Messages', ne: 'सन्देशहरू' },
        href: '/teacher/messages',
        icon: MessageSquare,
        badge: 2,
      },
    ],
    secondaryNav: [
      {
        title: { en: 'Leave Requests', ne: 'बिदा अनुरोध' },
        href: '/teacher/leaves',
        icon: FileText,
        badge: 4,
      },
      {
        title: { en: 'Attendance Reports', ne: 'उपस्थिति रिपोर्ट' },
        href: '/teacher/reports',
        icon: History,
      },
      {
        title: { en: 'Settings', ne: 'सेटिङ्स' },
        href: '/teacher/settings',
        icon: Settings,
      },
    ],
  },
  preschool: {
    mainNav: [
      {
        title: { en: 'Dashboard', ne: 'ड्यासबोर्ड' },
        href: '/preschool',
        icon: Home,
      },
      {
        title: { en: 'Children', ne: 'बालबालिकाहरू' },
        href: '/preschool/students',
        icon: Backpack,
      },
      {
        title: { en: 'Log Activity', ne: 'गतिविधि लग' },
        href: '/preschool/activities',
        icon: Camera,
      },
      {
        title: { en: 'Development', ne: 'विकास' },
        href: '/preschool/development',
        icon: BarChart3,
      },
      {
        title: { en: 'Reports', ne: 'रिपोर्टहरू' },
        href: '/preschool/reports',
        icon: FileText,
      },
      {
        title: { en: 'Milestones', ne: 'माइलस्टोनहरू' },
        href: '/preschool/milestones',
        icon: GraduationCap,
      },
    ],
    secondaryNav: [
      {
        title: { en: 'Messages', ne: 'सन्देशहरू' },
        href: '/preschool/messages',
        icon: MessageSquare,
      },
      {
        title: { en: 'Settings', ne: 'सेटिङ्स' },
        href: '/preschool/settings',
        icon: Settings,
      },
    ],
  },
};

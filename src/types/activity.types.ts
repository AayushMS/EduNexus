/**
 * Activity Feed type definitions for EduNexus
 */

import type { BilingualText } from './user.types';

// Activity Feed types
export type ActivityType =
  | 'classroom_moment'
  | 'assignment_posted'
  | 'grade_released'
  | 'attendance_marked'
  | 'achievement_earned'
  | 'event_announcement'
  | 'fee_reminder'
  | 'ptm_scheduled'
  | 'leave_approved'
  | 'milestone_reached';

export interface ActivityFeedItem {
  id: string;
  type: ActivityType;

  // Author info
  authorId: string;
  authorName: string;
  authorNameNe: string;
  authorRole: 'teacher' | 'admin' | 'system';
  authorAvatarUrl?: string;

  // Content
  title: string;
  titleNe: string;
  content: string;
  contentNe: string;

  // Media
  media: MediaItem[];
  mediaLayout: 'single' | 'grid' | 'carousel';

  // Tags
  taggedStudentIds: string[];
  taggedClassIds: string[];
  activityTags: string[];
  activityTagsNe: string[];

  // Engagement
  reactions: Reaction[];
  reactionCounts: ReactionCounts;
  comments: Comment[];
  commentCount: number;

  // Metadata
  visibility: 'public' | 'class' | 'tagged_only';
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  caption?: string;
  captionNe?: string;
  width?: number;
  height?: number;
  duration?: number; // For videos, in seconds
}

// Reactions
export type ReactionType = 'heart' | 'clap' | 'smile' | 'celebrate' | 'fire';

export interface Reaction {
  id: string;
  userId: string;
  userName: string;
  type: ReactionType;
  createdAt: Date;
}

export interface ReactionCounts {
  heart: number;
  clap: number;
  smile: number;
  celebrate: number;
  fire: number;
  total: number;
}

export const REACTION_EMOJIS: Record<ReactionType, string> = {
  heart: '❤️',
  clap: '👏',
  smile: '😊',
  celebrate: '🎉',
  fire: '🔥',
};

// Comments
export interface Comment {
  id: string;
  activityId: string;
  authorId: string;
  authorName: string;
  authorNameNe: string;
  authorAvatarUrl?: string;
  authorRole: 'parent' | 'teacher' | 'admin';

  content: string;
  createdAt: Date;
  updatedAt: Date;

  likes: number;
  likedByUserIds: string[];
}

// Classroom Moment specific
export interface ClassroomMoment extends ActivityFeedItem {
  type: 'classroom_moment';
  momentType: MomentType;
  subjectId?: string;
  subjectName?: string;
  subjectNameNe?: string;
  moodEmoji?: string;
}

export type MomentType =
  | 'science_lab'
  | 'art_class'
  | 'sports'
  | 'music'
  | 'cultural'
  | 'field_trip'
  | 'celebration'
  | 'library'
  | 'assembly'
  | 'general';

export const MOMENT_TYPES: Record<MomentType, { en: string; ne: string; icon: string }> = {
  science_lab: { en: 'Science Lab', ne: 'विज्ञान प्रयोगशाला', icon: '🔬' },
  art_class: { en: 'Art Class', ne: 'कला कक्षा', icon: '🎨' },
  sports: { en: 'Sports', ne: 'खेलकुद', icon: '⚽' },
  music: { en: 'Music', ne: 'संगीत', icon: '🎵' },
  cultural: { en: 'Cultural', ne: 'सांस्कृतिक', icon: '🎭' },
  field_trip: { en: 'Field Trip', ne: 'फिल्ड ट्रिप', icon: '🚌' },
  celebration: { en: 'Celebration', ne: 'उत्सव', icon: '🎊' },
  library: { en: 'Library', ne: 'पुस्तकालय', icon: '📚' },
  assembly: { en: 'Assembly', ne: 'सभा', icon: '🎤' },
  general: { en: 'General', ne: 'सामान्य', icon: '📸' },
};

// Notification types
export type NotificationType =
  | 'activity'
  | 'assignment'
  | 'grade'
  | 'attendance'
  | 'achievement'
  | 'reminder'
  | 'message'
  | 'system';

export type NotificationPriority = 'high' | 'medium' | 'low';

export interface Notification {
  id: string;
  userId: string;

  type: NotificationType;
  priority: NotificationPriority;

  title: string;
  titleNe: string;
  message: string;
  messageNe: string;

  icon: string;
  actionUrl?: string;

  read: boolean;
  readAt?: Date;
  createdAt: Date;

  // Reference to related entity
  referenceType?: string;
  referenceId?: string;
}

// Parent Quick Actions
export interface LeaveRequest {
  id: string;
  studentId: string;
  parentId: string;

  startDate: Date;
  endDate: Date;
  duration: 'half_day' | 'full_day' | 'multiple_days';

  reason: LeaveReason;
  customReason?: string;
  customReasonNe?: string;

  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;

  createdAt: Date;
}

export type LeaveReason = 'sick' | 'family_emergency' | 'travel' | 'medical_appointment' | 'other';

export const LEAVE_REASONS: Record<LeaveReason, { en: string; ne: string; icon: string }> = {
  sick: { en: 'Sick', ne: 'बिरामी', icon: '🤒' },
  family_emergency: { en: 'Family Emergency', ne: 'पारिवारिक आपतकालीन', icon: '🏠' },
  travel: { en: 'Travel', ne: 'यात्रा', icon: '✈️' },
  medical_appointment: { en: 'Medical Appointment', ne: 'चिकित्सा भेट', icon: '🏥' },
  other: { en: 'Other', ne: 'अन्य', icon: '📝' },
};

// Fee types
export interface FeePayment {
  id: string;
  studentId: string;
  parentId: string;

  feeType: FeeType;
  amount: number;
  currency: 'NPR';

  dueDate: Date;
  paidDate?: Date;

  status: 'pending' | 'paid' | 'overdue' | 'partial';
  paidAmount?: number;

  paymentMethod?: PaymentMethod;
  transactionId?: string;

  createdAt: Date;
}

export type FeeType = 'tuition' | 'exam' | 'transport' | 'books' | 'uniform' | 'activity' | 'other';
export type PaymentMethod = 'esewa' | 'khalti' | 'bank_transfer' | 'cash';

// PTM types
export interface PTMBooking {
  id: string;
  studentId: string;
  parentId: string;
  teacherId: string;

  date: Date;
  timeSlot: string;
  duration: number; // in minutes
  mode: 'in_person' | 'virtual';

  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  notesNe?: string;

  virtualMeetingUrl?: string;

  createdAt: Date;
  confirmedAt?: Date;
}

// Milestone Celebration
export interface MilestoneCelebration {
  id: string;
  studentId: string;

  type: MilestoneType;
  title: string;
  titleNe: string;
  description: string;
  descriptionNe: string;

  achievement: string;
  achievementNe: string;

  icon: string;
  animation: 'confetti' | 'fireworks' | 'stars';

  shareable: boolean;
  certificateUrl?: string;

  createdAt: Date;
  celebratedAt?: Date;
}

export type MilestoneType =
  | 'academic_excellence'
  | 'attendance_perfect'
  | 'level_up'
  | 'badge_earned'
  | 'streak_milestone'
  | 'competition_win'
  | 'special_achievement';

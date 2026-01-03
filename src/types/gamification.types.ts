/**
 * Gamification type definitions for EduNexus
 */

import type { BilingualText } from './user.types';

// Badge system
export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type BadgeCategory = 'academic' | 'attendance' | 'behavior' | 'participation' | 'special';

export interface Badge {
  id: string;
  name: string;
  nameNe: string;
  description: string;
  descriptionNe: string;

  icon: string;
  rarity: BadgeRarity;
  category: BadgeCategory;

  // Visual properties
  borderColor: string;
  glowColor: string;

  // Unlock requirements
  requirement: BadgeRequirement;
  xpReward: number;

  // Tracking
  unlockedCount: number; // How many students have earned this
  createdAt: Date;
}

export interface BadgeRequirement {
  type: 'count' | 'streak' | 'score' | 'special';
  metric: string;
  target: number;
  description: string;
  descriptionNe: string;
}

export interface EarnedBadge {
  badgeId: string;
  earnedAt: Date;
  notified: boolean;
}

// XP System
export interface XPTransaction {
  id: string;
  userId: string;
  amount: number;
  reason: string;
  reasonNe: string;
  category: XPCategory;
  timestamp: Date;

  // Optional reference to related action
  referenceType?: 'assignment' | 'attendance' | 'quiz' | 'badge' | 'streak' | 'focus' | 'mood' | 'squad';
  referenceId?: string;
}

export type XPCategory =
  | 'homework'
  | 'attendance'
  | 'quiz'
  | 'participation'
  | 'badge'
  | 'streak'
  | 'focus'
  | 'mood'
  | 'squad'
  | 'bonus';

export interface XPRewardConfig {
  category: XPCategory;
  action: string;
  baseXP: number;
  bonusMultiplier?: number;
  description: string;
  descriptionNe: string;
}

// XP reward values
export const XP_REWARDS: XPRewardConfig[] = [
  { category: 'homework', action: 'submit_on_time', baseXP: 50, description: 'Submit homework on time', descriptionNe: 'समयमा गृहकार्य पेश गर्नुहोस्' },
  { category: 'homework', action: 'submit_late', baseXP: 25, description: 'Submit homework late', descriptionNe: 'गृहकार्य ढिलो पेश गर्नुहोस्' },
  { category: 'homework', action: 'perfect_score', baseXP: 100, bonusMultiplier: 2, description: 'Get perfect score', descriptionNe: 'पूर्ण स्कोर पाउनुहोस्' },
  { category: 'attendance', action: 'present', baseXP: 5, description: 'Attend class', descriptionNe: 'कक्षामा उपस्थित' },
  { category: 'attendance', action: 'on_time', baseXP: 10, description: 'Arrive on time', descriptionNe: 'समयमा आउनुहोस्' },
  { category: 'attendance', action: 'streak_7', baseXP: 50, description: '7-day attendance streak', descriptionNe: '७ दिनको उपस्थिति स्ट्रिक' },
  { category: 'attendance', action: 'streak_30', baseXP: 200, description: '30-day attendance streak', descriptionNe: '३० दिनको उपस्थिति स्ट्रिक' },
  { category: 'quiz', action: 'complete', baseXP: 20, description: 'Complete a quiz', descriptionNe: 'क्विज पूरा गर्नुहोस्' },
  { category: 'quiz', action: 'top_3', baseXP: 50, description: 'Top 3 in quiz', descriptionNe: 'क्विजमा शीर्ष ३' },
  { category: 'participation', action: 'answer_question', baseXP: 10, description: 'Answer in class', descriptionNe: 'कक्षामा जवाफ दिनुहोस्' },
  { category: 'participation', action: 'help_peer', baseXP: 25, description: 'Help a classmate', descriptionNe: 'सहपाठीलाई मद्दत गर्नुहोस्' },
  { category: 'mood', action: 'check_in', baseXP: 10, description: 'Daily mood check-in', descriptionNe: 'दैनिक मूड चेक-इन' },
  { category: 'focus', action: 'complete_session', baseXP: 30, description: 'Complete focus session', descriptionNe: 'फोकस सत्र पूरा गर्नुहोस्' },
  { category: 'focus', action: 'streak_bonus', baseXP: 20, description: 'Focus streak bonus', descriptionNe: 'फोकस स्ट्रिक बोनस' },
  { category: 'squad', action: 'send_message', baseXP: 2, description: 'Send squad message', descriptionNe: 'स्क्वाड सन्देश पठाउनुहोस्' },
  { category: 'squad', action: 'receive_helpful', baseXP: 25, description: 'Message marked helpful', descriptionNe: 'सन्देश सहयोगी चिन्ह लगाइएको' },
];

// Level system
export interface LevelConfig {
  level: number;
  name: string;
  nameNe: string;
  minXP: number;
  maxXP: number;
  perks: string[];
  perksNe: string[];
  icon: string;
  color: string;
}

export const LEVEL_CONFIGS: LevelConfig[] = [
  { level: 1, name: 'Beginner', nameNe: 'शुरुआती', minXP: 0, maxXP: 99, perks: ['Basic avatar items'], perksNe: ['आधारभूत अवतार वस्तुहरू'], icon: '🌱', color: '#94a3b8' },
  { level: 2, name: 'Novice', nameNe: 'नौसिखिया', minXP: 100, maxXP: 249, perks: ['New hair styles'], perksNe: ['नयाँ केशविन्यास'], icon: '🌿', color: '#84cc16' },
  { level: 3, name: 'Learner', nameNe: 'सिकारु', minXP: 250, maxXP: 499, perks: ['Cool backgrounds'], perksNe: ['राम्रो पृष्ठभूमि'], icon: '📚', color: '#22c55e' },
  { level: 4, name: 'Apprentice', nameNe: 'शिष्य', minXP: 500, maxXP: 999, perks: ['Special outfits'], perksNe: ['विशेष पोशाक'], icon: '⭐', color: '#3b82f6' },
  { level: 5, name: 'Scholar', nameNe: 'विद्वान', minXP: 1000, maxXP: 1999, perks: ['Rare accessories'], perksNe: ['दुर्लभ सहायक उपकरण'], icon: '🎓', color: '#8b5cf6' },
  { level: 6, name: 'Expert', nameNe: 'विशेषज्ञ', minXP: 2000, maxXP: 3499, perks: ['Epic avatar items'], perksNe: ['महाकाव्य अवतार वस्तुहरू'], icon: '💎', color: '#a855f7' },
  { level: 7, name: 'Master', nameNe: 'गुरु', minXP: 3500, maxXP: 4999, perks: ['Master title'], perksNe: ['गुरु शीर्षक'], icon: '👑', color: '#ec4899' },
  { level: 8, name: 'Legend', nameNe: 'किंवदंती', minXP: 5000, maxXP: 7499, perks: ['Legendary items'], perksNe: ['पौराणिक वस्तुहरू'], icon: '🏆', color: '#f59e0b' },
  { level: 9, name: 'Champion', nameNe: 'च्याम्पियन', minXP: 7500, maxXP: 9999, perks: ['Champion frame'], perksNe: ['च्याम्पियन फ्रेम'], icon: '🌟', color: '#eab308' },
  { level: 10, name: 'Grandmaster', nameNe: 'महागुरु', minXP: 10000, maxXP: Infinity, perks: ['All items unlocked'], perksNe: ['सबै वस्तुहरू अनलक'], icon: '🔥', color: '#ef4444' },
];

// Streak system
export interface StreakConfig {
  type: StreakType;
  name: string;
  nameNe: string;
  description: string;
  descriptionNe: string;
  icon: string;
  milestones: StreakMilestone[];
}

export type StreakType = 'homework' | 'attendance' | 'reading' | 'login' | 'focus';

export interface StreakMilestone {
  days: number;
  reward: number;
  badge?: string;
}

export interface UserStreak {
  type: StreakType;
  currentCount: number;
  longestCount: number;
  lastUpdated: Date;
  startDate: Date;
}

// Achievement system
export interface Achievement {
  id: string;
  title: string;
  titleNe: string;
  description: string;
  descriptionNe: string;

  icon: string;
  category: AchievementCategory;
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';

  requirement: AchievementRequirement;
  xpReward: number;
  badgeReward?: string;

  hidden: boolean;
}

export type AchievementCategory =
  | 'academic'
  | 'social'
  | 'consistency'
  | 'exploration'
  | 'special';

export interface AchievementRequirement {
  type: string;
  target: number;
  metric: string;
}

export interface UserAchievement {
  achievementId: string;
  progress: number;
  completed: boolean;
  completedAt?: Date;
  notified: boolean;
}

// Avatar customization
export interface AvatarItem {
  id: string;
  name: string;
  nameNe: string;
  category: AvatarItemCategory;

  imageUrl: string;
  thumbnailUrl: string;

  rarity: BadgeRarity;
  unlockRequirement: AvatarUnlockRequirement;

  available: boolean;
}

export type AvatarItemCategory =
  | 'face'
  | 'skin'
  | 'hair'
  | 'eyes'
  | 'outfit'
  | 'accessory'
  | 'background'
  | 'special';

export interface AvatarUnlockRequirement {
  type: 'free' | 'level' | 'xp' | 'badge' | 'achievement';
  value?: number | string;
}

// Daily challenges
export interface DailyChallenge {
  id: string;
  date: Date;

  title: string;
  titleNe: string;
  description: string;
  descriptionNe: string;

  type: 'homework' | 'attendance' | 'quiz' | 'social' | 'focus';
  target: number;
  xpReward: number;

  icon: string;
}

export interface UserDailyChallengeProgress {
  challengeId: string;
  userId: string;
  progress: number;
  completed: boolean;
  completedAt?: Date;
}

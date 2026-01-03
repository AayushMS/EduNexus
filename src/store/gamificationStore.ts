import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Badge {
  id: string;
  name: string;
  nameNe: string;
  description: string;
  descriptionNe: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'academic' | 'attendance' | 'behavior' | 'participation' | 'special';
  earnedAt?: Date;
}

export interface Streak {
  type: 'homework' | 'attendance' | 'reading' | 'login';
  currentCount: number;
  longestCount: number;
  lastUpdated: Date;
}

export interface Achievement {
  id: string;
  title: string;
  titleNe: string;
  description: string;
  descriptionNe: string;
  progress: number;
  target: number;
  completed: boolean;
  completedAt?: Date;
}

interface GamificationState {
  xp: number;
  level: number;
  badges: Badge[];
  streaks: Streak[];
  achievements: Achievement[];

  // Actions
  addXP: (amount: number, reason?: string) => void;
  awardBadge: (badge: Badge) => void;
  updateStreak: (type: Streak['type'], increment: boolean) => void;
  updateAchievement: (id: string, progress: number) => void;
  resetGamification: () => void;
}

// XP required for each level (100 XP per level)
export const getXPForLevel = (level: number): number => level * 100;
export const getLevelFromXP = (xp: number): number => Math.floor(xp / 100) + 1;
export const getXPProgress = (xp: number): number => xp % 100;

// Level names based on XP
export const getLevelName = (level: number): { en: string; ne: string } => {
  if (level <= 5) return { en: 'Novice', ne: 'नौसिखिया' };
  if (level <= 10) return { en: 'Apprentice', ne: 'शिष्य' };
  if (level <= 20) return { en: 'Scholar', ne: 'विद्वान' };
  if (level <= 35) return { en: 'Expert', ne: 'विशेषज्ञ' };
  if (level <= 50) return { en: 'Master', ne: 'गुरु' };
  return { en: 'Legend', ne: 'किंवदंती' };
};

const initialState = {
  xp: 0,
  level: 1,
  badges: [] as Badge[],
  streaks: [
    { type: 'homework' as const, currentCount: 0, longestCount: 0, lastUpdated: new Date() },
    { type: 'attendance' as const, currentCount: 0, longestCount: 0, lastUpdated: new Date() },
    { type: 'reading' as const, currentCount: 0, longestCount: 0, lastUpdated: new Date() },
    { type: 'login' as const, currentCount: 0, longestCount: 0, lastUpdated: new Date() },
  ],
  achievements: [] as Achievement[],
};

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      ...initialState,

      addXP: (amount: number, _reason?: string) => {
        set((state) => {
          const newXP = state.xp + amount;
          const newLevel = getLevelFromXP(newXP);
          return {
            xp: newXP,
            level: newLevel,
          };
        });
      },

      awardBadge: (badge: Badge) => {
        set((state) => {
          // Don't add duplicate badges
          if (state.badges.some((b) => b.id === badge.id)) {
            return state;
          }
          return {
            badges: [...state.badges, { ...badge, earnedAt: new Date() }],
          };
        });
      },

      updateStreak: (type: Streak['type'], increment: boolean) => {
        set((state) => ({
          streaks: state.streaks.map((streak) => {
            if (streak.type !== type) return streak;

            const newCount = increment ? streak.currentCount + 1 : 0;
            return {
              ...streak,
              currentCount: newCount,
              longestCount: Math.max(streak.longestCount, newCount),
              lastUpdated: new Date(),
            };
          }),
        }));
      },

      updateAchievement: (id: string, progress: number) => {
        set((state) => ({
          achievements: state.achievements.map((achievement) => {
            if (achievement.id !== id) return achievement;

            const completed = progress >= achievement.target;
            return {
              ...achievement,
              progress,
              completed,
              completedAt: completed && !achievement.completed ? new Date() : achievement.completedAt,
            };
          }),
        }));
      },

      resetGamification: () => set(initialState),
    }),
    { name: 'edunexus-gamification' }
  )
);

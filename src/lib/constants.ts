/**
 * Application constants for EduNexus
 * Includes CDC-aligned subjects, grade levels, and configuration
 */

// Academic Year
export const CURRENT_ACADEMIC_YEAR = '2081'; // Nepali BS year

// Grade Levels
export const GRADE_LEVELS = {
  primary: [1, 2, 3, 4, 5],
  secondary: [6, 7, 8, 9, 10],
  higherSecondary: [11, 12],
  preschool: ['nursery', 'lkg', 'ukg'] as const,
};

// Sections per grade
export const SECTIONS = ['A', 'B', 'C', 'D'];

// Students per section
export const STUDENTS_PER_SECTION = 30;

// CDC-aligned subjects for Nepal curriculum
export interface SubjectConfig {
  id: string;
  name: string;
  nameNe: string;
  code: string;
  icon: string;
  color: string;
  category: 'core' | 'optional' | 'extra';
  grades: number[];
}

export const SUBJECTS: SubjectConfig[] = [
  // Primary Level (1-5)
  { id: 'nepali_primary', name: 'Nepali', nameNe: 'नेपाली', code: 'NEP', icon: '📖', color: '#ef4444', category: 'core', grades: [1, 2, 3, 4, 5] },
  { id: 'english_primary', name: 'English', nameNe: 'अंग्रेजी', code: 'ENG', icon: '🔤', color: '#3b82f6', category: 'core', grades: [1, 2, 3, 4, 5] },
  { id: 'math_primary', name: 'Mathematics', nameNe: 'गणित', code: 'MAT', icon: '🔢', color: '#22c55e', category: 'core', grades: [1, 2, 3, 4, 5] },
  { id: 'science_primary', name: 'Science', nameNe: 'विज्ञान', code: 'SCI', icon: '🔬', color: '#a855f7', category: 'core', grades: [1, 2, 3, 4, 5] },
  { id: 'social_primary', name: 'Social Studies', nameNe: 'सामाजिक अध्ययन', code: 'SOC', icon: '🌍', color: '#f59e0b', category: 'core', grades: [1, 2, 3, 4, 5] },
  { id: 'hpe_primary', name: 'Health & PE', nameNe: 'स्वास्थ्य र शारीरिक शिक्षा', code: 'HPE', icon: '🏃', color: '#ec4899', category: 'core', grades: [1, 2, 3, 4, 5] },
  { id: 'moral_primary', name: 'Moral Education', nameNe: 'नैतिक शिक्षा', code: 'MOR', icon: '🙏', color: '#6366f1', category: 'core', grades: [1, 2, 3, 4, 5] },

  // Secondary Level (6-10)
  { id: 'nepali_secondary', name: 'Nepali', nameNe: 'नेपाली', code: 'NEP', icon: '📖', color: '#ef4444', category: 'core', grades: [6, 7, 8, 9, 10] },
  { id: 'english_secondary', name: 'English', nameNe: 'अंग्रेजी', code: 'ENG', icon: '🔤', color: '#3b82f6', category: 'core', grades: [6, 7, 8, 9, 10] },
  { id: 'math_secondary', name: 'Mathematics', nameNe: 'गणित', code: 'MAT', icon: '🔢', color: '#22c55e', category: 'core', grades: [6, 7, 8, 9, 10] },
  { id: 'science_secondary', name: 'Science', nameNe: 'विज्ञान', code: 'SCI', icon: '🔬', color: '#a855f7', category: 'core', grades: [6, 7, 8, 9, 10] },
  { id: 'social_secondary', name: 'Social Studies', nameNe: 'सामाजिक अध्ययन', code: 'SOC', icon: '🌍', color: '#f59e0b', category: 'core', grades: [6, 7, 8, 9, 10] },
  { id: 'opt_math', name: 'Optional Mathematics', nameNe: 'ऐच्छिक गणित', code: 'OPT', icon: '📐', color: '#14b8a6', category: 'optional', grades: [9, 10] },
  { id: 'computer', name: 'Computer Science', nameNe: 'कम्प्युटर विज्ञान', code: 'COM', icon: '💻', color: '#8b5cf6', category: 'optional', grades: [6, 7, 8, 9, 10] },
  { id: 'account', name: 'Accountancy', nameNe: 'लेखा', code: 'ACC', icon: '📊', color: '#0ea5e9', category: 'optional', grades: [9, 10] },

  // Extra-curricular
  { id: 'art', name: 'Art', nameNe: 'कला', code: 'ART', icon: '🎨', color: '#f97316', category: 'extra', grades: [1, 2, 3, 4, 5, 6, 7, 8] },
  { id: 'music', name: 'Music', nameNe: 'संगीत', code: 'MUS', icon: '🎵', color: '#d946ef', category: 'extra', grades: [1, 2, 3, 4, 5, 6, 7, 8] },
];

// Helper to get subjects for a specific grade
export const getSubjectsForGrade = (grade: number): SubjectConfig[] => {
  return SUBJECTS.filter(subject => subject.grades.includes(grade));
};

// Nepali festivals and holidays (BS Calendar)
export interface Festival {
  name: string;
  nameNe: string;
  month: number;
  description: string;
  descriptionNe: string;
  isSchoolHoliday: boolean;
}

export const NEPALI_FESTIVALS: Festival[] = [
  { name: 'Dashain', nameNe: 'दशैं', month: 7, description: 'Biggest Hindu festival', descriptionNe: 'सबैभन्दा ठूलो हिन्दू चाड', isSchoolHoliday: true },
  { name: 'Tihar', nameNe: 'तिहार', month: 7, description: 'Festival of lights', descriptionNe: 'बत्तीको चाड', isSchoolHoliday: true },
  { name: 'Holi', nameNe: 'होली', month: 12, description: 'Festival of colors', descriptionNe: 'रंगको चाड', isSchoolHoliday: true },
  { name: 'Nepali New Year', nameNe: 'नेपाली नयाँ वर्ष', month: 1, description: 'Nepali New Year celebration', descriptionNe: 'नेपाली नयाँ वर्ष मनाउने', isSchoolHoliday: true },
  { name: 'Buddha Jayanti', nameNe: 'बुद्ध जयन्ती', month: 2, description: 'Birth of Buddha', descriptionNe: 'बुद्धको जन्म', isSchoolHoliday: true },
  { name: 'Teej', nameNe: 'तीज', month: 5, description: 'Festival for women', descriptionNe: 'महिलाहरूको चाड', isSchoolHoliday: true },
  { name: 'Chhath', nameNe: 'छठ', month: 8, description: 'Sun worship festival', descriptionNe: 'सूर्य पूजा चाड', isSchoolHoliday: true },
];

// School timing
export const SCHOOL_TIMING = {
  startTime: '10:00',
  endTime: '16:00',
  breakStart: '13:00',
  breakEnd: '13:30',
  periodDuration: 45, // minutes
  periods: 6,
};

// App configuration
export const APP_CONFIG = {
  name: 'EduNexus',
  tagline: {
    en: 'Experience Education, Reimagined',
    ne: 'शिक्षा, नयाँ तरिकाले',
  },
  currency: 'NPR',
  currencySymbol: 'रू.',
  defaultLocale: 'en' as const,
  supportedLocales: ['en', 'ne'] as const,
  xpPerLevel: 100,
  maxLevel: 100,
  streakMilestones: [7, 14, 30, 60, 90, 180, 365],
};

// Demo data configuration
export const DEMO_CONFIG = {
  studentsPerGrade: 150, // 5 sections x 30 students
  preschoolStudents: 30, // per class
  teachers: 20,
  parents: 100,
  activityFeedItems: 300,
  attendanceDays: 70,
  assignmentsPerSubject: 10,
};

// Color palette for gamification
export const GAMIFICATION_COLORS = {
  xp: {
    bar: '#8b5cf6',
    glow: '#a78bfa',
  },
  badges: {
    common: { border: '#94a3b8', glow: '#cbd5e1' },
    rare: { border: '#3b82f6', glow: '#60a5fa' },
    epic: { border: '#a855f7', glow: '#c084fc' },
    legendary: { border: '#eab308', glow: '#fde047' },
  },
  levels: {
    beginner: '#94a3b8',
    novice: '#84cc16',
    learner: '#22c55e',
    apprentice: '#3b82f6',
    scholar: '#8b5cf6',
    expert: '#a855f7',
    master: '#ec4899',
    legend: '#f59e0b',
    champion: '#eab308',
    grandmaster: '#ef4444',
  },
  streaks: {
    fire: '#f97316',
    ice: '#06b6d4',
    lightning: '#eab308',
  },
};

// Avatar configuration
export const AVATAR_CONFIG = {
  faces: ['happy', 'cool', 'curious', 'determined', 'peaceful'],
  skinTones: ['light', 'fair', 'medium', 'olive', 'tan', 'brown', 'dark'],
  hairStyles: ['short', 'medium', 'long', 'curly', 'braided', 'bun', 'mohawk'],
  hairColors: ['black', 'brown', 'blonde', 'red', 'blue', 'purple', 'green'],
  eyes: ['normal', 'big', 'sleepy', 'wink', 'glasses', 'sunglasses'],
  outfits: ['casual', 'formal', 'sporty', 'traditional', 'superhero', 'space'],
  accessories: ['none', 'hat', 'headband', 'flower', 'crown', 'scarf'],
  backgrounds: ['solid', 'gradient', 'pattern', 'nature', 'space', 'school'],
};

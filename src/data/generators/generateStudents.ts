/**
 * Student Data Generator for EduNexus Demo
 * Generates realistic Nepali student data with gamification profiles
 */

import { faker } from '@faker-js/faker';
import type { Student, AvatarConfig, StudentMood, EthnicGroup } from '@/types/user.types';
import { GRADE_LEVELS, SECTIONS, STUDENTS_PER_SECTION, CURRENT_ACADEMIC_YEAR, AVATAR_CONFIG } from '@/lib/constants';
import namesData from '../seeds/names.json';

// Get names from seed data
const maleNames = namesData.firstNames.male;
const femaleNames = namesData.firstNames.female;
const lastNames = namesData.lastNames;

interface NameData {
  en: string;
  ne: string;
  ethnicGroup: string;
}

function getRandomName(gender: 'male' | 'female'): { firstName: NameData; lastName: typeof lastNames[0] } {
  const firstNames = gender === 'male' ? maleNames : femaleNames;
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];

  // Try to match ethnic group for last name, fallback to random
  const matchingLastNames = lastNames.filter(ln => ln.ethnicGroup === firstName.ethnicGroup);
  const lastName = matchingLastNames.length > 0
    ? matchingLastNames[Math.floor(Math.random() * matchingLastNames.length)]
    : lastNames[Math.floor(Math.random() * lastNames.length)];

  return { firstName, lastName };
}

function generateAvatarConfig(): AvatarConfig {
  return {
    face: AVATAR_CONFIG.faces[Math.floor(Math.random() * AVATAR_CONFIG.faces.length)],
    skinTone: AVATAR_CONFIG.skinTones[Math.floor(Math.random() * AVATAR_CONFIG.skinTones.length)],
    hair: AVATAR_CONFIG.hairStyles[Math.floor(Math.random() * AVATAR_CONFIG.hairStyles.length)],
    hairColor: AVATAR_CONFIG.hairColors[Math.floor(Math.random() * AVATAR_CONFIG.hairColors.length)],
    eyes: AVATAR_CONFIG.eyes[Math.floor(Math.random() * AVATAR_CONFIG.eyes.length)],
    outfit: AVATAR_CONFIG.outfits[Math.floor(Math.random() * AVATAR_CONFIG.outfits.length)],
    outfitColor: faker.color.rgb(),
    accessory: Math.random() > 0.5 ? AVATAR_CONFIG.accessories[Math.floor(Math.random() * AVATAR_CONFIG.accessories.length)] : undefined,
    background: AVATAR_CONFIG.backgrounds[Math.floor(Math.random() * AVATAR_CONFIG.backgrounds.length)],
  };
}

function generateDateOfBirth(grade: number): Date {
  // Grade 1 students are typically 5-6 years old
  // Each grade adds ~1 year
  const baseAge = 5 + grade;
  const now = new Date();
  const birthYear = now.getFullYear() - baseAge - Math.floor(Math.random() * 2);
  const birthMonth = Math.floor(Math.random() * 12);
  const birthDay = Math.floor(Math.random() * 28) + 1;
  return new Date(birthYear, birthMonth, birthDay);
}

function generateXPAndLevel(): { xp: number; level: number } {
  // Random XP distribution - most students between 100-500 XP
  // Some high performers up to 2000+
  const rand = Math.random();
  let xp: number;

  if (rand < 0.1) {
    // 10% are beginners (0-100)
    xp = Math.floor(Math.random() * 100);
  } else if (rand < 0.6) {
    // 50% are intermediate (100-500)
    xp = 100 + Math.floor(Math.random() * 400);
  } else if (rand < 0.9) {
    // 30% are advanced (500-1500)
    xp = 500 + Math.floor(Math.random() * 1000);
  } else {
    // 10% are high performers (1500-3000)
    xp = 1500 + Math.floor(Math.random() * 1500);
  }

  const level = Math.floor(xp / 100) + 1;
  return { xp, level };
}

function generateStreaks(): Student['streaks'] {
  return {
    homework: Math.floor(Math.random() * 15),
    attendance: Math.floor(Math.random() * 30),
    reading: Math.floor(Math.random() * 10),
    login: Math.floor(Math.random() * 20),
  };
}

function generateBadges(): string[] {
  const allBadges = [
    'early_bird', 'perfect_week', 'homework_hero', 'bookworm',
    'helpful_hand', 'focus_champion', 'mood_tracker', 'first_steps',
    'first_login', 'avatar_customizer'
  ];

  // Students have 2-6 badges typically
  const numBadges = 2 + Math.floor(Math.random() * 5);
  const shuffled = [...allBadges].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, numBadges);
}

function generateMoodHistory(studentId: string): StudentMood[] {
  const moods: Array<StudentMood['mood']> = ['happy', 'neutral', 'sad', 'tired', 'stressed'];
  const history: StudentMood[] = [];
  const numEntries = 5 + Math.floor(Math.random() * 10);

  for (let i = 0; i < numEntries; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    history.push({
      id: `mood-${studentId}-${i}`,
      studentId,
      mood: moods[Math.floor(Math.random() * moods.length)],
      reason: Math.random() > 0.5 ? 'Just checking in' : undefined,
      timestamp: date,
      xpEarned: 10,
    });
  }

  return history;
}

export function generateStudent(grade: number, section: string, rollNumber: number): Student {
  const gender: 'male' | 'female' = Math.random() > 0.5 ? 'male' : 'female';
  const { firstName, lastName } = getRandomName(gender);

  const id = `STU-${grade}${section}-${String(rollNumber).padStart(3, '0')}`;
  const classId = `CLS-${grade}${section}`;

  const { xp, level } = generateXPAndLevel();
  const moodHistory = generateMoodHistory(id);

  const student: Student = {
    id,
    name: `${firstName.en} ${lastName.en}`,
    nameNe: `${firstName.ne} ${lastName.ne}`,
    email: `${firstName.en.toLowerCase()}.${lastName.en.toLowerCase()}@student.edunexus.np`,
    phone: `98${faker.string.numeric(8)}`,
    avatarUrl: undefined,
    role: 'student',
    createdAt: faker.date.past({ years: 2 }),
    updatedAt: new Date(),

    // Student-specific fields
    grade,
    section,
    rollNumber,
    dateOfBirth: generateDateOfBirth(grade),
    gender,
    bloodGroup: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'][Math.floor(Math.random() * 8)],
    address: faker.location.streetAddress(),
    addressNe: 'काठमाडौं, नेपाल',
    parentIds: [`PAR-${id}`],

    // Academic
    classId,
    academicYear: CURRENT_ACADEMIC_YEAR,
    admissionDate: faker.date.past({ years: grade }),

    // Gamification
    xp,
    level,
    badges: generateBadges(),
    avatarConfig: generateAvatarConfig(),
    streaks: generateStreaks(),

    // Mood
    currentMood: moodHistory[0],
    moodHistory,
  };

  return student;
}

export function generateAllStudents(): Student[] {
  const students: Student[] = [];

  // Generate students for primary and secondary grades
  for (const grade of [...GRADE_LEVELS.primary, ...GRADE_LEVELS.secondary]) {
    // Use 2 sections per grade for demo
    const sectionsToUse = SECTIONS.slice(0, 2);

    for (const section of sectionsToUse) {
      // 25 students per section for demo
      const studentsPerSection = Math.min(STUDENTS_PER_SECTION, 25);

      for (let roll = 1; roll <= studentsPerSection; roll++) {
        students.push(generateStudent(grade, section, roll));
      }
    }
  }

  return students;
}

export function generateStudentsByGrade(grade: number, count: number = 30): Student[] {
  const students: Student[] = [];
  const section = 'A';

  for (let roll = 1; roll <= count; roll++) {
    students.push(generateStudent(grade, section, roll));
  }

  return students;
}

// Export a pre-generated set for demo
export const demoStudents = generateAllStudents();

/**
 * Parent Data Generator for EduNexus Demo
 * Generates realistic parent profiles linked to students
 */

import { faker } from '@faker-js/faker';
import type { Parent, Student } from '@/types/user.types';
import namesData from '../seeds/names.json';

const maleNames = namesData.firstNames.male;
const femaleNames = namesData.firstNames.female;
const lastNames = namesData.lastNames;
const occupations = namesData.occupations;

interface NameData {
  en: string;
  ne: string;
  ethnicGroup: string;
}

function getRandomName(gender: 'male' | 'female'): { firstName: NameData; lastName: typeof lastNames[0] } {
  const firstNames = gender === 'male' ? maleNames : femaleNames;
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return { firstName, lastName };
}

function getRandomOccupation(): typeof occupations[0] {
  return occupations[Math.floor(Math.random() * occupations.length)];
}

function generateEngagementLevel(): { score: number; level: Parent['engagementLevel']; xp: number } {
  const rand = Math.random();
  let score: number;
  let level: Parent['engagementLevel'];
  let xp: number;

  if (rand < 0.2) {
    // 20% bronze (low engagement)
    score = Math.floor(Math.random() * 25);
    level = 'bronze';
    xp = Math.floor(Math.random() * 100);
  } else if (rand < 0.5) {
    // 30% silver (moderate engagement)
    score = 25 + Math.floor(Math.random() * 25);
    level = 'silver';
    xp = 100 + Math.floor(Math.random() * 200);
  } else if (rand < 0.8) {
    // 30% gold (good engagement)
    score = 50 + Math.floor(Math.random() * 25);
    level = 'gold';
    xp = 300 + Math.floor(Math.random() * 300);
  } else {
    // 20% platinum (excellent engagement)
    score = 75 + Math.floor(Math.random() * 25);
    level = 'platinum';
    xp = 600 + Math.floor(Math.random() * 400);
  }

  return { score, level, xp };
}

function generateParentBadges(level: Parent['engagementLevel']): string[] {
  const badges: string[] = ['first_login'];

  if (level === 'silver' || level === 'gold' || level === 'platinum') {
    badges.push('helpful_hand');
  }
  if (level === 'gold' || level === 'platinum') {
    badges.push('team_player');
  }
  if (level === 'platinum') {
    badges.push('super_parent');
  }

  return badges;
}

export function generateParent(student: Student, relationship: 'father' | 'mother'): Parent {
  const gender = relationship === 'father' ? 'male' : 'female';
  const { firstName } = getRandomName(gender);

  // Parent should share last name with student (usually)
  const studentLastName = student.name.split(' ').pop() || '';
  const studentLastNameNe = student.nameNe.split(' ').pop() || '';

  const occupation = getRandomOccupation();
  const { score, level, xp } = generateEngagementLevel();

  const id = `PAR-${student.id}-${relationship}`;

  const parent: Parent = {
    id,
    name: `${firstName.en} ${studentLastName}`,
    nameNe: `${firstName.ne} ${studentLastNameNe}`,
    email: `${firstName.en.toLowerCase()}.${studentLastName.toLowerCase()}@gmail.com`,
    phone: `98${faker.string.numeric(8)}`,
    avatarUrl: undefined,
    role: 'parent',
    createdAt: faker.date.past({ years: 2 }),
    updatedAt: new Date(),

    // Parent-specific
    occupation: occupation.en,
    occupationNe: occupation.ne,
    childrenIds: [student.id],
    engagementScore: score,
    engagementLevel: level,
    xp,
    badges: generateParentBadges(level),
    lastActiveAt: faker.date.recent({ days: 7 }),
  };

  return parent;
}

export function generateParentsForStudents(students: Student[]): Parent[] {
  const parents: Parent[] = [];
  const processedStudents = new Set<string>();

  for (const student of students) {
    if (processedStudents.has(student.id)) continue;
    processedStudents.add(student.id);

    // Most students have both parents registered, some just one
    const hasBothParents = Math.random() > 0.2;

    // Always generate at least one parent
    const primaryParent = generateParent(student, Math.random() > 0.5 ? 'father' : 'mother');
    parents.push(primaryParent);

    if (hasBothParents) {
      const secondaryRelation = primaryParent.name.includes('father') ? 'mother' : 'father';
      const secondaryParent = generateParent(student, secondaryRelation as 'father' | 'mother');
      parents.push(secondaryParent);
    }

    // Some parents have multiple children in school
    if (Math.random() > 0.7) {
      // Find another student to link (sibling)
      const siblingCandidate = students.find(s =>
        !processedStudents.has(s.id) &&
        Math.abs(s.grade - student.grade) <= 3
      );

      if (siblingCandidate) {
        processedStudents.add(siblingCandidate.id);
        // Add sibling to parent's children
        primaryParent.childrenIds.push(siblingCandidate.id);
      }
    }
  }

  return parents;
}

// Demo parents for quick access
export function generateDemoParents(): Parent[] {
  // Generate a few sample parents for demo
  const demoParents: Parent[] = [];

  // High-engagement parent
  const highEngagement: Parent = {
    id: 'PAR-DEMO-001',
    name: 'Ramesh Sharma',
    nameNe: 'रमेश शर्मा',
    email: 'ramesh.sharma@gmail.com',
    phone: '9841234567',
    role: 'parent',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date(),
    occupation: 'Government Officer',
    occupationNe: 'सरकारी अधिकृत',
    childrenIds: ['STU-5A-001', 'STU-3A-015'],
    engagementScore: 85,
    engagementLevel: 'platinum',
    xp: 850,
    badges: ['first_login', 'helpful_hand', 'team_player', 'super_parent'],
    lastActiveAt: new Date(),
  };
  demoParents.push(highEngagement);

  // Medium-engagement parent
  const mediumEngagement: Parent = {
    id: 'PAR-DEMO-002',
    name: 'Sita Thapa',
    nameNe: 'सीता थापा',
    email: 'sita.thapa@gmail.com',
    phone: '9851234567',
    role: 'parent',
    createdAt: new Date('2023-03-20'),
    updatedAt: new Date(),
    occupation: 'Teacher',
    occupationNe: 'शिक्षक',
    childrenIds: ['STU-7A-010'],
    engagementScore: 55,
    engagementLevel: 'gold',
    xp: 420,
    badges: ['first_login', 'helpful_hand', 'team_player'],
    lastActiveAt: faker.date.recent({ days: 3 }),
  };
  demoParents.push(mediumEngagement);

  // Low-engagement parent
  const lowEngagement: Parent = {
    id: 'PAR-DEMO-003',
    name: 'Gopal Chaudhary',
    nameNe: 'गोपाल चौधरी',
    email: 'gopal.chaudhary@gmail.com',
    phone: '9861234567',
    role: 'parent',
    createdAt: new Date('2023-06-10'),
    updatedAt: new Date(),
    occupation: 'Farmer',
    occupationNe: 'किसान',
    childrenIds: ['STU-4A-020'],
    engagementScore: 20,
    engagementLevel: 'bronze',
    xp: 80,
    badges: ['first_login'],
    lastActiveAt: faker.date.recent({ days: 14 }),
  };
  demoParents.push(lowEngagement);

  return demoParents;
}

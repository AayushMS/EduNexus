/**
 * Teacher Data Generator for EduNexus Demo
 * Generates realistic teacher profiles with class assignments
 */

import { faker } from '@faker-js/faker';
import type { Teacher, ClassAssignment } from '@/types/user.types';
import { SUBJECTS, GRADE_LEVELS, SECTIONS } from '@/lib/constants';
import namesData from '../seeds/names.json';

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
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return { firstName, lastName };
}

const QUALIFICATIONS = [
  { en: 'B.Ed.', ne: 'बी.एड.' },
  { en: 'M.Ed.', ne: 'एम.एड.' },
  { en: 'B.A., B.Ed.', ne: 'बी.ए., बी.एड.' },
  { en: 'M.A., M.Ed.', ne: 'एम.ए., एम.एड.' },
  { en: 'B.Sc., B.Ed.', ne: 'बी.एससी., बी.एड.' },
  { en: 'M.Sc., M.Ed.', ne: 'एम.एससी., एम.एड.' },
];

const DEPARTMENTS = [
  { en: 'Primary', ne: 'प्राथमिक' },
  { en: 'Secondary', ne: 'माध्यमिक' },
  { en: 'Science', ne: 'विज्ञान' },
  { en: 'Mathematics', ne: 'गणित' },
  { en: 'Languages', ne: 'भाषा' },
  { en: 'Social Studies', ne: 'सामाजिक अध्ययन' },
];

function generateClassAssignments(subjectIds: string[], isPrimary: boolean): ClassAssignment[] {
  const assignments: ClassAssignment[] = [];
  const grades = isPrimary ? GRADE_LEVELS.primary : GRADE_LEVELS.secondary;

  // Teacher typically teaches 3-5 classes
  const numClasses = 3 + Math.floor(Math.random() * 3);
  const usedClasses = new Set<string>();

  for (let i = 0; i < numClasses; i++) {
    const grade = grades[Math.floor(Math.random() * grades.length)];
    const section = SECTIONS[Math.floor(Math.random() * 2)]; // Use first 2 sections
    const classKey = `${grade}${section}`;

    if (usedClasses.has(classKey)) continue;
    usedClasses.add(classKey);

    const subjectId = subjectIds[Math.floor(Math.random() * subjectIds.length)];
    const subject = SUBJECTS.find(s => s.id === subjectId);

    if (subject) {
      assignments.push({
        classId: `CLS-${grade}${section}`,
        grade,
        section,
        subject: subject.name,
        subjectNe: subject.nameNe,
      });
    }
  }

  return assignments;
}

export function generateTeacher(index: number): Teacher {
  const gender: 'male' | 'female' = Math.random() > 0.4 ? 'female' : 'male'; // Slight female majority in teaching
  const { firstName, lastName } = getRandomName(gender);

  const id = `TCH-${String(index).padStart(3, '0')}`;

  // Determine primary or secondary focus
  const isPrimary = Math.random() > 0.4;
  const relevantGrades = isPrimary ? GRADE_LEVELS.primary : GRADE_LEVELS.secondary;

  // Filter subjects for the grade level
  const relevantSubjects = SUBJECTS.filter(s =>
    s.grades.some(g => relevantGrades.includes(g))
  );

  // Teacher specializes in 1-2 subjects
  const numSubjects = 1 + Math.floor(Math.random() * 2);
  const shuffledSubjects = [...relevantSubjects].sort(() => Math.random() - 0.5);
  const teacherSubjects = shuffledSubjects.slice(0, numSubjects);

  const department = isPrimary
    ? DEPARTMENTS[0]
    : DEPARTMENTS[Math.floor(Math.random() * (DEPARTMENTS.length - 1)) + 1];

  const qualification = QUALIFICATIONS[Math.floor(Math.random() * QUALIFICATIONS.length)];

  // Is class teacher?
  const isClassTeacher = Math.random() > 0.5;
  let classTeacherOf: string | undefined;

  if (isClassTeacher) {
    const grade = relevantGrades[Math.floor(Math.random() * relevantGrades.length)];
    const section = SECTIONS[Math.floor(Math.random() * 2)];
    classTeacherOf = `CLS-${grade}${section}`;
  }

  const teacher: Teacher = {
    id,
    name: `${firstName.en} ${lastName.en}`,
    nameNe: `${firstName.ne} ${lastName.ne}`,
    email: `${firstName.en.toLowerCase()}.${lastName.en.toLowerCase()}@edunexus.edu.np`,
    phone: `98${faker.string.numeric(8)}`,
    avatarUrl: undefined,
    role: 'teacher',
    createdAt: faker.date.past({ years: 5 }),
    updatedAt: new Date(),

    // Teacher-specific
    employeeId: `EMP-${String(index).padStart(4, '0')}`,
    department: department.en,
    departmentNe: department.ne,
    subjects: teacherSubjects.map(s => s.name),
    subjectsNe: teacherSubjects.map(s => s.nameNe),
    classes: generateClassAssignments(teacherSubjects.map(s => s.id), isPrimary),
    qualification: qualification.en,
    qualificationNe: qualification.ne,
    joinDate: faker.date.past({ years: 10 }),
    isClassTeacher,
    classTeacherOf,
  };

  return teacher;
}

export function generateAllTeachers(count: number = 20): Teacher[] {
  const teachers: Teacher[] = [];

  for (let i = 1; i <= count; i++) {
    teachers.push(generateTeacher(i));
  }

  return teachers;
}

// Demo teachers for quick access
export function generateDemoTeachers(): Teacher[] {
  return [
    {
      id: 'TCH-DEMO-001',
      name: 'Sita Thapa',
      nameNe: 'सीता थापा',
      email: 'sita.thapa@edunexus.edu.np',
      phone: '9841000001',
      role: 'teacher',
      createdAt: new Date('2018-04-15'),
      updatedAt: new Date(),
      employeeId: 'EMP-0001',
      department: 'Primary',
      departmentNe: 'प्राथमिक',
      subjects: ['Nepali', 'English'],
      subjectsNe: ['नेपाली', 'अंग्रेजी'],
      classes: [
        { classId: 'CLS-5A', grade: 5, section: 'A', subject: 'Nepali', subjectNe: 'नेपाली' },
        { classId: 'CLS-5B', grade: 5, section: 'B', subject: 'Nepali', subjectNe: 'नेपाली' },
        { classId: 'CLS-4A', grade: 4, section: 'A', subject: 'English', subjectNe: 'अंग्रेजी' },
      ],
      qualification: 'M.A., M.Ed.',
      qualificationNe: 'एम.ए., एम.एड.',
      joinDate: new Date('2018-04-15'),
      isClassTeacher: true,
      classTeacherOf: 'CLS-5A',
    },
    {
      id: 'TCH-DEMO-002',
      name: 'Bikram Gurung',
      nameNe: 'बिक्रम गुरुङ',
      email: 'bikram.gurung@edunexus.edu.np',
      phone: '9841000002',
      role: 'teacher',
      createdAt: new Date('2015-08-01'),
      updatedAt: new Date(),
      employeeId: 'EMP-0002',
      department: 'Science',
      departmentNe: 'विज्ञान',
      subjects: ['Science', 'Mathematics'],
      subjectsNe: ['विज्ञान', 'गणित'],
      classes: [
        { classId: 'CLS-8A', grade: 8, section: 'A', subject: 'Science', subjectNe: 'विज्ञान' },
        { classId: 'CLS-8B', grade: 8, section: 'B', subject: 'Science', subjectNe: 'विज्ञान' },
        { classId: 'CLS-9A', grade: 9, section: 'A', subject: 'Mathematics', subjectNe: 'गणित' },
      ],
      qualification: 'M.Sc., M.Ed.',
      qualificationNe: 'एम.एससी., एम.एड.',
      joinDate: new Date('2015-08-01'),
      isClassTeacher: true,
      classTeacherOf: 'CLS-8A',
    },
    {
      id: 'TCH-DEMO-003',
      name: 'Maya Gurung',
      nameNe: 'माया गुरुङ',
      email: 'maya.gurung@edunexus.edu.np',
      phone: '9841000003',
      role: 'teacher',
      createdAt: new Date('2020-01-10'),
      updatedAt: new Date(),
      employeeId: 'EMP-0003',
      department: 'Social Studies',
      departmentNe: 'सामाजिक अध्ययन',
      subjects: ['Social Studies'],
      subjectsNe: ['सामाजिक अध्ययन'],
      classes: [
        { classId: 'CLS-6A', grade: 6, section: 'A', subject: 'Social Studies', subjectNe: 'सामाजिक अध्ययन' },
        { classId: 'CLS-7A', grade: 7, section: 'A', subject: 'Social Studies', subjectNe: 'सामाजिक अध्ययन' },
      ],
      qualification: 'M.A., M.Ed.',
      qualificationNe: 'एम.ए., एम.एड.',
      joinDate: new Date('2020-01-10'),
      isClassTeacher: false,
    },
  ];
}

export const demoTeachers = generateDemoTeachers();

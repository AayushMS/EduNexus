/**
 * User-related type definitions for EduNexus
 */

export type UserRole = 'parent' | 'student' | 'teacher' | 'preschool';

export interface BilingualText {
  en: string;
  ne: string;
}

export interface BaseUser {
  id: string;
  name: string;
  nameNe: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Parent extends BaseUser {
  role: 'parent';
  occupation?: string;
  occupationNe?: string;
  childrenIds: string[];
  engagementScore: number;
  engagementLevel: 'bronze' | 'silver' | 'gold' | 'platinum';
  xp: number;
  badges: string[];
  lastActiveAt: Date;
}

export interface Student extends BaseUser {
  role: 'student';
  grade: number;
  section: string;
  rollNumber: number;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  bloodGroup?: string;
  address?: string;
  addressNe?: string;
  parentIds: string[];

  // Academic
  classId: string;
  academicYear: string;
  admissionDate: Date;

  // Gamification
  xp: number;
  level: number;
  badges: string[];
  avatarConfig: AvatarConfig;
  streaks: {
    homework: number;
    attendance: number;
    reading: number;
    login: number;
  };

  // Mood tracking
  currentMood?: StudentMood;
  moodHistory: StudentMood[];
}

export interface Teacher extends BaseUser {
  role: 'teacher';
  employeeId: string;
  department: string;
  departmentNe: string;
  subjects: string[];
  subjectsNe: string[];
  classes: ClassAssignment[];
  qualification: string;
  qualificationNe: string;
  joinDate: Date;
  isClassTeacher: boolean;
  classTeacherOf?: string; // classId
}

export interface PreschoolTeacher extends BaseUser {
  role: 'preschool';
  employeeId: string;
  classId: string;
  className: string;
  classNameNe: string;
  specialization?: string;
  specializationNe?: string;
  joinDate: Date;
  childrenCount: number;
}

// Supporting types

export interface AvatarConfig {
  face: string;
  skinTone: string;
  hair: string;
  hairColor: string;
  eyes: string;
  outfit: string;
  outfitColor: string;
  accessory?: string;
  background: string;
}

export interface StudentMood {
  id: string;
  studentId: string;
  mood: 'happy' | 'neutral' | 'sad' | 'tired' | 'stressed';
  reason?: string;
  timestamp: Date;
  xpEarned: number;
}

export interface ClassAssignment {
  classId: string;
  grade: number;
  section: string;
  subject: string;
  subjectNe: string;
}

export interface Class {
  id: string;
  grade: number;
  section: string;
  academicYear: string;
  classTeacherId?: string;
  studentCount: number;
  createdAt: Date;
}

// Nepali ethnic groups for diverse name generation
export type EthnicGroup =
  | 'brahmin_chhetri'
  | 'newar'
  | 'tamang'
  | 'magar'
  | 'tharu'
  | 'rai'
  | 'gurung'
  | 'limbu'
  | 'sherpa'
  | 'other';

export interface NameEntry {
  firstName: string;
  firstNameNe: string;
  lastName: string;
  lastNameNe: string;
  gender: 'male' | 'female';
  ethnicGroup: EthnicGroup;
}

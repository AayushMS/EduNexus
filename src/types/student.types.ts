/**
 * Student-specific type definitions for EduNexus
 */

import type { BilingualText } from './user.types';

// Academic types
export interface Subject {
  id: string;
  name: string;
  nameNe: string;
  code: string;
  category: 'core' | 'optional' | 'extra';
  creditHours: number;
  icon: string;
  color: string;
}

export interface Assignment {
  id: string;
  title: string;
  titleNe: string;
  description: string;
  descriptionNe: string;
  subjectId: string;
  classId: string;
  teacherId: string;

  dueDate: Date;
  createdAt: Date;

  type: 'homework' | 'project' | 'classwork' | 'quiz';
  maxScore: number;
  xpReward: number;

  attachments?: Attachment[];
  instructions?: string;
  instructionsNe?: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;

  submittedAt: Date;
  status: 'pending' | 'submitted' | 'late' | 'graded';

  // Submission content
  type: 'photo' | 'file' | 'text' | 'audio' | 'video' | 'link';
  content: string; // URL or text content
  attachments: Attachment[];
  studentNote?: string;

  // Grading
  score?: number;
  feedback?: string;
  feedbackNe?: string;
  gradedAt?: Date;
  gradedBy?: string;
  xpEarned?: number;
}

export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'doc' | 'audio' | 'video' | 'other';
  url: string;
  size: number;
  uploadedAt: Date;
}

// Attendance types
export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  date: Date;
  status: 'present' | 'absent' | 'late' | 'excused';
  mood?: 'happy' | 'neutral' | 'sad' | 'tired' | 'stressed';
  markedBy: string;
  markedAt: Date;
  note?: string;
}

export interface AttendanceSummary {
  studentId: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  excusedDays: number;
  attendancePercentage: number;
  currentStreak: number;
  longestStreak: number;
}

// Grade types
export interface GradeEntry {
  id: string;
  studentId: string;
  subjectId: string;
  assessmentId: string;

  score: number;
  maxScore: number;
  percentage: number;
  grade: CDCGrade;
  gpa: number;

  remarks?: string;
  remarksNe?: string;
  enteredBy: string;
  enteredAt: Date;
}

// CDC Nepal grading system
export type CDCGrade = 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D+' | 'D' | 'E' | 'NG';

export interface GradeScale {
  grade: CDCGrade;
  minPercentage: number;
  maxPercentage: number;
  gpa: number;
  description: string;
  descriptionNe: string;
}

export const CDC_GRADE_SCALE: GradeScale[] = [
  { grade: 'A+', minPercentage: 90, maxPercentage: 100, gpa: 4.0, description: 'Outstanding', descriptionNe: 'उत्कृष्ट' },
  { grade: 'A', minPercentage: 80, maxPercentage: 89, gpa: 3.6, description: 'Excellent', descriptionNe: 'उत्तम' },
  { grade: 'B+', minPercentage: 70, maxPercentage: 79, gpa: 3.2, description: 'Very Good', descriptionNe: 'धेरै राम्रो' },
  { grade: 'B', minPercentage: 60, maxPercentage: 69, gpa: 2.8, description: 'Good', descriptionNe: 'राम्रो' },
  { grade: 'C+', minPercentage: 50, maxPercentage: 59, gpa: 2.4, description: 'Satisfactory', descriptionNe: 'सन्तोषजनक' },
  { grade: 'C', minPercentage: 40, maxPercentage: 49, gpa: 2.0, description: 'Acceptable', descriptionNe: 'स्वीकार्य' },
  { grade: 'D+', minPercentage: 30, maxPercentage: 39, gpa: 1.6, description: 'Partially Acceptable', descriptionNe: 'आंशिक स्वीकार्य' },
  { grade: 'D', minPercentage: 20, maxPercentage: 29, gpa: 1.2, description: 'Insufficient', descriptionNe: 'अपर्याप्त' },
  { grade: 'E', minPercentage: 1, maxPercentage: 19, gpa: 0.8, description: 'Very Insufficient', descriptionNe: 'धेरै अपर्याप्त' },
  { grade: 'NG', minPercentage: 0, maxPercentage: 0, gpa: 0.0, description: 'Not Graded', descriptionNe: 'ग्रेड नगरिएको' },
];

// Study Squad types
export interface StudySquad {
  id: string;
  name: string;
  nameNe: string;
  description: string;
  descriptionNe: string;

  creatorId: string;
  memberIds: string[];
  maxMembers: number;

  subjectFocus?: string;
  isPublic: boolean;

  createdAt: Date;
  lastActivityAt: Date;
}

export interface SquadMessage {
  id: string;
  squadId: string;
  senderId: string;
  senderName: string;

  content: string;
  attachments?: Attachment[];

  reactions: MessageReaction[];
  helperXpAwarded: boolean;

  createdAt: Date;
}

export interface MessageReaction {
  userId: string;
  type: 'like' | 'helpful' | 'thanks';
  timestamp: Date;
}

// Focus Mode types
export interface FocusSession {
  id: string;
  studentId: string;

  activity: string;
  activityNe: string;
  duration: number; // in minutes
  targetDuration: number;

  startedAt: Date;
  endedAt?: Date;
  completed: boolean;

  xpEarned: number;
  streakMaintained: boolean;
}

// Leaderboard types
export interface LeaderboardEntry {
  rank: number;
  studentId: string;
  studentName: string;
  studentNameNe: string;
  avatarUrl?: string;

  score: number;
  change: number; // position change from previous period

  category: LeaderboardCategory;
}

export type LeaderboardCategory =
  | 'overall_xp'
  | 'most_improved'
  | 'top_effort'
  | 'attendance_champion'
  | 'homework_hero'
  | 'quiz_master';

export interface LeaderboardFilter {
  category: LeaderboardCategory;
  period: 'weekly' | 'monthly' | 'term' | 'year';
  classId?: string;
  grade?: number;
}

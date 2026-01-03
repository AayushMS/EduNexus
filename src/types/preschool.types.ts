/**
 * Pre-school specific type definitions for EduNexus
 * Based on Nepal Early Learning Development Standards (ELDS)
 */

import type { BilingualText } from './user.types';

// Child profile for pre-school
export interface PreschoolChild {
  id: string;
  name: string;
  nameNe: string;
  dateOfBirth: Date;
  age: number; // in months
  gender: 'male' | 'female';
  avatarUrl?: string;

  classId: string;
  className: PreschoolClassName;
  classNameNe: string;

  parentIds: string[];
  emergencyContact: string;

  enrollmentDate: Date;
  academicYear: string;

  // Health info
  bloodGroup?: string;
  allergies?: string[];
  specialNeeds?: string;

  // Development scores (0-100)
  developmentScores: DevelopmentScores;
  lastAssessmentDate?: Date;
}

export type PreschoolClassName = 'nursery' | 'lkg' | 'ukg';

export const PRESCHOOL_CLASSES: Record<PreschoolClassName, { en: string; ne: string; ageRange: string }> = {
  nursery: { en: 'Nursery', ne: 'नर्सरी', ageRange: '2-3 years' },
  lkg: { en: 'LKG', ne: 'एल.के.जी.', ageRange: '3-4 years' },
  ukg: { en: 'UKG', ne: 'यू.के.जी.', ageRange: '4-5 years' },
};

// Development Domains (based on Nepal ELDS)
export type DevelopmentDomain =
  | 'physical'
  | 'cognitive'
  | 'social'
  | 'emotional'
  | 'language';

export interface DevelopmentScores {
  physical: number;
  cognitive: number;
  social: number;
  emotional: number;
  language: number;
  overall: number;
}

export const DEVELOPMENT_DOMAINS: Record<DevelopmentDomain, DomainConfig> = {
  physical: {
    name: 'Physical Development',
    nameNe: 'शारीरिक विकास',
    description: 'Gross motor, fine motor, and coordination skills',
    descriptionNe: 'ठूलो मोटर, साना मोटर, र समन्वय सीपहरू',
    color: '#ef4444',
    icon: '🏃',
    subAreas: [
      { id: 'gross_motor', name: 'Gross Motor', nameNe: 'ठूलो मोटर' },
      { id: 'fine_motor', name: 'Fine Motor', nameNe: 'साना मोटर' },
      { id: 'coordination', name: 'Coordination', nameNe: 'समन्वय' },
      { id: 'self_care', name: 'Self Care', nameNe: 'आत्म-हेरचाह' },
    ],
  },
  cognitive: {
    name: 'Cognitive Development',
    nameNe: 'संज्ञानात्मक विकास',
    description: 'Problem solving, memory, and logical thinking',
    descriptionNe: 'समस्या समाधान, स्मृति, र तार्किक सोच',
    color: '#3b82f6',
    icon: '🧠',
    subAreas: [
      { id: 'problem_solving', name: 'Problem Solving', nameNe: 'समस्या समाधान' },
      { id: 'memory', name: 'Memory', nameNe: 'स्मृति' },
      { id: 'logical_thinking', name: 'Logical Thinking', nameNe: 'तार्किक सोच' },
      { id: 'creativity', name: 'Creativity', nameNe: 'सृजनात्मकता' },
    ],
  },
  social: {
    name: 'Social Development',
    nameNe: 'सामाजिक विकास',
    description: 'Interaction with peers and adults',
    descriptionNe: 'साथीहरू र वयस्कहरूसँग अन्तरक्रिया',
    color: '#22c55e',
    icon: '👥',
    subAreas: [
      { id: 'peer_interaction', name: 'Peer Interaction', nameNe: 'साथी अन्तरक्रिया' },
      { id: 'adult_interaction', name: 'Adult Interaction', nameNe: 'वयस्क अन्तरक्रिया' },
      { id: 'sharing', name: 'Sharing & Cooperation', nameNe: 'साझेदारी र सहयोग' },
      { id: 'following_rules', name: 'Following Rules', nameNe: 'नियम पालना' },
    ],
  },
  emotional: {
    name: 'Emotional Development',
    nameNe: 'भावनात्मक विकास',
    description: 'Understanding and expressing emotions',
    descriptionNe: 'भावनाहरू बुझ्ने र व्यक्त गर्ने',
    color: '#eab308',
    icon: '❤️',
    subAreas: [
      { id: 'self_awareness', name: 'Self Awareness', nameNe: 'आत्म-जागरूकता' },
      { id: 'emotion_regulation', name: 'Emotion Regulation', nameNe: 'भावना नियन्त्रण' },
      { id: 'empathy', name: 'Empathy', nameNe: 'समानुभूति' },
      { id: 'confidence', name: 'Confidence', nameNe: 'आत्मविश्वास' },
    ],
  },
  language: {
    name: 'Language Development',
    nameNe: 'भाषा विकास',
    description: 'Communication, vocabulary, and early literacy',
    descriptionNe: 'सञ्चार, शब्दावली, र प्रारम्भिक साक्षरता',
    color: '#a855f7',
    icon: '💬',
    subAreas: [
      { id: 'vocabulary', name: 'Vocabulary', nameNe: 'शब्दावली' },
      { id: 'expression', name: 'Expression', nameNe: 'अभिव्यक्ति' },
      { id: 'comprehension', name: 'Comprehension', nameNe: 'बुझाइ' },
      { id: 'early_literacy', name: 'Early Literacy', nameNe: 'प्रारम्भिक साक्षरता' },
    ],
  },
};

export interface DomainConfig {
  name: string;
  nameNe: string;
  description: string;
  descriptionNe: string;
  color: string;
  icon: string;
  subAreas: SubArea[];
}

export interface SubArea {
  id: string;
  name: string;
  nameNe: string;
}

// Activity Logging
export type PreschoolActivityType =
  | 'art'
  | 'reading'
  | 'play'
  | 'music'
  | 'movement'
  | 'sensory'
  | 'circle_time'
  | 'outdoor'
  | 'snack_time'
  | 'nap_time'
  | 'free_play';

export const PRESCHOOL_ACTIVITY_TYPES: Record<PreschoolActivityType, { en: string; ne: string; icon: string; domains: DevelopmentDomain[] }> = {
  art: { en: 'Art & Craft', ne: 'कला र शिल्प', icon: '🎨', domains: ['cognitive', 'physical'] },
  reading: { en: 'Story Time', ne: 'कथा समय', icon: '📚', domains: ['language', 'cognitive'] },
  play: { en: 'Play Time', ne: 'खेल समय', icon: '🧸', domains: ['social', 'emotional'] },
  music: { en: 'Music & Dance', ne: 'संगीत र नृत्य', icon: '🎵', domains: ['physical', 'emotional'] },
  movement: { en: 'Movement', ne: 'आन्दोलन', icon: '🤸', domains: ['physical'] },
  sensory: { en: 'Sensory Play', ne: 'संवेदी खेल', icon: '🖐️', domains: ['cognitive', 'physical'] },
  circle_time: { en: 'Circle Time', ne: 'सर्कल टाइम', icon: '⭕', domains: ['social', 'language'] },
  outdoor: { en: 'Outdoor Play', ne: 'बाहिरी खेल', icon: '🌳', domains: ['physical', 'social'] },
  snack_time: { en: 'Snack Time', ne: 'खाजा समय', icon: '🍎', domains: ['social', 'physical'] },
  nap_time: { en: 'Rest Time', ne: 'आराम समय', icon: '😴', domains: ['physical', 'emotional'] },
  free_play: { en: 'Free Play', ne: 'स्वतन्त्र खेल', icon: '🎮', domains: ['social', 'cognitive'] },
};

export interface PreschoolActivity {
  id: string;
  classId: string;
  teacherId: string;

  activityType: PreschoolActivityType;
  title: string;
  titleNe: string;
  description?: string;
  descriptionNe?: string;

  date: Date;
  startTime: string;
  endTime?: string;

  // Media evidence
  photos: string[];
  videos: string[];
  voiceNotes: string[];

  // Tagged children with individual notes
  taggedChildren: TaggedChild[];

  // Development domains addressed
  domains: DevelopmentDomain[];

  createdAt: Date;
}

export interface TaggedChild {
  childId: string;
  note?: string;
  noteNe?: string;
  mood: 'happy' | 'engaged' | 'neutral' | 'struggling' | 'tired';
  engagement: 'high' | 'medium' | 'low';
}

// Developmental Observation
export interface DevelopmentObservation {
  id: string;
  childId: string;
  teacherId: string;

  domain: DevelopmentDomain;
  subArea: string;

  observation: string;
  observationNe: string;

  rating: 1 | 2 | 3 | 4 | 5; // 1=needs support, 5=exceeds expectations

  // Evidence
  evidenceType: 'photo' | 'video' | 'voice' | 'document';
  evidenceUrl: string;

  date: Date;
  createdAt: Date;
}

// Developmental Milestone
export interface DevelopmentMilestone {
  id: string;
  domain: DevelopmentDomain;
  subArea: string;

  title: string;
  titleNe: string;
  description: string;
  descriptionNe: string;

  ageRangeMonths: { min: number; max: number };
  order: number;
}

export interface ChildMilestoneProgress {
  childId: string;
  milestoneId: string;

  status: 'not_started' | 'in_progress' | 'achieved';
  achievedDate?: Date;
  notes?: string;
  notesNe?: string;
  evidenceUrls: string[];

  assessedBy: string;
  assessedAt: Date;
}

// Holistic Progress Report Card (HPRC)
export interface HPRC {
  id: string;
  childId: string;
  classId: string;
  teacherId: string;

  period: 'term1' | 'term2' | 'term3' | 'annual';
  academicYear: string;

  // Radar chart data
  developmentScores: DevelopmentScores;
  previousScores?: DevelopmentScores; // For comparison

  // Domain-wise narratives
  domainNarratives: DomainNarrative[];

  // Overall narratives
  strengths: string;
  strengthsNe: string;
  areasForGrowth: string;
  areasForGrowthNe: string;
  teacherNote: string;
  teacherNoteNe: string;

  // Child's voice
  childQuote?: string;
  childQuoteNe?: string;
  childDrawingUrl?: string;

  // Photo highlights
  highlightPhotos: string[];

  // Attendance summary
  totalDays: number;
  presentDays: number;

  // Generated metadata
  generatedAt: Date;
  pdfUrl?: string;
  sharedWithParents: boolean;
  parentViewedAt?: Date;
}

export interface DomainNarrative {
  domain: DevelopmentDomain;
  score: number;
  previousScore?: number;
  narrative: string;
  narrativeNe: string;
  highlights: string[];
  highlightsNe: string[];
}

// Quick Activity Templates
export interface ActivityTemplate {
  id: string;
  name: string;
  nameNe: string;
  activityType: PreschoolActivityType;
  description: string;
  descriptionNe: string;
  domains: DevelopmentDomain[];
  suggestedDuration: number; // in minutes
  materials?: string[];
  materialsNe?: string[];
  icon: string;
}

export const QUICK_ACTIVITY_TEMPLATES: ActivityTemplate[] = [
  {
    id: 'morning_art',
    name: 'Morning Art Session',
    nameNe: 'बिहानको कला सत्र',
    activityType: 'art',
    description: 'Creative art activity with various materials',
    descriptionNe: 'विभिन्न सामग्रीहरूसँग सृजनात्मक कला गतिविधि',
    domains: ['cognitive', 'physical'],
    suggestedDuration: 30,
    materials: ['Paper', 'Crayons', 'Paint'],
    materialsNe: ['कागज', 'क्रेयोनहरू', 'रंग'],
    icon: '🎨',
  },
  {
    id: 'circle_time',
    name: 'Circle Time',
    nameNe: 'सर्कल टाइम',
    activityType: 'circle_time',
    description: 'Group discussion and sharing',
    descriptionNe: 'समूह छलफल र साझेदारी',
    domains: ['social', 'language'],
    suggestedDuration: 20,
    icon: '⭕',
  },
  {
    id: 'outdoor_play',
    name: 'Outdoor Play',
    nameNe: 'बाहिरी खेल',
    activityType: 'outdoor',
    description: 'Physical activities in playground',
    descriptionNe: 'खेल मैदानमा शारीरिक गतिविधिहरू',
    domains: ['physical', 'social'],
    suggestedDuration: 45,
    icon: '🌳',
  },
  {
    id: 'story_time',
    name: 'Story Time',
    nameNe: 'कथा समय',
    activityType: 'reading',
    description: 'Interactive storytelling session',
    descriptionNe: 'अन्तरक्रियात्मक कथा सुनाउने सत्र',
    domains: ['language', 'cognitive'],
    suggestedDuration: 25,
    icon: '📚',
  },
];

/**
 * Preschool Data Generator for EduNexus Demo
 * Generates preschool children, activities, and developmental data
 */

import { faker } from '@faker-js/faker';
import type {
  PreschoolChild,
  PreschoolClassName,
  DevelopmentScores,
  PreschoolActivity,
  PreschoolActivityType,
  DevelopmentObservation,
  DevelopmentDomain,
  HPRC,
  TaggedChild,
  DomainNarrative,
} from '@/types/preschool.types';
import { PRESCHOOL_CLASSES, DEVELOPMENT_DOMAINS, PRESCHOOL_ACTIVITY_TYPES } from '@/types/preschool.types';
import { CURRENT_ACADEMIC_YEAR } from '@/lib/constants';
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

function generateDevelopmentScores(): DevelopmentScores {
  // Generate realistic scores (most between 60-90)
  const generateScore = () => {
    const base = 60 + Math.floor(Math.random() * 30);
    const variance = Math.floor(Math.random() * 10) - 5;
    return Math.max(0, Math.min(100, base + variance));
  };

  const physical = generateScore();
  const cognitive = generateScore();
  const social = generateScore();
  const emotional = generateScore();
  const language = generateScore();

  const overall = Math.round((physical + cognitive + social + emotional + language) / 5);

  return { physical, cognitive, social, emotional, language, overall };
}

function getAgeInMonths(className: PreschoolClassName): number {
  switch (className) {
    case 'nursery':
      return 24 + Math.floor(Math.random() * 12); // 24-36 months
    case 'lkg':
      return 36 + Math.floor(Math.random() * 12); // 36-48 months
    case 'ukg':
      return 48 + Math.floor(Math.random() * 12); // 48-60 months
    default:
      return 36;
  }
}

function getDateOfBirth(ageMonths: number): Date {
  const now = new Date();
  const birthDate = new Date(now);
  birthDate.setMonth(birthDate.getMonth() - ageMonths);
  return birthDate;
}

export function generatePreschoolChild(
  className: PreschoolClassName,
  index: number
): PreschoolChild {
  const gender: 'male' | 'female' = Math.random() > 0.5 ? 'male' : 'female';
  const { firstName, lastName } = getRandomName(gender);

  const ageMonths = getAgeInMonths(className);
  const id = `PRE-${className.toUpperCase()}-${String(index).padStart(3, '0')}`;
  const classInfo = PRESCHOOL_CLASSES[className];

  const child: PreschoolChild = {
    id,
    name: `${firstName.en} ${lastName.en}`,
    nameNe: `${firstName.ne} ${lastName.ne}`,
    dateOfBirth: getDateOfBirth(ageMonths),
    age: ageMonths,
    gender,
    avatarUrl: undefined,

    classId: `CLS-PRE-${className.toUpperCase()}`,
    className,
    classNameNe: classInfo.ne,

    parentIds: [`PAR-${id}`],
    emergencyContact: `98${faker.string.numeric(8)}`,

    enrollmentDate: faker.date.past({ years: 1 }),
    academicYear: CURRENT_ACADEMIC_YEAR,

    bloodGroup: ['A+', 'B+', 'O+', 'AB+'][Math.floor(Math.random() * 4)],
    allergies: Math.random() > 0.9 ? ['Peanuts'] : undefined,
    specialNeeds: undefined,

    developmentScores: generateDevelopmentScores(),
    lastAssessmentDate: faker.date.recent({ days: 30 }),
  };

  return child;
}

export function generatePreschoolActivity(
  classId: string,
  teacherId: string,
  children: PreschoolChild[],
  daysAgo: number = 0
): PreschoolActivity {
  const activityTypes = Object.keys(PRESCHOOL_ACTIVITY_TYPES) as PreschoolActivityType[];
  const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
  const activityInfo = PRESCHOOL_ACTIVITY_TYPES[activityType];

  const date = new Date();
  date.setDate(date.getDate() - daysAgo);

  // Tag 3-8 random children
  const numTagged = 3 + Math.floor(Math.random() * 6);
  const shuffledChildren = [...children].sort(() => Math.random() - 0.5);
  const taggedChildren: TaggedChild[] = shuffledChildren.slice(0, numTagged).map(child => ({
    childId: child.id,
    note: Math.random() > 0.5 ? 'Participated actively' : undefined,
    noteNe: Math.random() > 0.5 ? 'सक्रिय रूपमा भाग लिए' : undefined,
    mood: ['happy', 'engaged', 'neutral', 'struggling', 'tired'][Math.floor(Math.random() * 5)] as TaggedChild['mood'],
    engagement: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as TaggedChild['engagement'],
  }));

  const activity: PreschoolActivity = {
    id: faker.string.uuid(),
    classId,
    teacherId,

    activityType,
    title: activityInfo.en,
    titleNe: activityInfo.ne,
    description: `Children enjoyed ${activityInfo.en.toLowerCase()} activities today.`,
    descriptionNe: `बच्चाहरूले आज ${activityInfo.ne} गतिविधिहरूको आनन्द लिए।`,

    date,
    startTime: `${9 + Math.floor(Math.random() * 4)}:${Math.random() > 0.5 ? '00' : '30'}`,
    endTime: `${11 + Math.floor(Math.random() * 3)}:${Math.random() > 0.5 ? '00' : '30'}`,

    photos: [
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800',
      'https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=800',
    ],
    videos: [],
    voiceNotes: [],

    taggedChildren,
    domains: activityInfo.domains,

    createdAt: date,
  };

  return activity;
}

export function generateDevelopmentObservation(
  childId: string,
  teacherId: string,
  daysAgo: number = 0
): DevelopmentObservation {
  const domains: DevelopmentDomain[] = ['physical', 'cognitive', 'social', 'emotional', 'language'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  const domainInfo = DEVELOPMENT_DOMAINS[domain];
  const subArea = domainInfo.subAreas[Math.floor(Math.random() * domainInfo.subAreas.length)];

  const observations = [
    { en: 'Shows good progress in this area.', ne: 'यस क्षेत्रमा राम्रो प्रगति देखाउँछ।' },
    { en: 'Continues to develop skills with support.', ne: 'सहयोगसँग सीपहरू विकास गर्न जारी छ।' },
    { en: 'Demonstrates strong abilities.', ne: 'बलियो क्षमताहरू प्रदर्शन गर्दछ।' },
    { en: 'Making steady improvement.', ne: 'स्थिर सुधार गरिरहेको छ।' },
  ];

  const obs = observations[Math.floor(Math.random() * observations.length)];
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);

  return {
    id: faker.string.uuid(),
    childId,
    teacherId,
    domain,
    subArea: subArea.id,
    observation: obs.en,
    observationNe: obs.ne,
    rating: (1 + Math.floor(Math.random() * 5)) as 1 | 2 | 3 | 4 | 5,
    evidenceType: 'photo',
    evidenceUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800',
    date,
    createdAt: date,
  };
}

export function generateHPRC(
  child: PreschoolChild,
  teacherId: string,
  period: HPRC['period'] = 'term1'
): HPRC {
  const domains: DevelopmentDomain[] = ['physical', 'cognitive', 'social', 'emotional', 'language'];

  const domainNarratives: DomainNarrative[] = domains.map(domain => {
    const score = child.developmentScores[domain];
    const domainInfo = DEVELOPMENT_DOMAINS[domain];

    let narrative = '';
    let narrativeNe = '';

    if (score >= 80) {
      narrative = `${child.name} shows excellent progress in ${domainInfo.name.toLowerCase()}. They consistently demonstrate strong skills and often help peers.`;
      narrativeNe = `${child.nameNe}ले ${domainInfo.nameNe}मा उत्कृष्ट प्रगति देखाउँछन्। तिनीहरूले निरन्तर बलियो सीपहरू प्रदर्शन गर्छन्।`;
    } else if (score >= 60) {
      narrative = `${child.name} is making good progress in ${domainInfo.name.toLowerCase()}. With continued support, they are developing nicely.`;
      narrativeNe = `${child.nameNe}ले ${domainInfo.nameNe}मा राम्रो प्रगति गरिरहेका छन्। निरन्तर सहयोगसँग, तिनीहरू राम्रोसँग विकास गरिरहेका छन्।`;
    } else {
      narrative = `${child.name} is working on developing skills in ${domainInfo.name.toLowerCase()}. We are providing additional support and encouragement.`;
      narrativeNe = `${child.nameNe}ले ${domainInfo.nameNe}मा सीपहरू विकास गर्न काम गरिरहेका छन्। हामी थप सहयोग र प्रोत्साहन प्रदान गरिरहेका छौं।`;
    }

    return {
      domain,
      score,
      previousScore: Math.max(0, score - 5 - Math.floor(Math.random() * 10)),
      narrative,
      narrativeNe,
      highlights: ['Shows enthusiasm', 'Participates actively'],
      highlightsNe: ['उत्साह देखाउँछ', 'सक्रिय रूपमा भाग लिन्छ'],
    };
  });

  const hprc: HPRC = {
    id: faker.string.uuid(),
    childId: child.id,
    classId: child.classId,
    teacherId,

    period,
    academicYear: CURRENT_ACADEMIC_YEAR,

    developmentScores: child.developmentScores,
    previousScores: {
      physical: Math.max(0, child.developmentScores.physical - 5),
      cognitive: Math.max(0, child.developmentScores.cognitive - 5),
      social: Math.max(0, child.developmentScores.social - 5),
      emotional: Math.max(0, child.developmentScores.emotional - 5),
      language: Math.max(0, child.developmentScores.language - 5),
      overall: Math.max(0, child.developmentScores.overall - 5),
    },

    domainNarratives,

    strengths: `${child.name} shows particular strength in creative activities and social interaction with peers.`,
    strengthsNe: `${child.nameNe}ले सृजनात्मक गतिविधिहरू र साथीहरूसँग सामाजिक अन्तरक्रियामा विशेष शक्ति देखाउँछन्।`,
    areasForGrowth: 'Focus and attention span during structured activities.',
    areasForGrowthNe: 'संरचित गतिविधिहरूमा ध्यान र ध्यान अवधि।',
    teacherNote: `It has been a pleasure working with ${child.name} this term. They bring joy to our classroom every day.`,
    teacherNoteNe: `यस कार्यकालमा ${child.nameNe}सँग काम गर्न आनन्द भयो। तिनीहरूले हाम्रो कक्षामा हरेक दिन खुशी ल्याउँछन्।`,

    childQuote: 'I like playing with my friends!',
    childQuoteNe: 'मलाई मेरा साथीहरूसँग खेल्न मन पर्छ!',
    childDrawingUrl: undefined,

    highlightPhotos: [
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800',
      'https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=800',
    ],

    totalDays: 60,
    presentDays: 55 + Math.floor(Math.random() * 5),

    generatedAt: new Date(),
    pdfUrl: undefined,
    sharedWithParents: false,
    parentViewedAt: undefined,
  };

  return hprc;
}

export function generateAllPreschoolData() {
  const children: PreschoolChild[] = [];
  const activities: PreschoolActivity[] = [];
  const observations: DevelopmentObservation[] = [];
  const reports: HPRC[] = [];

  const classes: PreschoolClassName[] = ['nursery', 'lkg', 'ukg'];
  const teacherId = 'TCH-PRE-001';

  // Generate 10 children per class
  for (const className of classes) {
    const classChildren: PreschoolChild[] = [];

    for (let i = 1; i <= 10; i++) {
      const child = generatePreschoolChild(className, i);
      children.push(child);
      classChildren.push(child);

      // Generate 5-10 observations per child
      const numObs = 5 + Math.floor(Math.random() * 6);
      for (let j = 0; j < numObs; j++) {
        observations.push(generateDevelopmentObservation(child.id, teacherId, j * 7));
      }

      // Generate HPRC
      reports.push(generateHPRC(child, teacherId));
    }

    // Generate 20 activities per class
    for (let i = 0; i < 20; i++) {
      activities.push(generatePreschoolActivity(
        `CLS-PRE-${className.toUpperCase()}`,
        teacherId,
        classChildren,
        i * 3
      ));
    }
  }

  return { children, activities, observations, reports };
}

// Demo data exports
export const demoPreschoolData = generateAllPreschoolData();

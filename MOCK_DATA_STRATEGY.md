# EduNexus - Mock Data Strategy

## Overview

This document outlines the comprehensive mock data generation strategy for the EduNexus demo. The goal is to create realistic, extensive data that makes the application feel like a production system rather than a prototype.

---

## Data Volume Requirements

| Entity | Quantity | Rationale |
|--------|----------|-----------|
| **Students** | 150 | 3 grades × 2 sections × 25 students |
| **Pre-school Students** | 30 | Nursery, LKG, UKG (10 each) |
| **Parents** | 100 | Some families have 2 children |
| **Teachers** | 15 | 1-2 per subject + homeroom teachers |
| **Subjects** | 12 | CDC core subjects per grade level |
| **Assignments** | 200 | ~10 per subject over 2 terms |
| **Activity Feed Items** | 300 | Daily posts over 3 months |
| **Attendance Records** | 10,500 | 150 students × 70 school days |
| **Badges** | 40 types | Across all categories |
| **Fee Payments** | 180 | Each student has 1-2 payments |
| **PTM Meetings** | 80 | 2 per parent per year |
| **Milestones** | 150 | 5 domains × 30 pre-school students |
| **Observations** | 450 | 3 per milestone on average |
| **Study Squads** | 12 | 4 students per squad |

---

## Nepali Names Database

### Ethnic Diversity

The name database must represent Nepal's ethnic diversity:

```typescript
const ethnicGroups = [
  'Brahmin',      // 12% of names
  'Chhetri',      // 17% of names
  'Newar',        // 5% of names
  'Tamang',       // 6% of names
  'Magar',        // 7% of names
  'Tharu',        // 7% of names
  'Rai',          // 5% of names
  'Gurung',       // 4% of names
  'Limbu',        // 2% of names
  'Sherpa',       // 2% of names
  'Others',       // 33% of names
];
```

### Sample Names by Ethnicity

**Brahmin/Chhetri:**
- Male: Aarav Sharma, Rohan Poudel, Dev KC, Arjun Thapa
- Female: Sita Sharma, Ananya Poudel, Kritika KC, Ishita Thapa
- नेपाली: आरव शर्मा, रोहन पौडेल, देव केसी, अर्जुन थापा

**Newar:**
- Male: Aayush Shrestha, Bibek Shakya, Prajwal Maharjan
- Female: Samikshya Shrestha, Shreya Shakya, Nikita Maharjan
- नेपाली: आयुष श्रेष्ठ, विवेक शाक्य, प्रज्वल महर्जन

**Tamang:**
- Male: Tenzin Tamang, Dorje Lama, Karma Sherpa
- Female: Yangchen Tamang, Dawa Lama, Pemba Sherpa
- नेपाली: तेन्जिन तामाङ, दोर्जे लामा, कर्मा शेर्पा

**Magar:**
- Male: Bikram Magar, Kumar Pun, Rajan Ale
- Female: Sunita Magar, Sabita Pun, Mina Ale
- नेपाली: विक्रम मगर, कुमार पुन, राजन आले

**Tharu:**
- Male: Raju Chaudhary, Deepak Tharu, Santosh Dangaura
- Female: Sushma Chaudhary, Radha Tharu, Geeta Dangaura
- नेपाली: राजु चौधरी, दीपक थारु, सन्तोष डंगौरा

---

## CDC-Aligned Subjects

### Primary Level (Grades 1-5)

```json
{
  "subjects": [
    { "code": "NEP", "name": "Nepali", "nameNe": "नेपाली", "core": true },
    { "code": "ENG", "name": "English", "nameNe": "अङ्ग्रेजी", "core": true },
    { "code": "MTH", "name": "Mathematics", "nameNe": "गणित", "core": true },
    { "code": "SCI", "name": "Science", "nameNe": "विज्ञान", "core": true },
    { "code": "SST", "name": "Social Studies", "nameNe": "सामाजिक अध्ययन", "core": true },
    { "code": "HPE", "name": "Health & Physical Ed.", "nameNe": "स्वास्थ्य तथा शारीरिक शिक्षा", "core": true },
    { "code": "ART", "name": "Creative Arts", "nameNe": "रचनात्मक कला", "core": false }
  ]
}
```

### Secondary Level (Grades 6-10)

```json
{
  "subjects": [
    { "code": "C-NEP", "name": "Compulsory Nepali", "nameNe": "अनिवार्य नेपाली", "core": true },
    { "code": "C-ENG", "name": "Compulsory English", "nameNe": "अनिवार्य अङ्ग्रेजी", "core": true },
    { "code": "C-MTH", "name": "Compulsory Mathematics", "nameNe": "अनिवार्य गणित", "core": true },
    { "code": "SCI", "name": "Science", "nameNe": "विज्ञान", "core": true },
    { "code": "SST", "name": "Social Studies", "nameNe": "सामाजिक अध्ययन", "core": true },
    { "code": "O-MTH", "name": "Optional Mathematics", "nameNe": "ऐच्छिक गणित", "core": false },
    { "code": "ACC", "name": "Accountancy", "nameNe": "लेखा", "core": false },
    { "code": "HPE", "name": "Health, Population & Env.", "nameNe": "स्वास्थ्य, जनसंख्या र वातावरण", "core": true }
  ]
}
```

---

## Cultural Activities & Events

### Nepali Festivals (School Calendar)

```json
{
  "festivals": [
    {
      "name": "Dashain",
      "nameNe": "दशैं",
      "dates": "October 10-25, 2025",
      "activities": ["Celebration assembly", "Cultural program", "15-day holiday"]
    },
    {
      "name": "Tihar",
      "nameNe": "तिहार",
      "dates": "November 1-5, 2025",
      "activities": ["Deusi-Bhailo performance", "Rangoli competition", "5-day holiday"]
    },
    {
      "name": "Nepali Bhaka Diwas",
      "nameNe": "नेपाली भाषा दिवस",
      "dates": "September 1, 2025",
      "activities": ["Poetry recitation", "Essay writing", "Cultural songs"]
    },
    {
      "name": "Republic Day",
      "nameNe": "गणतन्त्र दिवस",
      "dates": "May 28, 2025",
      "activities": ["Flag ceremony", "Patriotic songs", "Parade"]
    },
    {
      "name": "Buddha Jayanti",
      "nameNe": "बुद्ध जयन्ती",
      "dates": "May 23, 2025",
      "activities": ["Meditation session", "Peace message", "Holiday"]
    }
  ]
}
```

### Classroom Activity Templates

```json
{
  "activities": [
    {
      "type": "science_experiment",
      "nameEn": "Volcano Eruption Experiment",
      "nameNe": "ज्वालामुखी विस्फोट प्रयोग",
      "domain": "cognitive",
      "mediaType": "photo+video"
    },
    {
      "type": "cultural",
      "nameEn": "Traditional Newari Dance Workshop",
      "nameNe": "परम्परागत नेवारी नृत्य कार्यशाला",
      "domain": "physical+social",
      "mediaType": "video"
    },
    {
      "type": "arts",
      "nameEn": "Yomari Making Activity",
      "nameNe": "योमरी बनाउने कार्यक्रम",
      "domain": "creative+fine_motor",
      "mediaType": "photo"
    },
    {
      "type": "sports",
      "nameEn": "Inter-house Football Match",
      "nameNe": "अन्तर-सदन फुटबल खेल",
      "domain": "physical+teamwork",
      "mediaType": "photo+video"
    }
  ]
}
```

---

## Fee Structure (NPR)

### By Grade Level

```typescript
const feeStructure = {
  preschool: {
    admission: 5000,
    tuitionPerMonth: 3000,
    annualTotal: 45000,
    components: {
      admission: 5000,
      tuition: 36000,      // 12 months
      activities: 2000,
      books: 1500,
      uniform: 2500,
    }
  },
  primary: { // Grades 1-5
    admission: 8000,
    tuitionPerMonth: 4500,
    annualTotal: 65000,
    components: {
      admission: 8000,
      tuition: 54000,      // 12 months
      exam: 1000,
      transport: 24000,    // 12 months @ 2000/month
      books: 3000,
      activities: 2500,
      uniform: 3000,
    }
  },
  secondary: { // Grades 6-10
    admission: 12000,
    tuitionPerMonth: 6000,
    annualTotal: 95000,
    components: {
      admission: 12000,
      tuition: 72000,
      exam: 1500,
      transport: 30000,
      books: 4000,
      lab: 2000,
      activities: 3000,
      uniform: 3500,
    }
  }
};
```

### Payment Methods

- **eSewa**: Most popular digital wallet in Nepal
- **Khalti**: Second most popular
- **Fonepay**: Bank-integrated payment
- **Bank Transfer**: Direct bank transfer
- **Cash**: Traditional payment at school office

---

## Gamification System

### XP Values

```typescript
const XP_REWARDS = {
  // Daily Actions
  dailyMoodCheckIn: 10,
  attendancePresent: 5,
  attendanceOnTime: 2,  // Bonus for not being late

  // Homework & Assignments
  homeworkSubmittedOnTime: 50,
  homeworkSubmittedEarly: 60,  // 1+ days early
  homeworkSubmittedLate: 25,
  homeworkPerfectScore: 30,    // Bonus

  // Academic Performance
  quizCompleted: 30,
  testScore90Plus: 100,
  testScore80to89: 75,
  testScore70to79: 50,
  improvedGrade: 40,           // Better than last time

  // Social & Collaboration
  helpedClassmate: 25,
  peerRecognitionReceived: 15,
  studySquadParticipation: 20,
  studySquadMVP: 100,          // Weekly MVP

  // Streaks
  homeworkStreak7Days: 100,
  attendanceStreak30Days: 200,
  readingStreak14Days: 150,

  // Special
  teacherRecognition: 75,
  wonCompetition: 200,
  classPresentationDelivered: 60,
};

const LEVEL_PROGRESSION = {
  xpPerLevel: 100,  // Level 1->2: 100 XP, 2->3: 200 XP, etc.
  levelNames: {
    1: 'Novice',
    5: 'Explorer',
    10: 'Scholar',
    15: 'Expert',
    20: 'Master',
    25: 'Legend',
  }
};
```

### Badge Categories

```typescript
const BADGE_CATEGORIES = {
  academic: {
    mathMaster: {
      name: 'Math Master',
      nameNe: 'गणित निपुण',
      description: 'Score 90%+ in 5 math tests',
      rarity: 'rare',
      icon: '🔢',
    },
    homeworkHero: {
      name: 'Homework Hero',
      nameNe: 'गृहकार्य नायक',
      description: 'Submit 20 assignments on time',
      rarity: 'common',
      icon: '📝',
    },
  },
  attendance: {
    perfectAttendance: {
      name: 'Perfect Attendance',
      nameNe: 'पूर्ण उपस्थिति',
      description: 'No absences for 30 days',
      rarity: 'rare',
      icon: '✅',
    },
    earlyBird: {
      name: 'The Early Bird',
      nameNe: 'समयमै आउने',
      description: 'Never late for 15 days',
      rarity: 'common',
      icon: '🐦',
    },
  },
  behavior: {
    helpfulStudent: {
      name: 'Helpful Student',
      nameNe: 'सहयोगी विद्यार्थी',
      description: 'Help classmates 10 times',
      rarity: 'common',
      icon: '🤝',
    },
    classLeader: {
      name: 'Class Leader',
      nameNe: 'कक्षा नेता',
      description: 'Lead a class project successfully',
      rarity: 'epic',
      icon: '👑',
    },
  },
  special: {
    dashainStar: {
      name: 'Dashain Star',
      nameNe: 'दशैं तारा',
      description: 'Participated in Dashain celebration',
      rarity: 'legendary',
      icon: '🪔',
    },
  },
};
```

---

## Visual Assets Strategy

### Photo Assets

**Sources:**
1. **Unsplash** - Education collection
   - Search: "nepal school", "classroom", "asian children learning"
   - Required: 100+ classroom moment photos

2. **Pexels** - Education category
   - Search: "diverse children", "students studying", "kids playing"
   - Required: 50+ activity photos

**Categories:**
```
/public/images/moments/
  /science/       (20 photos - experiments, labs)
  /arts/          (20 photos - painting, crafts)
  /sports/        (20 photos - football, running, yoga)
  /cultural/      (20 photos - traditional dance, festivals)
  /classroom/     (20 photos - group work, presentations)
  /preschool/     (20 photos - block building, storytelling)
```

### Video Assets

**Sources:**
- Pexels Video
- Coverr

**Specifications:**
- Length: 5-10 seconds each
- Format: MP4, H.264 codec
- Resolution: 720p (1280x720)
- Thumbnails: Generated at 2-second mark

**Categories:**
```
/public/videos/
  /science/       (10 videos)
  /arts/          (10 videos)
  /sports/        (10 videos)
  /cultural/      (10 videos)
```

### Avatar Generation

**Library:** `@dicebear/avatars` with "avataaars" style

**Configuration:**
```typescript
const avatarConfig = {
  seed: studentId,  // Deterministic based on ID
  skinColor: ['tanned', 'brown', 'darkBrown'],
  hairColor: ['black', 'brown', 'auburn'],
  clothesColor: ['blue', 'red', 'green', 'yellow', 'heather'],
  top: ['shortHair', 'longHair', 'hat'],
  accessories: ['glasses', 'none'],
  facialHair: ['none'], // For students
};
```

### Badge Icons

**Design:**
- SVG format for scalability
- 64×64px base size
- Rarity indicated by:
  - Common: Gray border, no glow
  - Rare: Blue border, subtle glow
  - Epic: Purple border, medium glow
  - Legendary: Gold border, strong glow

**Storage:**
```
/public/badges/
  academic/
  attendance/
  behavior/
  special/
```

---

## Data Generation Scripts

### Generator Architecture

```
/src/data/
  /seeds/                    # Static reference data (JSON)
    names.json              # 500+ Nepali names
    subjects.json           # CDC subjects by grade
    badges.json             # 40 badge definitions
    activities.json         # Activity templates
    festivals.json          # Nepali festivals

  /generators/               # Generation scripts (TypeScript)
    generateStudents.ts
    generateParents.ts
    generateTeachers.ts
    generateAttendance.ts
    generateGrades.ts
    generateActivityFeed.ts
    generateAssignments.ts
    generateFees.ts
    generateMilestones.ts
    generateGamification.ts

  /generated/                # Output (JSON)
    students.json
    parents.json
    teachers.json
    attendance.json
    grades.json
    activityFeed.json
```

### Relationship Management

**Parent-Student Linking:**
- 70% of students have 2 parents
- 30% of students have 1 parent
- Some parents have multiple children (siblings)

**Teacher-Class Assignment:**
- Each teacher handles 2-3 grade-section combinations
- Primary teachers: 1 class (all subjects)
- Secondary teachers: Multiple classes (1-2 subjects)

**Subject-Teacher Assignment:**
- Each subject has 1-2 teachers
- Teachers can teach multiple subjects

---

## Temporal Data Patterns

### Academic Calendar

```typescript
const academicCalendar = {
  year: '2025-2026',
  startDate: '2025-04-15',  // Baisakh 1 (Nepali New Year)
  endDate: '2026-03-31',
  terms: [
    { name: 'Term 1', start: '2025-04-15', end: '2025-07-31' },
    { name: 'Term 2', start: '2025-08-01', end: '2025-11-30' },
    { name: 'Term 3', start: '2025-12-01', end: '2026-03-31' },
  ],
  weeklySchedule: {
    monday: { start: '10:00', end: '16:00', periods: 6 },
    tuesday: { start: '10:00', end: '16:00', periods: 6 },
    wednesday: { start: '10:00', end: '16:00', periods: 6 },
    thursday: { start: '10:00', end: '16:00', periods: 6 },
    friday: { start: '10:00', end: '16:00', periods: 6 },
    saturday: 'holiday',
    sunday: 'holiday',
  },
};
```

### Activity Feed Patterns

**Posting Frequency:**
- Weekdays: 3-5 posts per day
- Peak hours: 10:00 AM, 2:00 PM
- Weekends: 0-1 posts
- Holidays: 0 posts

**Post Types Distribution:**
- 40% Classroom moments (photos/videos)
- 20% Achievements (badges, milestones)
- 15% Grade updates
- 10% Announcements
- 10% Homework assignments
- 5% Events

---

## Bilingual Content Strategy

### Translation Templates

```typescript
interface ContentTemplate {
  key: string;
  en: string;
  ne: string;
  variables: string[];
}

const templates = [
  {
    key: 'activity_completed',
    en: '{studentName} completed {activityName} with excellent results!',
    ne: '{studentName} ले {activityName} उत्कृष्ट परिणामसँग सम्पन्न गर्यो!',
    variables: ['studentName', 'activityName'],
  },
  {
    key: 'grade_improved',
    en: '{studentName} improved their {subject} score by {percentage}%',
    ne: '{studentName} ले आफ्नो {subject} अंक {percentage}% ले सुधार गर्यो',
    variables: ['studentName', 'subject', 'percentage'],
  },
  {
    key: 'milestone_achieved',
    en: 'Congratulations! {studentName} earned the "{badgeName}" badge 🎉',
    ne: 'बधाई छ! {studentName} ले "{badgeName}" ब्याज प्राप्त गर्यो 🎉',
    variables: ['studentName', 'badgeName'],
  },
];
```

### Number & Date Formatting

**Devanagari Numerals (Optional):**
- 0 → ०
- 1 → १
- 2 → २
- ... 9 → ९

**Date Format:**
- English: "January 3, 2026"
- Nepali: "२०२६ जनवरी ३"
- Bikram Sambat: "२०८२ पौष २०" (optional display)

---

## Data Quality Validation

### Validation Rules

```typescript
const validationRules = {
  student: {
    age: { min: 3, max: 18 },
    gradeMatchesAge: true,
    hasParents: { min: 1, max: 2 },
  },
  attendance: {
    dateIsSchoolDay: true,  // Not weekend/holiday
    moodRatingOnlyIfPresent: true,
  },
  grade: {
    marksWithinRange: true,  // <= totalMarks
    gradeMatchesCDCSystem: true,
  },
  activityFeed: {
    hasBilingualContent: true,
    timestampRealistic: true,  // Within school hours
  },
};
```

---

## Mock Data Generation Commands

```bash
# Generate all data
npm run generate:all

# Generate specific entities
npm run generate:students
npm run generate:parents
npm run generate:teachers
npm run generate:attendance
npm run generate:grades
npm run generate:feed

# Regenerate with new seed
npm run generate:all -- --seed=12345

# Generate with specific volume
npm run generate:students -- --count=200
npm run generate:feed -- --days=180
```

---

This strategy ensures we have rich, realistic, culturally authentic mock data that makes EduNexus feel like a real, production-ready application! 🇳🇵

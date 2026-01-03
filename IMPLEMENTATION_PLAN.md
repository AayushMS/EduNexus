# EduNexus - Implementation Plan (For Claude Code Execution)

> **This plan is designed for Claude Code AI to execute autonomously. Each phase includes clear goals, acceptance criteria, and testing requirements.**

---

## Project Setup Prerequisites

**Repository**: `/home/aayushms/work/pet_projects/ed_tech`
**Application Name**: EduNexus
**Technology Stack**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Zustand, next-intl

---

## PHASE 1: Project Foundation & Core Infrastructure

### Goal
Initialize a fully functional Next.js 14 project with all dependencies, base configuration, and core state management ready for feature development.

### Acceptance Criteria
- ✅ `npm run dev` starts successfully on `localhost:3000`
- ✅ Hot reload works when editing files
- ✅ TypeScript compilation successful with zero errors
- ✅ Tailwind CSS classes apply correctly
- ✅ shadcn/ui components render properly
- ✅ All Zustand stores work and persist data to localStorage
- ✅ Language toggle switches between EN/NE
- ✅ Theme toggle switches between light/dark mode
- ✅ Base layouts (Header, Sidebar) render on all pages

### Tasks

**1.1 Initialize Next.js Project**
```bash
cd /home/aayushms/work/pet_projects/ed_tech
npx create-next-app@latest . --typescript --tailwind --app --eslint
# Select: Yes to all prompts
```

**1.2 Install Dependencies**
```bash
npm install zustand date-fns clsx tailwind-merge
npm install next-intl recharts framer-motion lucide-react sonner vaul
npm install @faker-js/faker --save-dev
```

**1.3 Configure shadcn/ui**
```bash
npx shadcn-ui@latest init
# Select: Default style, Slate color, CSS variables: yes

npx shadcn-ui@latest add button card input label dialog dropdown-menu
npx shadcn-ui@latest add badge avatar tabs table select textarea
npx shadcn-ui@latest add sheet tooltip progress calendar separator scroll-area
```

**1.4 Create Folder Structure**
```
src/
├── app/
│   ├── (auth)/
│   ├── (dashboard)/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/ (shadcn components)
│   ├── layout/
│   ├── shared/
│   ├── parent/
│   ├── student/
│   ├── teacher/
│   ├── preschool/
│   ├── demo/
│   └── charts/
├── lib/
├── hooks/
├── store/
├── types/
├── data/
│   ├── seeds/
│   ├── generators/
│   └── generated/
├── locales/
│   ├── en/
│   └── ne/
└── config/
```

**1.5 Configure Tailwind (tailwind.config.ts)**
- Add custom colors (brand, gamification, rarity)
- Add custom animations (levelUp, badgeUnlock, xpGain)
- Add Nepali font family
- Configure dark mode

**1.6 Add Nepali Font (globals.css)**
```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap');

:root {
  --font-nepali: 'Noto Sans Devanagari', sans-serif;
}

[lang='ne'] {
  font-family: var(--font-nepali);
}
```

**1.7 Create Zustand Stores**

**`src/store/authStore.ts`**:
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  role: 'parent' | 'student' | 'teacher' | 'preschool' | null;
  userId: string | null;
  user: any | null;
  setRole: (role: AuthState['role']) => void;
  setUser: (user: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      role: null,
      userId: null,
      user: null,
      setRole: (role) => set({ role }),
      setUser: (user) => set({ user, userId: user?.id }),
      logout: () => set({ role: null, userId: null, user: null }),
    }),
    { name: 'edunexus-auth' }
  )
);
```

**`src/store/localeStore.ts`**, **`src/store/themeStore.ts`**, **`src/store/gamificationStore.ts`** - Similar pattern

**1.8 Create Base Layout Components**

**`src/components/layout/Header.tsx`**:
- Logo
- Navigation links
- Language toggle
- Theme toggle
- Notification bell
- User profile dropdown

**`src/components/layout/Sidebar.tsx`**:
- Role-based navigation
- Collapsible on mobile
- Active link highlighting

**`src/components/shared/LanguageToggle.tsx`**:
- Toggle button (EN/NE)
- Updates localeStore
- Reloads page with new locale

**`src/components/shared/ThemeToggle.tsx`**:
- Toggle button (Light/Dark)
- Updates themeStore
- Applies theme class to document

**1.9 Setup next-intl**

**`src/locales/en/common.json`**:
```json
{
  "nav": {
    "dashboard": "Dashboard",
    "logout": "Logout"
  },
  "common": {
    "loading": "Loading...",
    "save": "Save",
    "cancel": "Cancel"
  }
}
```

**`src/locales/ne/common.json`**: Nepali translations

### Testing Phase 1

1. **Start Dev Server**: `npm run dev` → Should open on port 3000
2. **Check TypeScript**: `npm run build` → Zero errors
3. **Test Language Toggle**: Click toggle → Text changes to Nepali
4. **Test Theme Toggle**: Click toggle → Dark mode activates
5. **Test Hot Reload**: Edit a component → Page updates without refresh
6. **Test Store Persistence**: Set role → Refresh page → Role persists
7. **Inspect Element**: Verify Tailwind classes apply, Nepali font loads

### Verification Checklist
- [ ] Dev server runs without errors
- [ ] TypeScript compiles successfully
- [ ] Tailwind classes work
- [ ] Nepali font renders correctly
- [ ] Language toggle switches between EN/NE
- [ ] Theme toggle switches between light/dark
- [ ] Zustand stores persist across refreshes
- [ ] Base layouts render on root page

---

## PHASE 2: TypeScript Type System & Mock Data Foundation

### Goal
Define all TypeScript interfaces for the application and create the complete seed data (names, subjects, badges, activities) that will be used by data generators.

### Acceptance Criteria
- ✅ All entity interfaces defined with proper types
- ✅ TypeScript compilation shows zero errors
- ✅ Seed data files created with 500+ Nepali names
- ✅ CDC-aligned subject definitions for all grade levels
- ✅ 40 unique badge definitions with bilingual content
- ✅ Cultural activity templates with Nepali festivals
- ✅ Mock data can be imported without errors

### Tasks

**2.1 Create Type Definitions**

**`src/types/user.types.ts`**:
```typescript
export interface User {
  id: string;
  email: string;
  phone: string;
  role: 'parent' | 'student' | 'teacher' | 'admin';
  firstName: string;
  lastName: string;
  firstNameNepali?: string;
  lastNameNepali?: string;
  avatarUrl?: string;
  createdAt: Date;
}

export interface Student extends User {
  rollNumber: string;
  gradeLevel: string;
  section: string;
  dateOfBirth: Date;
  ethnicity: EthnicGroup;
  gamification: GamificationProfile;
  parentIds: string[];
}

export interface Parent extends User {
  studentIds: string[];
  occupation: string;
  engagementScore: number;
}

export interface Teacher extends User {
  employeeId: string;
  subjects: string[];
  gradesSections: { grade: string; section: string }[];
}

export type EthnicGroup =
  | 'Brahmin' | 'Chhetri' | 'Newar' | 'Tamang' | 'Magar'
  | 'Tharu' | 'Rai' | 'Gurung' | 'Limbu' | 'Sherpa' | 'Others';
```

**`src/types/gamification.types.ts`**, **`src/types/activity.types.ts`**, **`src/types/preschool.types.ts`**, etc.

**2.2 Create Seed Data Files**

**`src/data/seeds/names.json`**:
```json
{
  "names": [
    {
      "firstName": { "en": "Aarav", "ne": "आरव" },
      "lastName": { "en": "Sharma", "ne": "शर्मा" },
      "gender": "male",
      "ethnicity": "Brahmin"
    },
    {
      "firstName": { "en": "Sita", "ne": "सीता" },
      "lastName": { "en": "Poudel", "ne": "पौडेल" },
      "gender": "female",
      "ethnicity": "Brahmin"
    },
    // ... 500+ names covering all ethnic groups
  ]
}
```

**`src/data/seeds/subjects.json`**:
CDC-aligned subjects for Primary, Secondary, Higher Secondary

**`src/data/seeds/badges.json`**:
40 badge definitions across categories (academic, attendance, behavior, special)

**`src/data/seeds/activities.json`**:
Activity templates for classroom moments, cultural events

**`src/data/seeds/festivals.json`**:
Nepali festivals (Dashain, Tihar, etc.) with dates and activities

**2.3 Create Constants File**

**`src/lib/constants.ts`**:
```typescript
export const XP_REWARDS = {
  dailyMoodCheckIn: 10,
  attendancePresent: 5,
  homeworkSubmittedOnTime: 50,
  homeworkSubmittedEarly: 60,
  // ... all XP values
};

export const LEVEL_PROGRESSION = {
  xpPerLevel: 100,
  levelNames: {
    1: 'Novice',
    5: 'Explorer',
    10: 'Scholar',
    15: 'Expert',
    20: 'Master',
    25: 'Legend',
  },
};

export const BADGE_RARITIES = {
  common: { color: 'text-gray-500', glow: 'shadow-gray-500/50' },
  rare: { color: 'text-blue-500', glow: 'shadow-blue-500/50' },
  epic: { color: 'text-purple-500', glow: 'shadow-purple-500/50' },
  legendary: { color: 'text-yellow-500', glow: 'shadow-yellow-500/50' },
};
```

### Testing Phase 2

1. **Type Check**: `npm run type-check` → Zero errors
2. **Import Seed Data**: Create test script that imports all seed files
3. **Validate JSON**: Ensure all JSON files are valid
4. **Check Names Count**: Verify 500+ names across ethnic groups
5. **Check Subject Coverage**: Verify subjects for all grade levels (1-12)
6. **Check Badge Count**: Verify 40 unique badges
7. **Verify Bilingual Content**: All names, badges, activities have EN & NE versions

### Verification Checklist
- [ ] All type files created and compile successfully
- [ ] names.json has 500+ entries covering all ethnic groups
- [ ] subjects.json has CDC-aligned subjects for grades 1-12
- [ ] badges.json has 40 unique badges with bilingual content
- [ ] activities.json has templates for classroom moments
- [ ] festivals.json has major Nepali festivals
- [ ] constants.ts exports all XP, level, badge configurations
- [ ] All JSON files are valid and importable

---

## PHASE 3: Data Generation System

### Goal
Build a complete mock data generation system that creates realistic student profiles, parent relationships, teacher assignments, attendance records, grades, and activity feeds with proper temporal patterns.

### Acceptance Criteria
- ✅ Generator scripts create valid TypeScript objects
- ✅ 180 students generated (150 regular + 30 pre-school)
- ✅ 100 parents generated with proper parent-student relationships
- ✅ 15 teachers generated with class assignments
- ✅ 10,500+ attendance records with realistic patterns
- ✅ 300+ activity feed items with bilingual content and media
- ✅ All relationships properly linked (parent-student, teacher-class)
- ✅ Generated data exports to JSON files
- ✅ Data can be imported and used in components without errors

### Tasks

**3.1 Create Generator Utilities**

**`src/data/generators/utils.ts`**:
```typescript
import { faker } from '@faker-js/faker';
import names from '../seeds/names.json';

export function getRandomNepaliName(gender?: 'male' | 'female') {
  const filtered = gender
    ? names.names.filter(n => n.gender === gender)
    : names.names;
  return faker.helpers.arrayElement(filtered);
}

export function generateId(prefix: string): string {
  return `${prefix}-${faker.string.uuid().slice(0, 8)}`;
}

export function isSchoolDay(date: Date): boolean {
  const day = date.getDay();
  return day !== 0 && day !== 6; // Not Sunday or Saturday
}
```

**3.2 Create Student Generator**

**`src/data/generators/generateStudents.ts`**:
```typescript
import { Student } from '@/types/user.types';
import { getRandomNepaliName, generateId } from './utils';

export function generateStudents(count: number = 150): Student[] {
  const students: Student[] = [];
  const grades = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  const sections = ['A', 'B'];

  for (let i = 0; i < count; i++) {
    const nameData = getRandomNepaliName();
    const grade = faker.helpers.arrayElement(grades);
    const section = faker.helpers.arrayElement(sections);

    const student: Student = {
      id: generateId('STU'),
      userId: generateId('USER'),
      role: 'student',
      email: faker.internet.email(),
      phone: faker.phone.number(),
      firstName: nameData.firstName.en,
      lastName: nameData.lastName.en,
      firstNameNepali: nameData.firstName.ne,
      lastNameNepali: nameData.lastName.ne,
      avatarUrl: `/avatars/${generateId('AVT')}.svg`,
      rollNumber: `${grade}-${section}-${String(i + 1).padStart(2, '0')}`,
      gradeLevel: grade,
      section,
      dateOfBirth: faker.date.between({
        from: '2008-01-01',
        to: '2018-12-31'
      }),
      ethnicity: nameData.ethnicity,
      gamification: initializeGamification(),
      parentIds: [],
      createdAt: new Date(),
    };

    students.push(student);
  }

  return students;
}

function initializeGamification() {
  return {
    xp: faker.number.int({ min: 0, max: 1000 }),
    level: faker.number.int({ min: 1, max: 10 }),
    badges: [],
    streaks: [],
  };
}
```

**3.3 Create Additional Generators**
- `generateParents.ts` - Creates parents and links to students
- `generateTeachers.ts` - Creates teachers with subject specializations
- `generateAttendance.ts` - Creates 10,500+ attendance records with patterns
- `generateGrades.ts` - Creates grade records across terms
- `generateAssignments.ts` - Creates homework assignments
- `generateActivityFeed.ts` - Creates 300+ feed items with temporal patterns
- `generateMilestones.ts` - Creates pre-school developmental data

**3.4 Create Main Generation Script**

**`src/data/generators/index.ts`**:
```typescript
import fs from 'fs';
import path from 'path';
import { generateStudents } from './generateStudents';
import { generateParents } from './generateParents';
import { generateTeachers } from './generateTeachers';
import { generateAttendance } from './generateAttendance';
import { generateActivityFeed } from './generateActivityFeed';
// ... import other generators

export async function generateAllData() {
  console.log('🚀 Generating mock data for EduNexus...\n');

  // Generate entities
  const students = generateStudents(150);
  const preschoolStudents = generatePreschoolStudents(30);
  const parents = generateParents(100);
  const teachers = generateTeachers(15);

  // Link relationships
  linkParentsToStudents(parents, students);
  assignTeachersToClasses(teachers);

  // Generate temporal data
  const attendance = generateAttendance(students, 70); // 70 days
  const grades = generateGrades(students);
  const assignments = generateAssignments(teachers);
  const activityFeed = generateActivityFeed(students, teachers, 90); // 90 days

  // Generate gamification
  const badges = generateBadges(students);
  const streaks = calculateStreaks(students, attendance);

  // Pre-school specific
  const milestones = generateMilestones(preschoolStudents);

  // Save to JSON files
  const outputDir = path.join(process.cwd(), 'src', 'data', 'generated');

  fs.writeFileSync(
    path.join(outputDir, 'students.json'),
    JSON.stringify(students, null, 2)
  );

  // ... save all other data

  console.log('✅ Mock data generation complete!\n');
  console.log(`📊 Generated:`);
  console.log(`   - ${students.length} students`);
  console.log(`   - ${parents.length} parents`);
  console.log(`   - ${teachers.length} teachers`);
  console.log(`   - ${attendance.length} attendance records`);
  console.log(`   - ${activityFeed.length} activity feed items`);
}

// Run if called directly
if (require.main === module) {
  generateAllData();
}
```

**3.5 Add NPM Script**

**`package.json`**:
```json
{
  "scripts": {
    "generate:data": "ts-node src/data/generators/index.ts"
  }
}
```

### Testing Phase 3

1. **Run Generator**: `npm run generate:data` → Completes without errors
2. **Check Output Files**: Verify all JSON files created in `src/data/generated/`
3. **Validate Counts**:
   - 150 students in students.json
   - 100 parents in parents.json
   - 15 teachers in teachers.json
   - 10,500+ attendance records
   - 300+ activity feed items
4. **Check Relationships**:
   - Each student has 1-2 parent IDs
   - Each parent has 1-2 student IDs
   - All parent/student IDs exist in their respective arrays
5. **Verify Bilingual Content**: Activity feed has both EN and NE versions
6. **Check Temporal Patterns**:
   - Attendance records only on weekdays
   - Activity feed posts during school hours (10 AM - 4 PM)
   - No posts on weekends/holidays
7. **Import Test**: Create test component that imports and displays data

### Verification Checklist
- [ ] All generator scripts created and run without errors
- [ ] 180 total students generated (150 + 30 preschool)
- [ ] 100 parents with proper relationships
- [ ] 15 teachers with class assignments
- [ ] 10,500+ attendance records with realistic patterns
- [ ] 300+ activity feed items with bilingual content
- [ ] All relationships validated (no orphaned IDs)
- [ ] Temporal patterns correct (weekdays only, school hours)
- [ ] Generated JSON files are valid and importable
- [ ] Data includes proper ethnic diversity across names

---

## PHASE 4: Landing Page & Role Selection

### Goal
Create an impressive landing page and intuitive role selection interface that allows users to choose their persona (Parent, Student, Teacher, Pre-school).

### Acceptance Criteria
- ✅ Landing page loads and looks visually appealing
- ✅ Hero section with animated gradient background
- ✅ Language toggle visible and functional
- ✅ Role selection page shows 4 role cards
- ✅ Clicking a role card sets the role in authStore and navigates to dashboard
- ✅ Role persists across page refreshes
- ✅ Mobile responsive (looks good on phone screens)
- ✅ Animations smooth (60fps)

### Tasks

**4.1 Create Landing Page**

**`src/app/page.tsx`**:
```typescript
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useLocaleStore } from '@/store/localeStore';

export default function LandingPage() {
  const { locale } = useLocaleStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header with Language Toggle */}
      <header className="container mx-auto p-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">EduNexus</h1>
        <LanguageToggle />
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-6">
            {locale === 'en'
              ? 'Experience Education, Reimagined'
              : 'शिक्षा, नयाँ तरिकाले'}
          </h2>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12">
            {locale === 'en'
              ? 'Next-generation school management for Nepal'
              : 'नेपालको लागि अर्को पुस्ताको विद्यालय व्यवस्थापन'}
          </p>

          <Link href="/role-select">
            <Button size="lg" className="text-lg px-8 py-6">
              {locale === 'en' ? 'Explore Demo' : 'डेमो अन्वेषण गर्नुहोस्'}
            </Button>
          </Link>
        </motion.div>

        {/* Feature Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          {/* Four role preview cards */}
        </motion.div>
      </main>
    </div>
  );
}
```

**4.2 Create Role Selection Page**

**`src/app/(auth)/role-select/page.tsx`**:
```typescript
'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { useLocaleStore } from '@/store/localeStore';

const roles = [
  {
    id: 'parent',
    name: 'Parent',
    nameNe: 'अभिभावक',
    description: 'View your child\'s activity feed, grades, and attendance',
    icon: '👨‍👩‍👧',
    color: 'bg-blue-500',
  },
  {
    id: 'student',
    name: 'Student',
    nameNe: 'विद्यार्थी',
    description: 'Earn XP, unlock badges, and compete on leaderboards',
    icon: '🎓',
    color: 'bg-purple-500',
  },
  {
    id: 'teacher',
    name: 'Teacher',
    nameNe: 'शिक्षक',
    description: 'Manage attendance, grades, and assignments efficiently',
    icon: '👨‍🏫',
    color: 'bg-green-500',
  },
  {
    id: 'preschool',
    name: 'Pre-school Teacher',
    nameNe: 'पूर्वस्कूल शिक्षक',
    description: 'Track development with radar charts and photo evidence',
    icon: '🧸',
    color: 'bg-orange-500',
  },
];

export default function RoleSelectPage() {
  const router = useRouter();
  const { setRole, setUser } = useAuthStore();
  const { locale } = useLocaleStore();

  const handleRoleSelect = (roleId: string) => {
    setRole(roleId as any);

    // Set demo user based on role
    const demoUser = getDemoUserForRole(roleId);
    setUser(demoUser);

    // Navigate to role dashboard
    router.push(`/${roleId}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            {locale === 'en' ? 'Choose Your Role' : 'आफ्नो भूमिका छान्नुहोस्'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {locale === 'en'
              ? 'Select a persona to explore the demo'
              : 'डेमो अन्वेषण गर्न व्यक्तित्व चयन गर्नुहोस्'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role) => (
            <motion.div
              key={role.id}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                className="p-6 cursor-pointer hover:shadow-xl transition-all"
                onClick={() => handleRoleSelect(role.id)}
              >
                <div className={`w-16 h-16 ${role.color} rounded-full flex items-center justify-center text-3xl mb-4`}>
                  {role.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {locale === 'en' ? role.name : role.nameNe}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {role.description}
                </p>
                <Button className="w-full">
                  {locale === 'en' ? 'Explore' : 'अन्वेषण गर्नुहोस्'}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getDemoUserForRole(roleId: string) {
  // Return appropriate demo user data based on role
  // This would load from generated mock data
  return {
    id: `demo-${roleId}`,
    name: 'Demo User',
    // ... other properties
  };
}
```

**4.3 Create Auth Layout**

**`src/app/(auth)/layout.tsx`**:
```typescript
export default function AuthLayout({
  children,
}: {
  children: React.Node;
}) {
  return <div className="auth-layout">{children}</div>;
}
```

### Testing Phase 4

1. **Load Landing Page**: Navigate to `/` → Page loads with gradient background
2. **Test Language Toggle**: Click toggle → Text changes to Nepali
3. **Click Explore Button**: Click → Navigates to `/role-select`
4. **View Role Cards**: All 4 role cards visible with icons and descriptions
5. **Hover Animation**: Hover over card → Card lifts and scales slightly
6. **Select Role**: Click "Parent" card → Navigates to `/parent`
7. **Check Persistence**: Refresh page → Still shows as Parent role
8. **Mobile Test**: View on 375px width → Cards stack vertically, text readable
9. **Animation Performance**: Open DevTools Performance tab → 60fps confirmed

### Verification Checklist
- [ ] Landing page renders without errors
- [ ] Hero section displays with animated gradient
- [ ] Language toggle switches content between EN/NE
- [ ] Role selection page shows 4 role cards
- [ ] Role cards have proper icons, names, descriptions
- [ ] Clicking a role sets authStore and navigates to dashboard
- [ ] Role persists after page refresh
- [ ] Mobile responsive (320px - 768px tested)
- [ ] Animations run at 60fps
- [ ] Theme toggle works on both pages

---

## PHASE 5: Parent Dashboard

### Goal
Build a complete Parent persona dashboard with Facebook-style activity feed, one-tap actions (leave request, fee payment, PTM booking), and milestone celebrations.

### Acceptance Criteria
- ✅ Parent dashboard loads and displays activity feed
- ✅ Activity feed shows 300+ items with photos/videos
- ✅ Items load with infinite scroll (pagination)
- ✅ Can react to posts (like, clap, celebrate emojis)
- ✅ Leave request modal works end-to-end
- ✅ Fee payment modal shows pending fees
- ✅ PTM booking modal shows available slots
- ✅ Milestone celebration modal appears for achievements
- ✅ Parent gamification widget shows XP, level, badges
- ✅ Mobile responsive
- ✅ Bilingual content displays correctly

### Tasks

**5.1 Create Parent Dashboard Page**

**`src/app/(dashboard)/parent/page.tsx`**:
```typescript
'use client';

import { useEffect, useState } from 'react';
import ActivityFeed from '@/components/parent/ActivityFeed';
import QuickActions from '@/components/parent/QuickActions';
import ChildrenOverview from '@/components/parent/ChildrenOverview';
import ParentGamification from '@/components/parent/ParentGamification';
import { useAuthStore } from '@/store/authStore';
import activityFeedData from '@/data/generated/activityFeed.json';

export default function ParentDashboard() {
  const { user } = useAuthStore();
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Load activities for selected child
    if (selectedChildId) {
      const filtered = activityFeedData.filter(
        a => a.studentId === selectedChildId
      );
      setActivities(filtered);
    }
  }, [selectedChildId]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Parent Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <ChildrenOverview onSelectChild={setSelectedChildId} />
          <ActivityFeed activities={activities} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <QuickActions childId={selectedChildId} />
          <ParentGamification />
        </div>
      </div>
    </div>
  );
}
```

**5.2 Create Activity Feed Component**

**`src/components/parent/ActivityFeed.tsx`**:
```typescript
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ActivityCard from './ActivityCard';
import { Button } from '@/components/ui/button';

export default function ActivityFeed({ activities }) {
  const [displayCount, setDisplayCount] = useState(10);

  const loadMore = () => {
    setDisplayCount(prev => prev + 10);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Activity Timeline</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Today</Button>
          <Button variant="outline" size="sm">This Week</Button>
          <Button variant="outline" size="sm">This Month</Button>
        </div>
      </div>

      {activities.slice(0, displayCount).map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <ActivityCard activity={activity} />
        </motion.div>
      ))}

      {displayCount < activities.length && (
        <Button onClick={loadMore} className="w-full">
          Load More
        </Button>
      )}
    </div>
  );
}
```

**5.3 Create Activity Card Component**

**`src/components/parent/ActivityCard.tsx`**:
```typescript
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { useLocaleStore } from '@/store/localeStore';

export default function ActivityCard({ activity }) {
  const { locale } = useLocaleStore();
  const [reactions, setReactions] = useState(activity.reactions || []);
  const [hasReacted, setHasReacted] = useState(false);

  const handleReaction = (type: string) => {
    if (!hasReacted) {
      setReactions([...reactions, { type, userId: 'current-user' }]);
      setHasReacted(true);
    }
  };

  const title = locale === 'en' ? activity.title : activity.titleNe;
  const content = locale === 'en' ? activity.content : activity.contentNe;

  return (
    <Card className="p-6">
      {/* Author Info */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={activity.authorAvatar}
          alt={activity.authorName}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="font-semibold">{activity.authorName}</p>
          <p className="text-sm text-gray-500">
            {formatDistance(new Date(activity.timestamp), new Date(), { addSuffix: true })}
          </p>
        </div>
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-700 dark:text-gray-300 mb-4">{content}</p>

      {/* Media */}
      {activity.mediaItems?.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {activity.mediaItems.map(media => (
            <img
              key={media.id}
              src={media.url}
              alt={media.caption}
              className="w-full h-48 object-cover rounded-lg cursor-pointer"
              onClick={() => {/* Open lightbox */}}
            />
          ))}
        </div>
      )}

      {/* Reactions Bar */}
      <div className="flex items-center gap-4 border-t pt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleReaction('heart')}
          className={hasReacted ? 'text-red-500' : ''}
        >
          <Heart className="w-4 h-4 mr-1" />
          {reactions.length}
        </Button>
        <Button variant="ghost" size="sm">
          <MessageCircle className="w-4 h-4 mr-1" />
          Comment
        </Button>
        <Button variant="ghost" size="sm">
          <Share2 className="w-4 h-4 mr-1" />
          Share
        </Button>
      </div>
    </Card>
  );
}
```

**5.4 Create Quick Actions Component**

**`src/components/parent/QuickActions.tsx`**:
```typescript
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, CreditCard, Calendar, BarChart } from 'lucide-react';
import LeaveRequestModal from './LeaveRequestModal';
import FeePaymentModal from './FeePaymentModal';
import PTMBookingModal from './PTMBookingModal';

export default function QuickActions({ childId }) {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <>
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => setActiveModal('leave')}
          >
            <FileText className="w-4 h-4 mr-2" />
            Leave Request
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => setActiveModal('fee')}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Pay Fees
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => setActiveModal('ptm')}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Book PTM
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <BarChart className="w-4 h-4 mr-2" />
            View Report Card
          </Button>
        </div>
      </Card>

      {/* Modals */}
      {activeModal === 'leave' && (
        <LeaveRequestModal
          childId={childId}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === 'fee' && (
        <FeePaymentModal
          childId={childId}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === 'ptm' && (
        <PTMBookingModal
          childId={childId}
          onClose={() => setActiveModal(null)}
        />
      )}
    </>
  );
}
```

**5.5 Create Modal Components**

Implement:
- `LeaveRequestModal.tsx` - Date picker, reason selector, submit
- `FeePaymentModal.tsx` - Fee breakdown, payment method selector
- `PTMBookingModal.tsx` - Teacher selector, available slots calendar

**5.6 Create Parent Gamification Widget**

**`src/components/parent/ParentGamification.tsx`**:
```typescript
'use client';

import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export default function ParentGamification() {
  // Load from parent profile
  const xp = 850;
  const level = 8;
  const nextLevelXP = 1000;
  const progress = (xp / nextLevelXP) * 100;

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Your Parent Profile</h3>

      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="font-semibold">Level {level} - "Super Parent"</span>
          <span className="text-sm text-gray-500">{xp} / {nextLevelXP} XP</span>
        </div>
        <Progress value={progress} className="h-3" />
      </div>

      <div className="mb-4">
        <p className="text-sm font-semibold mb-2">Earned Badges:</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">💬 Active Communicator</Badge>
          <Badge variant="secondary">🎯 Responsible</Badge>
          <Badge variant="secondary">📅 Scheduler</Badge>
        </div>
      </div>

      <div className="text-sm text-gray-600">
        <p className="mb-1"><strong>Earn XP by:</strong></p>
        <ul className="list-disc list-inside space-y-1">
          <li>Viewing updates (+5 XP)</li>
          <li>Responding to teachers (+10 XP)</li>
          <li>Attending PTM (+50 XP)</li>
          <li>Early fee payment (+25 XP)</li>
        </ul>
      </div>
    </Card>
  );
}
```

### Testing Phase 5

1. **Load Dashboard**: Navigate to `/parent` → Dashboard loads
2. **View Activity Feed**: Scroll through feed → Activities display with photos
3. **Test Infinite Scroll**: Scroll to bottom → "Load More" button appears
4. **Click Load More**: Click button → Next 10 activities load
5. **React to Post**: Click heart icon → Count increments, icon turns red
6. **Open Leave Request**: Click "Leave Request" → Modal opens
7. **Fill Leave Form**: Select date, reason → Form validates
8. **Submit Leave**: Click submit → Success message appears, modal closes
9. **Open Fee Payment**: Click "Pay Fees" → Shows pending fees breakdown
10. **Open PTM Booking**: Click "Book PTM" → Shows available slots
11. **Check Bilingual**: Toggle language → All content switches to Nepali
12. **Test Mobile**: View on 375px → Layout stacks vertically, usable
13. **Check Performance**: Activity feed scroll at 60fps

### Verification Checklist
- [ ] Parent dashboard loads without errors
- [ ] Activity feed displays 300+ items from mock data
- [ ] Infinite scroll works (loads 10 at a time)
- [ ] Can react to posts (heart, clap, celebrate)
- [ ] Leave request modal functional end-to-end
- [ ] Fee payment modal shows correct fee data
- [ ] PTM booking modal shows available slots
- [ ] Parent gamification widget shows XP, level, badges
- [ ] All text switches between EN/NE
- [ ] Mobile responsive (320px - 768px)
- [ ] Photos display in activity cards
- [ ] Timestamp shows "2 hours ago" format
- [ ] Theme toggle works on dashboard

---

## PHASE 6: Student Dashboard

### Goal
Build a complete Student persona dashboard with gamified experience including XP system, avatar customization, homework submission, study squads, and focus mode.

### Acceptance Criteria
- ✅ Student dashboard loads and displays XP progress
- ✅ XP bar animates when XP is added
- ✅ Level-up animation triggers when reaching new level
- ✅ Badge collection grid displays earned badges
- ✅ Avatar customizer allows selecting different items
- ✅ Homework submission supports multiple formats (photo, video, text, file)
- ✅ Camera interface works for homework photos
- ✅ Study squads list shows available squads
- ✅ Focus mode timer counts down properly
- ✅ Mood check-in widget appears daily
- ✅ Streaks counter displays correctly
- ✅ All features work on mobile
- ✅ Bilingual content throughout

### Tasks

**6.1 Create Student Dashboard Page**

**6.2 Implement XP System Components**
- `XPProgressBar.tsx` - Animated progress bar with level display
- `LevelUpAnimation.tsx` - Full-screen celebration on level-up
- `BadgeDisplay.tsx` - Grid of earned badges with rarity glow
- `StreakCounter.tsx` - Display for homework/attendance streaks

**6.3 Create Avatar Customization**
- `AvatarCustomizer.tsx` - Live preview + category tabs + item grid
- Use @dicebear/avatars or custom SVG system
- Lock/unlock items based on XP/level

**6.4 Build Homework System**
- `HomeworkList.tsx` - List with filters (All, Pending, Submitted)
- `HomeworkSubmission.tsx` - Multi-format upload interface
- Camera interface for photo capture
- File upload for documents
- Text editor for typed responses

**6.5 Implement Study Squads**
- `StudySquadsList.tsx` - My Squads, Discover, Create
- `SquadChat.tsx` - Chat interface with peer recognition
- Message list with emoji reactions
- Helper badge awarding system

**6.6 Create Focus Mode**
- `FocusMode.tsx` - Timer with activity selection
- Countdown display with progress circle
- Break reminders
- Completion celebration with bonus XP

**6.7 Add Mood Check-in**
- `MoodCheckIn.tsx` - Daily popup with emoji selection
- Mood tracking dashboard (7-day history)
- Optional reason selection

### Testing Phase 6

1. **Load Dashboard**: Navigate to `/student` → Dashboard loads with XP bar
2. **Check XP Display**: XP shows correctly (e.g., "Level 8 - 750/1000 XP")
3. **Add XP**: Trigger XP gain (e.g., submit homework) → Bar animates, toast notification
4. **Level Up**: Add enough XP to level up → Full-screen animation plays
5. **View Badges**: Check badge grid → Earned badges displayed with glow effect
6. **Open Avatar Customizer**: Click customize → Editor opens with preview
7. **Change Avatar**: Select different items → Preview updates in real-time
8. **Save Avatar**: Click save → Avatar updates on dashboard
9. **View Homework**: Navigate to assignments → List shows pending homework
10. **Submit Homework**: Click submit → Multi-format option appears
11. **Take Photo**: Choose photo → Camera opens, can capture and submit
12. **Upload File**: Choose file → Can select PDF/DOC from device
13. **Check Submission**: After submit → Shows as submitted with timestamp
14. **Join Squad**: Navigate to squads → Can view and join study squads
15. **Send Message**: In squad chat → Message appears, can react with emojis
16. **Start Focus Mode**: Click focus → Timer starts counting down
17. **Complete Session**: Wait for timer → Completion celebration + bonus XP
18. **Mood Check-in**: Open dashboard (first time today) → Mood popup appears
19. **Select Mood**: Choose emoji → XP awarded, popup closes
20. **Test Bilingual**: Toggle language → All content switches to Nepali
21. **Mobile Test**: View on phone → All features work, buttons tappable

### Verification Checklist
- [ ] Student dashboard loads without errors
- [ ] XP bar displays current level and progress
- [ ] XP gain triggers smooth animation
- [ ] Level-up shows full-screen celebration
- [ ] Badge grid displays all earned badges
- [ ] Avatar customizer works end-to-end
- [ ] Homework submission supports all formats (photo, file, text)
- [ ] Camera interface functional for photos
- [ ] Study squads list and chat work
- [ ] Peer recognition system awards helper badges
- [ ] Focus mode timer counts down correctly
- [ ] Focus completion awards bonus XP
- [ ] Mood check-in appears once daily
- [ ] Mood tracking dashboard shows 7-day history
- [ ] Streaks display correctly
- [ ] All features mobile-responsive
- [ ] Bilingual content throughout
- [ ] Animations run at 60fps

---

## PHASE 7: Teacher Dashboard

### Goal
Build Teacher persona dashboard with spreadsheet-style grade entry, one-tap attendance, quick moment posting, and bulk actions.

### Acceptance Criteria
- ✅ Teacher dashboard loads and shows today's schedule
- ✅ Grade entry table allows Excel-like navigation (Tab, Enter, arrows)
- ✅ Grade entry auto-saves and shows save timestamp
- ✅ Bulk actions work (mark multiple as absent, copy grades)
- ✅ Attendance grid allows tap-to-cycle (present → absent → late)
- ✅ "Mark All Present" button works
- ✅ Quick moment posting allows photo/video capture
- ✅ Can tag students in posts
- ✅ Posts appear in parent activity feeds
- ✅ Leave approval list shows pending requests
- ✅ Offline mode indicator appears when offline
- ✅ Changes sync when back online
- ✅ Mobile responsive
- ✅ Bilingual

### Tasks

**7.1 Create Teacher Dashboard**
- Today's schedule widget
- Pending tasks summary
- Quick action buttons
- Class selector dropdown

**7.2 Build Grade Entry Interface**
- Excel-like table with keyboard navigation
- Auto-save functionality
- Bulk actions toolbar
- Stats footer (average, highest, lowest)
- Feedback modal for individual students

**7.3 Implement Attendance System**
- Two view modes: List and Grid
- One-tap marking in grid view
- "Mark All Present" quick action
- Attendance patterns (copy from yesterday, known absences)
- Leave requests integration

**7.4 Create Moment Posting**
- Camera interface (photo/video)
- Student tagging (search + multi-select)
- Caption with bilingual input
- Activity type selector
- Post to parent feeds

**7.5 Add Bulk Operations**
- Bulk homework assignment
- Bulk message broadcast
- Leave approval queue
- Multi-select actions

**7.6 Implement Offline Mode**
- Offline detection
- Sync queue display
- Auto-sync when online
- Conflict resolution

### Testing Phase 7

1. **Load Dashboard**: Navigate to `/teacher` → Shows current class
2. **View Schedule**: Check today's schedule → Shows periods and subjects
3. **Open Grade Entry**: Click "Enter Grades" → Spreadsheet table opens
4. **Tab Navigation**: Press Tab → Focus moves to next cell
5. **Enter Grade**: Type score → Auto-calculates letter grade
6. **Save Grades**: Changes auto-save → Timestamp updates
7. **Bulk Action**: Select multiple students → Mark as absent
8. **Open Attendance**: Click "Mark Attendance" → Grid view opens
9. **Tap to Mark**: Tap student cell → Cycles through present/absent/late
10. **Mark All Present**: Click button → All students marked present
11. **Submit Attendance**: Click submit → Confirmation message
12. **Take Photo**: Click "Post Moment" → Camera opens
13. **Capture Photo**: Take photo → Preview appears
14. **Tag Students**: Search students → Select multiple → Tagged
15. **Post Moment**: Add caption → Post → Appears in parent feeds
16. **Bulk Assignment**: Click "Assign Homework" → Multi-class selection
17. **Fill Assignment**: Add details → Assign to 2 classes → Confirmation
18. **Go Offline**: Disconnect internet → Offline banner appears
19. **Make Changes**: Enter grades offline → Saves to queue
20. **Go Online**: Reconnect → Changes sync automatically
21. **Test Mobile**: View on tablet → Tables scroll horizontally, usable

### Verification Checklist
- [ ] Teacher dashboard loads without errors
- [ ] Today's schedule displays correctly
- [ ] Grade entry table supports keyboard navigation
- [ ] Auto-save works with timestamp
- [ ] Bulk actions functional (select multiple, action once)
- [ ] Attendance grid allows tap-to-cycle
- [ ] "Mark All Present" works
- [ ] Moment posting allows photo/video capture
- [ ] Can tag multiple students in posts
- [ ] Posts appear in tagged students' parent feeds
- [ ] Leave approval queue shows pending requests
- [ ] Offline mode detected and indicated
- [ ] Changes queue and sync when online
- [ ] Mobile responsive (tablet size minimum)
- [ ] Bilingual content throughout

---

## PHASE 8: Pre-school Module

### Goal
Build Pre-school teacher persona with activity-based tracking, radar charts for development, photo/video evidence logging, and holistic progress report generation.

### Acceptance Criteria
- ✅ Pre-school dashboard shows class overview
- ✅ Activity logging flow works end-to-end (capture evidence → tag children → map domains)
- ✅ Radar chart displays 5-dimension development correctly
- ✅ Can view individual child profile with radar chart
- ✅ Photo/video evidence displays in child portfolio
- ✅ Can generate progress report (HPRC)
- ✅ Report shows radar chart, photos, teacher narrative
- ✅ Quick activity templates speed up logging
- ✅ Mobile responsive
- ✅ Bilingual

### Tasks

**8.1 Create Pre-school Dashboard**
- Class overview (Butterfly/Sunshine class)
- Activity logging quick action
- Development coverage widget
- Recent activities list

**8.2 Build Activity Logging Flow**
- Multi-step modal:
  - Step 1: Select activity type
  - Step 2: Capture evidence (photo/video)
  - Step 3: Tag children with notes
  - Step 4: Map to development domains
  - Step 5: Confirmation
- Quick templates for common activities

**8.3 Implement Radar Chart**
- 5-dimension visualization (Physical, Cognitive, Social, Emotional, Language)
- Interactive (tap dimension for details)
- Compare mode (vs class average, vs previous term)
- Export/share functionality

**8.4 Create Child Profile View**
- Child info card
- Radar chart visualization
- Strengths and growth areas
- Activity evidence list (photos/videos)
- Recent observations
- PTM scheduler

**8.5 Build Report Generator**
- Report configuration modal
- HPRC template with:
  - Child profile
  - Radar chart
  - Development narratives (bilingual)
  - Photo gallery (top moments)
  - Teacher's holistic note
  - Student voice section
- Preview and export (PDF/web view)

**8.6 Add Quick Templates**
- Pre-filled activity templates
- One-tap capture and save
- Common activities (Morning Art, Circle Time, Outdoor Play)

### Testing Phase 8

1. **Load Dashboard**: Navigate to `/preschool` → Shows class overview
2. **View Coverage**: Check development coverage → Shows progress bars for 5 domains
3. **Log Activity**: Click "Log Activity" → Modal opens
4. **Select Activity**: Choose "Art & Craft" → Next step
5. **Capture Evidence**: Take 3 photos → Photos appear in preview
6. **Tag Children**: Select 10 children → Add individual notes
7. **Map Domains**: Check "Fine Motor" and "Creativity" → Next
8. **Confirm**: Review and submit → Success message
9. **View Child Profile**: Click on student → Profile opens
10. **Check Radar Chart**: View 5-dimension chart → Properly visualized
11. **Click Dimension**: Tap "Physical" → Shows breakdown with supporting evidence
12. **View Portfolio**: Navigate to portfolio → Photos/videos display
13. **Generate Report**: Click "Generate Report" → Configuration modal opens
14. **Configure Report**: Select components, format (PDF), language (Both)
15. **Preview Report**: Click preview → Report displays with all sections
16. **Export Report**: Click export → PDF downloads
17. **Quick Template**: Use "Morning Art" template → Pre-filled, one-tap save
18. **Test Bilingual**: Toggle language → All content switches
19. **Mobile Test**: View on tablet → Charts render, forms usable

### Verification Checklist
- [ ] Pre-school dashboard loads without errors
- [ ] Activity logging flow complete (5 steps)
- [ ] Can capture multiple photos/videos as evidence
- [ ] Can tag multiple children with individual notes
- [ ] Domain mapping works (multi-select)
- [ ] Radar chart displays 5 dimensions correctly
- [ ] Radar chart interactive (tap for details)
- [ ] Child profile shows complete information
- [ ] Portfolio displays all evidence (photos/videos)
- [ ] Report generator works end-to-end
- [ ] Generated report includes all sections
- [ ] Report has bilingual content when selected
- [ ] Quick templates speed up activity logging
- [ ] Mobile responsive (tablet minimum)
- [ ] All content bilingual

---

## PHASE 9: Demo Features & Interactive Tutorials

### Goal
Add interactive tours, contextual tooltips, demo hints, and admin panel for data refresh to make the application easy to showcase and demo.

### Acceptance Criteria
- ✅ Interactive tour launches on first visit
- ✅ Tour highlights key features with spotlight effect
- ✅ Tour can be skipped or completed
- ✅ Help button (?) allows re-launching tour
- ✅ Contextual tooltips appear on hover
- ✅ Feature discovery hints for unused features
- ✅ Empty state guidance messages helpful
- ✅ "Demo Mode" banner visible
- ✅ Admin panel accessible (hidden shortcut)
- ✅ Can reset demo data from admin panel
- ✅ Can switch scenarios (high performer, struggling, etc.)
- ✅ Can regenerate specific data sets

### Tasks

**9.1 Build Tour Framework**
- `InteractiveTour.tsx` component
- Spotlight overlay (dims background, highlights element)
- Tour step modal with navigation
- Progress indicator
- Tour definitions for each persona
- Welcome modal on first visit
- Help button to re-launch tour

**9.2 Add Contextual Tooltips**
- Hover tooltips on all icons/buttons
- Inline helper text (💡 tips)
- Feature discovery pulsing dots
- Empty state guidance messages
- Smart hints based on usage

**9.3 Create Demo Indicators**
- "Demo Mode" banner at top
- Demo data badges on cards
- Explanation tooltips

**9.4 Build Admin Panel**
- Hidden keyboard shortcut (Ctrl+Shift+D)
- Admin panel modal with:
  - Reset demo button
  - Scenario switcher
  - Data regeneration controls
  - Demo stats viewer
- Password/IP protection (optional)

**9.5 Implement Scenario Presets**
- High Performer scenario
- Average Student scenario
- Struggling Student scenario
- New Student scenario
- One-click switch between scenarios

### Testing Phase 9

1. **First Visit**: Clear localStorage → Visit site → Welcome modal appears
2. **Start Tour**: Click "Start Tour" → Tour begins with spotlight
3. **Navigate Tour**: Click "Next" → Moves to next step, spotlight follows
4. **Complete Tour**: Finish all steps → Tour closes, "?" button appears
5. **Re-launch Tour**: Click "?" button → Tour starts again
6. **Skip Tour**: Click "Skip" on step 3 → Tour closes immediately
7. **Hover Tooltips**: Hover over icons → Tooltips appear after 500ms
8. **Feature Discovery**: Don't use a feature → Pulsing dot appears after 1 min
9. **Click Hint**: Click pulsing dot → Tooltip explains feature
10. **Empty State**: View page with no data → Helpful guidance message
11. **Open Admin Panel**: Press Ctrl+Shift+D → Admin panel opens
12. **Reset Demo**: Click "Reset Demo" → Data resets, page refreshes
13. **Switch Scenario**: Select "High Performer" → Student profile changes
14. **Regenerate Data**: Click "Regenerate Activity Feed" → New activities appear
15. **View Stats**: Check demo stats → Shows views per persona, time spent

### Verification Checklist
- [ ] Interactive tour framework works
- [ ] Tour can be completed or skipped
- [ ] Help button re-launches tour
- [ ] Contextual tooltips on all interactive elements
- [ ] Feature discovery hints appear for unused features
- [ ] Empty states have helpful messages
- [ ] "Demo Mode" banner visible
- [ ] Admin panel accessible via shortcut
- [ ] Reset demo functionality works
- [ ] Scenario switching works
- [ ] Data regeneration works for specific sets
- [ ] All demo features bilingual

---

## PHASE 10: Bilingual Content & Nepali Localization

### Goal
Complete all translations, ensure seamless bilingual experience throughout the application, and add Nepali-specific features (calendar, numerals).

### Acceptance Criteria
- ✅ All static content has EN & NE translations
- ✅ All dynamic content (activity feed, etc.) has templates for both languages
- ✅ Language toggle works on every page
- ✅ Nepali font renders correctly on all devices
- ✅ Optional Devanagari numeral display works
- ✅ Nepali calendar dates display alongside Gregorian
- ✅ Festival dates marked on calendar
- ✅ Number formatting respects locale (12,345.67 vs १२,३४५.६७)
- ✅ Date formatting respects locale ("January 3, 2026" vs "२०२६ जनवरी ३")

### Tasks

**10.1 Create Translation Files**
- Complete `en/common.json`, `en/parent.json`, `en/student.json`, etc.
- Complete `ne/common.json`, `ne/parent.json`, `ne/student.json`, etc.
- Ensure all UI strings translated
- Ensure all error messages translated

**10.2 Implement Dynamic Content Templates**
- Activity feed templates (EN/NE)
- Notification templates (EN/NE)
- Achievement messages (EN/NE)
- Error messages (EN/NE)

**10.3 Add Nepali Calendar Support**
- Bikram Sambat date conversion
- Display both Gregorian and BS dates
- Festival dates marked on calendar

**10.4 Implement Devanagari Numerals**
- Optional toggle in settings
- Convert numbers (0-9 → ०-९)
- Apply to XP, grades, dates where selected

**10.5 Add Cultural Icons**
- Nepali flag emoji in language toggle
- Traditional symbols in badges (lotus, temple, mountains)
- Festival-specific graphics

**10.6 Test All Flows in Nepali**
- Complete user journey in Nepali
- Ensure text doesn't overflow
- Check font rendering
- Verify proper Unicode support

### Testing Phase 10

1. **Toggle Language**: On landing page → Click toggle → Content switches to Nepali
2. **Navigate Flows**: Complete parent flow in Nepali → All text in Nepali
3. **Check Font**: Verify Noto Sans Devanagari loads → Text readable
4. **Test Forms**: Fill out form in Nepali → Submission works
5. **View Feed**: Activity feed in Nepali → All posts have Nepali versions
6. **Check Numbers**: View XP in Nepali → Optionally shows Devanagari numerals
7. **View Calendar**: Check calendar → Shows both Gregorian and BS dates
8. **Check Festivals**: Navigate to October → Dashain dates marked
9. **Test Mobile**: View Nepali text on phone → Properly sized, readable
10. **Test Overflow**: Long Nepali words in buttons → Don't overflow
11. **Cross-browser**: Test on Chrome, Firefox, Safari → Font renders consistently

### Verification Checklist
- [ ] All static content translated (EN & NE)
- [ ] All dynamic content has bilingual templates
- [ ] Language toggle works on all pages
- [ ] Nepali font (Noto Sans Devanagari) renders correctly
- [ ] Devanagari numeral toggle works
- [ ] Bikram Sambat calendar integration
- [ ] Festival dates marked on calendar
- [ ] Number formatting respects locale
- [ ] Date formatting respects locale
- [ ] No text overflow issues in Nepali
- [ ] Complete user flows work in Nepali
- [ ] Cross-browser font rendering consistent
- [ ] Mobile Nepali text properly sized

---

## PHASE 11: Visual Assets & Media Integration

### Goal
Source and integrate all visual assets including photos, videos, icons, badges, avatars, and illustrations.

### Acceptance Criteria
- ✅ 100+ classroom photos sourced and organized
- ✅ 50+ video clips sourced with thumbnails
- ✅ 200 student avatars generated
- ✅ 40 badge icons created/sourced
- ✅ All images optimized (WebP format where possible)
- ✅ EduNexus logo created and integrated
- ✅ Empty state illustrations added
- ✅ All media loads quickly (<2s)
- ✅ Images responsive (srcset for different sizes)

### Tasks

**11.1 Source Classroom Photos**
- Download 100+ photos from Unsplash/Pexels
- Categories: Science, Arts, Sports, Cultural, Classroom, Preschool
- Organize in `/public/images/moments/` by category
- Optimize to WebP format
- Generate thumbnails (400px width)

**11.2 Source Video Clips**
- Download 40 video clips from Pexels Video
- Categories: Science, Arts, Sports, Cultural
- Convert to MP4, H.264 codec, 720p
- Generate thumbnails at 2-second mark
- Store in `/public/videos/` by category

**11.3 Generate Student Avatars**
- Use @dicebear/avatars library
- Generate 200 unique avatars
- Ensure diverse skin tones and styles
- Export as SVG
- Store in `/public/avatars/`

**11.4 Create Badge Icons**
- Design or source 40 badge icons
- Categories: Academic, Attendance, Behavior, Special
- Create rarity variations (border/glow effects)
- Export as SVG 64×64px
- Store in `/public/badges/` by category

**11.5 Design EduNexus Logo**
- Create modern, clean logo
- Export in multiple sizes (16×16 to 512×512)
- Include favicon
- SVG for header, PNG for og:image

**11.6 Add Illustrations**
- Empty state illustrations (no homework, no squads, etc.)
- Error state illustrations
- Success state illustrations
- Source from undraw.co or similar
- Store in `/public/illustrations/`

**11.7 Optimize All Assets**
- Convert photos to WebP where supported
- Generate multiple sizes for responsive images
- Lazy load images below the fold
- Use Next.js Image component throughout

### Testing Phase 11

1. **Check Photos**: Navigate to activity feed → Photos load quickly
2. **View Videos**: Click video in feed → Plays smoothly
3. **Check Avatars**: View student profiles → Unique avatars display
4. **View Badges**: Check badge collection → All icons display with proper rarity
5. **Check Logo**: View header → Logo displays correctly
6. **Test Empty State**: View page with no data → Illustration appears
7. **Test Loading**: Check Network tab → Images load progressively
8. **Test Responsive**: View on different screen sizes → Correct image size loaded
9. **Check Optimization**: Verify image file sizes → All <200KB
10. **Test WebP**: Check in Chrome → WebP images used
11. **Test Fallback**: Check in older browser → PNG fallback works

### Verification Checklist
- [ ] 100+ classroom photos organized by category
- [ ] 40+ video clips with thumbnails
- [ ] 200 unique student avatars
- [ ] 40 badge icons with rarity variations
- [ ] EduNexus logo in all required sizes
- [ ] Empty state illustrations for all scenarios
- [ ] All images optimized (WebP where supported)
- [ ] All images <200KB file size
- [ ] Responsive images with srcset
- [ ] Lazy loading implemented
- [ ] Next.js Image component used throughout
- [ ] All media loads in <2s on 3G connection

---

## PHASE 12: Mobile Responsiveness & Final Polish

### Goal
Ensure excellent mobile experience across all personas and polish all UI details, animations, and accessibility.

### Acceptance Criteria
- ✅ All pages responsive (320px - 768px tested)
- ✅ Touch targets ≥44×44px
- ✅ Bottom navigation on mobile works
- ✅ Tables convert to cards on mobile
- ✅ Modals become full-screen on mobile
- ✅ Swipe gestures work (activity feed)
- ✅ Pull-to-refresh works
- ✅ All animations smooth (60fps)
- ✅ Keyboard navigation works everywhere
- ✅ WCAG AA color contrast met
- ✅ Focus indicators visible
- ✅ Screen reader labels present
- ✅ Performance score >90 on Lighthouse

### Tasks

**12.1 Mobile Layout Optimization**
- Test all pages on 320px, 375px, 414px, 768px widths
- Convert sidebars to bottom navigation
- Stack dashboard widgets vertically
- Make cards full-width
- Optimize form inputs for mobile keyboards

**12.2 Touch Optimization**
- Ensure all buttons ≥44×44px
- Add touch feedback (active states)
- Implement swipe gestures
- Add pull-to-refresh
- Optimize tap targets in tables

**12.3 Responsive Tables**
- Convert grade entry table to horizontal scroll
- Convert leaderboard to card view on mobile
- Sticky columns for important data

**12.4 Mobile Modals**
- Convert modals to full-screen on mobile
- Use bottom sheets (vaul library)
- Slide-up animations

**12.5 Animation Polish**
- Review all animations at 60fps
- Add loading skeletons
- Smooth page transitions
- Micro-interactions (button press, card hover)

**12.6 Accessibility Audit**
- Add ARIA labels to all interactive elements
- Ensure keyboard navigation works
- Check color contrast (WCAG AA)
- Add focus indicators
- Test with screen reader (basic)

**12.7 Performance Optimization**
- Code splitting by route
- Lazy load heavy components
- Optimize bundle size
- Implement React.memo where needed
- Check with Lighthouse

### Testing Phase 12

1. **Test 320px**: View entire app on iPhone SE → All content visible
2. **Test 375px**: View on iPhone 12 → Layouts look good
3. **Test 414px**: View on iPhone 14 Pro Max → Optimized for larger phones
4. **Test 768px**: View on iPad → Layouts adapt properly
5. **Touch Targets**: Try tapping all buttons → Easy to hit, no misclicks
6. **Swipe Feed**: Swipe right on activity card → Quick-react animation
7. **Pull to Refresh**: Pull down on feed → Loading indicator, refreshes
8. **Form Input**: Tap form field → Correct keyboard appears (tel, email, etc.)
9. **Table Scroll**: View grade table on phone → Scrolls horizontally smoothly
10. **Modal Test**: Open modal on phone → Full-screen, easy to dismiss
11. **Tab Navigation**: Use Tab key → Focus moves logically through elements
12. **Focus Visible**: Tab through page → Focus indicator clearly visible
13. **Color Contrast**: Use browser DevTools → All text passes WCAG AA
14. **Screen Reader**: Enable VoiceOver/TalkBack → Labels announced correctly
15. **Lighthouse**: Run audit → Performance, Accessibility, Best Practices >90

### Verification Checklist
- [ ] All pages tested on 320px, 375px, 414px, 768px
- [ ] All touch targets ≥44×44px
- [ ] Bottom navigation works on mobile
- [ ] Tables responsive (scroll or card view)
- [ ] Modals full-screen on mobile
- [ ] Swipe gestures implemented and smooth
- [ ] Pull-to-refresh works on feeds
- [ ] All animations run at 60fps
- [ ] Keyboard navigation complete
- [ ] WCAG AA color contrast met
- [ ] Focus indicators visible and clear
- [ ] Basic screen reader support
- [ ] Lighthouse Performance >90
- [ ] Lighthouse Accessibility >90
- [ ] Bundle size optimized (<500KB initial load)

---

## PHASE 13: Documentation & Final Deployment

### Goal
Create comprehensive documentation, prepare demo materials, and deploy the application to production.

### Acceptance Criteria
- ✅ README.md complete with setup instructions
- ✅ User guide created with screenshots
- ✅ Demo script written for presentations
- ✅ Mock data regeneration documented
- ✅ Application deployed to Vercel
- ✅ Live demo URL accessible
- ✅ No console errors in production
- ✅ Analytics setup (optional)

### Tasks

**13.1 Write README.md**
- Project overview
- Technology stack
- Installation instructions
- Development commands
- Deployment instructions
- License

**13.2 Create User Guide**
- How to navigate each persona
- Feature walkthroughs with screenshots
- Keyboard shortcuts
- Tips and tricks
- Troubleshooting

**13.3 Write Demo Script**
- 10-15 minute presentation flow
- Key features to highlight per persona
- Talking points (Nepal context, competitive advantages)
- Q&A preparation

**13.4 Document Mock Data**
- How to regenerate data
- Data volume and structure
- Customization options
- Seed data explanation

**13.5 Deploy to Vercel**
- Create Vercel account
- Connect GitHub repository
- Configure build settings
- Deploy production build
- Test deployed site
- Share demo URL

**13.6 Final Testing**
- Complete end-to-end test of all flows
- Test on multiple devices/browsers
- Check for console errors
- Verify performance
- Test with real users (if possible)

### Testing Phase 13

1. **Follow README**: Fresh clone → Follow setup instructions → App runs
2. **Check Documentation**: Read user guide → All features explained clearly
3. **Practice Demo**: Follow demo script → Flows logically for 10-15 min
4. **Regenerate Data**: Run `npm run generate:data` → New data created
5. **Deploy**: Push to Vercel → Build succeeds
6. **Test Deployed**: Visit live URL → All features work
7. **Check Performance**: Run Lighthouse on deployed site → >90 scores
8. **Cross-browser**: Test deployed site on Chrome, Firefox, Safari, Edge
9. **Mobile Test**: Test deployed site on iPhone and Android
10. **Share URL**: Send to friend → They can explore without issues

### Verification Checklist
- [ ] README.md complete and accurate
- [ ] User guide comprehensive with screenshots
- [ ] Demo script flows well (10-15 min)
- [ ] Mock data regeneration documented
- [ ] Successfully deployed to Vercel
- [ ] Live demo URL accessible
- [ ] No console errors in production
- [ ] Lighthouse scores >90 on live site
- [ ] Cross-browser compatibility confirmed
- [ ] Mobile testing complete
- [ ] Demo URL shareable and works for others

---

## Success Criteria Summary

At the end of all phases, the application must meet these criteria:

### Functional
- ✅ All four personas functional (Parent, Student, Teacher, Pre-school)
- ✅ Mock data loads and displays correctly
- ✅ All major features implemented and working
- ✅ Bilingual (EN/NE) throughout
- ✅ Mobile responsive (320px+)

### Visual
- ✅ Modern, professional UI
- ✅ Consistent design system
- ✅ Smooth animations (60fps)
- ✅ Beautiful photos and graphics
- ✅ Clear typography (including Nepali font)

### Performance
- ✅ Loads in <3 seconds
- ✅ Lighthouse scores >90
- ✅ Smooth scrolling and interactions
- ✅ Small bundle size (<500KB initial)

### Demo-Ready
- ✅ Interactive tours work
- ✅ Context hints helpful
- ✅ Easy to showcase
- ✅ Realistic mock data
- ✅ Admin panel for scenarios

### Cultural
- ✅ Nepali names and context
- ✅ CDC-aligned subjects
- ✅ Local festivals
- ✅ NPR currency
- ✅ Proper Devanagari rendering

---

## Next Steps After Completion

1. Demo to 10 schools in Kathmandu valley
2. Gather feedback from teachers, parents, students
3. Identify must-have features for production
4. Plan backend implementation
5. Seek seed funding
6. Launch pilot with 1 school

---

**Let's build an amazing demo that revolutionizes education in Nepal! 🇳🇵🚀**

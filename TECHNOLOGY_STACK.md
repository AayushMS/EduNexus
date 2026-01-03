# EduNexus - Technology Stack Documentation

## Frontend Framework & Core Libraries

### Next.js 14 (App Router)
**Version:** `^14.2.0`
**Why:**
- Server Components for better performance
- Built-in routing with layouts
- Image optimization out of the box
- Excellent TypeScript support
- Industry standard for React applications

**Key Features We'll Use:**
- App Router for file-based routing
- Server Components for static content
- Client Components for interactivity
- Dynamic routes for student/class pages
- API routes for mock data endpoints (optional)

---

## Language & Type Safety

### TypeScript
**Version:** `^5.4.0`
**Configuration:** Strict mode enabled

**Benefits:**
- Catch bugs at compile time
- Better IDE autocomplete
- Self-documenting code
- Easier refactoring

**Key Usage:**
- All components written in TypeScript
- Comprehensive type definitions for mock data
- Interfaces for all entities (Student, Parent, Teacher, etc.)

---

## Styling & UI

### Tailwind CSS
**Version:** `^3.4.0`
**Why:**
- Utility-first approach (rapid development)
- No CSS naming conflicts
- Excellent responsive design utilities
- Small production bundle (purges unused styles)
- Perfect for prototyping

**Custom Configuration:**
- Custom color palette (brand colors, gamification colors)
- Custom animations (level-up, badge-unlock, XP-gain)
- Nepali font integration
- Dark mode support
- Custom spacing/shadows

### shadcn/ui
**Why:**
- Copy-paste components (you own the code)
- Built on Radix UI (accessibility out of the box)
- Customizable with Tailwind
- No runtime overhead
- Beautiful, modern design

**Components We'll Use:**
```
- button, card, input, label, select, textarea
- dialog, dropdown-menu, sheet, popover
- badge, avatar, progress, separator
- tabs, table, calendar, tooltip
- scroll-area, command
```

---

## State Management

### Zustand
**Version:** `^4.5.0`
**Why:**
- Minimal boilerplate (5x less code than Redux)
- Excellent performance (selective re-renders)
- Built-in persistence middleware
- TypeScript-first
- No provider wrapper needed
- Perfect for medium-sized apps

**Stores:**
```typescript
- authStore.ts      // Role, user context
- localeStore.ts    // Language preference (EN/NE)
- themeStore.ts     // Dark/light mode
- gamificationStore.ts // XP, badges, streaks
- notificationStore.ts // Notifications queue
```

**Example Store:**
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  role: 'parent' | 'student' | 'teacher' | 'preschool' | null;
  user: User | null;
  setRole: (role: AuthState['role']) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      role: null,
      user: null,
      setRole: (role) => set({ role }),
      logout: () => set({ role: null, user: null }),
    }),
    { name: 'auth-storage' }
  )
);
```

---

## Internationalization (i18n)

### next-intl
**Version:** `^3.9.0`
**Why:**
- Built specifically for Next.js 14 App Router
- Server Component support
- Type-safe translations
- Integrated date/number formatting
- Better performance than react-i18next

**Translation Structure:**
```
/src/locales/
  /en/
    common.json
    parent.json
    student.json
    teacher.json
    preschool.json
  /ne/
    [same structure]
```

**Usage:**
```typescript
import { useTranslations } from 'next-intl';

function StudentDashboard() {
  const t = useTranslations('student');

  return <h1>{t('dashboard.title')}</h1>; // "Dashboard" or "ड्यासबोर्ड"
}
```

---

## Data Visualization

### Recharts
**Version:** `^2.12.0`
**Why:**
- React-native API (declarative)
- Responsive out of the box
- Supports all chart types we need (radar, line, bar, pie)
- Customizable with Tailwind
- Good documentation

**Charts We'll Use:**
- **Radar Chart:** Pre-school developmental assessment (5 dimensions)
- **Line Chart:** Grade trends over time
- **Bar Chart:** Attendance analytics
- **Pie Chart:** Fee payment breakdown (optional)

**Example:**
```typescript
import { RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';

const data = [
  { domain: 'Physical', value: 85 },
  { domain: 'Cognitive', value: 92 },
  { domain: 'Social', value: 78 },
  { domain: 'Emotional', value: 65 },
  { domain: 'Language', value: 88 },
];

<RadarChart data={data}>
  <PolarGrid />
  <PolarAngleAxis dataKey="domain" />
  <Radar dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
</RadarChart>
```

---

## Animations

### Framer Motion
**Version:** `^11.0.0`
**Why:**
- Industry-standard animation library
- Simple API for complex animations
- Built-in gesture support (drag, tap, hover)
- Excellent performance
- Perfect for gamification animations

**Use Cases:**
- Level-up celebration (scale + confetti)
- Badge unlock (slide in with rotation)
- XP gain notification (fade up with number)
- Page transitions (fade, slide)
- Micro-interactions (button hover, card lift)

**Example:**
```typescript
import { motion } from 'framer-motion';

<motion.div
  initial={{ scale: 0, rotate: -180 }}
  animate={{ scale: 1, rotate: 0 }}
  transition={{ type: "spring", stiffness: 260, damping: 20 }}
>
  <BadgeIcon />
</motion.div>
```

---

## Icons

### Lucide React
**Version:** `^0.344.0`
**Why:**
- Consistent, beautiful icons
- Tree-shakeable (only import icons you use)
- Customizable size and color
- SVG-based (scales perfectly)
- Active maintenance

**Usage:**
```typescript
import { Home, User, BookOpen, Trophy } from 'lucide-react';

<Home className="w-5 h-5 text-gray-600" />
```

---

## Mock Data Generation

### @faker-js/faker
**Version:** `^8.4.0`
**Why:**
- Rich API for generating realistic data
- Supports locales (including Nepali names with custom seed)
- Deterministic seed for consistent demos
- Type-safe with TypeScript
- Active maintenance

**Usage:**
```typescript
import { faker } from '@faker-js/faker';

const student = {
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  age: faker.number.int({ min: 5, max: 18 }),
  avatar: faker.image.avatar(),
};
```

**Custom Nepali Name Generation:**
```typescript
const nepaliNames = ['Aarav', 'Sita', 'Rohan', 'Priya', ...];
const randomNepaliName = faker.helpers.arrayElement(nepaliNames);
```

---

## Date Handling

### date-fns
**Version:** `^3.3.0`
**Why:**
- Lightweight (only import functions you need)
- Immutable (no mutation bugs)
- TypeScript support
- Consistent API
- Better than moment.js (smaller, modern)

**Usage:**
```typescript
import { format, formatDistance, differenceInDays } from 'date-fns';

format(new Date(), 'PPP'); // "January 3, 2026"
formatDistance(new Date(), submissionDate); // "2 hours ago"
```

---

## Utility Libraries

### clsx & tailwind-merge
**Versions:** `^2.1.0` & `^2.2.0`
**Why:**
- Conditionally construct className strings
- Merge Tailwind classes without conflicts

**Usage:**
```typescript
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usage in component
<div className={cn(
  "px-4 py-2",
  isActive && "bg-blue-500 text-white",
  !isActive && "bg-gray-200 text-gray-700"
)} />
```

---

## Development Tools

### ESLint
**Purpose:** Code quality and consistency
**Config:** Next.js recommended + custom rules

### Prettier
**Purpose:** Code formatting
**Config:** With Tailwind plugin for class sorting

### TypeScript ESLint
**Purpose:** TypeScript-specific linting

---

## Build & Deployment

### Vercel (Recommended)
**Why:**
- Built by Next.js creators
- Zero-config deployment
- Automatic HTTPS
- Edge network (fast global delivery)
- Preview deployments for each PR
- Environment variables management

**Alternatives:**
- Netlify (good alternative)
- AWS Amplify
- Cloudflare Pages

---

## Package.json Summary

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "typescript": "^5.4.0",

    "tailwindcss": "^3.4.0",
    "@radix-ui/react-*": "^1.0.0",
    "lucide-react": "^0.344.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",

    "zustand": "^4.5.0",
    "next-intl": "^3.9.0",
    "recharts": "^2.12.0",
    "framer-motion": "^11.0.0",
    "date-fns": "^3.3.0",

    "@faker-js/faker": "^8.4.0",
    "sonner": "^1.4.0",
    "vaul": "^0.9.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.0",
    "prettier": "^3.2.0",
    "prettier-plugin-tailwindcss": "^0.5.0"
  }
}
```

---

## Performance Optimizations

### Built-in Next.js Features
- **Image Optimization:** `next/image` component (automatic WebP, lazy loading)
- **Code Splitting:** Automatic by route
- **Tree Shaking:** Removes unused code
- **Minification:** Built-in for production

### Our Implementation
- **Lazy Loading:** Dynamic imports for heavy components
- **Virtualization:** For long lists (activity feed, leaderboard)
- **Memoization:** React.memo for expensive components
- **Bundle Analysis:** Regular checks with `@next/bundle-analyzer`

**Target Metrics:**
- First Contentful Paint: <1.5s
- Time to Interactive: <3s
- Lighthouse Score: >90

---

## Security Considerations

### Frontend Security (Demo Phase)
- No real authentication (role selection for demo)
- No sensitive data (all mock data)
- XSS prevention (React escapes by default)
- HTTPS only (Vercel enforces)

### Production Security (Future)
- JWT authentication with httpOnly cookies
- CSRF protection
- Rate limiting
- Content Security Policy headers
- Regular dependency updates

---

## Browser Support

**Target:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- iOS Safari 14+
- Chrome Mobile 90+

**Polyfills:** None needed (modern browsers only for demo)

---

## Development Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)

# Production Build
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run format       # Run Prettier

# Type Checking
npm run type-check   # TypeScript type checking

# Mock Data Generation
npm run generate:data  # Generate all mock data
npm run generate:students  # Generate only students
npm run generate:feed     # Generate only activity feed
```

---

## Project Structure Philosophy

**Colocation:** Keep related files together
- Components next to their styles/tests
- Types next to their usage

**Separation of Concerns:**
- `/components` - UI components
- `/lib` - Utility functions
- `/hooks` - Custom React hooks
- `/store` - Global state
- `/types` - TypeScript definitions
- `/data` - Mock data

**Naming Conventions:**
- Components: PascalCase (`ActivityFeed.tsx`)
- Hooks: camelCase with 'use' prefix (`useXPSystem.ts`)
- Types: PascalCase with type suffix (`user.types.ts`)
- Utils: camelCase (`formatters.ts`)

---

## Why This Stack?

**Modern & Proven:**
- All libraries are industry-standard with large communities
- Active maintenance and regular updates
- Excellent documentation
- Strong TypeScript support

**Performance:**
- Small bundle sizes
- Fast runtime performance
- Optimized for modern browsers

**Developer Experience:**
- Great tooling and IDE support
- Fast hot reload
- Helpful error messages
- Easy debugging

**Production-Ready:**
- Battle-tested in production at scale
- Security best practices built-in
- Clear upgrade paths
- Long-term viability

---

**This stack will enable us to build a stunning, fast, reliable demo in 6 weeks! 🚀**

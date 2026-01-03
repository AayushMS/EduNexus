# EduNexus - Next-Gen School Management System for Nepal

**Experience Education, Reimagined** | **शिक्षा, नयाँ तरिकाले**

---

## Project Overview

EduNexus is a revolutionary school management system designed specifically for the Nepal education market. Unlike existing solutions (Veda, Digital Nepal), EduNexus prioritizes:

- **Security-First Architecture**: RBAC, end-to-end encryption, complete audit logs
- **Offline-First Design**: Teachers can work without internet, auto-sync when online
- **Hyper-Localization**: Full Nepali language support, CDC curriculum alignment
- **Radical Usability**: One-tap actions, spreadsheet-style interfaces, bulk operations
- **Engagement**: Gamification for students, Facebook-style feeds for parents

This repository contains a **fully functional frontend demo** built with modern web technologies, extensive mock data, and stunning UI/UX that showcases the future of education technology in Nepal.

---

## Documentation

### Planning & Research
- **[PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)** - Vision, problem statement, competitive analysis, business model
- **[TECHNOLOGY_STACK.md](TECHNOLOGY_STACK.md)** - Detailed explanation of all technologies and why they were chosen
- **[MOCK_DATA_STRATEGY.md](MOCK_DATA_STRATEGY.md)** - Complete mock data generation strategy with Nepali context
- **[IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)** - 13-phase implementation plan with goals, acceptance criteria, and testing

### Main Plan
- **[.claude/plans/velvet-prancing-sky.md](.claude/plans/velvet-prancing-sky.md)** - Master implementation plan for Claude Code

---

## Technology Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | Next.js (App Router) | 14.2.0 |
| **Language** | TypeScript | 5.4.0 |
| **Styling** | Tailwind CSS | 3.4.0 |
| **UI Components** | shadcn/ui (Radix UI) | Latest |
| **State Management** | Zustand | 4.5.0 |
| **Internationalization** | next-intl | 3.9.0 |
| **Charts** | Recharts | 2.12.0 |
| **Animations** | Framer Motion | 11.0.0 |
| **Icons** | Lucide React | 0.344.0 |
| **Mock Data** | @faker-js/faker | 8.4.0 |

---

## Features

### Four User Personas

#### 1. Parent Dashboard
- **Facebook-style activity feed** with classroom moments (photos/videos)
- **One-tap actions**: Leave requests, fee payments, PTM booking
- **Milestone celebrations** with shareable certificates
- **Parent gamification**: XP, levels, "Super Parent" badges
- **Multi-child support** with child selector

#### 2. Student Dashboard
- **Gamification system**: XP, levels (Novice → Scholar → Legend), badges, streaks
- **Customizable avatars** with unlockable items
- **Homework submission**: Multi-format (photo, video, text, file upload)
- **Study squads**: Peer collaboration with chat and recognition
- **Focus mode**: Pomodoro timer with distraction blocking
- **Mood check-in**: Daily emotional wellness tracking

#### 3. Teacher Dashboard
- **Spreadsheet-style grade entry**: Excel-like with keyboard navigation
- **One-tap attendance**: Grid view with tap-to-cycle (present/absent/late)
- **Quick moment posting**: Capture and share classroom photos in seconds
- **Bulk actions**: Assign homework to multiple classes, broadcast messages
- **Offline mode**: Work without internet, auto-sync when online

#### 4. Pre-school Module
- **Activity-based tracking**: Photo/video evidence logging
- **5-dimension radar charts**: Physical, Cognitive, Social, Emotional, Language development
- **Holistic Progress Report Cards (HPRC)**: Aligned with Nepal ELDS standards
- **Teacher narratives**: Qualitative assessments instead of just grades
- **Student voice**: "What was your favorite thing this term?"

### Demo Features
- **Interactive tours**: Guided walkthroughs for each persona
- **Contextual hints**: Tooltips and feature discovery
- **Admin panel**: Reset demo, switch scenarios (high performer, struggling student, etc.)
- **Scenario presets**: Quick demonstration scenarios

### Cultural Localization
- **Bilingual**: Complete English/Nepali (नेपाली) support
- **Nepali names**: 500+ names across all ethnic groups (Brahmin, Newar, Tamang, etc.)
- **CDC curriculum**: Aligned with Nepal's Curriculum Development Centre
- **Nepali festivals**: Dashain, Tihar, Buddha Jayanti, etc.
- **NPR currency**: Fee structures in Nepali Rupees
- **Nepali font**: Noto Sans Devanagari for proper rendering

---

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ed_tech

# Install dependencies
npm install

# Generate mock data
npm run generate:data

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Development Commands

```bash
# Development
npm run dev              # Start dev server with hot reload

# Production
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run format           # Run Prettier
npm run type-check       # TypeScript type checking

# Mock Data
npm run generate:data    # Generate all mock data
npm run generate:students   # Generate only students
npm run generate:feed       # Generate only activity feed
```

---

## Project Structure

```
ed_tech/
├── src/
│   ├── app/                       # Next.js 14 App Router
│   │   ├── (auth)/                # Authentication routes
│   │   │   └── role-select/       # Role selection for demo
│   │   ├── (dashboard)/           # Main application
│   │   │   ├── parent/            # Parent persona
│   │   │   ├── student/           # Student persona
│   │   │   ├── teacher/           # Teacher persona
│   │   │   └── preschool/         # Pre-school persona
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx               # Landing page
│   │
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   ├── layout/                # Header, Sidebar, Footer
│   │   ├── parent/                # Parent-specific components
│   │   ├── student/               # Student-specific components
│   │   ├── teacher/               # Teacher-specific components
│   │   ├── preschool/             # Pre-school components
│   │   ├── shared/                # Cross-persona components
│   │   ├── demo/                  # Demo features (tours, hints)
│   │   └── charts/                # Data visualizations
│   │
│   ├── lib/                       # Utility functions
│   ├── hooks/                     # Custom React hooks
│   ├── store/                     # Zustand stores
│   ├── types/                     # TypeScript definitions
│   │
│   ├── data/
│   │   ├── seeds/                 # Static reference data
│   │   │   ├── names.json         # 500+ Nepali names
│   │   │   ├── subjects.json      # CDC subjects
│   │   │   ├── badges.json        # Badge definitions
│   │   │   └── activities.json    # Activity templates
│   │   ├── generators/            # Data generation scripts
│   │   └── generated/             # Generated mock data
│   │
│   ├── locales/
│   │   ├── en/                    # English translations
│   │   └── ne/                    # Nepali translations
│   │
│   └── config/                    # Configuration files
│
├── public/
│   ├── images/                    # Photos, illustrations
│   ├── videos/                    # Video clips
│   ├── avatars/                   # Student avatars
│   ├── badges/                    # Badge icons
│   └── fonts/                     # Nepali fonts
│
├── docs/                          # Documentation
├── .claude/                       # Claude Code plans
└── package.json
```

---

## Mock Data

The application includes extensive mock data to create a realistic demo experience:

- **180 students** (150 regular + 30 pre-school)
- **100 parents** with family relationships
- **15 teachers** with subject specializations
- **300+ activity feed items** over 3 months
- **10,500+ attendance records** with realistic patterns
- **200+ assignments** across subjects
- **40 badge types** (academic, attendance, behavior, special)

All data includes:
- Authentic Nepali names across ethnic groups
- CDC-aligned subjects
- Bilingual content (English/Nepali)
- Temporal patterns (weekdays only, school hours)
- Cultural context (Nepali festivals, activities)

### Regenerating Mock Data

```bash
npm run generate:data
```

This will:
1. Generate new students, parents, teachers
2. Link relationships (parent-student, teacher-class)
3. Generate attendance, grades, assignments
4. Create activity feed with bilingual content
5. Calculate gamification data (XP, badges, streaks)
6. Export to JSON files in `src/data/generated/`

---

## Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/edunexus)

Or manually:

```bash
# Build the project
npm run build

# Deploy to Vercel
npm install -g vercel
vercel
```

### Environment Variables

No environment variables required for the demo version (all mock data).

For production with real backend:
```
NEXT_PUBLIC_API_URL=your_api_url
DATABASE_URL=your_database_url
```

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- iOS Safari 14+
- Chrome Mobile 90+

---

## Performance

Target metrics (Lighthouse):
- **Performance**: >90
- **Accessibility**: >90
- **Best Practices**: >90
- **SEO**: >90

Optimizations:
- Code splitting by route
- Lazy loading for images and videos
- WebP image format
- Tree-shaking and minification
- <500KB initial bundle size

---

## Accessibility

- WCAG AA color contrast
- Keyboard navigation throughout
- ARIA labels on interactive elements
- Focus indicators
- Screen reader support (basic)

---

## Contributing

This is a demo project. For production development:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

[To be determined]

---

## Contact

For questions or demo requests:
- Email: [your-email@example.com]
- Website: [https://edunexus.np]

---

## Acknowledgments

- **Nepal Ministry of Education** for CDC curriculum standards
- **Nepal ELDS** for pre-school developmental standards
- **Unsplash/Pexels** for royalty-free photos and videos
- **shadcn/ui** for beautiful UI components
- **Vercel** for hosting platform

---

**Built with ❤️ for Nepal's education sector** 🇳🇵

*Let's revolutionize education together!*

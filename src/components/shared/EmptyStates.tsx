'use client';

import { useLocaleStore } from '@/store/localeStore';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  type: 'homework' | 'activity' | 'squad' | 'search' | 'notification' | 'milestone' | 'grade' | 'attendance';
  title?: string;
  titleNe?: string;
  description?: string;
  descriptionNe?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

const defaultContent = {
  homework: {
    title: 'No homework yet!',
    titleNe: 'अझै गृहकार्य छैन!',
    description: 'Check back when your teacher assigns new work.',
    descriptionNe: 'तपाईंको शिक्षकले नयाँ काम दिँदा जाँच गर्नुहोस्।',
  },
  activity: {
    title: 'No activities yet',
    titleNe: 'अझै कुनै गतिविधिहरू छैनन्',
    description: 'Activities will appear here once they are posted.',
    descriptionNe: 'गतिविधिहरू पोस्ट भएपछि यहाँ देखा पर्नेछ।',
  },
  squad: {
    title: 'No study squads joined',
    titleNe: 'कुनै अध्ययन समूहमा सामेल भएको छैन',
    description: 'Join a squad to study together with classmates!',
    descriptionNe: 'सहपाठीहरूसँग मिलेर अध्ययन गर्न समूहमा सामेल हुनुहोस्!',
  },
  search: {
    title: 'No results found',
    titleNe: 'कुनै नतिजा फेला परेन',
    description: 'Try adjusting your search or filters.',
    descriptionNe: 'आफ्नो खोज वा फिल्टरहरू समायोजन गर्ने प्रयास गर्नुहोस्।',
  },
  notification: {
    title: 'All caught up!',
    titleNe: 'सबै पढिसक्यो!',
    description: 'You have no new notifications.',
    descriptionNe: 'तपाईंसँग कुनै नयाँ सूचनाहरू छैनन्।',
  },
  milestone: {
    title: 'No milestones found',
    titleNe: 'कुनै माइलस्टोन फेला परेन',
    description: 'Milestones will appear as they are tracked.',
    descriptionNe: 'ट्र्याक गरिँदा माइलस्टोनहरू देखा पर्नेछन्।',
  },
  grade: {
    title: 'No grades yet',
    titleNe: 'अझै ग्रेडहरू छैनन्',
    description: 'Grades will appear after assessments.',
    descriptionNe: 'मूल्याङ्कन पछि ग्रेडहरू देखा पर्नेछन्।',
  },
  attendance: {
    title: 'No attendance records',
    titleNe: 'कुनै उपस्थिति रेकर्ड छैन',
    description: 'Attendance will be shown once marked.',
    descriptionNe: 'चिन्ह लगाएपछि उपस्थिति देखाइनेछ।',
  },
};

const sizeClasses = {
  sm: 'w-24 h-24',
  md: 'w-32 h-32',
  lg: 'w-48 h-48',
};

// SVG Illustrations for each empty state
function HomeworkIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="80" fill="currentColor" className="text-muted/20" />
      <rect x="60" y="50" width="80" height="100" rx="8" fill="currentColor" className="text-muted/40" />
      <rect x="70" y="65" width="40" height="4" rx="2" fill="currentColor" className="text-muted-foreground/50" />
      <rect x="70" y="75" width="55" height="4" rx="2" fill="currentColor" className="text-muted-foreground/30" />
      <rect x="70" y="85" width="50" height="4" rx="2" fill="currentColor" className="text-muted-foreground/30" />
      <rect x="70" y="100" width="25" height="25" rx="4" fill="currentColor" className="text-primary/30" />
      <path d="M78 115L82 119L90 108" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary" />
      <circle cx="145" cy="55" r="20" fill="currentColor" className="text-amber-400/80" />
      <text x="145" y="62" textAnchor="middle" className="text-xl fill-white">?</text>
    </svg>
  );
}

function ActivityIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="80" fill="currentColor" className="text-muted/20" />
      <rect x="50" y="60" width="100" height="80" rx="12" fill="currentColor" className="text-muted/40" />
      <rect x="60" y="70" width="80" height="45" rx="6" fill="currentColor" className="text-muted-foreground/20" />
      <circle cx="100" cy="92" r="15" fill="currentColor" className="text-muted-foreground/30" />
      <path d="M93 92L97 96L107 86" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-muted-foreground/50" />
      <rect x="65" y="125" width="30" height="4" rx="2" fill="currentColor" className="text-muted-foreground/40" />
      <rect x="100" y="125" width="35" height="4" rx="2" fill="currentColor" className="text-muted-foreground/30" />
      <circle cx="155" cy="50" r="15" fill="currentColor" className="text-blue-400/60" />
      <circle cx="45" cy="140" r="10" fill="currentColor" className="text-purple-400/40" />
    </svg>
  );
}

function SquadIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="80" fill="currentColor" className="text-muted/20" />
      <circle cx="100" cy="85" r="25" fill="currentColor" className="text-primary/30" />
      <circle cx="100" cy="70" r="12" fill="currentColor" className="text-muted/60" />
      <ellipse cx="100" cy="130" rx="35" ry="20" fill="currentColor" className="text-primary/30" />
      <circle cx="55" cy="100" r="18" fill="currentColor" className="text-muted/40" />
      <circle cx="55" cy="90" r="8" fill="currentColor" className="text-muted/60" />
      <circle cx="145" cy="100" r="18" fill="currentColor" className="text-muted/40" />
      <circle cx="145" cy="90" r="8" fill="currentColor" className="text-muted/60" />
      <path d="M70 110C75 115 85 118 100 118C115 118 125 115 130 110" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" className="text-primary/50" />
    </svg>
  );
}

function SearchIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="80" fill="currentColor" className="text-muted/20" />
      <circle cx="90" cy="85" r="35" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/50" />
      <line x1="115" y1="115" x2="145" y2="145" stroke="currentColor" strokeWidth="8" strokeLinecap="round" className="text-muted/50" />
      <path d="M75 85H105" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-muted-foreground/40" />
      <path d="M80 95H100" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-muted-foreground/30" />
      <circle cx="150" cy="50" r="8" fill="currentColor" className="text-amber-400/40" />
      <circle cx="50" cy="130" r="6" fill="currentColor" className="text-blue-400/40" />
    </svg>
  );
}

function NotificationIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="80" fill="currentColor" className="text-muted/20" />
      <path d="M100 50C80 50 65 65 65 85V110L55 125H145L135 110V85C135 65 120 50 100 50Z" fill="currentColor" className="text-muted/50" />
      <circle cx="100" cy="145" r="10" fill="currentColor" className="text-muted/50" />
      <circle cx="130" cy="55" r="12" fill="currentColor" className="text-green-400/60" />
      <path d="M126 55L128 57L134 51" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MilestoneIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="80" fill="currentColor" className="text-muted/20" />
      <path d="M60 140L100 60L140 140" fill="currentColor" className="text-amber-400/30" />
      <circle cx="100" cy="90" r="20" fill="currentColor" className="text-amber-400/60" />
      <path d="M100 75V90M100 90L110 100" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-amber-600" />
      <rect x="85" y="130" width="30" height="8" rx="4" fill="currentColor" className="text-muted/40" />
    </svg>
  );
}

function GradeIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="80" fill="currentColor" className="text-muted/20" />
      <rect x="55" y="50" width="90" height="100" rx="8" fill="currentColor" className="text-muted/40" />
      <text x="100" y="115" textAnchor="middle" className="text-4xl font-bold fill-current text-primary/50">A+</text>
      <rect x="65" y="60" width="30" height="4" rx="2" fill="currentColor" className="text-muted-foreground/30" />
      <rect x="65" y="70" width="50" height="4" rx="2" fill="currentColor" className="text-muted-foreground/20" />
    </svg>
  );
}

function AttendanceIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="80" fill="currentColor" className="text-muted/20" />
      <rect x="50" y="45" width="100" height="110" rx="8" fill="currentColor" className="text-muted/40" />
      <rect x="50" y="45" width="100" height="25" rx="8" fill="currentColor" className="text-primary/30" />
      {/* Calendar grid */}
      {[0, 1, 2, 3, 4].map((row) =>
        [0, 1, 2, 3, 4, 5, 6].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={58 + col * 13}
            y={80 + row * 13}
            width="10"
            height="10"
            rx="2"
            fill="currentColor"
            className={
              (row === 2 && col === 3) || (row === 1 && col === 5) || (row === 3 && col === 1)
                ? 'text-green-400/60'
                : 'text-muted-foreground/20'
            }
          />
        ))
      )}
    </svg>
  );
}

const illustrations = {
  homework: HomeworkIllustration,
  activity: ActivityIllustration,
  squad: SquadIllustration,
  search: SearchIllustration,
  notification: NotificationIllustration,
  milestone: MilestoneIllustration,
  grade: GradeIllustration,
  attendance: AttendanceIllustration,
};

export function EmptyState({
  type,
  title,
  titleNe,
  description,
  descriptionNe,
  className,
  size = 'md',
  children,
}: EmptyStateProps) {
  const { locale } = useLocaleStore();
  const Illustration = illustrations[type];
  const content = defaultContent[type];

  const displayTitle = title || (locale === 'en' ? content.title : content.titleNe);
  const displayDescription = description || (locale === 'en' ? content.description : content.descriptionNe);

  return (
    <div className={cn('flex flex-col items-center justify-center py-8 text-center', className)}>
      <Illustration className={cn(sizeClasses[size], 'mb-4 text-muted-foreground/60')} />
      <h3 className="font-semibold text-lg text-muted-foreground mb-1">{displayTitle}</h3>
      <p className="text-sm text-muted-foreground/80 max-w-xs">{displayDescription}</p>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

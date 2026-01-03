'use client';

import { useLocaleStore } from '@/store/localeStore';
import { useGamificationStore, getLevelName, getXPProgress } from '@/store/gamificationStore';

export default function StudentDashboard() {
  const { locale } = useLocaleStore();
  const { xp, level } = useGamificationStore();
  const levelName = getLevelName(level);
  const xpProgress = getXPProgress(xp);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {locale === 'en' ? 'Student Dashboard' : 'विद्यार्थी ड्यासबोर्ड'}
        </h1>
        <p className="text-muted-foreground mt-1">
          {locale === 'en'
            ? 'Track your progress and level up!'
            : 'आफ्नो प्रगति ट्र्याक गर्नुहोस् र स्तर बढाउनुहोस्!'}
        </p>
      </div>

      {/* XP and Level Display */}
      <div className="rounded-lg border bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground">
              {locale === 'en' ? 'Current Level' : 'हालको स्तर'}
            </p>
            <p className="text-2xl font-bold">
              {locale === 'en' ? `Level ${level}` : `स्तर ${level}`} -{' '}
              {levelName[locale]}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">XP</p>
            <p className="text-2xl font-bold">{xp}</p>
          </div>
        </div>
        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
            style={{ width: `${xpProgress}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-right">
          {xpProgress}/100 XP {locale === 'en' ? 'to next level' : 'अर्को स्तरमा'}
        </p>
      </div>

      {/* Placeholder content */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-lg border bg-card p-6 shadow-sm animate-pulse"
          >
            <div className="h-4 w-24 bg-muted rounded mb-4" />
            <div className="h-8 w-16 bg-muted rounded" />
          </div>
        ))}
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {locale === 'en'
              ? 'Gamification features will be implemented in Phase 6'
              : 'गेमिफिकेशन सुविधाहरू चरण ६ मा लागू गरिनेछ'}
          </p>
        </div>
      </div>
    </div>
  );
}

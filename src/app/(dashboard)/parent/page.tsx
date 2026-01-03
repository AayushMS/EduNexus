'use client';

import { useLocaleStore } from '@/store/localeStore';

export default function ParentDashboard() {
  const { locale } = useLocaleStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {locale === 'en' ? 'Parent Dashboard' : 'अभिभावक ड्यासबोर्ड'}
        </h1>
        <p className="text-muted-foreground mt-1">
          {locale === 'en'
            ? "Welcome back! Here's what's happening with your child."
            : 'स्वागत छ! तपाईंको बच्चासँग के भइरहेको छ यहाँ छ।'}
        </p>
      </div>

      {/* Placeholder content */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
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
              ? 'Activity feed will be implemented in Phase 5'
              : 'गतिविधि फिड चरण ५ मा लागू गरिनेछ'}
          </p>
        </div>
      </div>
    </div>
  );
}

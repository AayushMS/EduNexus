'use client';

import { useLocaleStore } from '@/store/localeStore';

export default function TeacherDashboard() {
  const { locale } = useLocaleStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {locale === 'en' ? 'Teacher Dashboard' : 'शिक्षक ड्यासबोर्ड'}
        </h1>
        <p className="text-muted-foreground mt-1">
          {locale === 'en'
            ? 'Manage your classes, grades, and attendance.'
            : 'आफ्नो कक्षाहरू, ग्रेडहरू र उपस्थिति व्यवस्थापन गर्नुहोस्।'}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">
            {locale === 'en' ? 'Total Students' : 'कुल विद्यार्थीहरू'}
          </p>
          <p className="text-3xl font-bold mt-2">156</p>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">
            {locale === 'en' ? 'Classes Today' : 'आज कक्षाहरू'}
          </p>
          <p className="text-3xl font-bold mt-2">5</p>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">
            {locale === 'en' ? 'Pending Grades' : 'बाँकी ग्रेडहरू'}
          </p>
          <p className="text-3xl font-bold mt-2 text-amber-600">12</p>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">
            {locale === 'en' ? 'Leave Requests' : 'बिदा अनुरोधहरू'}
          </p>
          <p className="text-3xl font-bold mt-2 text-blue-600">4</p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {locale === 'en'
              ? 'Teacher tools will be implemented in Phase 7'
              : 'शिक्षक उपकरणहरू चरण ७ मा लागू गरिनेछ'}
          </p>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useLocaleStore } from '@/store/localeStore';

export default function PreschoolDashboard() {
  const { locale } = useLocaleStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {locale === 'en' ? 'Pre-school Dashboard' : 'पूर्व-विद्यालय ड्यासबोर्ड'}
        </h1>
        <p className="text-muted-foreground mt-1">
          {locale === 'en'
            ? 'Track development milestones and log activities.'
            : 'विकास माइलस्टोनहरू ट्र्याक गर्नुहोस् र गतिविधिहरू लग गर्नुहोस्।'}
        </p>
      </div>

      {/* Development Areas Overview */}
      <div className="grid gap-4 md:grid-cols-5">
        {[
          { en: 'Physical', ne: 'शारीरिक', color: 'bg-red-500', progress: 78 },
          { en: 'Cognitive', ne: 'संज्ञानात्मक', color: 'bg-blue-500', progress: 82 },
          { en: 'Social', ne: 'सामाजिक', color: 'bg-green-500', progress: 75 },
          { en: 'Emotional', ne: 'भावनात्मक', color: 'bg-yellow-500', progress: 80 },
          { en: 'Language', ne: 'भाषा', color: 'bg-purple-500', progress: 85 },
        ].map((area) => (
          <div key={area.en} className="rounded-lg border bg-card p-4 shadow-sm">
            <p className="text-sm font-medium">{locale === 'en' ? area.en : area.ne}</p>
            <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full ${area.color} transition-all duration-500`}
                style={{ width: `${area.progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{area.progress}%</p>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">
            {locale === 'en' ? 'Children' : 'बालबालिकाहरू'}
          </p>
          <p className="text-3xl font-bold mt-2">30</p>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">
            {locale === 'en' ? 'Activities Today' : 'आज गतिविधिहरू'}
          </p>
          <p className="text-3xl font-bold mt-2 text-green-600">8</p>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">
            {locale === 'en' ? 'Observations' : 'अवलोकनहरू'}
          </p>
          <p className="text-3xl font-bold mt-2 text-blue-600">156</p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {locale === 'en'
              ? 'Pre-school module will be implemented in Phase 8'
              : 'पूर्व-विद्यालय मोड्युल चरण ८ मा लागू गरिनेछ'}
          </p>
        </div>
      </div>
    </div>
  );
}

'use client';

import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

// Activity Feed skeleton
export function ActivityFeedSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-card rounded-lg border p-4 space-y-3">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          {/* Image */}
          <Skeleton className="h-48 w-full rounded-lg" />
          {/* Text */}
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          {/* Actions */}
          <div className="flex gap-4 pt-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Student card skeleton
export function StudentCardSkeleton() {
  return (
    <div className="bg-card rounded-lg border p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Skeleton className="h-16 rounded-lg" />
        <Skeleton className="h-16 rounded-lg" />
        <Skeleton className="h-16 rounded-lg" />
      </div>
    </div>
  );
}

// Dashboard stats skeleton
export function DashboardStatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-card rounded-lg border p-4 space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-3 w-full" />
        </div>
      ))}
    </div>
  );
}

// Table skeleton
export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-card rounded-lg border overflow-hidden">
      {/* Header */}
      <div className="grid border-b bg-muted/50 p-3" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-20" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid p-3 border-b last:border-0"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              className={cn(
                'h-4',
                colIndex === 0 ? 'w-32' : 'w-16'
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// Chart skeleton
export function ChartSkeleton({ type = 'bar' }: { type?: 'bar' | 'line' | 'radar' | 'pie' }) {
  if (type === 'radar') {
    return (
      <div className="relative w-full aspect-square flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton className="w-3/4 h-3/4 rounded-full opacity-50" />
          <Skeleton className="absolute w-1/2 h-1/2 rounded-full opacity-30" />
          <Skeleton className="absolute w-1/4 h-1/4 rounded-full opacity-20" />
        </div>
      </div>
    );
  }

  if (type === 'pie') {
    return (
      <div className="relative w-full aspect-square flex items-center justify-center">
        <Skeleton className="w-3/4 h-3/4 rounded-full" />
      </div>
    );
  }

  return (
    <div className="w-full h-64 flex items-end gap-2 p-4">
      {Array.from({ length: 7 }).map((_, i) => (
        <Skeleton
          key={i}
          className="flex-1 rounded-t"
          style={{ height: `${Math.random() * 60 + 20}%` }}
        />
      ))}
    </div>
  );
}

// Badge collection skeleton
export function BadgeCollectionSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="flex flex-wrap gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="w-14 h-14 rounded-xl" />
      ))}
    </div>
  );
}

// Profile card skeleton
export function ProfileCardSkeleton() {
  return (
    <div className="bg-card rounded-lg border p-6 space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-20 rounded-lg" />
        <Skeleton className="h-20 rounded-lg" />
        <Skeleton className="h-20 rounded-lg" />
      </div>
    </div>
  );
}

// Calendar skeleton
export function CalendarSkeleton() {
  return (
    <div className="bg-card rounded-lg border p-4 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {/* Weekday headers */}
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-6 w-full" />
        ))}
        {/* Calendar days */}
        {Array.from({ length: 35 }).map((_, i) => (
          <Skeleton key={`day-${i}`} className="h-10 w-full rounded" />
        ))}
      </div>
    </div>
  );
}

// Notification list skeleton
export function NotificationListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-card border">
          <Skeleton className="h-8 w-8 rounded-full shrink-0" />
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Form skeleton
export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      ))}
      <Skeleton className="h-10 w-32 rounded-md mt-6" />
    </div>
  );
}

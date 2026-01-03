'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ActivityCard } from './ActivityCard';
import { Button } from '@/components/ui/button';
import { useLocaleStore } from '@/store/localeStore';
import type { ActivityFeedItem, ReactionType } from '@/types/activity.types';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

interface ActivityFeedProps {
  activities: ActivityFeedItem[];
  onReact?: (activityId: string, reaction: ReactionType) => void;
}

type FilterPeriod = 'all' | 'today' | 'week' | 'month';

export function ActivityFeed({ activities, onReact }: ActivityFeedProps) {
  const { locale } = useLocaleStore();
  const [filter, setFilter] = useState<FilterPeriod>('all');
  const [visibleCount, setVisibleCount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const filteredActivities = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    return activities.filter((activity) => {
      const activityDate = new Date(activity.createdAt);

      switch (filter) {
        case 'today':
          return activityDate >= today;
        case 'week':
          return activityDate >= weekAgo;
        case 'month':
          return activityDate >= monthAgo;
        default:
          return true;
      }
    });
  }, [activities, filter]);

  const visibleActivities = filteredActivities.slice(0, visibleCount);
  const hasMore = visibleCount < filteredActivities.length;

  const loadMore = async () => {
    setIsLoading(true);
    // Simulate loading delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    setVisibleCount((prev) => prev + 10);
    setIsLoading(false);
  };

  const filterLabels: Record<FilterPeriod, { en: string; ne: string }> = {
    all: { en: 'All', ne: 'सबै' },
    today: { en: 'Today', ne: 'आज' },
    week: { en: 'This Week', ne: 'यो हप्ता' },
    month: { en: 'This Month', ne: 'यो महिना' },
  };

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <Tabs
        value={filter}
        onValueChange={(value) => {
          setFilter(value as FilterPeriod);
          setVisibleCount(10);
        }}
      >
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          {(Object.keys(filterLabels) as FilterPeriod[]).map((key) => (
            <TabsTrigger key={key} value={key} className="text-xs sm:text-sm">
              {filterLabels[key][locale]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Activities */}
      {filteredActivities.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>
            {locale === 'en'
              ? 'No activities found for this period.'
              : 'यस अवधिको लागि कुनै गतिविधि फेला परेन।'}
          </p>
        </div>
      ) : (
        <motion.div
          className="space-y-4"
          initial="initial"
          animate="animate"
          variants={{
            animate: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {visibleActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ActivityCard activity={activity} onReact={onReact} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={isLoading}
            className="min-w-[200px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {locale === 'en' ? 'Loading...' : 'लोड हुँदैछ...'}
              </>
            ) : (
              locale === 'en' ? 'Load More' : 'थप लोड गर्नुहोस्'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

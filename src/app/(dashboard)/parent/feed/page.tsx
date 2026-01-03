'use client';

import { useState, useMemo } from 'react';
import { useLocaleStore } from '@/store/localeStore';
import { useMockData } from '@/hooks/useMockData';
import { ActivityFeed } from '@/components/parent/ActivityFeed';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import type { ReactionType } from '@/types/activity.types';
import { toast } from 'sonner';

type FilterType = 'all' | 'photos' | 'videos' | 'announcements' | 'achievements';

export default function FeedPage() {
  const { locale } = useLocaleStore();
  const { activityFeed } = useMockData();
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter activities based on selected filter and search
  const filteredActivities = useMemo(() => {
    let filtered = activityFeed;

    // Apply type filter
    if (filter !== 'all') {
      filtered = filtered.filter((activity) => {
        switch (filter) {
          case 'photos':
            return activity.media?.some((m) => m.type === 'image');
          case 'videos':
            return activity.media?.some((m) => m.type === 'video');
          case 'announcements':
            return activity.type === 'event_announcement';
          case 'achievements':
            return activity.type === 'achievement_earned';
          default:
            return true;
        }
      });
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (activity) =>
          activity.content.toLowerCase().includes(query) ||
          activity.contentNe.toLowerCase().includes(query) ||
          activity.authorName.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [activityFeed, filter, searchQuery]);

  const handleReaction = (activityId: string, reaction: ReactionType) => {
    toast.success(
      locale === 'en'
        ? `You reacted with ${reaction}!`
        : `तपाईंले ${reaction} सँग प्रतिक्रिया दिनुभयो!`
    );
  };

  const filterLabels: Record<FilterType, { en: string; ne: string }> = {
    all: { en: 'All', ne: 'सबै' },
    photos: { en: 'Photos', ne: 'फोटोहरू' },
    videos: { en: 'Videos', ne: 'भिडियोहरू' },
    announcements: { en: 'Announcements', ne: 'घोषणाहरू' },
    achievements: { en: 'Achievements', ne: 'उपलब्धिहरू' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/parent">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {locale === 'en' ? 'Activity Feed' : 'गतिविधि फिड'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {locale === 'en'
              ? 'Stay updated with your child\'s school activities'
              : 'आफ्नो बच्चाको विद्यालय गतिविधिहरूसँग अपडेट रहनुहोस्'}
          </p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={locale === 'en' ? 'Search activities...' : 'गतिविधिहरू खोज्नुहोस्...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Tabs */}
        <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
          <TabsList className="w-full justify-start overflow-x-auto">
            {(Object.keys(filterLabels) as FilterType[]).map((key) => (
              <TabsTrigger key={key} value={key} className="min-w-fit">
                {locale === 'en' ? filterLabels[key].en : filterLabels[key].ne}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Activity Feed */}
      {filteredActivities.length > 0 ? (
        <ActivityFeed activities={filteredActivities} onReact={handleReaction} />
      ) : (
        <div className="text-center py-12">
          <Filter className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">
            {locale === 'en' ? 'No activities found' : 'कुनै गतिविधि फेला परेन'}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {locale === 'en'
              ? 'Try adjusting your filters or search query'
              : 'आफ्नो फिल्टर वा खोज परिवर्तन गर्ने प्रयास गर्नुहोस्'}
          </p>
        </div>
      )}
    </div>
  );
}

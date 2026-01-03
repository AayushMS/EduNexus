'use client';

import { useState } from 'react';
import { useLocaleStore } from '@/store/localeStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SwipeableCard } from '@/components/shared';
import {
  ArrowLeft,
  Bell,
  BookOpen,
  CreditCard,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Archive,
  Check,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type NotificationType = 'academic' | 'fees' | 'event' | 'urgent' | 'general';
type FilterType = 'all' | 'unread' | 'urgent' | 'archived';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  titleNe: string;
  description: string;
  descriptionNe: string;
  timestamp: string;
  timestampNe: string;
  read: boolean;
  archived: boolean;
}

// Mock notification data
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'urgent',
    title: 'Fee Payment Overdue',
    titleNe: 'शुल्क भुक्तानी बाँकी',
    description: 'January transport fee is overdue. Please pay to avoid late fee.',
    descriptionNe: 'जनवरी यातायात शुल्क बाँकी छ। ढिलो शुल्क बाट बच्न कृपया भुक्तानी गर्नुहोस्।',
    timestamp: '1 hour ago',
    timestampNe: '१ घण्टा पहिले',
    read: false,
    archived: false,
  },
  {
    id: '2',
    type: 'academic',
    title: 'Math Test Results',
    titleNe: 'गणित परीक्षा नतिजा',
    description: 'Your child scored 92% in the Unit 3 Math test. Excellent work!',
    descriptionNe: 'तपाईंको बच्चाले एकाई ३ गणित परीक्षामा ९२% पायो। उत्कृष्ट काम!',
    timestamp: '2 hours ago',
    timestampNe: '२ घण्टा पहिले',
    read: false,
    archived: false,
  },
  {
    id: '3',
    type: 'event',
    title: 'PTM Reminder',
    titleNe: 'PTM रिमाइन्डर',
    description: 'Parent-Teacher Meeting scheduled for January 10, 2026.',
    descriptionNe: 'अभिभावक-शिक्षक बैठक जनवरी १०, २०२६ मा निर्धारित।',
    timestamp: 'Yesterday',
    timestampNe: 'हिजो',
    read: true,
    archived: false,
  },
  {
    id: '4',
    type: 'fees',
    title: 'Fee Receipt Available',
    titleNe: 'शुल्क रसिद उपलब्ध',
    description: 'December tuition fee receipt is now available for download.',
    descriptionNe: 'डिसेम्बर ट्युसन शुल्क रसिद अब डाउनलोडको लागि उपलब्ध छ।',
    timestamp: '2 days ago',
    timestampNe: '२ दिन पहिले',
    read: true,
    archived: false,
  },
  {
    id: '5',
    type: 'general',
    title: 'School Closure Notice',
    titleNe: 'विद्यालय बन्द सूचना',
    description: 'School will remain closed on January 15 for Maghe Sankranti.',
    descriptionNe: 'माघे संक्रान्तिको लागि जनवरी १५ मा विद्यालय बन्द रहनेछ।',
    timestamp: '3 days ago',
    timestampNe: '३ दिन पहिले',
    read: true,
    archived: false,
  },
  {
    id: '6',
    type: 'academic',
    title: 'Homework Submission',
    titleNe: 'गृहकार्य जम्मा',
    description: 'Science project homework has been submitted successfully.',
    descriptionNe: 'विज्ञान परियोजना गृहकार्य सफलतापूर्वक जम्मा गरियो।',
    timestamp: '4 days ago',
    timestampNe: '४ दिन पहिले',
    read: true,
    archived: true,
  },
];

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case 'academic':
      return <BookOpen className="h-5 w-5 text-blue-500" />;
    case 'fees':
      return <CreditCard className="h-5 w-5 text-green-500" />;
    case 'event':
      return <Calendar className="h-5 w-5 text-purple-500" />;
    case 'urgent':
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    default:
      return <Bell className="h-5 w-5 text-gray-500" />;
  }
}

export default function NotificationsPage() {
  const { locale } = useLocaleStore();
  const [filter, setFilter] = useState<FilterType>('all');
  const [notifications, setNotifications] = useState(mockNotifications);

  const filteredNotifications = notifications.filter((notif) => {
    switch (filter) {
      case 'unread':
        return !notif.read && !notif.archived;
      case 'urgent':
        return notif.type === 'urgent' && !notif.archived;
      case 'archived':
        return notif.archived;
      default:
        return !notif.archived;
    }
  });

  const unreadCount = notifications.filter((n) => !n.read && !n.archived).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleArchive = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, archived: true } : n))
    );
    toast.success(
      locale === 'en' ? 'Notification archived' : 'सूचना संग्रह गरियो'
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success(
      locale === 'en' ? 'All notifications marked as read' : 'सबै सूचनाहरू पढिएको चिन्ह लगाइयो'
    );
  };

  const filterLabels: Record<FilterType, { en: string; ne: string }> = {
    all: { en: 'All', ne: 'सबै' },
    unread: { en: 'Unread', ne: 'नपढिएको' },
    urgent: { en: 'Urgent', ne: 'जरुरी' },
    archived: { en: 'Archived', ne: 'संग्रहित' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/parent">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {locale === 'en' ? 'Notifications' : 'सूचनाहरू'}
              {unreadCount > 0 && (
                <Badge className="h-6 px-2">{unreadCount}</Badge>
              )}
            </h1>
            <p className="text-sm text-muted-foreground">
              {locale === 'en'
                ? 'Stay updated with important alerts'
                : 'महत्त्वपूर्ण अलर्टहरूसँग अपडेट रहनुहोस्'}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
            <Check className="h-4 w-4 mr-2" />
            {locale === 'en' ? 'Mark all read' : 'सबै पढिएको'}
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
        <TabsList className="w-full justify-start">
          {(Object.keys(filterLabels) as FilterType[]).map((key) => (
            <TabsTrigger key={key} value={key}>
              {locale === 'en' ? filterLabels[key].en : filterLabels[key].ne}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Notifications List */}
      <div className="space-y-2">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <SwipeableCard
              key={notification.id}
              onSwipeLeft={() => handleArchive(notification.id)}
              leftAction={
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30">
                  <Archive className="h-6 w-6 text-orange-500" />
                </div>
              }
            >
              <Card
                className={cn(
                  'transition-colors',
                  !notification.read && 'bg-primary/5 border-primary/20'
                )}
                onClick={() => handleMarkAsRead(notification.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p
                          className={cn(
                            'font-medium text-sm',
                            !notification.read && 'font-semibold'
                          )}
                        >
                          {locale === 'en' ? notification.title : notification.titleNe}
                        </p>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <div className="h-2 w-2 rounded-full bg-primary" />
                          )}
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {locale === 'en'
                              ? notification.timestamp
                              : notification.timestampNe}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {locale === 'en'
                          ? notification.description
                          : notification.descriptionNe}
                      </p>
                      {notification.type === 'urgent' && (
                        <Badge
                          variant="destructive"
                          className="mt-2 text-xs"
                        >
                          {locale === 'en' ? 'Urgent' : 'जरुरी'}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </SwipeableCard>
          ))
        ) : (
          <div className="text-center py-12">
            <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">
              {locale === 'en' ? 'All caught up!' : 'सबै पढिसक्यो!'}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {locale === 'en'
                ? 'No notifications in this category'
                : 'यस वर्गमा कुनै सूचना छैन'}
            </p>
          </div>
        )}
      </div>

      {/* Swipe hint */}
      {filteredNotifications.length > 0 && filter !== 'archived' && (
        <p className="text-xs text-center text-muted-foreground">
          {locale === 'en'
            ? 'Swipe left to archive'
            : 'संग्रह गर्न बायाँ स्वाइप गर्नुहोस्'}
        </p>
      )}
    </div>
  );
}

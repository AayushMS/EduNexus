'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocaleStore } from '@/store/localeStore';
import {
  Calendar,
  CreditCard,
  MessageSquare,
  FileText,
  Clock,
  Bell,
} from 'lucide-react';

interface QuickAction {
  id: string;
  icon: React.ReactNode;
  label: { en: string; ne: string };
  description: { en: string; ne: string };
  color: string;
  badge?: number;
}

const quickActions: QuickAction[] = [
  {
    id: 'leave',
    icon: <Calendar className="h-5 w-5" />,
    label: { en: 'Request Leave', ne: 'बिदा अनुरोध' },
    description: { en: 'Apply for leave', ne: 'बिदाको लागि आवेदन दिनुहोस्' },
    color: 'bg-blue-500',
  },
  {
    id: 'fees',
    icon: <CreditCard className="h-5 w-5" />,
    label: { en: 'Pay Fees', ne: 'शुल्क भुक्तानी' },
    description: { en: 'View & pay fees', ne: 'शुल्क हेर्नुहोस् र तिर्नुहोस्' },
    color: 'bg-green-500',
    badge: 1,
  },
  {
    id: 'ptm',
    icon: <Clock className="h-5 w-5" />,
    label: { en: 'Book PTM', ne: 'PTM बुक गर्नुहोस्' },
    description: { en: 'Schedule meeting', ne: 'भेटघाट तालिका बनाउनुहोस्' },
    color: 'bg-purple-500',
  },
  {
    id: 'report',
    icon: <FileText className="h-5 w-5" />,
    label: { en: 'View Report', ne: 'रिपोर्ट हेर्नुहोस्' },
    description: { en: 'Academic report', ne: 'शैक्षिक रिपोर्ट' },
    color: 'bg-amber-500',
  },
  {
    id: 'message',
    icon: <MessageSquare className="h-5 w-5" />,
    label: { en: 'Message', ne: 'सन्देश' },
    description: { en: 'Contact teacher', ne: 'शिक्षकलाई सम्पर्क गर्नुहोस्' },
    color: 'bg-pink-500',
    badge: 3,
  },
  {
    id: 'alerts',
    icon: <Bell className="h-5 w-5" />,
    label: { en: 'Alerts', ne: 'अलर्ट' },
    description: { en: 'View notifications', ne: 'सूचनाहरू हेर्नुहोस्' },
    color: 'bg-red-500',
    badge: 2,
  },
];

interface QuickActionsProps {
  onActionClick?: (actionId: string) => void;
}

export function QuickActions({ onActionClick }: QuickActionsProps) {
  const { locale } = useLocaleStore();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">
          {locale === 'en' ? 'Quick Actions' : 'द्रुत कार्यहरू'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Button
                variant="outline"
                className="w-full h-auto flex flex-col items-center gap-2 p-3 relative"
                onClick={() => onActionClick?.(action.id)}
              >
                <div
                  className={`${action.color} rounded-full p-2 text-white`}
                >
                  {action.icon}
                </div>
                <span className="text-xs font-medium text-center leading-tight">
                  {action.label[locale]}
                </span>
                {action.badge && (
                  <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {action.badge}
                  </span>
                )}
              </Button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

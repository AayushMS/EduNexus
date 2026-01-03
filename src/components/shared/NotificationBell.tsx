'use client';

import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
}

// Mock notifications for demo
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Assignment',
    message: 'Math homework due tomorrow',
    time: '2 min ago',
    read: false,
    priority: 'high',
  },
  {
    id: '2',
    title: 'Badge Earned!',
    message: 'You earned the "Early Bird" badge',
    time: '1 hour ago',
    read: false,
    priority: 'medium',
  },
  {
    id: '3',
    title: 'PTM Reminder',
    message: 'Parent-Teacher Meeting tomorrow at 10 AM',
    time: '3 hours ago',
    read: true,
    priority: 'low',
  },
];

const priorityColors = {
  high: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-blue-500',
};

export function NotificationBell() {
  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          Notifications
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {unreadCount} new
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[300px]">
          {mockNotifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={`flex flex-col items-start p-3 cursor-pointer ${
                !notification.read ? 'bg-accent/50' : ''
              }`}
            >
              <div className="flex items-center gap-2 w-full">
                <span
                  className={`h-2 w-2 rounded-full ${priorityColors[notification.priority]}`}
                />
                <span className="font-medium flex-1">{notification.title}</span>
                <span className="text-xs text-muted-foreground">
                  {notification.time}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1 pl-4">
                {notification.message}
              </p>
            </DropdownMenuItem>
          ))}
        </ScrollArea>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-center justify-center text-primary">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

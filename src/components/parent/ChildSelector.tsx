'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLocaleStore } from '@/store/localeStore';
import { ChevronDown, User } from 'lucide-react';

interface Child {
  id: string;
  name: string;
  nameNe: string;
  grade: number;
  section: string;
  avatarUrl?: string;
}

interface ChildSelectorProps {
  children: Child[];
  selectedChild: Child | null;
  onSelectChild: (child: Child) => void;
}

export function ChildSelector({
  children,
  selectedChild,
  onSelectChild,
}: ChildSelectorProps) {
  const { locale } = useLocaleStore();

  if (children.length === 0) {
    return null;
  }

  if (children.length === 1) {
    const child = children[0];
    return (
      <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
        <CardContent className="flex items-center gap-4 p-4">
          <Avatar className="h-12 w-12 border-2 border-primary">
            <AvatarImage src={child.avatarUrl} />
            <AvatarFallback>
              <User className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">
              {locale === 'en' ? child.name : child.nameNe}
            </p>
            <p className="text-sm text-muted-foreground">
              {locale === 'en'
                ? `Grade ${child.grade}, Section ${child.section}`
                : `कक्षा ${child.grade}, खण्ड ${child.section}`}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border-2 border-primary">
                <AvatarImage src={selectedChild?.avatarUrl} />
                <AvatarFallback>
                  <User className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">
                  {selectedChild
                    ? (locale === 'en' ? selectedChild.name : selectedChild.nameNe)
                    : (locale === 'en' ? 'Select Child' : 'बच्चा छान्नुहोस्')}
                </p>
                {selectedChild && (
                  <p className="text-sm text-muted-foreground">
                    {locale === 'en'
                      ? `Grade ${selectedChild.grade}, Section ${selectedChild.section}`
                      : `कक्षा ${selectedChild.grade}, खण्ड ${selectedChild.section}`}
                  </p>
                )}
              </div>
            </div>
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          </CardContent>
        </Card>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        {children.map((child) => (
          <DropdownMenuItem
            key={child.id}
            className="flex items-center gap-3 p-3 cursor-pointer"
            onClick={() => onSelectChild(child)}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={child.avatarUrl} />
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">
                {locale === 'en' ? child.name : child.nameNe}
              </p>
              <p className="text-xs text-muted-foreground">
                {locale === 'en'
                  ? `Grade ${child.grade}`
                  : `कक्षा ${child.grade}`}
              </p>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

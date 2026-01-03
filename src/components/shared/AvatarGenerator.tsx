'use client';

import { useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface AvatarGeneratorProps {
  name: string;
  imageUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBorder?: boolean;
  borderColor?: string;
}

// Consistent gradient colors based on name hash
const gradientPairs = [
  ['from-rose-400', 'to-pink-500'],
  ['from-violet-400', 'to-purple-500'],
  ['from-blue-400', 'to-indigo-500'],
  ['from-cyan-400', 'to-teal-500'],
  ['from-emerald-400', 'to-green-500'],
  ['from-amber-400', 'to-orange-500'],
  ['from-red-400', 'to-rose-500'],
  ['from-fuchsia-400', 'to-pink-500'],
  ['from-sky-400', 'to-blue-500'],
  ['from-lime-400', 'to-emerald-500'],
];

const sizeClasses = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
  xl: 'h-20 w-20 text-2xl',
};

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function AvatarGenerator({
  name,
  imageUrl,
  size = 'md',
  className,
  showBorder = false,
  borderColor,
}: AvatarGeneratorProps) {
  const gradientIndex = useMemo(() => hashString(name) % gradientPairs.length, [name]);
  const [from, to] = gradientPairs[gradientIndex];
  const initials = useMemo(() => getInitials(name), [name]);

  return (
    <Avatar
      className={cn(
        sizeClasses[size],
        showBorder && 'ring-2 ring-offset-2 ring-offset-background',
        borderColor || (showBorder && 'ring-primary'),
        className
      )}
    >
      {imageUrl && <AvatarImage src={imageUrl} alt={name} />}
      <AvatarFallback
        className={cn(
          'bg-gradient-to-br font-semibold text-white',
          from,
          to
        )}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}

// Group avatar display for multiple users
interface AvatarGroupProps {
  users: Array<{ name: string; imageUrl?: string }>;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export function AvatarGroup({ users, max = 4, size = 'sm', className }: AvatarGroupProps) {
  const displayUsers = users.slice(0, max);
  const remainingCount = users.length - max;

  return (
    <div className={cn('flex -space-x-2', className)}>
      {displayUsers.map((user, index) => (
        <AvatarGenerator
          key={index}
          name={user.name}
          imageUrl={user.imageUrl}
          size={size}
          showBorder
          className="border-2 border-background"
        />
      ))}
      {remainingCount > 0 && (
        <div
          className={cn(
            'flex items-center justify-center rounded-full bg-muted border-2 border-background font-medium text-muted-foreground',
            sizeClasses[size]
          )}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}

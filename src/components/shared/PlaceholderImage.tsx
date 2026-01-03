'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface PlaceholderImageProps {
  type: 'classroom' | 'art' | 'sports' | 'science' | 'celebration' | 'outdoor' | 'reading' | 'music';
  seed?: string | number;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'wide';
}

// Color schemes for different activity types
const colorSchemes = {
  classroom: [
    { bg: 'from-blue-100 to-blue-200', accent: 'bg-blue-400', icon: '📚' },
    { bg: 'from-indigo-100 to-indigo-200', accent: 'bg-indigo-400', icon: '✏️' },
    { bg: 'from-sky-100 to-sky-200', accent: 'bg-sky-400', icon: '📖' },
  ],
  art: [
    { bg: 'from-pink-100 to-pink-200', accent: 'bg-pink-400', icon: '🎨' },
    { bg: 'from-purple-100 to-purple-200', accent: 'bg-purple-400', icon: '🖌️' },
    { bg: 'from-fuchsia-100 to-fuchsia-200', accent: 'bg-fuchsia-400', icon: '🎭' },
  ],
  sports: [
    { bg: 'from-green-100 to-green-200', accent: 'bg-green-400', icon: '⚽' },
    { bg: 'from-emerald-100 to-emerald-200', accent: 'bg-emerald-400', icon: '🏃' },
    { bg: 'from-teal-100 to-teal-200', accent: 'bg-teal-400', icon: '🏅' },
  ],
  science: [
    { bg: 'from-cyan-100 to-cyan-200', accent: 'bg-cyan-400', icon: '🔬' },
    { bg: 'from-blue-100 to-cyan-200', accent: 'bg-blue-400', icon: '🧪' },
    { bg: 'from-violet-100 to-violet-200', accent: 'bg-violet-400', icon: '⚗️' },
  ],
  celebration: [
    { bg: 'from-amber-100 to-amber-200', accent: 'bg-amber-400', icon: '🎉' },
    { bg: 'from-orange-100 to-orange-200', accent: 'bg-orange-400', icon: '🎊' },
    { bg: 'from-yellow-100 to-yellow-200', accent: 'bg-yellow-400', icon: '🎈' },
  ],
  outdoor: [
    { bg: 'from-green-100 to-emerald-200', accent: 'bg-green-500', icon: '🌳' },
    { bg: 'from-lime-100 to-green-200', accent: 'bg-lime-500', icon: '🌻' },
    { bg: 'from-teal-100 to-green-200', accent: 'bg-teal-500', icon: '🦋' },
  ],
  reading: [
    { bg: 'from-amber-50 to-orange-100', accent: 'bg-amber-400', icon: '📖' },
    { bg: 'from-stone-100 to-stone-200', accent: 'bg-stone-400', icon: '📚' },
    { bg: 'from-rose-50 to-rose-100', accent: 'bg-rose-400', icon: '📕' },
  ],
  music: [
    { bg: 'from-violet-100 to-purple-200', accent: 'bg-violet-400', icon: '🎵' },
    { bg: 'from-pink-100 to-rose-200', accent: 'bg-pink-400', icon: '🎸' },
    { bg: 'from-indigo-100 to-blue-200', accent: 'bg-indigo-400', icon: '🎹' },
  ],
};

const aspectClasses = {
  square: 'aspect-square',
  video: 'aspect-video',
  wide: 'aspect-[21/9]',
};

function hashSeed(seed: string | number): number {
  const str = seed.toString();
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function PlaceholderImage({
  type,
  seed = Date.now(),
  className,
  aspectRatio = 'video',
}: PlaceholderImageProps) {
  const scheme = useMemo(() => {
    const schemes = colorSchemes[type];
    const index = hashSeed(seed) % schemes.length;
    return schemes[index];
  }, [type, seed]);

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg bg-gradient-to-br',
        scheme.bg,
        aspectClasses[aspectRatio],
        className
      )}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div
          className={cn('absolute top-4 left-4 w-12 h-12 rounded-full', scheme.accent, 'opacity-40')}
        />
        <div
          className={cn(
            'absolute bottom-6 right-6 w-20 h-20 rounded-full',
            scheme.accent,
            'opacity-30'
          )}
        />
        <div
          className={cn(
            'absolute top-1/2 left-1/3 w-8 h-8 rounded-full',
            scheme.accent,
            'opacity-20'
          )}
        />
      </div>

      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%">
          <pattern id={`pattern-${seed}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1" fill="currentColor" />
          </pattern>
          <rect width="100%" height="100%" fill={`url(#pattern-${seed})`} />
        </svg>
      </div>

      {/* Center icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={cn(
            'w-16 h-16 rounded-2xl flex items-center justify-center text-3xl',
            scheme.accent,
            'bg-opacity-80 shadow-lg'
          )}
        >
          {scheme.icon}
        </div>
      </div>

      {/* Demo indicator */}
      <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/20 rounded text-[10px] text-white/80">
        Demo Image
      </div>
    </div>
  );
}

// Activity thumbnail grid component
interface ActivityThumbnailGridProps {
  count?: number;
  type?: PlaceholderImageProps['type'];
  className?: string;
}

export function ActivityThumbnailGrid({
  count = 4,
  type = 'classroom',
  className,
}: ActivityThumbnailGridProps) {
  const images = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      seed: `thumb-${i}-${Date.now()}`,
    }));
  }, [count]);

  const gridClass = count === 1 ? 'grid-cols-1' : count === 2 ? 'grid-cols-2' : 'grid-cols-2';

  return (
    <div className={cn('grid gap-1', gridClass, className)}>
      {images.slice(0, 4).map((img, index) => (
        <PlaceholderImage
          key={img.id}
          type={type}
          seed={img.seed}
          aspectRatio={count === 1 ? 'video' : 'square'}
          className={cn(
            count === 3 && index === 0 && 'col-span-2',
            count === 3 && index > 0 && 'col-span-1'
          )}
        />
      ))}
    </div>
  );
}

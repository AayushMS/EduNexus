'use client';

import { cn } from '@/lib/utils';
import { useLocaleStore } from '@/store/localeStore';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: { icon: 'w-6 h-6', text: 'text-lg' },
  md: { icon: 'w-8 h-8', text: 'text-xl' },
  lg: { icon: 'w-10 h-10', text: 'text-2xl' },
  xl: { icon: 'w-14 h-14', text: 'text-3xl' },
};

export function Logo({ size = 'md', showText = true, className }: LogoProps) {
  const { locale } = useLocaleStore();
  const sizes = sizeClasses[size];

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Logo Icon */}
      <div className={cn('relative', sizes.icon)}>
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Background circle with gradient */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
            <linearGradient id="bookGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#E0E7FF" />
            </linearGradient>
          </defs>

          {/* Main circle */}
          <circle cx="20" cy="20" r="18" fill="url(#logoGradient)" />

          {/* Book/Education symbol */}
          <path
            d="M12 14C12 13 13 12 14 12H19C19 12 20 12 20 13V27C20 27 19 27 18 27H14C13 27 12 26 12 25V14Z"
            fill="url(#bookGradient)"
          />
          <path
            d="M28 14C28 13 27 12 26 12H21C21 12 20 12 20 13V27C20 27 21 27 22 27H26C27 27 28 26 28 25V14Z"
            fill="url(#bookGradient)"
          />

          {/* Connection/Network dots */}
          <circle cx="20" cy="10" r="2" fill="#FCD34D" />
          <circle cx="10" cy="20" r="1.5" fill="#34D399" />
          <circle cx="30" cy="20" r="1.5" fill="#34D399" />

          {/* Sparkle/Star accent */}
          <path
            d="M30 8L31 10L33 11L31 12L30 14L29 12L27 11L29 10L30 8Z"
            fill="#FCD34D"
          />
        </svg>
      </div>

      {/* Logo Text */}
      {showText && (
        <span className={cn('font-bold tracking-tight', sizes.text)}>
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Edu
          </span>
          <span className="text-foreground">Nexus</span>
        </span>
      )}
    </div>
  );
}

// Animated logo for loading screens
export function AnimatedLogo({ size = 'lg', className }: Omit<LogoProps, 'showText'>) {
  const sizes = sizeClasses[size];

  return (
    <div className={cn('relative', sizes.icon, className)}>
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <linearGradient id="animLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6">
              <animate attributeName="stop-color" values="#3B82F6;#8B5CF6;#3B82F6" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#8B5CF6">
              <animate attributeName="stop-color" values="#8B5CF6;#3B82F6;#8B5CF6" dur="3s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
        </defs>

        {/* Pulsing outer ring */}
        <circle cx="20" cy="20" r="19" stroke="url(#animLogoGradient)" strokeWidth="1" fill="none" opacity="0.3">
          <animate attributeName="r" values="19;21;19" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" />
        </circle>

        {/* Main circle */}
        <circle cx="20" cy="20" r="18" fill="url(#animLogoGradient)">
          <animate attributeName="r" values="18;17;18" dur="2s" repeatCount="indefinite" />
        </circle>

        {/* Book */}
        <path
          d="M12 14C12 13 13 12 14 12H19C19 12 20 12 20 13V27C20 27 19 27 18 27H14C13 27 12 26 12 25V14Z"
          fill="white"
        />
        <path
          d="M28 14C28 13 27 12 26 12H21C21 12 20 12 20 13V27C20 27 21 27 22 27H26C27 27 28 26 28 25V14Z"
          fill="white"
        />

        {/* Rotating sparkle */}
        <g transform-origin="20 20">
          <animateTransform attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="10s" repeatCount="indefinite" />
          <circle cx="20" cy="5" r="2" fill="#FCD34D" />
        </g>
      </svg>
    </div>
  );
}

// Mini logo for favicon/small spaces
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('w-8 h-8', className)}>
      <defs>
        <linearGradient id="markGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="15" fill="url(#markGradient)" />
      <path d="M9 11C9 10 10 9 11 9H15C15 9 16 9 16 10V22C16 22 15 22 14 22H11C10 22 9 21 9 20V11Z" fill="white" />
      <path d="M23 11C23 10 22 9 21 9H17C17 9 16 9 16 10V22C16 22 17 22 18 22H21C22 22 23 21 23 20V11Z" fill="white" />
      <circle cx="16" cy="6" r="1.5" fill="#FCD34D" />
    </svg>
  );
}

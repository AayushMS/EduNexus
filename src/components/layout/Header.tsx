'use client';

import { Button } from '@/components/ui/button';
import { LanguageToggle, ThemeToggle, NotificationBell, Logo, AvatarGenerator } from '@/components/shared';
import { useAuthStore } from '@/store/authStore';
import { useLocaleStore } from '@/store/localeStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, LogOut, User, Settings, HelpCircle, ChevronDown } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  onMenuClick?: () => void;
}

const roleLabels = {
  parent: { en: 'Parent', ne: 'अभिभावक' },
  student: { en: 'Student', ne: 'विद्यार्थी' },
  teacher: { en: 'Teacher', ne: 'शिक्षक' },
  preschool: { en: 'Pre-school', ne: 'पूर्व-विद्यालय' },
};

export function Header({ onMenuClick }: HeaderProps) {
  const { user, role, logout } = useAuthStore();
  const { locale } = useLocaleStore();

  const roleLabel = role ? roleLabels[role][locale] : '';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 gap-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>

        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Logo size="sm" showText className="hidden sm:flex" />
          <Logo size="sm" showText={false} className="sm:hidden" />
        </Link>

        {/* Demo mode banner */}
        <div className="hidden md:flex items-center px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 text-xs font-medium">
          🎭 {locale === 'en' ? 'Demo Mode' : 'डेमो मोड'}
        </div>

        <div className="flex-1" />

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <NotificationBell />
          <LanguageToggle />
          <ThemeToggle />

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 gap-2 px-2 rounded-full">
                <AvatarGenerator
                  name={user?.name || 'Demo User'}
                  imageUrl={user?.avatarUrl}
                  size="sm"
                />
                <ChevronDown className="h-3 w-3 hidden sm:block text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {user?.name || 'Demo User'}
                  </p>
                  <p className="text-xs text-muted-foreground">{roleLabel}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                {locale === 'en' ? 'Profile' : 'प्रोफाइल'}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                {locale === 'en' ? 'Settings' : 'सेटिङ्स'}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                {locale === 'en' ? 'Help' : 'मद्दत'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/role-select">
                  <LogOut className="mr-2 h-4 w-4" />
                  {locale === 'en' ? 'Switch Role' : 'भूमिका बदल्नुहोस्'}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                {locale === 'en' ? 'Logout' : 'लग आउट'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

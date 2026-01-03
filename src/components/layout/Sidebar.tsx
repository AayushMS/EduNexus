'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';
import { useLocaleStore } from '@/store/localeStore';
import { navigationConfig, type NavItem } from '@/config/navigation';
import { Separator } from '@/components/ui/separator';

interface SidebarProps {
  className?: string;
}

function NavItemComponent({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const { locale } = useLocaleStore();
  const isActive = pathname === item.href;
  const Icon = item.icon;

  return (
    <Button
      variant={isActive ? 'secondary' : 'ghost'}
      className={cn(
        'w-full justify-start gap-3',
        isActive && 'bg-secondary font-medium'
      )}
      asChild
    >
      <Link href={item.href}>
        <Icon className="h-4 w-4" />
        <span className="flex-1 text-left">{item.title[locale]}</span>
        {item.badge && (
          <Badge variant="destructive" className="h-5 px-1.5 text-xs">
            {item.badge}
          </Badge>
        )}
      </Link>
    </Button>
  );
}

export function Sidebar({ className }: SidebarProps) {
  const { role } = useAuthStore();
  const { locale } = useLocaleStore();

  if (!role) return null;

  const config = navigationConfig[role];

  return (
    <aside
      className={cn(
        'hidden md:flex w-64 flex-col border-r bg-background',
        className
      )}
    >
      <ScrollArea className="flex-1 py-4">
        <div className="px-3 space-y-1">
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {locale === 'en' ? 'Main Menu' : 'मुख्य मेनु'}
          </p>
          {config.mainNav.map((item) => (
            <NavItemComponent key={item.href} item={item} />
          ))}
        </div>

        <Separator className="my-4" />

        <div className="px-3 space-y-1">
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {locale === 'en' ? 'Other' : 'अन्य'}
          </p>
          {config.secondaryNav.map((item) => (
            <NavItemComponent key={item.href} item={item} />
          ))}
        </div>
      </ScrollArea>

      {/* XP Progress for Student */}
      {role === 'student' && (
        <div className="p-4 border-t">
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                {locale === 'en' ? 'Level 5' : 'स्तर ५'}
              </span>
              <span className="text-xs text-muted-foreground">450/500 XP</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: '90%' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Engagement Score for Parent */}
      {role === 'parent' && (
        <div className="p-4 border-t">
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">
                {locale === 'en' ? 'Super Parent' : 'सुपर अभिभावक'}
              </span>
              <span className="text-lg">⭐</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {locale === 'en'
                ? '15 activities this week'
                : 'यो हप्ता १५ गतिविधिहरू'}
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}

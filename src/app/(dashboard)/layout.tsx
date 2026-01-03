'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useAuthStore } from '@/store/authStore';
import { useLocaleStore } from '@/store/localeStore';
import { navigationConfig, type NavItem } from '@/config/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

function MobileNavItem({ item, onClose }: { item: NavItem; onClose: () => void }) {
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
      onClick={onClose}
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { role } = useAuthStore();
  const { locale } = useLocaleStore();
  const router = useRouter();

  // Redirect to role selection if no role is set
  useEffect(() => {
    if (!role) {
      router.push('/role-select');
    }
  }, [role, router]);

  if (!role) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const config = navigationConfig[role];

  return (
    <div className="flex min-h-screen flex-col">
      <Header onMenuClick={() => setMobileOpen(true)} />

      <div className="flex flex-1">
        <Sidebar />

        {/* Mobile sidebar sheet */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-72 p-0">
            <div className="flex h-14 items-center px-4 border-b">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">E</span>
              </div>
              <span className="font-bold text-xl ml-2">EduNexus</span>
            </div>
            <ScrollArea className="flex-1 py-4 h-[calc(100vh-3.5rem)]">
              <div className="px-3 space-y-1">
                <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  {locale === 'en' ? 'Main Menu' : 'मुख्य मेनु'}
                </p>
                {config.mainNav.map((item) => (
                  <MobileNavItem
                    key={item.href}
                    item={item}
                    onClose={() => setMobileOpen(false)}
                  />
                ))}
              </div>

              <Separator className="my-4" />

              <div className="px-3 space-y-1">
                <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  {locale === 'en' ? 'Other' : 'अन्य'}
                </p>
                {config.secondaryNav.map((item) => (
                  <MobileNavItem
                    key={item.href}
                    item={item}
                    onClose={() => setMobileOpen(false)}
                  />
                ))}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>

        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <div className="container mx-auto p-4 md:p-6">{children}</div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}

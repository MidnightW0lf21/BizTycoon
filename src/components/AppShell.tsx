
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, LayoutDashboard, Store, Menu, DollarSign } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useGame } from '@/contexts/GameContext';
import { cn } from '@/lib/utils';
import React, { useState, useEffect } from 'react';
import { ThemeToggle } from './ThemeToggle';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/businesses', label: 'Businesses', icon: Store },
];

function AppLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 p-4 border-b border-border">
      <Briefcase className="h-8 w-8 text-primary" />
      <h1 className="text-xl font-bold text-foreground">BizTycoon Idle</h1>
    </Link>
  );
}

interface NavLinkProps extends NavItem {
  onClick?: () => void;
}

function NavLink({ href, label, icon: Icon, onClick }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  const linkProps: { href: string; className: string; onClick?: () => void } = {
    href,
    className: cn(
      "flex items-center gap-3 rounded-lg px-3 py-1 text-muted-foreground transition-all hover:text-primary", // Changed py-2 to py-1
      isActive && "bg-muted text-primary"
    ),
  };
  
  if (onClick) {
    linkProps.onClick = onClick;
  }


  return (
    <Link {...linkProps}>
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { playerStats } = useGame();
  const [currentMoney, setCurrentMoney] = useState(playerStats.money);
  const [currentPageTitle, setCurrentPageTitle] = useState('Dashboard');
  const pathname = usePathname();

  useEffect(() => {
    setCurrentMoney(playerStats.money);
  }, [playerStats.money]);
  
  useEffect(() => {
    const item = navItems.find(item => item.href === pathname);
    if (item) {
      setCurrentPageTitle(item.label);
    } else {
      setCurrentPageTitle('BizTycoon'); // Default or for other pages
    }
  }, [pathname]);


  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <AppLogo />
          <nav className="flex-1 grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map(item => <NavLink key={item.href} {...item} />)}
          </nav>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
              <AppLogo />
              <nav className="grid gap-2 text-lg font-medium p-4">
                {navItems.map(item => <NavLink key={item.href} {...item} onClick={() => {
                  // Close sheet on click
                  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
                }} />)}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="flex-1">
            <h1 className="font-semibold text-lg">{currentPageTitle}</h1>
          </div>
          <div className="flex items-center gap-4"> {/* Added gap-4 for spacing */}
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <DollarSign className="h-5 w-5" />
              <span>${Math.floor(currentMoney).toLocaleString()}</span>
            </div>
            <ThemeToggle />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}

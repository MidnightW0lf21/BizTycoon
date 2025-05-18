
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, LayoutDashboard, Store, Menu, DollarSign, BarChart, LockKeyhole, Network, Lightbulb, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useGame } from '@/contexts/GameContext';
import { cn } from '@/lib/utils';
import React, { useState, useEffect } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { getLevelsRequiredForNPoints, getCostForNthPoint } from "@/config/game-config";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  requiredTimesPrestiged?: number;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/businesses', label: 'Businesses', icon: Store },
  { href: '/stocks', label: 'Stocks', icon: BarChart, requiredTimesPrestiged: 2 },
  { href: '/skill-tree', label: 'Skill Tree', icon: Network, requiredTimesPrestiged: 1 },
];

function AppLogo() {
  const { playerStats, businesses } = useGame();

  const [prestigeProgress, setPrestigeProgress] = useState({
    percentage: 0,
    levelsAchieved: 0,
    levelsForNext: 0,
  });

  useEffect(() => {
    const currentTotalLevels = businesses.reduce((sum, b) => sum + b.level, 0);
    const levelsForCurrentPointsPlayerHas = getLevelsRequiredForNPoints(playerStats.prestigePoints);
    const costForNextPotentialPoint = getCostForNthPoint(playerStats.prestigePoints + 1);
    const levelsProgressedForNextPoint = Math.max(0, currentTotalLevels - levelsForCurrentPointsPlayerHas);

    let percentage = 0;
    if (costForNextPotentialPoint > 0) {
      percentage = Math.min(100, (levelsProgressedForNextPoint / costForNextPotentialPoint) * 100);
    } else {
      percentage = (levelsProgressedForNextPoint > 0) ? 100 : 0;
    }

    setPrestigeProgress({
      percentage: percentage,
      levelsAchieved: levelsProgressedForNextPoint, // Not displayed here, but calculated
      levelsForNext: costForNextPotentialPoint,   // Not displayed here, but calculated
    });
  }, [playerStats.prestigePoints, businesses]);

  return (
    <div className="flex flex-col p-4 border-b border-border gap-3"> {/* Added gap and adjusted padding a bit */}
      <Link href="/" className="flex items-center gap-2">
        <Briefcase className="h-8 w-8 text-primary" />
        <h1 className="text-xl font-bold text-foreground">BizTycoon Idle</h1>
      </Link>
      <div className="space-y-1">
        <div className="flex justify-between items-center text-xs text-muted-foreground mb-0.5">
            <span className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-amber-400"/>
                Prestige Lvl Progress
            </span>
            <span>{prestigeProgress.percentage.toFixed(1)}%</span>
        </div>
        <Progress value={prestigeProgress.percentage} className="h-2 w-full" />
      </div>
    </div>
  );
}

interface NavLinkProps extends NavItem {
  onClick?: () => void;
  currentTimesPrestiged: number;
}

function NavLink({ href, label, icon: Icon, onClick, requiredTimesPrestiged, currentTimesPrestiged }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const isLocked = requiredTimesPrestiged && currentTimesPrestiged < requiredTimesPrestiged;

  const linkClassName = cn(
    "flex items-center gap-3 rounded-lg px-3 py-1 text-muted-foreground transition-all",
    !isLocked && "hover:text-primary",
    isActive && !isLocked && "bg-muted text-primary",
    isLocked && "opacity-50 cursor-not-allowed"
  );

  const linkContent = (
    <>
      <Icon className="h-4 w-4" />
      {label}
      {isLocked && <LockKeyhole className="h-3 w-3 ml-auto text-xs" />}
    </>
  );

  if (isLocked) {
    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            {/* Ensure this is a div or span for locked state for TooltipTrigger */}
            <div className={linkClassName}>
              {linkContent}
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Requires prestige level {requiredTimesPrestiged} to unlock.</p>
            <p className="text-xs">(Currently: {currentTimesPrestiged})</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  const linkProps: { href: string; className: string; onClick?: () => void } = {
    href,
    className: linkClassName,
  };
  
  if (onClick) {
    linkProps.onClick = onClick;
  }

  return (
    <Link {...linkProps}>
      {linkContent}
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { playerStats, businesses } = useGame(); // Added businesses here for AppLogo
  const [currentMoney, setCurrentMoney] = useState(playerStats.money);
  const [currentPageTitle, setCurrentPageTitle] = useState('Dashboard');
  const pathname = usePathname();

  useEffect(() => {
    setCurrentMoney(playerStats.money);
  }, [playerStats.money]);
  
  useEffect(() => {
    const activeItem = navItems.find(item => {
      if (item.href === '/') {
        return pathname === '/';
      }
      return pathname.startsWith(item.href) && item.href !== '/'; // Ensure deeper paths still highlight parent
    });
  
    if (pathname === '/') {
      setCurrentPageTitle('Dashboard');
    } else if (activeItem) {
      setCurrentPageTitle(activeItem.label);
    } else {
      // Fallback for pages not in navItems, like potential sub-pages or direct access
      if (pathname.startsWith('/businesses')) setCurrentPageTitle('Businesses');
      else if (pathname.startsWith('/stocks')) setCurrentPageTitle('Stocks');
      else if (pathname.startsWith('/skill-tree')) setCurrentPageTitle('Skill Tree');
      else setCurrentPageTitle('BizTycoon');
    }
  }, [pathname]);


  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-0"> {/* Changed gap-2 to gap-0 */}
          <AppLogo />
          <nav className="flex-1 grid items-start px-2 py-2 text-sm font-medium lg:px-4"> {/* Added py-2 for some spacing around nav items */}
            {navItems.map(item => <NavLink key={item.href} {...item} currentTimesPrestiged={playerStats.timesPrestiged} />)}
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
                {navItems.map(item => <NavLink key={item.href} {...item} currentTimesPrestiged={playerStats.timesPrestiged} onClick={() => {
                  const escapeKeyEvent = new KeyboardEvent('keydown', { key: 'Escape' });
                  document.dispatchEvent(escapeKeyEvent);
                }} />)}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="flex-1">
            <h1 className="font-semibold text-lg">{currentPageTitle}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <DollarSign className="h-5 w-5" />
              <span>${Math.floor(currentMoney).toLocaleString('en-US')}</span>
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

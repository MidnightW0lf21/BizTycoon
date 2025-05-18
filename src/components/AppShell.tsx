
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, LayoutDashboard, Store, Menu, DollarSign, BarChart, LockKeyhole, Network, Sparkles, Star, Lightbulb, XIcon, Settings, SlidersHorizontal } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useGame } from '@/contexts/GameContext';
import { cn } from '@/lib/utils';
import React, { useState, useEffect } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { calculateDiminishingPrestigePoints, getLevelsRequiredForNPoints, getCostForNthPoint } from "@/config/game-config";
import { useToast } from "@/hooks/use-toast";

interface NavItem {
  href?: string;
  label: string;
  icon: LucideIcon;
  requiredTimesPrestiged?: number;
  action?: 'prestige';
}

const navItems: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/businesses', label: 'Businesses', icon: Store },
  { href: '/stocks', label: 'Stocks', icon: BarChart, requiredTimesPrestiged: 2 },
  { href: '/skill-tree', label: 'Skill Tree', icon: Network, requiredTimesPrestiged: 1 },
  { href: '/settings', label: 'Settings', icon: SlidersHorizontal },
  { label: 'Prestige', icon: Star, action: 'prestige', requiredTimesPrestiged: 0 },
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
    let displayPrestigePointsForProgressBar = playerStats.prestigePoints;
    
    const levelsForCurrentPointsPlayerHas = getLevelsRequiredForNPoints(displayPrestigePointsForProgressBar);
    const costForNextPotentialPoint = getCostForNthPoint(displayPrestigePointsForProgressBar + 1);
    const levelsProgressedForNextPoint = Math.max(0, currentTotalLevels - levelsForCurrentPointsPlayerHas);

    let percentage = 0;
    if (costForNextPotentialPoint > 0 && costForNextPotentialPoint !== Infinity) { // Avoid division by zero or Infinity
      percentage = Math.min(100, (levelsProgressedForNextPoint / costForNextPotentialPoint) * 100);
    } else if (levelsProgressedForNextPoint > 0) { // If cost is 0 or Infinity but progress made
      percentage = 100;
    }


    setPrestigeProgress({
      percentage: percentage,
      levelsAchieved: levelsProgressedForNextPoint,
      levelsForNext: costForNextPotentialPoint === Infinity ? 0 : costForNextPotentialPoint, // Show 0 if at max prestige effectively
    });
  }, [playerStats.prestigePoints, businesses]);

  return (
    <div className="flex flex-col p-4 border-b border-border gap-3">
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
  onMobileClick?: () => void; 
  currentTimesPrestiged: number;
  onPrestigeClick?: () => void; 
}

function NavLink({ href, label, icon: Icon, onMobileClick, requiredTimesPrestiged, currentTimesPrestiged, action, onPrestigeClick }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = action ? false : pathname === href; 
  const isLocked = requiredTimesPrestiged !== undefined && currentTimesPrestiged < requiredTimesPrestiged;

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

  const handleInteraction = () => {
    if (isLocked) return; // Prevent action if locked

    if (onMobileClick) {
      onMobileClick();
    }
    if (action === 'prestige' && onPrestigeClick) {
      onPrestigeClick();
    }
  };

  if (isLocked) {
    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
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

  if (action === 'prestige') {
    return (
      <button onClick={handleInteraction} className={linkClassName}>
        {linkContent}
      </button>
    );
  }
  
  if (href) {
    return (
      <Link href={href} onClick={handleInteraction} className={linkClassName}>
        {linkContent}
      </Link>
    );
  }

  return (
    <div className={linkClassName} onClick={handleInteraction}>
      {linkContent}
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { playerStats, businesses, performPrestige } = useGame();
  const [currentMoney, setCurrentMoney] = useState(playerStats.money);
  const [currentPageTitle, setCurrentPageTitle] = useState('Dashboard');
  const pathname = usePathname();
  const { toast } = useToast();

  const [isPrestigeDialogOpen, setIsPrestigeDialogOpen] = useState(false);
  const [newlyGainedPoints, setNewlyGainedPoints] = useState(0);

  useEffect(() => {
    setCurrentMoney(playerStats.money);

    const currentTotalLevels = businesses.reduce((sum, b) => sum + b.level, 0);
    const calculateNewlyGainedPointsLocal = () => {
      const moneyRequiredForPrestige = 1000000;
      if (playerStats.money < moneyRequiredForPrestige && playerStats.timesPrestiged === 0) return 0;
      
      const totalPotentialPointsPlayerWouldHave = calculateDiminishingPrestigePoints(currentTotalLevels);
      return Math.max(0, totalPotentialPointsPlayerWouldHave - playerStats.prestigePoints);
    };
    setNewlyGainedPoints(calculateNewlyGainedPointsLocal());

  }, [playerStats, businesses]);
  
  useEffect(() => {
    const activeItem = navItems.find(item => {
      if (item.href === '/') return pathname === '/'; 
      return item.href && item.href !== '/' && pathname.startsWith(item.href); 
    });
  
    if (pathname === '/') setCurrentPageTitle('Dashboard');
    else if (activeItem) setCurrentPageTitle(activeItem.label);
    else setCurrentPageTitle('BizTycoon'); 
  }, [pathname]);

  const handlePrestigeNavClick = () => {
    const moneyRequiredForPrestige = 1000000;

    if (playerStats.money < moneyRequiredForPrestige && playerStats.timesPrestiged === 0) {
      toast({
        title: "Not Ready to Prestige",
        description: "You need at least $1,000,000 to prestige for the first time.",
        variant: "destructive",
      });
    } else if (newlyGainedPoints === 0 && playerStats.money >= moneyRequiredForPrestige && playerStats.timesPrestiged === 0) {
      toast({
        title: "No Points to Gain Yet",
        description: "You have enough money to prestige, but you wouldn't gain any prestige points from business levels yet. Level up your businesses further!",
        variant: "default",
      });
    } else if (newlyGainedPoints === 0 && playerStats.timesPrestiged > 0) { 
      toast({
        title: "No New Points to Gain",
        description: "You wouldn't gain any new prestige points from business levels right now. Level up your businesses further!",
        variant: "default",
      });
    } else {
      setIsPrestigeDialogOpen(true);
    }
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-0"> 
          <AppLogo />
          <nav className="grid items-start px-2 py-2 text-sm font-medium lg:px-4"> 
            {navItems.map(item => (
              <NavLink 
                key={item.label} 
                {...item} 
                currentTimesPrestiged={playerStats.timesPrestiged}
                onPrestigeClick={item.action === 'prestige' ? handlePrestigeNavClick : undefined}
              />
            ))}
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
                {navItems.map(item => (
                  <NavLink 
                    key={item.label} 
                    {...item} 
                    currentTimesPrestiged={playerStats.timesPrestiged}
                    onMobileClick={() => { 
                      const escapeKeyEvent = new KeyboardEvent('keydown', { key: 'Escape' });
                      document.dispatchEvent(escapeKeyEvent);
                    }}
                    onPrestigeClick={item.action === 'prestige' ? handlePrestigeNavClick : undefined}
                  />
                ))}
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
      <AlertDialog open={isPrestigeDialogOpen} onOpenChange={setIsPrestigeDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Prestige</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to prestige? This will reset your current money,
              all business levels, business upgrades, and stock holdings.
              <br /><br />
              You will gain approximately <strong className="text-primary">{newlyGainedPoints}</strong> new base prestige point(s) from business levels.
              <br />
              (Skill bonuses, if any, will be applied on top of this value by the system.)
              <br />
              This action is irreversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                performPrestige();
                setIsPrestigeDialogOpen(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirm Prestige
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

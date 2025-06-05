
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, LayoutDashboard, Store, Menu, Banknote, BarChart, LockKeyhole, Network, Sparkles, Star, Lightbulb, XIcon, Settings, SlidersHorizontal, Building as HQIcon, ListChecks, Factory } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  SheetTrigger,
  Sheet,
  SheetContent,
  SheetTitle
} from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle as AlertDialogUtiTitle,
} from "@/components/ui/alert-dialog";
import { useGame } from '@/contexts/GameContext';
import { cn } from '@/lib/utils';
import React, { useState, useEffect, useCallback } from 'react';
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
  { href: '/', label: 'Dashboard', icon: LayoutDashboard, requiredTimesPrestiged: 0 },
  { href: '/businesses', label: 'Businesses', icon: Store, requiredTimesPrestiged: 0 },
  { href: '/skill-tree', label: 'Skill Tree', icon: Network, requiredTimesPrestiged: 1 },
  { href: '/hq', label: 'Headquarters', icon: HQIcon, requiredTimesPrestiged: 3 },
  { href: '/my-factory', label: 'My Factory', icon: Factory, requiredTimesPrestiged: 5 },
  { href: '/stocks', label: 'Stocks', icon: BarChart, requiredTimesPrestiged: 8 },
  { href: '/completion', label: 'Completion', icon: ListChecks, requiredTimesPrestiged: 0 },
  { label: 'Prestige', icon: Star, action: 'prestige', requiredTimesPrestiged: 0 },
];

function AppLogo() {
  const { playerStats, businesses } = useGame();

  const [prestigeProgress, setPrestigeProgress] = useState({
    percentage: 0,
    levelsAchieved: 0,
    levelsForNext: 0,
    newlyGainedPoints: 0,
  });

  useEffect(() => {
    const currentTotalLevels = businesses.reduce((sum, b) => sum + b.level, 0);
    
    const potentialTotalPointsIfPrestigedNow = calculateDiminishingPrestigePoints(currentTotalLevels);
    
    const targetPointNumber = potentialTotalPointsIfPrestigedNow + 1;
    const costForTargetPoint = getCostForNthPoint(targetPointNumber);
    const levelsRequiredForPotentialTotalPoints = getLevelsRequiredForNPoints(potentialTotalPointsIfPrestigedNow);
    
    const levelsAchievedForTarget = Math.max(0, currentTotalLevels - levelsRequiredForPotentialTotalPoints);
    
    let percentage = 0;
    if (costForTargetPoint > 0 && costForTargetPoint !== Infinity) {
      percentage = Math.min(100, (levelsAchievedForTarget / costForTargetPoint) * 100);
    } else if (levelsAchievedForTarget > 0 && costForTargetPoint !== Infinity) { 
      percentage = 100;
    }

    let calculatedNewlyGainedPoints = 0;
    const moneyRequiredForPrestige = 100000;
    if (!(playerStats.money < moneyRequiredForPrestige && playerStats.timesPrestiged === 0)) {
      calculatedNewlyGainedPoints = Math.max(0, potentialTotalPointsIfPrestigedNow - playerStats.prestigePoints);
    }

    setPrestigeProgress({
      percentage: percentage,
      levelsAchieved: levelsAchievedForTarget,
      levelsForNext: costForTargetPoint === Infinity ? 0 : costForTargetPoint,
      newlyGainedPoints: calculatedNewlyGainedPoints,
    });
  }, [playerStats, businesses]);

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
                {'Prestige Lvl Progress'} 
                {prestigeProgress.newlyGainedPoints > 0 && ` ( +${prestigeProgress.newlyGainedPoints} PP)`}
            </span>
            <span>{prestigeProgress.percentage.toFixed(1)}%</span>
        </div>
        <Progress value={prestigeProgress.percentage} className="h-2 w-full" />
      </div>
    </div>
  );
}

interface NavLinkProps {
  href?: string;
  label: string;
  icon: LucideIcon;
  requiredTimesPrestiged?: number;
  currentTimesPrestiged: number;
  action?: 'prestige';
  onPrestigeClick?: () => void;
  onMobileClick?: () => void;
}

function NavLink({ href, label, icon: Icon, onMobileClick, requiredTimesPrestiged = 0, currentTimesPrestiged, action, onPrestigeClick }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = action ? false : (href === '/' ? pathname === href : (href && pathname.startsWith(href)));
  const isLocked = currentTimesPrestiged < requiredTimesPrestiged;

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

  const handleInteraction = (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (isLocked) {
      event.preventDefault();
      return;
    }
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
            <div className={linkClassName} onClick={(e) => e.preventDefault()} aria-disabled="true">
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
    <div className={linkClassName} onClick={onMobileClick}>
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
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);


  useEffect(() => {
    setCurrentMoney(playerStats.money);

    const currentTotalLevels = businesses.reduce((sum, b) => sum + b.level, 0);
    const calculateNewlyGainedPointsLocal = () => {
      const moneyRequiredForPrestige = 100000;
      if (playerStats.money < moneyRequiredForPrestige && playerStats.timesPrestiged === 0) return 0;

      const totalPotentialPointsPlayerWouldHave = calculateDiminishingPrestigePoints(currentTotalLevels);
      return Math.max(0, totalPotentialPointsPlayerWouldHave - playerStats.prestigePoints);
    };
    setNewlyGainedPoints(calculateNewlyGainedPointsLocal());

  }, [playerStats.money, playerStats.prestigePoints, playerStats.timesPrestiged, businesses]);

  useEffect(() => {
    const activeItem = navItems.find(item => {
      if (item.action) return false;
      if (item.href === '/') return pathname === '/';
      return item.href && item.href !== '/' && pathname.startsWith(item.href);
    });

    if (pathname === '/') setCurrentPageTitle('Dashboard');
    else if (pathname === '/settings') setCurrentPageTitle('Settings');
    else if (activeItem) setCurrentPageTitle(activeItem.label);
    else setCurrentPageTitle('BizTycoon');
  }, [pathname]);

  const handlePrestigeNavClick = useCallback(() => {
    const moneyRequiredForPrestige = 100000;

    if (playerStats.money < moneyRequiredForPrestige && playerStats.timesPrestiged === 0) {
      toast({
        title: "Not Ready to Prestige",
        description: `You need at least ${moneyRequiredForPrestige.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 })} to prestige for the first time.`,
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
  }, [playerStats.money, playerStats.timesPrestiged, newlyGainedPoints, toast]);
  
  const handleOpenMobileSheet = useCallback(() => setMobileSheetOpen(true), []);
  const handleCloseMobileSheet = useCallback(() => setMobileSheetOpen(false), []);

  const baseSidebarClasses = "hidden border-r bg-muted/40 md:block";
  const mountedSidebarClasses = "sticky top-0 h-screen";
  const finalSidebarClasses = mounted ? `${baseSidebarClasses} ${mountedSidebarClasses}` : baseSidebarClasses;

  const baseSidebarNavClasses = "grid items-start px-2 py-2 text-sm font-medium lg:px-4";
  const mountedSidebarNavClasses = "overflow-y-auto";
  const finalSidebarNavClasses = mounted ? `${baseSidebarNavClasses} ${mountedSidebarNavClasses}` : baseSidebarNavClasses;
  
  const baseContentColumnClasses = "flex flex-col";
  const mountedContentColumnClasses = "h-screen overflow-hidden";
  const finalContentColumnClasses = mounted ? `${baseContentColumnClasses} ${mountedContentColumnClasses}` : baseContentColumnClasses;
  
  const baseHeaderClasses = "flex h-14 items-center gap-4 border-b px-4 lg:h-[60px] lg:px-6";
  const mountedHeaderClasses = "sticky top-0 z-10 bg-background shrink-0";
  const unmountedHeaderClasses = "bg-muted/40";
  const finalHeaderClasses = mounted ? `${baseHeaderClasses} ${mountedHeaderClasses}` : `${baseHeaderClasses} ${unmountedHeaderClasses}`;
  
  const baseMainClasses = "flex-1 bg-background flex flex-col gap-4 p-4 lg:p-6 lg:gap-6";
  const mountedMainClasses = "overflow-y-auto"; 
  const finalMainClasses = mounted ? `${baseMainClasses.replace("flex flex-col gap-4 lg:gap-6", "")} ${mountedMainClasses}` : baseMainClasses;


  const baseMobileNavClasses = "grid gap-2 text-lg font-medium p-4";
  const mountedMobileNavClasses = "overflow-y-auto";
  const finalMobileNavClasses = mounted ? `${baseMobileNavClasses} ${mountedMobileNavClasses}` : baseMobileNavClasses;

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className={finalSidebarClasses}>
        <div className="flex h-full max-h-screen flex-col gap-0">
          <AppLogo />
          <nav className={finalSidebarNavClasses}>
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
      <div className={finalContentColumnClasses}>
        <header 
            className={finalHeaderClasses}
          >
          <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden" onClick={handleOpenMobileSheet}>
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
              <SheetTitle className="sr-only">Main Navigation</SheetTitle> 
              <AppLogo />
              <nav className={finalMobileNavClasses}>
                {navItems.map(item => (
                  <NavLink
                    key={item.label}
                    {...item}
                    currentTimesPrestiged={playerStats.timesPrestiged}
                    onMobileClick={handleCloseMobileSheet}
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
              <Banknote className="h-5 w-5" />
              <span>{currentMoney.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
            </div>
            <Button variant="outline" size="icon" className="h-9 w-9" asChild>
              <Link href="/settings">
                <Settings className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Open Settings</span>
              </Link>
            </Button>
          </div>
        </header>
        <main 
            className={finalMainClasses}
          >
          {children}
        </main>
      </div>
      <AlertDialog open={isPrestigeDialogOpen} onOpenChange={setIsPrestigeDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogUtiTitle>Confirm Prestige</AlertDialogUtiTitle>
            <AlertDialogDescription>
              Are you sure you want to prestige? This will reset your current money,
              all business levels, business upgrades, and stock holdings (unless retained by HQ upgrades).
              <br /><br />
              You will gain approximately <strong className="text-primary">{newlyGainedPoints.toLocaleString('en-US')}</strong> new base prestige point(s) from business levels.
              <br />
              (HQ Upgrades, Skill bonuses, if any, will be applied on top of this value by the system.)
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
    

    


    

    
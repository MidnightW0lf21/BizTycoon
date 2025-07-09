
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, LayoutDashboard, Store, Menu, Banknote, BarChart, LockKeyhole, Network, Sparkles, Star, Lightbulb, XIcon, Settings, SlidersHorizontal, Building as HQIcon, ListChecks, Factory, Mountain, Gem, LineChart, Sprout, Truck, ShoppingCart } from 'lucide-react';
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
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { calculateDiminishingPrestigePoints, getLevelsRequiredForNPoints, getCostForNthPoint } from "@/config/game-config";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from './ui/skeleton';

interface NavItem {
  href?: string;
  label: string;
  icon: LucideIcon;
  requiredTimesPrestiged?: number;
  action?: 'prestige';
  items?: NavItem[];
}

const navItems: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard, requiredTimesPrestiged: 0 },
  { href: '/businesses', label: 'Businesses', icon: Store, requiredTimesPrestiged: 0 },
  { href: '/skill-tree', label: 'Skill Tree', icon: Network, requiredTimesPrestiged: 1 },
  { href: '/hq', label: 'Headquarters', icon: HQIcon, requiredTimesPrestiged: 3 },
  { href: '/quarry', label: 'Quarry', icon: Mountain, requiredTimesPrestiged: 4 },
  { href: '/my-factory', label: 'My Factory', icon: Factory, requiredTimesPrestiged: 5 },
  { href: '/stocks', label: 'Stocks', icon: BarChart, requiredTimesPrestiged: 8 },
  { 
    label: 'Retail Chain', 
    icon: Gem, 
    requiredTimesPrestiged: 15,
    items: [
      { href: '/farm', label: 'Farm', icon: Sprout, requiredTimesPrestiged: 15 },
      { href: '/warehouse', label: 'Warehouse', icon: Truck, requiredTimesPrestiged: 15 },
      { href: '/shop', label: 'Shop', icon: ShoppingCart, requiredTimesPrestiged: 15 },
    ]
  },
  { href: '/completion', label: 'Completion', icon: ListChecks, requiredTimesPrestiged: 0 },
  { href: '/stats', label: 'Statistics', icon: LineChart, requiredTimesPrestiged: 0 },
  { label: 'Prestige', icon: Star, action: 'prestige', requiredTimesPrestiged: 0 },
];

function AppLogo() {
  const { playerStats, businesses } = useGame();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const prestigeProgress = useMemo(() => {
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

    return {
      percentage: percentage,
      levelsAchieved: levelsAchievedForTarget,
      levelsForNext: costForTargetPoint === Infinity ? 0 : costForTargetPoint,
      newlyGainedPoints: calculatedNewlyGainedPoints,
    };
  }, [playerStats.money, playerStats.timesPrestiged, playerStats.prestigePoints, businesses]);

  return (
    <div className="flex flex-col p-4 border-b border-border gap-3">
      <Link href="/" className="flex items-center gap-2">
        <Briefcase className="h-8 w-8 text-primary" />
        <h1 className="text-xl font-bold text-foreground">BizTycoon Idle</h1>
      </Link>
      {mounted ? (
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs text-muted-foreground mb-0.5">
              <span className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-amber-400"/>
                  {'Prestige Lvl Progress'} 
                  {prestigeProgress.newlyGainedPoints > 0 && ` ( +${prestigeProgress.newlyGainedPoints.toLocaleString()} PP)`}
              </span>
              <span>{`${prestigeProgress.percentage.toFixed(1)}%`}</span>
          </div>
          <Progress value={prestigeProgress.percentage} className="h-2 w-full" />
        </div>
      ) : (
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs text-muted-foreground mb-0.5 h-4">
              <span className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-amber-400"/>
                  {'Prestige Lvl Progress'} 
              </span>
          </div>
          <Progress value={0} className="h-2 w-full" />
        </div>
      )}
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

const NavLink = React.memo(function NavLink({ 
  href, 
  label, 
  icon: Icon, 
  onMobileClick, 
  requiredTimesPrestiged = 0, 
  currentTimesPrestiged, 
  action, 
  onPrestigeClick 
}: NavLinkProps) {
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
});
NavLink.displayName = 'NavLink';

function NavSkeleton() {
    return (
        <div className="flex flex-col gap-2 px-2 py-2 lg:px-4">
            {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
            ))}
        </div>
    );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { playerStats, businesses, performPrestige } = useGame();
  const [currentPageTitle, setCurrentPageTitle] = useState('Dashboard');
  const pathname = usePathname();
  const { toast } = useToast();

  const [isPrestigeDialogOpen, setIsPrestigeDialogOpen] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const newlyGainedPoints = useMemo(() => {
    const currentTotalLevels = businesses.reduce((sum, b) => sum + b.level, 0);
    const moneyRequiredForPrestige = 100000;
    if (playerStats.money < moneyRequiredForPrestige && playerStats.timesPrestiged === 0) {
      return 0;
    }
    const totalPotentialPointsPlayerWouldHave = calculateDiminishingPrestigePoints(currentTotalLevels);
    return Math.max(0, totalPotentialPointsPlayerWouldHave - playerStats.prestigePoints);
  }, [playerStats.money, playerStats.prestigePoints, playerStats.timesPrestiged, businesses]);


  useEffect(() => {
    let activeItem = navItems.find(item => {
      if (item.action || item.items) return false;
      if (item.href === '/') return pathname === '/';
      return item.href && item.href !== '/' && pathname.startsWith(item.href);
    });

    if (!activeItem) {
        for(const item of navItems) {
            if (item.items) {
                const foundSubItem = item.items.find(sub => sub.href && pathname.startsWith(sub.href));
                if (foundSubItem) {
                    activeItem = foundSubItem;
                    break;
                }
            }
        }
    }

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

  const renderNavItems = (isMobile: boolean) => (
    navItems.map(item => {
      if (item.items) {
        const isLocked = playerStats.timesPrestiged < (item.requiredTimesPrestiged || 0);
        const groupContent = (
          <div className={cn("space-y-1", isLocked && "opacity-50")}>
            <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-primary/90">
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
              {isLocked && <LockKeyhole className="h-3 w-3 ml-auto" />}
            </div>
            <div className="pl-4 border-l ml-5 flex flex-col gap-1">
              {item.items.map(subItem => (
                <NavLink
                  key={subItem.label}
                  {...subItem}
                  currentTimesPrestiged={playerStats.timesPrestiged}
                  onMobileClick={isMobile ? handleCloseMobileSheet : undefined}
                />
              ))}
            </div>
          </div>
        );

        if (isLocked) {
          return (
            <TooltipProvider delayDuration={100} key={item.label}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-not-allowed">{groupContent}</div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Requires prestige level {item.requiredTimesPrestiged} to unlock.</p>
                  <p className="text-xs">(Currently: {playerStats.timesPrestiged})</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        }
        return <div key={item.label}>{groupContent}</div>;
      }

      return (
        <NavLink
          key={item.label}
          {...item}
          currentTimesPrestiged={playerStats.timesPrestiged}
          onPrestigeClick={item.action === 'prestige' ? handlePrestigeNavClick : undefined}
          onMobileClick={isMobile ? handleCloseMobileSheet : undefined}
        />
      );
    })
  );

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className={finalSidebarClasses}>
        <div className="flex h-full max-h-screen flex-col gap-0">
          <AppLogo />
          <nav className={finalSidebarNavClasses}>
            {mounted ? renderNavItems(false) : <NavSkeleton />}
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
                {mounted ? renderNavItems(true) : <NavSkeleton />}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="flex-1">
            <h1 className="font-semibold text-lg">{currentPageTitle}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Banknote className="h-5 w-5" />
              {mounted ? (
                <span>
                  {playerStats.money.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
              ) : (
                <Skeleton className="h-5 w-24" />
              )}
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

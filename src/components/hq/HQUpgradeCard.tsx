
"use client";

import type { HQUpgrade, HQUpgradeLevel } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LockKeyhole, CheckCircle2, Sparkles, Building, TrendingUp, ChevronsUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";

interface HQUpgradeCardProps {
  hqUpgrade: HQUpgrade;
  playerMoney: number;
  playerPrestigePoints: number;
  playerTimesPrestiged: number;
  currentUpgradeLevels: Record<string, number>;
  onPurchaseUpgrade: (upgradeId: string) => void;
}

export function HQUpgradeCard({
  hqUpgrade,
  playerMoney,
  playerPrestigePoints,
  playerTimesPrestiged,
  currentUpgradeLevels,
  onPurchaseUpgrade,
}: HQUpgradeCardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentLevel = currentUpgradeLevels[hqUpgrade.id] || 0;
  const maxLevel = hqUpgrade.levels.length;
  const isMaxed = currentLevel >= maxLevel;
  const nextLevelData = !isMaxed ? hqUpgrade.levels.find(l => l.level === currentLevel + 1) : undefined;

  if (!mounted) {
    return (
      <Card className="flex flex-col relative transition-shadow duration-200 h-[240px] min-h-[220px]">
        <CardHeader className="pb-3 pt-4">
          <div className="flex items-start gap-3">
            <Skeleton className="h-8 w-8 mt-1 shrink-0 rounded-md" />
            <div className="flex-grow space-y-1.5">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3 w-full mt-1" />
               <Skeleton className="h-3 w-1/2 mt-1" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow space-y-2 text-sm pt-2">
          <Skeleton className="h-3 w-1/3 mb-2" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3 mt-1" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </CardContent>
        <CardFooter className="pt-2">
          <Skeleton className="h-9 w-full" />
        </CardFooter>
      </Card>
    );
  }

  const Icon = hqUpgrade.icon;

  const meetsPrestigeRequirement = hqUpgrade.requiredTimesPrestiged !== undefined ? playerTimesPrestiged >= hqUpgrade.requiredTimesPrestiged : true;

  let canAffordMoney = false;
  let canAffordPP = true; 
  if (nextLevelData) {
    canAffordMoney = playerMoney >= nextLevelData.costMoney;
    if (nextLevelData.costPrestigePoints && nextLevelData.costPrestigePoints > 0) {
      canAffordPP = playerPrestigePoints >= nextLevelData.costPrestigePoints;
    }
  }

  const canPurchaseNextLevel = !isMaxed && nextLevelData && meetsPrestigeRequirement && canAffordMoney && canAffordPP;
  const isTrulyLocked = !isMaxed && (!meetsPrestigeRequirement || (nextLevelData && (!canAffordMoney || !canAffordPP)));

  let lockReasonText = "";
  if (!isMaxed && nextLevelData) {
    if (!meetsPrestigeRequirement && hqUpgrade.requiredTimesPrestiged !== undefined) {
      lockReasonText = `Requires ${hqUpgrade.requiredTimesPrestiged} Prestige(s). You have ${playerTimesPrestiged}.`;
    } else if (!canAffordMoney) {
      lockReasonText = `Needs $${Number(nextLevelData.costMoney).toLocaleString('en-US', { maximumFractionDigits: 0 })}.`;
    } else if (nextLevelData.costPrestigePoints && nextLevelData.costPrestigePoints > 0 && !canAffordPP) {
      lockReasonText = `Needs ${Number(nextLevelData.costPrestigePoints).toLocaleString('en-US')} PP.`;
    }
  }

  let moneyDisplay: string | null = null;
  let ppDisplay: string | null = null;

  if (nextLevelData) {
    if (nextLevelData.costMoney > 0) {
      moneyDisplay = `$${Number(nextLevelData.costMoney).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}`;
    }
    if (nextLevelData.costPrestigePoints && nextLevelData.costPrestigePoints > 0) {
      ppDisplay = `${Number(nextLevelData.costPrestigePoints).toLocaleString('en-US')} PP`;
    }
  }

  return (
    <TooltipProvider delayDuration={100}>
      <Card className={cn(
        "flex flex-col relative transition-shadow duration-200 min-h-[220px]",
        canPurchaseNextLevel && "hover:shadow-lg border-accent",
        isTrulyLocked && !isMaxed && "border-dashed"
      )}>
        {isTrulyLocked && !isMaxed && (
          <div className="absolute inset-0 bg-card/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-[calc(var(--radius)-1px)] p-4 text-center">
            <LockKeyhole className="h-10 w-10 text-primary mb-3" />
            <p className="text-md font-semibold text-primary mb-1">Upgrade Locked</p>
            <p className="text-xs text-muted-foreground">{lockReasonText}</p>
          </div>
        )}

        <CardHeader className={cn("pb-3 pt-4", isTrulyLocked && !isMaxed && "opacity-30")}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <Icon className={cn("h-8 w-8 mt-1 shrink-0 text-muted-foreground", isTrulyLocked && !isMaxed && "opacity-70")} />
              <div className="flex-grow">
                <CardTitle className="text-lg leading-tight">{hqUpgrade.name}</CardTitle>
                <CardDescription className="text-xs mt-1">{hqUpgrade.description}</CardDescription>
              </div>
            </div>
            <Badge variant={isMaxed ? "secondary" : "outline"} className="text-xs ml-2 shrink-0">
              Level {currentLevel} / {maxLevel}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className={cn("flex-grow space-y-2 text-sm pt-2", isTrulyLocked && !isMaxed && "opacity-30")}>
          {nextLevelData ? (
            <>
              <p className="font-medium text-primary">Next Level ({nextLevelData.level}):</p>
              <p className="text-xs text-muted-foreground">{nextLevelData.description}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-muted-foreground">Cost:</span>
                <div className="font-semibold text-right">
                  {!moneyDisplay && !ppDisplay ? (
                    <span className="text-green-500">Free</span>
                  ) : (
                    <div className="flex items-center gap-x-1.5">
                      {moneyDisplay && (
                        <span className="text-green-500">{moneyDisplay}</span>
                      )}
                      {moneyDisplay && ppDisplay && (
                        <span className="text-muted-foreground font-normal mx-0.5">+</span>
                      )}
                      {ppDisplay && (
                        <div className="flex items-center gap-1">
                          <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
                          <span>{ppDisplay}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
             <div className="flex items-center justify-center flex-col h-full text-center">
                <CheckCircle2 className="h-8 w-8 text-green-500 mb-2" />
                <p className="font-semibold text-green-500">Fully Upgraded!</p>
                <p className="text-xs text-muted-foreground">This HQ upgrade is at its maximum level.</p>
            </div>
          )}
          {!isMaxed && nextLevelData && hqUpgrade.requiredTimesPrestiged !== undefined && hqUpgrade.requiredTimesPrestiged > 0 && ( 
            <div className="text-xs text-muted-foreground">
              (Overall Prestige Req: {hqUpgrade.requiredTimesPrestiged})
            </div>
          )}
        </CardContent>
        <CardFooter className={cn("pt-2", isTrulyLocked && !isMaxed && "opacity-30")}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full">
                <Button
                  onClick={() => onPurchaseUpgrade(hqUpgrade.id)}
                  disabled={!canPurchaseNextLevel || isMaxed}
                  className="w-full"
                  variant={canPurchaseNextLevel ? "default" : (isMaxed ? "secondary" : "outline")}
                >
                  {isMaxed ? (
                    <> <CheckCircle2 className="mr-2 h-4 w-4"/> Max Level</>
                  ) : (
                    <> <ChevronsUp className="mr-2 h-4 w-4" /> Upgrade to Level {nextLevelData ? nextLevelData.level : currentLevel + 1} </>
                  )}
                </Button>
              </div>
            </TooltipTrigger>
            {isTrulyLocked && !isMaxed && (
              <TooltipContent><p>{lockReasonText}</p></TooltipContent>
            )}
            {canPurchaseNextLevel && !isMaxed && (
              <TooltipContent><p>Purchase next level.</p></TooltipContent>
            )}
             {isMaxed && (
              <TooltipContent><p>{hqUpgrade.name} is fully upgraded.</p></TooltipContent>
            )}
          </Tooltip>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
}

    
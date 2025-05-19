
"use client";

import type { HQUpgrade } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LockKeyhole, CheckCircle2, Sparkles, DollarSign, Building } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";

interface HQUpgradeCardProps {
  hqUpgrade: HQUpgrade;
  playerMoney: number;
  playerPrestigePoints: number;
  playerTimesPrestiged: number;
  purchasedHQUpgradeIds: string[];
  onPurchaseUpgrade: (upgradeId: string) => void;
}

export function HQUpgradeCard({
  hqUpgrade,
  playerMoney,
  playerPrestigePoints,
  playerTimesPrestiged,
  purchasedHQUpgradeIds,
  onPurchaseUpgrade,
}: HQUpgradeCardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Card className="flex flex-col relative transition-shadow duration-200 h-[220px] min-h-[200px]">
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
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-full" />
        </CardContent>
        <CardFooter className="pt-2">
          <Skeleton className="h-9 w-full" />
        </CardFooter>
      </Card>
    );
  }

  const Icon = hqUpgrade.icon;
  const isPurchased = purchasedHQUpgradeIds.includes(hqUpgrade.id);
  
  const meetsPrestigeRequirement = hqUpgrade.requiredTimesPrestiged ? playerTimesPrestiged >= hqUpgrade.requiredTimesPrestiged : true;
  const canAffordMoney = playerMoney >= hqUpgrade.costMoney;
  const canAffordPP = hqUpgrade.costPrestigePoints ? playerPrestigePoints >= hqUpgrade.costPrestigePoints : true;
  
  const canPurchase = !isPurchased && meetsPrestigeRequirement && canAffordMoney && canAffordPP;
  const isTrulyLocked = !isPurchased && (!meetsPrestigeRequirement || !canAffordMoney || !canAffordPP);

  let lockReasonText = "";
  if (isTrulyLocked) {
    if (!meetsPrestigeRequirement && hqUpgrade.requiredTimesPrestiged) {
      lockReasonText = `Requires ${hqUpgrade.requiredTimesPrestiged} Prestige(s). You have ${playerTimesPrestiged}.`;
    } else if (!canAffordMoney) {
      lockReasonText = `Needs $${hqUpgrade.costMoney.toLocaleString('en-US')}.`;
    } else if (!canAffordPP && hqUpgrade.costPrestigePoints) {
      lockReasonText = `Needs ${hqUpgrade.costPrestigePoints.toLocaleString('en-US')} PP.`;
    }
  }
  
  if (isPurchased) {
    return (
      <Card className={cn(
        "flex flex-col relative transition-shadow duration-200 border-primary shadow-md",
        "p-3 min-h-[80px] justify-center" 
      )}>
        <div className="flex items-center gap-2">
          <Icon className="h-7 w-7 text-primary shrink-0" />
          <div className="flex-grow">
            <CardTitle className="text-base leading-tight font-medium">{hqUpgrade.name}</CardTitle>
          </div>
           <Badge variant="secondary" className="text-xs bg-primary/20 text-primary-foreground border-primary/30 py-0.5 px-1.5 shrink-0">
            <CheckCircle2 className="mr-1 h-3 w-3" /> Purchased
          </Badge>
        </div>
      </Card>
    );
  }

  return (
    <TooltipProvider delayDuration={100}>
      <Card className={cn(
        "flex flex-col relative transition-shadow duration-200 min-h-[200px]", 
        canPurchase && "hover:shadow-lg border-accent", 
        isTrulyLocked && "border-dashed" 
      )}>
        {isTrulyLocked && (
          <div className="absolute inset-0 bg-card/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-[calc(var(--radius)-1px)] p-4 text-center">
            <LockKeyhole className="h-10 w-10 text-primary mb-3" />
            <p className="text-md font-semibold text-primary mb-1">Upgrade Locked</p>
            <p className="text-xs text-muted-foreground">{lockReasonText}</p>
          </div>
        )}

        <CardHeader className={cn("pb-3 pt-4", isTrulyLocked && "opacity-30")}>
          <div className="flex items-start gap-3">
            <Icon className={cn("h-8 w-8 mt-1 shrink-0 text-muted-foreground", isTrulyLocked ? "opacity-70" : "")} />
            <div className="flex-grow">
              <CardTitle className="text-lg leading-tight">{hqUpgrade.name}</CardTitle>
              <CardDescription className="text-xs mt-1">{hqUpgrade.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className={cn("flex-grow space-y-2 text-sm pt-2", isTrulyLocked && "opacity-30")}>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Cost:</span>
            <div className="flex items-center gap-1 font-semibold">
              <DollarSign className="h-4 w-4 text-green-500" /> 
              {hqUpgrade.costMoney.toLocaleString('en-US')}
              {hqUpgrade.costPrestigePoints && (
                <>
                  <span className="text-muted-foreground mx-1">+</span> 
                  <Sparkles className="h-4 w-4 text-amber-400" /> 
                  {hqUpgrade.costPrestigePoints.toLocaleString('en-US')} PP
                </>
              )}
            </div>
          </div>
          {hqUpgrade.requiredTimesPrestiged && (
            <div className="text-xs text-muted-foreground">
              Requires: {hqUpgrade.requiredTimesPrestiged} Prestige(s)
            </div>
          )}
        </CardContent>
        <CardFooter className={cn("pt-2", isTrulyLocked && "opacity-30")}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full">
                <Button
                  onClick={() => onPurchaseUpgrade(hqUpgrade.id)}
                  disabled={!canPurchase || isTrulyLocked} 
                  className="w-full"
                  variant={canPurchase ? "default" : "outline"}
                >
                  <Building className="mr-2 h-4 w-4" /> Purchase Upgrade
                </Button>
              </div>
            </TooltipTrigger>
            {(!isPurchased && canPurchase && !isTrulyLocked) && (
              <TooltipContent><p>Purchase this HQ Upgrade.</p></TooltipContent>
            )}
             {isTrulyLocked && (
              <TooltipContent><p>{lockReasonText}</p></TooltipContent>
            )}
          </Tooltip>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
}

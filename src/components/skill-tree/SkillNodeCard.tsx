
"use client";

import type { SkillNode } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LockKeyhole, CheckCircle2, Sparkles } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";

interface SkillNodeCardProps {
  skillNode: SkillNode;
  playerPrestigePoints: number;
  unlockedSkillIds: string[];
  onUnlockSkill: (skillId: string) => void;
}

export function SkillNodeCard({ skillNode, playerPrestigePoints, unlockedSkillIds, onUnlockSkill }: SkillNodeCardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <TooltipProvider delayDuration={100}>
        <Card className="flex flex-col relative transition-shadow duration-200 h-[230px]"> {/* Approx height of a card */}
          <CardHeader className="pb-3 pt-4">
            <div className="flex items-start gap-3">
              <Skeleton className="h-10 w-10 mt-1 shrink-0 rounded-md" />
              <div className="flex-grow space-y-1.5">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-full mt-1" />
                <Skeleton className="h-3 w-5/6 mt-1" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-grow space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
            <Skeleton className="h-3 w-1/2 mt-1" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-9 w-full" />
          </CardFooter>
        </Card>
      </TooltipProvider>
    );
  }

  const Icon = skillNode.icon;
  const isUnlocked = unlockedSkillIds.includes(skillNode.id);
  
  const dependenciesMet = skillNode.dependencies 
    ? skillNode.dependencies.every(depId => unlockedSkillIds.includes(depId))
    : true;
  
  const canAfford = playerPrestigePoints >= skillNode.cost;
  const canUnlock = !isUnlocked && dependenciesMet && canAfford;
  
  const showLockOverlay = !isUnlocked && (!dependenciesMet || !canAfford);

  let lockReasonText = "";
  if (showLockOverlay) {
    if (!dependenciesMet) {
      const dependencyNames = skillNode.dependencies
        ?.map(depId => {
          // Assuming skill IDs are like 'global_income_boost_1', format to "Global Income Boost 1"
          // This part might need to fetch actual skill names if available or use a simpler formatting
          const skillInTree = INITIAL_SKILL_TREE.find(s => s.id === depId); // Assuming INITIAL_SKILL_TREE is accessible or passed
          return skillInTree ? skillInTree.name : depId.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        })
        .join(', ');
      lockReasonText = `Requires: ${dependencyNames || 'Prerequisites'}`;
    } else if (!canAfford) {
      lockReasonText = `Needs ${skillNode.cost} PP (You have ${playerPrestigePoints.toLocaleString('en-US')})`;
    }
  }


  return (
    <TooltipProvider delayDuration={100}>
      <Card className={cn(
        "flex flex-col relative transition-shadow duration-200",
        isUnlocked && "border-primary shadow-lg", 
        !isUnlocked && canUnlock && "hover:shadow-lg border-transparent", // Keep border transparent if not locked or unlocked
        showLockOverlay && "border-dashed" 
      )}>
        {isUnlocked && (
          <Badge variant="secondary" className="text-xs absolute top-3 right-3 z-20 bg-primary/20 text-primary-foreground border-primary/30 py-1 px-2">
            <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Unlocked
          </Badge>
        )}

        {showLockOverlay && (
          <div className="absolute inset-0 bg-card/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-[calc(var(--radius)-1px)] p-4 text-center">
            <LockKeyhole className="h-10 w-10 text-primary mb-3" />
            <p className="text-md font-semibold text-primary mb-1">Skill Locked</p>
            <p className="text-xs text-muted-foreground">{lockReasonText}</p>
          </div>
        )}

        <CardHeader className={cn("pb-3 pt-4", showLockOverlay && "opacity-30")}>
          <div className="flex items-start gap-3">
            <Icon className={cn("h-10 w-10 mt-1 shrink-0", isUnlocked ? "text-primary" : "text-muted-foreground", showLockOverlay ? "opacity-70" : "")} />
            <div className="flex-grow">
              <CardTitle className="text-lg leading-tight">{skillNode.name}</CardTitle>
              <CardDescription className="text-xs mt-1">{skillNode.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className={cn("flex-grow space-y-2 text-sm", showLockOverlay && "opacity-30")}>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Cost:</span>
            <div className="flex items-center gap-1 font-semibold">
              <Sparkles className="h-4 w-4 text-amber-400" /> 
              {skillNode.cost.toLocaleString('en-US')} PP
            </div>
          </div>
          {skillNode.dependencies && skillNode.dependencies.length > 0 && (
            <div className="text-xs text-muted-foreground">
              Requires: {skillNode.dependencies.map(depId => {
                  const depSkill = INITIAL_SKILL_TREE.find(s => s.id === depId);
                  return depSkill ? depSkill.name : depId.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
              }).join(', ')}
            </div>
          )}
        </CardContent>
        <CardFooter className={cn(showLockOverlay && "opacity-30")}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full">
                <Button
                  onClick={() => onUnlockSkill(skillNode.id)}
                  disabled={!canUnlock || showLockOverlay} 
                  className="w-full"
                  variant={isUnlocked ? "outline" : "default"}
                >
                  {isUnlocked ? (
                    <><CheckCircle2 className="mr-2 h-4 w-4" /> Unlocked</>
                  ) : (
                    <><Sparkles className="mr-2 h-4 w-4" /> Unlock Skill</>
                  )}
                </Button>
              </div>
            </TooltipTrigger>
            {(!isUnlocked && canUnlock && !showLockOverlay) && (
              <TooltipContent><p>Unlock for {skillNode.cost.toLocaleString('en-US')} Prestige Points.</p></TooltipContent>
            )}
             {showLockOverlay && (
              <TooltipContent><p>{lockReasonText}</p></TooltipContent>
            )}
          </Tooltip>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
}

// A stand-in for INITIAL_SKILL_TREE for dependency name resolution
// This would ideally come from context or props if game-config is not directly importable here
// For simplicity, this example assumes it can be accessed or that a simpler formatting is used.
// If game-config.ts is in the same project, it can be imported.
import { INITIAL_SKILL_TREE } from '@/config/game-config';

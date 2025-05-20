
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
import { INITIAL_SKILL_TREE } from '@/config/game-config'; 

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
      <Card className="flex flex-col relative transition-shadow duration-200 h-[200px] min-h-[180px]"> 
        <CardHeader className="pb-3 pt-4">
          <div className="flex items-start gap-3">
            <Skeleton className="h-8 w-8 mt-1 shrink-0 rounded-md" />
            <div className="flex-grow space-y-1.5">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3 w-full mt-1" />
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

  const Icon = skillNode.icon;
  const isUnlocked = unlockedSkillIds.includes(skillNode.id);
  
  const dependenciesMet = skillNode.dependencies 
    ? skillNode.dependencies.every(depId => unlockedSkillIds.includes(depId))
    : true;
  
  const canAfford = playerPrestigePoints >= skillNode.cost;
  const canUnlock = !isUnlocked && dependenciesMet && canAfford;
  
  const isTrulyLocked = !isUnlocked && (!dependenciesMet || !canAfford);

  let lockReasonText = "";
  if (isTrulyLocked) {
    if (!dependenciesMet && skillNode.dependencies) {
      const dependencyNames = skillNode.dependencies
        .map(depId => {
          const depSkill = INITIAL_SKILL_TREE.find(s => s.id === depId);
          return depSkill ? depSkill.name : depId.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        })
        .join(', ');
      lockReasonText = `Requires: ${dependencyNames || 'Prerequisites'}`;
    } else if (!canAfford) {
      lockReasonText = `Needs ${skillNode.cost.toLocaleString('en-US')} PP (You have ${playerPrestigePoints.toLocaleString('en-US')})`;
    }
  }

  if (isUnlocked) {
    return (
      <Card className={cn(
        "flex flex-col relative transition-shadow duration-200 border-primary shadow-md",
        "p-3 min-h-[80px] justify-center" 
      )}>
        <div className="flex items-center gap-2">
          <Icon className="h-7 w-7 text-primary shrink-0" />
          <div className="flex-grow">
            <CardTitle className="text-base leading-tight font-medium">{skillNode.name}</CardTitle>
          </div>
           <Badge variant="secondary" className="text-xs bg-primary/20 text-primary-foreground border-primary/30 py-0.5 px-1.5 shrink-0">
            <CheckCircle2 className="mr-1 h-3 w-3" /> Done
          </Badge>
        </div>
      </Card>
    );
  }

  return (
    <TooltipProvider delayDuration={100}>
      <Card className={cn(
        "flex flex-col relative transition-shadow duration-200 min-h-[180px]", 
        canUnlock && "hover:shadow-lg border-accent", 
        isTrulyLocked && "border-dashed" 
      )}>
        {isTrulyLocked && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-[calc(var(--radius)-1px)] p-4 text-center">
            <LockKeyhole className="h-10 w-10 text-primary mb-3" />
            <p className="text-md font-semibold text-primary mb-1">Skill Locked</p>
            <p className="text-xs text-muted-foreground">{lockReasonText}</p>
          </div>
        )}

        <CardHeader className={cn("pb-3 pt-4", isTrulyLocked && "opacity-30")}>
          <div className="flex items-start gap-3">
            <Icon className={cn("h-8 w-8 mt-1 shrink-0 text-muted-foreground", isTrulyLocked ? "opacity-70" : "")} />
            <div className="flex-grow">
              <CardTitle className="text-lg leading-tight">{skillNode.name}</CardTitle>
              <CardDescription className="text-xs mt-1">{skillNode.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className={cn("flex-grow space-y-2 text-sm pt-2", isTrulyLocked && "opacity-30")}>
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
        <CardFooter className={cn("pt-2", isTrulyLocked && "opacity-30")}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full">
                <Button
                  onClick={() => onUnlockSkill(skillNode.id)}
                  disabled={!canUnlock || isTrulyLocked} 
                  className="w-full"
                  variant={canUnlock ? "default" : "outline"}
                >
                  <Sparkles className="mr-2 h-4 w-4" /> Unlock Skill
                </Button>
              </div>
            </TooltipTrigger>
            {(!isUnlocked && canUnlock && !isTrulyLocked) && (
              <TooltipContent><p>Unlock for {skillNode.cost.toLocaleString('en-US')} Prestige Points.</p></TooltipContent>
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

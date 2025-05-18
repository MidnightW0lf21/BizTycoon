
"use client";

import type { SkillNode } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LockKeyhole, CheckCircle2, Sparkles } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface SkillNodeCardProps {
  skillNode: SkillNode;
  playerPrestigePoints: number;
  unlockedSkillIds: string[];
  onUnlockSkill: (skillId: string) => void;
}

export function SkillNodeCard({ skillNode, playerPrestigePoints, unlockedSkillIds, onUnlockSkill }: SkillNodeCardProps) {
  const Icon = skillNode.icon;
  const isUnlocked = unlockedSkillIds.includes(skillNode.id);
  
  const dependenciesMet = skillNode.dependencies 
    ? skillNode.dependencies.every(depId => unlockedSkillIds.includes(depId))
    : true;
  
  const canAfford = playerPrestigePoints >= skillNode.cost;
  const canUnlock = !isUnlocked && dependenciesMet && canAfford;
  
  // Condition for showing the full lock overlay
  const showLockOverlay = !isUnlocked && (!dependenciesMet || !canAfford);

  let lockReasonText = "";
  if (showLockOverlay) {
    if (!dependenciesMet) {
      const dependencyNames = skillNode.dependencies
        ?.map(depId => {
          // Assuming skill IDs are like 'global_income_boost_1', format to "Global Income Boost 1"
          return depId.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        })
        .join(', ');
      lockReasonText = `Requires: ${dependencyNames || 'Prerequisites'}`;
    } else if (!canAfford) {
      lockReasonText = `Needs ${skillNode.cost} PP (You have ${playerPrestigePoints})`;
    }
  }

  return (
    <TooltipProvider delayDuration={100}>
      <Card className={cn(
        "flex flex-col relative transition-shadow duration-200",
        isUnlocked && "border-primary shadow-md", 
        !isUnlocked && canUnlock && "hover:shadow-lg",
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
            <Icon className={cn("h-10 w-10 mt-1 shrink-0", isUnlocked ? "text-primary" : "text-muted-foreground")} />
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
              {skillNode.cost} PP
            </div>
          </div>
          {skillNode.dependencies && skillNode.dependencies.length > 0 && (
            <div className="text-xs text-muted-foreground">
              Requires: {skillNode.dependencies.map(dep => dep.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')).join(', ')}
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
              <TooltipContent><p>Unlock for {skillNode.cost} Prestige Points.</p></TooltipContent>
            )}
          </Tooltip>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
}

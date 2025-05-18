
"use client";

import type { SkillNode } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LockKeyhole, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";
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
  const isTrulyLocked = !isUnlocked && (!dependenciesMet || !canAfford);


  let statusBadge = null;
  let tooltipMessage = "";

  if (isUnlocked) {
    statusBadge = <Badge variant="secondary" className="text-xs absolute top-2 right-2 z-10"><CheckCircle2 className="mr-1 h-3 w-3" /> Unlocked</Badge>;
  } else if (!dependenciesMet) {
    statusBadge = <Badge variant="outline" className="text-xs absolute top-2 right-2 z-10"><LockKeyhole className="mr-1 h-3 w-3" /> Locked</Badge>;
    tooltipMessage = `Requires prerequisite skill(s): ${skillNode.dependencies?.map(dep => dep.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')).join(', ') || 'None'}`;
  } else if (!canAfford) {
    statusBadge = <Badge variant="destructive" className="text-xs absolute top-2 right-2 z-10"><AlertTriangle className="mr-1 h-3 w-3" /> Cost: {skillNode.cost} PP</Badge>;
    tooltipMessage = `Not enough Prestige Points. Need ${skillNode.cost}, have ${playerPrestigePoints}.`;
  } else {
     tooltipMessage = `Unlock for ${skillNode.cost} Prestige Points.`;
  }

  const contentOpacityClass = isTrulyLocked ? "opacity-50" : "";

  return (
    <TooltipProvider delayDuration={100}>
      <Card className={cn(
        "flex flex-col relative",
        isUnlocked && "border-primary shadow-sm", 
        isTrulyLocked && "bg-muted/50 border-dashed", // Card itself gets muted bg and dashed border
        !isUnlocked && canUnlock && "hover:shadow-lg" // Highlight for unlockable cards
      )}>
        {statusBadge} {/* Badge is outside the opacity-affected content sections */}
        <CardHeader className={cn("pb-3 pt-4", contentOpacityClass)}>
          <div className="flex items-start gap-3">
            <Icon className={cn("h-10 w-10 mt-1", isUnlocked ? "text-primary" : "text-muted-foreground")} />
            <div>
              <CardTitle className="text-lg">{skillNode.name}</CardTitle>
              <CardDescription className="text-xs mt-1">{skillNode.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className={cn("flex-grow space-y-2 text-sm", contentOpacityClass)}>
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
        <CardFooter className={cn(contentOpacityClass)}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full"> {/* Div wrapper for TooltipTrigger when button is disabled */}
                <Button
                  onClick={() => onUnlockSkill(skillNode.id)}
                  disabled={!canUnlock} // Button is disabled by its own logic if not unlockable
                  className="w-full"
                  variant={isUnlocked ? "outline" : "default"}
                >
                  {isUnlocked ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" /> Unlocked
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" /> Unlock Skill
                    </>
                  )}
                </Button>
              </div>
            </TooltipTrigger>
            {(tooltipMessage && !isUnlocked) && <TooltipContent><p>{tooltipMessage}</p></TooltipContent>}
          </Tooltip>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
}


"use client";

import type { ResearchItemConfig } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LockKeyhole, CheckCircle2, FlaskConical, Sparkles, DollarSign } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { INITIAL_RESEARCH_ITEMS_CONFIG } from "@/config/game-config";
import React from 'react';

interface ResearchItemCardProps {
  researchConfig: ResearchItemConfig;
  playerResearchPoints: number;
  playerMoney: number;
  unlockedResearchIds: string[];
  onPurchase: (researchId: string) => void;
}

const ResearchItemCard = React.memo(function ResearchItemCard({
  researchConfig,
  playerResearchPoints,
  playerMoney,
  unlockedResearchIds,
  onPurchase,
}: ResearchItemCardProps) {
  const Icon = researchConfig.icon || FlaskConical;
  const isUnlocked = unlockedResearchIds.includes(researchConfig.id);
  
  const dependenciesMet = researchConfig.dependencies 
    ? researchConfig.dependencies.every(depId => unlockedResearchIds.includes(depId))
    : true;
  
  const canAffordRP = playerResearchPoints >= researchConfig.costRP;
  const canAffordMoney = researchConfig.costMoney ? playerMoney >= researchConfig.costMoney : true;
  const canUnlock = !isUnlocked && dependenciesMet && canAffordRP && canAffordMoney;
  
  const isTrulyLocked = !isUnlocked && (!dependenciesMet || !canAffordRP || !canAffordMoney);

  let lockReasonText = "";
  if (isTrulyLocked) {
    if (!dependenciesMet && researchConfig.dependencies) {
      const dependencyNames = researchConfig.dependencies
        .map(depId => {
          const depResearch = INITIAL_RESEARCH_ITEMS_CONFIG.find(r => r.id === depId);
          return depResearch ? depResearch.name : depId.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        })
        .join(', ');
      lockReasonText = `Requires: ${dependencyNames || 'Prerequisites'}`;
    } else if (!canAffordRP) {
      lockReasonText = `Needs ${researchConfig.costRP.toLocaleString('en-US')} RP.`;
    } else if (!canAffordMoney && researchConfig.costMoney) {
      lockReasonText = `Needs $${researchConfig.costMoney.toLocaleString('en-US')}.`;
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
            <CardTitle className="text-base leading-tight font-medium">{researchConfig.name}</CardTitle>
          </div>
           <Badge variant="secondary" className="text-xs bg-primary/20 text-primary-foreground border-primary/30 py-0.5 px-1.5 shrink-0">
            <CheckCircle2 className="mr-1 h-3 w-3" /> Researched
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
          <div className="absolute inset-0 bg-card/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-[calc(var(--radius)-1px)] p-4 text-center">
            <LockKeyhole className="h-10 w-10 text-primary mb-3" />
            <p className="text-md font-semibold text-primary mb-1">Research Locked</p>
            <p className="text-xs text-muted-foreground">{lockReasonText}</p>
          </div>
        )}

        <CardHeader className={cn("pb-3 pt-4", isTrulyLocked && "opacity-30")}>
          <div className="flex items-start gap-3">
            <Icon className={cn("h-8 w-8 mt-1 shrink-0 text-muted-foreground", isTrulyLocked ? "opacity-70" : "")} />
            <div className="flex-grow">
              <CardTitle className="text-lg leading-tight">{researchConfig.name}</CardTitle>
              <CardDescription className="text-xs mt-1">{researchConfig.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className={cn("flex-grow space-y-2 text-sm pt-2", isTrulyLocked && "opacity-30")}>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">RP Cost:</span>
            <div className="flex items-center gap-1 font-semibold">
              <FlaskConical className="h-4 w-4 text-purple-400" /> 
              {researchConfig.costRP.toLocaleString('en-US')} RP
            </div>
          </div>
          {researchConfig.costMoney && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Money Cost:</span>
              <div className="flex items-center gap-1 font-semibold">
                <DollarSign className="h-4 w-4 text-green-500" /> 
                ${researchConfig.costMoney.toLocaleString('en-US')}
              </div>
            </div>
          )}
          {researchConfig.dependencies && researchConfig.dependencies.length > 0 && (
            <div className="text-xs text-muted-foreground">
              Requires: {researchConfig.dependencies.map(depId => {
                  const depResearch = INITIAL_RESEARCH_ITEMS_CONFIG.find(r => r.id === depId);
                  return depResearch ? depResearch.name : depId.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
              }).join(', ')}
            </div>
          )}
        </CardContent>
        <CardFooter className={cn("pt-2", isTrulyLocked && "opacity-30")}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full">
                <Button
                  onClick={() => onPurchase(researchConfig.id)}
                  disabled={!canUnlock || isTrulyLocked} 
                  className="w-full"
                  variant={canUnlock ? "default" : "outline"}
                >
                  <FlaskConical className="mr-2 h-4 w-4" /> Begin Research
                </Button>
              </div>
            </TooltipTrigger>
            {(!isUnlocked && canUnlock && !isTrulyLocked) && (
              <TooltipContent>
                <p>Begin research for {researchConfig.costRP.toLocaleString('en-US')} RP {researchConfig.costMoney ? `and $${researchConfig.costMoney.toLocaleString('en-US')}` : ''}.</p>
              </TooltipContent>
            )}
             {isTrulyLocked && (
              <TooltipContent><p>{lockReasonText}</p></TooltipContent>
            )}
          </Tooltip>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
});

export { ResearchItemCard };

    
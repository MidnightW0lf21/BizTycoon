
"use client";

import type { FactoryPowerBuildingConfig } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, DollarSign, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FactoryPowerBuildingCardProps {
  powerBuildingConfig: FactoryPowerBuildingConfig;
  numOwned: number;
  currentMoney: number;
  onPurchase: (configId: string) => void;
}

export function FactoryPowerBuildingCard({
  powerBuildingConfig,
  numOwned,
  currentMoney,
  onPurchase,
}: FactoryPowerBuildingCardProps) {
  const Icon = powerBuildingConfig.icon;
  const costForNext = powerBuildingConfig.baseCost * Math.pow(powerBuildingConfig.costMultiplier || 1.1, numOwned);
  const canAfford = currentMoney >= costForNext;
  const maxReached = powerBuildingConfig.maxInstances !== undefined && numOwned >= powerBuildingConfig.maxInstances;

  const handlePurchase = () => {
    if (!maxReached) {
      onPurchase(powerBuildingConfig.id);
    }
  };

  return (
    <TooltipProvider delayDuration={100}>
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Icon className="h-6 w-6 text-primary" />
              {powerBuildingConfig.name}
            </CardTitle>
            <div className="flex items-center text-sm font-semibold text-yellow-400">
              <Zap className="h-4 w-4 mr-1" />
              {powerBuildingConfig.powerOutputKw} kW
            </div>
          </div>
          <CardDescription className="text-xs">{powerBuildingConfig.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 pt-2 pb-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Owned:</span>
            <span className="font-semibold">{numOwned}{powerBuildingConfig.maxInstances !== undefined ? ` / ${powerBuildingConfig.maxInstances}` : ''}</span>
          </div>
          {!maxReached && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cost for Next:</span>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-red-500" />
                <span className="font-semibold text-red-500">
                  ${costForNext.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          )}
           {maxReached && (
            <p className="text-center text-green-500 font-semibold">Max Instances Owned</p>
           )}
        </CardContent>
        <CardFooter className="pt-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full">
                <Button
                  onClick={handlePurchase}
                  disabled={!canAfford || maxReached}
                  className="w-full"
                  variant={canAfford && !maxReached ? "default" : "outline"}
                >
                  {maxReached ? "Max Owned" : (canAfford ? "Build" : "Cannot Afford")}
                </Button>
              </div>
            </TooltipTrigger>
            {!maxReached && !canAfford && (
              <TooltipContent>
                <p>Requires ${costForNext.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
}

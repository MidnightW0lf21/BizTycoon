
"use client";

import type { FactoryMaterialCollectorConfig } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, DollarSign, Info, PackagePlus, SlidersHorizontal } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FactoryMaterialCollectorCardProps {
  collectorConfig: FactoryMaterialCollectorConfig;
  numOwned: number;
  currentMoney: number;
  onPurchase: (configId: string) => void;
}

export function FactoryMaterialCollectorCard({
  collectorConfig,
  numOwned,
  currentMoney,
  onPurchase,
}: FactoryMaterialCollectorCardProps) {
  const Icon = collectorConfig.icon;
  const costForNext = collectorConfig.baseCost * Math.pow(collectorConfig.costMultiplier || 1.15, numOwned);
  const canAfford = currentMoney >= costForNext;
  const maxReached = collectorConfig.maxInstances !== undefined && numOwned >= collectorConfig.maxInstances;

  const handlePurchase = () => {
    if (!maxReached) {
      onPurchase(collectorConfig.id);
    }
  };

  return (
    <TooltipProvider delayDuration={100}>
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Icon className="h-6 w-6 text-primary" />
              {collectorConfig.name}
            </CardTitle>
          </div>
          <CardDescription className="text-xs">{collectorConfig.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 pt-2 pb-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Owned:</span>
            <span className="font-semibold">{numOwned}{collectorConfig.maxInstances !== undefined ? ` / ${collectorConfig.maxInstances}` : ''}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Materials/sec:</span>
            <div className="flex items-center gap-1 font-semibold text-green-500">
              <SlidersHorizontal className="h-4 w-4" /> {collectorConfig.materialsPerSecond}
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Power Cons.:</span>
            <div className="flex items-center gap-1 font-semibold text-orange-400">
              <Zap className="h-4 w-4" /> {collectorConfig.powerConsumptionKw} kW
            </div>
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
                  <PackagePlus className="mr-2 h-4 w-4" />
                  {maxReached ? "Max Owned" : (canAfford ? "Deploy" : "Cannot Afford")}
                </Button>
              </div>
            </TooltipTrigger>
            {!maxReached && !canAfford && (
              <TooltipContent>
                <p>Requires ${costForNext.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
              </TooltipContent>
            )}
             {canAfford && !maxReached && (
              <TooltipContent>
                <p>Deploy a {collectorConfig.name}.</p>
              </TooltipContent>
            )}
          </Tooltip>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
}

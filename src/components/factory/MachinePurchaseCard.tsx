
"use client";

import type { FactoryMachineConfig } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Zap, ShoppingCart, Info, Box } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import React from "react"; // Import React

interface MachinePurchaseCardProps {
  machineConfig: FactoryMachineConfig;
  playerMoney: number;
  onPurchase: (configId: string) => void; // Changed prop
  isResearchLocked: boolean;
  researchItemName?: string;
}

// Wrap MachinePurchaseCard with React.memo
const MachinePurchaseCard = React.memo(function MachinePurchaseCard({
  machineConfig,
  playerMoney,
  onPurchase, // Changed prop
  isResearchLocked,
  researchItemName,
}: MachinePurchaseCardProps) {
  const Icon = machineConfig.icon;
  const displayCost = machineConfig.baseCost;
  const canAfford = playerMoney >= displayCost;
  const canPurchase = !isResearchLocked && canAfford;

  const handlePurchase = () => {
    if (!isResearchLocked) {
      onPurchase(machineConfig.id); // Call with configId
    }
  };

  let buttonText = "Build Machine";
  let buttonTooltipContent = `Build a ${machineConfig.name}.`;

  if (isResearchLocked) {
    buttonText = "Research Required";
    buttonTooltipContent = researchItemName ? `Requires "${researchItemName}" research.` : "Research required to unlock.";
  } else if (!canAfford) {
    buttonText = "Cannot Afford";
    buttonTooltipContent = `Requires $${displayCost.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  }


  return (
    <TooltipProvider delayDuration={100}>
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Icon className="h-6 w-6 text-primary" />
              {machineConfig.name}
            </CardTitle>
          </div>
          <CardDescription className="text-xs">{machineConfig.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 pt-2 pb-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Power Consumption:</span>
            <div className="flex items-center gap-1 font-semibold text-orange-400">
              <Zap className="h-4 w-4" /> {machineConfig.powerConsumptionKw} kW
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Max Craftable Tier:</span>
            <div className="flex items-center gap-1 font-semibold text-blue-400">
               <Info className="h-4 w-4" /> Tier {machineConfig.maxCraftableTier}
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Cost:</span>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-red-500" />
              <span className="font-semibold text-red-500">
                ${displayCost.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>
           {isResearchLocked && researchItemName && (
            <p className="text-xs text-amber-600">Requires: "{researchItemName}" research.</p>
          )}
        </CardContent>
        <CardFooter className="pt-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full">
                <Button
                  onClick={handlePurchase}
                  disabled={!canPurchase || isResearchLocked}
                  className="w-full"
                  variant={canPurchase && !isResearchLocked ? "default" : "outline"}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {buttonText}
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{buttonTooltipContent}</p>
            </TooltipContent>
          </Tooltip>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
});

export { MachinePurchaseCard };

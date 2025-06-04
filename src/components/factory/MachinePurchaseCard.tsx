
"use client";

import type { FactoryMachineConfig } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Zap, ShoppingCart, Info, Box } from "lucide-react"; // Added Box
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MachinePurchaseCardProps {
  machineConfig: FactoryMachineConfig;
  nextMachineCost: number;
  playerMoney: number;
  onPurchase: (configId: string) => void;
}

export function MachinePurchaseCard({
  machineConfig,
  nextMachineCost,
  playerMoney,
  onPurchase,
}: MachinePurchaseCardProps) {
  const Icon = machineConfig.icon;
  const canAfford = playerMoney >= nextMachineCost;

  const handlePurchase = () => {
    onPurchase(machineConfig.id);
  };

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
            <span className="text-muted-foreground">Materials per Unit:</span>
             <div className="flex items-center gap-1 font-semibold text-blue-400">
              <Box className="h-4 w-4" /> {machineConfig.rawMaterialCostPerComponent} units
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Cost for Next:</span>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-red-500" />
              <span className="font-semibold text-red-500">
                ${nextMachineCost.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full">
                <Button
                  onClick={handlePurchase}
                  disabled={!canAfford}
                  className="w-full"
                  variant={canAfford ? "default" : "outline"}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {canAfford ? "Build Machine" : "Cannot Afford"}
                </Button>
              </div>
            </TooltipTrigger>
            {!canAfford && (
              <TooltipContent>
                <p>Requires ${nextMachineCost.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
              </TooltipContent>
            )}
             {canAfford && (
              <TooltipContent>
                <p>Build a {machineConfig.name}.</p>
              </TooltipContent>
            )}
          </Tooltip>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
}


"use client";

import type { FactoryProductionLine, FactoryMachine, FactoryMachineConfig } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Wrench } from "lucide-react";
import { INITIAL_FACTORY_MACHINE_CONFIGS } from "@/config/game-config"; // For machine details

interface ProductionLineDisplayProps {
  productionLine: FactoryProductionLine;
  allMachines: FactoryMachine[]; // All machines owned by the player
  lineIndex: number;
  // Add functions later for assigning/managing machines
}

export function ProductionLineDisplay({ productionLine, allMachines, lineIndex }: ProductionLineDisplayProps) {
  
  const getMachineDetails = (instanceId: string | null): FactoryMachineConfig | null => {
    if (!instanceId) return null;
    const machineInstance = allMachines.find(m => m.instanceId === instanceId);
    if (!machineInstance) return null;
    return INITIAL_FACTORY_MACHINE_CONFIGS.find(mc => mc.id === machineInstance.configId) || null;
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-2 pt-3">
        <CardTitle className="text-lg">Production Line {lineIndex + 1}</CardTitle>
        <CardDescription className="text-xs">Assign machines to this line to produce components.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-6 gap-2 p-3">
        {productionLine.machineInstanceIds.map((machineInstanceId, slotIndex) => {
          const machineConfig = getMachineDetails(machineInstanceId);
          return (
            <div
              key={slotIndex}
              className="aspect-square border border-dashed border-muted-foreground/50 rounded-md flex flex-col items-center justify-center p-2 text-center bg-muted/20 hover:bg-muted/40 transition-colors"
            >
              {machineInstanceId && machineConfig ? (
                <>
                  <machineConfig.icon className="h-6 w-6 mb-1 text-primary" />
                  <p className="text-xs font-medium truncate w-full" title={machineConfig.name}>{machineConfig.name}</p>
                  <p className_="text-xs text-muted-foreground">Slot {slotIndex + 1}</p>
                </>
              ) : (
                <>
                  <PlusCircle className="h-6 w-6 mb-1 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Empty Slot {slotIndex + 1}</p>
                </>
              )}
              {/* Button to manage/assign machine will go here */}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

    
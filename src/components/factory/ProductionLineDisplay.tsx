
"use client";

import type { FactoryProductionLine, FactoryMachine, FactoryMachineConfig } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// Button import removed as it's no longer used for unassign
import { PlusCircle, Wrench, Loader2 } from "lucide-react"; // XCircle removed
import { INITIAL_FACTORY_MACHINE_CONFIGS } from "@/config/game-config";
import { useGame } from "@/contexts/GameContext"; 

interface ProductionLineDisplayProps {
  productionLine: FactoryProductionLine;
  allMachines: FactoryMachine[];
  lineIndex: number;
}

export function ProductionLineDisplay({ productionLine, allMachines, lineIndex }: ProductionLineDisplayProps) {
  // unassignMachineFromProductionLine is no longer called from here
  // const { unassignMachineFromProductionLine } = useGame(); 

  const getMachineDetails = (instanceId: string | null): FactoryMachineConfig | null => {
    if (!instanceId) return null;
    const machineInstance = allMachines.find(m => m.instanceId === instanceId);
    if (!machineInstance) return null;
    return INITIAL_FACTORY_MACHINE_CONFIGS.find(mc => mc.id === machineInstance.configId) || null;
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-2 pt-3">
        <CardTitle className="text-lg">{productionLine.name}</CardTitle>
        <CardDescription className="text-xs">Machines are auto-assigned to empty slots in this line.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-3 sm:grid-cols-6 gap-2 p-3">
        {productionLine.machineInstanceIds.map((machineInstanceId, slotIndex) => {
          const machineConfig = getMachineDetails(machineInstanceId);
          return (
            <div
              key={slotIndex}
              className="aspect-square border border-dashed border-muted-foreground/50 rounded-md flex flex-col items-center justify-center p-1 text-center bg-muted/20 transition-colors"
            >
              {machineInstanceId && machineConfig ? (
                <>
                  <machineConfig.icon className="h-5 w-5 sm:h-6 sm:w-6 mb-1 text-primary" />
                  <p className="text-[10px] sm:text-xs font-medium truncate w-full" title={machineConfig.name}>{machineConfig.name}</p>
                  <p className="text-[9px] sm:text-[10px] text-muted-foreground">Slot {slotIndex + 1}</p>
                  {/* Unassign button removed */}
                </>
              ) : (
                <>
                  <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 mb-1 text-muted-foreground/50 animate-pulse" />
                  <p className="text-[10px] sm:text-xs text-muted-foreground/70">Empty Slot</p>
                </>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}


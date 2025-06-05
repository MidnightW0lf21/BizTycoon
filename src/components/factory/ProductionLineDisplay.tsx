
"use client";

import type { FactoryProductionLine, FactoryMachine, FactoryMachineConfig, FactoryComponent } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Wrench, Loader2, Settings } from "lucide-react";
import { INITIAL_FACTORY_MACHINE_CONFIGS, INITIAL_FACTORY_COMPONENTS_CONFIG } from "@/config/game-config";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductionLineDisplayProps {
  productionLine: FactoryProductionLine;
  allMachines: FactoryMachine[];
  lineIndex: number;
  onOpenRecipeDialog: (productionLineId: string, slotIndex: number) => void;
}

export function ProductionLineDisplay({ productionLine, allMachines, lineIndex, onOpenRecipeDialog }: ProductionLineDisplayProps) {

  const getMachineDetails = (instanceId: string | null): FactoryMachineConfig | null => {
    if (!instanceId) return null;
    const machineInstance = allMachines.find(m => m.instanceId === instanceId);
    if (!machineInstance) return null;
    return INITIAL_FACTORY_MACHINE_CONFIGS.find(mc => mc.id === machineInstance.configId) || null;
  };

  const getComponentDetails = (componentId: string | null): FactoryComponent | null => {
    if (!componentId) return null;
    return INITIAL_FACTORY_COMPONENTS_CONFIG.find(cc => cc.id === componentId) || null;
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-2 pt-3">
        <CardTitle className="text-lg">{productionLine.name}</CardTitle>
        <CardDescription className="text-xs">
          Machines are auto-assigned. Click a machine to set or change its recipe.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-3 sm:grid-cols-6 gap-2 p-3">
        {productionLine.slots.map((slot, slotIndex) => {
          const machineConfig = getMachineDetails(slot.machineInstanceId);
          const componentConfig = getComponentDetails(slot.targetComponentId);
          const MachineIcon = machineConfig?.icon || Loader2;
          const ComponentIcon = componentConfig?.icon || PlusCircle;

          return (
            <Button
              key={slotIndex}
              variant="outline"
              className={cn(
                "aspect-square border-dashed border-muted-foreground/50 rounded-md flex flex-col items-center justify-center p-1 text-center bg-muted/20 transition-colors h-auto w-full",
                "hover:bg-accent hover:text-accent-foreground focus:ring-accent",
                slot.machineInstanceId && !componentConfig && "border-primary", 
                componentConfig && "border-green-500" 
              )}
              onClick={() => {
                if (slot.machineInstanceId) {
                  onOpenRecipeDialog(productionLine.id, slotIndex);
                }
              }}
              disabled={!slot.machineInstanceId}
            >
              {slot.machineInstanceId && machineConfig ? (
                <>
                  <div className="relative w-full h-full flex flex-col items-center justify-center">
                    <MachineIcon className={cn("h-4 w-4 sm:h-5 sm:w-5 mb-0.5", componentConfig ? "text-green-500" : "text-primary")} />
                    <p className="text-[10px] sm:text-xs font-medium truncate w-full" title={machineConfig.name}>
                      {machineConfig.name}
                    </p>
                    {componentConfig ? (
                      <div className="flex items-center justify-center gap-1 mt-0.5">
                        <ComponentIcon className="h-3 w-3 text-muted-foreground"/>
                        <p className="text-[9px] sm:text-[10px] text-muted-foreground truncate" title={componentConfig.name}>
                          {componentConfig.name.substring(0,7)}{componentConfig.name.length > 7 ? '...' : ''}
                        </p>
                      </div>
                    ) : (
                       <p className="text-[9px] sm:text-[10px] text-amber-500">Set Recipe</p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 mb-1 text-muted-foreground/50 animate-pulse" />
                  <p className="text-[10px] sm:text-xs text-muted-foreground/70">Empty Slot</p>
                </>
              )}
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}

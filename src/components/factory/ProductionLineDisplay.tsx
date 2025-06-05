
"use client";

import type { FactoryProductionLine, FactoryMachine, FactoryMachineConfig, FactoryComponent, Worker, WorkerStatus, ResearchItemConfig, PlayerStats } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Wrench, Loader2, Settings, Cog, User, Zap as EnergyIcon, ShieldAlert as NoPowerIcon, LockKeyhole, PackagePlus, DollarSign, Unlock as UnlockIcon } from "lucide-react";
import { INITIAL_FACTORY_MACHINE_CONFIGS, INITIAL_FACTORY_COMPONENTS_CONFIG } from "@/config/game-config";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ProductionLineDisplayProps {
  productionLine: FactoryProductionLine;
  allMachines: FactoryMachine[];
  allWorkers: Worker[];
  lineIndex: number;
  onOpenRecipeDialog: (productionLineId: string, slotIndex: number) => void;
  onUnlockLine: (lineId: string) => void;
  playerMoney: number;
  researchRequiredName?: string | null;
  currentDynamicMaxWorkerEnergy: number;
  playerStats: PlayerStats; // Added playerStats here
}

const getWorkerStatusColor = (status?: WorkerStatus, energyPercent?: number): string => {
  if (status === 'working') return energyPercent && energyPercent > 20 ? 'text-green-500' : 'text-orange-500';
  if (status === 'resting') return 'text-blue-500';
  if (status === 'idle') return 'text-yellow-500';
  return 'text-muted-foreground'; // Default or no worker
};

export function ProductionLineDisplay({
  productionLine,
  allMachines,
  allWorkers,
  lineIndex,
  onOpenRecipeDialog,
  onUnlockLine,
  playerMoney,
  researchRequiredName,
  currentDynamicMaxWorkerEnergy,
  playerStats, // Use playerStats from props
}: ProductionLineDisplayProps) {

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

  const getWorkerDetails = (machineInstanceId: string | null): Worker | null => {
    if(!machineInstanceId) return null;
    return allWorkers.find(w => w.assignedMachineInstanceId === machineInstanceId) || null;
  };

  if (!productionLine.isUnlocked) {
    const canAffordUnlock = productionLine.unlockCost ? playerMoney >= productionLine.unlockCost : false;
    return (
      <Card className="border-dashed border-muted-foreground/50 shadow-none bg-muted/20">
        <CardHeader className="pb-2 pt-3 items-center text-center">
          <LockKeyhole className="h-8 w-8 text-primary mb-1" />
          <CardTitle className="text-base">{productionLine.name} - Locked</CardTitle>
        </CardHeader>
        <CardContent className="p-3 text-center">
          {productionLine.unlockCost && (
            <>
              <p className="text-sm text-muted-foreground mb-2">
                Cost to unlock: ${productionLine.unlockCost.toLocaleString()}
              </p>
              <Button
                onClick={() => onUnlockLine(productionLine.id)}
                disabled={!canAffordUnlock}
                size="sm"
              >
                <UnlockIcon className="mr-2 h-4 w-4" /> Unlock Line
              </Button>
            </>
          )}
          {productionLine.requiredResearchId && (
            <p className="text-sm text-muted-foreground">
              Requires "{researchRequiredName || productionLine.requiredResearchId}" research.
            </p>
          )}
        </CardContent>
      </Card>
    );
  }


  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-2 pt-3">
        <CardTitle className="text-lg">{productionLine.name}</CardTitle>
        <CardDescription className="text-xs">
          Click a machine to set its recipe or assign a worker. Production starts if power, materials, a worker, and input components are sufficient.
        </CardDescription>
      </CardHeader>
      <TooltipProvider>
      <CardContent className="grid grid-cols-3 sm:grid-cols-6 gap-2 p-3">
        {productionLine.slots.map((slot, slotIdx) => {
          const machineInstance = allMachines.find(m => m.instanceId === slot.machineInstanceId);
          const machineConfig = getMachineDetails(slot.machineInstanceId);
          const componentConfig = getComponentDetails(slot.targetComponentId);
          const worker = getWorkerDetails(slot.machineInstanceId);
          const MachineIcon = machineConfig?.icon || Loader2;
          const ComponentIcon = componentConfig?.icon || PlusCircle;
          const workerEnergyPercent = worker && currentDynamicMaxWorkerEnergy > 0 ? (worker.energy / currentDynamicMaxWorkerEnergy) * 100 : 0;

          const progressKey = slot.targetComponentId ? `${productionLine.id}-${slotIdx}-${slot.targetComponentId}` : null;
          const currentProductionProgressValue = progressKey && playerStats?.factoryProductionProgress ? (playerStats.factoryProductionProgress[progressKey] || 0) : 0;
          const productionProgressPercent = Math.min(100, currentProductionProgressValue * 100);
          
          // If there's any progress, but it's less than 1%, show it as 1% for visibility.
          // Only apply this visual bump if the worker is actively working or supposed to be.
          let displayProgressValue = productionProgressPercent;
          if (worker && worker.status === 'working' && productionProgressPercent > 0 && productionProgressPercent < 1) {
            displayProgressValue = 1;
          }


          let displayName = machineConfig?.name || "Machine";
          if (machineConfig?.familyId === 'basic_assembler' && machineConfig.mark) {
            displayName = `Mk ${machineConfig.mark}`;
          }

          let slotTooltipContent = "Empty slot. Machines will be auto-assigned here.";
          let workerTooltip = "";
          if (worker) {
            workerTooltip = `Worker: ${worker.name} (${worker.status}, ${workerEnergyPercent.toFixed(0)}% energy).`;
          } else if (machineConfig) {
             workerTooltip = "No worker assigned.";
          }

          if (machineConfig && !componentConfig) {
            slotTooltipContent = `Machine: ${machineConfig.name}. Click to set recipe. ${workerTooltip}`;
          } else if (machineConfig && componentConfig) {
            slotTooltipContent = `Producing: ${componentConfig.name} with ${machineConfig.name}. Progress: ${productionProgressPercent.toFixed(1)}%. ${workerTooltip}`;
          }
          
          const netPower = playerStats ? (playerStats.factoryPowerUnitsGenerated || 0) - (playerStats.factoryPowerConsumptionKw || 0) : 0;
          const isPowered = netPower >= 0; 
          const machineIsActiveAndNeedsPower = worker && worker.status === 'working' && slot.targetComponentId;


          return (
            <Tooltip key={slotIdx}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "aspect-square border-dashed border-muted-foreground/50 rounded-md flex flex-col items-center justify-center p-1 text-center bg-muted/20 transition-colors h-auto w-full relative overflow-hidden",
                    "hover:bg-accent hover:text-accent-foreground focus:ring-accent",
                    slot.machineInstanceId && !componentConfig && "border-primary ring-1 ring-primary",
                    componentConfig && "border-green-500 ring-1 ring-green-500",
                    machineIsActiveAndNeedsPower && !isPowered && "border-destructive ring-1 ring-destructive"
                  )}
                  onClick={() => {
                    if (slot.machineInstanceId) {
                      onOpenRecipeDialog(productionLine.id, slotIdx);
                    }
                  }}
                  disabled={!slot.machineInstanceId}
                >
                  {slot.machineInstanceId && machineConfig ? (
                    <>
                      <div className="relative w-full h-full flex flex-col items-center justify-center space-y-0.5">
                        {worker && (
                          <div className="absolute top-0.5 left-0.5 right-0.5 flex items-center justify-between px-0.5">
                            <User className={cn("h-2.5 w-2.5", getWorkerStatusColor(worker?.status, workerEnergyPercent))} />
                            <Progress value={workerEnergyPercent} className="h-1 w-1/2 bg-muted-foreground/20"
                                indicatorClassName={cn(
                                    worker.status === 'working' && workerEnergyPercent > 20 && 'bg-green-500',
                                    worker.status === 'working' && workerEnergyPercent <= 20 && 'bg-orange-500',
                                    worker.status === 'resting' && 'bg-blue-500',
                                    worker.status === 'idle' && workerEnergyPercent === 100 && 'bg-slate-400',
                                    worker.status === 'idle' && workerEnergyPercent < 100 && 'bg-yellow-500'
                                )}
                            />
                          </div>
                        )}
                        {machineIsActiveAndNeedsPower && !isPowered && (
                           <NoPowerIcon className="absolute top-0.5 right-0.5 h-3 w-3 text-destructive" />
                        )}
                        <MachineIcon className={cn("h-4 w-4 sm:h-5 sm:w-5 mb-0 mt-2", componentConfig ? "text-green-500" : "text-primary")} />
                        <p className="text-[9px] sm:text-[10px] font-medium truncate w-full leading-tight" title={machineConfig.name}>
                          {displayName}
                        </p>
                        {componentConfig ? (
                          <div className="flex items-center justify-center gap-1">
                            <ComponentIcon className="h-3 w-3 text-muted-foreground"/>
                            <p className="text-[8px] sm:text-[9px] text-muted-foreground truncate leading-tight" title={componentConfig.name}>
                              {componentConfig.name.substring(0,7)}{componentConfig.name.length > 7 ? '...' : ''}
                            </p>
                          </div>
                        ) : (
                           <div className="flex items-center justify-center gap-0.5 text-amber-600">
                             <Cog className="h-2.5 w-2.5"/>
                             <p className="text-[8px] sm:text-[9px] leading-tight">Set Recipe</p>
                           </div>
                        )}
                        {componentConfig && slot.machineInstanceId && (
                          <Progress value={displayProgressValue} className="h-2 w-3/4 mt-0.5" />
                        )}
                         {!worker && machineConfig && (
                             <div className="absolute bottom-0.5 text-xs text-destructive text-[8px] sm:text-[9px]">
                                <User className="inline h-2.5 w-2.5 mr-0.5" /> Need Worker
                             </div>
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
              </TooltipTrigger>
              <TooltipContent>
                <p>{slotTooltipContent}</p>
                 {machineIsActiveAndNeedsPower && !isPowered && <p className="text-destructive">Insufficient power for operation!</p>}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </CardContent>
      </TooltipProvider>
    </Card>
  );
}

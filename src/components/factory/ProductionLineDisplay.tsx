
"use client";

import type { FactoryProductionLine, FactoryMachine, FactoryMachineConfig, FactoryComponent, Worker, WorkerStatus, ResearchItemConfig, PlayerStats, FactoryProductionProgressData } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Wrench, Loader2, Settings, Cog, User, Zap as EnergyIcon, ShieldAlert as NoPowerIcon, LockKeyhole, PackagePlus, DollarSign, Unlock as UnlockIcon, Timer } from "lucide-react";
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
  playerStats: PlayerStats;
  lineProductionProgress: Record<string, FactoryProductionProgressData>;
}

const getWorkerStatusColor = (status?: WorkerStatus, energyPercent?: number): string => {
  if (status === 'working') return energyPercent && energyPercent > 20 ? 'text-green-500' : 'text-orange-500';
  if (status === 'resting') return 'text-blue-500';
  if (status === 'idle') return 'text-yellow-500';
  return 'text-muted-foreground';
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
  playerStats,
  lineProductionProgress,
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
      <CardContent className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 p-3">
        {productionLine.slots.map((slot, slotIdx) => {
          const machineInstance = allMachines.find(m => m.instanceId === slot.machineInstanceId);
          const machineConfig = getMachineDetails(slot.machineInstanceId);
          const componentConfig = getComponentDetails(slot.targetComponentId);
          const worker = getWorkerDetails(slot.machineInstanceId);
          const MachineIcon = machineConfig?.icon || Loader2;
          const ComponentIcon = componentConfig?.icon || PlusCircle;
          const workerEnergyPercent = worker && currentDynamicMaxWorkerEnergy > 0 ? (worker.energy / currentDynamicMaxWorkerEnergy) * 100 : 0;
          
          let timerDisplay = "";
          const progressKey = slot.targetComponentId ? `${productionLine.id}-${slotIdx}-${slot.targetComponentId}` : null;

          if (componentConfig && slot.targetComponentId && progressKey) {
              const productionData = lineProductionProgress?.[progressKey];

              if (productionData && typeof productionData.remainingSeconds === 'number' && typeof productionData.totalSeconds === 'number' && productionData.totalSeconds > 0) {
                  if (productionData.remainingSeconds > 0) {
                      timerDisplay = `${Math.ceil(productionData.remainingSeconds).toFixed(0)}s / ${productionData.totalSeconds.toFixed(0)}s`;
                  } else { 
                      let canCraftNext = true;
                      if (!playerStats || playerStats.factoryRawMaterials < componentConfig.rawMaterialCost) {
                          canCraftNext = false;
                      } else {
                          for (const input of componentConfig.recipe) {
                              if ((playerStats.factoryProducedComponents?.[input.componentId] || 0) < input.quantity) {
                                  canCraftNext = false;
                                  break;
                              }
                          }
                      }
                      timerDisplay = canCraftNext ? "Ready" : "Inputs Blocked";
                  }
              } else if (componentConfig) { 
                   timerDisplay = `Recipe Set (${componentConfig.productionTimeSeconds.toFixed(0)}s)`;
              } else {
                  timerDisplay = "Configuring..."; 
              }
          } else if (slot.machineInstanceId) {
              timerDisplay = "Set Recipe";
          } else {
              timerDisplay = "Empty Slot";
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
            const productionDataForTooltip = lineProductionProgress?.[progressKey!];
            const timeInfo = productionDataForTooltip && productionDataForTooltip.totalSeconds > 0
                ? `${Math.ceil(productionDataForTooltip.remainingSeconds).toFixed(0)}s / ${productionDataForTooltip.totalSeconds.toFixed(0)}s`
                : (componentConfig.productionTimeSeconds > 0 ? `Base: ${componentConfig.productionTimeSeconds}s` : 'N/A');
            slotTooltipContent = `Producing: ${componentConfig.name} with ${machineConfig.name}. Time: ${timeInfo}. ${workerTooltip}`;
          }

          const netPower = playerStats ? (playerStats.factoryPowerUnitsGenerated || 0) - (playerStats.factoryPowerConsumptionKw || 0) : 0;
          const machineIsActiveAndNeedsPower = worker && worker.status === 'working' && slot.targetComponentId;


          return (
            <Tooltip key={slotIdx}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "@container aspect-square", 
                    "border-dashed border-muted-foreground/50 rounded-md flex flex-col items-center p-0.5 text-center bg-muted/20 transition-colors h-auto w-full relative overflow-hidden",
                    "hover:bg-accent hover:text-accent-foreground focus:ring-accent",
                    slot.machineInstanceId && !componentConfig && "border-primary ring-1 ring-primary",
                    componentConfig && "border-green-500 ring-1 ring-green-500",
                    machineIsActiveAndNeedsPower && netPower < 0 && "border-destructive ring-1 ring-destructive"
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
                      {/* Top status bar */}
                      <div className="absolute top-0.5 left-0.5 right-0.5 flex items-center justify-between px-0.5 z-10">
                        {worker && (
                          <div className="flex items-center gap-1 w-full">
                             <User className={cn("h-3 @[6rem]:h-3.5 @[8rem]:h-4 @[10rem]:h-5 shrink-0", getWorkerStatusColor(worker?.status, workerEnergyPercent))} />
                             <Progress value={workerEnergyPercent} className="h-1.5 flex-1 bg-muted-foreground/20"
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
                        {machineIsActiveAndNeedsPower && netPower < 0 && (
                           <NoPowerIcon className="h-3 @[6rem]:h-3.5 @[8rem]:h-4 @[10rem]:h-5 text-destructive shrink-0 ml-auto" />
                        )}
                      </div>

                      {/* Central content */}
                      <div className="flex flex-col items-center justify-around flex-grow w-full px-1 pt-4 pb-4">
                        <MachineIcon className={cn(
                            "mb-0.5 @[6rem]:mb-1", 
                            componentConfig ? "text-green-500" : "text-primary",
                            "h-6 w-6 @[6rem]:h-8 @[6rem]:w-8 @[8rem]:h-10 @[8rem]:w-10 @[10rem]:h-12 @[10rem]:w-12 @[12rem]:h-14 @[12rem]:w-14 @[15rem]:h-16 @[15rem]:w-16"
                          )} />
                        <p className={cn(
                            "font-semibold text-center leading-tight w-full break-words",
                            "text-sm @[6rem]:text-lg @[8rem]:text-xl @[10rem]:text-2xl @[12rem]:text-3xl @[15rem]:text-4xl"
                          )} title={displayName}>
                          {displayName}
                        </p>
                        {componentConfig ? (
                          <div className="flex flex-col items-center justify-center gap-0 @[6rem]:gap-0.5 text-center">
                            <ComponentIcon className={cn(
                                "text-muted-foreground",
                                "h-5 w-5 @[6rem]:h-7 @[6rem]:w-7 @[8rem]:h-9 @[8rem]:w-9 @[10rem]:h-10 @[10rem]:w-10 @[12rem]:h-11 @[12rem]:w-11 @[15rem]:h-12 @[15rem]:w-12"
                              )}/>
                            <p className={cn(
                                "text-muted-foreground text-center leading-tight w-full break-words",
                                "text-sm @[6rem]:text-lg @[8rem]:text-xl @[10rem]:text-2xl @[12rem]:text-3xl @[15rem]:text-4xl"
                               )} title={componentConfig.name}>
                              {componentConfig.name}
                            </p>
                          </div>
                        ) : (
                           <div className={cn(
                               "flex items-center justify-center gap-0.5 text-amber-600",
                               "text-xs @[6rem]:text-sm @[8rem]:text-base @[10rem]:text-lg @[12rem]:text-xl @[15rem]:text-2xl"
                            )}>
                             <Cog className="h-4 @[6rem]:h-5 @[8rem]:h-6 @[10rem]:h-7 @[12rem]:h-8 @[15rem]:h-9" />
                             <p className="leading-tight">Set Recipe</p>
                           </div>
                        )}
                      </div>
                      
                      {/* Bottom timer/status */}
                       <div className="absolute bottom-1 left-0 right-0 px-1 text-center">
                         {(timerDisplay && timerDisplay !== "Empty Slot" && timerDisplay !== "Set Recipe" && timerDisplay !== "Configuring...") && (
                           <div className={cn(
                               "flex items-center justify-center text-muted-foreground leading-tight gap-0.5",
                               "text-xs @[6rem]:text-sm @[8rem]:text-base @[10rem]:text-lg @[12rem]:text-xl @[15rem]:text-2xl"
                             )}>
                             <Timer className="h-3 @[6rem]:h-3.5 @[8rem]:h-4 @[10rem]:h-5 @[12rem]:h-6 @[15rem]:h-7" />
                             {timerDisplay}
                           </div>
                         )}
                         {!worker && machineConfig && (
                             <div className={cn(
                                "text-destructive font-medium",
                                "text-xs @[6rem]:text-sm @[8rem]:text-base @[10rem]:text-lg @[12rem]:text-xl @[15rem]:text-2xl"
                                )}>
                                <User className="inline h-3 @[6rem]:h-3.5 @[8rem]:h-4 @[10rem]:h-5 @[12rem]:h-6 @[15rem]:h-7 mr-0.5" /> Need Worker
                             </div>
                         )}
                       </div>
                    </>
                  ) : (
                    <>
                      <Loader2 className="h-8 @[6rem]:h-10 @[8rem]:h-12 @[10rem]:h-14 @[12rem]:h-16 @[15rem]:h-20 mb-1 text-muted-foreground/50 animate-pulse" />
                      <p className="text-xs @[6rem]:text-sm @[8rem]:text-base @[10rem]:text-lg @[12rem]:text-xl @[15rem]:text-2xl text-muted-foreground/70">Empty Slot</p>
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{slotTooltipContent}</p>
                 {machineIsActiveAndNeedsPower && netPower < 0 && <p className="text-destructive">Insufficient power for operation!</p>}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </CardContent>
      </TooltipProvider>
    </Card>
  );
}

    

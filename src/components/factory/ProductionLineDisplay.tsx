
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
                    "@container", 
                    "aspect-square border-dashed border-muted-foreground/50 rounded-md flex flex-col items-center justify-center p-0.5 text-center bg-muted/20 transition-colors h-auto w-full relative overflow-hidden",
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
                      {/* Top status bar - remains small */}
                      <div className="absolute top-0.5 left-0.5 right-0.5 flex items-center justify-between px-0.5 z-10">
                        {worker && (
                          <div className="flex items-center gap-0.5">
                             <User className={cn("h-2.5 w-2.5", getWorkerStatusColor(worker?.status, workerEnergyPercent))} />
                             <Progress value={workerEnergyPercent} className="h-1 w-6 @[8rem]:w-8 bg-muted-foreground/20"
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
                           <NoPowerIcon className="h-3 w-3 text-destructive" />
                        )}
                      </div>

                      {/* Central content - scales with container */}
                      <div className="flex flex-col items-center justify-center flex-grow w-full px-0.5 pt-3 pb-4 @[6rem]:pt-4 @[6rem]:pb-5 @[8rem]:pt-5 @[8rem]:pb-6">
                        <MachineIcon className={cn(
                            "mb-0 @[6rem]:mb-0.5", 
                            componentConfig ? "text-green-500" : "text-primary",
                            "h-4 w-4 @[6rem]:h-5 @[6rem]:w-5 @[8rem]:h-6 @[8rem]:w-6 @[10rem]:h-7 @[10rem]:w-7 @[12rem]:h-8 @[12rem]:w-8"
                          )} />
                        <p className={cn(
                            "font-medium text-center leading-tight w-full break-words",
                            "text-[8px] @[6rem]:text-[9px] @[8rem]:text-[10px] @[10rem]:text-xs @[12rem]:text-sm"
                          )} title={machineConfig.name}>
                          {displayName}
                        </p>
                        {componentConfig ? (
                          <div className="flex items-center justify-center gap-0.5 @[6rem]:gap-1">
                            <ComponentIcon className={cn(
                                "text-muted-foreground",
                                "h-3 w-3 @[6rem]:h-3 @[6rem]:w-3 @[8rem]:h-3.5 @[8rem]:w-3.5 @[10rem]:h-4 @[10rem]:w-4 @[12rem]:h-5 @[12rem]:w-5"
                              )}/>
                            <p className={cn(
                                "text-muted-foreground text-center leading-tight w-full break-words",
                                "text-[7px] @[6rem]:text-[8px] @[8rem]:text-[9px] @[10rem]:text-[10px] @[12rem]:text-xs"
                               )} title={componentConfig.name}>
                              {componentConfig.name}
                            </p>
                          </div>
                        ) : (
                           <div className="flex items-center justify-center gap-0.5 text-amber-600">
                             <Cog className="h-2.5 w-2.5 @[8rem]:h-3 @[8rem]:w-3 @[10rem]:h-3.5 @[10rem]:w-3.5" />
                             <p className="leading-tight text-[8px] @[6rem]:text-[9px] @[8rem]:text-[10px] @[10rem]:text-xs">Set Recipe</p>
                           </div>
                        )}
                      </div>
                      
                      {/* Bottom timer/status - scales slightly */}
                       <div className="absolute bottom-0.5 left-0 right-0 px-0.5 text-center">
                         {(timerDisplay && timerDisplay !== "Empty Slot" && timerDisplay !== "Set Recipe" && timerDisplay !== "Configuring...") && (
                           <div className={cn(
                               "flex items-center justify-center text-muted-foreground leading-tight gap-0.5",
                               "text-[7px] @[6rem]:text-[8px] @[8rem]:text-[9px] @[10rem]:text-[10px] @[12rem]:text-xs"
                             )}>
                             <Timer className="h-2 w-2 @[8rem]:h-2.5 @[8rem]:w-2.5 @[10rem]:h-3 @[10rem]:w-3" />
                             {timerDisplay}
                           </div>
                         )}
                         {!worker && machineConfig && (
                             <div className={cn(
                                "text-destructive",
                                "text-[7px] @[6rem]:text-[8px] @[8rem]:text-[9px] @[10rem]:text-[10px] @[12rem]:text-xs"
                                )}>
                                <User className="inline h-2 w-2 @[8rem]:h-2.5 @[8rem]:w-2.5 @[10rem]:h-3 @[10rem]:w-3 mr-0.5" /> Need Worker
                             </div>
                         )}
                       </div>
                    </>
                  ) : (
                    <>
                      <Loader2 className="h-5 w-5 @[8rem]:h-6 @[8rem]:w-6 @[10rem]:h-8 @[10rem]:w-8 mb-1 text-muted-foreground/50 animate-pulse" />
                      <p className="text-[9px] @[8rem]:text-[10px] @[10rem]:text-xs text-muted-foreground/70">Empty Slot</p>
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

    

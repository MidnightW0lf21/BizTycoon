
"use client";

import type { FactoryProductionLine, FactoryMachine, FactoryMachineConfig, FactoryComponent, Worker, WorkerStatus, ResearchItemConfig, PlayerStats, FactoryProductionProgressData } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Wrench, Loader2, Settings, Cog, User, Zap as EnergyIcon, ShieldAlert as NoPowerIcon, LockKeyhole, PackagePlus, DollarSign, Unlock as UnlockIcon, Timer, Zap } from "lucide-react";
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
          
          const BaseMachineIcon = machineConfig?.icon || Loader2; // Icon for the machine itself
          const ComponentIconToRender = componentConfig?.icon || PlusCircle; // Icon for the component being crafted
          
          const workerEnergyPercent = worker && currentDynamicMaxWorkerEnergy > 0 ? (worker.energy / currentDynamicMaxWorkerEnergy) * 100 : 0;
          
          let timerText = "";
          const progressKey = slot.targetComponentId ? `${productionLine.id}-${slotIdx}-${slot.targetComponentId}` : null;

          if (componentConfig && slot.targetComponentId && progressKey) {
              const productionData = lineProductionProgress?.[progressKey];
              if (productionData && typeof productionData.remainingSeconds === 'number' && typeof productionData.totalSeconds === 'number' && productionData.totalSeconds > 0) {
                  if (productionData.remainingSeconds > 0) {
                      timerText = `${Math.ceil(productionData.remainingSeconds).toFixed(0)}s / ${productionData.totalSeconds.toFixed(0)}s`;
                  } else {
                      let canCraftNext = true;
                      if (!playerStats || playerStats.factoryRawMaterials < componentConfig.rawMaterialCost) canCraftNext = false;
                      else {
                          for (const input of componentConfig.recipe) {
                              if ((playerStats.factoryProducedComponents?.[input.componentId] || 0) < input.quantity) { canCraftNext = false; break; }
                          }
                      }
                      timerText = canCraftNext ? "Ready" : "Inputs Blocked";
                  }
              } else if (componentConfig) { 
                   timerText = `Recipe Set (${componentConfig.productionTimeSeconds.toFixed(0)}s)`;
              }
          }

          let displayName = machineConfig?.name || "Machine";
          if (machineConfig?.familyId === 'basic_assembler' && machineConfig.mark) {
            displayName = `Mk ${machineConfig.mark}`;
          }

          let slotTooltipContent = "Empty slot. Machines will be auto-assigned here.";
          if (machineConfig && !componentConfig) slotTooltipContent = `Machine: ${machineConfig.name}. Click to set recipe. Worker: ${worker ? worker.name : 'None'}`;
          else if (machineConfig && componentConfig) slotTooltipContent = `Producing: ${componentConfig.name} with ${machineConfig.name}. Time: ${timerText}. Worker: ${worker ? worker.name : 'None'}`;
          
          const netPower = playerStats ? (playerStats.factoryPowerUnitsGenerated || 0) - (playerStats.factoryPowerConsumptionKw || 0) : 0;
          const machineIsActiveAndNeedsPower = worker && worker.status === 'working' && slot.targetComponentId;

          return (
            <Tooltip key={slotIdx}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "@container aspect-square", 
                    "border-dashed border-muted-foreground/50 rounded-md flex flex-col items-center p-1 text-center bg-muted/20 transition-colors h-auto w-full relative overflow-hidden",
                    "hover:bg-accent hover:text-accent-foreground focus:ring-accent",
                    slot.machineInstanceId && !componentConfig && "border-primary ring-1 ring-primary",
                    componentConfig && "border-green-500 ring-1 ring-green-500",
                    machineIsActiveAndNeedsPower && netPower < 0 && "border-destructive ring-1 ring-destructive"
                  )}
                  onClick={() => { if (slot.machineInstanceId) { onOpenRecipeDialog(productionLine.id, slotIdx); } }}
                  disabled={!slot.machineInstanceId}
                >
                  {/* Top absolute status (worker energy, power) */}
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

                  {machineConfig?.upgrades && machineConfig.upgrades.length > 0 && machineInstance && (
                    <div className="absolute top-1 right-1 flex flex-col gap-1 z-20">
                      {machineConfig.upgrades.map((upgrade, index) => {
                        const isPurchased = (machineInstance.purchasedUpgradeIds || []).includes(upgrade.id);
                        const Icon = index === 0 ? Wrench : Zap;
                        return (
                          <Tooltip key={upgrade.id}>
                            <TooltipTrigger asChild>
                              <div className="flex items-center justify-center p-0.5 bg-background/50 rounded-sm">
                                <Icon className={cn("h-3.5 w-3.5", isPurchased ? "text-accent" : "text-muted-foreground/40")} />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="left">
                              <p className="font-semibold">{upgrade.name}</p>
                              <p className="text-xs text-muted-foreground">{upgrade.description}</p>
                              <p className={cn("text-xs font-bold mt-1", isPurchased ? "text-green-500" : "text-destructive")}>
                                Status: {isPurchased ? "Installed" : "Not Installed"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                  )}

                  {/* Main Content Area */}
                  {slot.machineInstanceId && machineConfig ? (
                    <div className="flex-grow flex flex-col items-center justify-around w-full pt-3 pb-2">
                      <BaseMachineIcon className={cn(
                        "text-muted-foreground",
                        "h-4 w-4 @[4.5rem]:h-5 @[6rem]:h-6 @[8rem]:h-8 @[10rem]:h-10 @[12rem]:h-12 @[15rem]:h-14"
                      )} />
                      
                      <p className={cn(
                        "font-bold text-center leading-none my-0.5",
                        "text-base @[4.5rem]:text-lg @[6rem]:text-xl @[8rem]:text-2xl @[10rem]:text-3xl @[12rem]:text-4xl @[15rem]:text-5xl"
                      )} title={displayName}>
                        {displayName}
                      </p>

                      {/* Bottom status/info block */}
                      <div className="space-y-0.5 text-center">
                        {!componentConfig && (
                          <div className={cn(
                              "flex items-center justify-center gap-1 text-amber-500",
                              "text-xs @[4.5rem]:text-sm @[6rem]:text-base @[8rem]:text-lg @[10rem]:text-xl"
                            )}>
                            <Cog className={cn("h-3 w-3 @[6rem]:h-3.5 @[8rem]:h-4 @[10rem]:h-5")} />
                            <span>Set Recipe</span>
                          </div>
                        )}
                        {componentConfig && (
                          <>
                            <div className={cn(
                                "flex items-center justify-center gap-1 text-green-500",
                                "text-xs @[4.5rem]:text-sm @[6rem]:text-base @[8rem]:text-lg @[10rem]:text-xl"
                              )}>
                              <ComponentIconToRender className={cn("h-3 w-3 @[6rem]:h-3.5 @[8rem]:h-4 @[10rem]:h-5")} />
                              <span className="break-all leading-tight">{componentConfig.name}</span>
                            </div>
                            {timerText && (
                              <div className={cn(
                                  "flex items-center justify-center gap-0.5 text-muted-foreground",
                                  "text-[10px] @[4.5rem]:text-xs @[6rem]:text-sm @[8rem]:text-base"
                                )}>
                                <Timer className={cn("h-2.5 w-2.5 @[6rem]:h-3 @[8rem]:h-3.5 @[10rem]:h-4")} />
                                {timerText}
                              </div>
                            )}
                          </>
                        )}
                        {!worker && (
                           <div className={cn(
                                "flex items-center justify-center gap-1 text-destructive font-medium",
                                "text-xs @[4.5rem]:text-sm @[6rem]:text-base @[8rem]:text-lg @[10rem]:text-xl"
                              )}>
                            <User className={cn("h-3 w-3 @[6rem]:h-3.5 @[8rem]:h-4 @[10rem]:h-5")} />
                            <span>Need Worker</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : ( // Empty Slot
                    <div className="flex-grow flex flex-col items-center justify-center">
                      <Loader2 className={cn(
                          "mb-1 text-muted-foreground/50 animate-pulse",
                          "h-8 w-8 @[6rem]:h-10 @[8rem]:h-12 @[10rem]:h-14 @[12rem]:h-16 @[15rem]:h-20"
                        )} />
                      <p className={cn(
                          "text-muted-foreground/70",
                          "text-xs @[6rem]:text-sm @[8rem]:text-base @[10rem]:text-lg @[12rem]:text-xl @[15rem]:text-2xl"
                        )}>Empty Slot</p>
                    </div>
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

    
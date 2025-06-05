
"use client";

import { useGame } from "@/contexts/GameContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Factory, LockKeyhole, ShoppingCart, DollarSign, Zap, Box, Wrench, PackageCheck, Lightbulb, SlidersHorizontal, PackagePlus, FlaskConical, UserPlus, Users, Unlock as UnlockIcon, Pickaxe, PackageSearch, Mountain, Satellite, CloudCog, Sun, Waves, TrendingUp, XIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { INITIAL_FACTORY_POWER_BUILDINGS_CONFIG, INITIAL_FACTORY_MACHINE_CONFIGS, INITIAL_FACTORY_COMPONENTS_CONFIG, INITIAL_FACTORY_MATERIAL_COLLECTORS_CONFIG, INITIAL_RESEARCH_ITEMS_CONFIG, REQUIRED_PRESTIGE_LEVEL_FOR_RESEARCH_TAB, RESEARCH_MANUAL_GENERATION_AMOUNT, RESEARCH_MANUAL_GENERATION_COST_MONEY, WORKER_ENERGY_TIERS } from "@/config/game-config";
import { FactoryPowerBuildingCard } from "@/components/factory/FactoryPowerBuildingCard";
import { FactoryMaterialCollectorCard } from "@/components/factory/FactoryMaterialCollectorCard";
import { MachinePurchaseCard } from "@/components/factory/MachinePurchaseCard";
import { ResearchItemCard } from "@/components/factory/ResearchItemCard";
import { ProductionLineDisplay } from "@/components/factory/ProductionLineDisplay";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect, useMemo } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { RecipeSelectionDialog } from "@/components/factory/RecipeSelectionDialog";
import type { FactoryMachine, Worker } from "@/types";
import { WORKER_HIRE_COST } from "@/config/data/workers";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const REQUIRED_PRESTIGE_LEVEL_MY_FACTORY = 5;
const FACTORY_PURCHASE_COST_FROM_CONFIG = 1000000;
const MATERIAL_COLLECTION_AMOUNT_CONST = 10;
const FACTORY_INTRO_DISMISSED_KEY_V1 = 'bizTycoonFactoryIntroDismissed_v1';


export default function MyFactoryPage() {
  const {
    playerStats,
    purchaseFactoryBuilding,
    purchaseFactoryPowerBuilding,
    manuallyCollectRawMaterials,
    purchaseFactoryMachine,
    materialCollectionCooldownEnd,
    setRecipeForProductionSlot,
    purchaseFactoryMaterialCollector,
    manuallyGenerateResearchPoints,
    purchaseResearch,
    researchItems,
    manualResearchCooldownEnd,
    hireWorker,
    assignWorkerToMachine,
    unlockProductionLine,
    purchaseFactoryMachineUpgrade,
  } = useGame();

  const [isFactoryIntroVisible, setIsFactoryIntroVisible] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dismissed = localStorage.getItem(FACTORY_INTRO_DISMISSED_KEY_V1);
      if (dismissed === 'true') {
        setIsFactoryIntroVisible(false);
      }
    }
  }, []);

  const handleDismissFactoryIntro = () => {
    setIsFactoryIntroVisible(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem(FACTORY_INTRO_DISMISSED_KEY_V1, 'true');
    }
  };


  const netPower = playerStats.factoryPowerUnitsGenerated - playerStats.factoryPowerConsumptionKw;
  const currentDynamicMaxWorkerEnergy = useMemo(() => WORKER_ENERGY_TIERS[playerStats.currentWorkerEnergyTier] || WORKER_ENERGY_TIERS[0], [playerStats.currentWorkerEnergyTier]);


  const totalAutomatedMaterialsPerSecond = useMemo(() => {
    if (!playerStats.factoryPurchased || netPower < 0) return 0;

    let totalMats = 0;
    let powerUsedByCollectors = 0;
    const collectors = playerStats.factoryMaterialCollectors || [];

    collectors.forEach(collector => {
      const config = INITIAL_FACTORY_MATERIAL_COLLECTORS_CONFIG.find(c => c.id === collector.configId);
      if (config) {
        const powerConsumptionOfOtherMachines = playerStats.factoryPowerConsumptionKw -
            (collectors.filter(c => c.id !== collector.instanceId)
                        .reduce((sum, otherCollector) => {
                            const otherConfig = INITIAL_FACTORY_MATERIAL_COLLECTORS_CONFIG.find(oc => oc.id === otherCollector.configId);
                            return sum + (otherConfig?.powerConsumptionKw || 0);
                        }, 0));
        
        if (playerStats.factoryPowerUnitsGenerated - powerConsumptionOfOtherMachines >= config.powerConsumptionKw) {
           let baseRate = config.materialsPerSecond;
           const boostResearch = researchItems.find(r => r.effects.factoryMaterialCollectorBoost?.collectorConfigId === config.id);
           if (boostResearch && (playerStats.unlockedResearchIds || []).includes(boostResearch.id) && boostResearch.effects.factoryMaterialCollectorBoost) {
               baseRate *= (1 + boostResearch.effects.factoryMaterialCollectorBoost.materialsPerSecondBoostPercent / 100);
           }
           totalMats += baseRate;
           powerUsedByCollectors += config.powerConsumptionKw;
        }
      }
    });

    const powerAvailableForAllActiveCollectors = playerStats.factoryPowerUnitsGenerated - (playerStats.factoryPowerConsumptionKw - powerUsedByCollectors);

    if (powerAvailableForAllActiveCollectors < powerUsedByCollectors && powerAvailableForAllActiveCollectors >=0) {
        let tempPower = playerStats.factoryPowerUnitsGenerated - (playerStats.factoryPowerConsumptionKw - powerUsedByCollectors);
        let actualTotalMats = 0;
        (playerStats.factoryMaterialCollectors || []).sort((a,b) => {
            const confA = INITIAL_FACTORY_MATERIAL_COLLECTORS_CONFIG.find(c => c.id === a.configId);
            const confB = INITIAL_FACTORY_MATERIAL_COLLECTORS_CONFIG.find(c => c.id === b.configId);
            return (confA?.powerConsumptionKw || Infinity) - (confB?.powerConsumptionKw || Infinity);
        }).forEach(collector => {
            const config = INITIAL_FACTORY_MATERIAL_COLLECTORS_CONFIG.find(c => c.id === collector.configId);
            if(config && tempPower >= config.powerConsumptionKw) {
                let baseRate = config.materialsPerSecond;
                const boostResearch = researchItems.find(r => r.effects.factoryMaterialCollectorBoost?.collectorConfigId === config.id);
                if (boostResearch && (playerStats.unlockedResearchIds || []).includes(boostResearch.id) && boostResearch.effects.factoryMaterialCollectorBoost) {
                    baseRate *= (1 + boostResearch.effects.factoryMaterialCollectorBoost.materialsPerSecondBoostPercent / 100);
                }
                actualTotalMats += baseRate;
                tempPower -= config.powerConsumptionKw;
            }
        });
        return actualTotalMats;
    }

    return totalMats;
  }, [
      playerStats.factoryPurchased,
      playerStats.factoryMaterialCollectors,
      playerStats.factoryPowerUnitsGenerated,
      playerStats.factoryPowerConsumptionKw,
      netPower,
      playerStats.unlockedResearchIds,
      researchItems
  ]);


  const [secondsRemainingForCooldown, setSecondsRemainingForCooldown] = useState(0);
  const [secondsRemainingForResearchCooldown, setSecondsRemainingForResearchCooldown] = useState(0);
  const [isRecipeDialogOpen, setIsRecipeDialogOpen] = useState(false);
  const [currentDialogContext, setCurrentDialogContext] = useState<{
    productionLineId: string;
    slotIndex: number;
    assignedMachineInstanceId: string | null;
    currentRecipeId: string | null;
    currentAssignedWorkerId: string | null;
  } | null>(null);
  const [isBuildAssemblerDialogOpen, setIsBuildAssemblerDialogOpen] = useState(false);


  useEffect(() => {
    if (!playerStats.factoryPurchased) return;

    let intervalId: NodeJS.Timeout;
    const updateCooldown = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((materialCollectionCooldownEnd - now) / 1000));
      setSecondsRemainingForCooldown(remaining);
      if (remaining === 0 && intervalId) clearInterval(intervalId);
    };
    if (materialCollectionCooldownEnd > Date.now()) {
      updateCooldown();
      intervalId = setInterval(updateCooldown, 1000);
    } else {
      setSecondsRemainingForCooldown(0);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [materialCollectionCooldownEnd, playerStats.factoryPurchased]);

  useEffect(() => {
    if (!playerStats.factoryPurchased || playerStats.timesPrestiged < REQUIRED_PRESTIGE_LEVEL_FOR_RESEARCH_TAB) return;
    let intervalId: NodeJS.Timeout;
    const updateResearchCooldown = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((manualResearchCooldownEnd - now) / 1000));
      setSecondsRemainingForResearchCooldown(remaining);
      if (remaining === 0 && intervalId) clearInterval(intervalId);
    };
    if (manualResearchCooldownEnd > Date.now()) {
      updateResearchCooldown();
      intervalId = setInterval(updateResearchCooldown, 1000);
    } else {
      setSecondsRemainingForResearchCooldown(0);
    }
    return () => {
      if(intervalId) clearInterval(intervalId);
    };
  }, [manualResearchCooldownEnd, playerStats.factoryPurchased, playerStats.timesPrestiged]);

  const handleOpenRecipeDialog = (productionLineId: string, slotIndex: number) => {
    const line = (playerStats.factoryProductionLines || []).find(l => l.id === productionLineId);
    if (line && line.slots[slotIndex]) {
      const slot = line.slots[slotIndex];
      const machineInstanceId = slot.machineInstanceId;
      let workerIdForThisMachine: string | null = null;
      if (machineInstanceId) {
        const worker = (playerStats.factoryWorkers || []).find(w => w.assignedMachineInstanceId === machineInstanceId);
        if (worker) {
          workerIdForThisMachine = worker.id;
        }
      }

      setCurrentDialogContext({
        productionLineId,
        slotIndex,
        assignedMachineInstanceId: machineInstanceId,
        currentRecipeId: slot.targetComponentId,
        currentAssignedWorkerId: workerIdForThisMachine,
      });
      setIsRecipeDialogOpen(true);
    }
  };

  const handleCloseRecipeDialog = () => {
    setIsRecipeDialogOpen(false);
    setCurrentDialogContext(null);
  };


  if (playerStats.timesPrestiged < REQUIRED_PRESTIGE_LEVEL_MY_FACTORY) {
    return (
      <Card className="w-full md:max-w-2xl mx-auto">
        <CardHeader className="items-center">
          <LockKeyhole className="h-16 w-16 text-primary mb-4" />
          <CardTitle>My Factory Locked</CardTitle>
          <CardDescription className="text-center">
            Unlock powerful factory automation and production lines! <br />
            This feature is available after you have prestiged at least {REQUIRED_PRESTIGE_LEVEL_MY_FACTORY} times.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            (Current Prestige Level: {playerStats.timesPrestiged})
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!playerStats.factoryPurchased) {
    return (
      <Card className="w-full md:max-w-lg mx-auto">
        <CardHeader className="items-center">
          <Factory className="h-16 w-16 text-primary mb-4" />
          <CardTitle>Purchase Your Factory</CardTitle>
          <CardDescription className="text-center">
            Invest in your first factory building to start production.
            This is a one-time purchase and will persist through prestiges.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
            <DollarSign className="h-7 w-7" />
            {FACTORY_PURCHASE_COST_FROM_CONFIG.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </div>
          <p className="text-sm text-muted-foreground">
            Your current balance: ${playerStats.money.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </p>
        </CardContent>
        <CardFooter>
          <Button
            onClick={purchaseFactoryBuilding}
            className="w-full"
            disabled={playerStats.money < FACTORY_PURCHASE_COST_FROM_CONFIG}
          >
            <ShoppingCart className="mr-2 h-5 w-5" /> Purchase Factory Building
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const ownedPowerBuildingCounts = (playerStats.factoryPowerBuildings || []).reduce((acc, building) => {
    acc[building.configId] = (acc[building.configId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const ownedMaterialCollectorCounts = (playerStats.factoryMaterialCollectors || []).reduce((acc, collector) => {
    acc[collector.configId] = (acc[collector.configId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const researchTabAvailable = playerStats.timesPrestiged >= REQUIRED_PRESTIGE_LEVEL_FOR_RESEARCH_TAB;
  const idleWorkerCount = (playerStats.factoryWorkers || []).filter(w => w.status === 'idle').length;
  const totalWorkerCount = (playerStats.factoryWorkers || []).length;

  const getWorkerStatusBadgeVariant = (status: Worker['status']) => {
    switch (status) {
      case 'working': return 'default';
      case 'idle': return 'secondary';
      case 'resting': return 'outline';
      default: return 'secondary';
    }
  };

  const formatEnergyTime = (energyInSeconds: number) => {
    const totalSeconds = Math.round(energyInSeconds);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };


  return (
    <>
    <div className="flex flex-col gap-6 h-full">
      {isFactoryIntroVisible && (
        <Card className="w-full relative">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Factory className="h-7 w-7 text-primary" /> Your Industrial Complex
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 h-7 w-7"
              onClick={handleDismissFactoryIntro}
            >
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Dismiss</span>
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Manage power, materials, and production lines to create valuable components. Hire workers to operate machines. Unlock new technologies via Research.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2"><Zap className="h-5 w-5 text-primary"/>Power Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Generation:</span>
              <span className="font-semibold text-yellow-400">{playerStats.factoryPowerUnitsGenerated.toLocaleString()} kW</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Consumption:</span>
              <span className="font-semibold text-red-400">{playerStats.factoryPowerConsumptionKw.toLocaleString()} kW</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Net Power:</span>
              <span className={`font-bold ${netPower >= 0 ? 'text-green-500' : 'text-destructive'}`}>{netPower.toLocaleString()} kW</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2"><Box className="h-5 w-5 text-primary"/>Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-400">{playerStats.factoryRawMaterials.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
            <p className="text-xs text-muted-foreground">Raw Units</p>
          </CardContent>
        </Card>

        {researchTabAvailable && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2"><FlaskConical className="h-5 w-5 text-primary"/>Research</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-400">{playerStats.researchPoints.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Research Points (RP)</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2"><Users className="h-5 w-5 text-primary"/>Workers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-400">{idleWorkerCount} / {totalWorkerCount}</p>
            <p className="text-xs text-muted-foreground">Idle / Total</p>
          </CardContent>
        </Card>
      </div>


      <Tabs defaultValue="production" className="w-full flex-grow flex flex-col">
        <TabsList className={`grid w-full ${researchTabAvailable ? 'grid-cols-6' : 'grid-cols-5'} mb-4`}>
          <TabsTrigger value="power"><Zap className="mr-2 h-4 w-4"/>Power</TabsTrigger>
          <TabsTrigger value="materials"><Box className="mr-2 h-4 w-4"/>Materials</TabsTrigger>
          <TabsTrigger value="production"><Wrench className="mr-2 h-4 w-4"/>Production</TabsTrigger>
          <TabsTrigger value="workers"><Users className="mr-2 h-4 w-4"/>Workers</TabsTrigger>
          {researchTabAvailable && <TabsTrigger value="research"><FlaskConical className="mr-2 h-4 w-4"/>Research</TabsTrigger>}
          <TabsTrigger value="inventory"><PackageCheck className="mr-2 h-4 w-4"/>Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="power" className="flex-grow">
          <ScrollArea className="h-[calc(100vh-380px)] pr-2">
            <Card>
              <CardHeader>
                <CardTitle>Power Generation</CardTitle>
                <CardDescription>Build and manage power buildings to supply your factory. Unlock new types and upgrades via Research.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {INITIAL_FACTORY_POWER_BUILDINGS_CONFIG
                .filter(config => !config.requiredResearchId || (playerStats.unlockedResearchIds || []).includes(config.requiredResearchId))
                .map(config => (
                  <FactoryPowerBuildingCard
                    key={config.id}
                    powerBuildingConfig={config}
                    numOwned={ownedPowerBuildingCounts[config.id] || 0}
                    currentMoney={playerStats.money}
                    onPurchase={purchaseFactoryPowerBuilding}
                  />
                ))}
                {INITIAL_FACTORY_POWER_BUILDINGS_CONFIG.filter(config => config.requiredResearchId && !(playerStats.unlockedResearchIds || []).includes(config.requiredResearchId)).length > 0 &&
                  INITIAL_FACTORY_POWER_BUILDINGS_CONFIG
                    .filter(config => config.requiredResearchId && !(playerStats.unlockedResearchIds || []).includes(config.requiredResearchId))
                    .map(config => {
                        const researchName = researchItems.find(r => r.id === config.requiredResearchId)?.name;
                        return (
                            <Card key={config.id} className="shadow-md opacity-60 border-dashed">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <config.icon className="h-6 w-6 text-muted-foreground" />
                                            {config.name}
                                        </CardTitle>
                                    </div>
                                    <CardDescription className="text-xs">{config.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2 pt-2 pb-3 text-sm">
                                  <div className="flex justify-center items-center flex-col gap-2 text-center">
                                    <LockKeyhole className="h-8 w-8 text-primary" />
                                    <p className="text-sm font-semibold">Research Required</p>
                                    <p className="text-xs text-muted-foreground">
                                      Unlock via "{researchName || config.requiredResearchId}" in the Research tab.
                                    </p>
                                  </div>
                                </CardContent>
                                <CardFooter className="pt-2">
                                  <Button disabled className="w-full" variant="outline">
                                      Locked
                                  </Button>
                                </CardFooter>
                            </Card>
                        );
                    })
                }
              </CardContent>
            </Card>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="materials" className="flex-grow">
          <ScrollArea className="h-[calc(100vh-380px)] pr-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Raw Material Acquisition</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-lg">
                    Current Raw Materials: <strong className="text-primary">{(playerStats.factoryRawMaterials || 0).toLocaleString('en-US', {maximumFractionDigits: 0})} units</strong>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Automated Income: <strong className="text-green-500">{totalAutomatedMaterialsPerSecond.toLocaleString('en-US', {maximumFractionDigits: 2})} units/sec</strong>
                    {netPower < 0 && <span className="text-destructive text-xs"> (Insufficient Power!)</span>}
                  </p>
                </div>
                <Button
                  onClick={manuallyCollectRawMaterials}
                  size="lg"
                  disabled={secondsRemainingForCooldown > 0}
                >
                  <Box className="mr-2 h-5 w-5"/>
                  {secondsRemainingForCooldown > 0
                    ? `Collect (Wait ${secondsRemainingForCooldown}s)`
                    : `Manually Collect ${MATERIAL_COLLECTION_AMOUNT_CONST} Raw Materials`}
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Automated Material Collectors</CardTitle>
                <CardDescription>Deploy collectors to automatically gather raw materials over time. Requires power and research.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {INITIAL_FACTORY_MATERIAL_COLLECTORS_CONFIG
                .filter(config => !config.requiredResearchId || (playerStats.unlockedResearchIds || []).includes(config.requiredResearchId))
                .map(config => (
                  <FactoryMaterialCollectorCard
                    key={config.id}
                    collectorConfig={config}
                    numOwned={ownedMaterialCollectorCounts[config.id] || 0}
                    currentMoney={playerStats.money}
                    onPurchase={purchaseFactoryMaterialCollector}
                  />
                ))}
                 {INITIAL_FACTORY_MATERIAL_COLLECTORS_CONFIG.filter(config => config.requiredResearchId && !(playerStats.unlockedResearchIds || []).includes(config.requiredResearchId)).length > 0 &&
                  INITIAL_FACTORY_MATERIAL_COLLECTORS_CONFIG
                    .filter(config => config.requiredResearchId && !(playerStats.unlockedResearchIds || []).includes(config.requiredResearchId))
                    .map(config => {
                        const researchName = researchItems.find(r => r.id === config.requiredResearchId)?.name;
                        return (
                            <Card key={config.id} className="shadow-md opacity-60 border-dashed">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <config.icon className="h-6 w-6 text-muted-foreground" />
                                            {config.name}
                                        </CardTitle>
                                    </div>
                                    <CardDescription className="text-xs">{config.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2 pt-2 pb-3 text-sm">
                                  <div className="flex justify-center items-center flex-col gap-2 text-center">
                                    <LockKeyhole className="h-8 w-8 text-primary" />
                                    <p className="text-sm font-semibold">Research Required</p>
                                    <p className="text-xs text-muted-foreground">
                                      Unlock via "{researchName || config.requiredResearchId}" in the Research tab.
                                    </p>
                                  </div>
                                </CardContent>
                                <CardFooter className="pt-2">
                                  <Button disabled className="w-full" variant="outline">
                                      Locked
                                  </Button>
                                </CardFooter>
                            </Card>
                        );
                    })
                }
              </CardContent>
            </Card>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="production" className="flex-grow flex flex-col">
          <ScrollArea className="h-[calc(100vh-380px)] pr-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Production Lines</CardTitle>
                  <Button onClick={() => setIsBuildAssemblerDialogOpen(true)} variant="outline" size="sm">
                     <Wrench className="mr-2 h-4 w-4"/> Build Assembler
                  </Button>
                </div>
                <CardDescription>Assign machines to empty slots. Click a machine to set its recipe and assign a worker. Production starts if power, materials, a worker, and input components are sufficient.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(playerStats.factoryProductionLines || []).map((line, index) => {
                  const researchForLine = line.requiredResearchId ? researchItems.find(r => r.id === line.requiredResearchId) : null;
                  return (
                    <ProductionLineDisplay
                      key={line.id}
                      productionLine={line}
                      allMachines={playerStats.factoryMachines || []}
                      allWorkers={playerStats.factoryWorkers || []}
                      lineIndex={index}
                      onOpenRecipeDialog={handleOpenRecipeDialog}
                      onUnlockLine={unlockProductionLine}
                      playerMoney={playerStats.money}
                      researchRequiredName={researchForLine?.name}
                      currentDynamicMaxWorkerEnergy={currentDynamicMaxWorkerEnergy}
                    />
                  );
                })}
              </CardContent>
            </Card>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="workers" className="flex-grow">
          <ScrollArea className="h-[calc(100vh-380px)] pr-2">
            <Card>
              <CardHeader>
                <CardTitle>Manage Workers</CardTitle>
                <CardDescription>Monitor your workforce, their energy levels (current max: {formatEnergyTime(currentDynamicMaxWorkerEnergy)}), and current assignments.</CardDescription>
              </CardHeader>
              <CardContent>
                {(playerStats.factoryWorkers || []).length === 0 ? (
                  <p className="text-muted-foreground text-center py-6">No workers hired yet. Hire some to operate your machines!</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[200px]">Energy</TableHead>
                        <TableHead>Assignment</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(playerStats.factoryWorkers || []).map(worker => {
                        const assignedMachine = worker.assignedMachineInstanceId
                          ? (playerStats.factoryMachines || []).find(m => m.instanceId === worker.assignedMachineInstanceId)
                          : null;
                        const machineConfig = assignedMachine
                          ? INITIAL_FACTORY_MACHINE_CONFIGS.find(mc => mc.id === assignedMachine.configId)
                          : null;
                        const assignmentText = machineConfig ? machineConfig.name : (worker.status === 'idle' ? 'Idle' : (worker.status === 'resting' ? 'Resting' : 'Unassigned'));
                        const energyPercent = currentDynamicMaxWorkerEnergy > 0 ? (worker.energy / currentDynamicMaxWorkerEnergy) * 100 : 0;

                        return (
                          <TableRow key={worker.id}>
                            <TableCell className="font-medium">{worker.name}</TableCell>
                            <TableCell>
                              <Badge variant={getWorkerStatusBadgeVariant(worker.status)} className="capitalize">
                                {worker.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Progress
                                  value={energyPercent}
                                  className="h-2 w-24"
                                  indicatorClassName={cn(
                                      worker.status === 'working' && energyPercent > 20 && 'bg-green-500',
                                      worker.status === 'working' && energyPercent <= 20 && 'bg-orange-500',
                                      worker.status === 'resting' && 'bg-blue-500',
                                      worker.status === 'idle' && energyPercent === 100 && 'bg-slate-400',
                                      worker.status === 'idle' && energyPercent < 100 && 'bg-yellow-500'
                                  )}
                                />
                                <span className="text-xs text-muted-foreground">{formatEnergyTime(worker.energy)}</span>
                              </div>
                            </TableCell>
                            <TableCell>{assignmentText}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                    {(playerStats.factoryWorkers || []).length > 5 && <TableCaption>A list of your current factory workers.</TableCaption>}
                  </Table>
                )}
              </CardContent>
              <CardFooter className="pt-4">
                <Button onClick={hireWorker} disabled={playerStats.money < WORKER_HIRE_COST}>
                  <UserPlus className="mr-2 h-4 w-4" /> Hire Worker (${WORKER_HIRE_COST.toLocaleString()})
                </Button>
              </CardFooter>
            </Card>
          </ScrollArea>
        </TabsContent>

        {researchTabAvailable && (
          <TabsContent value="research" className="flex-grow">
            <ScrollArea className="h-[calc(100vh-380px)] pr-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Research & Development</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-lg">
                      Current Research Points: <strong className="text-primary">{playerStats.researchPoints.toLocaleString()} RP</strong>
                    </p>
                  </div>
                  <Button
                    onClick={manuallyGenerateResearchPoints}
                    size="lg"
                    disabled={secondsRemainingForResearchCooldown > 0 || playerStats.money < RESEARCH_MANUAL_GENERATION_COST_MONEY}
                  >
                    <FlaskConical className="mr-2 h-5 w-5"/>
                    {secondsRemainingForResearchCooldown > 0
                      ? `Conduct (Wait ${secondsRemainingForResearchCooldown}s)`
                      : `Manually Conduct Research (+${RESEARCH_MANUAL_GENERATION_AMOUNT} RP, $${RESEARCH_MANUAL_GENERATION_COST_MONEY.toLocaleString()})`}
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Available Research Projects</CardTitle>
                  <CardDescription>Unlock new technologies, machines, components, and production lines.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {(researchItems || []).map(config => (
                    <ResearchItemCard
                      key={config.id}
                      researchConfig={config}
                      playerResearchPoints={playerStats.researchPoints}
                      playerMoney={playerStats.money}
                      unlockedResearchIds={playerStats.unlockedResearchIds || []}
                      onPurchase={purchaseResearch}
                    />
                  ))}
                </CardContent>
              </Card>
            </ScrollArea>
          </TabsContent>
        )}

        <TabsContent value="inventory" className="flex-grow">
        <TooltipProvider>
          <ScrollArea className="h-[calc(100vh-380px)] pr-2">
            <Card>
              <CardHeader>
                <CardTitle>Produced Components</CardTitle>
                <CardDescription>Inventory of components manufactured by your factory. These persist through prestige and may provide bonuses.</CardDescription>
              </CardHeader>
              <CardContent>
                {Object.keys(playerStats.factoryProducedComponents || {}).length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No components produced yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {INITIAL_FACTORY_COMPONENTS_CONFIG.map(compConfig => {
                      const count = (playerStats.factoryProducedComponents || {})[compConfig.id] || 0;
                      if (count > 0 || Object.keys(playerStats.factoryProducedComponents || {}).includes(compConfig.id)) {
                        const Icon = compConfig.icon;
                        const totalBonus = compConfig.effects?.globalIncomeBoostPerComponentPercent
                                            ? count * compConfig.effects.globalIncomeBoostPerComponentPercent
                                            : 0;
                        return (
                          <Card key={compConfig.id} className="p-4 flex flex-col items-center justify-center text-center">
                            <Icon className="h-10 w-10 text-primary mb-2" />
                            <p className="font-semibold">{compConfig.name}</p>
                            <p className="text-2xl font-bold text-accent">{count.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
                            <p className="text-xs text-muted-foreground">{compConfig.description}</p>
                            {compConfig.effects?.globalIncomeBoostPerComponentPercent && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="mt-2 text-xs text-green-500 flex items-center gap-1">
                                    <Lightbulb className="h-3 w-3"/>
                                    <span>Bonus: +{totalBonus.toFixed(3)}% Global Income</span>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Each {compConfig.name} provides +{compConfig.effects.globalIncomeBoostPerComponentPercent.toFixed(4)}% global income.</p>
                                  <p>Total from {count.toLocaleString('en-US', {maximumFractionDigits: 0})} units: +{totalBonus.toFixed(3)}%</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </Card>
                        );
                      }
                      return null;
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </ScrollArea>
          </TooltipProvider>
        </TabsContent>
      </Tabs>
    </div>

    {currentDialogContext && currentDialogContext.assignedMachineInstanceId && (
      <RecipeSelectionDialog
        isOpen={isRecipeDialogOpen}
        onClose={handleCloseRecipeDialog}
        productionLineId={currentDialogContext.productionLineId}
        slotIndex={currentDialogContext.slotIndex}
        assignedMachineInstanceId={currentDialogContext.assignedMachineInstanceId}
        allMachineConfigs={INITIAL_FACTORY_MACHINE_CONFIGS}
        allPlayerMachines={playerStats.factoryMachines || []}
        allComponentConfigs={INITIAL_FACTORY_COMPONENTS_CONFIG}
        setRecipe={setRecipeForProductionSlot}
        currentRecipeId={currentDialogContext.currentRecipeId}
        allWorkers={playerStats.factoryWorkers || []}
        assignWorkerToMachine={assignWorkerToMachine}
        currentAssignedWorkerId={currentDialogContext.currentAssignedWorkerId}
        playerMoney={playerStats.money}
        playerResearchPoints={playerStats.researchPoints}
        unlockedResearchIds={playerStats.unlockedResearchIds || []}
        purchaseFactoryMachineUpgrade={purchaseFactoryMachineUpgrade}
        currentDynamicMaxWorkerEnergy={currentDynamicMaxWorkerEnergy}
      />
    )}

    <Dialog open={isBuildAssemblerDialogOpen} onOpenChange={setIsBuildAssemblerDialogOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Build New Assembler</DialogTitle>
          <DialogDescription>
            Construct assemblers to place in your production lines. Higher Mark assemblers may replace lower Mark ones if available.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {INITIAL_FACTORY_MACHINE_CONFIGS
              .filter(config => !config.requiredResearchId || (playerStats.unlockedResearchIds || []).includes(config.requiredResearchId))
              .map(config => {
                const researchName = config.requiredResearchId && !(playerStats.unlockedResearchIds || []).includes(config.requiredResearchId)
                  ? (researchItems || []).find(r => r.id === config.requiredResearchId)?.name
                  : undefined;
                return (
                  <MachinePurchaseCard
                    key={config.id}
                    machineConfig={config}
                    playerMoney={playerStats.money}
                    onPurchase={purchaseFactoryMachine}
                    isResearchLocked={!!(config.requiredResearchId && !(playerStats.unlockedResearchIds || []).includes(config.requiredResearchId))}
                    researchItemName={researchName}
                  />
                );
            })}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsBuildAssemblerDialogOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}


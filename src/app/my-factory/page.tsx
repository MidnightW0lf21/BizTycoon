
"use client";

import { useGame } from "@/contexts/GameContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Factory, LockKeyhole, ShoppingCart, DollarSign, Zap, Box, Wrench, PackageCheck, Lightbulb, SlidersHorizontal, PackagePlus, FlaskConical } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { INITIAL_FACTORY_POWER_BUILDINGS_CONFIG, INITIAL_FACTORY_MACHINE_CONFIGS, INITIAL_FACTORY_COMPONENTS_CONFIG, INITIAL_FACTORY_MATERIAL_COLLECTORS_CONFIG, INITIAL_RESEARCH_ITEMS_CONFIG, REQUIRED_PRESTIGE_LEVEL_FOR_RESEARCH_TAB, RESEARCH_MANUAL_GENERATION_AMOUNT, RESEARCH_MANUAL_GENERATION_COST_MONEY } from "@/config/game-config";
import { FactoryPowerBuildingCard } from "@/components/factory/FactoryPowerBuildingCard";
import { FactoryMaterialCollectorCard } from "@/components/factory/FactoryMaterialCollectorCard";
import { MachinePurchaseCard } from "@/components/factory/MachinePurchaseCard";
import { ResearchItemCard } from "@/components/factory/ResearchItemCard";
import { ProductionLineDisplay } from "@/components/factory/ProductionLineDisplay";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect, useMemo } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RecipeSelectionDialog } from "@/components/factory/RecipeSelectionDialog";
import type { FactoryMachine } from "@/types";

const REQUIRED_PRESTIGE_LEVEL_MY_FACTORY = 5;
const FACTORY_PURCHASE_COST_FROM_CONFIG = 1000000; // Matches game-config
const MATERIAL_COLLECTION_AMOUNT_CONST = 10; // Matches game-config

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
  } = useGame();

  const netPower = playerStats.factoryPowerUnitsGenerated - playerStats.factoryPowerConsumptionKw;
  
  const totalAutomatedMaterialsPerSecond = useMemo(() => {
    if (!playerStats.factoryPurchased || netPower < 0) return 0; 
    
    let totalMats = 0;
    let powerUsedByCollectors = 0;
    const collectors = playerStats.factoryMaterialCollectors || [];

    collectors.forEach(collector => {
      const config = INITIAL_FACTORY_MATERIAL_COLLECTORS_CONFIG.find(c => c.id === collector.configId);
      if (config) {
        const powerConsumptionOfOtherMachines = playerStats.factoryPowerConsumptionKw - 
            (collectors.filter(c => c.instanceId !== collector.instanceId)
                        .reduce((sum, otherCollector) => {
                            const otherConfig = INITIAL_FACTORY_MATERIAL_COLLECTORS_CONFIG.find(oc => oc.id === otherCollector.configId);
                            return sum + (otherConfig?.powerConsumptionKw || 0);
                        }, 0));
        
        if (playerStats.factoryPowerUnitsGenerated - powerConsumptionOfOtherMachines >= config.powerConsumptionKw) {
           totalMats += config.materialsPerSecond;
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
                actualTotalMats += config.materialsPerSecond;
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
      netPower
  ]);


  const [secondsRemainingForCooldown, setSecondsRemainingForCooldown] = useState(0);
  const [secondsRemainingForResearchCooldown, setSecondsRemainingForResearchCooldown] = useState(0);
  const [isRecipeDialogOpen, setIsRecipeDialogOpen] = useState(false);
  const [currentDialogContext, setCurrentDialogContext] = useState<{
    productionLineId: string;
    slotIndex: number;
    assignedMachineInstanceId: string | null;
    currentRecipeId: string | null;
  } | null>(null);

  useEffect(() => {
    if (!playerStats.factoryPurchased) return;

    let intervalId: NodeJS.Timeout;
    const updateCooldown = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((materialCollectionCooldownEnd - now) / 1000));
      setSecondsRemainingForCooldown(remaining);
      if (remaining === 0) clearInterval(intervalId);
    };
    if (materialCollectionCooldownEnd > Date.now()) {
      updateCooldown(); 
      intervalId = setInterval(updateCooldown, 1000);
    } else {
      setSecondsRemainingForCooldown(0);
    }
    return () => clearInterval(intervalId);
  }, [materialCollectionCooldownEnd, playerStats.factoryPurchased]);

  useEffect(() => {
    if (!playerStats.factoryPurchased || playerStats.timesPrestiged < REQUIRED_PRESTIGE_LEVEL_FOR_RESEARCH_TAB) return;
    let intervalId: NodeJS.Timeout;
    const updateResearchCooldown = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((manualResearchCooldownEnd - now) / 1000));
      setSecondsRemainingForResearchCooldown(remaining);
      if (remaining === 0) clearInterval(intervalId);
    };
    if (manualResearchCooldownEnd > Date.now()) {
      updateResearchCooldown();
      intervalId = setInterval(updateResearchCooldown, 1000);
    } else {
      setSecondsRemainingForResearchCooldown(0);
    }
    return () => clearInterval(intervalId);
  }, [manualResearchCooldownEnd, playerStats.factoryPurchased, playerStats.timesPrestiged]);

  const handleOpenRecipeDialog = (productionLineId: string, slotIndex: number) => {
    const line = (playerStats.factoryProductionLines || []).find(l => l.id === productionLineId);
    if (line && line.slots[slotIndex]) {
      const slot = line.slots[slotIndex];
      setCurrentDialogContext({
        productionLineId,
        slotIndex,
        assignedMachineInstanceId: slot.machineInstanceId,
        currentRecipeId: slot.targetComponentId,
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

  return (
    <>
    <div className="flex flex-col gap-6 h-full">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Factory className="h-7 w-7 text-primary" /> Your Industrial Complex
            </CardTitle>
            <div className="flex gap-4 text-sm flex-wrap justify-end">
              <span className="flex items-center gap-1 font-medium text-yellow-400">
                <Zap className="h-4 w-4" /> Power Gen: {playerStats.factoryPowerUnitsGenerated.toLocaleString()} kW
              </span>
              <span className="flex items-center gap-1 font-medium text-red-400">
                <Zap className="h-4 w-4" /> Power Cons: {playerStats.factoryPowerConsumptionKw.toLocaleString()} kW
              </span>
              <span className={`flex items-center gap-1 font-bold ${netPower >= 0 ? 'text-green-500' : 'text-destructive'}`}>
                <Zap className="h-4 w-4" /> Net Power: {netPower.toLocaleString()} kW
              </span>
              <span className="flex items-center gap-1 font-medium text-orange-400">
                <Box className="h-4 w-4" /> Materials: {playerStats.factoryRawMaterials.toLocaleString('en-US', {maximumFractionDigits: 0})} units
              </span>
               {researchTabAvailable && (
                <span className="flex items-center gap-1 font-medium text-purple-400">
                  <FlaskConical className="h-4 w-4" /> RP: {playerStats.researchPoints.toLocaleString()}
                </span>
              )}
            </div>
          </div>
          <CardDescription>Manage power, materials, and production lines to create valuable components. Unlock new technologies via Research.</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="production" className="w-full flex-grow flex flex-col">
        <TabsList className={`grid w-full ${researchTabAvailable ? 'grid-cols-5' : 'grid-cols-4'} mb-4`}>
          <TabsTrigger value="power"><Zap className="mr-2 h-4 w-4"/>Power</TabsTrigger>
          <TabsTrigger value="materials"><Box className="mr-2 h-4 w-4"/>Materials</TabsTrigger>
          <TabsTrigger value="production"><Wrench className="mr-2 h-4 w-4"/>Production</TabsTrigger>
          {researchTabAvailable && <TabsTrigger value="research"><FlaskConical className="mr-2 h-4 w-4"/>Research</TabsTrigger>}
          <TabsTrigger value="inventory"><PackageCheck className="mr-2 h-4 w-4"/>Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="power" className="flex-grow">
          <ScrollArea className="h-[calc(100vh-300px)] pr-2">
            <Card>
              <CardHeader>
                <CardTitle>Power Generation</CardTitle>
                <CardDescription>Build and manage power buildings to supply your factory.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {INITIAL_FACTORY_POWER_BUILDINGS_CONFIG.map(config => (
                  <FactoryPowerBuildingCard
                    key={config.id}
                    powerBuildingConfig={config}
                    numOwned={ownedPowerBuildingCounts[config.id] || 0}
                    currentMoney={playerStats.money}
                    onPurchase={purchaseFactoryPowerBuilding}
                  />
                ))}
              </CardContent>
            </Card>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="materials" className="flex-grow">
          <ScrollArea className="h-[calc(100vh-300px)] pr-2 space-y-6">
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
                    Automated Income: <strong className="text-green-500">{totalAutomatedMaterialsPerSecond.toLocaleString()} units/sec</strong>
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
                <CardDescription>Deploy collectors to automatically gather raw materials over time. Requires power.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {INITIAL_FACTORY_MATERIAL_COLLECTORS_CONFIG.map(config => (
                  <FactoryMaterialCollectorCard
                    key={config.id}
                    collectorConfig={config}
                    numOwned={ownedMaterialCollectorCounts[config.id] || 0}
                    currentMoney={playerStats.money}
                    onPurchase={purchaseFactoryMaterialCollector}
                  />
                ))}
              </CardContent>
            </Card>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="production" className="flex-grow flex flex-col">
          <ScrollArea className="h-[calc(100vh-300px)] pr-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Build Assemblers</CardTitle>
                <CardDescription>Construct assemblers to place in your production lines. Assemblers are auto-assigned. Each Mark can craft up to its corresponding Tier. Some assemblers require research.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {INITIAL_FACTORY_MACHINE_CONFIGS.map(config => {
                  const isLocked = !!config.requiredResearchId && !(playerStats.unlockedResearchIds || []).includes(config.requiredResearchId);
                  const researchName = isLocked ? researchItems.find(r => r.id === config.requiredResearchId)?.name : undefined;
                  return (
                    <MachinePurchaseCard
                      key={config.id}
                      machineConfig={config}
                      playerMoney={playerStats.money}
                      onPurchase={purchaseFactoryMachine}
                      isResearchLocked={isLocked}
                      researchItemName={researchName}
                    />
                  );
                })}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Production Lines</CardTitle>
                <CardDescription>Machines are auto-assigned to empty slots. Click a machine to set or change its recipe. Production starts if power, materials, and input components are sufficient.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(playerStats.factoryProductionLines || []).map((line, index) => (
                  <ProductionLineDisplay
                    key={line.id}
                    productionLine={line}
                    allMachines={playerStats.factoryMachines || []} 
                    lineIndex={index}
                    onOpenRecipeDialog={handleOpenRecipeDialog}
                  />
                ))}
              </CardContent>
            </Card>
          </ScrollArea>
        </TabsContent>
        
        {researchTabAvailable && (
          <TabsContent value="research" className="flex-grow">
            <ScrollArea className="h-[calc(100vh-300px)] pr-2 space-y-6">
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
                    disabled={secondsRemainingForResearchCooldown > 0}
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
                  <CardDescription>Unlock new technologies, machines, and components.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {researchItems.map(config => (
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
          <ScrollArea className="h-[calc(100vh-300px)] pr-2">
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
    
    {currentDialogContext && (
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
      />
    )}
    </>
  );
}

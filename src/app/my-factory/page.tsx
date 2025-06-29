
"use client";

import { useGame } from "@/contexts/GameContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Factory, LockKeyhole, ShoppingCart, DollarSign, Zap, Box, Wrench, PackageCheck, Lightbulb, SlidersHorizontal, PackagePlus, FlaskConical, UserPlus, Users, Unlock as UnlockIcon, Pickaxe, PackageSearch, Mountain, Satellite, CloudCog, Sun, Waves, TrendingUp, XIcon, Info as InfoIcon, ListChecks as ListChecksIcon, Briefcase, BarChart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { INITIAL_FACTORY_POWER_BUILDINGS_CONFIG, INITIAL_FACTORY_MACHINE_CONFIGS, INITIAL_FACTORY_COMPONENTS_CONFIG, INITIAL_FACTORY_MATERIAL_COLLECTORS_CONFIG, INITIAL_RESEARCH_ITEMS_CONFIG, REQUIRED_PRESTIGE_LEVEL_FOR_RESEARCH_TAB, RESEARCH_MANUAL_GENERATION_AMOUNT, RESEARCH_MANUAL_GENERATION_COST_MONEY, WORKER_ENERGY_TIERS, MAX_WORKERS, WORKER_HIRE_COST_BASE, WORKER_HIRE_COST_MULTIPLIER, MANUAL_RESEARCH_ADDITIVE_COST_INCREASE_PER_BOOST, INITIAL_BUSINESSES, INITIAL_STOCKS } from "@/config/game-config";
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
import type { FactoryMachine, Worker, ResearchItemConfig as ResearchItemType, FactoryComponent, FactoryProductionProgressData } from "@/types";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";


const REQUIRED_PRESTIGE_LEVEL_MY_FACTORY = 5;
const FACTORY_PURCHASE_COST_FROM_CONFIG = 1000000;
const MATERIAL_COLLECTION_AMOUNT_CONST = 10;
const FACTORY_INTRO_DISMISSED_KEY_V1 = 'bizTycoonFactoryIntroDismissed_v1';

const getTierStyling = (tier: number): { border: string; background: string; text: string; } => {
  switch (tier) {
    case 1: return { border: "border-slate-400 dark:border-slate-600", background: "bg-slate-100/30 dark:bg-slate-800/20", text: "text-slate-700 dark:text-slate-300" };
    case 2: return { border: "border-green-500", background: "bg-green-500/5 dark:bg-green-700/10", text: "text-green-700 dark:text-green-400" };
    case 3: return { border: "border-blue-500", background: "bg-blue-500/5 dark:bg-blue-700/10", text: "text-blue-700 dark:text-blue-400" };
    case 4: return { border: "border-purple-500", background: "bg-purple-500/5 dark:bg-purple-700/10", text: "text-purple-700 dark:text-purple-400" };
    case 5: return { border: "border-amber-500", background: "bg-amber-500/5 dark:bg-amber-700/10", text: "text-amber-700 dark:text-amber-400" };
    default: return { border: "border-gray-300 dark:border-gray-700", background: "bg-gray-100/30 dark:bg-gray-800/20", text: "text-gray-700 dark:text-gray-300"};
  }
};


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
  const [isBonusSummaryOpen, setIsBonusSummaryOpen] = useState(false);


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
           // Check for global factory material collection boosts
           let globalFactoryMaterialBoost = 0;
           Object.entries(playerStats.factoryProducedComponents || {}).forEach(([componentId, count]) => {
               const componentConfig = INITIAL_FACTORY_COMPONENTS_CONFIG.find(c => c.id === componentId);
               if (componentConfig?.effects?.factoryGlobalMaterialCollectionBoostPercent && count > 0) {
                   const effectPerUnit = componentConfig.effects.factoryGlobalMaterialCollectionBoostPercent;
                   const maxBonus = componentConfig.effects.maxBonusPercent ?? Infinity;
                   globalFactoryMaterialBoost += Math.min(count * effectPerUnit, maxBonus);
               }
           });
           if (globalFactoryMaterialBoost > 0) {
               baseRate *= (1 + globalFactoryMaterialBoost / 100);
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
                let globalFactoryMaterialBoost = 0;
                 Object.entries(playerStats.factoryProducedComponents || {}).forEach(([componentId, count]) => {
                     const componentConfig = INITIAL_FACTORY_COMPONENTS_CONFIG.find(c => c.id === componentId);
                     if (componentConfig?.effects?.factoryGlobalMaterialCollectionBoostPercent && count > 0) {
                         const effectPerUnit = componentConfig.effects.factoryGlobalMaterialCollectionBoostPercent;
                         const maxBonus = componentConfig.effects.maxBonusPercent ?? Infinity;
                         globalFactoryMaterialBoost += Math.min(count * effectPerUnit, maxBonus);
                     }
                 });
                 if (globalFactoryMaterialBoost > 0) {
                     baseRate *= (1 + globalFactoryMaterialBoost / 100);
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
      researchItems,
      playerStats.factoryProducedComponents
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

  const sortedAndFilteredResearchItems = useMemo(() => {
    const unpurchased = researchItems.filter(
      (config) => !(playerStats.unlockedResearchIds || []).includes(config.id)
    );

    const canPurchase = (config: ResearchItemType): boolean => {
      const dependenciesMet = config.dependencies
        ? config.dependencies.every((depId) =>
            (playerStats.unlockedResearchIds || []).includes(depId)
          )
        : true;
      const affordableRP = playerStats.researchPoints >= config.costRP;
      const affordableMoney = config.costMoney
        ? playerStats.money >= config.costMoney
        : true;
      return dependenciesMet && affordableRP && affordableMoney;
    };

    // 0: Purchasable, 1: Cannot afford (deps met), 2: Dependencies not met
    const getLockedStatus = (config: ResearchItemType): number => {
      if (canPurchase(config)) return 0;

      const dependenciesMet = config.dependencies
        ? config.dependencies.every((depId) =>
            (playerStats.unlockedResearchIds || []).includes(depId)
          )
        : true;
      if (!dependenciesMet) return 2;

      return 1; 
    };

    return unpurchased.sort((a, b) => {
      const aStatus = getLockedStatus(a);
      const bStatus = getLockedStatus(b);

      if (aStatus !== bStatus) {
        return aStatus - bStatus;
      }
      return a.costRP - b.costRP;
    });
  }, [researchItems, playerStats.unlockedResearchIds, playerStats.researchPoints, playerStats.money]);


  const bonusSummaryData = useMemo(() => {
    const summary = {
      globalIncome: { value: 0, sources: [] as string[] },
      globalCostReduction: { value: 0, sources: [] as string[] },
      globalDividendYield: { value: 0, sources: [] as string[] },
      globalUpgradeCost: { value: 0, sources: [] as string[] },
      factoryPower: { value: 0, sources: [] as string[] },
      factoryMaterials: { value: 0, sources: [] as string[] },
      factoryRPGeneration: { value: 0, sources: [] as string[] },
      businessSpecific: {} as Record<string, { income: number; levelCost: number; upgradeCost: number; sources: Record<"income" | "levelCost" | "upgradeCost", string[]> }>,
      stockSpecific: {} as Record<string, { dividend: number, sources: string[] }>,
    };

    if (!playerStats.factoryProducedComponents) return summary;

    for (const compId in playerStats.factoryProducedComponents) {
        const count = playerStats.factoryProducedComponents[compId];
        if (count === 0) continue;
        const config = INITIAL_FACTORY_COMPONENTS_CONFIG.find(c => c.id === compId);
        if (!config?.effects) continue;
        const { effects, name: compName } = config;

        const getCappedBonus = (effectPercent?: number, maxBonus?: number) => {
            if (!effectPercent) return 0;
            const potential = count * effectPercent;
            return maxBonus ? Math.min(potential, maxBonus) : potential;
        };
        
        // Global Bonuses
        let bonus = getCappedBonus(effects.globalIncomeBoostPerComponentPercent, effects.maxBonusPercent);
        if(bonus > 0) { summary.globalIncome.value += bonus; summary.globalIncome.sources.push(`${compName} (+${bonus.toFixed(3)}%)`); }
        
        bonus = getCappedBonus(effects.globalCostReductionPercent, effects.maxBonusPercent);
        if(bonus > 0) { summary.globalCostReduction.value += bonus; summary.globalCostReduction.sources.push(`${compName} (-${bonus.toFixed(3)}%)`); }

        bonus = getCappedBonus(effects.globalDividendYieldBoostPercent, effects.maxBonusPercent);
        if(bonus > 0) { summary.globalDividendYield.value += bonus; summary.globalDividendYield.sources.push(`${compName} (+${bonus.toFixed(4)}%)`); }

        bonus = getCappedBonus(effects.globalBusinessUpgradeCostReductionPercent, effects.maxBonusPercent);
        if(bonus > 0) { summary.globalUpgradeCost.value += bonus; summary.globalUpgradeCost.sources.push(`${compName} (-${bonus.toFixed(3)}%)`); }
        
        // Factory Bonuses
        bonus = getCappedBonus(effects.factoryGlobalPowerOutputBoostPercent, effects.maxBonusPercent);
        if(bonus > 0) { summary.factoryPower.value += bonus; summary.factoryPower.sources.push(`${compName}: +${bonus.toFixed(3)}%`); }

        bonus = getCappedBonus(effects.factoryGlobalMaterialCollectionBoostPercent, effects.maxBonusPercent);
        if(bonus > 0) { summary.factoryMaterials.value += bonus; summary.factoryMaterials.sources.push(`${compName}: +${bonus.toFixed(3)}%`); }

        bonus = getCappedBonus(effects.factoryManualRPGenerationBoost, effects.maxBonusPercent);
        if(bonus > 0) { summary.factoryRPGeneration.value += bonus; summary.factoryRPGeneration.sources.push(`${compName}: +${bonus.toFixed(3)} RP`); }
        
        // Business Specific Bonuses
        if (effects.businessSpecificIncomeBoostPercent) {
            const { businessId } = effects.businessSpecificIncomeBoostPercent;
            bonus = getCappedBonus(effects.businessSpecificIncomeBoostPercent.percent, effects.maxBonusPercent);
            if (bonus > 0) {
                if (!summary.businessSpecific[businessId]) summary.businessSpecific[businessId] = { income: 0, levelCost: 0, upgradeCost: 0, sources: { income: [], levelCost: [], upgradeCost: [] } };
                summary.businessSpecific[businessId].income += bonus;
                summary.businessSpecific[businessId].sources.income.push(`${compName}: +${bonus.toFixed(3)}%`);
            }
        }
        if (effects.businessSpecificLevelUpCostReductionPercent) {
            const { businessId } = effects.businessSpecificLevelUpCostReductionPercent;
            bonus = getCappedBonus(effects.businessSpecificLevelUpCostReductionPercent.percent, effects.maxBonusPercent);
            if (bonus > 0) {
                 if (!summary.businessSpecific[businessId]) summary.businessSpecific[businessId] = { income: 0, levelCost: 0, upgradeCost: 0, sources: { income: [], levelCost: [], upgradeCost: [] } };
                summary.businessSpecific[businessId].levelCost += bonus;
                summary.businessSpecific[businessId].sources.levelCost.push(`${compName}: -${bonus.toFixed(3)}%`);
            }
        }
        if (effects.businessSpecificUpgradeCostReductionPercent) {
            const { businessId } = effects.businessSpecificUpgradeCostReductionPercent;
            bonus = getCappedBonus(effects.businessSpecificUpgradeCostReductionPercent.percent, effects.maxBonusPercent);
            if (bonus > 0) {
                if (!summary.businessSpecific[businessId]) summary.businessSpecific[businessId] = { income: 0, levelCost: 0, upgradeCost: 0, sources: { income: [], levelCost: [], upgradeCost: [] } };
                summary.businessSpecific[businessId].upgradeCost += bonus;
                summary.businessSpecific[businessId].sources.upgradeCost.push(`${compName}: -${bonus.toFixed(3)}%`);
            }
        }

        // Stock Specific Bonuses
        if(effects.stockSpecificDividendYieldBoostPercent) {
            const { stockId } = effects.stockSpecificDividendYieldBoostPercent;
            bonus = getCappedBonus(effects.stockSpecificDividendYieldBoostPercent.percent, effects.maxBonusPercent);
            if (bonus > 0) {
                if (!summary.stockSpecific[stockId]) summary.stockSpecific[stockId] = { dividend: 0, sources: [] };
                summary.stockSpecific[stockId].dividend += bonus;
                summary.stockSpecific[stockId].sources.push(`${compName}: +${bonus.toFixed(4)}%`);
            }
        }
    }
    return summary;
  }, [playerStats.factoryProducedComponents]);


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
  const currentWorkerCount = (playerStats.factoryWorkers || []).length;
  const idleWorkerCount = (playerStats.factoryWorkers || []).filter(w => w.status === 'idle').length;
  const costForNextWorker = Math.floor(WORKER_HIRE_COST_BASE * Math.pow(WORKER_HIRE_COST_MULTIPLIER, currentWorkerCount));


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

  const manualRPPointsToGain = RESEARCH_MANUAL_GENERATION_AMOUNT + (playerStats.manualResearchBonus || 0);
  const numManualRPBoostStagesCompleted = (playerStats.unlockedResearchIds || []).filter(id => id.startsWith("manual_rp_boost_")).length;
  const currentManualRPCostMoney = RESEARCH_MANUAL_GENERATION_COST_MONEY + (numManualRPBoostStagesCompleted * MANUAL_RESEARCH_ADDITIVE_COST_INCREASE_PER_BOOST);

  const renderProducedComponent = (compConfig: FactoryComponent) => {
    const count = (playerStats.factoryProducedComponents || {})[compConfig.id] || 0;
    if (count === 0 && !Object.keys(playerStats.factoryProducedComponents || {}).includes(compConfig.id)) return null;

    const Icon = compConfig.icon;
    const tierStyling = getTierStyling(compConfig.tier);
    let currentBonusDisplay = "";
    let maxBonusDisplay = "";

    // For now, only displaying primary global income boost. This section would need to be more generic for other effects.
    if (compConfig.effects?.globalIncomeBoostPerComponentPercent) {
        const effectPerUnit = compConfig.effects.globalIncomeBoostPerComponentPercent;
        const currentTotalEffect = count * effectPerUnit;
        const maxBonus = compConfig.effects.maxBonusPercent ?? Infinity;
        currentBonusDisplay = `+${Math.min(currentTotalEffect, maxBonus).toFixed(3)}% Global Inc.`;
        maxBonusDisplay = `/ Max: +${maxBonus.toFixed(3)}%`;
    } else if (compConfig.effects?.businessSpecificIncomeBoostPercent) {
        const effect = compConfig.effects.businessSpecificIncomeBoostPercent;
        const currentTotalEffect = count * effect.percent;
        const maxBonus = compConfig.effects.maxBonusPercent ?? Infinity;
        currentBonusDisplay = `+${Math.min(currentTotalEffect, maxBonus).toFixed(2)}% ${effect.businessName || effect.businessId} Inc.`;
        maxBonusDisplay = `/ Max: +${maxBonus.toFixed(2)}%`;
    } // Add more 'else if' for other primary effects if needed for card display

    return (
      <Card key={compConfig.id} className={cn("p-3 flex flex-col text-center shadow-md hover:shadow-lg", tierStyling.border, tierStyling.background)}>
        <div className="flex items-center justify-between mb-1">
          <Icon className={cn("h-7 w-7", tierStyling.text)} />
          <Badge variant="outline" className={cn("text-xs px-1.5 py-0.5", tierStyling.border, tierStyling.text, getTierStyling(compConfig.tier).background.replace(/(\w+-)(\d+)\/(\d+)/, '$1$2/80'))}> {/* Darken bg for badge slightly */}
            Tier {compConfig.tier}
          </Badge>
        </div>
        <p className={cn("font-semibold text-sm", tierStyling.text)}>{compConfig.name}</p>
        <p className={cn("text-xl font-bold", tierStyling.text, "my-0.5")}>{count.toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
        <p className="text-xs text-muted-foreground flex-grow min-h-[30px]">{compConfig.description}</p>
        {currentBonusDisplay && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={cn("mt-1.5 text-xs", tierStyling.text, "opacity-80")}>
                <Lightbulb className="inline h-3 w-3 mr-0.5"/>
                <span>{currentBonusDisplay} {maxBonusDisplay}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{compConfig.effects?.globalIncomeBoostPerComponentPercent ? `Each provides +${compConfig.effects.globalIncomeBoostPerComponentPercent.toFixed(4)}% global income.` : 
                  compConfig.effects?.businessSpecificIncomeBoostPercent ? `Each provides +${compConfig.effects.businessSpecificIncomeBoostPercent.percent.toFixed(3)}% to ${compConfig.effects.businessSpecificIncomeBoostPercent.businessName || compConfig.effects.businessSpecificIncomeBoostPercent.businessId}` :
                   'Provides a special bonus.'}</p>
              <p>Current contribution: {currentBonusDisplay}</p>
              <p>Max possible bonus from this component type: {compConfig.effects?.maxBonusPercent?.toFixed(2)}%</p>
            </TooltipContent>
          </Tooltip>
        )}
      </Card>
    );
  };
  
    const BonusItem = ({ icon: Icon, label, value, unit, sources = [] }: { icon: React.ElementType, label: string, value: number, unit: string, sources?: string[] }) => (
        <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">{label}:</span>
            </div>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className="font-semibold text-primary cursor-help">
                        {value > 0 ? '+' : ''}{value.toFixed(2)}{unit}
                    </span>
                </TooltipTrigger>
                {sources.length > 0 && (
                    <TooltipContent>
                        <p className="font-bold">Contributing Components:</p>
                        <ul className="list-disc list-inside">
                            {sources.map((source, i) => <li key={i}>{source}</li>)}
                        </ul>
                    </TooltipContent>
                )}
            </Tooltip>
        </div>
    );

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
            <p className="text-2xl font-bold text-blue-400">{idleWorkerCount} / {currentWorkerCount}</p>
            <p className="text-xs text-muted-foreground">Idle / Total (Max: {MAX_WORKERS})</p>
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
                  const lineProgressData: Record<string, FactoryProductionProgressData> = {};
                  if (playerStats.factoryProductionProgress) {
                      for (const key in playerStats.factoryProductionProgress) {
                          if (key.startsWith(`${line.id}-`)) {
                              lineProgressData[key] = playerStats.factoryProductionProgress[key];
                          }
                      }
                  }
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
                      playerStats={playerStats}
                      lineProductionProgress={lineProgressData}
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
                <CardDescription>
                  Monitor your workforce ({currentWorkerCount} / {MAX_WORKERS}), their energy levels (current max: {formatEnergyTime(currentDynamicMaxWorkerEnergy)}), and assignments.
                </CardDescription>
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
                <Button
                  onClick={hireWorker}
                  disabled={playerStats.money < costForNextWorker || currentWorkerCount >= MAX_WORKERS}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  {currentWorkerCount >= MAX_WORKERS
                    ? "Max Workers Reached"
                    : `Hire Worker ($${costForNextWorker.toLocaleString()})`}
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
                    disabled={secondsRemainingForResearchCooldown > 0 || playerStats.money < currentManualRPCostMoney}
                  >
                    <FlaskConical className="mr-2 h-5 w-5"/>
                    {secondsRemainingForResearchCooldown > 0
                      ? `Conduct (Wait ${secondsRemainingForResearchCooldown}s)`
                      : `Manually Conduct Research (+${manualRPPointsToGain} RP, $${currentManualRPCostMoney.toLocaleString()})`}
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Available Research Projects</CardTitle>
                  <CardDescription>Unlock new technologies, machines, components, and production lines. Sorted by availability.</CardDescription>
                </CardHeader>
                <CardContent>
                {sortedAndFilteredResearchItems.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      No research projects currently available or all projects have been completed.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {sortedAndFilteredResearchItems.map(config => (
                        <ResearchItemCard
                          key={config.id}
                          researchConfig={config}
                          playerResearchPoints={playerStats.researchPoints}
                          playerMoney={playerStats.money}
                          unlockedResearchIds={playerStats.unlockedResearchIds || []}
                          onPurchase={purchaseResearch}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </ScrollArea>
          </TabsContent>
        )}

        <TabsContent value="inventory" className="flex-grow">
        <TooltipProvider>
          <ScrollArea className="h-[calc(100vh-380px)] pr-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Produced Components Inventory</CardTitle>
                  <CardDescription>Components manufactured by your factory. These persist through prestige and provide bonuses.</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => setIsBonusSummaryOpen(true)}>
                  <ListChecksIcon className="mr-2 h-4 w-4"/> View Bonus Summary
                </Button>
              </CardHeader>
              <CardContent>
                {Object.keys(playerStats.factoryProducedComponents || {}).length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No components produced yet. Start your production lines!</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {INITIAL_FACTORY_COMPONENTS_CONFIG.map(renderProducedComponent).filter(Boolean)}
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
    
    <Dialog open={isBonusSummaryOpen} onOpenChange={setIsBonusSummaryOpen}>
        <DialogContent className="max-w-4xl">
            <DialogHeader>
                <DialogTitle>Factory Component Bonus Summary</DialogTitle>
                <DialogDescription>
                    Overview of all active bonuses from your produced factory components.
                </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh] pr-3 py-4">
                <div className="space-y-4">
                    <Card>
                        <CardHeader><CardTitle className="text-lg">Global Bonuses</CardTitle></CardHeader>
                        <CardContent className="space-y-1">
                            {bonusSummaryData.globalIncome.value > 0 && <BonusItem icon={Lightbulb} label="Global Income" value={bonusSummaryData.globalIncome.value} unit="%" sources={bonusSummaryData.globalIncome.sources} />}
                            {bonusSummaryData.globalCostReduction.value > 0 && <BonusItem icon={DollarSign} label="Global Level-Up Cost" value={-bonusSummaryData.globalCostReduction.value} unit="%" sources={bonusSummaryData.globalCostReduction.sources} />}
                            {bonusSummaryData.globalUpgradeCost.value > 0 && <BonusItem icon={DollarSign} label="Global Upgrade Cost" value={-bonusSummaryData.globalUpgradeCost.value} unit="%" sources={bonusSummaryData.globalUpgradeCost.sources} />}
                            {bonusSummaryData.globalDividendYield.value > 0 && <BonusItem icon={TrendingUp} label="Global Dividend Yield" value={bonusSummaryData.globalDividendYield.value} unit="%" sources={bonusSummaryData.globalDividendYield.sources} />}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle className="text-lg">Factory Bonuses</CardTitle></CardHeader>
                        <CardContent className="space-y-1">
                            {bonusSummaryData.factoryPower.value > 0 && <BonusItem icon={Zap} label="Factory Power Output" value={bonusSummaryData.factoryPower.value} unit="%" sources={bonusSummaryData.factoryPower.sources} />}
                            {bonusSummaryData.factoryMaterials.value > 0 && <BonusItem icon={Box} label="Factory Material Collection" value={bonusSummaryData.factoryMaterials.value} unit="%" sources={bonusSummaryData.factoryMaterials.sources} />}
                            {bonusSummaryData.factoryRPGeneration.value > 0 && <BonusItem icon={FlaskConical} label="Manual Research Bonus" value={bonusSummaryData.factoryRPGeneration.value} unit=" RP" sources={bonusSummaryData.factoryRPGeneration.sources} />}
                        </CardContent>
                    </Card>
                    
                    {Object.keys(bonusSummaryData.businessSpecific).length > 0 && (
                      <Card>
                        <CardHeader><CardTitle className="text-lg">Business-Specific Bonuses</CardTitle></CardHeader>
                        <CardContent>
                          <Accordion type="multiple" className="w-full">
                            {Object.entries(bonusSummaryData.businessSpecific).map(([businessId, bonuses]) => {
                              const businessInfo = INITIAL_BUSINESSES.find(b => b.id === businessId);
                              if (!businessInfo) return null;
                              return (
                                <AccordionItem value={businessId} key={businessId}>
                                  <AccordionTrigger>
                                    <div className="flex items-center gap-2">
                                      <Briefcase className="h-4 w-4" />
                                      <span>{businessInfo.name}</span>
                                    </div>
                                  </AccordionTrigger>
                                  <AccordionContent className="pl-4 space-y-2">
                                    {bonuses.income > 0 && <BonusItem icon={Lightbulb} label="Income" value={bonuses.income} unit="%" sources={bonuses.sources.income} />}
                                    {bonuses.levelCost > 0 && <BonusItem icon={DollarSign} label="Level-Up Cost" value={-bonuses.levelCost} unit="%" sources={bonuses.sources.levelCost} />}
                                    {bonuses.upgradeCost > 0 && <BonusItem icon={DollarSign} label="Upgrade Cost" value={-bonuses.upgradeCost} unit="%" sources={bonuses.sources.upgradeCost} />}
                                  </AccordionContent>
                                </AccordionItem>
                              );
                            })}
                          </Accordion>
                        </CardContent>
                      </Card>
                    )}

                    {Object.keys(bonusSummaryData.stockSpecific).length > 0 && (
                      <Card>
                        <CardHeader><CardTitle className="text-lg">Stock-Specific Bonuses</CardTitle></CardHeader>
                        <CardContent>
                           <Accordion type="multiple" className="w-full">
                             {Object.entries(bonusSummaryData.stockSpecific).map(([stockId, bonuses]) => {
                               const stockInfo = INITIAL_STOCKS.find(s => s.id === stockId);
                               if (!stockInfo) return null;
                               return (
                                 <AccordionItem value={stockId} key={stockId}>
                                    <AccordionTrigger>
                                      <div className="flex items-center gap-2">
                                        <BarChart className="h-4 w-4" />
                                        <span>{stockInfo.companyName} ({stockInfo.ticker})</span>
                                      </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pl-4">
                                      {bonuses.dividend > 0 && <BonusItem icon={TrendingUp} label="Dividend Yield" value={bonuses.dividend} unit="%" sources={bonuses.sources} />}
                                    </AccordionContent>
                                 </AccordionItem>
                               );
                             })}
                           </Accordion>
                        </CardContent>
                      </Card>
                    )}
                </div>
            </ScrollArea>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsBonusSummaryOpen(false)}>Close</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
  );
}


"use client";

import type { Business, PlayerStats, Stock, StockHolding, SkillNode, SaveData, HQUpgrade, FactoryPowerBuilding, FactoryMachine, FactoryProductionLine, FactoryPowerBuildingConfig, FactoryMachineConfig, FactoryComponent, FactoryProductionLineSlot, ResearchItemConfig, FactoryMaterialCollector } from '@/types';
import {
  INITIAL_BUSINESSES,
  INITIAL_MONEY,
  INITIAL_STOCKS,
  INITIAL_PRESTIGE_POINTS,
  INITIAL_TIMES_PRESTIGED,
  INITIAL_SKILL_TREE,
  INITIAL_UNLOCKED_SKILL_IDS,
  INITIAL_HQ_UPGRADE_LEVELS,
  INITIAL_HQ_UPGRADES,
  INITIAL_FACTORY_POWER_BUILDINGS_CONFIG,
  INITIAL_FACTORY_MACHINE_CONFIGS,
  INITIAL_FACTORY_COMPONENTS_CONFIG,
  INITIAL_FACTORY_MATERIAL_COLLECTORS_CONFIG,
  INITIAL_RESEARCH_ITEMS_CONFIG,
  getStartingMoneyBonus,
  getPrestigePointBoostPercent,
  calculateDiminishingPrestigePoints,
  calculateCostForNLevels,
  calculateMaxAffordableLevels,
  calculateSingleLevelUpgradeCost,
  MAX_BUSINESS_LEVEL,
  FACTORY_PURCHASE_COST,
  MATERIAL_COLLECTION_AMOUNT,
  MATERIAL_COLLECTION_COOLDOWN_MS,
  INITIAL_RESEARCH_POINTS,
  INITIAL_UNLOCKED_RESEARCH_IDS,
  RESEARCH_MANUAL_GENERATION_AMOUNT,
  RESEARCH_MANUAL_GENERATION_COST_MONEY,
  RESEARCH_MANUAL_COOLDOWN_MS,
  REQUIRED_PRESTIGE_LEVEL_FOR_RESEARCH_TAB,
  TECH_BUSINESS_IDS,
  LOGISTICS_BUSINESS_IDS,
  MEDIA_BUSINESS_IDS,
  MANUFACTURING_BUSINESS_IDS,
  ENERGY_BUSINESS_IDS,
  FINANCE_BUSINESS_IDS,
  BIO_TECH_BUSINESS_IDS,
  AEROSPACE_BUSINESS_IDS,
  MISC_ADVANCED_BUSINESS_IDS,
} from '@/config/game-config';
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useMemo, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";

const SAVE_DATA_KEY = 'bizTycoonSaveData_v1';
const AUTO_SAVE_INTERVAL = 30000; 
const STOCK_PRICE_UPDATE_INTERVAL = 150000; // 2.5 minutes
const GAME_TICK_INTERVAL = 1000; // 1 second


interface GameContextType {
  playerStats: PlayerStats;
  businesses: Business[];
  stocks: Stock[]; 
  skillTree: SkillNode[];
  hqUpgrades: HQUpgrade[];
  researchItems: ResearchItemConfig[];
  lastSavedTimestamp: number | null;
  lastMarketTrends: string;
  setLastMarketTrends: (trends: string) => void;
  lastRiskTolerance: "low" | "medium" | "high";
  setLastRiskTolerance: (tolerance: "low" | "medium" | "high") => void;
  materialCollectionCooldownEnd: number;
  manualResearchCooldownEnd: number;
  upgradeBusiness: (businessId: string, levelsToBuy?: number) => void;
  purchaseBusinessUpgrade: (businessId: string, upgradeId: string, isAutoBuy?: boolean) => boolean;
  purchaseHQUpgrade: (upgradeId: string) => void;
  getBusinessIncome: (businessId: string) => number;
  getBusinessUpgradeCost: (businessId: string) => number; 
  buyStock: (stockId: string, sharesToBuy: number) => void;
  sellStock: (stockId: string, sharesToSell: number) => void;
  performPrestige: () => void;
  unlockSkillNode: (skillId: string) => void;
  getDynamicMaxBusinessLevel: () => number;
  calculateCostForNLevelsForDisplay: (businessId: string, levelsToBuy: number) => { totalCost: number; levelsPurchasable: number };
  calculateMaxAffordableLevelsForDisplay: (businessId: string) => { levelsToBuy: number; totalCost: number };
  manualSaveGame: () => void;
  exportGameState: () => string;
  importGameState: (jsonString: string) => boolean;
  wipeGameData: () => void;
  purchaseFactoryBuilding: () => void;
  purchaseFactoryPowerBuilding: (configId: string) => void;
  manuallyCollectRawMaterials: () => void;
  purchaseFactoryMachine: (configId: string) => void;
  setRecipeForProductionSlot: (productionLineId: string, slotIndex: number, targetComponentId: string | null) => void;
  purchaseFactoryMaterialCollector: (configId: string) => void;
  manuallyGenerateResearchPoints: () => void;
  purchaseResearch: (researchId: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const getInitialPlayerStats = (): PlayerStats => {
  const startingMoneyBonus = getStartingMoneyBonus(INITIAL_UNLOCKED_SKILL_IDS, INITIAL_SKILL_TREE, INITIAL_HQ_UPGRADE_LEVELS, INITIAL_HQ_UPGRADES);
  return {
    money: INITIAL_MONEY + startingMoneyBonus,
    totalIncomePerSecond: 0,
    investmentsValue: 0,
    stockHoldings: [],
    prestigePoints: INITIAL_PRESTIGE_POINTS,
    timesPrestiged: INITIAL_TIMES_PRESTIGED,
    unlockedSkillIds: [...INITIAL_UNLOCKED_SKILL_IDS],
    hqUpgradeLevels: { ...INITIAL_HQ_UPGRADE_LEVELS },
    achievedBusinessMilestones: {},
    factoryPurchased: false,
    factoryPowerUnitsGenerated: 0,
    factoryPowerConsumptionKw: 0, 
    factoryRawMaterials: 0,
    factoryMachines: [],
    factoryProductionLines: Array.from({ length: 5 }, (_, i) => ({
      id: `line_${i + 1}`,
      name: `Production Line ${i + 1}`,
      slots: Array.from({ length: 6 }, () => ({ machineInstanceId: null, targetComponentId: null })), 
    })),
    factoryPowerBuildings: [],
    factoryProducedComponents: {},
    factoryMaterialCollectors: [],
    researchPoints: INITIAL_RESEARCH_POINTS,
    unlockedResearchIds: [...INITIAL_UNLOCKED_RESEARCH_IDS],
    lastManualResearchTimestamp: 0,
  };
};

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();

  const [skillTreeState] = useState<SkillNode[]>(INITIAL_SKILL_TREE);
  const [hqUpgradesState] = useState<HQUpgrade[]>(INITIAL_HQ_UPGRADES);
  const [researchItemsState] = useState<ResearchItemConfig[]>(INITIAL_RESEARCH_ITEMS_CONFIG);
  const [lastSavedTimestamp, setLastSavedTimestamp] = useState<number | null>(null);
  const [playerStats, setPlayerStats] = useState<PlayerStats>(getInitialPlayerStats());

  const [businesses, setBusinesses] = useState<Business[]>(() =>
    INITIAL_BUSINESSES.map(biz => ({
      ...biz,
      level: 0,
      managerOwned: false,
      upgrades: biz.upgrades ? biz.upgrades.map(upg => ({ ...upg, isPurchased: false })) : [],
      icon: biz.icon,
    }))
  );

  const [stocksWithDynamicPrices, setStocksWithDynamicPrices] = useState<Stock[]>(() =>
    INITIAL_STOCKS.map(s => ({ ...s })) 
  );

  const [lastMarketTrends, setLastMarketTrendsInternal] = useState<string>("Tech stocks are performing well, while energy sectors are seeing a slight downturn.");
  const [lastRiskTolerance, setLastRiskToleranceInternal] = useState<"low" | "medium" | "high">("medium");
  
  const materialCollectionCooldownEndRef = useRef<number>(0);
  const manualResearchCooldownEndRef = useRef<number>(0);
  const [materialCollectionCooldownEnd, setMaterialCollectionCooldownEnd] = useState<number>(0);
  const [manualResearchCooldownEnd, setManualResearchCooldownEnd] = useState<number>(0);


  const playerStatsRef = useRef(playerStats);
  const businessesRef = useRef(businesses);
  const skillTreeRef = useRef(skillTreeState);
  const hqUpgradesRef = useRef(hqUpgradesState);
  const researchItemsRef = useRef(researchItemsState);
  const unlockedStocksRef = useRef<Stock[]>([]);
  const toastRef = useRef(toast);

  useEffect(() => { playerStatsRef.current = playerStats; }, [playerStats]);
  useEffect(() => { businessesRef.current = businesses; }, [businesses]);
  useEffect(() => { skillTreeRef.current = skillTreeState; }, [skillTreeState]);
  useEffect(() => { hqUpgradesRef.current = hqUpgradesState; }, [hqUpgradesState]);
  useEffect(() => { researchItemsRef.current = researchItemsState; }, [researchItemsState]);
  useEffect(() => { toastRef.current = toast; }, [toast]);

  const unlockedStocks = useMemo(() => {
    const filtered = stocksWithDynamicPrices.filter(currentDynamicStock => {
      const initialStockData = INITIAL_STOCKS.find(is => is.id === currentDynamicStock.id);
      if (!initialStockData) return false; 
      if (!initialStockData.requiredSkillToUnlock) return true; 
      return playerStatsRef.current.unlockedSkillIds.includes(initialStockData.requiredSkillToUnlock);
    });
    unlockedStocksRef.current = filtered;
    return filtered;
  }, [stocksWithDynamicPrices, playerStats.unlockedSkillIds]);


  const getDynamicMaxBusinessLevel = useCallback((): number => {
    let currentMaxLevel = MAX_BUSINESS_LEVEL; 
    playerStatsRef.current.unlockedSkillIds.forEach(skillId => {
        const skill = skillTreeRef.current.find(s => s.id === skillId);
        if (skill && skill.effects.increaseMaxBusinessLevelBy) {
            currentMaxLevel += skill.effects.increaseMaxBusinessLevelBy;
        }
    });
    return currentMaxLevel;
  }, []);

  const localCalculateIncome = useCallback((
    business: Business,
    currentUnlockedSkillIds: string[],
    currentSkillTree: SkillNode[],
    currentPurchasedHQUpgradeLevels: Record<string, number>,
    currentHqUpgradesConfig: HQUpgrade[],
    currentProducedFactoryComponents: Record<string, number>,
    currentFactoryComponentsConfig: FactoryComponent[]
  ): number => {
    if (business.level === 0) return 0;
    let currentIncome = business.level * business.baseIncome;

    if (business.upgrades) {
      business.upgrades.forEach(upgrade => {
        if (upgrade.isPurchased && upgrade.incomeBoostPercent) {
          currentIncome *= (1 + upgrade.incomeBoostPercent / 100);
        }
      });
    }

    let totalGlobalIncomeBoost = 0;
    let businessSpecificBoost = 0;

    currentUnlockedSkillIds.forEach(skillId => {
      const skill = currentSkillTree.find(s => s.id === skillId);
      if (skill && skill.effects) {
        if (skill.effects.globalIncomeBoostPercent) {
          totalGlobalIncomeBoost += skill.effects.globalIncomeBoostPercent;
        }
        if (skill.effects.businessSpecificIncomeBoost && skill.effects.businessSpecificIncomeBoost.businessId === business.id) {
          businessSpecificBoost += skill.effects.businessSpecificIncomeBoost.percent;
        }
        if (skill.id === 'tech_empire_synergy' && TECH_BUSINESS_IDS.includes(business.id)) { businessSpecificBoost += 15; }
        if (skill.id === 'logistics_network_optimization' && LOGISTICS_BUSINESS_IDS.includes(business.id)) { businessSpecificBoost += 15; }
        if (skill.id === 'media_mogul_influence' && MEDIA_BUSINESS_IDS.includes(business.id)) { businessSpecificBoost += 15; }
        if (skill.id === 'industrial_powerhouse' && MANUFACTURING_BUSINESS_IDS.includes(business.id)) { businessSpecificBoost += 15; }
      }
    });

    for (const hqId in currentPurchasedHQUpgradeLevels) {
      const purchasedLevel = currentPurchasedHQUpgradeLevels[hqId];
      if (purchasedLevel > 0) {
          const hqUpgrade = currentHqUpgradesConfig.find(h => h.id === hqId);
          if (hqUpgrade && hqUpgrade.levels) {
              const levelData = hqUpgrade.levels.find(l => l.level === purchasedLevel);
              if (levelData && levelData.effects.globalIncomeBoostPercent) { totalGlobalIncomeBoost += levelData.effects.globalIncomeBoostPercent; }
          }
      }
    }
    for (const componentId in currentProducedFactoryComponents) {
      const count = currentProducedFactoryComponents[componentId];
      if (count > 0) {
        const componentConfig = currentFactoryComponentsConfig.find(fc => fc.id === componentId);
        if (componentConfig && componentConfig.effects?.globalIncomeBoostPerComponentPercent) {
          totalGlobalIncomeBoost += count * componentConfig.effects.globalIncomeBoostPerComponentPercent;
        }
      }
    }
    if (totalGlobalIncomeBoost > 0) { currentIncome *= (1 + totalGlobalIncomeBoost / 100); }
    if (businessSpecificBoost > 0) { currentIncome *= (1 + businessSpecificBoost / 100); }
    return currentIncome;
  }, []);

  useEffect(() => {
    const gameTickIntervalId = setInterval(() => {
      setPlayerStats(prev => {
        const currentTotalBusinessIncome = businessesRef.current.reduce((sum, biz) => {
          const income = localCalculateIncome(
            biz, 
            prev.unlockedSkillIds, 
            skillTreeRef.current, 
            prev.hqUpgradeLevels, 
            hqUpgradesRef.current,
            prev.factoryProducedComponents,
            INITIAL_FACTORY_COMPONENTS_CONFIG
          );
          return sum + income;
        }, 0);

        let currentDividendIncome = 0;
        let globalDividendBoost = 0;
        prev.unlockedSkillIds.forEach(skillId => {
          const skill = skillTreeRef.current.find(s => s.id === skillId);
          if (skill && skill.effects && skill.effects.globalDividendYieldBoostPercent) { globalDividendBoost += skill.effects.globalDividendYieldBoostPercent; }
        });
        for (const hqId in prev.hqUpgradeLevels) {
          const purchasedLevel = prev.hqUpgradeLevels[hqId];
          if (purchasedLevel > 0) {
            const hqUpgrade = hqUpgradesRef.current.find(h => h.id === hqId);
            if (hqUpgrade && hqUpgrade.levels) {
              const levelData = hqUpgrade.levels.find(l => l.level === purchasedLevel);
              if (levelData && levelData.effects.globalDividendYieldBoostPercent) { globalDividendBoost += levelData.effects.globalDividendYieldBoostPercent; }
            }
          }
        }
        for (const holding of prev.stockHoldings) {
          const stockDetails = unlockedStocksRef.current.find(s => s.id === holding.stockId);
          if (stockDetails) {
            let currentDividendYield = stockDetails.dividendYield;
            const initialStockInfo = INITIAL_STOCKS.find(is => is.id === holding.stockId);
            if(initialStockInfo) { currentDividendYield = initialStockInfo.dividendYield; }
            currentDividendYield *= (1 + globalDividendBoost / 100);
            currentDividendIncome += holding.shares * stockDetails.price * currentDividendYield;
          }
        }
        const incomeThisTick = currentTotalBusinessIncome + currentDividendIncome;
        const newMoneyFromIncome = prev.money + incomeThisTick;

        let currentInvestmentsValue = 0;
        for (const holding of prev.stockHoldings) {
          const stockDetails = unlockedStocksRef.current.find(s => s.id === holding.stockId);
          if (stockDetails) { currentInvestmentsValue += holding.shares * stockDetails.price; }
        }
        
        let newFactoryPowerConsumptionKw = 0;
        let newFactoryRawMaterials = prev.factoryRawMaterials;
        let newFactoryProducedComponents = { ...prev.factoryProducedComponents };

        if (prev.factoryPurchased) {
            let tempPowerConsumption = 0;
            prev.factoryProductionLines.forEach(line => {
                line.slots.forEach(slot => {
                    if (slot.machineInstanceId && slot.targetComponentId) {
                        const machine = prev.factoryMachines.find(m => m.instanceId === slot.machineInstanceId);
                        if (machine) {
                            const machineConfig = INITIAL_FACTORY_MACHINE_CONFIGS.find(mc => mc.id === machine.configId);
                            if (machineConfig) { tempPowerConsumption += machineConfig.powerConsumptionKw; }
                        }
                    }
                });
            });
            (prev.factoryMaterialCollectors || []).forEach(collector => {
                const config = INITIAL_FACTORY_MATERIAL_COLLECTORS_CONFIG.find(c => c.id === collector.configId);
                if (config) { tempPowerConsumption += config.powerConsumptionKw; }
            });
            newFactoryPowerConsumptionKw = tempPowerConsumption;
            
            const netPower = prev.factoryPowerUnitsGenerated - newFactoryPowerConsumptionKw;

            if (netPower >= 0) { 
                let powerUsedByCollectors = 0;
                (prev.factoryMaterialCollectors || []).forEach(collector => {
                    const config = INITIAL_FACTORY_MATERIAL_COLLECTORS_CONFIG.find(c => c.id === collector.configId);
                    if (config) powerUsedByCollectors += config.powerConsumptionKw;
                });
                const powerAvailableForCollectors = prev.factoryPowerUnitsGenerated - (newFactoryPowerConsumptionKw - powerUsedByCollectors);
                let tempPowerForCollectors = powerAvailableForCollectors;
                let actualMaterialsCollectedThisTick = 0;
                (prev.factoryMaterialCollectors || []).sort((a,b) => {
                    const confA = INITIAL_FACTORY_MATERIAL_COLLECTORS_CONFIG.find(c => c.id === a.configId);
                    const confB = INITIAL_FACTORY_MATERIAL_COLLECTORS_CONFIG.find(c => c.id === b.configId);
                    return (confA?.powerConsumptionKw || Infinity) - (confB?.powerConsumptionKw || Infinity);
                }).forEach(collector => {
                    const config = INITIAL_FACTORY_MATERIAL_COLLECTORS_CONFIG.find(c => c.id === collector.configId);
                    if (config && tempPowerForCollectors >= config.powerConsumptionKw) {
                        actualMaterialsCollectedThisTick += config.materialsPerSecond;
                        tempPowerForCollectors -= config.powerConsumptionKw;
                    }
                });
                newFactoryRawMaterials += actualMaterialsCollectedThisTick;
            }

            if (netPower >= 0) { 
                prev.factoryProductionLines.forEach(line => {
                    line.slots.forEach(slot => {
                    if (slot.machineInstanceId && slot.targetComponentId) {
                        const machine = prev.factoryMachines.find(m => m.instanceId === slot.machineInstanceId);
                        const machineConfig = machine ? INITIAL_FACTORY_MACHINE_CONFIGS.find(mc => mc.id === machine.configId) : null;
                        const componentRecipe = INITIAL_FACTORY_COMPONENTS_CONFIG.find(cc => cc.id === slot.targetComponentId);

                        if (machine && machineConfig && componentRecipe && machineConfig.maxCraftableTier >= componentRecipe.tier) {
                            let canCraft = true;
                            const rawMaterialCostPerSecond = componentRecipe.rawMaterialCost / componentRecipe.productionTimeSeconds;
                            if (newFactoryRawMaterials < rawMaterialCostPerSecond) {
                                canCraft = false;
                            }
                            for (const input of componentRecipe.recipe) {
                                const inputComponentCostPerSecond = input.quantity / componentRecipe.productionTimeSeconds;
                                if ((newFactoryProducedComponents[input.componentId] || 0) < inputComponentCostPerSecond ) {
                                canCraft = false;
                                break;
                                }
                            }
                            const powerNeededForThisMachine = machineConfig.powerConsumptionKw;
                            const powerAvailableForProduction = prev.factoryPowerUnitsGenerated - newFactoryPowerConsumptionKw + powerNeededForThisMachine; 

                            if (canCraft && powerAvailableForProduction >= powerNeededForThisMachine) {
                                newFactoryRawMaterials -= rawMaterialCostPerSecond;
                                for (const input of componentRecipe.recipe) {
                                newFactoryProducedComponents[input.componentId] = (newFactoryProducedComponents[input.componentId] || 0) - (input.quantity / componentRecipe.productionTimeSeconds);
                                }
                                newFactoryProducedComponents[slot.targetComponentId] = (newFactoryProducedComponents[slot.targetComponentId] || 0) + (1 / componentRecipe.productionTimeSeconds); 
                            }
                        }
                    }
                    });
                });
            }
        }
        const newTotalIncomePerSecondDisplay = currentTotalBusinessIncome + currentDividendIncome;

        return { 
          ...prev, 
          money: newMoneyFromIncome, 
          totalIncomePerSecond: newTotalIncomePerSecondDisplay,
          investmentsValue: currentInvestmentsValue,
          factoryPowerConsumptionKw: newFactoryPowerConsumptionKw,
          factoryRawMaterials: newFactoryRawMaterials,
          factoryProducedComponents: newFactoryProducedComponents,
        };
      });
    }, GAME_TICK_INTERVAL);
    return () => clearInterval(gameTickIntervalId);
  }, [localCalculateIncome]);


  useEffect(() => {
    const stockUpdateIntervalId = setInterval(() => {
      setStocksWithDynamicPrices(prevStocks =>
        prevStocks.map(currentStock => {
          const initialStockData = INITIAL_STOCKS.find(is => is.id === currentStock.id);
          if (!initialStockData) return currentStock; 
          const basePrice = initialStockData.price; 
          const percentageChange = Math.random() * 0.8 - 0.3; 
          let newPrice = basePrice * (1 + percentageChange);
          newPrice = Math.max(1, Math.floor(newPrice)); 
          return { ...currentStock, price: newPrice };
        })
      );
    }, STOCK_PRICE_UPDATE_INTERVAL);
    return () => clearInterval(stockUpdateIntervalId);
  }, []); 

  const saveStateToLocalStorage = useCallback(() => {
    try {
      const currentTimestamp = Date.now();
      const saveData: SaveData = {
        playerStats: playerStatsRef.current, 
        businesses: businessesRef.current,
        lastSaved: currentTimestamp,
      };
      localStorage.setItem(SAVE_DATA_KEY, JSON.stringify(saveData));
      setLastSavedTimestamp(currentTimestamp);
    } catch (error) {
      console.error("Error saving game state:", error);
      toastRef.current({ title: "Save Error", description: "Could not save game data to local storage.", variant: "destructive"});
    }
  }, []);

  useEffect(() => {
    const autoSaveIntervalId = setInterval(() => {
      saveStateToLocalStorage();
    }, AUTO_SAVE_INTERVAL);
    return () => clearInterval(autoSaveIntervalId);
  }, [saveStateToLocalStorage]);

  useEffect(() => {
    try {
      const savedDataString = localStorage.getItem(SAVE_DATA_KEY);
      if (savedDataString) {
        const loadedData: SaveData = JSON.parse(savedDataString);
        const initialDefaults = getInitialPlayerStats();
        const mergedPlayerStats: PlayerStats = {
            ...initialDefaults, ...loadedData.playerStats,
            unlockedSkillIds: Array.isArray(loadedData.playerStats.unlockedSkillIds) ? loadedData.playerStats.unlockedSkillIds : initialDefaults.unlockedSkillIds,
            hqUpgradeLevels: typeof loadedData.playerStats.hqUpgradeLevels === 'object' && loadedData.playerStats.hqUpgradeLevels !== null ? loadedData.playerStats.hqUpgradeLevels : initialDefaults.hqUpgradeLevels,
            stockHoldings: Array.isArray(loadedData.playerStats.stockHoldings) ? loadedData.playerStats.stockHoldings : initialDefaults.stockHoldings,
            achievedBusinessMilestones: typeof loadedData.playerStats.achievedBusinessMilestones === 'object' && loadedData.playerStats.achievedBusinessMilestones !== null ? loadedData.playerStats.achievedBusinessMilestones : initialDefaults.achievedBusinessMilestones,
            factoryPurchased: typeof loadedData.playerStats.factoryPurchased === 'boolean' ? loadedData.playerStats.factoryPurchased : initialDefaults.factoryPurchased,
            factoryPowerUnitsGenerated: typeof loadedData.playerStats.factoryPowerUnitsGenerated === 'number' ? loadedData.playerStats.factoryPowerUnitsGenerated : initialDefaults.factoryPowerUnitsGenerated,
            factoryPowerConsumptionKw: typeof loadedData.playerStats.factoryPowerConsumptionKw === 'number' ? loadedData.playerStats.factoryPowerConsumptionKw : initialDefaults.factoryPowerConsumptionKw,
            factoryRawMaterials: typeof loadedData.playerStats.factoryRawMaterials === 'number' ? loadedData.playerStats.factoryRawMaterials : initialDefaults.factoryRawMaterials,
            factoryMachines: Array.isArray(loadedData.playerStats.factoryMachines) ? loadedData.playerStats.factoryMachines : initialDefaults.factoryMachines,
            factoryProductionLines: Array.isArray(loadedData.playerStats.factoryProductionLines) && loadedData.playerStats.factoryProductionLines.every(line => line.slots && Array.isArray(line.slots))
                ? (loadedData.playerStats.factoryProductionLines.length === 5 ? loadedData.playerStats.factoryProductionLines : initialDefaults.factoryProductionLines)
                : initialDefaults.factoryProductionLines,
            factoryPowerBuildings: Array.isArray(loadedData.playerStats.factoryPowerBuildings) ? loadedData.playerStats.factoryPowerBuildings : initialDefaults.factoryPowerBuildings,
            factoryProducedComponents: typeof loadedData.playerStats.factoryProducedComponents === 'object' && loadedData.playerStats.factoryProducedComponents !== null ? loadedData.playerStats.factoryProducedComponents : initialDefaults.factoryProducedComponents,
            factoryMaterialCollectors: Array.isArray(loadedData.playerStats.factoryMaterialCollectors) ? loadedData.playerStats.factoryMaterialCollectors : initialDefaults.factoryMaterialCollectors,
            researchPoints: typeof loadedData.playerStats.researchPoints === 'number' ? loadedData.playerStats.researchPoints : initialDefaults.researchPoints,
            unlockedResearchIds: Array.isArray(loadedData.playerStats.unlockedResearchIds) ? loadedData.playerStats.unlockedResearchIds : initialDefaults.unlockedResearchIds,
            lastManualResearchTimestamp: typeof loadedData.playerStats.lastManualResearchTimestamp === 'number' ? loadedData.playerStats.lastManualResearchTimestamp : initialDefaults.lastManualResearchTimestamp,
        };
        setPlayerStats(mergedPlayerStats);
        setBusinesses(() => INITIAL_BUSINESSES.map(initialBiz => {
            const savedBusinessState = loadedData.businesses.find(b => b.id === initialBiz.id);
            return {
                ...initialBiz, level: savedBusinessState ? savedBusinessState.level : 0,
                managerOwned: savedBusinessState ? savedBusinessState.managerOwned : false,
                upgrades: initialBiz.upgrades?.map(initialUpg => {
                  const savedUpgData = savedBusinessState?.upgrades?.find(su => su.id === initialUpg.id);
                  return { ...initialUpg, isPurchased: savedUpgData ? savedUpgData.isPurchased : false };
                }) || [],
                icon: initialBiz.icon, 
              };
          }));
        setLastSavedTimestamp(loadedData.lastSaved || Date.now());
        materialCollectionCooldownEndRef.current = mergedPlayerStats.lastManualResearchTimestamp ? mergedPlayerStats.lastManualResearchTimestamp + MATERIAL_COLLECTION_COOLDOWN_MS : 0; // Not quite, but for init
        manualResearchCooldownEndRef.current = mergedPlayerStats.lastManualResearchTimestamp ? mergedPlayerStats.lastManualResearchTimestamp + RESEARCH_MANUAL_COOLDOWN_MS : 0;
        setMaterialCollectionCooldownEnd(materialCollectionCooldownEndRef.current);
        setManualResearchCooldownEnd(manualResearchCooldownEndRef.current);

      } else { setPlayerStats(getInitialPlayerStats()); }
    } catch (error) {
      console.error("Error loading game state from local storage:", error);
      localStorage.removeItem(SAVE_DATA_KEY);
      toastRef.current({ title: "Load Error", description: "Could not load previous save. Starting a new game.", variant: "destructive"});
      setPlayerStats(getInitialPlayerStats());
    }
  }, []);

  useEffect(() => {
    const currentPlayerStats = playerStatsRef.current;
    const currentBusinesses = businessesRef.current;
    const currentSkillTree = skillTreeRef.current;
    const currentToast = toastRef.current;
  
    let purchasedInThisTick = false;
    let moneySpentThisTick = 0;
    let newAchievedBusinessMilestonesForAutoBuy = { ...currentPlayerStats.achievedBusinessMilestones };
  
    const updatedBusinessesForAutoBuy = currentBusinesses.map(business => {
      let businessChanged = false;
      const skillIdToCheck = `auto_buy_upgrades_${business.id}`;
  
      if (currentPlayerStats.unlockedSkillIds.includes(skillIdToCheck) && business.upgrades) {
        const updatedUpgrades = business.upgrades.map(upgrade => {
          if (!upgrade.isPurchased && business.level >= upgrade.requiredLevel) {
            let actualCost = upgrade.cost;
            let globalUpgradeCostReduction = 0;
            currentPlayerStats.unlockedSkillIds.forEach(sId => {
              const sk = currentSkillTree.find(s => s.id === sId);
              if (sk && sk.effects && sk.effects.globalBusinessUpgradeCostReductionPercent) {
                globalUpgradeCostReduction += sk.effects.globalBusinessUpgradeCostReductionPercent;
              }
            });
            if (globalUpgradeCostReduction > 0) {
              actualCost *= (1 - globalUpgradeCostReduction / 100);
              actualCost = Math.max(0, Math.floor(actualCost));
            }
  
            if ((currentPlayerStats.money - moneySpentThisTick) >= actualCost) {
              moneySpentThisTick += actualCost;
              purchasedInThisTick = true;
              businessChanged = true;
  
              const existingMilestonesForBusiness = newAchievedBusinessMilestonesForAutoBuy?.[business.id] || {};
              const existingPurchasedUpgrades = existingMilestonesForBusiness.purchasedUpgradeIds || [];
              let updatedPurchasedUpgradesForAuto = [...existingPurchasedUpgrades];
              if (!existingPurchasedUpgrades.includes(upgrade.id)) {
                updatedPurchasedUpgradesForAuto.push(upgrade.id);
                currentToast({ title: "Auto-Upgrade!", description: `${upgrade.name} for ${business.name}`, duration: 1500 });
              }
              newAchievedBusinessMilestonesForAutoBuy = {
                ...newAchievedBusinessMilestonesForAutoBuy,
                [business.id]: { ...existingMilestonesForBusiness, purchasedUpgradeIds: updatedPurchasedUpgradesForAuto, },
              };
              return { ...upgrade, isPurchased: true };
            }
          }
          return upgrade;
        });
  
        if (businessChanged) {
          return { ...business, upgrades: updatedUpgrades };
        }
      }
      return business;
    });
  
    if (purchasedInThisTick) {
      setBusinesses(updatedBusinessesForAutoBuy);
      setPlayerStats(prev => ({
        ...prev,
        money: prev.money - moneySpentThisTick,
        achievedBusinessMilestones: newAchievedBusinessMilestonesForAutoBuy,
      }));
    }
  }, [playerStats.money, playerStats.unlockedSkillIds, businesses]); // Auto-buy depends on money and skills
  
  const getBusinessIncome = useCallback((businessId: string): number => {
    const business = businessesRef.current.find(b => b.id === businessId);
    if (!business) return 0;
    return localCalculateIncome( business, playerStatsRef.current.unlockedSkillIds, skillTreeRef.current, playerStatsRef.current.hqUpgradeLevels, hqUpgradesRef.current, playerStatsRef.current.factoryProducedComponents, INITIAL_FACTORY_COMPONENTS_CONFIG );
  }, [localCalculateIncome]);

  const getBusinessUpgradeCost = useCallback((businessId: string): number => {
    const business = businessesRef.current.find(b => b.id === businessId);
    if (!business) return 0;
    const currentDynamicMaxLevel = getDynamicMaxBusinessLevel();
    if (business.level >= currentDynamicMaxLevel) return Infinity;
    return calculateSingleLevelUpgradeCost( business.level, business.baseCost, business.upgradeCostMultiplier, business.upgrades, playerStatsRef.current.unlockedSkillIds, skillTreeRef.current, business.id, playerStatsRef.current.hqUpgradeLevels, hqUpgradesRef.current );
  }, [getDynamicMaxBusinessLevel]);

  const calculateCostForNLevelsForDisplay = useCallback((businessId: string, levelsToBuy: number) => {
    const business = businessesRef.current.find(b => b.id === businessId);
    if (!business) return { totalCost: Infinity, levelsPurchasable: 0 };
    const dynamicMax = getDynamicMaxBusinessLevel();
    return calculateCostForNLevels(business, levelsToBuy, playerStatsRef.current.unlockedSkillIds, skillTreeRef.current, dynamicMax, playerStatsRef.current.hqUpgradeLevels, hqUpgradesRef.current);
  }, [getDynamicMaxBusinessLevel]);

  const calculateMaxAffordableLevelsForDisplay = useCallback((businessId: string) => {
    const business = businessesRef.current.find(b => b.id === businessId);
    if (!business) return { levelsToBuy: 0, totalCost: 0 };
    const dynamicMax = getDynamicMaxBusinessLevel();
    return calculateMaxAffordableLevels(business, playerStatsRef.current.money, playerStatsRef.current.unlockedSkillIds, skillTreeRef.current, dynamicMax, playerStatsRef.current.hqUpgradeLevels, hqUpgradesRef.current);
  }, [getDynamicMaxBusinessLevel]);

  const manualSaveGame = useCallback(() => {
    saveStateToLocalStorage();
    toastRef.current({ title: "Game Saved!", description: "Your progress has been saved."});
  }, [saveStateToLocalStorage]);

  const exportGameState = useCallback((): string => {
    const currentTimestamp = Date.now();
    const saveData: SaveData = { playerStats: playerStatsRef.current, businesses: businessesRef.current, lastSaved: currentTimestamp, };
    return JSON.stringify(saveData, null, 2);
  }, []);

  const importGameState = useCallback((jsonString: string): boolean => {
    try {
      const importedData: SaveData = JSON.parse(jsonString);
      if (!importedData.playerStats || !importedData.businesses) throw new Error("Invalid save data structure.");
      const initialDefaults = getInitialPlayerStats();
      const mergedPlayerStats: PlayerStats = {
        ...initialDefaults, ...importedData.playerStats,
        unlockedSkillIds: Array.isArray(importedData.playerStats.unlockedSkillIds) ? importedData.playerStats.unlockedSkillIds : initialDefaults.unlockedSkillIds,
        hqUpgradeLevels: typeof importedData.playerStats.hqUpgradeLevels === 'object' && importedData.playerStats.hqUpgradeLevels !== null ? importedData.playerStats.hqUpgradeLevels : initialDefaults.hqUpgradeLevels,
        stockHoldings: Array.isArray(importedData.playerStats.stockHoldings) ? importedData.playerStats.stockHoldings : initialDefaults.stockHoldings,
        achievedBusinessMilestones: typeof importedData.playerStats.achievedBusinessMilestones === 'object' && importedData.playerStats.achievedBusinessMilestones !== null ? importedData.playerStats.achievedBusinessMilestones : initialDefaults.achievedBusinessMilestones,
        factoryPurchased: typeof importedData.playerStats.factoryPurchased === 'boolean' ? importedData.playerStats.factoryPurchased : initialDefaults.factoryPurchased,
        factoryPowerUnitsGenerated: typeof importedData.playerStats.factoryPowerUnitsGenerated === 'number' ? importedData.playerStats.factoryPowerUnitsGenerated : initialDefaults.factoryPowerUnitsGenerated,
        factoryPowerConsumptionKw: typeof importedData.playerStats.factoryPowerConsumptionKw === 'number' ? importedData.playerStats.factoryPowerConsumptionKw : initialDefaults.factoryPowerConsumptionKw,
        factoryRawMaterials: typeof importedData.playerStats.factoryRawMaterials === 'number' ? importedData.playerStats.factoryRawMaterials : initialDefaults.factoryRawMaterials,
        factoryMachines: Array.isArray(importedData.playerStats.factoryMachines) ? importedData.playerStats.factoryMachines : initialDefaults.factoryMachines,
        factoryProductionLines: Array.isArray(importedData.playerStats.factoryProductionLines) && importedData.playerStats.factoryProductionLines.every(line => line.slots && Array.isArray(line.slots))
            ? (importedData.playerStats.factoryProductionLines.length === 5 ? importedData.playerStats.factoryProductionLines : initialDefaults.factoryProductionLines)
            : initialDefaults.factoryProductionLines,
        factoryPowerBuildings: Array.isArray(importedData.playerStats.factoryPowerBuildings) ? importedData.playerStats.factoryPowerBuildings : initialDefaults.factoryPowerBuildings,
        factoryProducedComponents: typeof importedData.playerStats.factoryProducedComponents === 'object' && importedData.playerStats.factoryProducedComponents !== null ? importedData.playerStats.factoryProducedComponents : initialDefaults.factoryProducedComponents,
        factoryMaterialCollectors: Array.isArray(importedData.playerStats.factoryMaterialCollectors) ? importedData.playerStats.factoryMaterialCollectors : initialDefaults.factoryMaterialCollectors,
        researchPoints: typeof importedData.playerStats.researchPoints === 'number' ? importedData.playerStats.researchPoints : initialDefaults.researchPoints,
        unlockedResearchIds: Array.isArray(importedData.playerStats.unlockedResearchIds) ? importedData.playerStats.unlockedResearchIds : initialDefaults.unlockedResearchIds,
        lastManualResearchTimestamp: typeof importedData.playerStats.lastManualResearchTimestamp === 'number' ? loadedData.playerStats.lastManualResearchTimestamp : initialDefaults.lastManualResearchTimestamp,
      };
      setPlayerStats(mergedPlayerStats);
      setBusinesses(INITIAL_BUSINESSES.map(initialBiz => {
        const savedBusiness = importedData.businesses.find(b => b.id === initialBiz.id);
        return {
          ...initialBiz, level: savedBusiness ? savedBusiness.level : 0,
          managerOwned: savedBusiness ? savedBusiness.managerOwned : false,
          upgrades: initialBiz.upgrades?.map(initialUpg => {
            const savedUpg = savedBusiness?.upgrades?.find(su => su.id === initialUpg.id);
            return { ...initialUpg, isPurchased: savedUpg ? savedUpg.isPurchased : false };
          }) || [],
          icon: initialBiz.icon,
        };
      }));
      setLastSavedTimestamp(importedData.lastSaved || Date.now());
      setStocksWithDynamicPrices(INITIAL_STOCKS.map(s => ({ ...s })));
      toastRef.current({ title: "Game Loaded Successfully!", description: "Your game state has been imported."});
      return true;
    } catch (error) {
      console.error("Error importing game state:", error);
      toastRef.current({ title: "Import Error", description: `Failed to import save data. ${error instanceof Error ? error.message : 'Unknown error.'}`, variant: "destructive"});
      return false;
    }
  }, []);

  const wipeGameData = useCallback(() => {
    setPlayerStats(getInitialPlayerStats());
    setBusinesses(INITIAL_BUSINESSES.map(biz => ({
      ...biz, level: 0, managerOwned: false,
      upgrades: biz.upgrades ? biz.upgrades.map(upg => ({ ...upg, isPurchased: false })) : [],
      icon: biz.icon,
    })));
    setStocksWithDynamicPrices(INITIAL_STOCKS.map(s => ({ ...s })));
    localStorage.removeItem(SAVE_DATA_KEY);
    setLastSavedTimestamp(null);
    materialCollectionCooldownEndRef.current = 0;
    manualResearchCooldownEndRef.current = 0;
    setMaterialCollectionCooldownEnd(0); 
    setManualResearchCooldownEnd(0);
    toastRef.current({ title: "Game Data Wiped", description: "All progress has been reset to default.", variant: "destructive"});
  }, []);

  const _attemptAutoAssignSingleMachine = useCallback((machineInstanceId: string, currentProductionLines: FactoryProductionLine[]): { updatedProductionLines: FactoryProductionLine[], assignedLineId: string | null, assignedSlotIndex: number | null } => {
    let assignedLineId: string | null = null;
    let assignedSlotIndex: number | null = null;
    const newProductionLines = [...currentProductionLines]; 
    for (let lineIndex = 0; lineIndex < newProductionLines.length; lineIndex++) {
        const line = newProductionLines[lineIndex];
        const emptySlotIndex = line.slots.findIndex(slot => slot.machineInstanceId === null);
        if (emptySlotIndex !== -1) {
            const newSlots = [...line.slots];
            newSlots[emptySlotIndex] = { ...newSlots[emptySlotIndex], machineInstanceId: machineInstanceId };
            assignedLineId = line.id;
            assignedSlotIndex = emptySlotIndex;
            newProductionLines[lineIndex] = { ...line, slots: newSlots };
            break; 
        }
    }
    return { updatedProductionLines: newProductionLines, assignedLineId, assignedSlotIndex };
  }, []);

  const _attemptAutoAssignWaitingMachines = useCallback(() => {
    setPlayerStats(prev => {
        let newMachines = [...prev.factoryMachines];
        let newProductionLines = [...prev.factoryProductionLines];
        let machineAssignedThisCall = false;
        let assignmentDetails: { machineConfigId: string, lineName: string, slotIndex: number} | undefined;

        for (let i = 0; i < newMachines.length; i++) {
            if (newMachines[i].assignedProductionLineId === null) { 
                const assignResult = _attemptAutoAssignSingleMachine(newMachines[i].instanceId, newProductionLines);
                if (assignResult.assignedLineId !== null && assignResult.assignedSlotIndex !== null) {
                    newMachines[i] = { ...newMachines[i], assignedProductionLineId: assignResult.assignedLineId };
                    newProductionLines = assignResult.updatedProductionLines;
                    const machineConfig = INITIAL_FACTORY_MACHINE_CONFIGS.find(mc => mc.id === newMachines[i].configId);
                    const line = newProductionLines.find(l => l.id === assignResult.assignedLineId);
                    assignmentDetails = { machineConfigId: machineConfig?.id || 'unknown', lineName: line?.name || 'a line', slotIndex: assignResult.assignedSlotIndex };
                    machineAssignedThisCall = true; 
                    break; 
                }
            }
        }
        if (machineAssignedThisCall && assignmentDetails) {
            const machineConfig = INITIAL_FACTORY_MACHINE_CONFIGS.find(mc => mc.id === assignmentDetails.machineConfigId);
            toastRef.current({ title: "Machine Auto-Assigned", description: `${machineConfig?.name || 'Machine'} placed in ${assignmentDetails.lineName}, Slot ${assignmentDetails.slotIndex + 1}.`, duration: 2000 });
            return { ...prev, factoryMachines: newMachines, factoryProductionLines: newProductionLines };
        }
        return prev; 
    });
  }, [_attemptAutoAssignSingleMachine]);
  
  const purchaseBusinessUpgrade = useCallback((businessId: string, upgradeId: string, isAutoBuy: boolean = false): boolean => {
    const playerStatsNow = playerStatsRef.current;
    const businessToUpdate = businessesRef.current.find(b => b.id === businessId);
    if (!businessToUpdate || !businessToUpdate.upgrades) { return false; }

    const businessIndexInConfig = INITIAL_BUSINESSES.findIndex(b => b.id === businessId);
    if (playerStatsNow.timesPrestiged < businessIndexInConfig && !isAutoBuy) {
      toastRef.current({ title: "Locked", description: `This business unlocks after ${businessIndexInConfig} prestige(s).`, variant: "destructive"});
      return false;
    }

    const upgrade = businessToUpdate.upgrades.find(u => u.id === upgradeId);
    if (!upgrade) { return false; }

    if (upgrade.isPurchased) {
      if (!isAutoBuy) toastRef.current({ title: "Already Owned", description: "You already own this upgrade.", variant: "default" });
      return false; 
    }
    if (businessToUpdate.level < upgrade.requiredLevel) {
      if (!isAutoBuy) toastRef.current({ title: "Level Requirement Not Met", description: `${businessToUpdate.name} must be level ${upgrade.requiredLevel} for this upgrade.`, variant: "destructive" });
      return false;
    }

    let actualCost = upgrade.cost;
    let globalUpgradeCostReduction = 0;
    playerStatsNow.unlockedSkillIds.forEach(skillId => {
        const skill = skillTreeRef.current.find(s => s.id === skillId);
        if (skill && skill.effects && skill.effects.globalBusinessUpgradeCostReductionPercent) { globalUpgradeCostReduction += skill.effects.globalBusinessUpgradeCostReductionPercent; }
    });
    if (globalUpgradeCostReduction > 0) {
        actualCost *= (1 - globalUpgradeCostReduction / 100);
        actualCost = Math.max(0, Math.floor(actualCost));
    }

    if (playerStatsNow.money < actualCost) {
      if (!isAutoBuy) toastRef.current({ title: "Not Enough Money", description: `You need $${Number(actualCost).toLocaleString('en-US', { maximumFractionDigits: 0 })} to purchase ${upgrade.name}.`, variant: "destructive" });
      return false;
    }

    setBusinesses(prevBusinesses => {
        const newBusinesses = prevBusinesses.map(b => b.id === businessId ? { ...b, upgrades: b.upgrades?.map(u => u.id === upgradeId ? { ...u, isPurchased: true } : u) } : b );
        businessesRef.current = newBusinesses; return newBusinesses;
    });
    setPlayerStats(prev => ({
      ...prev,
      money: prev.money - actualCost,
      achievedBusinessMilestones: {
        ...prev.achievedBusinessMilestones,
        [businessId]: {
          ...(prev.achievedBusinessMilestones?.[businessId] || {}),
          purchasedUpgradeIds: [...((prev.achievedBusinessMilestones?.[businessId]?.purchasedUpgradeIds || []).filter(id => id !== upgradeId)), upgradeId],
        },
      },
    }));
    
    if (!isAutoBuy) {
      toastRef.current({ title: "Upgrade Purchased!", description: `${upgrade.name} for ${businessToUpdate.name} is now active.` });
    } else {
      toastRef.current({ title: "Auto-Upgrade!", description: `${upgrade.name} for ${businessToUpdate.name}`, duration: 1500 });
    }
    return true;
  }, []);

  const upgradeBusiness = useCallback((businessId: string, levelsToAttempt: number = 1) => {
    const playerStatsNow = playerStatsRef.current;
    const businessToUpdate = businessesRef.current.find(b => b.id === businessId);

    if (!businessToUpdate) return;

    const businessIndexInConfig = INITIAL_BUSINESSES.findIndex(b => b.id === businessId);
    if (playerStatsNow.timesPrestiged < businessIndexInConfig) {
      toastRef.current({ title: "Locked", description: `This business unlocks after prestiging ${businessIndexInConfig} time(s). (Currently: ${playerStatsNow.timesPrestiged})`, variant: "destructive"});
      return;
    }

    const currentDynamicMaxLevel = getDynamicMaxBusinessLevel();
    if (businessToUpdate.level >= currentDynamicMaxLevel) {
      toastRef.current({ title: "Max Level Reached!", description: `${businessToUpdate.name} is already at the maximum level (${currentDynamicMaxLevel}).`, variant: "default" });
      return;
    }

    const { totalCost, levelsPurchasable } = calculateCostForNLevels( businessToUpdate, levelsToAttempt, playerStatsNow.unlockedSkillIds, skillTreeRef.current, currentDynamicMaxLevel, playerStatsNow.hqUpgradeLevels, hqUpgradesRef.current );
    
    if (levelsPurchasable === 0) {
      toastRef.current({ title: "Cannot level up", description: `${businessToUpdate.name} is at max level or no levels can be purchased.`, variant: "default" });
      return;
    }
    if (playerStatsNow.money < totalCost) {
      toastRef.current({ title: "Not enough money!", description: `You need $${Number(totalCost).toLocaleString('en-US', { maximumFractionDigits: 0 })} to level up ${businessToUpdate.name} by ${levelsPurchasable} level(s).`, variant: "destructive" });
      return;
    }

    const newLevelAfterUpgrade = businessToUpdate.level + levelsPurchasable;
    let newAchievedMilestones = { ...(playerStatsNow.achievedBusinessMilestones || {}) };
    if (newLevelAfterUpgrade >= currentDynamicMaxLevel && !(newAchievedMilestones[businessId]?.maxLevelReached)) {
        newAchievedMilestones[businessId] = { ...(newAchievedMilestones[businessId] || {}), maxLevelReached: true, };
    }
    
    setBusinesses(prevBusinesses => {
        const newBusinesses = prevBusinesses.map(b => b.id === businessId ? { ...b, level: newLevelAfterUpgrade } : b );
        businessesRef.current = newBusinesses; return newBusinesses;
    });
    setPlayerStats(prev => ({ ...prev, money: prev.money - totalCost, achievedBusinessMilestones: newAchievedMilestones, }));
    
    toastRef.current({ title: "Business Leveled Up!", description: `${businessToUpdate.name} is now level ${newLevelAfterUpgrade} (+${levelsPurchasable}).` });
  }, [getDynamicMaxBusinessLevel]);

  const buyStock = useCallback((stockId: string, sharesToBuyInput: number) => {
    const playerStatsNow = playerStatsRef.current;
    if (playerStatsNow.timesPrestiged < 8) {
      toastRef.current({ title: "Stocks Locked", description: "You need to prestige at least 8 times to access the stock market.", variant: "destructive" });
      return;
    }
    if (sharesToBuyInput <= 0) {
      toastRef.current({ title: "Invalid Amount", description: "Number of shares must be positive.", variant: "destructive" });
      return;
    }

    const stock = unlockedStocksRef.current.find(s => s.id === stockId); 
    if (!stock) {
      toastRef.current({ title: "Stock Not Found", description: "This stock is not available or does not exist.", variant: "destructive" });
      return;
    }

    const initialStockData = INITIAL_STOCKS.find(is => is.id === stockId);
    if (!initialStockData) return; 

    const existingHolding = playerStatsNow.stockHoldings.find(h => h.stockId === stockId);
    const sharesAlreadyOwnedByPlayer = existingHolding?.shares || 0;
    const sharesAvailableToBuy = initialStockData.totalOutstandingShares - sharesAlreadyOwnedByPlayer;

    if (sharesAvailableToBuy <= 0) {
      toastRef.current({ title: "No Shares Available", description: `All outstanding shares of ${stock.companyName} (${stock.ticker}) are accounted for.`, variant: "default" });
      return;
    }

    let sharesToBuy = sharesToBuyInput;
    if (sharesToBuyInput > sharesAvailableToBuy) {
      toastRef.current({ title: "Purchase Adjusted", description: `Only ${sharesAvailableToBuy.toLocaleString('en-US')} shares available. Purchase adjusted.`, variant: "default" });
      sharesToBuy = sharesAvailableToBuy;
    }

    if (sharesToBuy <= 0) {
      toastRef.current({ title: "No Shares to Buy", description: `No shares of ${stock.companyName} (${stock.ticker}) could be purchased.`, variant: "destructive" });
      return;
    }

    const cost = stock.price * sharesToBuy; 
    if (playerStatsNow.money < cost) {
      toastRef.current({ title: "Not Enough Money", description: `You need $${Number(cost).toLocaleString('en-US', { maximumFractionDigits: 0 })} to buy ${sharesToBuy.toLocaleString('en-US')} share(s).`, variant: "destructive" });
      return;
    }

    setPlayerStats(prev => ({
      ...prev,
      money: prev.money - cost,
      stockHoldings: prev.stockHoldings.find(h => h.stockId === stockId)
        ? prev.stockHoldings.map(h => h.stockId === stockId ? { ...h, shares: h.shares + sharesToBuy, averagePurchasePrice: ((h.averagePurchasePrice * h.shares) + (stock.price * sharesToBuy)) / (h.shares + sharesToBuy) } : h)
        : [...prev.stockHoldings, { stockId, shares: sharesToBuy, averagePurchasePrice: stock.price }]
    }));
    toastRef.current({ title: "Stock Purchased!", description: `Bought ${sharesToBuy.toLocaleString('en-US')} share(s) of ${stock.companyName}.` });
  }, []);

  const sellStock = useCallback((stockId: string, sharesToSell: number) => {
    const playerStatsNow = playerStatsRef.current;
    if (playerStatsNow.timesPrestiged < 8) {
      toastRef.current({ title: "Stocks Locked", description: "You need to prestige at least 8 times to access the stock market.", variant: "destructive" });
      return;
    }
    if (sharesToSell <= 0) {
      toastRef.current({ title: "Invalid Amount", description: "Number of shares must be positive.", variant: "destructive" });
      return;
    }

    const stock = unlockedStocksRef.current.find(s => s.id === stockId); 
    if (!stock) {
      toastRef.current({ title: "Stock Not Found", variant: "destructive" });
      return;
    }

    const existingHolding = playerStatsNow.stockHoldings.find(h => h.stockId === stockId);
    if (!existingHolding || existingHolding.shares < sharesToSell) {
      toastRef.current({ title: "Not Enough Shares", description: `You only own ${existingHolding?.shares || 0} share(s).`, variant: "destructive" });
      return;
    }

    const earnings = stock.price * sharesToSell; 
    setPlayerStats(prev => ({
      ...prev,
      money: prev.money + earnings,
      stockHoldings: existingHolding.shares === sharesToSell
        ? prev.stockHoldings.filter(h => h.stockId !== stockId)
        : prev.stockHoldings.map(h => h.stockId === stockId ? { ...h, shares: h.shares - sharesToSell } : h)
    }));
    toastRef.current({ title: "Stock Sold!", description: `Sold ${sharesToSell.toLocaleString('en-US')} share(s) of ${stock.companyName}.` });
  }, []);

  const unlockSkillNode = useCallback((skillId: string) => {
    const playerStatsNow = playerStatsRef.current;
    const skill = skillTreeRef.current.find(s => s.id === skillId);
    if (!skill) {
      toastRef.current({ title: "Skill Not Found", variant: "destructive" });
      return;
    }
    if (playerStatsNow.unlockedSkillIds.includes(skillId)) {
      toastRef.current({ title: "Skill Already Unlocked", variant: "default" });
      return;
    }
    if (playerStatsNow.prestigePoints < skill.cost) {
      toastRef.current({ title: "Not Enough Prestige Points", description: `Need ${skill.cost} PP. You have ${playerStatsNow.prestigePoints}.`, variant: "destructive" });
      return;
    }
    if (skill.dependencies && skill.dependencies.some(depId => !playerStatsNow.unlockedSkillIds.includes(depId))) {
      toastRef.current({ title: "Dependencies Not Met", description: "Unlock prerequisite skills first.", variant: "destructive" });
      return;
    }
    
    setPlayerStats(prev => ({
      ...prev,
      prestigePoints: prev.prestigePoints - skill.cost,
      unlockedSkillIds: [...prev.unlockedSkillIds, skillId],
    }));
    toastRef.current({ title: "Skill Unlocked!", description: `${skill.name} is now active.` });
  }, []);

  const purchaseHQUpgrade = useCallback((upgradeId: string) => {
    const playerStatsNow = playerStatsRef.current;
    const upgradeConfig = hqUpgradesRef.current.find(u => u.id === upgradeId);
    if (!upgradeConfig) {
      toastRef.current({ title: "HQ Upgrade Not Found", variant: "destructive" });
      return;
    }

    const currentLevel = playerStatsNow.hqUpgradeLevels[upgradeId] || 0;
    const nextLevel = currentLevel + 1;
    const nextLevelData = upgradeConfig.levels.find(l => l.level === nextLevel);

    if (!nextLevelData) {
      toastRef.current({ title: "Max Level Reached", description: `${upgradeConfig.name} is already at its maximum level.`, variant: "default" });
      return;
    }
    if (upgradeConfig.requiredTimesPrestiged && playerStatsNow.timesPrestiged < upgradeConfig.requiredTimesPrestiged) {
      toastRef.current({ title: "Prestige Requirement Not Met", description: `This HQ upgrade requires ${upgradeConfig.requiredTimesPrestiged} prestige(s).`, variant: "destructive"});
      return;
    }
    if (playerStatsNow.money < nextLevelData.costMoney) {
      toastRef.current({ title: "Not Enough Money", description: `Need $${Number(nextLevelData.costMoney).toLocaleString('en-US', { maximumFractionDigits: 0 })}.`, variant: "destructive"});
      return;
    }
    if (nextLevelData.costPrestigePoints && playerStatsNow.prestigePoints < nextLevelData.costPrestigePoints) {
      toastRef.current({ title: "Not Enough Prestige Points", description: `Need ${nextLevelData.costPrestigePoints} PP.`, variant: "destructive"});
      return;
    }

    setPlayerStats(prev => ({
      ...prev,
      money: prev.money - nextLevelData.costMoney,
      prestigePoints: nextLevelData.costPrestigePoints ? prev.prestigePoints - nextLevelData.costPrestigePoints : prev.prestigePoints,
      hqUpgradeLevels: { ...prev.hqUpgradeLevels, [upgradeId]: nextLevel },
    }));
    toastRef.current({ title: "HQ Upgrade Purchased!", description: `${upgradeConfig.name} upgraded to Level ${nextLevel}.` });
  }, []);
  
  const purchaseFactoryBuilding = useCallback(() => {
    const playerStatsNow = playerStatsRef.current;
    if (playerStatsNow.factoryPurchased) {
      toastRef.current({ title: "Factory Already Owned", description: "You have already purchased the factory building.", variant: "default" });
      return;
    }
    if (playerStatsNow.money < FACTORY_PURCHASE_COST) {
      toastRef.current({ title: "Not Enough Money", description: `You need $${FACTORY_PURCHASE_COST.toLocaleString()} to purchase the factory.`, variant: "destructive" });
      return;
    }
    setPlayerStats(prev => ({ ...prev, money: prev.money - FACTORY_PURCHASE_COST, factoryPurchased: true, }));
    toastRef.current({ title: "Factory Purchased!", description: "You can now start building your industrial empire!" });
  }, []);

  const purchaseFactoryPowerBuilding = useCallback((configId: string) => {
    const config = INITIAL_FACTORY_POWER_BUILDINGS_CONFIG.find(c => c.id === configId);
    if (!config) {
      toastRef.current({ title: "Power Building Not Found", variant: "destructive"});
      return;
    }

    const playerStatsNow = playerStatsRef.current;
    if (!playerStatsNow.factoryPurchased) {
      toastRef.current({ title: "Factory Not Owned", description: "Purchase the factory building first.", variant: "destructive" });
      return;
    }

    const numOwned = playerStatsNow.factoryPowerBuildings.filter(pb => pb.configId === configId).length;
    if (config.maxInstances !== undefined && numOwned >= config.maxInstances) {
      toastRef.current({ title: "Max Instances Reached", description: `You already own the maximum of ${config.maxInstances} ${config.name}(s).`, variant: "default"});
      return;
    }

    const costForNext = config.baseCost * Math.pow(config.costMultiplier || 1.1, numOwned);
    if (playerStatsNow.money < costForNext) {
      toastRef.current({ title: "Not Enough Money", description: `Need $${costForNext.toLocaleString()} for the next ${config.name}.`, variant: "destructive"});
      return;
    }
    
    setPlayerStats(prev => {
      const newBuilding: FactoryPowerBuilding = { instanceId: `${configId}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`, configId: config.id, level: 1, currentOutputKw: config.powerOutputKw, };
      const updatedPowerBuildings = [...prev.factoryPowerBuildings, newBuilding];
      const newTotalPower = updatedPowerBuildings.reduce((sum, pb) => sum + pb.currentOutputKw, 0);
      return { ...prev, money: prev.money - costForNext, factoryPowerBuildings: updatedPowerBuildings, factoryPowerUnitsGenerated: newTotalPower, };
    });
    toastRef.current({ title: "Power Building Purchased!", description: `Built a new ${config.name}.` });
  }, []);

  const manuallyCollectRawMaterials = useCallback(() => {
    const now = Date.now();
    if (now < materialCollectionCooldownEndRef.current) {
        const timeLeft = Math.ceil((materialCollectionCooldownEndRef.current - now) / 1000);
        toastRef.current({ title: "On Cooldown", description: `Please wait ${timeLeft}s before collecting again.`, variant: "default"});
        return;
    }

    const playerStatsNow = playerStatsRef.current;
    if (!playerStatsNow.factoryPurchased) {
     toastRef.current({ title: "Factory Not Owned", description: "Purchase the factory building first.", variant: "destructive" });
     return;
    }

    materialCollectionCooldownEndRef.current = now + MATERIAL_COLLECTION_COOLDOWN_MS;
    setMaterialCollectionCooldownEnd(materialCollectionCooldownEndRef.current);
    setPlayerStats(prev => ({ ...prev, factoryRawMaterials: prev.factoryRawMaterials + MATERIAL_COLLECTION_AMOUNT }));
    toastRef.current({ title: "Materials Collected!", description: `+${MATERIAL_COLLECTION_AMOUNT} Raw Materials added.` });
  }, []);

  const purchaseFactoryMachine = useCallback((configId: string) => {
    const machineConfig = INITIAL_FACTORY_MACHINE_CONFIGS.find(mc => mc.id === configId);
    if (!machineConfig) { 
      toastRef.current({ title: "Machine Type Not Found", variant: "destructive"}); 
      return; 
    }

    const playerStatsNow = playerStatsRef.current;
    if (!playerStatsNow.factoryPurchased) { 
      toastRef.current({ title: "Factory Not Owned", description: "Purchase the factory building first.", variant: "destructive" }); 
      return; 
    }
    if (machineConfig.requiredResearchId && !playerStatsNow.unlockedResearchIds.includes(machineConfig.requiredResearchId)) {
      const researchItem = researchItemsRef.current.find(r => r.id === machineConfig.requiredResearchId);
      toastRef.current({ title: "Research Required", description: `Purchase of ${machineConfig.name} requires '${researchItem?.name || machineConfig.requiredResearchId}' research.`, variant: "destructive"});
      return;
    }
    
    const cost = machineConfig.baseCost; 
    if (playerStatsNow.money < cost) { 
      toastRef.current({ title: "Not Enough Money", description: `Need $${cost.toLocaleString()} to build a ${machineConfig.name}.`, variant: "destructive"}); 
      return; 
    }

    let assignmentMessage = "";
    let finalProductionLines: FactoryProductionLine[] = [];
    let machineAssignedSuccessfully = false;

    setPlayerStats(prev => {
      const newMachineInstanceId = `${configId}_machine_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newMachine: FactoryMachine = { instanceId: newMachineInstanceId, configId: machineConfig.id, assignedProductionLineId: null, };
      let updatedMachines = [...prev.factoryMachines, newMachine];
      let updatedProductionLinesForThisUpdate = [...prev.factoryProductionLines];
      
      const assignResult = _attemptAutoAssignSingleMachine(newMachineInstanceId, updatedProductionLinesForThisUpdate);
      if (assignResult.assignedLineId !== null && assignResult.assignedSlotIndex !== null) {
          updatedMachines = updatedMachines.map(m => m.instanceId === newMachineInstanceId ? { ...m, assignedProductionLineId: assignResult.assignedLineId } : m);
          updatedProductionLinesForThisUpdate = assignResult.updatedProductionLines;
          const line = updatedProductionLinesForThisUpdate.find(l => l.id === assignResult.assignedLineId);
          assignmentMessage = ` and auto-assigned to ${line?.name || 'a line'}, Slot ${assignResult.assignedSlotIndex + 1}.`;
          machineAssignedSuccessfully = true;
      } else {
          assignmentMessage = ". Production lines are full.";
      }
      finalProductionLines = updatedProductionLinesForThisUpdate;
      return { ...prev, money: prev.money - cost, factoryMachines: updatedMachines, factoryProductionLines: updatedProductionLinesForThisUpdate, };
    });
    toastRef.current({ title: "Machine Built!", description: `A new ${machineConfig.name} is ready${assignmentMessage}` });
  }, [_attemptAutoAssignSingleMachine]);

  const unassignMachineFromProductionLine = useCallback((productionLineId: string, slotIndex: number) => {
    setPlayerStats(prev => {
        const targetProductionLineIndex = prev.factoryProductionLines.findIndex(pl => pl.id === productionLineId);
        if (targetProductionLineIndex === -1) return prev;
        const targetProductionLine = prev.factoryProductionLines[targetProductionLineIndex];
        if (slotIndex < 0 || slotIndex >= targetProductionLine.slots.length) return prev;
        const machineInstanceIdToUnassign = targetProductionLine.slots[slotIndex].machineInstanceId;
        if (!machineInstanceIdToUnassign) return prev;
        const machineToUpdateIndex = prev.factoryMachines.findIndex(m => m.instanceId === machineInstanceIdToUnassign);
        if (machineToUpdateIndex === -1) return prev; 
        const newFactoryMachines = [...prev.factoryMachines];
        newFactoryMachines[machineToUpdateIndex] = { ...newFactoryMachines[machineToUpdateIndex], assignedProductionLineId: null };
        const newFactoryProductionLines = [...prev.factoryProductionLines];
        const newSlots = [...newFactoryProductionLines[targetProductionLineIndex].slots];
        newSlots[slotIndex] = { machineInstanceId: null, targetComponentId: null }; 
        newFactoryProductionLines[targetProductionLineIndex] = { ...newFactoryProductionLines[targetProductionLineIndex], slots: newSlots };
        return { ...prev, factoryMachines: newFactoryMachines, factoryProductionLines: newFactoryProductionLines, };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setTimeout(() => _attemptAutoAssignWaitingMachines(), 0);
  }, [_attemptAutoAssignWaitingMachines]); 

  const setRecipeForProductionSlot = useCallback((productionLineId: string, slotIndex: number, targetComponentId: string | null) => {
    const playerStatsNow = playerStatsRef.current;
    const lineIndex = playerStatsNow.factoryProductionLines.findIndex(line => line.id === productionLineId);
    if (lineIndex === -1) { 
      toastRef.current({ title: "Error", description: "Production line not found.", variant: "destructive" }); 
      return; 
    }
    const productionLine = playerStatsNow.factoryProductionLines[lineIndex];
    if (slotIndex < 0 || slotIndex >= productionLine.slots.length) { 
      toastRef.current({ title: "Error", description: "Invalid slot index.", variant: "destructive" }); 
      return; 
    }
    const slot = productionLine.slots[slotIndex];
    if (!slot.machineInstanceId) { 
      toastRef.current({ title: "No Machine", description: "No machine assigned to this slot to set a recipe for.", variant: "destructive" }); 
      return; 
    }
    const machineInstance = playerStatsNow.factoryMachines.find(m => m.instanceId === slot.machineInstanceId);
    if (!machineInstance) { 
      toastRef.current({ title: "Error", description: "Assigned machine data not found.", variant: "destructive" }); 
      return; 
    }
    const machineConfig = INITIAL_FACTORY_MACHINE_CONFIGS.find(mc => mc.id === machineInstance.configId);
    if (!machineConfig) { 
      toastRef.current({ title: "Error", description: "Machine configuration not found.", variant: "destructive" }); 
      return; 
    }
    
    if (targetComponentId !== null) {
      const componentRecipe = INITIAL_FACTORY_COMPONENTS_CONFIG.find(cc => cc.id === targetComponentId);
      if (!componentRecipe) { 
        toastRef.current({ title: "Error", description: "Target component recipe not found.", variant: "destructive" }); 
        return; 
      }
      if (machineConfig.maxCraftableTier < componentRecipe.tier) {
        toastRef.current({ title: "Cannot Craft", description: `${machineConfig.name} (Tier ${machineConfig.maxCraftableTier}) cannot craft ${componentRecipe.name} (Tier ${componentRecipe.tier}).`, variant: "destructive" }); 
        return; 
      }
    }
    
    setPlayerStats(prev => {
      const updatedProductionLines = prev.factoryProductionLines.map((line, idx) => {
        if (idx === lineIndex) {
          const updatedSlots = [...line.slots];
          updatedSlots[slotIndex] = { ...updatedSlots[slotIndex], targetComponentId: targetComponentId };
          return { ...line, slots: updatedSlots };
        }
        return line;
      });
      return { ...prev, factoryProductionLines: updatedProductionLines };
    });

    if (targetComponentId) {
      const component = INITIAL_FACTORY_COMPONENTS_CONFIG.find(c => c.id === targetComponentId);
      toastRef.current({ title: "Recipe Set!", description: `${machineConfig.name} in ${productionLine.name} (Slot ${slotIndex + 1}) will now produce ${component?.name || 'component'}.` });
    } else {
      toastRef.current({ title: "Recipe Cleared", description: `${machineConfig.name} in ${productionLine.name} (Slot ${slotIndex + 1}) is now idle.` });
    }
  }, []);

  const purchaseFactoryMaterialCollector = useCallback((configId: string) => {
    const config = INITIAL_FACTORY_MATERIAL_COLLECTORS_CONFIG.find(c => c.id === configId);
    if (!config) { 
      toastRef.current({ title: "Material Collector Not Found", variant: "destructive"}); 
      return; 
    }

    const playerStatsNow = playerStatsRef.current;
    if (!playerStatsNow.factoryPurchased) { 
      toastRef.current({ title: "Factory Not Owned", description: "Purchase the factory building first.", variant: "destructive" }); 
      return; 
    }
    
    const numOwned = (playerStatsNow.factoryMaterialCollectors || []).filter(mc => mc.configId === configId).length;
    if (config.maxInstances !== undefined && numOwned >= config.maxInstances) {
      toastRef.current({ title: "Max Instances Reached", description: `You already own the maximum of ${config.maxInstances} ${config.name}(s).`, variant: "default"}); 
      return;
    }
    
    const costForNext = config.baseCost * Math.pow(config.costMultiplier || 1.15, numOwned);
    if (playerStatsNow.money < costForNext) { 
      toastRef.current({ title: "Not Enough Money", description: `Need $${costForNext.toLocaleString()} for the next ${config.name}.`, variant: "destructive"}); 
      return; 
    }
    
    setPlayerStats(prev => {
      const newCollector: FactoryMaterialCollector = { instanceId: `${configId}_collector_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`, configId: config.id, currentMaterialsPerSecond: config.materialsPerSecond, };
      const updatedCollectors = [...(prev.factoryMaterialCollectors || []), newCollector];
      return { ...prev, money: prev.money - costForNext, factoryMaterialCollectors: updatedCollectors, };
    });
    toastRef.current({ title: "Material Collector Deployed!", description: `A new ${config.name} is now active.` });
  }, []);

  const manuallyGenerateResearchPoints = useCallback(() => {
    const now = Date.now();
    if (now < manualResearchCooldownEndRef.current) {
        const timeLeft = Math.ceil((manualResearchCooldownEndRef.current - now) / 1000);
        toastRef.current({ title: "On Cooldown", description: `Please wait ${timeLeft}s before conducting research again.`, variant: "default"});
        return;
    }

    const playerStatsNow = playerStatsRef.current;
    if (!playerStatsNow.factoryPurchased) { 
      toastRef.current({ title: "Factory Not Owned", description: "Purchase the factory building first.", variant: "destructive" }); 
      return; 
    }
    if (playerStatsNow.timesPrestiged < REQUIRED_PRESTIGE_LEVEL_FOR_RESEARCH_TAB) {
      toastRef.current({ title: "Research Locked", description: `Research tab unlocks at Prestige Level ${REQUIRED_PRESTIGE_LEVEL_FOR_RESEARCH_TAB}.`, variant: "destructive" });
      return;
    }
    if (playerStatsNow.money < RESEARCH_MANUAL_GENERATION_COST_MONEY) {
      toastRef.current({ title: "Not Enough Money", description: `Need $${RESEARCH_MANUAL_GENERATION_COST_MONEY.toLocaleString()} to conduct research.`, variant: "destructive"});
      return;
    }
    
    manualResearchCooldownEndRef.current = now + RESEARCH_MANUAL_COOLDOWN_MS;
    setManualResearchCooldownEnd(manualResearchCooldownEndRef.current);
    setPlayerStats(prev => ({
      ...prev,
      money: prev.money - RESEARCH_MANUAL_GENERATION_COST_MONEY,
      researchPoints: prev.researchPoints + RESEARCH_MANUAL_GENERATION_AMOUNT,
      lastManualResearchTimestamp: now,
    }));
    toastRef.current({ title: "Research Conducted!", description: `+${RESEARCH_MANUAL_GENERATION_AMOUNT} Research Point(s) gained.` });
  }, []);

  const purchaseResearch = useCallback((researchId: string) => {
    const researchConfig = researchItemsRef.current.find(r => r.id === researchId);
    if (!researchConfig) { 
      toastRef.current({ title: "Research Not Found", variant: "destructive" }); 
      return; 
    }

    const playerStatsNow = playerStatsRef.current;
    if (!playerStatsNow.factoryPurchased) { 
      toastRef.current({ title: "Factory Not Owned", description: "Purchase the factory building first.", variant: "destructive" }); 
      return; 
    }
    if (playerStatsNow.timesPrestiged < REQUIRED_PRESTIGE_LEVEL_FOR_RESEARCH_TAB) {
      toastRef.current({ title: "Research Locked", description: `Research tab unlocks at Prestige Level ${REQUIRED_PRESTIGE_LEVEL_FOR_RESEARCH_TAB}.`, variant: "destructive" });
      return;
    }
    if (playerStatsNow.unlockedResearchIds.includes(researchId)) { 
      toastRef.current({ title: "Research Already Unlocked", variant: "default" }); 
      return; 
    }
    if (researchConfig.dependencies && researchConfig.dependencies.some(depId => !playerStatsNow.unlockedResearchIds.includes(depId))) {
      toastRef.current({ title: "Dependencies Not Met", description: "Unlock prerequisite research first.", variant: "destructive" });
      return;
    }
    if (playerStatsNow.researchPoints < researchConfig.costRP) { 
      toastRef.current({ title: "Not Enough Research Points", description: `Need ${researchConfig.costRP} RP.`, variant: "destructive" }); 
      return; 
    }
    if (researchConfig.costMoney && playerStatsNow.money < researchConfig.costMoney) {
      toastRef.current({ title: "Not Enough Money", description: `Need $${researchConfig.costMoney.toLocaleString()}.`, variant: "destructive" });
      return;
    }
    
    setPlayerStats(prev => ({
      ...prev,
      researchPoints: prev.researchPoints - researchConfig.costRP,
      money: researchConfig.costMoney ? prev.money - researchConfig.costMoney : prev.money,
      unlockedResearchIds: [...prev.unlockedResearchIds, researchId],
    }));
    toastRef.current({ title: "Research Complete!", description: `${researchConfig.name} unlocked.` });
  }, []);

  const performPrestige = useCallback(() => {
    const playerStatsNow = playerStatsRef.current;
    const moneyRequiredForFirstPrestige = 100000;
    if (playerStatsNow.money < moneyRequiredForFirstPrestige && playerStatsNow.timesPrestiged === 0) {
      toastRef.current({ title: "Not Enough Money", description: `Need $${Number(moneyRequiredForFirstPrestige).toLocaleString('en-US', { maximumFractionDigits: 0 })} to prestige for the first time.`, variant: "destructive" });
      return;
    }

    const totalLevels = businessesRef.current.reduce((sum, b) => sum + b.level, 0);
    let basePointsFromLevels = calculateDiminishingPrestigePoints(totalLevels);
    const prestigePointBoost = getPrestigePointBoostPercent(playerStatsNow.unlockedSkillIds, skillTreeRef.current, playerStatsNow.hqUpgradeLevels, hqUpgradesRef.current);
    const actualNewPrestigePoints = Math.floor(Math.max(0, basePointsFromLevels - playerStatsNow.prestigePoints) * (1 + prestigePointBoost / 100));
    const startingMoneyBonus = getStartingMoneyBonus(playerStatsNow.unlockedSkillIds, skillTreeRef.current, playerStatsNow.hqUpgradeLevels, hqUpgradesRef.current);
    const moneyAfterPrestige = INITIAL_MONEY + startingMoneyBonus;

    const retainedBusinessLevels: Record<string, number> = {};
    const retainedStockHoldings: StockHolding[] = [];
    const { 
        factoryPurchased, researchPoints, unlockedResearchIds, factoryRawMaterials, 
        factoryMachines, factoryProducedComponents, factoryPowerBuildings, factoryMaterialCollectors,
    } = playerStatsNow;
    const retainedFactoryPowerUnitsGenerated = factoryPowerBuildings.reduce((sum, pb) => sum + pb.currentOutputKw, 0);

    for (const hqUpgradeId in playerStatsNow.hqUpgradeLevels) {
        const purchasedLevel = playerStatsNow.hqUpgradeLevels[hqUpgradeId];
        if (purchasedLevel > 0) {
            const hqUpgradeConfig = hqUpgradesRef.current.find(hq => h.id === hqUpgradeId);
            if (hqUpgradeConfig && hqUpgradeConfig.levels) {
                const levelData = hqUpgradeConfig.levels.find(l => l.level === purchasedLevel);
                if (levelData && levelData.effects.retentionPercentage) {
                    const retentionPercentage = levelData.effects.retentionPercentage;
                    if (hqUpgradeId.startsWith('retain_level_')) {
                        const businessId = hqUpgradeId.replace('retain_level_', '');
                        const business = businessesRef.current.find(b => b.id === businessId);
                        if (business) { retainedBusinessLevels[businessId] = Math.floor(business.level * (retentionPercentage / 100)); }
                    } else if (hqUpgradeId.startsWith('retain_shares_')) {
                        const stockId = hqUpgradeId.replace('retain_shares_', '');
                        const currentHolding = playerStatsNow.stockHoldings.find(h => h.stockId === stockId);
                        if (currentHolding) {
                            const retainedShares = Math.floor(currentHolding.shares * (retentionPercentage / 100));
                            if (retainedShares > 0) { retainedStockHoldings.push({ stockId, shares: retainedShares, averagePurchasePrice: currentHolding.averagePurchasePrice }); }
                        }
                    }
                }
            }
        }
    }
    
    const initialProdLines = Array.from({ length: 5 }, (_, i) => ({ id: `line_${i + 1}`, name: `Production Line ${i + 1}`, slots: Array.from({ length: 6 }, () => ({ machineInstanceId: null, targetComponentId: null })), }));
    const newBusinessesState = INITIAL_BUSINESSES.map(biz => ({ ...biz, level: retainedBusinessLevels[biz.id] || 0, managerOwned: false, upgrades: biz.upgrades ? biz.upgrades.map(upg => ({ ...upg, isPurchased: false })) : [], icon: biz.icon, }));
    setBusinesses(newBusinessesState);
    setStocksWithDynamicPrices(INITIAL_STOCKS.map(s => ({ ...s })));
    
    setPlayerStats(prev => ({
        ...getInitialPlayerStats(), 
        money: moneyAfterPrestige,
        prestigePoints: prev.prestigePoints + actualNewPrestigePoints, 
        timesPrestiged: prev.timesPrestiged + 1,
        unlockedSkillIds: prev.unlockedSkillIds, 
        hqUpgradeLevels: prev.hqUpgradeLevels, 
        stockHoldings: retainedStockHoldings, 
        factoryPurchased, 
        factoryPowerUnitsGenerated: retainedFactoryPowerUnitsGenerated, 
        factoryPowerConsumptionKw: 0, 
        factoryRawMaterials, 
        factoryMachines: factoryMachines.map(fm => ({ ...fm, assignedProductionLineId: null })), 
        factoryProductionLines: initialProdLines, 
        factoryPowerBuildings, 
        factoryProducedComponents, 
        factoryMaterialCollectors,
        researchPoints: 0, // Reset research points
        unlockedResearchIds: [], // Reset unlocked research
        lastManualResearchTimestamp: 0, 
    }));
    
    toastRef.current({ title: "Prestige Successful!", description: `Earned ${actualNewPrestigePoints} prestige point(s)! Progress partially reset. Starting money now $${Number(moneyAfterPrestige).toLocaleString('en-US', { maximumFractionDigits: 0 })}.` });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setTimeout(() => _attemptAutoAssignWaitingMachines(), 0);
  }, []);

  const setLastMarketTrends = useCallback((trends: string) => { setLastMarketTrendsInternal(trends); }, []);
  const setLastRiskTolerance = useCallback((tolerance: "low" | "medium" | "high") => { setLastRiskToleranceInternal(tolerance); }, []);

  return (
    <GameContext.Provider value={{
      playerStats, businesses, stocks: unlockedStocks, skillTree: skillTreeState, hqUpgrades: hqUpgradesState, researchItems: researchItemsState,
      lastSavedTimestamp, lastMarketTrends, setLastMarketTrends, lastRiskTolerance, setLastRiskTolerance,
      materialCollectionCooldownEnd, manualResearchCooldownEnd,
      upgradeBusiness, purchaseBusinessUpgrade, purchaseHQUpgrade, getBusinessIncome, getBusinessUpgradeCost,
      buyStock, sellStock, performPrestige, unlockSkillNode, getDynamicMaxBusinessLevel,
      calculateCostForNLevelsForDisplay, calculateMaxAffordableLevelsForDisplay,
      manualSaveGame, exportGameState, importGameState, wipeGameData,
      purchaseFactoryBuilding, purchaseFactoryPowerBuilding, manuallyCollectRawMaterials, purchaseFactoryMachine,
      setRecipeForProductionSlot, purchaseFactoryMaterialCollector, manuallyGenerateResearchPoints, purchaseResearch,
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

    

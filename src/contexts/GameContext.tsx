
"use client";

import type { Business, PlayerStats, Stock, StockHolding, SkillNode, SaveData, HQUpgrade, FactoryPowerBuilding, FactoryMachine, FactoryProductionLine, FactoryPowerBuildingConfig, FactoryMachineConfig, FactoryComponent, FactoryProductionLineSlot, ResearchItemConfig, FactoryMaterialCollector } from '@/types';
import {
  INITIAL_BUSINESSES,
  INITIAL_MONEY,
  calculateIncome,
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
} from '@/config/game-config';
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useMemo } from 'react';
import { useToast } from "@/hooks/use-toast";

const SAVE_DATA_KEY = 'bizTycoonSaveData_v1';
const AUTO_SAVE_INTERVAL = 30000; 
const STOCK_PRICE_UPDATE_INTERVAL = 150000; // 2.5 minutes


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
  manualResearchCooldownEnd: number; // New for research cooldown display
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
  // calculateNextMachineCost: (ownedMachineCount: number) => number; // No longer needed as baseCost is per config
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
  const [materialCollectionCooldownEnd, setMaterialCollectionCooldownEnd] = useState<number>(0);
  const [manualResearchCooldownEnd, setManualResearchCooldownEnd] = useState<number>(0);


  const setLastMarketTrends = (trends: string) => {
    setLastMarketTrendsInternal(trends);
  };

  const setLastRiskTolerance = (tolerance: "low" | "medium" | "high") => {
    setLastRiskToleranceInternal(tolerance);
  };

  useEffect(() => {
    const stockUpdateInterval = setInterval(() => {
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

    return () => clearInterval(stockUpdateInterval);
  }, []); 


  const unlockedStocks = useMemo(() => {
    return stocksWithDynamicPrices.filter(currentDynamicStock => {
      const initialStockData = INITIAL_STOCKS.find(is => is.id === currentDynamicStock.id);
      if (!initialStockData) return false; 

      if (!initialStockData.requiredSkillToUnlock) return true; 
      return playerStats.unlockedSkillIds.includes(initialStockData.requiredSkillToUnlock);
    });
  }, [stocksWithDynamicPrices, playerStats.unlockedSkillIds]);


  const saveStateToLocalStorage = useCallback(() => {
    try {
      const currentTimestamp = Date.now();
      const saveData: SaveData = {
        playerStats, 
        businesses,
        lastSaved: currentTimestamp,
      };
      localStorage.setItem(SAVE_DATA_KEY, JSON.stringify(saveData));
      setLastSavedTimestamp(currentTimestamp);
    } catch (error) {
      console.error("Error saving game state:", error);
      toast({
        title: "Save Error",
        description: "Could not save game data to local storage.",
        variant: "destructive",
      });
    }
  }, [playerStats, businesses, toast]);

  const manualSaveGame = () => {
    saveStateToLocalStorage();
    toast({
      title: "Game Saved!",
      description: "Your progress has been saved.",
    });
  };

  const exportGameState = (): string => {
    const currentTimestamp = Date.now();
     const saveData: SaveData = {
        playerStats,
        businesses,
        lastSaved: currentTimestamp,
      };
    return JSON.stringify(saveData, null, 2);
  };

  const importGameState = (jsonString: string): boolean => {
    try {
      const importedData: SaveData = JSON.parse(jsonString);
      if (!importedData.playerStats || !importedData.businesses) {
        throw new Error("Invalid save data structure.");
      }
      
      const initialDefaults = getInitialPlayerStats();
      const mergedPlayerStats: PlayerStats = {
        ...initialDefaults, 
        ...importedData.playerStats,
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
        lastManualResearchTimestamp: typeof importedData.playerStats.lastManualResearchTimestamp === 'number' ? importedData.playerStats.lastManualResearchTimestamp : initialDefaults.lastManualResearchTimestamp,
      };

      setPlayerStats(mergedPlayerStats);

      setBusinesses(INITIAL_BUSINESSES.map(initialBiz => {
        const savedBusiness = importedData.businesses.find(b => b.id === initialBiz.id);
        return {
          ...initialBiz, 
          level: savedBusiness ? savedBusiness.level : 0,
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

      toast({
        title: "Game Loaded Successfully!",
        description: "Your game state has been imported.",
      });
      return true;
    } catch (error) {
      console.error("Error importing game state:", error);
      toast({
        title: "Import Error",
        description: `Failed to import save data. ${error instanceof Error ? error.message : 'Unknown error.'}`,
        variant: "destructive",
      });
      return false;
    }
  };

  const wipeGameData = () => {
    setPlayerStats(getInitialPlayerStats());
    setBusinesses(INITIAL_BUSINESSES.map(biz => ({
      ...biz,
      level: 0,
      managerOwned: false,
      upgrades: biz.upgrades ? biz.upgrades.map(upg => ({ ...upg, isPurchased: false })) : [],
      icon: biz.icon,
    })));
    setStocksWithDynamicPrices(INITIAL_STOCKS.map(s => ({ ...s })));
    localStorage.removeItem(SAVE_DATA_KEY);
    setLastSavedTimestamp(null);
    setMaterialCollectionCooldownEnd(0); 
    setManualResearchCooldownEnd(0);
    toast({
      title: "Game Data Wiped",
      description: "All progress has been reset to default.",
      variant: "destructive",
    });
  };


  useEffect(() => {
    try {
      const savedDataString = localStorage.getItem(SAVE_DATA_KEY);
      if (savedDataString) {
        const loadedData: SaveData = JSON.parse(savedDataString);
        
        const initialDefaults = getInitialPlayerStats();
        const mergedPlayerStats: PlayerStats = {
            ...initialDefaults,
            ...loadedData.playerStats,
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

        setBusinesses(() => {
          return INITIAL_BUSINESSES.map(initialBiz => {
            const savedBusinessState = loadedData.businesses.find(b => b.id === initialBiz.id);
            return {
                ...initialBiz, 
                level: savedBusinessState ? savedBusinessState.level : 0,
                managerOwned: savedBusinessState ? savedBusinessState.managerOwned : false,
                upgrades: initialBiz.upgrades?.map(initialUpg => {
                  const savedUpgData = savedBusinessState?.upgrades?.find(su => su.id === initialUpg.id);
                  return { ...initialUpg, isPurchased: savedUpgData ? savedUpgData.isPurchased : false };
                }) || [],
                icon: initialBiz.icon, 
              };
          });
        });
        setLastSavedTimestamp(loadedData.lastSaved || Date.now());
      } else {
        setPlayerStats(getInitialPlayerStats());
      }
    } catch (error) {
      console.error("Error loading game state from local storage:", error);
      localStorage.removeItem(SAVE_DATA_KEY);
      toast({ title: "Load Error", description: "Could not load previous save. Starting a new game.", variant: "destructive"});
      setPlayerStats(getInitialPlayerStats());
    }
  }, [toast]);


  useEffect(() => {
    const intervalId = setInterval(() => {
      saveStateToLocalStorage();
    }, AUTO_SAVE_INTERVAL);
    return () => clearInterval(intervalId);
  }, [saveStateToLocalStorage]);

  const getDynamicMaxBusinessLevel = useCallback((): number => {
    let currentMaxLevel = MAX_BUSINESS_LEVEL; 
    playerStats.unlockedSkillIds.forEach(skillId => {
        const skill = skillTreeState.find(s => s.id === skillId);
        if (skill && skill.effects.increaseMaxBusinessLevelBy) {
            currentMaxLevel += skill.effects.increaseMaxBusinessLevelBy;
        }
    });
    return currentMaxLevel;
  }, [playerStats.unlockedSkillIds, skillTreeState]);


  const getBusinessIncome = useCallback((businessId: string): number => {
    const business = businesses.find(b => b.id === businessId);
    return business ? calculateIncome(business, playerStats.unlockedSkillIds, skillTreeState, playerStats.hqUpgradeLevels, hqUpgradesState, playerStats.factoryProducedComponents, INITIAL_FACTORY_COMPONENTS_CONFIG) : 0;
  }, [businesses, playerStats.unlockedSkillIds, skillTreeState, playerStats.hqUpgradeLevels, hqUpgradesState, playerStats.factoryProducedComponents]);


  const getBusinessUpgradeCost = useCallback((businessId: string): number => {
    const business = businesses.find(b => b.id === businessId);
    if (!business) return 0;
    const currentDynamicMaxLevel = getDynamicMaxBusinessLevel();
    if (business.level >= currentDynamicMaxLevel) return Infinity;

     return calculateSingleLevelUpgradeCost(
        business.level,
        business.baseCost,
        business.upgradeCostMultiplier,
        business.upgrades,
        playerStats.unlockedSkillIds,
        skillTreeState,
        business.id,
        playerStats.hqUpgradeLevels,
        hqUpgradesState
    );
  }, [businesses, playerStats.unlockedSkillIds, skillTreeState, playerStats.hqUpgradeLevels, hqUpgradesState, getDynamicMaxBusinessLevel]);


  const calculateCostForNLevelsForDisplay = useCallback((businessId: string, levelsToBuy: number) => {
    const business = businesses.find(b => b.id === businessId);
    if (!business) return { totalCost: Infinity, levelsPurchasable: 0 };
    const dynamicMax = getDynamicMaxBusinessLevel();
    return calculateCostForNLevels(business, levelsToBuy, playerStats.unlockedSkillIds, skillTreeState, dynamicMax, playerStats.hqUpgradeLevels, hqUpgradesState);
  }, [businesses, playerStats.unlockedSkillIds, skillTreeState, playerStats.hqUpgradeLevels, hqUpgradesState, getDynamicMaxBusinessLevel]);

  const calculateMaxAffordableLevelsForDisplay = useCallback((businessId: string) => {
    const business = businesses.find(b => b.id === businessId);
    if (!business) return { levelsToBuy: 0, totalCost: 0 };
    const dynamicMax = getDynamicMaxBusinessLevel();
    return calculateMaxAffordableLevels(business, playerStats.money, playerStats.unlockedSkillIds, skillTreeState, dynamicMax, playerStats.hqUpgradeLevels, hqUpgradesState);
  }, [businesses, playerStats.money, playerStats.unlockedSkillIds, skillTreeState, playerStats.hqUpgradeLevels, hqUpgradesState, getDynamicMaxBusinessLevel]);


  useEffect(() => { // Game Loop
    setPlayerStats(prev => {
        const totalBusinessIncome = businesses.reduce((sum, biz) => sum + getBusinessIncome(biz.id), 0);
        let dividendIncome = 0;
        let globalDividendBoost = 0;
        prev.unlockedSkillIds.forEach(skillId => {
            const skill = skillTreeState.find(s => s.id === skillId);
            if (skill && skill.effects && skill.effects.globalDividendYieldBoostPercent) {
            globalDividendBoost += skill.effects.globalDividendYieldBoostPercent;
            }
        });
        for (const hqId in prev.hqUpgradeLevels) {
            const purchasedLevel = prev.hqUpgradeLevels[hqId];
            if (purchasedLevel > 0) {
            const hqUpgrade = hqUpgradesState.find(h => h.id === hqId);
            if (hqUpgrade && hqUpgrade.levels) {
                const levelData = hqUpgrade.levels.find(l => l.level === purchasedLevel);
                if (levelData && levelData.effects.globalDividendYieldBoostPercent) {
                globalDividendBoost += levelData.effects.globalDividendYieldBoostPercent;
                }
            }
            }
        }
        for (const holding of prev.stockHoldings) {
            const stockDetails = unlockedStocks.find(s => s.id === holding.stockId);
            if (stockDetails) {
            let currentDividendYield = stockDetails.dividendYield;
            const initialStockInfo = INITIAL_STOCKS.find(is => is.id === holding.stockId);
            if(initialStockInfo) { 
                currentDividendYield = initialStockInfo.dividendYield;
            }
            currentDividendYield *= (1 + globalDividendBoost / 100);
            dividendIncome += holding.shares * stockDetails.price * currentDividendYield;
            }
        }
        const newTotalIncomePerSecond = totalBusinessIncome + dividendIncome;
        let newMoneyFromIncome = prev.money + newTotalIncomePerSecond;

        let currentInvestmentsValue = 0;
        for (const holding of prev.stockHoldings) {
            const stockDetails = unlockedStocks.find(s => s.id === holding.stockId);
            if (stockDetails) {
            currentInvestmentsValue += holding.shares * stockDetails.price;
            }
        }

        let newFactoryPowerConsumptionKw = 0;
        let newFactoryRawMaterials = prev.factoryRawMaterials;
        let newFactoryProducedComponents = { ...prev.factoryProducedComponents };

        if (prev.factoryPurchased) {
            // Calculate power consumption from active machines and material collectors
            let tempPowerConsumption = 0;
            prev.factoryProductionLines.forEach(line => {
                line.slots.forEach(slot => {
                    if (slot.machineInstanceId && slot.targetComponentId) {
                        const machine = prev.factoryMachines.find(m => m.instanceId === slot.machineInstanceId);
                        if (machine) {
                            const machineConfig = INITIAL_FACTORY_MACHINE_CONFIGS.find(mc => mc.id === machine.configId);
                            if (machineConfig) {
                                tempPowerConsumption += machineConfig.powerConsumptionKw;
                            }
                        }
                    }
                });
            });
            (prev.factoryMaterialCollectors || []).forEach(collector => {
                const config = INITIAL_FACTORY_MATERIAL_COLLECTORS_CONFIG.find(c => c.id === collector.configId);
                if (config) {
                    tempPowerConsumption += config.powerConsumptionKw;
                }
            });
            newFactoryPowerConsumptionKw = tempPowerConsumption;
            
            const netPower = prev.factoryPowerUnitsGenerated - newFactoryPowerConsumptionKw;

            // Automated Material Collection
            if (netPower >= 0) { // Only collect if there's non-negative net power
                let powerUsedByCollectors = 0;
                (prev.factoryMaterialCollectors || []).forEach(collector => {
                    const config = INITIAL_FACTORY_MATERIAL_COLLECTORS_CONFIG.find(c => c.id === collector.configId);
                    if (config) powerUsedByCollectors += config.powerConsumptionKw;
                });

                // Effective power available specifically for collectors
                const powerAvailableForCollectors = prev.factoryPowerUnitsGenerated - (newFactoryPowerConsumptionKw - powerUsedByCollectors);
                
                let tempPowerForCollectors = powerAvailableForCollectors;
                let actualMaterialsCollectedThisTick = 0;

                // Prioritize collectors by their power consumption (cheapest first)
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


            // Component Production
            if (netPower >= 0) { // Only produce if there's non-negative net power
                prev.factoryProductionLines.forEach(line => {
                    line.slots.forEach(slot => {
                    if (slot.machineInstanceId && slot.targetComponentId) {
                        const machine = prev.factoryMachines.find(m => m.instanceId === slot.machineInstanceId);
                        const machineConfig = machine ? INITIAL_FACTORY_MACHINE_CONFIGS.find(mc => mc.id === machine.configId) : null;
                        const componentRecipe = INITIAL_FACTORY_COMPONENTS_CONFIG.find(cc => cc.id === slot.targetComponentId);

                        if (machine && machineConfig && componentRecipe && machineConfig.maxCraftableTier >= componentRecipe.tier) {
                            let canCraft = true;
                            if (newFactoryRawMaterials < componentRecipe.rawMaterialCost) {
                                canCraft = false;
                            }
                            for (const input of componentRecipe.recipe) {
                                if ((newFactoryProducedComponents[input.componentId] || 0) < input.quantity) {
                                canCraft = false;
                                break;
                                }
                            }

                            // Check if this specific machine can operate based on available power for production
                            // This assumes production machines are prioritized after collectors if power is scarce.
                            // A more complex system could prioritize individual machines or lines.
                            const powerNeededForThisMachine = machineConfig.powerConsumptionKw;
                            const powerAvailableForProduction = prev.factoryPowerUnitsGenerated - newFactoryPowerConsumptionKw + powerNeededForThisMachine; // Add back its own consumption to see if it alone can run

                            if (canCraft && powerAvailableForProduction >= powerNeededForThisMachine) {
                                newFactoryRawMaterials -= componentRecipe.rawMaterialCost;
                                for (const input of componentRecipe.recipe) {
                                newFactoryProducedComponents[input.componentId] = (newFactoryProducedComponents[input.componentId] || 0) - input.quantity;
                                }
                                newFactoryProducedComponents[slot.targetComponentId] = (newFactoryProducedComponents[slot.targetComponentId] || 0) + 1; 
                            }
                        }
                    }
                    });
                });
            }
        }

        return { 
            ...prev, 
            money: newMoneyFromIncome, 
            totalIncomePerSecond: newTotalIncomePerSecond,
            investmentsValue: currentInvestmentsValue,
            factoryPowerConsumptionKw: newFactoryPowerConsumptionKw,
            factoryRawMaterials: newFactoryRawMaterials,
            factoryProducedComponents: newFactoryProducedComponents,
        };
    });
  }, [businesses, getBusinessIncome, playerStats.stockHoldings, playerStats.unlockedSkillIds, skillTreeState, playerStats.hqUpgradeLevels, hqUpgradesState, unlockedStocks]);


  useEffect(() => {
    let purchasedInThisTick = false;
    let currentMoneySnapshot = playerStats.money;
    
    const updatedBusinesses = businesses.map(business => {
        let businessChanged = false;
        const skillIdToCheck = `auto_buy_upgrades_${business.id}`;

        if (playerStats.unlockedSkillIds.includes(skillIdToCheck) && business.upgrades) {
            const updatedUpgrades = business.upgrades.map(upgrade => {
                if (!upgrade.isPurchased && business.level >= upgrade.requiredLevel) {
                    let actualCost = upgrade.cost;
                    let globalUpgradeCostReduction = 0;
                    playerStats.unlockedSkillIds.forEach(sId => {
                        const sk = skillTreeState.find(s => s.id === sId);
                        if (sk && sk.effects && sk.effects.globalBusinessUpgradeCostReductionPercent) {
                            globalUpgradeCostReduction += sk.effects.globalBusinessUpgradeCostReductionPercent;
                        }
                    });
                    if (globalUpgradeCostReduction > 0) {
                        actualCost *= (1 - globalUpgradeCostReduction / 100);
                        actualCost = Math.max(0, Math.floor(actualCost));
                    }

                    if (currentMoneySnapshot >= actualCost) {
                        currentMoneySnapshot -= actualCost;
                        purchasedInThisTick = true;
                        businessChanged = true;
                        setPlayerStats(prev => {
                            const existingMilestonesForBusiness = prev.achievedBusinessMilestones?.[business.id] || {};
                            const existingPurchasedUpgrades = existingMilestonesForBusiness.purchasedUpgradeIds || [];
                            let updatedPurchasedUpgradesForAuto = [...existingPurchasedUpgrades];
                    
                            if (!existingPurchasedUpgrades.includes(upgrade.id)) {
                                updatedPurchasedUpgradesForAuto.push(upgrade.id);
                                toast({ title: "Auto-Upgrade!", description: `${upgrade.name} for ${business.name}`, duration: 1500 });
                            }
                            return {
                                ...prev,
                                achievedBusinessMilestones: {
                                    ...prev.achievedBusinessMilestones,
                                    [business.id]: {
                                        ...existingMilestonesForBusiness,
                                        purchasedUpgradeIds: updatedPurchasedUpgradesForAuto,
                                    },
                                },
                            };
                        });
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
      setPlayerStats(prev => ({ ...prev, money: currentMoneySnapshot }));
      setBusinesses(updatedBusinesses);
    }
  }, [playerStats.money, playerStats.unlockedSkillIds, businesses, skillTreeState, toast, playerStats.achievedBusinessMilestones]);


  const purchaseBusinessUpgrade = useCallback((businessId: string, upgradeId: string, isAutoBuy: boolean = false): boolean => {
    const businessToUpdate = businesses.find(b => b.id === businessId);
    if (!businessToUpdate || !businessToUpdate.upgrades) return false;

    const businessIndexInConfig = INITIAL_BUSINESSES.findIndex(b => b.id === businessId);
    if (playerStats.timesPrestiged < businessIndexInConfig && !isAutoBuy) {
      toast({ title: "Locked", description: `This business unlocks after ${businessIndexInConfig} prestige(s).`, variant: "destructive"});
      return false;
    }

    const upgrade = businessToUpdate.upgrades.find(u => u.id === upgradeId);
    if (!upgrade) return false;

    if (upgrade.isPurchased) {
      if (!isAutoBuy) toast({ title: "Already Owned", description: "You already own this upgrade.", variant: "default" });
      return false;
    }
    if (businessToUpdate.level < upgrade.requiredLevel) {
      if (!isAutoBuy) toast({ title: "Level Requirement Not Met", description: `${businessToUpdate.name} must be level ${upgrade.requiredLevel} for this upgrade.`, variant: "destructive" });
      return false;
    }

    let actualCost = upgrade.cost;
    let globalUpgradeCostReduction = 0;
    playerStats.unlockedSkillIds.forEach(skillId => {
        const skill = skillTreeState.find(s => s.id === skillId);
        if (skill && skill.effects && skill.effects.globalBusinessUpgradeCostReductionPercent) {
            globalUpgradeCostReduction += skill.effects.globalBusinessUpgradeCostReductionPercent;
        }
    });
    if (globalUpgradeCostReduction > 0) {
        actualCost *= (1 - globalUpgradeCostReduction / 100);
        actualCost = Math.max(0, Math.floor(actualCost));
    }

    if (playerStats.money < actualCost) {
      if (!isAutoBuy) toast({ title: "Not Enough Money", description: `You need $${Number(actualCost).toLocaleString('en-US', { maximumFractionDigits: 0 })} to purchase ${upgrade.name}.`, variant: "destructive" });
      return false;
    }

    setPlayerStats(prev => {
        const existingMilestonesForBusiness = prev.achievedBusinessMilestones?.[businessId] || {};
        const existingPurchasedUpgrades = existingMilestonesForBusiness.purchasedUpgradeIds || [];
        let updatedPurchasedUpgrades = [...existingPurchasedUpgrades];

        if (!existingPurchasedUpgrades.includes(upgradeId)) {
            updatedPurchasedUpgrades.push(upgradeId);
        }
        return {
            ...prev,
            money: prev.money - actualCost,
            achievedBusinessMilestones: {
                ...prev.achievedBusinessMilestones,
                [businessId]: {
                    ...existingMilestonesForBusiness,
                    purchasedUpgradeIds: updatedPurchasedUpgrades,
                },
            },
        };
    });

    setBusinesses(prevBusinesses =>
      prevBusinesses.map(b =>
        b.id === businessId
          ? { ...b, upgrades: b.upgrades?.map(u => u.id === upgradeId ? { ...u, isPurchased: true } : u) }
          : b
      )
    );
    if (!isAutoBuy) {
      toast({ title: "Upgrade Purchased!", description: `${upgrade.name} for ${businessToUpdate.name} is now active.` });
    } else {
       toast({ title: "Auto-Upgrade!", description: `${upgrade.name} for ${businessToUpdate.name}`, duration: 1500 });
    }
    return true;
  }, [businesses, playerStats.money, playerStats.timesPrestiged, playerStats.unlockedSkillIds, skillTreeState, playerStats.achievedBusinessMilestones, toast]);


  const upgradeBusiness = (businessId: string, levelsToAttempt: number = 1) => {
    const businessToUpdate = businesses.find(b => b.id === businessId);
    if (!businessToUpdate) return;

    const businessIndexInConfig = INITIAL_BUSINESSES.findIndex(b => b.id === businessId);
    if (playerStats.timesPrestiged < businessIndexInConfig) {
       toast({ title: "Locked", description: `This business unlocks after prestiging ${businessIndexInConfig} time(s). (Currently: ${playerStats.timesPrestiged})`, variant: "destructive"});
       return;
    }

    const currentDynamicMaxLevel = getDynamicMaxBusinessLevel();
    if (businessToUpdate.level >= currentDynamicMaxLevel) {
      toast({ title: "Max Level Reached!", description: `${businessToUpdate.name} is already at the maximum level (${currentDynamicMaxLevel}).`, variant: "default" });
      return;
    }

    const { totalCost, levelsPurchasable } = calculateCostForNLevels(
        businessToUpdate,
        levelsToAttempt,
        playerStats.unlockedSkillIds,
        skillTreeState,
        currentDynamicMaxLevel,
        playerStats.hqUpgradeLevels,
        hqUpgradesState
    );

    if (levelsPurchasable === 0) {
        toast({ title: "Cannot level up", description: `${businessToUpdate.name} is at max level or no levels can be purchased.`, variant: "default" });
        return;
    }

    if (playerStats.money < totalCost) {
      toast({ title: "Not enough money!", description: `You need $${Number(totalCost).toLocaleString('en-US', { maximumFractionDigits: 0 })} to level up ${businessToUpdate.name} by ${levelsPurchasable} level(s).`, variant: "destructive" });
      return;
    }
    
    const newLevelAfterUpgrade = businessToUpdate.level + levelsPurchasable;

    setPlayerStats(prev => {
        let newAchievedMilestones = { ...(prev.achievedBusinessMilestones || {}) };
        if (newLevelAfterUpgrade >= currentDynamicMaxLevel && !(newAchievedMilestones[businessId]?.maxLevelReached)) {
            newAchievedMilestones[businessId] = {
                ...(newAchievedMilestones[businessId] || {}),
                maxLevelReached: true,
            };
        }
        return { 
            ...prev, 
            money: prev.money - totalCost,
            achievedBusinessMilestones: newAchievedMilestones,
        };
    });

    setBusinesses(prevBusinesses =>
      prevBusinesses.map(b =>
        b.id === businessId ? { ...b, level: newLevelAfterUpgrade } : b
      )
    );
    toast({ title: "Business Leveled Up!", description: `${businessToUpdate.name} is now level ${newLevelAfterUpgrade} (+${levelsPurchasable}).` });
  };


  const buyStock = (stockId: string, sharesToBuyInput: number) => {
    if (playerStats.timesPrestiged < 8) {
        toast({ title: "Stocks Locked", description: "You need to prestige at least 8 times to access the stock market.", variant: "destructive" });
        return;
    }
    if (sharesToBuyInput <= 0) {
      toast({ title: "Invalid Amount", description: "Number of shares must be positive.", variant: "destructive" });
      return;
    }
    const stock = unlockedStocks.find(s => s.id === stockId); 
    if (!stock) {
      toast({ title: "Stock Not Found", description: "This stock is not available or does not exist.", variant: "destructive" });
      return;
    }

    const initialStockData = INITIAL_STOCKS.find(is => is.id === stockId);
    if (!initialStockData) return; 

    const existingHolding = playerStats.stockHoldings.find(h => h.stockId === stockId);
    const sharesAlreadyOwnedByPlayer = existingHolding?.shares || 0;
    const sharesAvailableToBuy = initialStockData.totalOutstandingShares - sharesAlreadyOwnedByPlayer;

    if (sharesAvailableToBuy <= 0) {
      toast({ title: "No Shares Available", description: `All outstanding shares of ${stock.companyName} (${stock.ticker}) are accounted for.`, variant: "default" });
      return;
    }
    let sharesToBuy = sharesToBuyInput;
    if (sharesToBuyInput > sharesAvailableToBuy) {
      toast({ title: "Purchase Adjusted", description: `Only ${sharesAvailableToBuy.toLocaleString('en-US')} shares available. Purchase adjusted.`, variant: "default" });
      sharesToBuy = sharesAvailableToBuy;
    }
    if (sharesToBuy <= 0) {
        toast({ title: "No Shares to Buy", description: `No shares of ${stock.companyName} (${stock.ticker}) could be purchased.`, variant: "destructive" });
        return;
    }
    const cost = stock.price * sharesToBuy; 
    if (playerStats.money < cost) {
      toast({ title: "Not Enough Money", description: `You need $${Number(cost).toLocaleString('en-US', { maximumFractionDigits: 0 })} to buy ${sharesToBuy.toLocaleString('en-US')} share(s).`, variant: "destructive" });
      return;
    }
    setPlayerStats(prev => {
      const newHoldings = prev.stockHoldings.find(h => h.stockId === stockId)
        ? prev.stockHoldings.map(h => h.stockId === stockId ? { ...h, shares: h.shares + sharesToBuy, averagePurchasePrice: ((h.averagePurchasePrice * h.shares) + (stock.price * sharesToBuy)) / (h.shares + sharesToBuy) } : h)
        : [...prev.stockHoldings, { stockId, shares: sharesToBuy, averagePurchasePrice: stock.price }];
      return { ...prev, money: prev.money - cost, stockHoldings: newHoldings };
    });
    toast({ title: "Stock Purchased!", description: `Bought ${sharesToBuy.toLocaleString('en-US')} share(s) of ${stock.companyName}.` });
  };

  const sellStock = (stockId: string, sharesToSell: number) => {
     if (playerStats.timesPrestiged < 8) {
        toast({ title: "Stocks Locked", description: "You need to prestige at least 8 times to access the stock market.", variant: "destructive" });
        return;
    }
    if (sharesToSell <= 0) {
      toast({ title: "Invalid Amount", description: "Number of shares must be positive.", variant: "destructive" });
      return;
    }
    const stock = unlockedStocks.find(s => s.id === stockId); 
    if (!stock) {
      toast({ title: "Stock Not Found", variant: "destructive" });
      return;
    }
    const existingHolding = playerStats.stockHoldings.find(h => h.stockId === stockId);
    if (!existingHolding || existingHolding.shares < sharesToSell) {
      toast({ title: "Not Enough Shares", description: `You only own ${existingHolding?.shares || 0} share(s).`, variant: "destructive" });
      return;
    }
    const earnings = stock.price * sharesToSell; 
    setPlayerStats(prev => {
      const newHoldings = existingHolding.shares === sharesToSell
        ? prev.stockHoldings.filter(h => h.stockId !== stockId)
        : prev.stockHoldings.map(h => h.stockId === stockId ? { ...h, shares: h.shares - sharesToSell } : h);
      return { ...prev, money: prev.money + earnings, stockHoldings: newHoldings };
    });
    toast({ title: "Stock Sold!", description: `Sold ${sharesToSell.toLocaleString('en-US')} share(s) of ${stock.companyName}.` });
  };

  const performPrestige = useCallback(() => {
    const moneyRequiredForFirstPrestige = 100000;
    if (playerStats.money < moneyRequiredForFirstPrestige && playerStats.timesPrestiged === 0) {
      toast({ title: "Not Enough Money", description: `Need $${Number(moneyRequiredForFirstPrestige).toLocaleString('en-US', { maximumFractionDigits: 0 })} to prestige for the first time.`, variant: "destructive" });
      return;
    }

    const totalLevels = businesses.reduce((sum, b) => sum + b.level, 0);
    let basePointsFromLevels = calculateDiminishingPrestigePoints(totalLevels);

    const prestigePointBoost = getPrestigePointBoostPercent(playerStats.unlockedSkillIds, skillTreeState, playerStats.hqUpgradeLevels, hqUpgradesState);
    const actualNewPrestigePoints = Math.floor(Math.max(0, basePointsFromLevels - playerStats.prestigePoints) * (1 + prestigePointBoost / 100));

    let moneyAfterPrestige = INITIAL_MONEY;
    const startingMoneyBonus = getStartingMoneyBonus(playerStats.unlockedSkillIds, skillTreeState, playerStats.hqUpgradeLevels, hqUpgradesState);
    moneyAfterPrestige += startingMoneyBonus;

    const retainedBusinessLevels: Record<string, number> = {};
    const retainedStockHoldings: StockHolding[] = [];

    const { 
      factoryPurchased, 
      // Retain research points and unlocked research across prestige
      researchPoints, 
      unlockedResearchIds,
      // Other factory stats that should persist or be selectively reset
      factoryRawMaterials, 
      factoryMachines, 
      factoryProducedComponents,
      factoryPowerBuildings, // Retain power buildings
      factoryMaterialCollectors, // Retain material collectors
    } = playerStats;
    
    const retainedFactoryPowerUnitsGenerated = factoryPowerBuildings.reduce((sum, pb) => sum + pb.currentOutputKw, 0);


    for (const hqUpgradeId in playerStats.hqUpgradeLevels) {
        const purchasedLevel = playerStats.hqUpgradeLevels[hqUpgradeId];
        if (purchasedLevel > 0) {
            const hqUpgradeConfig = hqUpgradesState.find(hq => h.id === hqUpgradeId);
            if (hqUpgradeConfig && hqUpgradeConfig.levels) {
                const levelData = hqUpgradeConfig.levels.find(l => l.level === purchasedLevel);
                if (levelData && levelData.effects.retentionPercentage) {
                    const retentionPercentage = levelData.effects.retentionPercentage;
                    if (hqUpgradeId.startsWith('retain_level_')) {
                        const businessId = hqUpgradeId.replace('retain_level_', '');
                        const business = businesses.find(b => b.id === businessId);
                        if (business) {
                            retainedBusinessLevels[businessId] = Math.floor(business.level * (retentionPercentage / 100));
                        }
                    } else if (hqUpgradeId.startsWith('retain_shares_')) {
                        const stockId = hqUpgradeId.replace('retain_shares_', '');
                        const currentHolding = playerStats.stockHoldings.find(h => h.stockId === stockId);
                        if (currentHolding) {
                            const retainedShares = Math.floor(currentHolding.shares * (retentionPercentage / 100));
                            if (retainedShares > 0) {
                                retainedStockHoldings.push({ stockId, shares: retainedShares, averagePurchasePrice: currentHolding.averagePurchasePrice });
                            }
                        }
                    }
                }
            }
        }
    }
    
    const initialProdLines = Array.from({ length: 5 }, (_, i) => ({
      id: `line_${i + 1}`,
      name: `Production Line ${i + 1}`,
      slots: Array.from({ length: 6 }, () => ({ machineInstanceId: null, targetComponentId: null })),
    }));

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
      researchPoints, // Persist research points
      unlockedResearchIds, // Persist unlocked research
      lastManualResearchTimestamp: prev.lastManualResearchTimestamp, // Persist this to avoid immediate re-research
    }));

    setBusinesses(INITIAL_BUSINESSES.map(biz => ({
      ...biz, 
      level: retainedBusinessLevels[biz.id] || 0, 
      managerOwned: false, 
      upgrades: biz.upgrades ? biz.upgrades.map(upg => ({ ...upg, isPurchased: false })) : [],
      icon: biz.icon,
    })));
    
    setStocksWithDynamicPrices(INITIAL_STOCKS.map(s => ({ ...s })));
    _attemptAutoAssignWaitingMachines();

    toast({ title: "Prestige Successful!", description: `Earned ${actualNewPrestigePoints} prestige point(s)! Progress partially reset. Starting money now $${Number(moneyAfterPrestige).toLocaleString('en-US', { maximumFractionDigits: 0 })}.` });
  }, [playerStats, businesses, toast, skillTreeState, hqUpgradesState]);

  const unlockSkillNode = (skillId: string) => {
    const skill = skillTreeState.find(s => s.id === skillId);
    if (!skill) {
      toast({ title: "Skill Not Found", variant: "destructive" });
      return;
    }
    if (playerStats.unlockedSkillIds.includes(skillId)) {
      toast({ title: "Skill Already Unlocked", variant: "default" });
      return;
    }

    if (playerStats.prestigePoints < skill.cost) {
        toast({ title: "Not Enough Prestige Points", description: `Need ${skill.cost} PP. You have ${playerStats.prestigePoints}.`, variant: "destructive" });
        return;
    }
    if (skill.dependencies && skill.dependencies.some(depId => !playerStats.unlockedSkillIds.includes(depId))) {
        toast({ title: "Dependencies Not Met", description: "Unlock prerequisite skills first.", variant: "destructive" });
        return;
    }

    setPlayerStats(prev => ({
      ...prev,
      prestigePoints: prev.prestigePoints - skill.cost,
      unlockedSkillIds: [...prev.unlockedSkillIds, skillId],
    }));

    toast({ title: "Skill Unlocked!", description: `${skill.name} is now active.` });
  };

  const purchaseHQUpgrade = (upgradeId: string) => {
    const upgradeConfig = hqUpgradesState.find(u => u.id === upgradeId);
    if (!upgradeConfig) {
      toast({ title: "HQ Upgrade Not Found", variant: "destructive" });
      return;
    }

    const currentLevel = playerStats.hqUpgradeLevels[upgradeId] || 0;
    const nextLevel = currentLevel + 1;
    const nextLevelData = upgradeConfig.levels.find(l => l.level === nextLevel);

    if (!nextLevelData) {
      toast({ title: "Max Level Reached", description: `${upgradeConfig.name} is already at its maximum level.`, variant: "default" });
      return;
    }
    
    if (upgradeConfig.requiredTimesPrestiged && playerStats.timesPrestiged < upgradeConfig.requiredTimesPrestiged) {
      toast({ title: "Prestige Requirement Not Met", description: `This HQ upgrade requires ${upgradeConfig.requiredTimesPrestiged} prestige(s).`, variant: "destructive"});
      return;
    }

    if (playerStats.money < nextLevelData.costMoney) {
      toast({ title: "Not Enough Money", description: `Need $${Number(nextLevelData.costMoney).toLocaleString('en-US', { maximumFractionDigits: 0 })}.`, variant: "destructive"});
      return;
    }
    if (nextLevelData.costPrestigePoints && playerStats.prestigePoints < nextLevelData.costPrestigePoints) {
      toast({ title: "Not Enough Prestige Points", description: `Need ${nextLevelData.costPrestigePoints} PP.`, variant: "destructive"});
      return;
    }

    setPlayerStats(prev => ({
      ...prev,
      money: prev.money - nextLevelData.costMoney,
      prestigePoints: nextLevelData.costPrestigePoints ? prev.prestigePoints - nextLevelData.costPrestigePoints : prev.prestigePoints,
      hqUpgradeLevels: {
        ...prev.hqUpgradeLevels,
        [upgradeId]: nextLevel,
      },
    }));
    toast({ title: "HQ Upgrade Purchased!", description: `${upgradeConfig.name} upgraded to Level ${nextLevel}.` });
  };

  const purchaseFactoryBuilding = () => {
    if (playerStats.factoryPurchased) {
      toast({ title: "Factory Already Owned", description: "You have already purchased the factory building.", variant: "default" });
      return;
    }
    if (playerStats.money < FACTORY_PURCHASE_COST) {
      toast({ title: "Not Enough Money", description: `You need $${FACTORY_PURCHASE_COST.toLocaleString()} to purchase the factory.`, variant: "destructive" });
      return;
    }
    setPlayerStats(prev => ({
      ...prev,
      money: prev.money - FACTORY_PURCHASE_COST,
      factoryPurchased: true,
    }));
    toast({ title: "Factory Purchased!", description: "You can now start building your industrial empire!" });
  };

  const purchaseFactoryPowerBuilding = (configId: string) => {
    if (!playerStats.factoryPurchased) {
      toast({ title: "Factory Not Owned", description: "Purchase the factory building first.", variant: "destructive" });
      return;
    }
    const config = INITIAL_FACTORY_POWER_BUILDINGS_CONFIG.find(c => c.id === configId);
    if (!config) {
      toast({ title: "Power Building Not Found", variant: "destructive"});
      return;
    }

    const numOwned = playerStats.factoryPowerBuildings.filter(pb => pb.configId === configId).length;
    if (config.maxInstances !== undefined && numOwned >= config.maxInstances) {
      toast({ title: "Max Instances Reached", description: `You already own the maximum of ${config.maxInstances} ${config.name}(s).`, variant: "default"});
      return;
    }

    const costForNext = config.baseCost * Math.pow(config.costMultiplier || 1.1, numOwned);
    if (playerStats.money < costForNext) {
      toast({ title: "Not Enough Money", description: `Need $${costForNext.toLocaleString()} for the next ${config.name}.`, variant: "destructive"});
      return;
    }

    const newBuilding: FactoryPowerBuilding = {
      instanceId: `${configId}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      configId: config.id,
      level: 1,
      currentOutputKw: config.powerOutputKw,
    };

    setPlayerStats(prev => {
      const updatedPowerBuildings = [...prev.factoryPowerBuildings, newBuilding];
      const newTotalPower = updatedPowerBuildings.reduce((sum, pb) => sum + pb.currentOutputKw, 0);
      return {
        ...prev,
        money: prev.money - costForNext,
        factoryPowerBuildings: updatedPowerBuildings,
        factoryPowerUnitsGenerated: newTotalPower,
      };
    });
    toast({ title: "Power Building Purchased!", description: `Built a new ${config.name}.` });
  };

  const manuallyCollectRawMaterials = () => {
    if (!playerStats.factoryPurchased) {
     toast({ title: "Factory Not Owned", description: "Purchase the factory building first.", variant: "destructive" });
     return;
    }
    const now = Date.now();
    if (now < materialCollectionCooldownEnd) {
        const timeLeft = Math.ceil((materialCollectionCooldownEnd - now) / 1000);
        toast({ title: "On Cooldown", description: `Please wait ${timeLeft}s before collecting again.`, variant: "default"});
        return;
    }

    setPlayerStats(prev => ({
      ...prev,
      factoryRawMaterials: prev.factoryRawMaterials + MATERIAL_COLLECTION_AMOUNT,
    }));
    setMaterialCollectionCooldownEnd(now + MATERIAL_COLLECTION_COOLDOWN_MS);
    toast({ title: "Materials Collected!", description: `+${MATERIAL_COLLECTION_AMOUNT} Raw Materials added.` });
  };


  const _attemptAutoAssignSingleMachine = (machineInstanceId: string, currentProductionLines: FactoryProductionLine[]): { updatedProductionLines: FactoryProductionLine[], assignedLineId: string | null, assignedSlotIndex: number | null } => {
    let assignedLineId: string | null = null;
    let assignedSlotIndex: number | null = null;
    
    const updatedProductionLines = currentProductionLines.map(line => {
        if (assignedLineId) return line; 

        const emptySlotIndex = line.slots.findIndex(slot => slot.machineInstanceId === null);
        if (emptySlotIndex !== -1) {
            const newSlots = [...line.slots];
            newSlots[emptySlotIndex] = { ...newSlots[emptySlotIndex], machineInstanceId: machineInstanceId };
            assignedLineId = line.id;
            assignedSlotIndex = emptySlotIndex;
            return { ...line, slots: newSlots };
        }
        return line;
    });
    return { updatedProductionLines, assignedLineId, assignedSlotIndex };
  };

  const _attemptAutoAssignWaitingMachines = useCallback(() => {
    setPlayerStats(prev => {
        let newMachines = [...prev.factoryMachines];
        let newProductionLines = [...prev.factoryProductionLines];
        let machineAssignedThisCall = false;

        for (let i = 0; i < newMachines.length; i++) {
            if (newMachines[i].assignedProductionLineId === null) { 
                const assignResult = _attemptAutoAssignSingleMachine(newMachines[i].instanceId, newProductionLines);
                if (assignResult.assignedLineId !== null && assignResult.assignedSlotIndex !== null) {
                    newMachines[i] = { ...newMachines[i], assignedProductionLineId: assignResult.assignedLineId };
                    newProductionLines = assignResult.updatedProductionLines;
                    const machineConfig = INITIAL_FACTORY_MACHINE_CONFIGS.find(mc => mc.id === newMachines[i].configId);
                    const line = newProductionLines.find(l => l.id === assignResult.assignedLineId);
                    toast({ title: "Machine Auto-Assigned", description: `${machineConfig?.name || 'Machine'} placed in ${line?.name || 'Line'}, Slot ${assignResult.assignedSlotIndex + 1}.`, duration: 2000 });
                    machineAssignedThisCall = true;
                    break; 
                }
            }
        }
        if (machineAssignedThisCall) {
            return { ...prev, factoryMachines: newMachines, factoryProductionLines: newProductionLines };
        }
        return prev; 
    });
  }, [toast]);


  const purchaseFactoryMachine = (configId: string) => {
    if (!playerStats.factoryPurchased) {
      toast({ title: "Factory Not Owned", description: "Purchase the factory building first.", variant: "destructive" });
      return;
    }
    const machineConfig = INITIAL_FACTORY_MACHINE_CONFIGS.find(mc => mc.id === configId);
    if (!machineConfig) {
      toast({ title: "Machine Type Not Found", variant: "destructive"});
      return;
    }

    if (machineConfig.requiredResearchId && !playerStats.unlockedResearchIds.includes(machineConfig.requiredResearchId)) {
      const researchItem = researchItemsState.find(r => r.id === machineConfig.requiredResearchId);
      toast({ title: "Research Required", description: `Purchase of ${machineConfig.name} requires '${researchItem?.name || machineConfig.requiredResearchId}' research.`, variant: "destructive"});
      return;
    }

    const cost = machineConfig.baseCost; // Using baseCost directly as per previous update

    if (playerStats.money < cost) {
      toast({ title: "Not Enough Money", description: `Need $${cost.toLocaleString()} to build a ${machineConfig.name}.`, variant: "destructive"});
      return;
    }

    const newMachineInstanceId = `${configId}_machine_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    setPlayerStats(prev => {
        const newMachine: FactoryMachine = {
            instanceId: newMachineInstanceId,
            configId: machineConfig.id,
            assignedProductionLineId: null,
        };
        
        let updatedMachines = [...prev.factoryMachines, newMachine];
        let updatedProductionLines = [...prev.factoryProductionLines];
        let assignmentMessage = "";

        const assignResult = _attemptAutoAssignSingleMachine(newMachineInstanceId, updatedProductionLines);
        if (assignResult.assignedLineId !== null && assignResult.assignedSlotIndex !== null) {
            updatedMachines = updatedMachines.map(m => m.instanceId === newMachineInstanceId ? { ...m, assignedProductionLineId: assignResult.assignedLineId } : m);
            updatedProductionLines = assignResult.updatedProductionLines;
            const line = updatedProductionLines.find(l => l.id === assignResult.assignedLineId);
            assignmentMessage = ` and auto-assigned to ${line?.name || 'a line'}, Slot ${assignResult.assignedSlotIndex + 1}.`;
        } else {
            assignmentMessage = ". Production lines are full.";
        }
        
        toast({ title: "Machine Built!", description: `A new ${machineConfig.name} is ready${assignmentMessage}` });

        return {
            ...prev,
            money: prev.money - cost,
            factoryMachines: updatedMachines,
            factoryProductionLines: updatedProductionLines,
        };
    });
  };

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
          
          return {
              ...prev,
              factoryMachines: newFactoryMachines,
              factoryProductionLines: newFactoryProductionLines,
          };
      });
      setTimeout(() => _attemptAutoAssignWaitingMachines(), 0);
  }, [_attemptAutoAssignWaitingMachines]);

  const setRecipeForProductionSlot = (productionLineId: string, slotIndex: number, targetComponentId: string | null) => {
    setPlayerStats(prev => {
      const lineIndex = prev.factoryProductionLines.findIndex(line => line.id === productionLineId);
      if (lineIndex === -1) {
        toast({ title: "Error", description: "Production line not found.", variant: "destructive" });
        return prev;
      }

      const productionLine = prev.factoryProductionLines[lineIndex];
      if (slotIndex < 0 || slotIndex >= productionLine.slots.length) {
        toast({ title: "Error", description: "Invalid slot index.", variant: "destructive" });
        return prev;
      }

      const slot = productionLine.slots[slotIndex];
      if (!slot.machineInstanceId) {
        toast({ title: "No Machine", description: "No machine assigned to this slot to set a recipe for.", variant: "destructive" });
        return prev;
      }

      const machineInstance = prev.factoryMachines.find(m => m.instanceId === slot.machineInstanceId);
      if (!machineInstance) {
        toast({ title: "Error", description: "Assigned machine data not found.", variant: "destructive" });
        return prev; 
      }

      const machineConfig = INITIAL_FACTORY_MACHINE_CONFIGS.find(mc => mc.id === machineInstance.configId);
      if (!machineConfig) {
        toast({ title: "Error", description: "Machine configuration not found.", variant: "destructive" });
        return prev;
      }

      if (targetComponentId !== null) {
        const componentRecipe = INITIAL_FACTORY_COMPONENTS_CONFIG.find(cc => cc.id === targetComponentId);
        if (!componentRecipe) {
          toast({ title: "Error", description: "Target component recipe not found.", variant: "destructive" });
          return prev;
        }
        if (machineConfig.maxCraftableTier < componentRecipe.tier) {
          toast({ title: "Cannot Craft", description: `${machineConfig.name} (Tier ${machineConfig.maxCraftableTier}) cannot craft ${componentRecipe.name} (Tier ${componentRecipe.tier}).`, variant: "destructive" });
          return prev;
        }
      }

      const updatedProductionLines = [...prev.factoryProductionLines];
      const updatedSlots = [...updatedProductionLines[lineIndex].slots];
      updatedSlots[slotIndex] = { ...updatedSlots[slotIndex], targetComponentId: targetComponentId };
      updatedProductionLines[lineIndex] = { ...updatedProductionLines[lineIndex], slots: updatedSlots };

      if (targetComponentId) {
        const component = INITIAL_FACTORY_COMPONENTS_CONFIG.find(c => c.id === targetComponentId);
        toast({ title: "Recipe Set!", description: `${machineConfig.name} in ${productionLine.name} (Slot ${slotIndex + 1}) will now produce ${component?.name || 'component'}.` });
      } else {
        toast({ title: "Recipe Cleared", description: `${machineConfig.name} in ${productionLine.name} (Slot ${slotIndex + 1}) is now idle.` });
      }
      
      return { ...prev, factoryProductionLines: updatedProductionLines };
    });
  };

  const purchaseFactoryMaterialCollector = (configId: string) => {
    if (!playerStats.factoryPurchased) {
      toast({ title: "Factory Not Owned", description: "Purchase the factory building first.", variant: "destructive" });
      return;
    }
    const config = INITIAL_FACTORY_MATERIAL_COLLECTORS_CONFIG.find(c => c.id === configId);
    if (!config) {
      toast({ title: "Material Collector Not Found", variant: "destructive"});
      return;
    }

    const numOwned = (playerStats.factoryMaterialCollectors || []).filter(mc => mc.configId === configId).length;
    if (config.maxInstances !== undefined && numOwned >= config.maxInstances) {
      toast({ title: "Max Instances Reached", description: `You already own the maximum of ${config.maxInstances} ${config.name}(s).`, variant: "default"});
      return;
    }

    const costForNext = config.baseCost * Math.pow(config.costMultiplier || 1.15, numOwned);
    if (playerStats.money < costForNext) {
      toast({ title: "Not Enough Money", description: `Need $${costForNext.toLocaleString()} for the next ${config.name}.`, variant: "destructive"});
      return;
    }

    const newCollector: FactoryMaterialCollector = {
      instanceId: `${configId}_collector_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      configId: config.id,
      currentMaterialsPerSecond: config.materialsPerSecond,
    };

    setPlayerStats(prev => {
      const updatedCollectors = [...(prev.factoryMaterialCollectors || []), newCollector];
      return {
        ...prev,
        money: prev.money - costForNext,
        factoryMaterialCollectors: updatedCollectors,
      };
    });
    toast({ title: "Material Collector Deployed!", description: `A new ${config.name} is now active.` });
  };

  const manuallyGenerateResearchPoints = () => {
    if (!playerStats.factoryPurchased) {
      toast({ title: "Factory Not Owned", description: "Purchase the factory building first.", variant: "destructive" });
      return;
    }
    if (playerStats.timesPrestiged < REQUIRED_PRESTIGE_LEVEL_FOR_RESEARCH_TAB) {
      toast({ title: "Research Locked", description: `Research tab unlocks at Prestige Level ${REQUIRED_PRESTIGE_LEVEL_FOR_RESEARCH_TAB}.`, variant: "destructive" });
      return;
    }
    const now = Date.now();
    if (now < manualResearchCooldownEnd) {
        const timeLeft = Math.ceil((manualResearchCooldownEnd - now) / 1000);
        toast({ title: "On Cooldown", description: `Please wait ${timeLeft}s before conducting research again.`, variant: "default"});
        return;
    }
    if (playerStats.money < RESEARCH_MANUAL_GENERATION_COST_MONEY) {
      toast({ title: "Not Enough Money", description: `Need $${RESEARCH_MANUAL_GENERATION_COST_MONEY.toLocaleString()} to conduct research.`, variant: "destructive"});
      return;
    }
    setPlayerStats(prev => ({
      ...prev,
      money: prev.money - RESEARCH_MANUAL_GENERATION_COST_MONEY,
      researchPoints: prev.researchPoints + RESEARCH_MANUAL_GENERATION_AMOUNT,
      lastManualResearchTimestamp: now,
    }));
    setManualResearchCooldownEnd(now + RESEARCH_MANUAL_COOLDOWN_MS);
    toast({ title: "Research Conducted!", description: `+${RESEARCH_MANUAL_GENERATION_AMOUNT} Research Point(s) gained.` });
  };

  const purchaseResearch = (researchId: string) => {
    if (!playerStats.factoryPurchased) {
      toast({ title: "Factory Not Owned", description: "Purchase the factory building first.", variant: "destructive" });
      return;
    }
     if (playerStats.timesPrestiged < REQUIRED_PRESTIGE_LEVEL_FOR_RESEARCH_TAB) {
      toast({ title: "Research Locked", description: `Research tab unlocks at Prestige Level ${REQUIRED_PRESTIGE_LEVEL_FOR_RESEARCH_TAB}.`, variant: "destructive" });
      return;
    }

    const researchConfig = researchItemsState.find(r => r.id === researchId);
    if (!researchConfig) {
      toast({ title: "Research Not Found", variant: "destructive" });
      return;
    }
    if (playerStats.unlockedResearchIds.includes(researchId)) {
      toast({ title: "Research Already Unlocked", variant: "default" });
      return;
    }
    if (researchConfig.dependencies && researchConfig.dependencies.some(depId => !playerStats.unlockedResearchIds.includes(depId))) {
      toast({ title: "Dependencies Not Met", description: "Unlock prerequisite research first.", variant: "destructive" });
      return;
    }
    if (playerStats.researchPoints < researchConfig.costRP) {
      toast({ title: "Not Enough Research Points", description: `Need ${researchConfig.costRP} RP.`, variant: "destructive" });
      return;
    }
    if (researchConfig.costMoney && playerStats.money < researchConfig.costMoney) {
      toast({ title: "Not Enough Money", description: `Need $${researchConfig.costMoney.toLocaleString()}.`, variant: "destructive" });
      return;
    }

    setPlayerStats(prev => ({
      ...prev,
      researchPoints: prev.researchPoints - researchConfig.costRP,
      money: researchConfig.costMoney ? prev.money - researchConfig.costMoney : prev.money,
      unlockedResearchIds: [...prev.unlockedResearchIds, researchId],
    }));
    toast({ title: "Research Complete!", description: `${researchConfig.name} unlocked.` });
  };


  return (
    <GameContext.Provider value={{
      playerStats,
      businesses,
      stocks: unlockedStocks, 
      skillTree: skillTreeState,
      hqUpgrades: hqUpgradesState,
      researchItems: researchItemsState,
      lastSavedTimestamp,
      lastMarketTrends,
      setLastMarketTrends,
      lastRiskTolerance,
      setLastRiskTolerance,
      materialCollectionCooldownEnd,
      manualResearchCooldownEnd,
      upgradeBusiness,
      purchaseBusinessUpgrade,
      purchaseHQUpgrade,
      getBusinessIncome,
      getBusinessUpgradeCost,
      buyStock,
      sellStock,
      performPrestige,
      unlockSkillNode,
      getDynamicMaxBusinessLevel,
      calculateCostForNLevelsForDisplay,
      calculateMaxAffordableLevelsForDisplay,
      manualSaveGame,
      exportGameState,
      importGameState,
      wipeGameData,
      purchaseFactoryBuilding,
      purchaseFactoryPowerBuilding,
      manuallyCollectRawMaterials,
      purchaseFactoryMachine,
      setRecipeForProductionSlot,
      purchaseFactoryMaterialCollector,
      manuallyGenerateResearchPoints,
      purchaseResearch,
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

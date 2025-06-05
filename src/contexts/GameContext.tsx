
"use client";

import type { Business, PlayerStats, Stock, StockHolding, SkillNode, SaveData, HQUpgrade, FactoryPowerBuilding, FactoryMachine, FactoryProductionLine, FactoryPowerBuildingConfig, FactoryMachineConfig, FactoryComponent, FactoryProductionLineSlot, ResearchItemConfig, FactoryMaterialCollector, Worker, WorkerStatus, FactoryMachineUpgradeConfig } from '@/types';
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
  INITIAL_FACTORY_WORKERS,
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
  WORKER_HIRE_COST_BASE,
  WORKER_HIRE_COST_MULTIPLIER,
  MAX_WORKERS,
  INITIAL_WORKER_MAX_ENERGY,
  WORKER_ENERGY_RATE,
  WORKER_FIRST_NAMES,
  WORKER_LAST_NAMES,
  WORKER_ENERGY_TIERS,
  INITIAL_WORKER_ENERGY_TIER
} from '@/config/game-config';
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useMemo, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";

const SAVE_DATA_KEY = 'bizTycoonSaveData_v1';
const AUTO_SAVE_INTERVAL = 30000;
const STOCK_PRICE_UPDATE_INTERVAL = 150000;
const GAME_TICK_INTERVAL = 1000;


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
  hireWorker: () => void;
  assignWorkerToMachine: (workerId: string | null, machineInstanceId: string) => void;
  unlockProductionLine: (lineId: string) => void;
  purchaseFactoryMachineUpgrade: (machineInstanceId: string, upgradeId: string) => void;
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
    factoryProductionLines: [
      { id: 'line_1', name: 'Production Line 1', slots: Array.from({ length: 6 }, () => ({ machineInstanceId: null, targetComponentId: null })), isUnlocked: false, unlockCost: 250000 },
      { id: 'line_2', name: 'Production Line 2', slots: Array.from({ length: 6 }, () => ({ machineInstanceId: null, targetComponentId: null })), isUnlocked: false, requiredResearchId: 'unlock_prod_line_2' },
      { id: 'line_3', name: 'Production Line 3', slots: Array.from({ length: 6 }, () => ({ machineInstanceId: null, targetComponentId: null })), isUnlocked: false, requiredResearchId: 'unlock_prod_line_3' },
      { id: 'line_4', name: 'Production Line 4', slots: Array.from({ length: 6 }, () => ({ machineInstanceId: null, targetComponentId: null })), isUnlocked: false, requiredResearchId: 'unlock_prod_line_4' },
      { id: 'line_5', name: 'Production Line 5', slots: Array.from({ length: 6 }, () => ({ machineInstanceId: null, targetComponentId: null })), isUnlocked: false, requiredResearchId: 'unlock_prod_line_5' },
    ],
    factoryPowerBuildings: [],
    factoryProducedComponents: {},
    factoryMaterialCollectors: [],
    factoryProductionProgress: {},
    factoryWorkers: [...INITIAL_FACTORY_WORKERS],
    researchPoints: INITIAL_RESEARCH_POINTS,
    unlockedResearchIds: [...INITIAL_UNLOCKED_RESEARCH_IDS],
    lastManualResearchTimestamp: 0,
    currentWorkerEnergyTier: INITIAL_WORKER_ENERGY_TIER,
    manualResearchBonus: 0,
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

  const getDynamicMaxWorkerEnergy = useCallback((): number => {
    const tier = playerStatsRef.current.currentWorkerEnergyTier;
    return WORKER_ENERGY_TIERS[tier] || WORKER_ENERGY_TIERS[0];
  }, []);


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

  const getBusinessIncome = useCallback((businessId: string): number => {
    const business = businessesRef.current.find(b => b.id === businessId);
    if (!business) return 0;
    return localCalculateIncome( business, playerStatsRef.current.unlockedSkillIds, skillTreeRef.current, playerStatsRef.current.hqUpgradeLevels, hqUpgradesRef.current, playerStatsRef.current.factoryProducedComponents || {}, INITIAL_FACTORY_COMPONENTS_CONFIG );
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
    let success = false;
    let toastTitle = "";
    let toastDescription = "";
    let toastVariant: "default" | "destructive" = "default";
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
        factoryProductionLines: Array.isArray(importedData.playerStats.factoryProductionLines) && importedData.playerStats.factoryProductionLines.every(line => line.slots && Array.isArray(line.slots) && typeof line.isUnlocked === 'boolean')
            ? (importedData.playerStats.factoryProductionLines.length === 5 ? importedData.playerStats.factoryProductionLines : initialDefaults.factoryProductionLines)
            : initialDefaults.factoryProductionLines,
        factoryPowerBuildings: Array.isArray(importedData.playerStats.factoryPowerBuildings) ? importedData.playerStats.factoryPowerBuildings : initialDefaults.factoryPowerBuildings,
        factoryProducedComponents: typeof importedData.playerStats.factoryProducedComponents === 'object' && importedData.playerStats.factoryProducedComponents !== null ? importedData.playerStats.factoryProducedComponents : initialDefaults.factoryProducedComponents,
        factoryMaterialCollectors: Array.isArray(importedData.playerStats.factoryMaterialCollectors) ? importedData.playerStats.factoryMaterialCollectors : initialDefaults.factoryMaterialCollectors,
        factoryProductionProgress: typeof importedData.playerStats.factoryProductionProgress === 'object' && importedData.playerStats.factoryProductionProgress !== null ? importedData.playerStats.factoryProductionProgress : {},
        factoryWorkers: Array.isArray(importedData.playerStats.factoryWorkers) ? importedData.playerStats.factoryWorkers : initialDefaults.factoryWorkers,
        researchPoints: typeof importedData.playerStats.researchPoints === 'number' ? importedData.playerStats.researchPoints : initialDefaults.researchPoints,
        unlockedResearchIds: Array.isArray(importedData.playerStats.unlockedResearchIds) ? importedData.playerStats.unlockedResearchIds : initialDefaults.unlockedResearchIds,
        lastManualResearchTimestamp: typeof importedData.playerStats.lastManualResearchTimestamp === 'number' ? importedData.playerStats.lastManualResearchTimestamp : initialDefaults.lastManualResearchTimestamp,
        currentWorkerEnergyTier: typeof importedData.playerStats.currentWorkerEnergyTier === 'number' ? importedData.playerStats.currentWorkerEnergyTier : initialDefaults.currentWorkerEnergyTier,
        manualResearchBonus: typeof importedData.playerStats.manualResearchBonus === 'number' ? importedData.playerStats.manualResearchBonus : initialDefaults.manualResearchBonus,
      };
      setPlayerStats(mergedPlayerStats);
      setBusinesses(() => INITIAL_BUSINESSES.map(initialBiz => {
            const savedBusinessState = importedData.businesses.find(b => b.id === initialBiz.id);
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
      setLastSavedTimestamp(importedData.lastSaved || Date.now());
      materialCollectionCooldownEndRef.current = mergedPlayerStats.lastManualResearchTimestamp ? mergedPlayerStats.lastManualResearchTimestamp + MATERIAL_COLLECTION_COOLDOWN_MS : 0;
      manualResearchCooldownEndRef.current = mergedPlayerStats.lastManualResearchTimestamp ? mergedPlayerStats.lastManualResearchTimestamp + RESEARCH_MANUAL_COOLDOWN_MS : 0;
      setMaterialCollectionCooldownEnd(materialCollectionCooldownEndRef.current);
      setManualResearchCooldownEnd(manualResearchCooldownEndRef.current);

      success = true;
      toastTitle = "Game Loaded Successfully!";
      toastDescription = "Your game state has been imported.";
    } catch (error) {
      console.error("Error importing game state:", error);
      toastTitle = "Import Error";
      toastDescription = `Failed to import save data. ${error instanceof Error ? error.message : 'Unknown error.'}`;
      toastVariant = "destructive";
      success = false;
    }
    if(toastTitle) toastRef.current({ title: toastTitle, description: toastDescription, variant: toastVariant});
    return success;
  }, []);

  const wipeGameData = useCallback(() => {
    let toastTitle = "Game Data Wiped";
    let toastDescription = "All progress has been reset to default.";
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
    toastRef.current({ title: toastTitle, description: toastDescription, variant: "destructive"});
  }, []);

  const purchaseBusinessUpgrade = useCallback((businessId: string, upgradeId: string, isAutoBuy: boolean = false): boolean => {
    let success = false;
    let toastTitle = "";
    let toastDescription = "";
    let toastVariant: "default" | "destructive" = "default";

    const playerStatsNow = playerStatsRef.current;
    const businessToUpdate = businessesRef.current.find(b => b.id === businessId);

    if (!businessToUpdate || !businessToUpdate.upgrades) {
      toastTitle = "Error";
      toastDescription = "Business or upgrades not found.";
      toastVariant = "destructive";
    } else {
      const businessIndexInConfig = INITIAL_BUSINESSES.findIndex(b => b.id === businessId);
      if (playerStatsNow.timesPrestiged < businessIndexInConfig && !isAutoBuy) {
        toastTitle = "Locked";
        toastDescription = `This business unlocks after ${businessIndexInConfig} prestige(s).`;
        toastVariant = "destructive";
      } else {
        const upgrade = businessToUpdate.upgrades.find(u => u.id === upgradeId);
        if (!upgrade) {
          toastTitle = "Error";
          toastDescription = "Upgrade definition not found.";
          toastVariant = "destructive";
        } else if (upgrade.isPurchased) {
          if(!isAutoBuy) {
            toastTitle = "Already Owned";
            toastDescription = "You already own this upgrade.";
          }
        } else if (businessToUpdate.level < upgrade.requiredLevel) {
          toastTitle = "Level Requirement Not Met";
          toastDescription = `${businessToUpdate.name} must be level ${upgrade.requiredLevel} for this upgrade.`;
          toastVariant = "destructive";
        } else {
          let actualCost = upgrade.cost;
          let globalUpgradeCostReduction = 0;
          (playerStatsNow.unlockedSkillIds || []).forEach(skillId => {
              const skill = skillTreeRef.current.find(s => s.id === skillId);
              if (skill && skill.effects && skill.effects.globalBusinessUpgradeCostReductionPercent) { globalUpgradeCostReduction += skill.effects.globalBusinessUpgradeCostReductionPercent; }
          });
          if (globalUpgradeCostReduction > 0) {
              actualCost *= (1 - globalUpgradeCostReduction / 100);
              actualCost = Math.max(0, Math.floor(actualCost));
          }

          if (playerStatsNow.money < actualCost) {
            toastTitle = "Not Enough Money";
            toastDescription = `You need $${Number(actualCost).toLocaleString('en-US', { maximumFractionDigits: 0 })} to purchase ${upgrade.name}.`;
            toastVariant = "destructive";
          } else {
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
            setBusinesses(prevBusinesses => {
                const newBusinesses = prevBusinesses.map(b => b.id === businessId ? { ...b, upgrades: b.upgrades?.map(u => u.id === upgradeId ? { ...u, isPurchased: true } : u) } : b );
                businessesRef.current = newBusinesses;
                return newBusinesses;
            });
            success = true;
            toastTitle = isAutoBuy ? "Auto-Upgrade!" : "Upgrade Purchased!";
            toastDescription = isAutoBuy ? `${upgrade.name} for ${businessToUpdate.name}` : `${upgrade.name} for ${businessToUpdate.name} is now active.`;
          }
        }
      }
    }

    if (toastTitle && (!isAutoBuy || toastVariant === "destructive")) {
      toastRef.current({ title: toastTitle, description: toastDescription, variant: toastVariant, duration: isAutoBuy ? 1500 : 3000 });
    }
    return success;
  }, []);

  const upgradeBusiness = useCallback((businessId: string, levelsToAttempt: number = 1) => {
    let toastTitle = "";
    let toastDescription = "";
    let toastVariant: "default" | "destructive" = "default";
    const playerStatsNow = playerStatsRef.current;
    const businessToUpdate = businessesRef.current.find(b => b.id === businessId);

    if (!businessToUpdate) {
      toastTitle = "Business Not Found";
      toastVariant = "destructive";
    } else {
      const businessIndexInConfig = INITIAL_BUSINESSES.findIndex(b => b.id === businessId);
      if (playerStatsNow.timesPrestiged < businessIndexInConfig) {
        toastTitle = "Locked";
        toastDescription = `This business unlocks after prestiging ${businessIndexInConfig} time(s). (Currently: ${playerStatsNow.timesPrestiged})`;
        toastVariant = "destructive";
      } else {
        const currentDynamicMaxLevel = getDynamicMaxBusinessLevel();
        if (businessToUpdate.level >= currentDynamicMaxLevel) {
          toastTitle = "Max Level Reached!";
          toastDescription = `${businessToUpdate.name} is already at the maximum level (${currentDynamicMaxLevel}).`;
        } else {
          const { totalCost, levelsPurchasable } = calculateCostForNLevels( businessToUpdate, levelsToAttempt, playerStatsNow.unlockedSkillIds, skillTreeRef.current, currentDynamicMaxLevel, playerStatsNow.hqUpgradeLevels, hqUpgradesRef.current );

          if (levelsPurchasable === 0) {
            toastTitle = "Cannot level up";
            toastDescription = `${businessToUpdate.name} is at max level or no levels can be purchased.`;
          } else if (playerStatsNow.money < totalCost) {
            toastTitle = "Not enough money!";
            toastDescription = `You need $${Number(totalCost).toLocaleString('en-US', { maximumFractionDigits: 0 })} to level up ${businessToUpdate.name} by ${levelsPurchasable} level(s).`;
            toastVariant = "destructive";
          } else {
            const newLevelAfterUpgrade = businessToUpdate.level + levelsPurchasable;
            let newAchievedBusinessMilestones = { ...(playerStatsNow.achievedBusinessMilestones || {}) };
            if (newLevelAfterUpgrade >= currentDynamicMaxLevel && !(newAchievedBusinessMilestones[businessId]?.maxLevelReached)) {
                newAchievedBusinessMilestones[businessId] = { ...(newAchievedBusinessMilestones[businessId] || {}), maxLevelReached: true, };
            }

            setPlayerStats(prev => ({ ...prev, money: prev.money - totalCost, achievedBusinessMilestones: newAchievedBusinessMilestones, }));
            setBusinesses(prevBusinesses => {
                const newBusinesses = prevBusinesses.map(b => b.id === businessId ? { ...b, level: newLevelAfterUpgrade } : b );
                businessesRef.current = newBusinesses;
                return newBusinesses;
            });
            toastTitle = "Business Leveled Up!";
            toastDescription = `${businessToUpdate.name} is now level ${newLevelAfterUpgrade} (+${levelsPurchasable}).`;
          }
        }
      }
    }
    if(toastTitle) toastRef.current({ title: toastTitle, description: toastDescription, variant: toastVariant });
  }, [getDynamicMaxBusinessLevel]);

  const buyStock = useCallback((stockId: string, sharesToBuyInput: number) => {
    let toastTitle = "";
    let toastDescription = "";
    let toastVariant: "default" | "destructive" = "default";

    const playerStatsNow = playerStatsRef.current;
    const stock = unlockedStocksRef.current.find(s => s.id === stockId);

    if (!stock) {
      toastTitle = "Stock Not Found";
      toastDescription = "This stock is not available or does not exist.";
      toastVariant = "destructive";
    } else if (playerStatsNow.timesPrestiged < 8) {
      toastTitle = "Stocks Locked";
      toastDescription = "You need to prestige at least 8 times to access the stock market.";
      toastVariant = "destructive";
    } else if (sharesToBuyInput <= 0) {
      toastTitle = "Invalid Amount";
      toastDescription = "Number of shares must be positive.";
      toastVariant = "destructive";
    } else {
      const initialStockData = INITIAL_STOCKS.find(is => is.id === stockId);
      if (!initialStockData) {
        toastTitle = "Stock Config Error";
        toastVariant = "destructive";
      } else {
        const existingHolding = playerStatsNow.stockHoldings.find(h => h.stockId === stockId);
        const sharesAlreadyOwnedByPlayer = existingHolding?.shares || 0;
        const sharesAvailableToBuy = initialStockData.totalOutstandingShares - sharesAlreadyOwnedByPlayer;

        if (sharesAvailableToBuy <= 0) {
          toastTitle = "No Shares Available";
          toastDescription = `All outstanding shares of ${stock.companyName} (${stock.ticker}) are accounted for.`;
        } else {
          let sharesToBuy = sharesToBuyInput;
          if (sharesToBuyInput > sharesAvailableToBuy) {
            toastTitle = "Purchase Adjusted";
            toastDescription = `Only ${sharesAvailableToBuy.toLocaleString('en-US')} shares available. Purchase adjusted.`;
            sharesToBuy = sharesAvailableToBuy;
          }

          if (sharesToBuy <= 0) {
            toastTitle = "No Shares to Buy";
            toastDescription = `No shares of ${stock.companyName} (${stock.ticker}) could be purchased.`;
            toastVariant = "destructive";
          } else {
            const cost = stock.price * sharesToBuy;
            if (playerStatsNow.money < cost) {
              toastTitle = "Not Enough Money";
              toastDescription = `You need $${Number(cost).toLocaleString('en-US', { maximumFractionDigits: 0 })} to buy ${sharesToBuy.toLocaleString('en-US')} share(s).`;
              toastVariant = "destructive";
            } else {
              setPlayerStats(prev => ({
                ...prev,
                money: prev.money - cost,
                stockHoldings: prev.stockHoldings.find(h => h.stockId === stockId)
                  ? prev.stockHoldings.map(h => h.stockId === stockId ? { ...h, shares: h.shares + sharesToBuy, averagePurchasePrice: ((h.averagePurchasePrice * h.shares) + (stock.price * sharesToBuy)) / (h.shares + sharesToBuy) } : h)
                  : [...prev.stockHoldings, { stockId, shares: sharesToBuy, averagePurchasePrice: stock.price }]
              }));
              toastTitle = "Stock Purchased!";
              toastDescription = `Bought ${sharesToBuy.toLocaleString('en-US')} share(s) of ${stock.companyName}.`;
            }
          }
        }
      }
    }
    if(toastTitle) toastRef.current({ title: toastTitle, description: toastDescription, variant: toastVariant });
  }, []);

  const sellStock = useCallback((stockId: string, sharesToSell: number) => {
    let toastTitle = "";
    let toastDescription = "";
    let toastVariant: "default" | "destructive" = "default";

    const playerStatsNow = playerStatsRef.current;
    const stock = unlockedStocksRef.current.find(s => s.id === stockId);

    if (!stock) {
      toastTitle = "Stock Not Found";
      toastVariant = "destructive";
    } else if (playerStatsNow.timesPrestiged < 8) {
      toastTitle = "Stocks Locked";
      toastDescription = "You need to prestige at least 8 times to access the stock market.";
      toastVariant = "destructive";
    } else if (sharesToSell <= 0) {
      toastTitle = "Invalid Amount";
      toastDescription = "Number of shares must be positive.";
      toastVariant = "destructive";
    } else {
      const existingHolding = playerStatsNow.stockHoldings.find(h => h.stockId === stockId);
      if (!existingHolding || existingHolding.shares < sharesToSell) {
        toastTitle = "Not Enough Shares";
        toastDescription = `You only own ${existingHolding?.shares || 0} share(s).`;
        toastVariant = "destructive";
      } else {
        const earnings = stock.price * sharesToSell;
        setPlayerStats(prev => ({
          ...prev,
          money: prev.money + earnings,
          stockHoldings: existingHolding.shares === sharesToSell
            ? prev.stockHoldings.filter(h => h.stockId !== stockId)
            : prev.stockHoldings.map(h => h.stockId === stockId ? { ...h, shares: h.shares - sharesToSell } : h)
        }));
        toastTitle = "Stock Sold!";
        toastDescription = `Sold ${sharesToSell.toLocaleString('en-US')} share(s) of ${stock.companyName}.`;
      }
    }
    if(toastTitle) toastRef.current({ title: toastTitle, description: toastDescription, variant: toastVariant });
  }, []);

  const unlockSkillNode = useCallback((skillId: string) => {
    let toastTitle = "";
    let toastDescription = "";
    let toastVariant: "default" | "destructive" = "default";
    const playerStatsNow = playerStatsRef.current;
    const skill = skillTreeRef.current.find(s => s.id === skillId);

    if (!skill) {
      toastTitle = "Skill Not Found";
      toastVariant = "destructive";
    } else if ((playerStatsNow.unlockedSkillIds || []).includes(skillId)) {
      toastTitle = "Skill Already Unlocked";
    } else if (playerStatsNow.prestigePoints < skill.cost) {
      toastTitle = "Not Enough Prestige Points";
      toastDescription = `Need ${skill.cost} PP. You have ${playerStatsNow.prestigePoints}.`;
      toastVariant = "destructive";
    } else if (skill.dependencies && skill.dependencies.some(depId => !(playerStatsNow.unlockedSkillIds || []).includes(depId))) {
      toastTitle = "Dependencies Not Met";
      toastDescription = "Unlock prerequisite skills first.";
      toastVariant = "destructive";
    } else {
      setPlayerStats(prev => ({
        ...prev,
        prestigePoints: prev.prestigePoints - skill.cost,
        unlockedSkillIds: [...(prev.unlockedSkillIds || []), skillId],
      }));
      toastTitle = "Skill Unlocked!";
      toastDescription = `${skill.name} is now active.`;
    }
    if(toastTitle) toastRef.current({ title: toastTitle, description: toastDescription, variant: toastVariant });
  }, []);

  const purchaseHQUpgrade = useCallback((upgradeId: string) => {
    let toastTitle = "";
    let toastDescription = "";
    let toastVariant: "default" | "destructive" = "default";

    const playerStatsNow = playerStatsRef.current;
    const upgradeConfig = hqUpgradesRef.current.find(u => u.id === upgradeId);

    if (!upgradeConfig) {
      toastTitle = "HQ Upgrade Not Found";
      toastVariant = "destructive";
    } else {
      const currentLevel = playerStatsNow.hqUpgradeLevels[upgradeId] || 0;
      const nextLevel = currentLevel + 1;
      const nextLevelData = upgradeConfig.levels.find(l => l.level === nextLevel);
      if (!nextLevelData) {
        toastTitle = "Max Level Reached";
        toastDescription = `${upgradeConfig.name} is already at its maximum level.`;
      } else if (upgradeConfig.requiredTimesPrestiged && playerStatsNow.timesPrestiged < upgradeConfig.requiredTimesPrestiged) {
        toastTitle = "Prestige Requirement Not Met";
        toastDescription = `This HQ upgrade requires ${upgradeConfig.requiredTimesPrestiged} prestige(s).`;
        toastVariant = "destructive";
      } else if (playerStatsNow.money < nextLevelData.costMoney) {
        toastTitle = "Not Enough Money";
        toastDescription = `Need $${Number(nextLevelData.costMoney).toLocaleString('en-US', { maximumFractionDigits: 0 })}.`;
        toastVariant = "destructive";
      } else if (nextLevelData.costPrestigePoints && playerStatsNow.prestigePoints < nextLevelData.costPrestigePoints) {
        toastTitle = "Not Enough Prestige Points";
        toastDescription = `Need ${nextLevelData.costPrestigePoints} PP.`;
        toastVariant = "destructive";
      } else {
        setPlayerStats(prev => ({
          ...prev,
          money: prev.money - nextLevelData.costMoney,
          prestigePoints: nextLevelData.costPrestigePoints ? prev.prestigePoints - nextLevelData.costPrestigePoints : prev.prestigePoints,
          hqUpgradeLevels: { ...prev.hqUpgradeLevels, [upgradeId]: nextLevel },
        }));
        toastTitle = "HQ Upgrade Purchased!";
        toastDescription = `${upgradeConfig.name} upgraded to Level ${nextLevel}.`;
      }
    }
    if(toastTitle) toastRef.current({ title: toastTitle, description: toastDescription, variant: toastVariant });
  }, []);

  const purchaseFactoryBuilding = useCallback(() => {
    let toastTitle = "";
    let toastDescription = "";
    let toastVariant: "default" | "destructive" = "default";

    const playerStatsNow = playerStatsRef.current;

    if (playerStatsNow.factoryPurchased) {
      toastTitle = "Factory Already Owned";
      toastDescription = "You have already purchased the factory building.";
    } else if (playerStatsNow.money < FACTORY_PURCHASE_COST) {
      toastTitle = "Not Enough Money";
      toastDescription = `You need $${FACTORY_PURCHASE_COST.toLocaleString()} to purchase the factory.`;
      toastVariant = "destructive";
    } else {
      setPlayerStats(prev => ({ ...prev, money: prev.money - FACTORY_PURCHASE_COST, factoryPurchased: true, }));
      toastTitle = "Factory Purchased!";
      toastDescription = "You can now start building your industrial empire!";
    }
    if(toastTitle) toastRef.current({ title: toastTitle, description: toastDescription, variant: toastVariant });
  }, []);

  const purchaseFactoryPowerBuilding = useCallback((configId: string) => {
    let toastTitle = "";
    let toastDescription = "";
    let toastVariant: "default" | "destructive" = "default";
    const playerStatsNow = playerStatsRef.current;
    const config = INITIAL_FACTORY_POWER_BUILDINGS_CONFIG.find(c => c.id === configId);

    if (!config) {
      toastTitle = "Power Building Not Found";
      toastVariant = "destructive";
    } else if (!playerStatsNow.factoryPurchased) {
      toastTitle = "Factory Not Owned";
      toastDescription = "Purchase the factory building first.";
      toastVariant = "destructive";
    } else if (config.requiredResearchId && !(playerStatsNow.unlockedResearchIds || []).includes(config.requiredResearchId)) {
        const researchItem = researchItemsRef.current.find(r => r.id === config.requiredResearchId);
        toastTitle = "Research Required";
        toastDescription = `Building ${config.name} requires '${researchItem?.name || config.requiredResearchId}' research.`;
        toastVariant = "destructive";
    } else {
      const numOwned = (playerStatsNow.factoryPowerBuildings || []).filter(pb => pb.configId === configId).length;
      if (config.maxInstances !== undefined && numOwned >= config.maxInstances) {
        toastTitle = "Max Instances Reached";
        toastDescription = `You already own the maximum of ${config.maxInstances} ${config.name}(s).`;
      } else {
        const costForNext = config.baseCost * Math.pow(config.costMultiplier || 1.1, numOwned);
        if (playerStatsNow.money < costForNext) {
          toastTitle = "Not Enough Money";
          toastDescription = `Need $${costForNext.toLocaleString()} for the next ${config.name}.`;
          toastVariant = "destructive";
        } else {
          setPlayerStats(prev => {
            const newBuilding: FactoryPowerBuilding = { instanceId: `${configId}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`, configId: config.id, level: 1 };
            const updatedPowerBuildings = [...(prev.factoryPowerBuildings || []), newBuilding];
            return { ...prev, money: prev.money - costForNext, factoryPowerBuildings: updatedPowerBuildings };
          });
          toastTitle = "Power Building Purchased!";
          toastDescription = `Built a new ${config.name}. Total power will update next tick.`;
        }
      }
    }
    if(toastTitle) toastRef.current({ title: toastTitle, description: toastDescription, variant: toastVariant });
  }, []);

  const manuallyCollectRawMaterials = useCallback(() => {
    let toastTitle = "";
    let toastDescription = "";
    let toastVariant: "default" | "destructive" = "default";
    const playerStatsNow = playerStatsRef.current;

    if (!playerStatsNow.factoryPurchased) {
     toastTitle = "Factory Not Owned";
     toastDescription = "Purchase the factory building first.";
     toastVariant = "destructive";
    } else {
      const now = Date.now();
      if (now < materialCollectionCooldownEndRef.current) {
          const timeLeft = Math.ceil((materialCollectionCooldownEndRef.current - now) / 1000);
          toastTitle = "On Cooldown";
          toastDescription = `Please wait ${timeLeft}s before collecting again.`;
      } else {
        setPlayerStats(prev => ({ ...prev, factoryRawMaterials: prev.factoryRawMaterials + MATERIAL_COLLECTION_AMOUNT }));
        materialCollectionCooldownEndRef.current = now + MATERIAL_COLLECTION_COOLDOWN_MS;
        setMaterialCollectionCooldownEnd(materialCollectionCooldownEndRef.current);
        toastTitle = "Materials Collected!";
        toastDescription = `+${MATERIAL_COLLECTION_AMOUNT} Raw Materials added.`;
      }
    }
    if(toastTitle) toastRef.current({ title: toastTitle, description: toastDescription, variant: toastVariant });
  }, []);

  const purchaseFactoryMachine = useCallback((configId: string) => {
    let toastTitle = "";
    let toastDescription = "";
    let toastVariant: "default" | "destructive" = "default";
    let machineReplacedAnother = false;
    let oldMachineName: string | undefined;
    let replacedLineName: string | undefined;
    let replacedSlotIndex: number | undefined;

    const playerStatsNow = playerStatsRef.current;
    const newMachineConfig = INITIAL_FACTORY_MACHINE_CONFIGS.find(mc => mc.id === configId);

    if (!newMachineConfig) {
        toastTitle = "Machine Type Not Found";
        toastVariant = "destructive";
    } else if (!playerStatsNow.factoryPurchased) {
        toastTitle = "Factory Not Owned";
        toastDescription = "Purchase the factory building first.";
        toastVariant = "destructive";
    } else if (newMachineConfig.requiredResearchId && !(playerStatsNow.unlockedResearchIds || []).includes(newMachineConfig.requiredResearchId)) {
        const researchItem = researchItemsRef.current.find(r => r.id === newMachineConfig.requiredResearchId);
        toastTitle = "Research Required";
        toastDescription = `Purchase of ${newMachineConfig.name} requires '${researchItem?.name || newMachineConfig.requiredResearchId}' research.`;
        toastVariant = "destructive";
    } else if (playerStatsNow.money < newMachineConfig.baseCost) {
        toastTitle = "Not Enough Money";
        toastDescription = `Need $${newMachineConfig.baseCost.toLocaleString()} to build a ${newMachineConfig.name}.`;
        toastVariant = "destructive";
    } else {
        const newMachineInstance: FactoryMachine = {
            instanceId: `${configId}_machine_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            configId: newMachineConfig.id,
            assignedProductionLineId: null,
            purchasedUpgradeIds: [],
        };

        let replacementCandidate: { lineId: string; slotIndex: number; machineInstanceIdToReplace: string; markOfMachineToReplace: number; } | null = null;

        if (newMachineConfig.familyId && typeof newMachineConfig.mark === 'number') {
            const candidates = [];
            for (const line of (playerStatsNow.factoryProductionLines || [])) {
                if (!line.isUnlocked) continue;
                for (let slotIdx = 0; slotIdx < line.slots.length; slotIdx++) {
                    const slot = line.slots[slotIdx];
                    if (slot.machineInstanceId) {
                        const existingMachine = (playerStatsNow.factoryMachines || []).find(m => m.instanceId === slot.machineInstanceId);
                        if (existingMachine) {
                            const existingMachineConfig = INITIAL_FACTORY_MACHINE_CONFIGS.find(mc => mc.id === existingMachine.configId);
                            if (existingMachineConfig && existingMachineConfig.familyId === newMachineConfig.familyId && typeof existingMachineConfig.mark === 'number' && existingMachineConfig.mark < newMachineConfig.mark) {
                                candidates.push({ lineId: line.id, slotIndex: slotIdx, machineInstanceIdToReplace: slot.machineInstanceId, markOfMachineToReplace: existingMachineConfig.mark });
                            }
                        }
                    }
                }
            }
            if (candidates.length > 0) {
                candidates.sort((a, b) => a.markOfMachineToReplace - b.markOfMachineToReplace);
                replacementCandidate = candidates[0];
            }
        }

        if (replacementCandidate) {
            const machineToRemoveId = replacementCandidate.machineInstanceIdToReplace;
            const oldMachineInstance = (playerStatsNow.factoryMachines || []).find(m => m.instanceId === machineToRemoveId);
            const oldMachineConfig = oldMachineInstance ? INITIAL_FACTORY_MACHINE_CONFIGS.find(mc => mc.id === oldMachineInstance.configId) : undefined;
            oldMachineName = oldMachineConfig?.name;
            replacedLineName = (playerStatsNow.factoryProductionLines || []).find(l => l.id === replacementCandidate!.lineId)?.name;
            replacedSlotIndex = replacementCandidate.slotIndex;

            newMachineInstance.assignedProductionLineId = replacementCandidate.lineId;
            newMachineInstance.purchasedUpgradeIds = [];


            machineReplacedAnother = true;

            setPlayerStats(prev => {
                const updatedMachines = (prev.factoryMachines || []).filter(m => m.instanceId !== machineToRemoveId).concat(newMachineInstance);
                const updatedProductionLines = (prev.factoryProductionLines || []).map(line => {
                    if (line.id === replacementCandidate!.lineId) {
                        const newSlots = [...line.slots];
                        newSlots[replacementCandidate!.slotIndex] = { ...newSlots[replacementCandidate!.slotIndex], machineInstanceId: newMachineInstance.instanceId };
                        return { ...line, slots: newSlots };
                    }
                    return line;
                });
                let updatedWorkers = [...(prev.factoryWorkers || [])];
                const workerIndex = updatedWorkers.findIndex(w => w.assignedMachineInstanceId === machineToRemoveId);
                if (workerIndex !== -1) {
                    updatedWorkers[workerIndex] = { ...updatedWorkers[workerIndex], assignedMachineInstanceId: newMachineInstance.instanceId };
                }

                return {
                    ...prev,
                    money: prev.money - newMachineConfig.baseCost,
                    factoryMachines: updatedMachines,
                    factoryProductionLines: updatedProductionLines,
                    factoryWorkers: updatedWorkers,
                };
            });
        } else {
            setPlayerStats(prev => ({
                ...prev,
                money: prev.money - newMachineConfig.baseCost,
                factoryMachines: [...(prev.factoryMachines || []), newMachineInstance],
            }));
        }

        if (machineReplacedAnother && oldMachineName && replacedLineName && replacedSlotIndex !== undefined) {
            toastTitle = "Machine Upgraded!";
            toastDescription = `${oldMachineName} in ${replacedLineName}, Slot ${replacedSlotIndex + 1} was replaced by ${newMachineConfig.name}.`;
        } else {
            toastTitle = "Machine Built!";
            toastDescription = `${newMachineConfig.name} is ready and unassigned.`;
        }
    }

    if (toastTitle) {
        toastRef.current({ title: toastTitle, description: toastDescription, variant: toastVariant });
    }
  }, []);

  const purchaseFactoryMachineUpgrade = useCallback((machineInstanceId: string, upgradeId: string) => {
    let toastTitle = "";
    let toastDescription = "";
    let toastVariant: "default" | "destructive" = "default";

    const playerStatsNow = playerStatsRef.current;
    const machineInstance = (playerStatsNow.factoryMachines || []).find(m => m.instanceId === machineInstanceId);

    if (!machineInstance) {
        toastTitle = "Machine Instance Not Found";
        toastVariant = "destructive";
    } else {
        const machineConfig = INITIAL_FACTORY_MACHINE_CONFIGS.find(mc => mc.id === machineInstance.configId);
        if (!machineConfig || !machineConfig.upgrades) {
            toastTitle = "Machine Config or Upgrades Not Found";
            toastVariant = "destructive";
        } else {
            const upgradeConfig = machineConfig.upgrades.find(upg => upg.id === upgradeId);
            if (!upgradeConfig) {
                toastTitle = "Machine Upgrade Not Found";
                toastVariant = "destructive";
            } else if ((machineInstance.purchasedUpgradeIds || []).includes(upgradeId)) {
                toastTitle = "Upgrade Already Purchased";
                toastDescription = `This machine already has the ${upgradeConfig.name} upgrade.`;
            } else if (upgradeConfig.requiredResearchId && !(playerStatsNow.unlockedResearchIds || []).includes(upgradeConfig.requiredResearchId)) {
                const researchItem = researchItemsRef.current.find(r => r.id === upgradeConfig.requiredResearchId);
                toastTitle = "Research Required";
                toastDescription = `Purchasing ${upgradeConfig.name} requires '${researchItem?.name || upgradeConfig.requiredResearchId}' research.`;
                toastVariant = "destructive";
            } else if (playerStatsNow.money < upgradeConfig.costMoney) {
                toastTitle = "Not Enough Money";
                toastDescription = `Need $${upgradeConfig.costMoney.toLocaleString()} for ${upgradeConfig.name}.`;
                toastVariant = "destructive";
            } else if (upgradeConfig.costRP && playerStatsNow.researchPoints < upgradeConfig.costRP) {
                toastTitle = "Not Enough Research Points";
                toastDescription = `Need ${upgradeConfig.costRP} RP for ${upgradeConfig.name}.`;
                toastVariant = "destructive";
            } else {
                setPlayerStats(prev => {
                    const updatedMachines = (prev.factoryMachines || []).map(m => {
                        if (m.instanceId === machineInstanceId) {
                            return { ...m, purchasedUpgradeIds: [...(m.purchasedUpgradeIds || []), upgradeId] };
                        }
                        return m;
                    });
                    return {
                        ...prev,
                        money: prev.money - upgradeConfig.costMoney,
                        researchPoints: upgradeConfig.costRP ? prev.researchPoints - upgradeConfig.costRP : prev.researchPoints,
                        factoryMachines: updatedMachines,
                    };
                });
                toastTitle = "Machine Upgrade Purchased!";
                toastDescription = `${upgradeConfig.name} applied to ${machineConfig.name}.`;
            }
        }
    }
    if (toastTitle) toastRef.current({ title: toastTitle, description: toastDescription, variant: toastVariant });
  }, []);


  const setRecipeForProductionSlot = useCallback((productionLineId: string, slotIndex: number, targetComponentId: string | null) => {
    let toastTitle = "";
    let toastDescription = "";
    let toastVariant: "default" | "destructive" = "default";
    let machineNameForToast = "Machine";
    let productionLineNameForToast = "Production Line";
    const playerStatsNow = playerStatsRef.current;
    const currentDynamicMaxEnergy = getDynamicMaxWorkerEnergy();


    const lineIndex = (playerStatsNow.factoryProductionLines || []).findIndex(line => line.id === productionLineId);
    if (lineIndex === -1) {
      toastTitle = "Error";
      toastDescription = "Production line not found.";
      toastVariant = "destructive";
    } else {
      const productionLine = playerStatsNow.factoryProductionLines[lineIndex];
      if(!productionLine.isUnlocked) {
        toastTitle = "Line Locked";
        toastDescription = "Cannot set recipe on a locked production line.";
        toastVariant = "destructive";
      } else {
          productionLineNameForToast = productionLine.name;
          if (slotIndex < 0 || slotIndex >= productionLine.slots.length) {
            toastTitle = "Error";
            toastDescription = "Invalid slot index.";
            toastVariant = "destructive";
          } else {
            const slot = productionLine.slots[slotIndex];
            if (!slot.machineInstanceId) {
              toastTitle = "No Machine";
              toastDescription = "No machine assigned to this slot to set a recipe for.";
              toastVariant = "destructive";
            } else {
              const machineInstance = (playerStatsNow.factoryMachines || []).find(m => m.instanceId === slot.machineInstanceId);
              if (!machineInstance) {
                toastTitle = "Error";
                toastDescription = "Assigned machine data not found.";
                toastVariant = "destructive";
              } else {
                const machineConfig = INITIAL_FACTORY_MACHINE_CONFIGS.find(mc => mc.id === machineInstance.configId);
                if (!machineConfig) {
                  toastTitle = "Error";
                  toastDescription = "Machine configuration not found.";
                  toastVariant = "destructive";
                } else {
                  machineNameForToast = machineConfig.name;
                  if (targetComponentId !== null) {
                    const componentRecipe = INITIAL_FACTORY_COMPONENTS_CONFIG.find(cc => cc.id === targetComponentId);
                    if (!componentRecipe) {
                      toastTitle = "Error";
                      toastDescription = "Target component recipe not found.";
                      toastVariant = "destructive";
                    } else if (machineConfig.maxCraftableTier < componentRecipe.tier) {
                      toastTitle = "Cannot Craft";
                      toastDescription = `${machineConfig.name} (Tier ${machineConfig.maxCraftableTier}) cannot craft ${componentRecipe.name} (Tier ${componentRecipe.tier}).`;
                      toastVariant = "destructive";
                    }
                  }
                  if(toastVariant === "default"){
                     setPlayerStats(prev => {
                        const updatedProductionLines = (prev.factoryProductionLines || []).map((line, idx) => {
                            if (idx === lineIndex) {
                                const updatedSlots = [...line.slots];
                                updatedSlots[slotIndex] = { ...updatedSlots[slotIndex], targetComponentId: targetComponentId };
                                return { ...line, slots: updatedSlots };
                            }
                            return line;
                        });
                        const workerIndex = (prev.factoryWorkers || []).findIndex(w => w.assignedMachineInstanceId === slot.machineInstanceId);
                        let updatedWorkers = [...(prev.factoryWorkers || [])];
                        if (workerIndex !== -1) {
                            if (targetComponentId !== null && updatedWorkers[workerIndex].status === 'idle' && updatedWorkers[workerIndex].energy > 0) {
                               updatedWorkers[workerIndex] = { ...updatedWorkers[workerIndex], status: 'working' };
                            } else if (targetComponentId === null && updatedWorkers[workerIndex].status === 'working') {
                               updatedWorkers[workerIndex] = { ...updatedWorkers[workerIndex], status: 'idle' };
                            }
                        }
                        return { ...prev, factoryProductionLines: updatedProductionLines, factoryWorkers: updatedWorkers };
                    });
                    if (targetComponentId) {
                        const component = INITIAL_FACTORY_COMPONENTS_CONFIG.find(c => c.id === targetComponentId);
                        toastTitle = "Recipe Set!";
                        toastDescription = `${machineNameForToast} in ${productionLineNameForToast} (Slot ${slotIndex + 1}) will now produce ${component?.name || 'component'}. Assigned worker set to 'working' if available.`;
                    } else {
                        toastTitle = "Recipe Cleared";
                        toastDescription = `${machineNameForToast} in ${productionLineNameForToast} (Slot ${slotIndex + 1}) is now idle. Assigned worker set to 'idle'.`;
                    }
                  }
                }
              }
            }
          }
      }
    }
     if(toastTitle) toastRef.current({ title: toastTitle, description: toastDescription, variant: toastVariant });
  }, [getDynamicMaxWorkerEnergy]);

  const purchaseFactoryMaterialCollector = useCallback((configId: string) => {
    let toastTitle = "";
    let toastDescription = "";
    let toastVariant: "default" | "destructive" = "default";
    const playerStatsNow = playerStatsRef.current;
    const config = INITIAL_FACTORY_MATERIAL_COLLECTORS_CONFIG.find(c => c.id === configId);

    if (!config) {
      toastTitle = "Material Collector Not Found";
      toastVariant = "destructive";
    } else if (!playerStatsNow.factoryPurchased) {
      toastTitle = "Factory Not Owned";
      toastDescription = "Purchase the factory building first.";
      toastVariant = "destructive";
    } else if (config.requiredResearchId && !(playerStatsNow.unlockedResearchIds || []).includes(config.requiredResearchId)) {
        const researchItem = researchItemsRef.current.find(r => r.id === config.requiredResearchId);
        toastTitle = "Research Required";
        toastDescription = `Building ${config.name} requires '${researchItem?.name || config.requiredResearchId}' research.`;
        toastVariant = "destructive";
    } else {
      const numOwned = (playerStatsNow.factoryMaterialCollectors || []).filter(mc => mc.configId === configId).length;
      if (config.maxInstances !== undefined && numOwned >= config.maxInstances) {
        toastTitle = "Max Instances Reached";
        toastDescription = `You already own the maximum of ${config.maxInstances} ${config.name}(s).`;
      } else {
        const costForNext = config.baseCost * Math.pow(config.costMultiplier || 1.15, numOwned);
        if (playerStatsNow.money < costForNext) {
          toastTitle = "Not Enough Money";
          toastDescription = `Need $${costForNext.toLocaleString()} for the next ${config.name}.`;
          toastVariant = "destructive";
        } else {
          setPlayerStats(prev => {
            const newCollector: FactoryMaterialCollector = { instanceId: `${configId}_collector_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`, configId: config.id, currentMaterialsPerSecond: config.materialsPerSecond, };
            const updatedCollectors = [...(prev.factoryMaterialCollectors || []), newCollector];
            return { ...prev, money: prev.money - costForNext, factoryMaterialCollectors: updatedCollectors, };
          });
          toastTitle = "Material Collector Deployed!";
          toastDescription = `A new ${config.name} is now active.`;
        }
      }
    }
    if(toastTitle) toastRef.current({ title: toastTitle, description: toastDescription, variant: toastVariant });
  }, []);

  const manuallyGenerateResearchPoints = useCallback(() => {
    let toastTitle = "";
    let toastDescription = "";
    let toastVariant: "default" | "destructive" = "default";
    const playerStatsNow = playerStatsRef.current;
    const pointsToGain = RESEARCH_MANUAL_GENERATION_AMOUNT + (playerStatsNow.manualResearchBonus || 0);

    if (!playerStatsNow.factoryPurchased) {
      toastTitle = "Factory Not Owned";
      toastDescription = "Purchase the factory building first.";
      toastVariant = "destructive";
    } else if (playerStatsNow.timesPrestiged < REQUIRED_PRESTIGE_LEVEL_FOR_RESEARCH_TAB) {
      toastTitle = "Research Locked";
      toastDescription = `Research tab unlocks at Prestige Level ${REQUIRED_PRESTIGE_LEVEL_FOR_RESEARCH_TAB}.`;
      toastVariant = "destructive";
    } else if (playerStatsNow.money < RESEARCH_MANUAL_GENERATION_COST_MONEY) {
      toastTitle = "Not Enough Money";
      toastDescription = `Need $${RESEARCH_MANUAL_GENERATION_COST_MONEY.toLocaleString()} to conduct research.`;
      toastVariant = "destructive";
    } else {
      const now = Date.now();
      if (now < manualResearchCooldownEndRef.current) {
          const timeLeft = Math.ceil((manualResearchCooldownEndRef.current - now) / 1000);
          toastTitle = "On Cooldown";
          toastDescription = `Please wait ${timeLeft}s before conducting research again.`;
      } else {
        setPlayerStats(prev => ({
          ...prev,
          money: prev.money - RESEARCH_MANUAL_GENERATION_COST_MONEY,
          researchPoints: prev.researchPoints + pointsToGain,
          lastManualResearchTimestamp: now,
        }));
        manualResearchCooldownEndRef.current = now + RESEARCH_MANUAL_COOLDOWN_MS;
        setManualResearchCooldownEnd(manualResearchCooldownEndRef.current);
        toastTitle = "Research Conducted!";
        toastDescription = `+${pointsToGain} Research Point(s) gained.`;
      }
    }
     if(toastTitle) toastRef.current({ title: toastTitle, description: toastDescription, variant: toastVariant });
  }, []);

  const purchaseResearch = useCallback((researchId: string) => {
    let toastTitle = "";
    let toastDescription = "";
    let toastVariant: "default" | "destructive" = "default";
    const playerStatsNow = playerStatsRef.current;
    const researchConfig = researchItemsRef.current.find(r => r.id === researchId);

    if (!researchConfig) {
      toastTitle = "Research Not Found";
      toastVariant = "destructive";
    } else if (!playerStatsNow.factoryPurchased) {
      toastTitle = "Factory Not Owned";
      toastDescription = "Purchase the factory building first.";
      toastVariant = "destructive";
    } else if (playerStatsNow.timesPrestiged < REQUIRED_PRESTIGE_LEVEL_FOR_RESEARCH_TAB) {
      toastTitle = "Research Locked";
      toastDescription = `Research tab unlocks at Prestige Level ${REQUIRED_PRESTIGE_LEVEL_FOR_RESEARCH_TAB}.`;
      toastVariant = "destructive";
    } else if ((playerStatsNow.unlockedResearchIds || []).includes(researchId)) {
      toastTitle = "Research Already Unlocked";
    } else if (researchConfig.dependencies && researchConfig.dependencies.some(depId => !(playerStatsNow.unlockedResearchIds || []).includes(depId))) {
      toastTitle = "Dependencies Not Met";
      toastDescription = "Unlock prerequisite research first.";
      toastVariant = "destructive";
    } else if (playerStatsNow.researchPoints < researchConfig.costRP) {
      toastTitle = "Not Enough Research Points";
      toastDescription = `Need ${researchConfig.costRP} RP.`;
      toastVariant = "destructive";
    } else if (researchConfig.costMoney && playerStatsNow.money < researchConfig.costMoney) {
      toastTitle = "Not Enough Money";
      toastDescription = `Need $${researchConfig.costMoney.toLocaleString()}.`;
      toastVariant = "destructive";
    } else {
      setPlayerStats(prev => {
        const newUnlockedResearchIds = [...(prev.unlockedResearchIds || []), researchId];
        let updatedProductionLines = [...(prev.factoryProductionLines || [])];
        let updatedCurrentWorkerEnergyTier = prev.currentWorkerEnergyTier;
        let updatedManualResearchBonus = prev.manualResearchBonus || 0;

        if (researchConfig.effects.unlocksProductionLineId) {
          const lineToUnlockId = researchConfig.effects.unlocksProductionLineId;
          updatedProductionLines = updatedProductionLines.map(line =>
            line.id === lineToUnlockId ? { ...line, isUnlocked: true } : line
          );
        }
        if (researchConfig.effects.upgradesWorkerEnergyTier) {
          updatedCurrentWorkerEnergyTier = Math.min(prev.currentWorkerEnergyTier + 1, WORKER_ENERGY_TIERS.length - 1);
        }
        if (researchConfig.effects.increaseManualResearchBonus) {
          updatedManualResearchBonus += researchConfig.effects.increaseManualResearchBonus;
        }


        return {
          ...prev,
          researchPoints: prev.researchPoints - researchConfig.costRP,
          money: researchConfig.costMoney ? prev.money - researchConfig.costMoney : prev.money,
          unlockedResearchIds: newUnlockedResearchIds,
          factoryProductionLines: updatedProductionLines,
          currentWorkerEnergyTier: updatedCurrentWorkerEnergyTier,
          manualResearchBonus: updatedManualResearchBonus,
        };
      });
      toastTitle = "Research Complete!";
      toastDescription = `${researchConfig.name} unlocked.`;
      if (researchConfig.effects.unlocksProductionLineId) {
        const line = playerStatsNow.factoryProductionLines.find(l => l.id === researchConfig.effects.unlocksProductionLineId);
        if (line) {
          toastDescription += ` ${line.name} is now available!`;
        }
      }
      if (researchConfig.effects.upgradesWorkerEnergyTier) {
        toastDescription += ` Max worker energy increased!`;
      }
      if (researchConfig.effects.increaseManualResearchBonus) {
        toastDescription += ` Manual RP generation increased by ${researchConfig.effects.increaseManualResearchBonus}!`;
      }
    }
    if(toastTitle) toastRef.current({ title: toastTitle, description: toastDescription, variant: toastVariant });
  }, []);

  const unlockProductionLine = useCallback((lineId: string) => {
    let toastTitle = "";
    let toastDescription = "";
    let toastVariant: "default" | "destructive" = "default";
    const playerStatsNow = playerStatsRef.current;

    const lineIndex = (playerStatsNow.factoryProductionLines || []).findIndex(l => l.id === lineId);
    if (lineIndex === -1) {
      toastTitle = "Error"; toastDescription = "Production line not found."; toastVariant = "destructive";
    } else {
      const line = playerStatsNow.factoryProductionLines[lineIndex];
      if (line.isUnlocked) {
        toastTitle = "Already Unlocked"; toastDescription = `${line.name} is already unlocked.`;
      } else if (line.unlockCost && playerStatsNow.money < line.unlockCost) {
        toastTitle = "Not Enough Money"; toastDescription = `Need $${line.unlockCost.toLocaleString()} to unlock ${line.name}.`; toastVariant = "destructive";
      } else if (line.requiredResearchId && !(playerStatsNow.unlockedResearchIds || []).includes(line.requiredResearchId)) {
        const research = researchItemsRef.current.find(r => r.id === line.requiredResearchId);
        toastTitle = "Research Required"; toastDescription = `${line.name} requires "${research?.name || line.requiredResearchId}" research.`; toastVariant = "destructive";
      } else {
        setPlayerStats(prev => {
          const updatedProductionLines = (prev.factoryProductionLines || []).map((l, idx) =>
            idx === lineIndex ? { ...l, isUnlocked: true } : l
          );
          return {
            ...prev,
            money: line.unlockCost ? prev.money - line.unlockCost : prev.money,
            factoryProductionLines: updatedProductionLines,
          };
        });
        toastTitle = "Production Line Unlocked!";
        toastDescription = `${line.name} is now operational.`;
      }
    }
    if (toastTitle) toastRef.current({ title: toastTitle, description: toastDescription, variant: toastVariant });
  }, []);

  const assignWorkerToMachine = useCallback((workerId: string | null, machineInstanceId: string) => {
    let toastTitle = "Worker Assignment Updated";
    let toastDescription = "";
    let toastVariant: "default" | "destructive" = "default";

    const targetMachinePrevState = playerStatsRef.current.factoryMachines.find(m => m.instanceId === machineInstanceId);
    const targetMachineConfig = targetMachinePrevState ? INITIAL_FACTORY_MACHINE_CONFIGS.find(mc => mc.id === targetMachinePrevState.configId) : null;
    const targetMachineName = targetMachineConfig?.name || 'the machine';

    setPlayerStats(prev => {
      let newWorkers = [...(prev.factoryWorkers || [])];
      const targetMachineSlot = (prev.factoryProductionLines || []).flatMap(line => line.slots).find(s => s.machineInstanceId === machineInstanceId);

      const currentWorkerOnTargetMachineIndex = newWorkers.findIndex(w => w.assignedMachineInstanceId === machineInstanceId);
      if (currentWorkerOnTargetMachineIndex !== -1) {
        if (workerId === null || newWorkers[currentWorkerOnTargetMachineIndex].id !== workerId) {
          newWorkers[currentWorkerOnTargetMachineIndex] = { ...newWorkers[currentWorkerOnTargetMachineIndex], assignedMachineInstanceId: null, status: 'idle' };
        }
      }

      if (workerId) {
        const workerToAssignIndex = newWorkers.findIndex(w => w.id === workerId);
        if (workerToAssignIndex === -1) {
          toastVariant = "destructive";
          toastDescription = "Worker to assign not found.";
          return prev;
        }

        if (newWorkers[workerToAssignIndex].assignedMachineInstanceId && newWorkers[workerToAssignIndex].assignedMachineInstanceId !== machineInstanceId) {
        }

        newWorkers[workerToAssignIndex] = {
          ...newWorkers[workerToAssignIndex],
          assignedMachineInstanceId: machineInstanceId,
          status: (targetMachineSlot?.targetComponentId && newWorkers[workerToAssignIndex].energy > 0) ? 'working' : 'idle',
        };
      }
      return { ...prev, factoryWorkers: newWorkers };
    });


    if (workerId === null) {
        const previouslyAssignedWorker = playerStatsRef.current.factoryWorkers.find(w => w.assignedMachineInstanceId === machineInstanceId);
         if (previouslyAssignedWorker) {
            toastDescription = `${previouslyAssignedWorker.name} has been unassigned from ${targetMachineName} and is now idle.`;
        } else {
            toastDescription = `${targetMachineName} now has no worker assigned.`;
        }
    } else {
        const assignedWorker = playerStatsRef.current.factoryWorkers.find(w => w.id === workerId);
        if (assignedWorker) {
            toastDescription = `${assignedWorker.name} assigned to ${targetMachineName}.`;
            const finalStatus = (playerStatsRef.current.factoryProductionLines || []).flatMap(line => line.slots).find(s => s.machineInstanceId === machineInstanceId)?.targetComponentId && assignedWorker.energy > 0 ? 'working' : 'idle';
            if (finalStatus === 'working') {
                toastDescription += ` Status: working.`;
            } else {
                toastDescription += ` Status: idle.`;
            }
        } else {
            toastDescription = "Worker assignment could not be confirmed.";
            toastVariant = "destructive";
        }
    }

    if (toastTitle && (toastDescription || toastVariant === "destructive")) {
      toastRef.current({ title: toastTitle, description: toastDescription || "An unknown error occurred.", variant: toastVariant, duration: 2500 });
    }
  }, []);


  const performPrestige = useCallback(() => {
    let toastTitle = "";
    let toastDescription = "";
    let toastVariant: "default" | "destructive" = "default";
    const playerStatsNow = playerStatsRef.current;
    const moneyRequiredForFirstPrestige = 100000;
    const currentDynamicMaxEnergy = getDynamicMaxWorkerEnergy();


    if (playerStatsNow.money < moneyRequiredForFirstPrestige && playerStatsNow.timesPrestiged === 0) {
      toastTitle = "Not Enough Money";
      toastDescription = `Need $${Number(moneyRequiredForFirstPrestige).toLocaleString('en-US', { maximumFractionDigits: 0 })} to prestige for the first time.`;
      toastVariant = "destructive";
    } else {
      const totalLevels = businessesRef.current.reduce((sum, b) => sum + b.level, 0);
      let basePointsFromLevels = calculateDiminishingPrestigePoints(totalLevels);
      const prestigePointBoost = getPrestigePointBoostPercent((playerStatsNow.unlockedSkillIds || []), skillTreeRef.current, (playerStatsNow.hqUpgradeLevels || {}), hqUpgradesRef.current);
      const actualNewPrestigePoints = Math.floor(Math.max(0, basePointsFromLevels - playerStatsNow.prestigePoints) * (1 + prestigePointBoost / 100));
      const startingMoneyBonus = getStartingMoneyBonus((playerStatsNow.unlockedSkillIds || []), skillTreeRef.current, (playerStatsNow.hqUpgradeLevels || {}), hqUpgradesRef.current);
      const moneyAfterPrestige = INITIAL_MONEY + startingMoneyBonus;

      const retainedBusinessLevels: Record<string, number> = {};
      const retainedStockHoldings: StockHolding[] = [];
      const {
          factoryPurchased, factoryRawMaterials,
          factoryProducedComponents, factoryPowerBuildings, factoryMaterialCollectors, factoryWorkers,
      } = playerStatsNow;


      for (const hqUpgradeId in (playerStatsNow.hqUpgradeLevels || {})) {
          const purchasedLevel = playerStatsNow.hqUpgradeLevels[hqUpgradeId];
          if (purchasedLevel > 0) {
              const hqUpgradeConfig = hqUpgradesRef.current.find(hq => hq.id === hqUpgradeId);
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
                          const currentHolding = (playerStatsNow.stockHoldings || []).find(h => h.stockId === stockId);
                          if (currentHolding) {
                              const retainedShares = Math.floor(currentHolding.shares * (retentionPercentage / 100));
                              if (retainedShares > 0) { retainedStockHoldings.push({ stockId, shares: retainedShares, averagePurchasePrice: currentHolding.averagePurchasePrice }); }
                          }
                      }
                  }
              }
          }
      }
      const newInitialPlayerStats = getInitialPlayerStats();
      const newBusinessesState = INITIAL_BUSINESSES.map(biz => ({ ...biz, level: retainedBusinessLevels[biz.id] || 0, managerOwned: false, upgrades: biz.upgrades ? biz.upgrades.map(upg => ({ ...upg, isPurchased: false })) : [], icon: biz.icon, }));
      const newMachinesState = (playerStatsNow.factoryMachines || []).map(m => ({ ...m, assignedProductionLineId: null }));

      setBusinesses(newBusinessesState);
      setStocksWithDynamicPrices(INITIAL_STOCKS.map(s => ({ ...s })));

      setPlayerStats(prev => ({
          ...newInitialPlayerStats,
          money: moneyAfterPrestige,
          prestigePoints: prev.prestigePoints + actualNewPrestigePoints,
          timesPrestiged: prev.timesPrestiged + 1,
          unlockedSkillIds: prev.unlockedSkillIds,
          hqUpgradeLevels: prev.hqUpgradeLevels,
          stockHoldings: retainedStockHoldings,

          factoryPurchased,
          factoryPowerUnitsGenerated: 0,
          factoryPowerConsumptionKw: 0,
          factoryRawMaterials,
          factoryMachines: newMachinesState,
          factoryProductionLines: newInitialPlayerStats.factoryProductionLines.map((line, index) => ({
            ...line,
            isUnlocked: prev.factoryProductionLines[index]?.isUnlocked || false
          })),
          factoryPowerBuildings,
          factoryProducedComponents,
          factoryProductionProgress: {},
          factoryWorkers: (factoryWorkers || []).map(w => ({...w, status: 'idle', energy: currentDynamicMaxEnergy, assignedMachineInstanceId: null })),
          researchPoints: 0,
          unlockedResearchIds: prev.unlockedResearchIds,
          lastManualResearchTimestamp: 0,
          currentWorkerEnergyTier: prev.currentWorkerEnergyTier,
          manualResearchBonus: prev.manualResearchBonus, // Persist manual research bonus
      }));
      toastTitle = "Prestige Successful!";
      toastDescription = `Earned ${actualNewPrestigePoints} prestige point(s)! Progress partially reset. Starting money now $${Number(moneyAfterPrestige).toLocaleString('en-US', { maximumFractionDigits: 0 })}.`;
    }
    if(toastTitle) toastRef.current({ title: toastTitle, description: toastDescription, variant: toastVariant });
  }, [getDynamicMaxWorkerEnergy]);

  const hireWorker = useCallback(() => {
    let toastTitle = "";
    let toastDescription = "";
    let toastVariant: "default" | "destructive" = "default";
    const playerStatsNow = playerStatsRef.current;
    const currentWorkerCount = (playerStatsNow.factoryWorkers || []).length;
    const currentDynamicMaxEnergy = getDynamicMaxWorkerEnergy();

    if (!playerStatsNow.factoryPurchased) {
      toastTitle = "Factory Not Owned";
      toastDescription = "Purchase the factory building first to hire workers.";
      toastVariant = "destructive";
    } else if (currentWorkerCount >= MAX_WORKERS) {
      toastTitle = "Maximum Workers Reached";
      toastDescription = `You cannot hire more than ${MAX_WORKERS} workers.`;
      toastVariant = "destructive";
    } else {
      const costForNextWorker = Math.floor(WORKER_HIRE_COST_BASE * Math.pow(WORKER_HIRE_COST_MULTIPLIER, currentWorkerCount));
      if (playerStatsNow.money < costForNextWorker) {
        toastTitle = "Not Enough Money";
        toastDescription = `You need $${costForNextWorker.toLocaleString()} to hire the next worker.`;
        toastVariant = "destructive";
      } else {
        const firstName = WORKER_FIRST_NAMES[Math.floor(Math.random() * WORKER_FIRST_NAMES.length)];
        const lastName = WORKER_LAST_NAMES[Math.floor(Math.random() * WORKER_LAST_NAMES.length)];
        const newWorker: Worker = {
          id: `worker_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          name: `${firstName} ${lastName}`,
          assignedMachineInstanceId: null,
          energy: currentDynamicMaxEnergy,
          status: 'idle',
        };
        setPlayerStats(prev => ({
          ...prev,
          money: prev.money - costForNextWorker,
          factoryWorkers: [...(prev.factoryWorkers || []), newWorker],
        }));
        toastTitle = "Worker Hired!";
        toastDescription = `${newWorker.name} has been hired for $${costForNextWorker.toLocaleString()} and is now idle.`;
      }
    }
    if (toastTitle) {
        toastRef.current({ title: toastTitle, description: toastDescription, variant: toastVariant });
    }
  }, [getDynamicMaxWorkerEnergy]);


  const setLastMarketTrends = useCallback((trends: string) => { setLastMarketTrendsInternal(trends); }, []);
  const setLastRiskTolerance = useCallback((tolerance: "low" | "medium" | "high") => { setLastRiskToleranceInternal(tolerance); }, []);

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
            factoryProductionLines: Array.isArray(loadedData.playerStats.factoryProductionLines) && loadedData.playerStats.factoryProductionLines.every(line => line.slots && Array.isArray(line.slots) && typeof line.isUnlocked === 'boolean')
                ? (loadedData.playerStats.factoryProductionLines.length === 5 ? loadedData.playerStats.factoryProductionLines : initialDefaults.factoryProductionLines)
                : initialDefaults.factoryProductionLines,
            factoryPowerBuildings: Array.isArray(loadedData.playerStats.factoryPowerBuildings) ? loadedData.playerStats.factoryPowerBuildings : initialDefaults.factoryPowerBuildings,
            factoryProducedComponents: typeof loadedData.playerStats.factoryProducedComponents === 'object' && loadedData.playerStats.factoryProducedComponents !== null ? loadedData.playerStats.factoryProducedComponents : initialDefaults.factoryProducedComponents,
            factoryMaterialCollectors: Array.isArray(loadedData.playerStats.factoryMaterialCollectors) ? loadedData.playerStats.factoryMaterialCollectors : initialDefaults.factoryMaterialCollectors,
            factoryProductionProgress: typeof loadedData.playerStats.factoryProductionProgress === 'object' && loadedData.playerStats.factoryProductionProgress !== null ? loadedData.playerStats.factoryProductionProgress : {},
            factoryWorkers: Array.isArray(loadedData.playerStats.factoryWorkers) ? loadedData.playerStats.factoryWorkers : initialDefaults.factoryWorkers,
            researchPoints: typeof loadedData.playerStats.researchPoints === 'number' ? loadedData.playerStats.researchPoints : initialDefaults.researchPoints,
            unlockedResearchIds: Array.isArray(loadedData.playerStats.unlockedResearchIds) ? loadedData.playerStats.unlockedResearchIds : initialDefaults.unlockedResearchIds,
            lastManualResearchTimestamp: typeof loadedData.playerStats.lastManualResearchTimestamp === 'number' ? loadedData.playerStats.lastManualResearchTimestamp : initialDefaults.lastManualResearchTimestamp,
            currentWorkerEnergyTier: typeof loadedData.playerStats.currentWorkerEnergyTier === 'number' ? loadedData.playerStats.currentWorkerEnergyTier : initialDefaults.currentWorkerEnergyTier,
            manualResearchBonus: typeof loadedData.playerStats.manualResearchBonus === 'number' ? loadedData.playerStats.manualResearchBonus : initialDefaults.manualResearchBonus,
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
        materialCollectionCooldownEndRef.current = mergedPlayerStats.lastManualResearchTimestamp ? mergedPlayerStats.lastManualResearchTimestamp + MATERIAL_COLLECTION_COOLDOWN_MS : 0;
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
    const autoSaveTimer = setInterval(() => {
      saveStateToLocalStorage();
    }, AUTO_SAVE_INTERVAL);
    return () => clearInterval(autoSaveTimer);
  }, [saveStateToLocalStorage]);


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

  useEffect(() => {
    const gameTickIntervalId = setInterval(() => {
      const pStats = playerStatsRef.current;
      const currentBusinesses = businessesRef.current;
      const currentSkillTree = skillTreeRef.current;
      const currentHqUpgrades = hqUpgradesRef.current;
      const currentUnlockedStocks = unlockedStocksRef.current;
      const currentFactoryComponentsConfig = INITIAL_FACTORY_COMPONENTS_CONFIG;
      const currentFactoryMachineConfigs = INITIAL_FACTORY_MACHINE_CONFIGS;
      const currentFactoryMaterialCollectorsConfig = INITIAL_FACTORY_MATERIAL_COLLECTORS_CONFIG;
      const currentFactoryPowerBuildingsConfig = INITIAL_FACTORY_POWER_BUILDINGS_CONFIG;
      const currentResearchItems = researchItemsRef.current;
      const currentDynamicMaxEnergy = getDynamicMaxWorkerEnergy();


      setPlayerStats(prev => {
        let newMoney = prev.money;
        let newFactoryRawMaterials = prev.factoryRawMaterials;
        let newFactoryProducedComponents = { ...prev.factoryProducedComponents };
        let newFactoryProductionProgress = { ...(prev.factoryProductionProgress || {}) };
        let newFactoryPowerConsumptionKw = 0;
        let updatedWorkers = [...(prev.factoryWorkers || [])];
        let newFactoryPowerUnitsGenerated = 0;

        (prev.factoryPowerBuildings || []).forEach(pb => {
            const config = currentFactoryPowerBuildingsConfig.find(c => c.id === pb.configId);
            if (config) {
                let output = config.powerOutputKw;
                const boostResearch = currentResearchItems.find(r => r.effects.factoryPowerBuildingBoost?.buildingConfigId === pb.configId);
                if (boostResearch && (prev.unlockedResearchIds || []).includes(boostResearch.id) && boostResearch.effects.factoryPowerBuildingBoost) {
                    output *= (1 + boostResearch.effects.factoryPowerBuildingBoost.powerOutputBoostPercent / 100);
                }
                newFactoryPowerUnitsGenerated += output;
            }
        });


        const currentTotalBusinessIncome = currentBusinesses.reduce((sum, biz) => {
          const income = localCalculateIncome(biz, prev.unlockedSkillIds, currentSkillTree, prev.hqUpgradeLevels, currentHqUpgrades, prev.factoryProducedComponents || {}, currentFactoryComponentsConfig);
          return sum + income;
        }, 0);
        newMoney += currentTotalBusinessIncome;

        let currentDividendIncome = 0;
        let globalDividendBoost = 0;
        prev.unlockedSkillIds.forEach(skillId => {
          const skill = currentSkillTree.find(s => s.id === skillId);
          if (skill && skill.effects && skill.effects.globalDividendYieldBoostPercent) { globalDividendBoost += skill.effects.globalDividendYieldBoostPercent; }
        });
        for (const hqId in prev.hqUpgradeLevels) {
          const purchasedLevel = prev.hqUpgradeLevels[hqId];
          if (purchasedLevel > 0) {
            const hqUpgrade = currentHqUpgrades.find(h => h.id === hqId);
            if (hqUpgrade && hqUpgrade.levels) {
              const levelData = hqUpgrade.levels.find(l => l.level === purchasedLevel);
              if (levelData && levelData.effects.globalDividendYieldBoostPercent) { globalDividendBoost += levelData.effects.globalDividendYieldBoostPercent; }
            }
          }
        }
        for (const holding of prev.stockHoldings) {
          const stockDetails = currentUnlockedStocks.find(s => s.id === holding.stockId);
          if (stockDetails) {
            let currentDividendYield = stockDetails.dividendYield;
            const initialStockInfo = INITIAL_STOCKS.find(is => is.id === holding.stockId);
            if(initialStockInfo) { currentDividendYield = initialStockInfo.dividendYield; }
            currentDividendYield *= (1 + globalDividendBoost / 100);
            currentDividendIncome += holding.shares * stockDetails.price * currentDividendYield;
          }
        }
        newMoney += currentDividendIncome;

        let currentInvestmentsValue = 0;
        for (const holding of prev.stockHoldings) {
          const stockDetails = currentUnlockedStocks.find(s => s.id === holding.stockId);
          if (stockDetails) { currentInvestmentsValue += holding.shares * stockDetails.price; }
        }

        if (prev.factoryPurchased) {
          let tempPowerConsumption = 0;
          (prev.factoryProductionLines || []).forEach(line => {
            if(!line.isUnlocked) return;
            (line.slots || []).forEach(slot => {
              if (slot.machineInstanceId && slot.targetComponentId) {
                const machineInstance = (prev.factoryMachines || []).find(m => m.instanceId === slot.machineInstanceId);
                const worker = updatedWorkers.find(w => w.assignedMachineInstanceId === slot.machineInstanceId);
                if (machineInstance && worker && worker.status === 'working' && worker.energy > 0) {
                  const machineConfig = currentFactoryMachineConfigs.find(mc => mc.id === machineInstance.configId);
                  if (machineConfig) {
                    let currentMachinePowerConsumption = machineConfig.powerConsumptionKw;
                    (machineInstance.purchasedUpgradeIds || []).forEach(upgradeId => {
                        const upgradeDef = machineConfig.upgrades?.find(u => u.id === upgradeId);
                        if (upgradeDef?.effects.powerConsumptionModifier) {
                            currentMachinePowerConsumption *= upgradeDef.effects.powerConsumptionModifier;
                        }
                    });
                    tempPowerConsumption += currentMachinePowerConsumption;
                  }
                }
              }
            });
          });
          (prev.factoryMaterialCollectors || []).forEach(collector => {
            const config = currentFactoryMaterialCollectorsConfig.find(c => c.id === collector.configId);
            if (config) { tempPowerConsumption += config.powerConsumptionKw; }
          });
          newFactoryPowerConsumptionKw = tempPowerConsumption;

          const netPower = newFactoryPowerUnitsGenerated - newFactoryPowerConsumptionKw;

          if (netPower >= 0) {
            let powerUsedByCollectors = 0;
            (prev.factoryMaterialCollectors || []).forEach(collector => {
                const config = currentFactoryMaterialCollectorsConfig.find(c => c.id === collector.configId);
                if (config) powerUsedByCollectors += config.powerConsumptionKw;
            });
            const powerAvailableForCollectors = newFactoryPowerUnitsGenerated - (newFactoryPowerConsumptionKw - powerUsedByCollectors);
            let tempPowerForCollectors = powerAvailableForCollectors;
            let actualMaterialsCollectedThisTick = 0;

            (prev.factoryMaterialCollectors || []).sort((a,b) => {
                const confA = currentFactoryMaterialCollectorsConfig.find(c => c.id === a.configId);
                const confB = currentFactoryMaterialCollectorsConfig.find(c => c.id === b.configId);
                return (confA?.powerConsumptionKw || Infinity) - (confB?.powerConsumptionKw || Infinity);
            }).forEach(collector => {
                const config = currentFactoryMaterialCollectorsConfig.find(c => c.id === collector.configId);
                if (config && tempPowerForCollectors >= config.powerConsumptionKw) {
                    let effectiveRate = config.materialsPerSecond;
                    const boostResearch = currentResearchItems.find(r => r.effects.factoryMaterialCollectorBoost?.collectorConfigId === config.id);
                    if (boostResearch && (prev.unlockedResearchIds || []).includes(boostResearch.id) && boostResearch.effects.factoryMaterialCollectorBoost) {
                        effectiveRate *= (1 + boostResearch.effects.factoryMaterialCollectorBoost.materialsPerSecondBoostPercent / 100);
                    }
                    actualMaterialsCollectedThisTick += effectiveRate;
                    tempPowerForCollectors -= config.powerConsumptionKw;
                }
            });
            newFactoryRawMaterials += actualMaterialsCollectedThisTick;
          }

          updatedWorkers = updatedWorkers.map(worker => {
            if (worker.status === 'working' && worker.assignedMachineInstanceId) {
              const machine = (prev.factoryMachines || []).find(m => m.instanceId === worker.assignedMachineInstanceId);
              const lineWithMachine = (prev.factoryProductionLines || []).find(l => l.slots.some(s => s.machineInstanceId === worker.assignedMachineInstanceId) && l.isUnlocked);
              const slotWithMachine = lineWithMachine?.slots.find(s => s.machineInstanceId === worker.assignedMachineInstanceId);

              if (machine && slotWithMachine && slotWithMachine.targetComponentId && netPower >=0 ) {
                const machineConfigForPower = currentFactoryMachineConfigs.find(mc => mc.id === machine.configId);
                if (machineConfigForPower) {
                    let currentMachinePowerConsumption = machineConfigForPower.powerConsumptionKw;
                     (machine.purchasedUpgradeIds || []).forEach(upgradeId => {
                        const upgradeDef = machineConfigForPower.upgrades?.find(u => u.id === upgradeId);
                        if (upgradeDef?.effects.powerConsumptionModifier) {
                            currentMachinePowerConsumption *= upgradeDef.effects.powerConsumptionModifier;
                        }
                    });

                    if (newFactoryPowerUnitsGenerated - (newFactoryPowerConsumptionKw - currentMachinePowerConsumption) >= currentMachinePowerConsumption) {
                       const newEnergy = Math.max(0, worker.energy - WORKER_ENERGY_RATE);
                        if (newEnergy === 0) { return { ...worker, energy: newEnergy, status: 'resting' }; }
                        return { ...worker, energy: newEnergy };
                    }
                }
              }
            } else if (worker.status === 'resting') {
              const newEnergy = Math.min(currentDynamicMaxEnergy, worker.energy + WORKER_ENERGY_RATE);
              if (newEnergy === currentDynamicMaxEnergy) {
                return { ...worker, energy: newEnergy, status: 'idle' };
              }
              return { ...worker, energy: newEnergy };
            }
            return worker;
          });

          if (netPower >= 0) {
            (prev.factoryProductionLines || []).forEach((line) => {
              if(!line.isUnlocked) return;
              (line.slots || []).forEach((slot, slotIndex) => {
                if (slot.machineInstanceId && slot.targetComponentId) {
                  const worker = updatedWorkers.find(w => w.assignedMachineInstanceId === slot.machineInstanceId);
                  if (worker && worker.status === 'working' && worker.energy > 0) {
                    const machineInstance = (prev.factoryMachines || []).find(m => m.instanceId === slot.machineInstanceId);
                    const machineConfig = machineInstance ? currentFactoryMachineConfigs.find(mc => mc.id === machineInstance.configId) : null;
                    const componentRecipe = currentFactoryComponentsConfig.find(cc => cc.id === slot.targetComponentId);

                    if (machineInstance && machineConfig && componentRecipe && machineConfig.maxCraftableTier >= componentRecipe.tier) {
                      let currentMachinePowerConsumption = machineConfig.powerConsumptionKw;
                       (machineInstance.purchasedUpgradeIds || []).forEach(upgradeId => {
                            const upgradeDef = machineConfig.upgrades?.find(u => u.id === upgradeId);
                            if (upgradeDef?.effects.powerConsumptionModifier) {
                                currentMachinePowerConsumption *= upgradeDef.effects.powerConsumptionModifier;
                            }
                        });
                      if (newFactoryPowerUnitsGenerated - (newFactoryPowerConsumptionKw - currentMachinePowerConsumption) >= currentMachinePowerConsumption) {
                          const progressKey = `${line.id}-${slotIndex}-${slot.targetComponentId}`;
                          let currentProgress = newFactoryProductionProgress[progressKey] || 0;

                          let effectiveProductionTime = componentRecipe.productionTimeSeconds;
                          let totalSpeedMultiplier = 1;
                          (machineInstance.purchasedUpgradeIds || []).forEach(upgradeId => {
                            const upgradeDef = machineConfig.upgrades?.find(u => u.id === upgradeId);
                            if(upgradeDef?.effects.productionSpeedMultiplier) {
                                totalSpeedMultiplier *= upgradeDef.effects.productionSpeedMultiplier;
                            }
                          });
                          effectiveProductionTime /= totalSpeedMultiplier;

                          currentProgress += (1 / Math.max(0.1, effectiveProductionTime));

                          if (currentProgress >= 1) {
                            let canCraftOneFull = true;
                            if (prev.factoryRawMaterials < componentRecipe.rawMaterialCost) { canCraftOneFull = false; }
                            for (const input of componentRecipe.recipe) {
                              if ((newFactoryProducedComponents[input.componentId] || 0) < input.quantity) { canCraftOneFull = false; break; }
                            }

                            if (canCraftOneFull) {
                              currentProgress -= 1.0;
                              newFactoryRawMaterials -= componentRecipe.rawMaterialCost;
                              for (const input of componentRecipe.recipe) {
                                newFactoryProducedComponents[input.componentId] = (newFactoryProducedComponents[input.componentId] || 0) - input.quantity;
                              }
                              newFactoryProducedComponents[slot.targetComponentId] = (newFactoryProducedComponents[slot.targetComponentId] || 0) + 1;
                            } else {
                               currentProgress = Math.max(0, currentProgress - (1 / Math.max(0.1, effectiveProductionTime)));
                            }
                          }
                          newFactoryProductionProgress[progressKey] = currentProgress;
                       }
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
          money: newMoney,
          totalIncomePerSecond: newTotalIncomePerSecondDisplay,
          investmentsValue: currentInvestmentsValue,
          factoryPowerUnitsGenerated: newFactoryPowerUnitsGenerated,
          factoryPowerConsumptionKw: newFactoryPowerConsumptionKw,
          factoryRawMaterials: Math.floor(Math.max(0, newFactoryRawMaterials)),
          factoryProducedComponents: Object.fromEntries(
            Object.entries(newFactoryProducedComponents).map(([key, value]) => [key, Math.floor(Math.max(0, value as number))])
          ),
          factoryProductionProgress: newFactoryProductionProgress,
          factoryWorkers: updatedWorkers,
        };
      });
    }, GAME_TICK_INTERVAL);
    return () => clearInterval(gameTickIntervalId);
  }, [localCalculateIncome, getDynamicMaxWorkerEnergy]);

  useEffect(() => {
    const pStats = playerStatsRef.current;
    const currentBusinesses = businessesRef.current;
    const currentSkillTree = skillTreeRef.current;

    let purchasedInThisTick = false;
    let moneySpentThisTick = 0;
    let newAchievedBusinessMilestonesForAutoBuy = { ...(pStats.achievedBusinessMilestones || {}) };

    const updatedBusinessesForAutoBuy = currentBusinesses.map(business => {
      let businessChanged = false;
      const skillIdToCheck = `auto_buy_upgrades_${business.id}`;

      if ((pStats.unlockedSkillIds || []).includes(skillIdToCheck) && business.upgrades) {
        const updatedUpgrades = business.upgrades.map(upgrade => {
          if (!upgrade.isPurchased && business.level >= upgrade.requiredLevel) {
            let actualCost = upgrade.cost;
            let globalUpgradeCostReduction = 0;
            (pStats.unlockedSkillIds || []).forEach(sId => {
              const sk = currentSkillTree.find(s => s.id === sId);
              if (sk && sk.effects && sk.effects.globalBusinessUpgradeCostReductionPercent) {
                globalUpgradeCostReduction += sk.effects.globalBusinessUpgradeCostReductionPercent;
              }
            });
            if (globalUpgradeCostReduction > 0) {
              actualCost *= (1 - globalUpgradeCostReduction / 100);
              actualCost = Math.max(0, Math.floor(actualCost));
            }

            if ((pStats.money - moneySpentThisTick) >= actualCost) {
              moneySpentThisTick += actualCost;
              purchasedInThisTick = true;
              businessChanged = true;

              const existingMilestonesForBusiness = newAchievedBusinessMilestonesForAutoBuy?.[business.id] || {};
              const existingPurchasedUpgrades = existingMilestonesForBusiness.purchasedUpgradeIds || [];
              let updatedPurchasedUpgradesForAuto = [...existingPurchasedUpgrades];
              if (!existingPurchasedUpgrades.includes(upgrade.id)) {
                updatedPurchasedUpgradesForAuto.push(upgrade.id);
                toastRef.current({ title: "Auto-Upgrade!", description: `${upgrade.name} for ${business.name}`, duration: 1500 });
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
  }, [playerStats.money, playerStats.unlockedSkillIds]);


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
      hireWorker, assignWorkerToMachine, unlockProductionLine, purchaseFactoryMachineUpgrade
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

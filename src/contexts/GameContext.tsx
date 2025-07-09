
"use client";

import type { Business, PlayerStats, Stock, StockHolding, SkillNode, SaveData, HQUpgrade, HQUpgradeLevel, FactoryPowerBuilding, FactoryMachine, FactoryProductionLine, FactoryPowerBuildingConfig, FactoryMachineConfig, FactoryComponent, FactoryProductionLineSlot, ResearchItemConfig, Worker, WorkerStatus, FactoryMachineUpgradeConfig, FactoryProductionProgressData, Artifact, ArtifactRarity, ArtifactFindChances, QuarryUpgrade, QuarryChoice, ToastSettings, ETF, BusinessSynergy, IPO, EtfHolding } from '@/types';
import {
  INITIAL_BUSINESSES, INITIAL_MONEY, INITIAL_STOCKS, INITIAL_PRESTIGE_POINTS, INITIAL_TIMES_PRESTIGED, INITIAL_SKILL_TREE,
  INITIAL_UNLOCKED_SKILL_IDS, INITIAL_HQ_UPGRADE_LEVELS, INITIAL_HQ_UPGRADES, INITIAL_UNLOCKED_ARTIFACT_IDS, INITIAL_ARTIFACTS,
  INITIAL_QUARRY_UPGRADES, INITIAL_FACTORY_POWER_BUILDINGS_CONFIG, INITIAL_FACTORY_MACHINE_CONFIGS, INITIAL_FACTORY_COMPONENTS_CONFIG,
  INITIAL_FACTORY_MATERIAL_COLLECTORS_CONFIG, INITIAL_RESEARCH_ITEMS_CONFIG, INITIAL_FACTORY_WORKERS, getStartingMoneyBonus,
  getPrestigePointBoostPercent, calculateDiminishingPrestigePoints, calculateCostForNLevels, calculateMaxAffordableLevels,
  calculateSingleLevelUpgradeCost, MAX_BUSINESS_LEVEL, FACTORY_PURCHASE_COST, MATERIAL_COLLECTION_AMOUNT, MATERIAL_COLLECTION_COOLDOWN_MS,
  INITIAL_RESEARCH_POINTS, INITIAL_UNLOCKED_RESEARCH_IDS, INITIAL_UNLOCKED_FACTORY_COMPONENT_RECIPE_IDS, RESEARCH_MANUAL_GENERATION_AMOUNT, 
  RESEARCH_MANUAL_GENERATION_COST_MONEY, MANUAL_RESEARCH_ADDITIVE_COST_INCREASE_PER_BOOST, RESEARCH_MANUAL_COOLDOWN_MS,
  REQUIRED_PRESTIGE_LEVEL_FOR_RESEARCH_TAB, TECH_BUSINESS_IDS, LOGISTICS_BUSINESS_IDS, MEDIA_BUSINESS_IDS, MANUFACTURING_BUSINESS_IDS,
  ENERGY_BUSINESS_IDS, FINANCE_BUSINESS_IDS, BIO_TECH_BUSINESS_IDS, AEROSPACE_BUSINESS_IDS, MISC_ADVANCED_BUSINESS_IDS,
  WORKER_HIRE_COST_BASE, WORKER_HIRE_COST_MULTIPLIER, MAX_WORKERS, INITIAL_WORKER_MAX_ENERGY, WORKER_ENERGY_TIERS, WORKER_ENERGY_RATE,
  WORKER_FIRST_NAMES, WORKER_LAST_NAMES, INITIAL_WORKER_ENERGY_TIER, INITIAL_FACTORY_RAW_MATERIALS_CAP, BASE_QUARRY_COST, QUARRY_COST_MULTIPLIER,
  BASE_QUARRY_DEPTH, QUARRY_DEPTH_MULTIPLIER, BASE_ARTIFACT_CHANCE_PER_DIG, ARTIFACT_CHANCE_DEPTH_MULTIPLIER, ARTIFACT_RARITY_WEIGHTS,
  QUARRY_ENERGY_MAX, QUARRY_ENERGY_COST_PER_DIG, QUARRY_ENERGY_REGEN_PER_SECOND, QUARRY_DIG_COOLDOWN_MS, defaultToastSettings,
  INITIAL_ETFS, BUSINESS_SYNERGIES,
} from '@/config/game-config';
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useMemo, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";

const SAVE_DATA_KEY = 'bizTycoonSaveData_v1';
const AUTO_SAVE_INTERVAL = 30000;
const STOCK_PRICE_UPDATE_INTERVAL = 15000;
const GAME_TICK_INTERVAL = 1000;
const IPO_CHECK_INTERVAL = 60000; // Check for new IPO every minute
const IPO_DURATION = 10 * 60 * 1000; // 10 minutes

interface GameContextType {
  playerStats: PlayerStats;
  businesses: Business[];
  stocks: Stock[];
  etfs: ETF[];
  businessSynergies: BusinessSynergy[];
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
  buyEtf: (etfId: string, sharesToBuy: number, currentPrice: number) => void;
  sellEtf: (etfId: string, sharesToSell: number, currentPrice: number) => void;
  buyIpoShares: (stockId: string, sharesToBuy: number) => void;
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
  getQuarryDigPower: () => number;
  getMineralBonus: () => number;
  digInQuarry: () => void;
  purchaseQuarryUpgrade: (upgradeId: string) => void;
  getArtifactFindChances: () => ArtifactFindChances;
  selectNextQuarry: (choice: QuarryChoice) => void;
  updateToastSettings: (settings: ToastSettings) => void;
  setRecipeForEntireLine: (lineId: string, componentId: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const getInitialPlayerStats = (): PlayerStats => {
  const startingMoneyBonus = getStartingMoneyBonus(INITIAL_UNLOCKED_SKILL_IDS, INITIAL_SKILL_TREE, INITIAL_HQ_UPGRADE_LEVELS, INITIAL_HQ_UPGRADES, INITIAL_UNLOCKED_ARTIFACT_IDS, INITIAL_ARTIFACTS);
  return {
    money: INITIAL_MONEY + startingMoneyBonus,
    totalIncomePerSecond: 0,
    investmentsValue: 0,
    stockHoldings: [],
    etfHoldings: [],
    prestigePoints: INITIAL_PRESTIGE_POINTS,
    timesPrestiged: INITIAL_TIMES_PRESTIGED,
    unlockedSkillIds: [...INITIAL_UNLOCKED_SKILL_IDS],
    hqUpgradeLevels: { ...INITIAL_HQ_UPGRADE_LEVELS },
    achievedBusinessMilestones: {},
    unlockedArtifactIds: [...INITIAL_UNLOCKED_ARTIFACT_IDS],
    activeIpo: null,
    minerals: 0,
    quarryDepth: 0,
    quarryTargetDepth: 1000,
    quarryLevel: 0,
    quarryName: "Starter's Pit",
    quarryRarityBias: null,
    purchasedQuarryUpgradeIds: [],
    quarryEnergy: QUARRY_ENERGY_MAX,
    maxQuarryEnergy: QUARRY_ENERGY_MAX,
    lastDigTimestamp: 0,
    factoryPurchased: false,
    factoryPowerUnitsGenerated: 0,
    factoryPowerConsumptionKw: 0,
    factoryRawMaterials: 0,
    factoryRawMaterialsCap: INITIAL_FACTORY_RAW_MATERIALS_CAP,
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
    factoryProductionProgress: {},
    factoryMaterialCollectors: [],
    factoryWorkers: [...INITIAL_FACTORY_WORKERS],
    researchPoints: INITIAL_RESEARCH_POINTS,
    unlockedResearchIds: [...INITIAL_UNLOCKED_RESEARCH_IDS],
    unlockedFactoryComponentRecipeIds: [...INITIAL_UNLOCKED_FACTORY_COMPONENT_RECIPE_IDS],
    lastManualResearchTimestamp: 0,
    currentWorkerEnergyTier: INITIAL_WORKER_ENERGY_TIER,
    manualResearchBonus: 0,
    factoryWorkerEnergyRegenModifier: 1,
    toastSettings: { ...defaultToastSettings },
    timePlayedSeconds: 0,
    totalMoneyEarned: INITIAL_MONEY,
    totalBusinessLevelsPurchased: 0,
    totalDividendsEarned: 0,
    totalMineralsDug: 0,
    totalFactoryComponentsProduced: 0,
  };
};

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();

  const [skillTreeState] = useState<SkillNode[]>(INITIAL_SKILL_TREE);
  const [hqUpgradesState] = useState<HQUpgrade[]>(INITIAL_HQ_UPGRADES);
  const [researchItemsState] = useState<ResearchItemConfig[]>(INITIAL_RESEARCH_ITEMS_CONFIG);
  const [etfsState] = useState<ETF[]>(INITIAL_ETFS);
  const [businessSynergiesState] = useState<BusinessSynergy[]>(BUSINESS_SYNERGIES);
  
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
  const stocksRef = useRef(stocksWithDynamicPrices);
  const skillTreeRef = useRef(skillTreeState);
  const hqUpgradesRef = useRef(hqUpgradesState);
  const researchItemsRef = useRef(researchItemsState);
  const toastRef = useRef(toast);

  useEffect(() => { playerStatsRef.current = playerStats; }, [playerStats]);
  useEffect(() => { businessesRef.current = businesses; }, [businesses]);
  useEffect(() => { stocksRef.current = stocksWithDynamicPrices; }, [stocksWithDynamicPrices]);

  const getDynamicMaxWorkerEnergy = useCallback((): number => {
    const tier = playerStatsRef.current.currentWorkerEnergyTier;
    return WORKER_ENERGY_TIERS[tier] || WORKER_ENERGY_TIERS[0];
  }, []);

  const calculateMaxEnergy = useCallback((stats: PlayerStats): number => {
    let newMaxEnergy = QUARRY_ENERGY_MAX;
    (stats.purchasedQuarryUpgradeIds || []).forEach(id => {
        const upgrade = INITIAL_QUARRY_UPGRADES.find(u => u.id === id);
        if (upgrade?.effects.increaseMaxEnergy) {
            newMaxEnergy += upgrade.effects.increaseMaxEnergy;
        }
    });
    (stats.unlockedArtifactIds || []).forEach(id => {
        const artifact = INITIAL_ARTIFACTS.find(a => a.id === id);
        if (artifact?.effects.increaseMaxEnergy) {
            newMaxEnergy += artifact.effects.increaseMaxEnergy;
        }
    });
    return newMaxEnergy;
  }, []);

  const onMarketStocks = useMemo(() => {
    return stocksWithDynamicPrices.filter(stock => stock.onMarket);
  }, [stocksWithDynamicPrices]);


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

    let componentGlobalIncomeBoost = 0;
    let componentBusinessSpecificIncomeBoost = 0;

    for (const componentId in currentProducedFactoryComponents) {
        const count = currentProducedFactoryComponents[componentId];
        if (count > 0) {
            const componentConfig = currentFactoryComponentsConfig.find(fc => fc.id === componentId);
            if (componentConfig && componentConfig.effects) {
                if (componentConfig.effects.globalIncomeBoostPercent) {
                    const potentialBoost = count * componentConfig.effects.globalIncomeBoostPercent;
                    const cappedBoost = componentConfig.effects.maxBonusPercent ? Math.min(potentialBoost, componentConfig.effects.maxBonusPercent) : potentialBoost;
                    componentGlobalIncomeBoost += cappedBoost;
                }
                if (componentConfig.effects.businessSpecificIncomeBoostPercent && componentConfig.effects.businessSpecificIncomeBoostPercent.businessId === business.id) {
                    const potentialBoost = count * componentConfig.effects.businessSpecificIncomeBoostPercent.percent;
                    const cappedBoost = componentConfig.effects.maxBonusPercent ? Math.min(potentialBoost, componentConfig.effects.maxBonusPercent) : potentialBoost;
                    componentBusinessSpecificIncomeBoost += cappedBoost;
                }
            }
        }
    }
    totalGlobalIncomeBoost += componentGlobalIncomeBoost;
    businessSpecificBoost += componentBusinessSpecificIncomeBoost;


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

    let totalCostReductionFromComponents = 0;
    for (const componentId in playerStatsRef.current.factoryProducedComponents) {
        const count = playerStatsRef.current.factoryProducedComponents[componentId];
        if (count > 0) {
            const componentConfig = INITIAL_FACTORY_COMPONENTS_CONFIG.find(fc => fc.id === componentId);
            if (componentConfig?.effects?.businessSpecificLevelUpCostReductionPercent && componentConfig.effects.businessSpecificLevelUpCostReductionPercent.businessId === businessId) {
                const potentialReduction = count * componentConfig.effects.businessSpecificLevelUpCostReductionPercent.percent;
                const cappedReduction = componentConfig.effects.maxBonusPercent ? Math.min(potentialReduction, componentConfig.effects.maxBonusPercent) : potentialReduction;
                totalCostReductionFromComponents += cappedReduction;
            }
        }
    }
    
    let baseCalculatedCost = calculateSingleLevelUpgradeCost( business.level, business.baseCost, business.upgradeCostMultiplier, business.upgrades, playerStatsRef.current.unlockedSkillIds, skillTreeRef.current, business.id, playerStatsRef.current.hqUpgradeLevels, hqUpgradesRef.current, playerStatsRef.current.unlockedArtifactIds );
    if (totalCostReductionFromComponents > 0) {
        baseCalculatedCost *= (1 - totalCostReductionFromComponents / 100);
    }
    return Math.max(1, Math.floor(baseCalculatedCost));

  }, [getDynamicMaxBusinessLevel]);

  const calculateCostForNLevelsForDisplay = useCallback((businessId: string, levelsToBuy: number) => {
    const business = businessesRef.current.find(b => b.id === businessId);
    if (!business) return { totalCost: Infinity, levelsPurchasable: 0 };
    const dynamicMax = getDynamicMaxBusinessLevel();
    
    let totalCostReductionFromComponents = 0;
    for (const componentId in playerStatsRef.current.factoryProducedComponents) {
        const count = playerStatsRef.current.factoryProducedComponents[componentId];
        if (count > 0) {
            const componentConfig = INITIAL_FACTORY_COMPONENTS_CONFIG.find(fc => fc.id === componentId);
            if (componentConfig?.effects?.businessSpecificLevelUpCostReductionPercent && componentConfig.effects.businessSpecificLevelUpCostReductionPercent.businessId === businessId) {
                const potentialReduction = count * componentConfig.effects.businessSpecificLevelUpCostReductionPercent.percent;
                 const cappedReduction = componentConfig.effects.maxBonusPercent ? Math.min(potentialReduction, componentConfig.effects.maxBonusPercent) : potentialReduction;
                totalCostReductionFromComponents += cappedReduction;
            }
        }
    }

    const modifiedBusiness = {
        ...business,
        baseCost: totalCostReductionFromComponents > 0 ? business.baseCost * (1 - totalCostReductionFromComponents / 100) : business.baseCost
    };
    return calculateCostForNLevels(modifiedBusiness, levelsToBuy, playerStatsRef.current.unlockedSkillIds, skillTreeRef.current, dynamicMax, playerStatsRef.current.hqUpgradeLevels, hqUpgradesRef.current, playerStatsRef.current.unlockedArtifactIds);
  }, [getDynamicMaxBusinessLevel]);

  const calculateMaxAffordableLevelsForDisplay = useCallback((businessId: string) => {
    const business = businessesRef.current.find(b => b.id === businessId);
    if (!business) return { levelsToBuy: 0, totalCost: 0 };
    const dynamicMax = getDynamicMaxBusinessLevel();

    let totalCostReductionFromComponents = 0;
    for (const componentId in playerStatsRef.current.factoryProducedComponents) {
        const count = playerStatsRef.current.factoryProducedComponents[componentId];
        if (count > 0) {
            const componentConfig = INITIAL_FACTORY_COMPONENTS_CONFIG.find(fc => fc.id === componentId);
            if (componentConfig?.effects?.businessSpecificLevelUpCostReductionPercent && componentConfig.effects.businessSpecificLevelUpCostReductionPercent.businessId === businessId) {
                const potentialReduction = count * componentConfig.effects.businessSpecificLevelUpCostReductionPercent.percent;
                const cappedReduction = componentConfig.effects.maxBonusPercent ? Math.min(potentialReduction, componentConfig.effects.maxBonusPercent) : potentialReduction;
                totalCostReductionFromComponents += cappedReduction;
            }
        }
    }
    const modifiedBusiness = {
        ...business,
        baseCost: totalCostReductionFromComponents > 0 ? business.baseCost * (1 - totalCostReductionFromComponents / 100) : business.baseCost
    };
    return calculateMaxAffordableLevels(modifiedBusiness, playerStatsRef.current.money, playerStatsRef.current.unlockedSkillIds, skillTreeRef.current, dynamicMax, playerStatsRef.current.hqUpgradeLevels, hqUpgradesRef.current, playerStatsRef.current.unlockedArtifactIds);
  }, [getDynamicMaxBusinessLevel]);

  const saveStateToLocalStorage = useCallback(() => {
    try {
      const currentTimestamp = Date.now();
      const saveData: SaveData = {
        playerStats: playerStatsRef.current,
        businesses: businessesRef.current,
        stocks: stocksRef.current,
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
    const saveData: SaveData = { 
        playerStats: playerStatsRef.current, 
        businesses: businessesRef.current, 
        stocks: stocksRef.current,
        lastSaved: currentTimestamp, 
    };
    return JSON.stringify(saveData, null, 2);
  }, []);

  const importGameState = useCallback((jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);

      if (!data.playerStats || !data.businesses || !data.stocks) {
        throw new Error("Invalid or corrupted save file format.");
      }

      const defaultStats = getInitialPlayerStats();
      const mergedPlayerStats: PlayerStats = {
        ...defaultStats,
        ...data.playerStats,
        stockHoldings: data.playerStats.stockHoldings || [],
        etfHoldings: data.playerStats.etfHoldings || [],
        hqUpgradeLevels: data.playerStats.hqUpgradeLevels || {},
        unlockedSkillIds: data.playerStats.unlockedSkillIds || [],
        purchasedQuarryUpgradeIds: data.playerStats.purchasedQuarryUpgradeIds || [],
        unlockedArtifactIds: data.playerStats.unlockedArtifactIds || [],
        unlockedResearchIds: data.playerStats.unlockedResearchIds || [],
        unlockedFactoryComponentRecipeIds: data.playerStats.unlockedFactoryComponentRecipeIds || [],
        factoryWorkers: data.playerStats.factoryWorkers || [],
        factoryMachines: data.playerStats.factoryMachines || [],
        factoryPowerBuildings: data.playerStats.factoryPowerBuildings || [],
        factoryMaterialCollectors: data.playerStats.factoryMaterialCollectors || [],
        factoryProductionLines: data.playerStats.factoryProductionLines || defaultStats.factoryProductionLines,
        toastSettings: { ...defaultStats.toastSettings, ...data.playerStats.toastSettings },
        activeIpo: data.playerStats.activeIpo || null,
      };

      const hydratedBusinesses = data.businesses.map((savedBusiness: Business) => {
        const initialBusiness = INITIAL_BUSINESSES.find(b => b.id === savedBusiness.id);
        if (initialBusiness) {
          return { ...savedBusiness, icon: initialBusiness.icon };
        }
        return savedBusiness;
      });

      const hydratedStocks = data.stocks.map((savedStock: Stock) => {
        const initialStock = INITIAL_STOCKS.find(s => s.id === savedStock.id);
        if (initialStock) {
          return { ...savedStock, icon: initialStock.icon };
        }
        return savedStock;
      });

      setPlayerStats(mergedPlayerStats);
      setBusinesses(hydratedBusinesses);
      setStocksWithDynamicPrices(hydratedStocks);

      localStorage.setItem(SAVE_DATA_KEY, JSON.stringify({
        playerStats: mergedPlayerStats,
        businesses: hydratedBusinesses,
        stocks: hydratedStocks,
        lastSaved: Date.now(),
      }));

      toastRef.current({
        title: "Import Successful!",
        description: "Game state has been loaded. The page will now reload.",
      });

      setTimeout(() => window.location.reload(), 1500);

      return true;
    } catch (error) {
      console.error("Import error:", error);
      toastRef.current({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Could not import save data.",
        variant: "destructive",
      });
      return false;
    }
  }, []);

  const wipeGameData = useCallback(() => {
    localStorage.removeItem(SAVE_DATA_KEY);
    toastRef.current({
      title: "Game Data Wiped",
      description: "All progress has been reset. The game will now reload.",
    });
    setTimeout(() => window.location.reload(), 1500);
  }, []);

  const purchaseBusinessUpgrade = useCallback((businessId: string, upgradeId: string, isAutoBuy: boolean = false): boolean => {
    let success = false;
    setBusinesses(prevBusinesses => {
        const businessIndex = prevBusinesses.findIndex(b => b.id === businessId);
        if (businessIndex === -1) return prevBusinesses;

        const business = { ...prevBusinesses[businessIndex] };
        if (!business.upgrades) return prevBusinesses;

        const upgradeIndex = business.upgrades.findIndex(u => u.id === upgradeId);
        if (upgradeIndex === -1) return prevBusinesses;

        const upgrade = { ...business.upgrades[upgradeIndex] };
        if (upgrade.isPurchased || playerStatsRef.current.money < upgrade.cost || business.level < upgrade.requiredLevel) {
            return prevBusinesses;
        }

        const newBusinesses = [...prevBusinesses];
        business.upgrades[upgradeIndex] = { ...upgrade, isPurchased: true };
        newBusinesses[businessIndex] = business;

        setPlayerStats(prev => ({
            ...prev,
            money: prev.money - upgrade.cost,
        }));
        
        if (playerStatsRef.current.toastSettings?.showManualPurchases && !isAutoBuy) {
            toastRef.current({
                title: "Upgrade Purchased!",
                description: `${business.name} - ${upgrade.name}`,
            });
        }
        if (playerStatsRef.current.toastSettings?.showAutoBuyUpgrades && isAutoBuy) {
            toastRef.current({
                title: "Auto-Upgrade Purchased!",
                description: `${business.name} - ${upgrade.name}`,
            });
        }
        success = true;
        return newBusinesses;
    });
    return success;
  }, []);

  const upgradeBusiness = useCallback((businessId: string, levelsToAttempt: number = 1) => {
    setBusinesses(prevBusinesses => {
        const businessIndex = prevBusinesses.findIndex(b => b.id === businessId);
        if (businessIndex === -1) return prevBusinesses;

        const business = prevBusinesses[businessIndex];
        const dynamicMaxLevel = getDynamicMaxBusinessLevel();

        if (business.level >= dynamicMaxLevel) return prevBusinesses;

        const levelsToBuy = levelsToAttempt;
        const { totalCost, levelsPurchasable } = calculateCostForNLevelsForDisplay(businessId, levelsToBuy);

        if (levelsPurchasable > 0 && playerStatsRef.current.money >= totalCost) {
            const newBusinesses = [...prevBusinesses];
            newBusinesses[businessIndex] = {
                ...business,
                level: business.level + levelsPurchasable,
            };

            setPlayerStats(prev => ({
                ...prev,
                money: prev.money - totalCost,
                totalBusinessLevelsPurchased: (prev.totalBusinessLevelsPurchased || 0) + levelsPurchasable,
            }));

            if (playerStatsRef.current.toastSettings?.showManualPurchases) {
              toastRef.current({
                title: `${business.name} Leveled Up!`,
                description: `Purchased ${levelsPurchasable} level(s) for ${business.name}.`,
              });
            }

            return newBusinesses;
        }
        return prevBusinesses;
    });
  }, [getDynamicMaxBusinessLevel, calculateCostForNLevelsForDisplay]);

  const buyStock = useCallback((stockId: string, sharesToBuyInput: number) => {
    let toastTitle = "";
    let toastDescription = "";
    let toastVariant: "default" | "destructive" = "default";

    const playerStatsNow = playerStatsRef.current;
    const stock = stocksRef.current.find(s => s.id === stockId);

    if (!stock) {
      toastTitle = "Stock Not Found";
      toastVariant = "destructive";
    } else if (playerStatsNow.timesPrestiged < 8) {
      toastTitle = "Stocks Locked";
      toastVariant = "destructive";
    } else if (sharesToBuyInput <= 0) {
      toastTitle = "Invalid Amount";
      toastVariant = "destructive";
    } else {
        const existingHolding = playerStatsNow.stockHoldings.find(h => h.stockId === stockId);
        const sharesAlreadyOwnedByPlayer = existingHolding?.shares || 0;
        const sharesAvailableToBuy = stock.totalOutstandingShares - sharesAlreadyOwnedByPlayer;

        if (sharesAvailableToBuy <= 0) {
          toastTitle = "No Shares Available";
        } else {
          let sharesToBuy = Math.min(sharesToBuyInput, sharesAvailableToBuy);
          const cost = stock.price * sharesToBuy;

          if (playerStatsNow.money < cost) {
            toastTitle = "Not Enough Money";
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
          }
        }
    }
    if(toastTitle && (toastVariant === 'destructive' || (playerStatsRef.current.toastSettings?.showStockTrades ?? true))) toastRef.current({ title: toastTitle, description: toastDescription, variant: toastVariant });
  }, []);

  const sellStock = useCallback((stockId: string, sharesToSell: number) => {
    let toastTitle = "";
    let toastDescription = "";
    let toastVariant: "default" | "destructive" = "default";
  
    const playerStatsNow = playerStatsRef.current;
    const stock = stocksRef.current.find(s => s.id === stockId);
  
    if (!stock) {
      toastTitle = "Stock Not Found";
      toastVariant = "destructive";
    } else {
      const holding = playerStatsNow.stockHoldings.find(h => h.stockId === stockId);
      if (!holding || holding.shares < sharesToSell) {
        toastTitle = "Not Enough Shares";
        toastVariant = "destructive";
      } else {
        const earnings = stock.price * sharesToSell;
        setPlayerStats(prev => ({
          ...prev,
          money: prev.money + earnings,
          stockHoldings: prev.stockHoldings.map(h =>
            h.stockId === stockId ? { ...h, shares: h.shares - sharesToSell } : h
          ).filter(h => h.shares > 0)
        }));
        toastTitle = "Stock Sold!";
        toastDescription = `Sold ${sharesToSell.toLocaleString()} shares of ${stock.ticker}.`;
      }
    }
  
    if (toastTitle && (toastVariant === 'destructive' || (playerStatsRef.current.toastSettings?.showStockTrades ?? true))) {
      toastRef.current({ title: toastTitle, description: toastDescription, variant: toastVariant });
    }
  }, []);
  
  const buyEtf = useCallback((etfId: string, sharesToBuyInput: number, currentPrice: number) => {
    let toastTitle = "";
    let toastDescription = "";
    let toastVariant: "default" | "destructive" = "default";
  
    const playerStatsNow = playerStatsRef.current;
    const etf = etfsState.find(e => e.id === etfId);
  
    if (!etf) {
      toastTitle = "ETF Not Found";
      toastVariant = "destructive";
    } else if (playerStatsNow.timesPrestiged < 8) {
      toastTitle = "Stocks Locked";
      toastVariant = "destructive";
    } else if (sharesToBuyInput <= 0) {
      toastTitle = "Invalid Amount";
      toastVariant = "destructive";
    } else {
      const existingHolding = playerStatsNow.etfHoldings.find(h => h.etfId === etfId);
      const sharesAlreadyOwnedByPlayer = existingHolding?.shares || 0;
      const sharesAvailableToBuy = etf.totalOutstandingShares - sharesAlreadyOwnedByPlayer;

      if (sharesAvailableToBuy <= 0) {
        toastTitle = "No Shares Available";
        toastVariant = "destructive";
      } else {
        const sharesToBuy = Math.min(sharesToBuyInput, sharesAvailableToBuy);
        const cost = currentPrice * sharesToBuy;
        if (playerStatsNow.money < cost) {
          toastTitle = "Not Enough Money";
          toastVariant = "destructive";
        } else {
          setPlayerStats(prev => ({
            ...prev,
            money: prev.money - cost,
            etfHoldings: prev.etfHoldings.find(h => h.etfId === etfId)
              ? prev.etfHoldings.map(h => h.etfId === etfId ? { ...h, shares: h.shares + sharesToBuy, averagePurchasePrice: ((h.averagePurchasePrice * h.shares) + (currentPrice * sharesToBuy)) / (h.shares + sharesToBuy) } : h)
              : [...prev.etfHoldings, { etfId, shares: sharesToBuy, averagePurchasePrice: currentPrice }]
          }));
          toastTitle = "ETF Purchased!";
          toastDescription = `Bought ${sharesToBuy.toLocaleString()} shares of ${etf.ticker}.`;
        }
      }
    }
  
    if (toastTitle && (toastVariant === 'destructive' || (playerStatsRef.current.toastSettings?.showStockTrades ?? true))) {
      toastRef.current({ title: toastTitle, description: toastDescription, variant: toastVariant });
    }
  }, [etfsState]);
  
  const sellEtf = useCallback((etfId: string, sharesToSell: number, currentPrice: number) => {
    let toastTitle = "";
    let toastDescription = "";
    let toastVariant: "default" | "destructive" = "default";
  
    const playerStatsNow = playerStatsRef.current;
    const etf = etfsState.find(e => e.id === etfId);
  
    if (!etf) {
      toastTitle = "ETF Not Found";
      toastVariant = "destructive";
    } else {
      const holding = playerStatsNow.etfHoldings.find(h => h.etfId === etfId);
      if (!holding || holding.shares < sharesToSell) {
        toastTitle = "Not Enough Shares";
        toastVariant = "destructive";
      } else {
        const earnings = currentPrice * sharesToSell;
        setPlayerStats(prev => ({
          ...prev,
          money: prev.money + earnings,
          etfHoldings: prev.etfHoldings.map(h =>
            h.etfId === etfId ? { ...h, shares: h.shares - sharesToSell } : h
          ).filter(h => h.shares > 0)
        }));
        toastTitle = "ETF Sold!";
        toastDescription = `Sold ${sharesToSell.toLocaleString()} shares of ${etf.ticker}.`;
      }
    }
  
    if (toastTitle && (toastVariant === 'destructive' || (playerStatsRef.current.toastSettings?.showStockTrades ?? true))) {
      toastRef.current({ title: toastTitle, description: toastDescription, variant: toastVariant });
    }
  }, [etfsState]);
  
  const buyIpoShares = useCallback((stockId: string, sharesToBuy: number) => {
    let toastTitle = "";
    let toastDescription = "";
    let toastVariant: "default" | "destructive" = "default";
  
    const playerStatsNow = playerStatsRef.current;
    const activeIpo = playerStatsNow.activeIpo;
  
    if (!activeIpo || activeIpo.stockId !== stockId) {
      toastTitle = "IPO Not Active";
      toastVariant = "destructive";
    } else if (sharesToBuy <= 0) {
      toastTitle = "Invalid Amount";
      toastVariant = "destructive";
    } else if (sharesToBuy > activeIpo.sharesRemaining) {
      toastTitle = "Not Enough Shares in IPO";
      toastVariant = "destructive";
    } else {
      const cost = activeIpo.ipoPrice * sharesToBuy;
      if (playerStatsNow.money < cost) {
        toastTitle = "Not Enough Money";
        toastVariant = "destructive";
      } else {
        setPlayerStats(prev => {
          const existingHolding = prev.stockHoldings.find(h => h.stockId === stockId);
          const newStockHoldings = existingHolding
            ? prev.stockHoldings.map(h => h.stockId === stockId ? { ...h, shares: h.shares + sharesToBuy, averagePurchasePrice: ((h.averagePurchasePrice * h.shares) + (activeIpo.ipoPrice * sharesToBuy)) / (h.shares + sharesToBuy) } : h)
            : [...prev.stockHoldings, { stockId, shares: sharesToBuy, averagePurchasePrice: activeIpo.ipoPrice }];
          
          return {
            ...prev,
            money: prev.money - cost,
            stockHoldings: newStockHoldings,
            activeIpo: { ...activeIpo, sharesRemaining: activeIpo.sharesRemaining - sharesToBuy },
          };
        });
        toastTitle = "IPO Shares Purchased!";
        const stock = stocksRef.current.find(s => s.id === stockId);
        toastDescription = `Bought ${sharesToBuy.toLocaleString()} shares of ${stock?.ticker}.`;
      }
    }
  
    if (toastTitle && (toastVariant === 'destructive' || (playerStatsRef.current.toastSettings?.showStockTrades ?? true))) {
      toastRef.current({ title: toastTitle, description: toastDescription, variant: toastVariant });
    }
  }, []);


  const unlockSkillNode = useCallback((skillId: string) => {
    // ... (This function remains the same)
  }, []);

  const purchaseHQUpgrade = useCallback((upgradeId: string) => {
    // ... (This function remains the same)
  }, []);

  const purchaseFactoryBuilding = useCallback(() => {
    // ... (This function remains the same)
  }, []);

  const purchaseFactoryPowerBuilding = useCallback((configId: string) => {
    // ... (This function remains the same)
  }, []);

  const manuallyCollectRawMaterials = useCallback(() => {
    // ... (This function remains the same)
  }, []);

  const purchaseFactoryMachine = useCallback((configId: string) => {
    // ... (This function remains the same)
  }, []);

  const purchaseFactoryMachineUpgrade = useCallback((machineInstanceId: string, upgradeId: string) => {
    // ... (This function remains the same)
  }, []);


  const setRecipeForProductionSlot = useCallback((productionLineId: string, slotIndex: number, targetComponentId: string | null) => {
    // ... (This function remains the same)
  }, []);

  const purchaseFactoryMaterialCollector = useCallback((configId: string) => {
    // ... (This function remains the same)
  }, []);

  const manuallyGenerateResearchPoints = useCallback(() => {
    // ... (This function remains the same)
  }, []);

  const purchaseResearch = useCallback((researchId: string) => {
    // ... (This function remains the same)
  }, []);

  const unlockProductionLine = useCallback((lineId: string) => {
    // ... (This function remains the same)
  }, []);

  const assignWorkerToMachine = useCallback((workerId: string | null, machineInstanceId: string) => {
    // ... (This function remains the same)
  }, []);

  const setRecipeForEntireLine = useCallback((lineId: string, componentId: string) => {
    // ... (This function remains the same)
  }, []);


  const performPrestige = useCallback(() => {
    const currentStats = playerStatsRef.current;
    const currentBusinesses = businessesRef.current;

    const totalLevels = currentBusinesses.reduce((sum, b) => sum + b.level, 0);
    const newlyGainedPoints = calculateDiminishingPrestigePoints(totalLevels);

    const boostPercent = getPrestigePointBoostPercent(currentStats.unlockedSkillIds, skillTreeRef.current, currentStats.hqUpgradeLevels, hqUpgradesRef.current, currentStats.unlockedArtifactIds, INITIAL_ARTIFACTS);
    const finalPointsToAdd = Math.floor(newlyGainedPoints * (1 + boostPercent / 100));

    const newPlayerStats = getInitialPlayerStats();
    
    // Carry over prestige-related stats
    newPlayerStats.prestigePoints = currentStats.prestigePoints + finalPointsToAdd;
    newPlayerStats.timesPrestiged = currentStats.timesPrestiged + 1;
    newPlayerStats.unlockedSkillIds = [...currentStats.unlockedSkillIds];
    newPlayerStats.hqUpgradeLevels = { ...currentStats.hqUpgradeLevels };
    newPlayerStats.unlockedArtifactIds = [...(currentStats.unlockedArtifactIds || [])];
    newPlayerStats.purchasedQuarryUpgradeIds = [...(currentStats.purchasedQuarryUpgradeIds || [])];

    // Carry over factory state as it's persistent
    newPlayerStats.factoryPurchased = currentStats.factoryPurchased;
    newPlayerStats.factoryMachines = [...currentStats.factoryMachines];
    newPlayerStats.factoryPowerBuildings = [...currentStats.factoryPowerBuildings];
    newPlayerStats.factoryMaterialCollectors = [...currentStats.factoryMaterialCollectors];
    newPlayerStats.factoryProductionLines = [...currentStats.factoryProductionLines];
    newPlayerStats.factoryWorkers = [...currentStats.factoryWorkers];
    newPlayerStats.factoryProducedComponents = { ...currentStats.factoryProducedComponents };
    newPlayerStats.researchPoints = currentStats.researchPoints;
    newPlayerStats.unlockedResearchIds = [...currentStats.unlockedResearchIds];
    newPlayerStats.unlockedFactoryComponentRecipeIds = [...currentStats.unlockedFactoryComponentRecipeIds];

    // Carry over settings & lifetime stats
    newPlayerStats.toastSettings = { ...currentStats.toastSettings };
    newPlayerStats.timePlayedSeconds = currentStats.timePlayedSeconds;
    newPlayerStats.totalMoneyEarned = currentStats.totalMoneyEarned;
    newPlayerStats.totalBusinessLevelsPurchased = currentStats.totalBusinessLevelsPurchased;
    newPlayerStats.totalDividendsEarned = currentStats.totalDividendsEarned;
    newPlayerStats.totalMineralsDug = currentStats.totalMineralsDug;
    newPlayerStats.totalFactoryComponentsProduced = currentStats.totalFactoryComponentsProduced;

    // Reset money but with starting bonus
    const startingMoneyBonus = getStartingMoneyBonus(newPlayerStats.unlockedSkillIds, skillTreeRef.current, newPlayerStats.hqUpgradeLevels, hqUpgradesRef.current, newPlayerStats.unlockedArtifactIds, INITIAL_ARTIFACTS);
    newPlayerStats.money = INITIAL_MONEY + startingMoneyBonus;

    // Reset businesses but respect retention HQ upgrades
    const newBusinesses = INITIAL_BUSINESSES.map(biz => {
        const retentionUpgradeId = `retain_level_${biz.id}`;
        const retentionLevel = newPlayerStats.hqUpgradeLevels[retentionUpgradeId] || 0;
        let retainedLevels = 0;
        if (retentionLevel > 0) {
            const hqUpgrade = hqUpgradesRef.current.find(h => h.id === retentionUpgradeId);
            const levelData = hqUpgrade?.levels.find(l => l.level === retentionLevel);
            const retentionPercent = levelData?.effects.retentionPercentage || 0;
            const originalBusiness = currentBusinesses.find(b => b.id === biz.id);
            if (originalBusiness) {
                retainedLevels = Math.floor(originalBusiness.level * (retentionPercent / 100));
            }
        }
        return {
            ...biz,
            level: retainedLevels,
            managerOwned: false,
            upgrades: biz.upgrades ? biz.upgrades.map(upg => ({ ...upg, isPurchased: false })) : [],
            icon: biz.icon,
        };
    });

    // Reset stocks but respect retention HQ upgrades
    const newStockHoldings = currentStats.stockHoldings.map(holding => {
        const retentionUpgradeId = `retain_shares_${holding.stockId}`;
        const retentionLevel = newPlayerStats.hqUpgradeLevels[retentionUpgradeId] || 0;
        let retainedShares = 0;
        if (retentionLevel > 0) {
             const hqUpgrade = hqUpgradesRef.current.find(h => h.id === retentionUpgradeId);
            const levelData = hqUpgrade?.levels.find(l => l.level === retentionLevel);
            const retentionPercent = levelData?.effects.retentionPercentage || 0;
            retainedShares = Math.floor(holding.shares * (retentionPercent / 100));
        }
        return { ...holding, shares: retainedShares };
    }).filter(h => h.shares > 0);
    newPlayerStats.stockHoldings = newStockHoldings;
    
    // Reset ETFs (no retention for now)
    newPlayerStats.etfHoldings = [];

    // Reset quarry energy to max
    newPlayerStats.maxQuarryEnergy = calculateMaxEnergy(newPlayerStats);
    newPlayerStats.quarryEnergy = newPlayerStats.maxQuarryEnergy;

    setPlayerStats(newPlayerStats);
    setBusinesses(newBusinesses);
    setStocksWithDynamicPrices(INITIAL_STOCKS.map(s => ({ ...s })));

    if(playerStatsRef.current.toastSettings?.showPrestige ?? true) {
        toastRef.current({
            title: 'Prestige Successful!',
            description: `You gained ${finalPointsToAdd.toLocaleString()} prestige points.`,
        });
    }

    saveStateToLocalStorage();
  }, [getDynamicMaxWorkerEnergy, calculateMaxEnergy, saveStateToLocalStorage]);

  const hireWorker = useCallback(() => {
    // ... (This function remains the same)
  }, [getDynamicMaxWorkerEnergy]);


  const setLastMarketTrends = useCallback((trends: string) => { setLastMarketTrendsInternal(trends); }, []);
  const setLastRiskTolerance = useCallback((tolerance: "low" | "medium" | "high") => { setLastRiskToleranceInternal(tolerance); }, []);

  const updateToastSettings = useCallback((settings: ToastSettings) => {
    setPlayerStats(prev => ({
      ...prev,
      toastSettings: settings,
    }));
  }, []);

  const getQuarryDigPower = useCallback((): number => {
    let totalDigPower = 1;

    const playerStatsNow = playerStatsRef.current;
    const purchasedIds = playerStatsNow.purchasedQuarryUpgradeIds || [];

    purchasedIds.forEach(upgradeId => {
        const upgradeConfig = INITIAL_QUARRY_UPGRADES.find(u => u.id === upgradeId);
        if (upgradeConfig && upgradeConfig.effects.digPower) {
          totalDigPower += upgradeConfig.effects.digPower;
        }
    });

    (playerStatsNow.unlockedArtifactIds || []).forEach(artifactId => {
        const artifact = INITIAL_ARTIFACTS.find(a => a.id === artifactId);
        if (artifact?.effects.quarryDigPower) {
            totalDigPower += artifact.effects.quarryDigPower;
        }
    });

    return totalDigPower;
  }, []);

  const getMineralBonus = useCallback((): number => {
    let bonus = 0;
    const playerStatsNow = playerStatsRef.current;
    
    (playerStatsNow.purchasedQuarryUpgradeIds || []).forEach(upgradeId => {
      const upgradeConfig = INITIAL_QUARRY_UPGRADES.find(u => u.id === upgradeId);
      if (upgradeConfig?.effects.mineralBonus) {
        bonus += upgradeConfig.effects.mineralBonus;
      }
    });

    (playerStatsNow.unlockedArtifactIds || []).forEach(artifactId => {
      const artifact = INITIAL_ARTIFACTS.find(a => a.id === artifactId);
      if (artifact?.effects.mineralBonus) {
        bonus += artifact.effects.mineralBonus;
      }
    });

    return bonus;
  }, []);


  const getArtifactFindChances = useCallback((): ArtifactFindChances => {
    const playerStatsNow = playerStatsRef.current;
    const baseChance = BASE_ARTIFACT_CHANCE_PER_DIG;
    const depthMultiplier = Math.pow(ARTIFACT_CHANCE_DEPTH_MULTIPLIER, playerStatsNow.quarryDepth);
    const totalFindChance = baseChance * depthMultiplier;

    let weights = { ...ARTIFACT_RARITY_WEIGHTS };
    const bias = playerStatsNow.quarryRarityBias;
    
    if (bias && weights[bias]) {
        weights[bias] *= 2; 
    }

    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);

    const chances: ArtifactFindChances = { Common: 0, Uncommon: 0, Rare: 0, Legendary: 0, Mythic: 0 };

    if (totalWeight > 0) {
      for (const rarity in weights) {
          if (Object.prototype.hasOwnProperty.call(weights, rarity)) {
              const typedRarity = rarity as ArtifactRarity;
              chances[typedRarity] = (totalFindChance * (weights[typedRarity] / totalWeight)) * 100;
          }
      }
    }
    return chances;
  }, []);
  
  const digInQuarry = useCallback(() => {
    const playerStatsNow = playerStatsRef.current;
    if (playerStatsNow.quarryEnergy < QUARRY_ENERGY_COST_PER_DIG) return;

    const digPower = getQuarryDigPower();
    const mineralsFound = Math.floor(Math.random() * (digPower + getMineralBonus())) + 1;
    const digDepth = Math.max(1, Math.floor(digPower / 2)); // Dig at least 1cm

    const now = Date.now();
    materialCollectionCooldownEndRef.current = now + QUARRY_DIG_COOLDOWN_MS;
    setMaterialCollectionCooldownEnd(materialCollectionCooldownEndRef.current);

    let foundArtifact: Artifact | null = null;
    const totalFindChance = Object.values(getArtifactFindChances()).reduce((s, c) => s + c, 0) / 100;

    if (Math.random() < totalFindChance) {
        // Logic to select an artifact based on weighted chances
    }

    setPlayerStats(prev => ({
        ...prev,
        minerals: prev.minerals + mineralsFound,
        totalMineralsDug: (prev.totalMineralsDug || 0) + mineralsFound,
        quarryDepth: prev.quarryDepth + digDepth,
        quarryEnergy: prev.quarryEnergy - QUARRY_ENERGY_COST_PER_DIG,
        lastDigTimestamp: now,
    }));
  }, [getQuarryDigPower, getMineralBonus, getArtifactFindChances, calculateMaxEnergy]);

  const purchaseQuarryUpgrade = useCallback((upgradeId: string) => {
    // ... (This function remains the same)
  }, [calculateMaxEnergy]);

  const selectNextQuarry = useCallback((choice: QuarryChoice) => {
    // ... (This function remains the same)
  }, []);

  useEffect(() => {
    const loadGame = () => {
      try {
        const savedDataString = localStorage.getItem(SAVE_DATA_KEY);
        if (savedDataString) {
          const loadedData = JSON.parse(savedDataString);
  
          if (!loadedData.playerStats || !loadedData.businesses || !loadedData.stocks) {
            console.warn("Loaded save data is missing key properties. Starting new game.");
            return;
          }
  
          const defaultStats = getInitialPlayerStats();
          const mergedPlayerStats: PlayerStats = {
            ...defaultStats,
            ...loadedData.playerStats,
            stockHoldings: loadedData.playerStats.stockHoldings || [],
            etfHoldings: loadedData.playerStats.etfHoldings || [],
            hqUpgradeLevels: loadedData.playerStats.hqUpgradeLevels || {},
            unlockedSkillIds: loadedData.playerStats.unlockedSkillIds || [],
            purchasedQuarryUpgradeIds: loadedData.playerStats.purchasedQuarryUpgradeIds || [],
            unlockedArtifactIds: loadedData.playerStats.unlockedArtifactIds || [],
            unlockedResearchIds: loadedData.playerStats.unlockedResearchIds || [],
            unlockedFactoryComponentRecipeIds: loadedData.playerStats.unlockedFactoryComponentRecipeIds || [],
            factoryWorkers: loadedData.playerStats.factoryWorkers || [],
            factoryMachines: loadedData.playerStats.factoryMachines || [],
            factoryPowerBuildings: loadedData.playerStats.factoryPowerBuildings || [],
            factoryMaterialCollectors: loadedData.playerStats.factoryMaterialCollectors || [],
            factoryProductionLines: loadedData.playerStats.factoryProductionLines || defaultStats.factoryProductionLines,
            factoryProducedComponents: loadedData.playerStats.factoryProducedComponents || {},
            toastSettings: { ...defaultStats.toastSettings, ...loadedData.playerStats.toastSettings },
            activeIpo: loadedData.playerStats.activeIpo || null,
          };

          const hydratedBusinesses = loadedData.businesses.map((savedBusiness: Business) => {
            const initialBusiness = INITIAL_BUSINESSES.find(b => b.id === savedBusiness.id);
            if (initialBusiness) {
              return { ...savedBusiness, icon: initialBusiness.icon };
            }
            return savedBusiness;
          });

          const hydratedStocks = loadedData.stocks.map((savedStock: Stock) => {
            const initialStock = INITIAL_STOCKS.find(s => s.id === savedStock.id);
            if (initialStock) {
              return { ...savedStock, icon: initialStock.icon };
            }
            return savedStock;
          });
  
          setPlayerStats(mergedPlayerStats);
          setBusinesses(hydratedBusinesses);
          setStocksWithDynamicPrices(hydratedStocks);
          setLastSavedTimestamp(loadedData.lastSaved);
        }
      } catch (error) {
        console.error("Failed to load game state from local storage:", error);
      }
    };
  
    loadGame();
  }, []);

  useEffect(() => {
    const autoSaveTimer = setInterval(() => {
        saveStateToLocalStorage();
    }, AUTO_SAVE_INTERVAL);
    return () => clearInterval(autoSaveTimer);
  }, [saveStateToLocalStorage]);


  useEffect(() => {
    const stockUpdateTimer = setInterval(() => {
        setStocksWithDynamicPrices(prevStocks => {
            return prevStocks.map(stock => {
                const businesses = businessesRef.current;
                let synergyBoost = 0;
                businessSynergiesState.forEach(synergy => {
                    if (synergy.effect.type === 'STOCK_PRICE_BOOST' && synergy.effect.targetId === stock.id) {
                        const business = businesses.find(b => b.id === synergy.businessId);
                        if (business && business.level > 0) {
                            const boostTiers = Math.floor(business.level / synergy.perLevels);
                            synergyBoost += (boostTiers * synergy.effect.value) / 100;
                        }
                    }
                });
                
                const volatility = 0.1; // +/- 5%
                const randomChange = (Math.random() - 0.5) * volatility;
                const newPrice = stock.price * (1 + randomChange + synergyBoost);

                return { ...stock, price: Math.max(1, Math.floor(newPrice)) };
            });
        });
    }, STOCK_PRICE_UPDATE_INTERVAL);

    return () => clearInterval(stockUpdateTimer);
  }, [businessSynergiesState]);
  
  const getEffectPerUnit = (effects: FactoryComponent['effects']) => {
    // ... (This function remains the same)
  };


  useEffect(() => {
    const tick = setInterval(() => {
      const allBusinesses = businessesRef.current;
      const allStocks = stocksRef.current;
      const allEtfs = etfsState; // Use the static state here for calculation
      const prevStats = playerStatsRef.current;
      
      const businessIncome = allBusinesses.reduce((sum, biz) => sum + localCalculateIncome(
        biz, 
        prevStats.unlockedSkillIds, 
        skillTreeRef.current, 
        prevStats.hqUpgradeLevels, 
        hqUpgradesRef.current,
        prevStats.factoryProducedComponents || {},
        INITIAL_FACTORY_COMPONENTS_CONFIG
      ), 0);

      const stockDividendIncome = allStocks.reduce((sum, stock) => {
          const holding = prevStats.stockHoldings.find(h => h.stockId === stock.id);
          if (!holding) return sum;
          
          let componentBoostPercent = 0;
          for (const componentId in prevStats.factoryProducedComponents) {
              const count = prevStats.factoryProducedComponents[componentId];
              const config = INITIAL_FACTORY_COMPONENTS_CONFIG.find(c => c.id === componentId);
              if (config?.effects?.stockSpecificDividendYieldBoostPercent?.stockId === stock.id) {
                  const potentialBoost = count * config.effects.stockSpecificDividendYieldBoostPercent.percent;
                  componentBoostPercent += config.effects.maxBonusPercent ? Math.min(potentialBoost, config.effects.maxBonusPercent) : potentialBoost;
              }
          }
          const effectiveYield = stock.dividendYield * (1 + (componentBoostPercent / 100));
          return sum + (holding.shares * stock.price * effectiveYield);
      }, 0);

      const etfDividendIncome = allEtfs.reduce((sum, etf) => {
          const holding = prevStats.etfHoldings.find(h => h.etfId === etf.id);
          if(!holding) return sum;
          
          const underlyingStocks = allStocks.filter(stock => {
            if (etf.sector === 'TECH') return ['TINV', 'QLC', 'OMG'].includes(stock.ticker);
            if (etf.sector === 'ENERGY') return ['GEC', 'STLR'].includes(stock.ticker);
            if (etf.sector === 'FINANCE') return ['SRE', 'GC'].includes(stock.ticker);
            if (etf.sector === 'INDUSTRIAL') return ['MMTR', 'AETL'].includes(stock.ticker);
            if (etf.sector === 'AEROSPACE') return ['CVNT', 'STLR'].includes(stock.ticker);
            if (etf.sector === 'BIOTECH') return ['APRX', 'BSG', 'BFM'].includes(stock.ticker);
            return false;
          });

          if(underlyingStocks.length === 0) return sum;

          const totalUnderlyingDividend = underlyingStocks.reduce((divSum, stock) => divSum + (stock.price * stock.dividendYield), 0);
          
          let dividendBoost = 1;
          businessSynergiesState.forEach(synergy => {
            if (synergy.effect.type === 'ETF_DIVIDEND_BOOST' && synergy.effect.targetId === etf.id) {
                const business = businessesRef.current.find(b => b.id === synergy.businessId);
                if(business && business.level > 0) {
                    const boostTiers = Math.floor(business.level / synergy.perLevels);
                    dividendBoost += (boostTiers * synergy.effect.value) / 100;
                }
            }
          });

          const avgDividend = (totalUnderlyingDividend / underlyingStocks.length) * dividendBoost;
          return sum + (holding.shares * avgDividend);
      }, 0);

      const totalDividendIncome = stockDividendIncome + etfDividendIncome;
      const newTotalIncome = businessIncome + totalDividendIncome;

      const newInvestmentsValue = allStocks.reduce((sum, stock) => {
        const holding = prevStats.stockHoldings.find(h => h.stockId === stock.id);
        return sum + (holding ? holding.shares * stock.price : 0);
      }, 0) + allEtfs.reduce((sum, etf) => {
          const holding = prevStats.etfHoldings.find(h => h.etfId === etf.id);
          const etfPrice = allStocks.filter(s => {
            if (etf.sector === 'TECH') return ['TINV', 'QLC', 'OMG'].includes(s.ticker);
            if (etf.sector === 'ENERGY') return ['GEC', 'STLR'].includes(s.ticker);
            if (etf.sector === 'FINANCE') return ['SRE', 'GC'].includes(s.ticker);
            if (etf.sector === 'INDUSTRIAL') return ['MMTR', 'AETL'].includes(s.ticker);
            if (etf.sector === 'AEROSPACE') return ['CVNT', 'STLR'].includes(s.ticker);
            if (etf.sector === 'BIOTECH') return ['APRX', 'BSG', 'BFM'].includes(s.ticker);
            return false;
          }).reduce((priceSum, stock) => priceSum + stock.price, 0) / (allStocks.filter(s => {
             if (etf.sector === 'TECH') return ['TINV', 'QLC', 'OMG'].includes(s.ticker);
             return false;
          }).length || 1);
          
          return sum + (holding ? holding.shares * etfPrice : 0);
      }, 0);

      const newMaxQuarryEnergy = calculateMaxEnergy(prevStats);
      let newQuarryEnergy = prevStats.quarryEnergy;
      if (newQuarryEnergy < newMaxQuarryEnergy) {
          const energyToRegen = QUARRY_ENERGY_REGEN_PER_SECOND * (prevStats.factoryWorkerEnergyRegenModifier || 1);
          newQuarryEnergy = Math.min(newMaxQuarryEnergy, prevStats.quarryEnergy + energyToRegen);
      }
      
      const autoDigRate = (prevStats.purchasedQuarryUpgradeIds || [])
          .map(id => INITIAL_QUARRY_UPGRADES.find(u => u.id === id)?.effects.automationRate || 0)
          .reduce((sum, rate) => sum + rate, 0);
      
      const mineralsFromAutomation = autoDigRate * 0.25;

      setPlayerStats(prev => ({
        ...prev,
        money: prev.money + newTotalIncome,
        totalDividendsEarned: (prev.totalDividendsEarned || 0) + totalDividendIncome,
        minerals: prev.minerals + mineralsFromAutomation,
        quarryDepth: prev.quarryDepth + autoDigRate,
        totalIncomePerSecond: newTotalIncome,
        investmentsValue: newInvestmentsValue,
        maxQuarryEnergy: newMaxQuarryEnergy,
        quarryEnergy: newQuarryEnergy,
        timePlayedSeconds: (prev.timePlayedSeconds || 0) + 1,
        totalMoneyEarned: (prev.totalMoneyEarned || 0) + newTotalIncome,
      }));

    }, GAME_TICK_INTERVAL);
    return () => clearInterval(tick);
  }, [localCalculateIncome, getDynamicMaxWorkerEnergy, calculateMaxEnergy, etfsState, businessSynergiesState]);

  useEffect(() => {
    // Auto-buy logic... (remains the same)
  }, [playerStats.money, playerStats.unlockedSkillIds, playerStats.factoryProducedComponents]);


  return (
    <GameContext.Provider value={{
      playerStats, businesses, stocks: onMarketStocks, etfs: etfsState, businessSynergies: businessSynergiesState, skillTree: skillTreeState, hqUpgrades: hqUpgradesState, researchItems: researchItemsState,
      lastSavedTimestamp, lastMarketTrends, setLastMarketTrends, lastRiskTolerance, setLastRiskTolerance,
      materialCollectionCooldownEnd, manualResearchCooldownEnd,
      upgradeBusiness, purchaseBusinessUpgrade, purchaseHQUpgrade, getBusinessIncome, getBusinessUpgradeCost,
      buyStock, sellStock, buyEtf, sellEtf, buyIpoShares, performPrestige, unlockSkillNode, getDynamicMaxBusinessLevel,
      calculateCostForNLevelsForDisplay, calculateMaxAffordableLevelsForDisplay,
      manualSaveGame, exportGameState, importGameState, wipeGameData,
      purchaseFactoryBuilding, purchaseFactoryPowerBuilding, manuallyCollectRawMaterials, purchaseFactoryMachine,
      setRecipeForProductionSlot, purchaseFactoryMaterialCollector, manuallyGenerateResearchPoints, purchaseResearch,
      hireWorker, assignWorkerToMachine, unlockProductionLine, purchaseFactoryMachineUpgrade,
      getQuarryDigPower, getMineralBonus, digInQuarry, purchaseQuarryUpgrade, getArtifactFindChances, selectNextQuarry,
      updateToastSettings, setRecipeForEntireLine,
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


"use client";

import type { Business, PlayerStats, Stock, StockHolding, SkillNode, SaveData, HQUpgrade, HQUpgradeLevel, FactoryPowerBuilding, FactoryMachine, FactoryProductionLine, FactoryPowerBuildingConfig, FactoryMachineConfig, FactoryComponent, FactoryProductionLineSlot, ResearchItemConfig, Worker, WorkerStatus, FactoryMachineUpgradeConfig, FactoryProductionProgressData, Artifact, ArtifactRarity, ArtifactFindChances, QuarryUpgrade, QuarryChoice, ToastSettings, ETF, BusinessSynergy, IPO, EtfHolding, FarmField, Crop, FarmVehicleConfig, FarmVehicle, CropId, FarmActivity } from '@/types';
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
  INITIAL_ETFS, BUSINESS_SYNERGIES, FARM_PURCHASE_COST, INITIAL_FARM_FIELDS, FARM_CROPS, FARM_VEHICLES,
  INITIAL_SILO_CAPACITY, INITIAL_FUEL_CAPACITY, SILO_UPGRADE_COST_BASE, SILO_UPGRADE_COST_MULTIPLIER, FUEL_DEPOT_UPGRADE_COST_BASE, FUEL_DEPOT_UPGRADE_COST_MULTIPLIER,
  FUEL_ORDER_COST_PER_LTR, FUEL_ORDER_AMOUNT, FUEL_DELIVERY_TIME_SECONDS, VEHICLE_REPAIR_COST_PER_PERCENT, VEHICLE_REPAIR_TIME_PER_PERCENT_SECONDS
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
  purchaseFarm: () => void;
  plantCrop: (fieldId: string, cropId: string, vehicleInstanceId: string) => void;
  harvestField: (fieldId: string) => void;
  cultivateField: (fieldId: string) => void;
  purchaseVehicle: (vehicleConfigId: string) => void;
  refuelVehicle: (vehicleInstanceId: string) => void;
  repairVehicle: (vehicleInstanceId: string) => void;
  orderFuel: () => void;
  upgradeSilo: () => void;
  upgradeFuelDepot: () => void;
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
    farmPurchased: false,
    farmFields: INITIAL_FARM_FIELDS,
    farmVehicles: [],
    siloCapacity: INITIAL_SILO_CAPACITY,
    fuelCapacity: INITIAL_FUEL_CAPACITY,
    siloStorage: [],
    fuelStorage: 0,
    pendingFuelDelivery: undefined,
    kitchenInventory: [],
    kitchenQueue: [],
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
        farmPurchased: data.playerStats.farmPurchased || false,
        farmFields: data.playerStats.farmFields || INITIAL_FARM_FIELDS,
        farmVehicles: data.playerStats.farmVehicles || [],
        siloStorage: data.playerStats.siloStorage || [],
        fuelStorage: data.playerStats.fuelStorage || 0,
        pendingFuelDelivery: data.playerStats.pendingFuelDelivery,
        kitchenInventory: data.playerStats.kitchenInventory || [],
        kitchenQueue: data.playerStats.kitchenQueue || [],
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

      const hydratedFarmVehicles = (mergedPlayerStats.farmVehicles || []).map((savedVehicle: any) => {
        const configId = savedVehicle.configId || savedVehicle.id; // Compatibility for old saves
        const config = FARM_VEHICLES.find(v => v.id === configId);
        if (config) {
          return {
            ...savedVehicle,
            configId: config.id, // Ensure the new field is present
            icon: config.icon,   // Re-hydrate the icon function
            name: config.name,
            type: config.type,
            speedHaPerHr: config.speedHaPerHr,
            fuelCapacity: config.fuelCapacity,
            fuelUsageLtrPerHr: config.fuelUsageLtrPerHr,
            wearPerHr: config.wearPerHr,
            purchaseCost: config.purchaseCost,
          };
        }
        return null;
      }).filter(Boolean) as FarmVehicle[];
      mergedPlayerStats.farmVehicles = hydratedFarmVehicles;
  
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

    // Reset farm
    newPlayerStats.farmPurchased = currentStats.farmPurchased;
    newPlayerStats.farmFields = currentStats.farmFields || INITIAL_FARM_FIELDS;
    newPlayerStats.farmVehicles = currentStats.farmVehicles || [];

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

  const purchaseFarm = useCallback(() => {
    setPlayerStats(prev => {
      if (prev.money < FARM_PURCHASE_COST || prev.farmPurchased) return prev;
      return {
        ...prev,
        money: prev.money - FARM_PURCHASE_COST,
        farmPurchased: true,
        farmFields: INITIAL_FARM_FIELDS,
        farmVehicles: [
          { ...FARM_VEHICLES[0], configId: FARM_VEHICLES[0].id, instanceId: `tractor_${Date.now()}`, fuel: 100, wear: 0, status: 'Idle' }
        ],
      };
    });
  }, []);

  const plantCrop = useCallback((fieldId: string, cropId: CropId, vehicleInstanceId: string) => {
    setPlayerStats(prev => {
      const farmFields = prev.farmFields ? [...prev.farmFields] : [];
      const fieldIndex = farmFields.findIndex(f => f.id === fieldId);
      if (fieldIndex === -1 || farmFields[fieldIndex].status !== 'Empty') return prev;

      const farmVehicles = prev.farmVehicles ? [...prev.farmVehicles] : [];
      const vehicleIndex = farmVehicles.findIndex(v => v.instanceId === vehicleInstanceId);
      if (vehicleIndex === -1) return prev;

      const vehicle = farmVehicles[vehicleIndex];
      const cropConfig = FARM_CROPS.find(c => c.id === cropId);
      if (!cropConfig || vehicle.status !== 'Idle' || vehicle.fuel <= 0 || vehicle.type !== 'Tractor') return prev;

      const field = farmFields[fieldIndex];
      const sowingTimeHours = field.sizeHa / vehicle.speedHaPerHr;
      const sowingTimeSeconds = sowingTimeHours * 3600;

      const activity: FarmActivity = { type: 'Sowing', startTime: Date.now(), durationSeconds: sowingTimeSeconds, vehicleId: vehicle.instanceId, cropId: cropId };

      farmFields[fieldIndex] = {
        ...field,
        status: 'Sowing',
        currentCropId: cropId,
        activity
      };

      farmVehicles[vehicleIndex] = { ...vehicle, status: 'Working', activity: farmFields[fieldIndex].activity };

      return { ...prev, farmFields, farmVehicles };
    });
  }, []);

  const harvestField = useCallback((fieldId: string) => {
    setPlayerStats(prev => {
      const fieldIndex = (prev.farmFields || []).findIndex(f => f.id === fieldId);
      if (fieldIndex === -1 || prev.farmFields![fieldIndex].status !== 'ReadyToHarvest') return prev;

      const availableHarvesterIndex = (prev.farmVehicles || []).findIndex(v => v.type === 'Harvester' && v.status === 'Idle');
      if (availableHarvesterIndex === -1) {
        toastRef.current({ title: "No Harvester Available", variant: "destructive" });
        return prev;
      }

      const farmFields = [...prev.farmFields!];
      const farmVehicles = [...prev.farmVehicles!];
      const field = farmFields[fieldIndex];
      const harvester = farmVehicles[availableHarvesterIndex];

      if (harvester.fuel <= 0) {
        toastRef.current({ title: "Harvester Out of Fuel", variant: "destructive" });
        return prev;
      }
      
      const harvestTimeHours = field.sizeHa / harvester.speedHaPerHr;
      const harvestTimeSeconds = harvestTimeHours * 3600;
      const activity: FarmActivity = { type: 'Harvesting', startTime: Date.now(), durationSeconds: harvestTimeSeconds, vehicleId: harvester.instanceId, cropId: field.currentCropId };
      
      farmFields[fieldIndex] = { ...field, status: 'Harvesting', activity };
      farmVehicles[availableHarvesterIndex] = { ...harvester, status: 'Working', activity };

      return { ...prev, farmFields, farmVehicles };
    });
  }, []);

  const cultivateField = useCallback((fieldId: string) => {
    setPlayerStats(prev => {
      const fieldIndex = (prev.farmFields || []).findIndex(f => f.id === fieldId);
      if (fieldIndex === -1 || prev.farmFields![fieldIndex].status !== 'Cultivating' || prev.farmFields![fieldIndex].activity) return prev;

      const availableTractorIndex = (prev.farmVehicles || []).findIndex(v => v.type === 'Tractor' && v.status === 'Idle');
      if (availableTractorIndex === -1) {
        toastRef.current({ title: "No Tractor Available", variant: "destructive" });
        return prev;
      }

      const farmFields = [...prev.farmFields!];
      const farmVehicles = [...prev.farmVehicles!];
      const field = farmFields[fieldIndex];
      const tractor = farmVehicles[availableTractorIndex];

      if (tractor.fuel <= 0) {
        toastRef.current({ title: "Tractor Out of Fuel", variant: "destructive" });
        return prev;
      }
      
      const cultivateTimeHours = field.sizeHa / tractor.speedHaPerHr;
      const cultivateTimeSeconds = cultivateTimeHours * 3600;
      const activity: FarmActivity = { type: 'Cultivating', startTime: Date.now(), durationSeconds: cultivateTimeSeconds, vehicleId: tractor.instanceId };
      
      farmFields[fieldIndex] = { ...field, status: 'Cultivating', activity };
      farmVehicles[availableTractorIndex] = { ...tractor, status: 'Working', activity };

      return { ...prev, farmFields, farmVehicles };
    });
  }, []);

  const purchaseVehicle = useCallback((vehicleConfigId: string) => {
    const config = FARM_VEHICLES.find(v => v.id === vehicleConfigId);
    if (!config) {
      toastRef.current({ title: "Vehicle not found", variant: "destructive" });
      return;
    }

    setPlayerStats(prev => {
      if (prev.money < config.purchaseCost) {
        toastRef.current({ title: "Not enough money", variant: "destructive" });
        return prev;
      }

      const newVehicle: FarmVehicle = {
        instanceId: `${config.id}_${Date.now()}_${Math.random()}`,
        configId: config.id,
        name: config.name,
        type: config.type,
        icon: config.icon,
        speedHaPerHr: config.speedHaPerHr,
        fuelCapacity: config.fuelCapacity,
        fuelUsageLtrPerHr: config.fuelUsageLtrPerHr,
        wearPerHr: config.wearPerHr,
        purchaseCost: config.purchaseCost,
        fuel: config.fuelCapacity,
        wear: 0,
        status: 'Idle',
      };
      
      const updatedVehicles = [...(prev.farmVehicles || []), newVehicle];

      toastRef.current({ title: "Vehicle Purchased!", description: `You bought a new ${config.name}.` });

      return {
        ...prev,
        money: prev.money - config.purchaseCost,
        farmVehicles: updatedVehicles
      };
    });
  }, []);

  const refuelVehicle = useCallback((vehicleInstanceId: string) => {
    setPlayerStats(prev => {
      const vehicleIndex = (prev.farmVehicles || []).findIndex(v => v.instanceId === vehicleInstanceId);
      if (vehicleIndex === -1) return prev;
      
      const vehicle = prev.farmVehicles![vehicleIndex];
      const fuelNeeded = vehicle.fuelCapacity - vehicle.fuel;
      if (fuelNeeded <= 0 || (prev.fuelStorage || 0) < 1) {
        toastRef.current({ title: "Refuel Failed", description: vehicle.fuel >= vehicle.fuelCapacity ? "Vehicle is already full." : "No fuel in depot.", variant: "destructive"});
        return prev;
      }

      const fuelToTransfer = Math.min(fuelNeeded, prev.fuelStorage || 0);
      const newVehicles = [...prev.farmVehicles!];
      newVehicles[vehicleIndex] = { ...vehicle, fuel: vehicle.fuel + fuelToTransfer };

      toastRef.current({ title: "Refueled!", description: `Added ${fuelToTransfer.toFixed(0)}L of fuel to ${vehicle.name}.` });

      return {
        ...prev,
        fuelStorage: (prev.fuelStorage || 0) - fuelToTransfer,
        farmVehicles: newVehicles
      };
    });
  }, []);
  
  const repairVehicle = useCallback((vehicleInstanceId: string) => {
    setPlayerStats(prev => {
        const vehicleIndex = (prev.farmVehicles || []).findIndex(v => v.instanceId === vehicleInstanceId);
        if (vehicleIndex === -1) return prev;
        
        const vehicle = prev.farmVehicles![vehicleIndex];
        const cost = Math.ceil(vehicle.wear * VEHICLE_REPAIR_COST_PER_PERCENT);
        if (prev.money < cost || vehicle.status !== 'Idle' || vehicle.wear < 1) {
            toastRef.current({ title: "Repair Failed", description: "Not enough money or vehicle is busy/not damaged.", variant: "destructive"});
            return prev;
        }

        const repairTime = Math.ceil(vehicle.wear * VEHICLE_REPAIR_TIME_PER_PERCENT_SECONDS);
        const newVehicles = [...prev.farmVehicles!];
        newVehicles[vehicleIndex] = { 
            ...vehicle, 
            status: 'Repairing', 
            activity: { type: 'Repairing', startTime: Date.now(), durationSeconds: repairTime, repairAmount: vehicle.wear }
        };
        
        toastRef.current({ title: "Repair Started", description: `${vehicle.name} will be repaired in ${repairTime}s.`});

        return {
            ...prev,
            money: prev.money - cost,
            farmVehicles: newVehicles
        };
    });
  }, []);

  const orderFuel = useCallback(() => {
    setPlayerStats(prev => {
      if (prev.pendingFuelDelivery) {
        toastRef.current({ title: "Delivery in Progress", description: "A fuel delivery is already on its way.", variant: "destructive" });
        return prev;
      }
      const cost = FUEL_ORDER_COST_PER_LTR * FUEL_ORDER_AMOUNT;
      if (prev.money < cost) {
        toastRef.current({ title: "Order Failed", description: "Not enough money to order fuel.", variant: "destructive" });
        return prev;
      }
      
      toastRef.current({ title: "Fuel Ordered!", description: `${FUEL_ORDER_AMOUNT}L will arrive in ${FUEL_DELIVERY_TIME_SECONDS}s.` });
      
      return {
        ...prev,
        money: prev.money - cost,
        pendingFuelDelivery: { amount: FUEL_ORDER_AMOUNT, arrivalTime: Date.now() + FUEL_DELIVERY_TIME_SECONDS * 1000 }
      };
    });
  }, []);

  const upgradeSilo = useCallback(() => {
    setPlayerStats(prev => {
        const currentLevel = Math.floor(Math.log((prev.siloCapacity || 1000) / 1000) / Math.log(2));
        const cost = SILO_UPGRADE_COST_BASE * Math.pow(SILO_UPGRADE_COST_MULTIPLIER, currentLevel);
        if (prev.money < cost) {
            toastRef.current({ title: "Upgrade Failed", description: "Not enough money to upgrade the silo.", variant: "destructive" });
            return prev;
        }
        const newCapacity = (prev.siloCapacity || 1000) * 2;
        toastRef.current({ title: "Silo Upgraded!", description: `Storage capacity increased to ${newCapacity.toLocaleString()} units.` });
        return {
            ...prev,
            money: prev.money - cost,
            siloCapacity: newCapacity
        };
    });
  }, []);

  const upgradeFuelDepot = useCallback(() => {
    setPlayerStats(prev => {
        const currentLevel = Math.floor(Math.log((prev.fuelCapacity || 500) / 500) / Math.log(2));
        const cost = FUEL_DEPOT_UPGRADE_COST_BASE * Math.pow(FUEL_DEPOT_UPGRADE_COST_MULTIPLIER, currentLevel);
        if (prev.money < cost) {
            toastRef.current({ title: "Upgrade Failed", description: "Not enough money to upgrade the fuel depot.", variant: "destructive" });
            return prev;
        }
        const newCapacity = (prev.fuelCapacity || 500) * 2;
        toastRef.current({ title: "Fuel Depot Upgraded!", description: `Fuel capacity increased to ${newCapacity.toLocaleString()}L.` });
        return {
            ...prev,
            money: prev.money - cost,
            fuelCapacity: newCapacity
        };
    });
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
            farmPurchased: loadedData.playerStats.farmPurchased || false,
            farmFields: loadedData.playerStats.farmFields || INITIAL_FARM_FIELDS,
            farmVehicles: loadedData.playerStats.farmVehicles || [],
            siloStorage: loadedData.playerStats.siloStorage || [],
            fuelStorage: loadedData.playerStats.fuelStorage || 0,
            pendingFuelDelivery: loadedData.playerStats.pendingFuelDelivery,
            kitchenInventory: loadedData.playerStats.kitchenInventory || [],
            kitchenQueue: loadedData.playerStats.kitchenQueue || [],
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

          const hydratedFarmVehicles = (mergedPlayerStats.farmVehicles || []).map((savedVehicle: any) => {
            const configId = savedVehicle.configId || savedVehicle.id; // Compatibility for old saves
            const config = FARM_VEHICLES.find(v => v.id === configId);
            if (config) {
              return {
                ...savedVehicle,
                configId: config.id, // Ensure the new field is present
                icon: config.icon,   // Re-hydrate the icon function
                name: config.name,
                type: config.type,
                speedHaPerHr: config.speedHaPerHr,
                fuelCapacity: config.fuelCapacity,
                fuelUsageLtrPerHr: config.fuelUsageLtrPerHr,
                wearPerHr: config.wearPerHr,
                purchaseCost: config.purchaseCost,
              };
            }
            return null;
          }).filter(Boolean) as FarmVehicle[];
          mergedPlayerStats.farmVehicles = hydratedFarmVehicles;
  
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
      setPlayerStats(prev => {
        const now = Date.now();
        const updatedFarmFields = [...(prev.farmFields || [])];
        let updatedFarmVehicles = [...(prev.farmVehicles || [])];
        let siloStorage = [...(prev.siloStorage || [])];
        let farmStateChanged = false;
        
        updatedFarmFields.forEach((field, index) => {
          if (field.activity) {
            const activityEndTime = field.activity.startTime + (field.activity.durationSeconds * 1000);
            if (now >= activityEndTime) {
              farmStateChanged = true;
              const vehicleIndex = updatedFarmVehicles.findIndex(v => v.instanceId === field.activity?.vehicleId);
              let vehicle: FarmVehicle | undefined;
              if(vehicleIndex > -1) vehicle = updatedFarmVehicles[vehicleIndex];

              switch (field.activity.type) {
                case 'Sowing': {
                  const cropConfig = FARM_CROPS.find(c => c.id === field.currentCropId);
                  updatedFarmFields[index] = { ...field, status: 'Growing', activity: { type: 'Growing', startTime: now, durationSeconds: cropConfig?.growthTimeSeconds || 0, cropId: field.currentCropId } };
                  break;
                }
                case 'Growing': {
                  updatedFarmFields[index] = { ...field, status: 'ReadyToHarvest', activity: undefined };
                  break;
                }
                case 'Harvesting': {
                  const cropConfig = FARM_CROPS.find(c => c.id === field.currentCropId);
                  if (cropConfig) {
                    const yieldAmount = field.sizeHa * cropConfig.yieldPerHa;
                    const existingItemIndex = siloStorage.findIndex(item => item.cropId === cropConfig.id);
                    if (existingItemIndex > -1) {
                        siloStorage[existingItemIndex].quantity += yieldAmount;
                    } else {
                        siloStorage.push({ cropId: cropConfig.id, quantity: yieldAmount });
                    }
                    const totalSiloContent = siloStorage.reduce((sum, item) => sum + item.quantity, 0);
                    if (totalSiloContent > (prev.siloCapacity || 0)) {
                        const overflow = totalSiloContent - (prev.siloCapacity || 0);
                        siloStorage.find(i=> i.cropId === cropConfig.id)!.quantity -= overflow;
                        toastRef.current({ title: "Silo Full", description: `Some ${cropConfig.name} was lost due to lack of space.`, variant: "destructive" });
                    }
                  }
                  updatedFarmFields[index] = { ...field, status: 'Cultivating', currentCropId: undefined, activity: undefined };
                  break;
                }
                case 'Cultivating': {
                  updatedFarmFields[index] = { ...field, status: 'Empty', activity: undefined };
                  break;
                }
              }

              if (vehicle && vehicleIndex > -1) {
                const fuelUsed = (vehicle.fuelUsageLtrPerHr / 3600) * field.activity.durationSeconds;
                const wearAdded = (vehicle.wearPerHr / 3600) * field.activity.durationSeconds;
                updatedFarmVehicles[vehicleIndex] = { ...vehicle, status: 'Idle', activity: undefined, fuel: Math.max(0, vehicle.fuel - fuelUsed), wear: Math.min(100, vehicle.wear + wearAdded) };
              }
            }
          }
        });

        const newUpdatedVehicles = [...updatedFarmVehicles];
        let vehicleStateChanged = false;
        newUpdatedVehicles.forEach((vehicle, index) => {
            if (vehicle.status === 'Repairing' && vehicle.activity && now >= vehicle.activity.startTime + vehicle.activity.durationSeconds * 1000) {
                vehicleStateChanged = true;
                newUpdatedVehicles[index] = { ...vehicle, wear: 0, status: 'Idle', activity: undefined };
                toastRef.current({ title: "Repair Complete", description: `${vehicle.name} is fully repaired.`});
            }
        });
        if(vehicleStateChanged) updatedFarmVehicles = newUpdatedVehicles;

        let newFuelStorage = prev.fuelStorage || 0;
        let fuelDeliveryCompleted = false;
        if (prev.pendingFuelDelivery && now >= prev.pendingFuelDelivery.arrivalTime) {
            newFuelStorage = Math.min(prev.fuelCapacity, (prev.fuelStorage || 0) + prev.pendingFuelDelivery.amount);
            toastRef.current({ title: "Fuel Delivered!", description: `${prev.pendingFuelDelivery.amount}L of fuel has been added to your depot.` });
            fuelDeliveryCompleted = true;
        }

        // Other income calculations...
        const allBusinesses = businessesRef.current;
        const allStocks = stocksRef.current;
        const allEtfs = etfsState; // Use the static state here for calculation
        
        const businessIncome = allBusinesses.reduce((sum, biz) => sum + localCalculateIncome(
          biz, 
          prev.unlockedSkillIds, 
          skillTreeRef.current, 
          prev.hqUpgradeLevels, 
          hqUpgradesRef.current,
          prev.factoryProducedComponents || {},
          INITIAL_FACTORY_COMPONENTS_CONFIG
        ), 0);
  
        const stockDividendIncome = allStocks.reduce((sum, stock) => {
            const holding = prev.stockHoldings.find(h => h.stockId === stock.id);
            if (!holding) return sum;
            
            let componentBoostPercent = 0;
            for (const componentId in prev.factoryProducedComponents) {
                const count = prev.factoryProducedComponents[componentId];
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
            const holding = prev.etfHoldings.find(h => h.etfId === etf.id);
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
          const holding = prev.stockHoldings.find(h => h.stockId === stock.id);
          return sum + (holding ? holding.shares * stock.price : 0);
        }, 0) + allEtfs.reduce((sum, etf) => {
            const holding = prev.etfHoldings.find(h => h.etfId === etf.id);
            const etfPrice = allStocks.filter(s => {
              if (etf.sector === 'TECH') return ['TINV', 'QLC', 'OMG'].includes(s.ticker);
               if (etf.sector === 'ENERGY') return ['GEC', 'STLR'].includes(s.ticker);
               if (etf.sector === 'FINANCE') return ['SRE', 'GC'].includes(s.ticker);
               if (etf.sector === 'INDUSTRIAL') return ['MMTR', 'AETL'].includes(s.ticker);
               if (etf.sector === 'AEROSPACE') return ['CVNT', 'STLR'].includes(s.ticker);
               if (etf.sector === 'BIOTECH') return ['APRX', 'BSG', 'BFM'].includes(s.ticker);
               return false;
            }).reduce((priceSum, stock, _, arr) => priceSum + stock.price / arr.length, 0);
            
            return sum + (holding ? holding.shares * etfPrice : 0);
        }, 0);
  
        const newMaxQuarryEnergy = calculateMaxEnergy(prev);
        let newQuarryEnergy = prev.quarryEnergy;
        if (newQuarryEnergy < newMaxQuarryEnergy) {
            const energyToRegen = QUARRY_ENERGY_REGEN_PER_SECOND * (prev.factoryWorkerEnergyRegenModifier || 1);
            newQuarryEnergy = Math.min(newMaxQuarryEnergy, prev.quarryEnergy + energyToRegen);
        }
        
        const autoDigRate = (prev.purchasedQuarryUpgradeIds || [])
            .map(id => INITIAL_QUARRY_UPGRADES.find(u => u.id === id)?.effects.automationRate || 0)
            .reduce((sum, rate) => sum + rate, 0);
        
        const mineralsFromAutomation = autoDigRate * 0.25;

        return {
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
          farmFields: farmStateChanged ? updatedFarmFields : prev.farmFields,
          farmVehicles: farmStateChanged || vehicleStateChanged ? updatedFarmVehicles : prev.farmVehicles,
          siloStorage: farmStateChanged ? siloStorage : prev.siloStorage,
          fuelStorage: newFuelStorage,
          pendingFuelDelivery: fuelDeliveryCompleted ? undefined : prev.pendingFuelDelivery,
        };
      });

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
      purchaseFarm, plantCrop, harvestField, cultivateField, purchaseVehicle,
      refuelVehicle, repairVehicle, orderFuel, upgradeSilo, upgradeFuelDepot,
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

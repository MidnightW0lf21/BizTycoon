
"use client";

import type { Business, PlayerStats, Stock, StockHolding, SkillNode, SaveData, HQUpgrade, HQUpgradeLevel, FactoryPowerBuilding, FactoryMachine, FactoryProductionLine, FactoryPowerBuildingConfig, FactoryMachineConfig, FactoryComponent, FactoryProductionLineSlot, ResearchItemConfig, Worker, WorkerStatus, FactoryMachineUpgradeConfig, FactoryProductionProgressData, Artifact, ArtifactRarity, ArtifactFindChances, QuarryUpgrade, QuarryChoice, ToastSettings, ETF, BusinessSynergy, IPO, EtfHolding, FarmField, Crop, FarmVehicleConfig, FarmVehicle, CropId, FarmActivity, KitchenCraftingActivity, KitchenItem, KitchenRecipe } from '@/types';
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
  FUEL_ORDER_COST_PER_LTR, FUEL_DELIVERY_TIME_BASE_SECONDS, FUEL_DELIVERY_TIME_PER_LTR_SECONDS, VEHICLE_REPAIR_COST_PER_PERCENT, VEHICLE_REPAIR_TIME_PER_PERCENT_SECONDS, KITCHEN_RECIPES, SILO_CAPACITY_MAX, FUEL_CAPACITY_MAX,
  INITIAL_PANTRY_CAPACITY, PANTRY_CAPACITY_MAX, PANTRY_UPGRADE_COST_BASE, PANTRY_UPGRADE_COST_MULTIPLIER, INITIAL_WAREHOUSE_CAPACITY, WAREHOUSE_UPGRADE_COST_BASE, WAREHOUSE_UPGRADE_COST_MULTIPLIER, WAREHOUSE_CAPACITY_MAX
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
  performPrestige: () => void;
  purchaseHQUpgrade: (upgradeId: string) => void;
  getBusinessIncome: (businessId: string) => number;
  getBusinessUpgradeCost: (businessId: string) => number;
  buyStock: (stockId: string, sharesToBuy: number) => void;
  sellStock: (stockId: string, sharesToSell: number) => void;
  buyEtf: (etfId: string, sharesToBuy: number, currentPrice: number) => void;
  sellEtf: (etfId: string, sharesToSell: number, currentPrice: number) => void;
  buyIpoShares: (stockId: string, sharesToBuy: number) => void;
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
  purchaseFarmField: (fieldId: string) => void;
  plantCrop: (fieldId: string, cropId: string, vehicleInstanceId: string) => void;
  harvestField: (fieldId: string) => void;
  cultivateField: (fieldId: string) => void;
  purchaseVehicle: (vehicleConfigId: string) => void;
  refuelVehicle: (vehicleInstanceId: string) => void;
  repairVehicle: (vehicleInstanceId: string) => void;
  sellVehicle: (vehicleInstanceId: string) => void;
  orderFuel: (amount: number) => void;
  upgradeSilo: () => void;
  upgradeFuelDepot: () => void;
  upgradePantry: () => void;
  upgradeWarehouse: () => void;
  craftKitchenRecipe: (recipeId: string, quantity: number) => void;
  shipKitchenItem: (itemId: string, quantity: number) => void;
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
    pantryCapacity: INITIAL_PANTRY_CAPACITY,
    siloStorage: [],
    fuelStorage: 0,
    pendingFuelDelivery: undefined,
    kitchenInventory: [],
    kitchenQueue: [],
    warehouseStorage: [],
    warehouseCapacity: INITIAL_WAREHOUSE_CAPACITY,
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
  
  const prevPlayerStatsRef = useRef<PlayerStats>();
  useEffect(() => {
    prevPlayerStatsRef.current = playerStats;
  });
  const prevPlayerStats = prevPlayerStatsRef.current;

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
        pantryCapacity: data.playerStats.pantryCapacity || INITIAL_PANTRY_CAPACITY,
        pendingFuelDelivery: data.playerStats.pendingFuelDelivery,
        kitchenInventory: data.playerStats.kitchenInventory || [],
        kitchenQueue: data.playerStats.kitchenQueue || [],
        warehouseStorage: data.playerStats.warehouseStorage || [],
        warehouseCapacity: data.playerStats.warehouseCapacity || INITIAL_WAREHOUSE_CAPACITY,
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

      const hydratedFarmVehicles = (mergedPlayerStats.farmVehicles || []).map((savedVehicle: FarmVehicle) => {
        const config = FARM_VEHICLES.find(v => v.id === savedVehicle.configId);
        if (config) {
          return { ...savedVehicle, icon: config.icon, purchaseCost: config.purchaseCost };
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
  }, [toast]);

  const wipeGameData = useCallback(() => {
    localStorage.removeItem(SAVE_DATA_KEY);
    toastRef.current({
      title: "Game Data Wiped",
      description: "All progress has been reset. The game will now reload.",
    });
    setTimeout(() => window.location.reload(), 1500);
  }, [toast]);

  const purchaseBusinessUpgrade = useCallback((businessId: string, upgradeId: string, isAutoBuy: boolean = false): boolean => {
    const business = businessesRef.current.find(b => b.id === businessId);
    if (!business) return false;

    const upgrade = business.upgrades?.find(u => u.id === upgradeId);
    if (!upgrade || upgrade.isPurchased || playerStatsRef.current.money < upgrade.cost || business.level < upgrade.requiredLevel) {
        return false;
    }

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
    
    setBusinesses(prevBusinesses => {
        const newBusinesses = [...prevBusinesses];
        const businessIndex = newBusinesses.findIndex(b => b.id === businessId);
        if (businessIndex === -1) return prevBusinesses;
        const targetBusiness = { ...newBusinesses[businessIndex] };
        if (!targetBusiness.upgrades) return prevBusinesses;
        const upgradeIndex = targetBusiness.upgrades.findIndex(u => u.id === upgradeId);
        if (upgradeIndex === -1) return prevBusinesses;
        
        targetBusiness.upgrades[upgradeIndex] = { ...upgrade, isPurchased: true };
        newBusinesses[businessIndex] = targetBusiness;
        return newBusinesses;
    });

    setPlayerStats(prev => ({
        ...prev,
        money: prev.money - upgrade.cost,
    }));
    
    return true;
  }, []);

  const upgradeBusiness = useCallback((businessId: string, levelsToAttempt: number = 1) => {
    const business = businessesRef.current.find(b => b.id === businessId);
    if (!business) return;

    const dynamicMaxLevel = getDynamicMaxBusinessLevel();
    if (business.level >= dynamicMaxLevel) return;

    const levelsToBuy = levelsToAttempt;
    const { totalCost, levelsPurchasable } = calculateCostForNLevelsForDisplay(businessId, levelsToBuy);

    if (levelsPurchasable > 0 && playerStatsRef.current.money >= totalCost) {
      if (playerStatsRef.current.toastSettings?.showManualPurchases) {
        toastRef.current({
          title: `${business.name} Leveled Up!`,
          description: `Purchased ${levelsPurchasable} level(s) for ${business.name}.`,
        });
      }

      setBusinesses(prevBusinesses => {
          const newBusinesses = [...prevBusinesses];
          const businessIndex = newBusinesses.findIndex(b => b.id === businessId);
          if (businessIndex === -1) return prevBusinesses;

          newBusinesses[businessIndex] = {
              ...newBusinesses[businessIndex],
              level: newBusinesses[businessIndex].level + levelsPurchasable,
          };
          return newBusinesses;
      });

      setPlayerStats(prev => ({
          ...prev,
          money: prev.money - totalCost,
          totalBusinessLevelsPurchased: (prev.totalBusinessLevelsPurchased || 0) + levelsPurchasable,
      }));
    }
  }, [getDynamicMaxBusinessLevel, calculateCostForNLevelsForDisplay]);

  const buyStock = useCallback((stockId: string, sharesToBuyInput: number) => {
    const playerStatsNow = playerStatsRef.current;
    const stock = stocksRef.current.find(s => s.id === stockId);

    if (!stock) {
        toast({ title: "Stock Not Found", variant: "destructive" });
        return;
    }
    if (playerStatsNow.timesPrestiged < 8) {
        toast({ title: "Stocks Locked", variant: "destructive" });
        return;
    }
    if (sharesToBuyInput <= 0) {
        toast({ title: "Invalid Amount", variant: "destructive" });
        return;
    }

    const existingHolding = playerStatsNow.stockHoldings.find(h => h.stockId === stockId);
    const sharesAlreadyOwnedByPlayer = existingHolding?.shares || 0;
    const sharesAvailableToBuy = stock.totalOutstandingShares - sharesAlreadyOwnedByPlayer;

    if (sharesAvailableToBuy <= 0) {
        toast({ title: "No Shares Available" });
        return;
    }

    let sharesToBuy = Math.min(sharesToBuyInput, sharesAvailableToBuy);
    const cost = stock.price * sharesToBuy;

    if (playerStatsNow.money < cost) {
        toast({ title: "Not Enough Money", variant: "destructive" });
        return;
    }
    
    if (playerStatsRef.current.toastSettings?.showStockTrades ?? true) {
      toast({ title: "Stock Purchased!" });
    }
    
    setPlayerStats(prev => ({
        ...prev,
        money: prev.money - cost,
        stockHoldings: prev.stockHoldings.find(h => h.stockId === stockId)
          ? prev.stockHoldings.map(h => h.stockId === stockId ? { ...h, shares: h.shares + sharesToBuy, averagePurchasePrice: ((h.averagePurchasePrice * h.shares) + (stock.price * sharesToBuy)) / (h.shares + sharesToBuy) } : h)
          : [...prev.stockHoldings, { stockId, shares: sharesToBuy, averagePurchasePrice: stock.price }]
    }));
  }, [toast]);

  const sellStock = useCallback((stockId: string, sharesToSell: number) => {
    const playerStatsNow = playerStatsRef.current;
    const stock = stocksRef.current.find(s => s.id === stockId);

    if (!stock) {
        toast({ title: "Stock Not Found", variant: "destructive" });
        return;
    }
    
    const holding = playerStatsNow.stockHoldings.find(h => h.stockId === stockId);
    if (!holding || holding.shares < sharesToSell) {
        toast({ title: "Not Enough Shares", variant: "destructive" });
        return;
    }
    
    if (playerStatsRef.current.toastSettings?.showStockTrades ?? true) {
      toast({ title: "Stock Sold!", description: `Sold ${sharesToSell.toLocaleString()} shares of ${stock.ticker}.` });
    }
    
    const earnings = stock.price * sharesToSell;
    setPlayerStats(prev => ({
        ...prev,
        money: prev.money + earnings,
        stockHoldings: prev.stockHoldings.map(h =>
            h.stockId === stockId ? { ...h, shares: h.shares - sharesToSell } : h
        ).filter(h => h.shares > 0)
    }));
  }, [toast]);
  
  const buyEtf = useCallback((etfId: string, sharesToBuyInput: number, currentPrice: number) => {
    const playerStatsNow = playerStatsRef.current;
    const etf = etfsState.find(e => e.id === etfId);

    if (!etf) {
        toast({ title: "ETF Not Found", variant: "destructive" });
        return;
    }
    if (playerStatsNow.timesPrestiged < 8) {
        toast({ title: "Stocks Locked", variant: "destructive" });
        return;
    }
    if (sharesToBuyInput <= 0) {
        toast({ title: "Invalid Amount", variant: "destructive" });
        return;
    }
    
    const existingHolding = playerStatsNow.etfHoldings.find(h => h.etfId === etfId);
    const sharesAlreadyOwnedByPlayer = existingHolding?.shares || 0;
    const sharesAvailableToBuy = etf.totalOutstandingShares - sharesAlreadyOwnedByPlayer;

    if (sharesAvailableToBuy <= 0) {
        toast({ title: "No Shares Available", variant: "destructive" });
        return;
    }
    
    const sharesToBuy = Math.min(sharesToBuyInput, sharesAvailableToBuy);
    const cost = currentPrice * sharesToBuy;

    if (playerStatsNow.money < cost) {
        toast({ title: "Not Enough Money", variant: "destructive" });
        return;
    }
    
    if (playerStatsRef.current.toastSettings?.showStockTrades ?? true) {
      toast({ title: "ETF Purchased!", description: `Bought ${sharesToBuy.toLocaleString()} shares of ${etf.ticker}.` });
    }

    setPlayerStats(prev => ({
        ...prev,
        money: prev.money - cost,
        etfHoldings: prev.etfHoldings.find(h => h.etfId === etfId)
            ? prev.etfHoldings.map(h => h.etfId === etfId ? { ...h, shares: h.shares + sharesToBuy, averagePurchasePrice: ((h.averagePurchasePrice * h.shares) + (currentPrice * sharesToBuy)) / (h.shares + sharesToBuy) } : h)
            : [...prev.etfHoldings, { etfId, shares: sharesToBuy, averagePurchasePrice: currentPrice }]
    }));
  }, [etfsState, toast]);
  
  const sellEtf = useCallback((etfId: string, sharesToSell: number, currentPrice: number) => {
    const playerStatsNow = playerStatsRef.current;
    const etf = etfsState.find(e => e.id === etfId);

    if (!etf) {
        toast({ title: "ETF Not Found", variant: "destructive" });
        return;
    }

    const holding = playerStatsNow.etfHoldings.find(h => h.etfId === etfId);
    if (!holding || holding.shares < sharesToSell) {
        toast({ title: "Not Enough Shares", variant: "destructive" });
        return;
    }
    
    if (playerStatsRef.current.toastSettings?.showStockTrades ?? true) {
      toast({ title: "ETF Sold!", description: `Sold ${sharesToSell.toLocaleString()} shares of ${etf.ticker}.` });
    }
    
    const earnings = currentPrice * sharesToSell;
    setPlayerStats(prev => ({
        ...prev,
        money: prev.money + earnings,
        etfHoldings: prev.etfHoldings.map(h =>
            h.etfId === etfId ? { ...h, shares: h.shares - sharesToSell } : h
        ).filter(h => h.shares > 0)
    }));
  }, [etfsState, toast]);
  
  const buyIpoShares = useCallback((stockId: string, sharesToBuy: number) => {
    const playerStatsNow = playerStatsRef.current;
    const activeIpo = playerStatsNow.activeIpo;
  
    if (!activeIpo || activeIpo.stockId !== stockId) {
        toast({ title: "IPO Not Active", variant: "destructive" });
        return;
    }
    if (sharesToBuy <= 0) {
        toast({ title: "Invalid Amount", variant: "destructive" });
        return;
    }
    if (sharesToBuy > activeIpo.sharesRemaining) {
        toast({ title: "Not Enough Shares in IPO", variant: "destructive" });
        return;
    }

    const cost = activeIpo.ipoPrice * sharesToBuy;
    if (playerStatsNow.money < cost) {
        toast({ title: "Not Enough Money", variant: "destructive" });
        return;
    }
    
    const stock = stocksRef.current.find(s => s.id === stockId);
    if (playerStatsRef.current.toastSettings?.showStockTrades ?? true) {
      toast({ title: "IPO Shares Purchased!", description: `Bought ${sharesToBuy.toLocaleString()} shares of ${stock?.ticker}.` });
    }

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
  }, [toast]);

  const performPrestige = useCallback(() => {
    const playerStatsNow = playerStatsRef.current;
    const moneyRequiredForFirstPrestige = 100000;
    
    if (playerStatsNow.money < moneyRequiredForFirstPrestige && playerStatsNow.timesPrestiged === 0) {
      toast({ title: "Prestige Failed", description: "You need at least $100,000 to prestige for the first time.", variant: "destructive"});
      return;
    }

    const totalBusinessLevels = businessesRef.current.reduce((sum, b) => sum + b.level, 0);
    const newPoints = calculateDiminishingPrestigePoints(totalBusinessLevels);
    
    if (newPoints <= playerStatsNow.prestigePoints && playerStatsNow.timesPrestiged > 0) {
      toast({ title: "No New Points", description: "You wouldn't gain any new prestige points right now. Level up your businesses further!", variant: "default" });
      return;
    }

    const boostPercent = getPrestigePointBoostPercent(
        playerStatsNow.unlockedSkillIds,
        skillTreeRef.current,
        playerStatsNow.hqUpgradeLevels,
        hqUpgradesRef.current,
        playerStatsNow.unlockedArtifactIds,
        INITIAL_ARTIFACTS
    );

    const basePointsGained = newPoints - playerStatsNow.prestigePoints;
    const finalPointsGained = Math.floor(basePointsGained * (1 + boostPercent / 100));

    if(playerStatsRef.current.toastSettings?.showPrestige) {
        toast({ title: "Prestige Successful!", description: `You gained ${finalPointsGained} Prestige Point(s)!` });
    }

    setPlayerStats(prev => {
        const startingMoneyBonus = getStartingMoneyBonus(
            prev.unlockedSkillIds,
            skillTreeRef.current,
            prev.hqUpgradeLevels,
            hqUpgradesRef.current,
            prev.unlockedArtifactIds,
            INITIAL_ARTIFACTS
        );

        const retainedStockHoldings = prev.stockHoldings.map(holding => {
            const retainUpgrade = hqUpgradesRef.current.find(u => u.id === `retain_shares_${holding.stockId}`);
            if (retainUpgrade) {
                const level = prev.hqUpgradeLevels[retainUpgrade.id] || 0;
                if (level > 0) {
                    const retentionData = retainUpgrade.levels.find(l => l.level === level);
                    const retentionPercent = retentionData?.effects.retentionPercentage || 0;
                    return { ...holding, shares: Math.floor(holding.shares * (retentionPercent / 100)) };
                }
            }
            return { ...holding, shares: 0 };
        }).filter(h => h.shares > 0);

        return {
          ...prev,
          money: INITIAL_MONEY + startingMoneyBonus,
          prestigePoints: prev.prestigePoints + finalPointsGained,
          timesPrestiged: prev.timesPrestiged + 1,
          stockHoldings: retainedStockHoldings,
          etfHoldings: [],
          activeIpo: null,
          minerals: 0,
          quarryDepth: 0,
          quarryLevel: 0,
          quarryName: "Starter's Pit",
          quarryRarityBias: null,
          quarryEnergy: calculateMaxEnergy(prev),
        };
    });

    setBusinesses(prevBusinesses => {
        return prevBusinesses.map(business => {
            const retainUpgrade = hqUpgradesRef.current.find(u => u.id === `retain_level_${business.id}`);
            let retainedLevel = 0;
            if (retainUpgrade) {
                const level = playerStatsRef.current.hqUpgradeLevels[retainUpgrade.id] || 0;
                if (level > 0) {
                    const retentionData = retainUpgrade.levels.find(l => l.level === level);
                    const retentionPercent = retentionData?.effects.retentionPercentage || 0;
                    retainedLevel = Math.floor(business.level * (retentionPercent / 100));
                }
            }
            return {
              ...business,
              level: retainedLevel,
              managerOwned: false,
              upgrades: business.upgrades?.map(upg => ({ ...upg, isPurchased: false })) || []
            };
        });
    });
  }, [calculateMaxEnergy, toast]);


  const unlockSkillNode = useCallback((skillId: string) => {
    const skill = skillTreeRef.current.find(s => s.id === skillId);
    if (!skill || playerStatsRef.current.unlockedSkillIds.includes(skillId)) return;

    const dependenciesMet = skill.dependencies ? skill.dependencies.every(dep => playerStatsRef.current.unlockedSkillIds.includes(dep)) : true;
    
    if (playerStatsRef.current.prestigePoints < skill.cost) {
      toast({ title: "Cannot Unlock Skill", description: "You don't have enough Prestige Points.", variant: "destructive" });
      return;
    }

    if (!dependenciesMet) {
      toast({ title: "Cannot Unlock Skill", description: "You are missing the required prerequisite skills.", variant: "destructive" });
      return;
    }
    
    if (playerStatsRef.current.toastSettings?.showManualPurchases) {
      toast({ title: "Skill Unlocked!", description: `You unlocked: ${skill.name}` });
    }
    
    setPlayerStats(prev => ({
      ...prev,
      prestigePoints: prev.prestigePoints - skill.cost,
      unlockedSkillIds: [...prev.unlockedSkillIds, skillId],
    }));

  }, [toast]);

  const purchaseHQUpgrade = useCallback((upgradeId: string) => {
    const upgradeConfig = hqUpgradesRef.current.find(u => u.id === upgradeId);
    if (!upgradeConfig) return;

    const currentLevel = playerStatsRef.current.hqUpgradeLevels[upgradeId] || 0;
    if (currentLevel >= upgradeConfig.levels.length) return;

    const nextLevelData = upgradeConfig.levels.find(l => l.level === currentLevel + 1);
    if (!nextLevelData) return;
    
    if (playerStatsRef.current.money < nextLevelData.costMoney || playerStatsRef.current.prestigePoints < (nextLevelData.costPrestigePoints || 0)) {
       toast({ title: "Cannot Afford HQ Upgrade", description: "You lack the required money or prestige points.", variant: "destructive" });
       return;
    }

    if (playerStatsRef.current.toastSettings?.showManualPurchases) {
      toast({ title: "HQ Upgrade Purchased!", description: `${upgradeConfig.name} upgraded to Level ${nextLevelData.level}.` });
    }
    
    setPlayerStats(prev => ({
        ...prev,
        money: prev.money - nextLevelData.costMoney,
        prestigePoints: prev.prestigePoints - (nextLevelData.costPrestigePoints || 0),
        hqUpgradeLevels: {
            ...prev.hqUpgradeLevels,
            [upgradeId]: nextLevelData.level,
        },
    }));
  }, [toast]);

  const purchaseFactoryBuilding = useCallback(() => {
    if (playerStatsRef.current.money < FACTORY_PURCHASE_COST || playerStatsRef.current.factoryPurchased) {
        toast({ title: "Purchase Failed", description: playerStatsRef.current.factoryPurchased ? "You already own a factory." : "Not enough money.", variant: "destructive"});
        return;
    }
    
    if(playerStatsRef.current.toastSettings?.showManualPurchases) {
        toast({ title: "Factory Purchased!", description: "You can now access the 'My Factory' page."});
    }

    setPlayerStats(prev => ({
        ...prev,
        money: prev.money - FACTORY_PURCHASE_COST,
        factoryPurchased: true,
        factoryProductionLines: prev.factoryProductionLines.map(line => line.id === 'line_1' ? { ...line, isUnlocked: true } : line)
    }));
  }, [toast]);

  const purchaseFactoryPowerBuilding = useCallback((configId: string) => {
    const config = INITIAL_FACTORY_POWER_BUILDINGS_CONFIG.find(c => c.id === configId);
    if (!config) return;

    const numOwned = (playerStatsRef.current.factoryPowerBuildings || []).filter(b => b.configId === configId).length;
    if (config.maxInstances !== undefined && numOwned >= config.maxInstances) return;

    const cost = config.baseCost * Math.pow(config.costMultiplier || 1.1, numOwned);
    if (playerStatsRef.current.money < cost) return;

    if (playerStatsRef.current.toastSettings?.showFactory) {
      toast({ title: "Power Building Constructed!", description: `Built a new ${config.name}.` });
    }

    setPlayerStats(prev => {
        const newBuilding: FactoryPowerBuilding = { instanceId: `${configId}_${Date.now()}`, configId };
        return {
            ...prev,
            money: prev.money - cost,
            factoryPowerBuildings: [...(prev.factoryPowerBuildings || []), newBuilding]
        };
    });
  }, [toast]);

  const manuallyCollectRawMaterials = useCallback(() => {
    if (Date.now() < materialCollectionCooldownEndRef.current) return;
    
    materialCollectionCooldownEndRef.current = Date.now() + MATERIAL_COLLECTION_COOLDOWN_MS;
    setMaterialCollectionCooldownEnd(materialCollectionCooldownEndRef.current);

    setPlayerStats(prev => {
        const spaceLeft = (prev.factoryRawMaterialsCap || 0) - prev.factoryRawMaterials;
        const amountToAdd = Math.min(MATERIAL_COLLECTION_AMOUNT, spaceLeft);
        if (amountToAdd <= 0) return prev;
        
        return {
            ...prev,
            factoryRawMaterials: prev.factoryRawMaterials + amountToAdd
        };
    });
  }, []);

  const purchaseFactoryMachine = useCallback((configId: string) => {
    const config = INITIAL_FACTORY_MACHINE_CONFIGS.find(c => c.id === configId);
    if (!config) return;

    const canAfford = playerStatsRef.current.money >= config.baseCost;
    if (!canAfford) {
        toast({ title: "Not enough money", variant: "destructive" });
        return;
    }
    
    if (playerStatsRef.current.toastSettings?.showFactory) {
      toast({ title: "Machine Constructed!", description: `Built a new ${config.name}.` });
    }

    setPlayerStats(prev => {
        const newMachine: FactoryMachine = {
            instanceId: `${configId}_${Date.now()}_${Math.random()}`,
            configId: configId,
            assignedProductionLineId: null,
            purchasedUpgradeIds: []
        };
        const updatedMachines = [...(prev.factoryMachines || []), newMachine];
        return {
            ...prev,
            money: prev.money - config.baseCost,
            factoryMachines: updatedMachines
        };
    });
  }, [toast]);

  const purchaseFactoryMachineUpgrade = useCallback((machineInstanceId: string, upgradeId: string) => {
    const machine = playerStatsRef.current.factoryMachines?.find(m => m.instanceId === machineInstanceId);
    if (!machine) return;
    
    const machineConfig = INITIAL_FACTORY_MACHINE_CONFIGS.find(mc => mc.id === machine.configId);
    if (!machineConfig?.upgrades) return;

    const upgradeConfig = machineConfig.upgrades.find(u => u.id === upgradeId);
    if (!upgradeConfig || (machine.purchasedUpgradeIds || []).includes(upgradeId)) return;

    const canAfford = playerStatsRef.current.money >= upgradeConfig.costMoney &&
                      (upgradeConfig.costRP ? playerStatsRef.current.researchPoints >= upgradeConfig.costRP : true);
    const researchMet = !upgradeConfig.requiredResearchId || (playerStatsRef.current.unlockedResearchIds || []).includes(upgradeConfig.requiredResearchId);

    if (!canAfford || !researchMet) return;

    if (playerStatsRef.current.toastSettings?.showFactory) {
      toast({ title: "Machine Upgrade Purchased!", description: `${machineConfig.name} - ${upgradeConfig.name}` });
    }

    setPlayerStats(prev => {
        const newMachines = [...prev.factoryMachines!];
        const machineIndex = newMachines.findIndex(m => m.instanceId === machineInstanceId);
        newMachines[machineIndex] = {
            ...machine,
            purchasedUpgradeIds: [...(machine.purchasedUpgradeIds || []), upgradeId]
        };
        return {
            ...prev,
            money: prev.money - upgradeConfig.costMoney,
            researchPoints: prev.researchPoints - (upgradeConfig.costRP || 0),
            factoryMachines: newMachines
        };
    });
  }, [toast]);

  const setRecipeForProductionSlot = useCallback((productionLineId: string, slotIndex: number, targetComponentId: string | null) => {
    setPlayerStats(prev => {
        const newLines = [...(prev.factoryProductionLines || [])];
        const lineIndex = newLines.findIndex(l => l.id === productionLineId);
        if (lineIndex === -1) return prev;

        const newLine = { ...newLines[lineIndex] };
        if (!newLine.slots[slotIndex]) return prev;

        newLine.slots = [...newLine.slots];
        newLine.slots[slotIndex] = { ...newLine.slots[slotIndex], targetComponentId };
        newLines[lineIndex] = newLine;
        
        return { ...prev, factoryProductionLines: newLines };
    });
  }, []);

  const purchaseFactoryMaterialCollector = useCallback((configId: string) => {
    const config = INITIAL_FACTORY_MATERIAL_COLLECTORS_CONFIG.find(c => c.id === configId);
    if (!config) return;

    const numOwned = (playerStatsRef.current.factoryMaterialCollectors || []).filter(c => c.configId === configId).length;
    if (config.maxInstances !== undefined && numOwned >= config.maxInstances) return;

    const cost = config.baseCost * Math.pow(config.costMultiplier || 1.15, numOwned);
    if (playerStatsRef.current.money < cost) return;

    if (playerStatsRef.current.toastSettings?.showFactory) {
        toast({ title: "Material Collector Deployed!", description: `Deployed a new ${config.name}.` });
    }

    setPlayerStats(prev => {
        const newCollector: FactoryMaterialCollector = {
            instanceId: `${configId}_${Date.now()}`,
            configId,
            currentMaterialsPerSecond: config.materialsPerSecond,
        };
        return {
            ...prev,
            money: prev.money - cost,
            factoryMaterialCollectors: [...(prev.factoryMaterialCollectors || []), newCollector]
        };
    });
  }, [toast]);

  const manuallyGenerateResearchPoints = useCallback(() => {
    if (Date.now() < manualResearchCooldownEndRef.current) return;
    
    const numBoostStages = (playerStatsRef.current.unlockedResearchIds || []).filter(id => id.startsWith("manual_rp_boost_")).length;
    const currentCostMoney = RESEARCH_MANUAL_GENERATION_COST_MONEY + (numBoostStages * MANUAL_RESEARCH_ADDITIVE_COST_INCREASE_PER_BOOST);
    
    if(playerStatsRef.current.money < currentCostMoney) {
        toastRef.current({ title: "Not enough money", description: "Cannot afford to conduct manual research.", variant: "destructive" });
        return;
    }

    manualResearchCooldownEndRef.current = Date.now() + RESEARCH_MANUAL_COOLDOWN_MS;
    setManualResearchCooldownEnd(manualResearchCooldownEndRef.current);

    setPlayerStats(prev => {
        const pointsToGain = RESEARCH_MANUAL_GENERATION_AMOUNT + (prev.manualResearchBonus || 0);
        return {
            ...prev,
            researchPoints: prev.researchPoints + pointsToGain,
            money: prev.money - currentCostMoney,
            lastManualResearchTimestamp: Date.now()
        };
    });
  }, []);

  const purchaseResearch = useCallback((researchId: string) => {
    const researchConfig = researchItemsRef.current.find(r => r.id === researchId);
    if (!researchConfig) return;

    const playerStatsNow = playerStatsRef.current;
    if ((playerStatsNow.unlockedResearchIds || []).includes(researchId)) return;

    const dependenciesMet = researchConfig.dependencies ? researchConfig.dependencies.every(dep => (playerStatsNow.unlockedResearchIds || []).includes(dep)) : true;
    if (!dependenciesMet) return;

    if (playerStatsNow.researchPoints < researchConfig.costRP || (researchConfig.costMoney && playerStatsNow.money < researchConfig.costMoney)) return;

    if(playerStatsRef.current.toastSettings?.showFactory) {
        toast({ title: "Research Completed!", description: `Unlocked: ${researchConfig.name}`});
    }

    setPlayerStats(prev => {
        let updatedStats = {
            ...prev,
            researchPoints: prev.researchPoints - researchConfig.costRP,
            money: prev.money - (researchConfig.costMoney || 0),
            unlockedResearchIds: [...(prev.unlockedResearchIds || []), researchId]
        };

        if (researchConfig.effects.upgradesWorkerEnergyTier) {
            updatedStats.currentWorkerEnergyTier = Math.min(WORKER_ENERGY_TIERS.length - 1, updatedStats.currentWorkerEnergyTier + 1);
        }
        if (researchConfig.effects.increaseManualResearchBonus) {
            updatedStats.manualResearchBonus = (updatedStats.manualResearchBonus || 0) + researchConfig.effects.increaseManualResearchBonus;
        }
        if (researchConfig.effects.increaseFactoryRawMaterialsCap) {
          updatedStats.factoryRawMaterialsCap = researchConfig.effects.increaseFactoryRawMaterialsCap;
        }
        if (researchConfig.effects.factoryWorkerEnergyRegenModifier) {
          updatedStats.factoryWorkerEnergyRegenModifier = researchConfig.effects.factoryWorkerEnergyRegenModifier;
        }
        return updatedStats;
    });
  }, [toast]);

  const unlockProductionLine = useCallback((lineId: string) => {
    const prev = playerStatsRef.current;
    const lineIndex = (prev.factoryProductionLines || []).findIndex(l => l.id === lineId);
    if (lineIndex === -1) return;

    const line = prev.factoryProductionLines![lineIndex];
    if (line.isUnlocked || !line.unlockCost || prev.money < line.unlockCost) return;
    
    if (playerStatsRef.current.toastSettings?.showFactory) {
        toast({ title: "Production Line Unlocked!", description: `${line.name} is now operational.` });
    }
    
    setPlayerStats(current => {
        const newLines = [...current.factoryProductionLines!];
        newLines[lineIndex] = { ...line, isUnlocked: true };
        return {
            ...current,
            money: current.money - line.unlockCost!,
            factoryProductionLines: newLines,
        };
    });
  }, [toast]);

  const assignWorkerToMachine = useCallback((workerId: string | null, machineInstanceId: string) => {
    setPlayerStats(prev => {
        const newWorkers = [...(prev.factoryWorkers || [])];

        const oldWorkerIndex = newWorkers.findIndex(w => w.assignedMachineInstanceId === machineInstanceId);
        if (oldWorkerIndex !== -1) {
            newWorkers[oldWorkerIndex] = { ...newWorkers[oldWorkerIndex], assignedMachineInstanceId: null };
        }
        
        if (workerId) {
            const newWorkerIndex = newWorkers.findIndex(w => w.id === workerId);
            if (newWorkerIndex !== -1) {
                const machineWasOccupiedBySomeoneElse = newWorkers[newWorkerIndex].assignedMachineInstanceId !== null && newWorkers[newWorkerIndex].assignedMachineInstanceId !== machineInstanceId;
                if(machineWasOccupiedBySomeoneElse){
                    const otherMachineId = newWorkers[newWorkerIndex].assignedMachineInstanceId;
                     const otherMachineWorkerIndex = newWorkers.findIndex(w => w.assignedMachineInstanceId === otherMachineId && w.id !== workerId);
                     if(otherMachineWorkerIndex > -1){
                         newWorkers[otherMachineWorkerIndex] = {...newWorkers[otherMachineWorkerIndex], assignedMachineInstanceId: null}
                     }
                }
                newWorkers[newWorkerIndex] = { ...newWorkers[newWorkerIndex], assignedMachineInstanceId: machineInstanceId };
            }
        }
        return { ...prev, factoryWorkers: newWorkers };
    });
  }, []);

  const setRecipeForEntireLine = useCallback((lineId: string, componentId: string) => {
    setPlayerStats(prev => {
        const lineIndex = prev.factoryProductionLines.findIndex(l => l.id === lineId);
        if (lineIndex === -1) return prev;

        const componentConfig = INITIAL_FACTORY_COMPONENTS_CONFIG.find(c => c.id === componentId);
        if (!componentConfig) return prev;

        const newLines = [...prev.factoryProductionLines];
        const lineToUpdate = { ...newLines[lineIndex] };
        
        lineToUpdate.slots = lineToUpdate.slots.map(slot => {
            if (slot.machineInstanceId) {
                const machine = prev.factoryMachines.find(m => m.instanceId === slot.machineInstanceId);
                const machineConfig = machine ? INITIAL_FACTORY_MACHINE_CONFIGS.find(mc => mc.id === machine.configId) : null;
                if (machineConfig && machineConfig.maxCraftableTier >= componentConfig.tier) {
                    return { ...slot, targetComponentId: componentId };
                }
            }
            return slot;
        });
        
        newLines[lineIndex] = lineToUpdate;

        return { ...prev, factoryProductionLines: newLines };
    });
  }, []);


  const hireWorker = useCallback(() => {
    const currentWorkerCount = (playerStatsRef.current.factoryWorkers || []).length;
    if (currentWorkerCount >= MAX_WORKERS) {
      toast({ title: "Max Workers Reached", variant: "destructive" });
      return;
    }
    
    const cost = Math.floor(WORKER_HIRE_COST_BASE * Math.pow(WORKER_HIRE_COST_MULTIPLIER, currentWorkerCount));
    if (playerStatsRef.current.money < cost) {
      toast({ title: "Not enough money", variant: "destructive" });
      return;
    }

    const firstName = WORKER_FIRST_NAMES[Math.floor(Math.random() * WORKER_FIRST_NAMES.length)];
    const lastName = WORKER_LAST_NAMES[Math.floor(Math.random() * WORKER_LAST_NAMES.length)];
    const newWorker: Worker = {
      id: `worker_${Date.now()}_${Math.random()}`,
      name: `${firstName} ${lastName}`,
      assignedMachineInstanceId: null,
      energy: getDynamicMaxWorkerEnergy(),
      status: 'idle',
    };

    if (playerStatsRef.current.toastSettings?.showFactory) {
      toast({ title: "Worker Hired!", description: `${newWorker.name} has joined the team.` });
    }

    setPlayerStats(prev => {
      return {
        ...prev,
        money: prev.money - cost,
        factoryWorkers: [...(prev.factoryWorkers || []), newWorker],
      };
    });
  }, [getDynamicMaxWorkerEnergy, toast]);


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
    const upgradeConfig = INITIAL_QUARRY_UPGRADES.find(u => u.id === upgradeId);
    if (!upgradeConfig) return;

    if ((playerStatsRef.current.purchasedQuarryUpgradeIds || []).includes(upgradeId) || playerStatsRef.current.minerals < upgradeConfig.cost) {
      return;
    }

    if (playerStatsRef.current.toastSettings?.showQuarry) {
      toast({ title: "Quarry Upgrade Purchased!", description: `Unlocked: ${upgradeConfig.name}` });
    }

    setPlayerStats(prev => {
      const newPurchasedIds = [...(prev.purchasedQuarryUpgradeIds || []), upgradeId];
      const newMaxEnergy = calculateMaxEnergy({ ...prev, purchasedQuarryUpgradeIds: newPurchasedIds });
      return {
          ...prev,
          minerals: prev.minerals - upgradeConfig.cost,
          purchasedQuarryUpgradeIds: newPurchasedIds,
          maxQuarryEnergy: newMaxEnergy,
      };
    });
  }, [calculateMaxEnergy, toast]);

  const selectNextQuarry = useCallback((choice: QuarryChoice) => {
    if (playerStatsRef.current.money < choice.cost) return;
    
    if (playerStatsRef.current.toastSettings?.showQuarry) {
        toast({ title: "New Quarry Selected!", description: `Started excavation at ${choice.name}.` });
    }
    setPlayerStats(prev => ({
        ...prev,
        money: prev.money - choice.cost,
        quarryName: choice.name,
        quarryDepth: 0,
        quarryTargetDepth: choice.depth,
        quarryLevel: prev.quarryLevel + 1,
        quarryRarityBias: choice.rarityBias,
    }));
  }, [toast]);

  const purchaseFarm = useCallback(() => {
    if (playerStatsRef.current.money < FARM_PURCHASE_COST || playerStatsRef.current.farmPurchased) return;
    
    toast({ title: "Farm Purchased!", description: "You can now begin your agricultural empire." });
    
    setPlayerStats(prev => ({
        ...prev,
        money: prev.money - FARM_PURCHASE_COST,
        farmPurchased: true,
        farmFields: INITIAL_FARM_FIELDS,
        farmVehicles: [
          { ...FARM_VEHICLES[0], configId: FARM_VEHICLES[0].id, instanceId: `tractor_${Date.now()}`, fuel: 100, wear: 0, status: 'Idle', purchaseCost: FARM_VEHICLES[0].purchaseCost }
        ],
    }));
  }, [toast]);

  const purchaseFarmField = useCallback((fieldId: string) => {
    const fieldToBuy = playerStatsRef.current.farmFields?.find(f => f.id === fieldId);
    if (!fieldToBuy || fieldToBuy.isOwned || playerStatsRef.current.money < fieldToBuy.purchaseCost) {
      toast({ title: "Cannot Afford Field", description: "Not enough money to purchase this field.", variant: "destructive" });
      return;
    }
    
    toast({ title: "Field Purchased!", description: `You have acquired ${fieldToBuy.name}.` });
    
    setPlayerStats(current => {
      const newFields = (current.farmFields || []).map(f =>
        f.id === fieldId ? { ...f, isOwned: true } : f
      );
      
      return {
        ...current,
        money: current.money - fieldToBuy.purchaseCost,
        farmFields: newFields
      };
    });
  }, [toast]);

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
    const prev = playerStatsRef.current;
    const fieldIndex = (prev.farmFields || []).findIndex(f => f.id === fieldId);
    if (fieldIndex === -1 || prev.farmFields![fieldIndex].status !== 'ReadyToHarvest') return;
  
    const availableHarvesterIndex = (prev.farmVehicles || []).findIndex(v => v.type === 'Harvester' && v.status === 'Idle');
    if (availableHarvesterIndex === -1) {
      toastRef.current({ title: "No Harvester Available", variant: "destructive" });
      return;
    }
  
    const harvester = prev.farmVehicles![availableHarvesterIndex];
    if (harvester.fuel <= 0) {
      toastRef.current({ title: "Harvester Out of Fuel", variant: "destructive" });
      return;
    }
  
    setPlayerStats(current => {
      const farmFields = [...current.farmFields!];
      const farmVehicles = [...current.farmVehicles!];
      const field = farmFields[fieldIndex];
      const harvesterToUpdate = farmVehicles[availableHarvesterIndex];
      
      const harvestTimeHours = field.sizeHa / harvesterToUpdate.speedHaPerHr;
      const harvestTimeSeconds = harvestTimeHours * 3600;
      const activity: FarmActivity = { type: 'Harvesting', startTime: Date.now(), durationSeconds: harvestTimeSeconds, vehicleId: harvesterToUpdate.instanceId, cropId: field.currentCropId };
      
      farmFields[fieldIndex] = { ...field, status: 'Harvesting', activity };
      farmVehicles[availableHarvesterIndex] = { ...harvesterToUpdate, status: 'Working', activity };
  
      return { ...current, farmFields, farmVehicles };
    });
  }, []);

  const cultivateField = useCallback((fieldId: string) => {
    const prev = playerStatsRef.current;
    const fieldIndex = (prev.farmFields || []).findIndex(f => f.id === fieldId);
    if (fieldIndex === -1 || prev.farmFields![fieldIndex].status !== 'Cultivating' || prev.farmFields![fieldIndex].activity) return;

    const availableTractorIndex = (prev.farmVehicles || []).findIndex(v => v.type === 'Tractor' && v.status === 'Idle');
    if (availableTractorIndex === -1) {
      toastRef.current({ title: "No Tractor Available", variant: "destructive" });
      return;
    }

    const tractor = prev.farmVehicles![availableTractorIndex];
    if (tractor.fuel <= 0) {
      toastRef.current({ title: "Tractor Out of Fuel", variant: "destructive" });
      return;
    }
    
    setPlayerStats(current => {
      const farmFields = [...current.farmFields!];
      const farmVehicles = [...current.farmVehicles!];
      const field = farmFields[fieldIndex];
      const tractorToUpdate = farmVehicles[availableTractorIndex];
      
      const cultivateTimeHours = field.sizeHa / tractorToUpdate.speedHaPerHr;
      const cultivateTimeSeconds = cultivateTimeHours * 3600;
      const activity: FarmActivity = { type: 'Cultivating', startTime: Date.now(), durationSeconds: cultivateTimeSeconds, vehicleId: tractorToUpdate.instanceId };
      
      farmFields[fieldIndex] = { ...field, status: 'Cultivating', activity };
      farmVehicles[availableTractorIndex] = { ...tractorToUpdate, status: 'Working', activity };

      return { ...current, farmFields, farmVehicles };
    });
  }, []);

  const purchaseVehicle = useCallback((vehicleConfigId: string) => {
    const config = FARM_VEHICLES.find(v => v.id === vehicleConfigId);
    if (!config) {
        toast({ title: "Vehicle not found", variant: "destructive" });
        return;
    }
    if (playerStatsRef.current.money < config.purchaseCost) {
        toast({ title: "Not enough money", variant: "destructive" });
        return;
    }

    toast({ title: "Vehicle Purchased!", description: `You bought a new ${config.name}.` });
    
    setPlayerStats(prev => {
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
        return {
            ...prev,
            money: prev.money - config.purchaseCost,
            farmVehicles: updatedVehicles
        };
    });
  }, [toast]);

  const sellVehicle = useCallback((vehicleInstanceId: string) => {
    const vehicle = playerStatsRef.current.farmVehicles?.find(v => v.instanceId === vehicleInstanceId);
    if (!vehicle || vehicle.status !== 'Idle') {
      toast({ title: "Cannot Sell", description: "Vehicle must be idle to sell.", variant: "destructive" });
      return;
    }
    
    const salePrice = Math.floor(vehicle.purchaseCost * 0.5 * (1 - vehicle.wear / 100));
    toast({ title: "Vehicle Sold!", description: `You sold ${vehicle.name} for $${salePrice.toLocaleString()}.` });

    setPlayerStats(current => {
      const newVehicles = (current.farmVehicles || []).filter(v => v.instanceId !== vehicleInstanceId);
      return {
        ...current,
        money: current.money + salePrice,
        farmVehicles: newVehicles,
      };
    });
  }, [toast]);

  const refuelVehicle = useCallback((vehicleInstanceId: string) => {
    const vehicle = playerStatsRef.current.farmVehicles?.find(v => v.instanceId === vehicleInstanceId);
    if (!vehicle) return;

    const fuelNeeded = vehicle.fuelCapacity - vehicle.fuel;
    if (fuelNeeded <= 0 || (playerStatsRef.current.fuelStorage || 0) < 1) {
        toast({ title: "Refuel Failed", description: vehicle.fuel >= vehicle.fuelCapacity ? "Vehicle is already full." : "No fuel in depot.", variant: "destructive"});
        return;
    }
    
    const fuelToTransfer = Math.min(fuelNeeded, playerStatsRef.current.fuelStorage || 0);
    toast({ title: "Refueled!", description: `Added ${fuelToTransfer.toFixed(0)}L of fuel to ${vehicle.name}.` });
    
    setPlayerStats(prev => {
        const newVehicles = [...prev.farmVehicles!];
        const vehicleIndex = newVehicles.findIndex(v => v.instanceId === vehicleInstanceId);
        newVehicles[vehicleIndex] = { ...vehicle, fuel: vehicle.fuel + fuelToTransfer };
        return {
            ...prev,
            fuelStorage: (prev.fuelStorage || 0) - fuelToTransfer,
            farmVehicles: newVehicles
        };
    });
  }, [toast]);
  
  const repairVehicle = useCallback((vehicleInstanceId: string) => {
    const vehicle = playerStatsRef.current.farmVehicles?.find(v => v.instanceId === vehicleInstanceId);
    if(!vehicle) return;
    
    const cost = Math.ceil(vehicle.wear * VEHICLE_REPAIR_COST_PER_PERCENT);
    if (playerStatsRef.current.money < cost || vehicle.status !== 'Idle' || vehicle.wear < 1) {
        toast({ title: "Repair Failed", description: "Not enough money or vehicle is busy/not damaged.", variant: "destructive"});
        return;
    }
    
    const repairTime = Math.ceil(vehicle.wear * VEHICLE_REPAIR_TIME_PER_PERCENT_SECONDS);
    toast({ title: "Repair Started", description: `${vehicle.name} will be repaired in ${repairTime}s.`});

    setPlayerStats(prev => {
        const newVehicles = [...prev.farmVehicles!];
        const vehicleIndex = newVehicles.findIndex(v => v.instanceId === vehicleInstanceId);
        newVehicles[vehicleIndex] = { 
            ...vehicle, 
            status: 'Repairing', 
            activity: { type: 'Repairing', startTime: Date.now(), durationSeconds: repairTime, repairAmount: vehicle.wear }
        };
        return {
            ...prev,
            money: prev.money - cost,
            farmVehicles: newVehicles
        };
    });
  }, [toast]);

  const orderFuel = useCallback((amount: number) => {
    if (playerStatsRef.current.pendingFuelDelivery) {
        toast({ title: "Delivery in Progress", description: "A fuel delivery is already on its way.", variant: "destructive" });
        return;
    }
    const cost = FUEL_ORDER_COST_PER_LTR * amount;
    if (playerStatsRef.current.money < cost) {
        toast({ title: "Order Failed", description: "Not enough money to order fuel.", variant: "destructive" });
        return;
    }
    
    const deliveryTime = FUEL_DELIVERY_TIME_BASE_SECONDS + (amount * FUEL_DELIVERY_TIME_PER_LTR_SECONDS);

    setPlayerStats(prev => ({
        ...prev,
        money: prev.money - cost,
        pendingFuelDelivery: { amount, arrivalTime: Date.now() + deliveryTime * 1000 }
    }));
  }, [toast]);

  const upgradeSilo = useCallback(() => {
    const prev = playerStatsRef.current;
    if ((prev.siloCapacity || 0) >= SILO_CAPACITY_MAX) {
      toast({ title: "Upgrade Failed", description: "Silo is at maximum capacity.", variant: "destructive" });
      return;
    }
    const currentLevel = Math.floor(Math.log((prev.siloCapacity || 1000) / 1000) / Math.log(2));
    const cost = Math.floor(SILO_UPGRADE_COST_BASE * Math.pow(SILO_UPGRADE_COST_MULTIPLIER, currentLevel));
    if (prev.money < cost) {
      toast({ title: "Upgrade Failed", description: "Not enough money to upgrade the silo.", variant: "destructive" });
      return;
    }
    
    toast({ title: "Silo Upgraded!", description: `Storage capacity increased.` });
    
    setPlayerStats(current => {
      const newCapacity = Math.min(SILO_CAPACITY_MAX, (current.siloCapacity || 1000) * 2);
      return {
          ...current,
          money: current.money - cost,
          siloCapacity: newCapacity
      }
    });
  }, [toast]);
  
  const upgradeFuelDepot = useCallback(() => {
    const prev = playerStatsRef.current;
    if ((prev.fuelCapacity || 0) >= FUEL_CAPACITY_MAX) {
      toast({ title: "Upgrade Failed", description: "Fuel Depot is at maximum capacity.", variant: "destructive" });
      return;
    }
    const currentLevel = Math.floor(Math.log((prev.fuelCapacity || 500) / 500) / Math.log(2));
    const cost = Math.floor(FUEL_DEPOT_UPGRADE_COST_BASE * Math.pow(FUEL_DEPOT_UPGRADE_COST_MULTIPLIER, currentLevel));
    if (prev.money < cost) {
      toast({ title: "Upgrade Failed", description: "Not enough money to upgrade the fuel depot.", variant: "destructive" });
      return;
    }
    
    toast({ title: "Fuel Depot Upgraded!", description: `Fuel capacity increased.` });
    
    setPlayerStats(current => {
      const newCapacity = Math.min(FUEL_CAPACITY_MAX, (current.fuelCapacity || 500) * 2);
      return {
          ...current,
          money: current.money - cost,
          fuelCapacity: newCapacity,
      };
    });
  }, [toast]);
  
  const upgradePantry = useCallback(() => {
    const prev = playerStatsRef.current;
    if ((prev.pantryCapacity || 0) >= PANTRY_CAPACITY_MAX) {
        toast({ title: "Upgrade Failed", description: "Pantry is at maximum capacity.", variant: "destructive" });
        return;
    }
    const currentLevel = Math.floor(Math.log((prev.pantryCapacity || 100) / 100) / Math.log(2));
    const cost = Math.floor(PANTRY_UPGRADE_COST_BASE * Math.pow(PANTRY_UPGRADE_COST_MULTIPLIER, currentLevel));
    if (prev.money < cost) {
        toast({ title: "Upgrade Failed", description: "Not enough money to upgrade the pantry.", variant: "destructive" });
        return;
    }

    toast({ title: "Pantry Upgraded!", description: `Pantry capacity increased.` });

    setPlayerStats(current => {
        const newCapacity = Math.min(PANTRY_CAPACITY_MAX, (current.pantryCapacity || 100) * 2);
        return {
            ...current,
            money: current.money - cost,
            pantryCapacity: newCapacity,
        };
    });
  }, [toast]);
  
  const upgradeWarehouse = useCallback(() => {
    const prev = playerStatsRef.current;
    if ((prev.warehouseCapacity || 0) >= WAREHOUSE_CAPACITY_MAX) {
      toast({ title: "Upgrade Failed", description: "Warehouse is at maximum capacity.", variant: "destructive" });
      return;
    }
    const currentLevel = Math.floor(Math.log((prev.warehouseCapacity || 1000) / 1000) / Math.log(2));
    const cost = Math.floor(WAREHOUSE_UPGRADE_COST_BASE * Math.pow(WAREHOUSE_UPGRADE_COST_MULTIPLIER, currentLevel));
    if (prev.money < cost) {
      toast({ title: "Upgrade Failed", description: "Not enough money to upgrade the warehouse.", variant: "destructive" });
      return;
    }
  
    toast({ title: "Warehouse Upgraded!", description: `Warehouse capacity increased.` });
    
    setPlayerStats(current => {
      const newCapacity = Math.min(WAREHOUSE_CAPACITY_MAX, (current.warehouseCapacity || 1000) * 2);
      return {
          ...current,
          money: current.money - cost,
          warehouseCapacity: newCapacity,
      };
    });
  }, [toast]);

  const craftKitchenRecipe = useCallback((recipeId: string, quantity: number) => {
    setPlayerStats(prev => {
        const recipe = KITCHEN_RECIPES.find(r => r.id === recipeId);
        if (!recipe) return prev;

        const totalIngredients = recipe.ingredients.map(ing => ({
            ...ing,
            quantity: ing.quantity * quantity,
        }));

        const hasIngredients = totalIngredients.every(ing => {
            const item = (prev.siloStorage || []).find(s => s.cropId === ing.cropId);
            return item && item.quantity >= ing.quantity;
        });

        if (!hasIngredients) {
            toastRef.current({ title: "Missing Ingredients", description: `You don't have enough raw materials to craft ${quantity}x ${recipe.name}.`, variant: "destructive" });
            return prev;
        }

        const newSiloStorage = [...(prev.siloStorage || [])];
        totalIngredients.forEach(ing => {
            const itemIndex = newSiloStorage.findIndex(s => s.cropId === ing.cropId);
            newSiloStorage[itemIndex].quantity -= ing.quantity;
        });
        
        const totalCraftTime = recipe.craftTimeSeconds * quantity;
        const newQueueItem: KitchenCraftingActivity = {
            recipeId,
            quantity,
            completionTime: Date.now() + totalCraftTime * 1000,
        };

        const newQueue = [...(prev.kitchenQueue || []), newQueueItem];
        
        return { ...prev, siloStorage: newSiloStorage, kitchenQueue: newQueue };
    });
  }, []);

  const shipKitchenItem = useCallback((itemId: string, quantity: number) => {
    setPlayerStats(prev => {
        const itemToShip = (prev.kitchenInventory || []).find(item => item.itemId === itemId);
        if (!itemToShip || itemToShip.quantity < quantity) {
            toastRef.current({ title: "Not enough items", variant: "destructive" });
            return prev;
        }

        const warehouseStock = (prev.warehouseStorage || []).reduce((sum, item) => sum + item.quantity, 0);
        const warehouseSpace = (prev.warehouseCapacity || 0) - warehouseStock;
        const actualShippedAmount = Math.min(quantity, warehouseSpace);

        if (actualShippedAmount <= 0) {
            toastRef.current({ title: "Warehouse Full", description: "No space available in the warehouse.", variant: "destructive" });
            return prev;
        }

        const newKitchenInventory = (prev.kitchenInventory || []).map(item => 
            item.itemId === itemId ? { ...item, quantity: item.quantity - actualShippedAmount } : item
        ).filter(item => item.quantity > 0);
        
        const newWarehouseStorage = [...(prev.warehouseStorage || [])];
        const existingWarehouseItemIndex = newWarehouseStorage.findIndex(item => item.itemId === itemId);
        if (existingWarehouseItemIndex > -1) {
            newWarehouseStorage[existingWarehouseItemIndex].quantity += actualShippedAmount;
        } else {
            newWarehouseStorage.push({ itemId, quantity: actualShippedAmount });
        }
        
        const recipe = KITCHEN_RECIPES.find(r => r.outputItemId === itemId);
        toastRef.current({ title: "Item Shipped!", description: `You shipped ${actualShippedAmount.toLocaleString()} x ${recipe?.name || itemId} to the warehouse.` });

        return { ...prev, kitchenInventory: newKitchenInventory, warehouseStorage: newWarehouseStorage };
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
            pantryCapacity: loadedData.playerStats.pantryCapacity || INITIAL_PANTRY_CAPACITY,
            pendingFuelDelivery: loadedData.playerStats.pendingFuelDelivery,
            kitchenInventory: loadedData.playerStats.kitchenInventory || [],
            kitchenQueue: loadedData.playerStats.kitchenQueue || [],
            warehouseStorage: loadedData.playerStats.warehouseStorage || [],
            warehouseCapacity: loadedData.playerStats.warehouseCapacity || INITIAL_WAREHOUSE_CAPACITY,
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

          const hydratedFarmVehicles = (mergedPlayerStats.farmVehicles || []).map((savedVehicle: FarmVehicle) => {
            const config = FARM_VEHICLES.find(v => v.id === savedVehicle.configId);
            if (config) {
              return { ...savedVehicle, icon: config.icon, purchaseCost: config.purchaseCost };
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
    if (!prevPlayerStats || !toast) return;

    if (playerStats.pendingFuelDelivery === undefined && prevPlayerStats.pendingFuelDelivery) {
        toast({ title: "Fuel Delivered!", description: `${prevPlayerStats.pendingFuelDelivery.amount}L of fuel has been added to your depot.` });
    }

    playerStats.farmVehicles?.forEach((vehicle) => {
        const prevVehicle = prevPlayerStats.farmVehicles?.find(pv => pv.instanceId === vehicle.instanceId);
        if (prevVehicle && prevVehicle.status === 'Repairing' && vehicle.status === 'Idle') {
            toast({ title: "Repair Complete", description: `${vehicle.name} is fully repaired.`});
        }
    });

  }, [playerStats, prevPlayerStats, toast]);

  useEffect(() => {
    const autoBuySkills = playerStatsRef.current.unlockedSkillIds
      .map(skillId => INITIAL_SKILL_TREE.find(s => s.id === skillId))
      .filter((skill): skill is SkillNode => !!(skill && skill.effects.autoBuyUpgradesForBusiness));
    
    if (autoBuySkills.length > 0) {
      autoBuySkills.forEach(skill => {
        const businessId = skill.effects.autoBuyUpgradesForBusiness;
        if (!businessId) return;

        const business = businessesRef.current.find(b => b.id === businessId);
        if (!business || !business.upgrades) return;

        business.upgrades.forEach(upgrade => {
          if (!upgrade.isPurchased) {
            purchaseBusinessUpgrade(business.id, upgrade.id, true);
          }
        });
      });
    }
  }, [playerStats.money, playerStats.unlockedSkillIds, purchaseBusinessUpgrade]);


  useEffect(() => {
    const tick = setInterval(() => {
      const now = Date.now();
      setPlayerStats(prev => {
        let updatedFarmFields = [...(prev.farmFields || [])];
        let updatedFarmVehicles = [...(prev.farmVehicles || [])];
        let siloStorage = [...(prev.siloStorage || [])];
        
        let farmStateChanged = false;

        // Process active vehicle tasks (fuel consumption, wear, etc.)
        updatedFarmVehicles = updatedFarmVehicles.map(vehicle => {
          if (vehicle.status === 'Working' && vehicle.activity) {
            farmStateChanged = true;
            const fuelUsedPerSecond = vehicle.fuelUsageLtrPerHr / 3600;
            const wearAddedPerSecond = vehicle.wearPerHr / 3600;
            return {
              ...vehicle,
              fuel: Math.max(0, vehicle.fuel - fuelUsedPerSecond),
              wear: Math.min(100, vehicle.wear + wearAddedPerSecond),
            };
          }
          return vehicle;
        });
        
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
                        const cropItem = siloStorage.find(i=> i.cropId === cropConfig.id);
                        if(cropItem) cropItem.quantity -= overflow;
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
                updatedFarmVehicles[vehicleIndex] = { ...vehicle, status: 'Idle', activity: undefined };
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
            }
        });
        if(vehicleStateChanged) updatedFarmVehicles = newUpdatedVehicles;

        let newFuelStorage = prev.fuelStorage || 0;
        let fuelDeliveryCompleted = false;
        if (prev.pendingFuelDelivery && now >= prev.pendingFuelDelivery.arrivalTime) {
            newFuelStorage = Math.min(prev.fuelCapacity, (prev.fuelStorage || 0) + prev.pendingFuelDelivery.amount);
            fuelDeliveryCompleted = true;
        }

        const kitchenQueue = [...(prev.kitchenQueue || [])];
        const kitchenInventory = [...(prev.kitchenInventory || [])];
        const completedCrafts = kitchenQueue.filter(q => now >= q.completionTime);
        if (completedCrafts.length > 0) {
            farmStateChanged = true;
            completedCrafts.forEach(craft => {
                const recipe = KITCHEN_RECIPES.find(r => r.id === craft.recipeId);
                if(recipe){
                    const totalOutput = recipe.outputQuantity * craft.quantity;
                    const currentPantryStock = kitchenInventory.reduce((sum, item) => sum + item.quantity, 0);
                    const spaceAvailable = (prev.pantryCapacity || 0) - currentPantryStock;
                    const amountToAdd = Math.min(totalOutput, spaceAvailable);

                    if (amountToAdd > 0) {
                      const existingItemIndex = kitchenInventory.findIndex(item => item.itemId === recipe.outputItemId);
                      if (existingItemIndex > -1) {
                          kitchenInventory[existingItemIndex].quantity += amountToAdd;
                      } else {
                          kitchenInventory.push({ itemId: recipe.outputItemId, quantity: amountToAdd });
                      }
                    }
                }
            });
        }
        const updatedKitchenQueue = kitchenQueue.filter(q => now < q.completionTime);

        const allBusinesses = businessesRef.current;
        const allStocks = stocksRef.current;
        const allEtfs = etfsState; 
        
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
        
        const mineralsFromAutomation = autoDigRate;
        const depthFromAutomation = autoDigRate > 0 ? Math.max(1, Math.floor(autoDigRate / 2)) : 0;

        const totalPowerGenerated = (prev.factoryPowerBuildings || []).reduce((sum, building) => {
            const config = INITIAL_FACTORY_POWER_BUILDINGS_CONFIG.find(c => c.id === building.configId);
            return sum + (config ? config.powerOutputKw : 0);
        }, 0);
        
        return {
          ...prev,
          money: prev.money + newTotalIncome,
          totalDividendsEarned: (prev.totalDividendsEarned || 0) + totalDividendIncome,
          minerals: prev.minerals + mineralsFromAutomation,
          quarryDepth: prev.quarryDepth + depthFromAutomation,
          totalMineralsDug: (prev.totalMineralsDug || 0) + mineralsFromAutomation,
          totalIncomePerSecond: newTotalIncome,
          investmentsValue: newInvestmentsValue,
          maxQuarryEnergy: newMaxQuarryEnergy,
          quarryEnergy: newQuarryEnergy,
          timePlayedSeconds: (prev.timePlayedSeconds || 0) + 1,
          totalMoneyEarned: (prev.totalMoneyEarned || 0) + newTotalIncome,
          factoryPowerUnitsGenerated: totalPowerGenerated,
          farmFields: farmStateChanged ? updatedFarmFields : prev.farmFields,
          farmVehicles: farmStateChanged || vehicleStateChanged ? updatedFarmVehicles : prev.farmVehicles,
          siloStorage: farmStateChanged ? siloStorage : prev.siloStorage,
          fuelStorage: newFuelStorage,
          pendingFuelDelivery: fuelDeliveryCompleted ? undefined : prev.pendingFuelDelivery,
          kitchenInventory: kitchenInventory,
          kitchenQueue: updatedKitchenQueue,
        };
      });

    }, GAME_TICK_INTERVAL);
    return () => clearInterval(tick);
  }, [localCalculateIncome, getDynamicMaxBusinessLevel, calculateMaxEnergy, etfsState, businessSynergiesState]);

  return (
    <GameContext.Provider value={{
      playerStats, businesses, stocks: onMarketStocks, etfs: etfsState, businessSynergies: businessSynergiesState, skillTree: skillTreeState, hqUpgrades: hqUpgradesState, researchItems: researchItemsState,
      lastSavedTimestamp, lastMarketTrends, setLastMarketTrends, lastRiskTolerance, setLastRiskTolerance,
      materialCollectionCooldownEnd, manualResearchCooldownEnd,
      upgradeBusiness, purchaseBusinessUpgrade, performPrestige, purchaseHQUpgrade, getBusinessIncome, getBusinessUpgradeCost,
      buyStock, sellStock, buyEtf, sellEtf, buyIpoShares, unlockSkillNode, getDynamicMaxBusinessLevel,
      calculateCostForNLevelsForDisplay, calculateMaxAffordableLevelsForDisplay,
      manualSaveGame, exportGameState, importGameState, wipeGameData,
      purchaseFactoryBuilding, purchaseFactoryPowerBuilding, manuallyCollectRawMaterials, purchaseFactoryMachine,
      setRecipeForProductionSlot, purchaseFactoryMaterialCollector, manuallyGenerateResearchPoints, purchaseResearch,
      hireWorker, assignWorkerToMachine, unlockProductionLine, purchaseFactoryMachineUpgrade,
      getQuarryDigPower, getMineralBonus, digInQuarry, purchaseQuarryUpgrade, getArtifactFindChances, selectNextQuarry,
      updateToastSettings, setRecipeForEntireLine,
      purchaseFarm, purchaseFarmField, plantCrop, harvestField, cultivateField, purchaseVehicle,
      refuelVehicle, repairVehicle, sellVehicle, orderFuel, upgradeSilo, upgradeFuelDepot, upgradePantry, upgradeWarehouse,
      craftKitchenRecipe, shipKitchenItem,
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

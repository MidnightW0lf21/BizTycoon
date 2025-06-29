
import type { LucideIcon } from "lucide-react";

export interface BusinessUpgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  requiredLevel: number;
  isPurchased: boolean;
  incomeBoostPercent?: number;
  levelUpgradeCostReductionPercent?: number;
  unlocksBulkBuy?: true;
}

export interface Business {
  id:string;
  name: string;
  level: number;
  baseIncome: number;
  baseCost: number;
  upgradeCostMultiplier: number;
  icon: LucideIcon;
  managerOwned: boolean;
  description: string;
  upgrades?: BusinessUpgrade[];
}

export interface Stock {
  id: string;
  ticker: string;
  companyName: string;
  price: number;
  dividendYield: number;
  icon: LucideIcon;
  description: string;
  totalOutstandingShares: number;
  requiredSkillToUnlock?: string;
}

export interface StockHolding {
  stockId: string;
  shares: number;
  averagePurchasePrice: number;
}

export interface SkillNodeEffects {
  globalIncomeBoostPercent?: number;
  globalCostReductionPercent?: number;
  businessSpecificIncomeBoost?: { businessId: string; percent: number };
  increaseStartingMoney?: number;
  globalDividendYieldBoostPercent?: number;
  globalBusinessUpgradeCostReductionPercent?: number;
  increaseMaxBusinessLevelBy?: number;
  unlocksBulkBuyForBusiness?: string;
  autoBuyUpgradesForBusiness?: string;
  globalPrestigePointBoostPercent?: number;
}

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: LucideIcon;
  dependencies?: string[];
  effects: SkillNodeEffects;
}

export interface HQUpgradeEffects {
  globalIncomeBoostPercent?: number;
  globalCostReductionPercent?: number;
  increaseStartingMoney?: number;
  globalDividendYieldBoostPercent?: number;
  globalPrestigePointBoostPercent?: number;
  retentionPercentage?: number; // Generic retention for both business levels and stock shares
  unlocksFactoryComponentRecipeIds?: string[]; // New: For unlocking recipes
}

export interface HQUpgradeLevel {
  level: number; // 1-indexed
  costMoney: number;
  costPrestigePoints?: number;
  description: string; // Description for this specific level's benefit
  effects: HQUpgradeEffects;
}

export interface HQUpgrade {
  id: string;
  name: string;
  description: string; // General description of the upgrade
  icon: LucideIcon;
  requiredTimesPrestiged?: number; // Overall requirement to start upgrading this
  levels: HQUpgradeLevel[];
}

export interface FactoryPowerBuildingConfig {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  baseCost: number;
  costMultiplier: number;
  powerOutputKw: number;
  maxInstances?: number;
  requiredResearchId?: string;
}

export interface FactoryPowerBuilding {
  instanceId: string; // Unique ID for this specific building instance
  configId: string;   // ID of the FactoryPowerBuildingConfig
  level: number;      // For future upgrades of individual buildings
}

export interface FactoryComponentEffects {
  globalIncomeBoostPerComponentPercent?: number;
  businessSpecificIncomeBoostPercent?: { businessId: string; percent: number };
  stockSpecificDividendYieldBoostPercent?: { stockId: string; percent: number };
  factoryGlobalPowerOutputBoostPercent?: number;
  factoryGlobalMaterialCollectionBoostPercent?: number;
  businessSpecificLevelUpCostReductionPercent?: { businessId: string; percent: number };
  businessSpecificUpgradeCostReductionPercent?: { businessId: string; percent: number };
  businessTypeIncomeBoostPercent?: { businessType: string; percent: number };
  businessTypeLevelUpCostReductionPercent?: { businessType: string; percent: number };
  businessTypeUpgradeCostReductionPercent?: { businessType: string; percent: number };
  globalBusinessUpgradeCostReductionPercent?: number;
  globalCostReductionPercent?: number;
  globalDividendYieldBoostPercent?: number;
  factoryWorkerEnergyDrainModifier?: number;
  factoryManualRPGenerationBoost?: number;
  factoryGlobalPowerConsumptionModifier?: number;
  factoryWorkerEnergyRegenModifier?: number;
  factoryGlobalProductionSpeedModifier?: number;
  maxBonusPercent?: number;
}

export interface FactoryComponent {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  tier: number;
  recipe: { componentId: string, quantity: number }[];
  rawMaterialCost: number;
  productionTimeSeconds: number;
  requiredAssemblerMark: number;
  effects?: FactoryComponentEffects;
  // requiredHQUpgradeToUnlockRecipe?: string; // Optional: Link component to its HQ unlock
}

export interface FactoryMachineUpgradeEffect {
  productionSpeedMultiplier?: number;
  powerConsumptionModifier?: number;
}

export interface FactoryMachineUpgradeConfig {
  id: string;
  name: string;
  description: string;
  costMoney: number;
  costRP?: number;
  requiredResearchId?: string;
  effects: FactoryMachineUpgradeEffect;
}

export interface FactoryMachineConfig {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  baseCost: number;
  powerConsumptionKw: number;
  maxCraftableTier: number;
  requiredResearchId?: string;
  familyId?: string;
  mark?: number;
  upgrades?: FactoryMachineUpgradeConfig[];
}

export interface FactoryMachine {
  instanceId: string;
  configId: string;
  assignedProductionLineId: string | null;
  purchasedUpgradeIds?: string[];
}

export interface FactoryProductionLineSlot {
  machineInstanceId: string | null;
  targetComponentId: string | null;
}

export interface FactoryProductionLine {
  id: string;
  name: string;
  slots: FactoryProductionLineSlot[];
  isUnlocked: boolean;
  unlockCost?: number; // For line 1
  requiredResearchId?: string; // For lines 2-5
}

export interface FactoryMaterialCollectorConfig {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  baseCost: number;
  costMultiplier: number;
  powerConsumptionKw: number;
  materialsPerSecond: number;
  maxInstances?: number;
  requiredResearchId?: string;
}

export interface FactoryMaterialCollector {
  instanceId: string;
  configId: string;
  currentMaterialsPerSecond: number;
}

export type WorkerStatus = 'idle' | 'working' | 'resting';

export interface Worker {
  id: string;
  name: string;
  assignedMachineInstanceId: string | null;
  energy: number;
  status: WorkerStatus;
}

export interface ResearchItemEffects {
  unlocksFactoryMachineConfigIds?: string[];
  unlocksFactoryComponentConfigIds?: string[];
  unlocksProductionLineId?: string;
  unlocksFactoryMaterialCollectorConfigIds?: string[];
  factoryMaterialCollectorBoost?: {
    collectorConfigId: string;
    materialsPerSecondBoostPercent: number;
  };
  unlocksFactoryPowerBuildingConfigIds?: string[];
  factoryPowerBuildingBoost?: {
    buildingConfigId: string;
    powerOutputBoostPercent: number;
  };
  upgradesWorkerEnergyTier?: boolean;
  increaseManualResearchBonus?: number;
  increaseFactoryRawMaterialsCap?: number;
}

export interface ResearchItemConfig {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  costRP: number;
  costMoney?: number;
  dependencies?: string[];
  effects: ResearchItemEffects;
}

export interface FactoryProductionProgressData {
  remainingSeconds: number;
  totalSeconds: number;
}

export interface PlayerStats {
  money: number;
  totalIncomePerSecond: number;
  investmentsValue: number;
  stockHoldings: StockHolding[];
  prestigePoints: number;
  timesPrestiged: number;
  unlockedSkillIds: string[];
  hqUpgradeLevels: Record<string, number>;
  achievedBusinessMilestones?: Record<string, {
    maxLevelReached?: boolean;
    purchasedUpgradeIds?: string[];
  }>;

  factoryPurchased: boolean;
  factoryPowerUnitsGenerated: number;
  factoryPowerConsumptionKw: number;
  factoryRawMaterials: number;
  factoryRawMaterialsCap: number;
  factoryMachines: FactoryMachine[];
  factoryProductionLines: FactoryProductionLine[];
  factoryPowerBuildings: FactoryPowerBuilding[];
  factoryProducedComponents: Record<string, number>;
  factoryMaterialCollectors: FactoryMaterialCollector[];
  factoryProductionProgress?: Record<string, FactoryProductionProgressData>;
  factoryWorkers: Worker[];
  currentWorkerEnergyTier: number; // Index for WORKER_ENERGY_TIERS
  manualResearchBonus?: number;
  unlockedFactoryComponentRecipeIds?: string[]; // New: Track unlocked recipes

  researchPoints: number;
  unlockedResearchIds: string[];
  lastManualResearchTimestamp: number;
}

export interface SaveData {
  playerStats: PlayerStats;
  businesses: Business[];
  lastSaved: number; // Timestamp
}

export type RiskTolerance = "low" | "medium" | "high";
    

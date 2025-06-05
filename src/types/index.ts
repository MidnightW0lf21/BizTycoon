
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
}

export interface FactoryPowerBuilding {
  instanceId: string; // Unique ID for this specific building instance
  configId: string;   // ID of the FactoryPowerBuildingConfig
  level: number;      // For future upgrades of individual buildings
  currentOutputKw: number; // Current output, might change with level or efficiency
}

export interface FactoryComponentEffects {
  globalIncomeBoostPerComponentPercent?: number;
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
}

export interface FactoryMachineConfig {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  baseCost: number;
  powerConsumptionKw: number;
  maxCraftableTier: number;
  requiredResearchId?: string; // New: ID of the research item that unlocks this machine
}

export interface FactoryMachine {
  instanceId: string;
  configId: string;
  assignedProductionLineId: string | null;
}

export interface FactoryProductionLineSlot {
  machineInstanceId: string | null;
  targetComponentId: string | null; // ID of the FactoryComponent to produce
}

export interface FactoryProductionLine {
  id: string;
  name: string;
  slots: FactoryProductionLineSlot[];
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
}

export interface FactoryMaterialCollector {
  instanceId: string;
  configId: string;
  currentMaterialsPerSecond: number;
}

export interface ResearchItemConfig {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  costRP: number;
  costMoney?: number;
  requiredPrestigeLevelForHQ?: number; 
  dependencies?: string[];
  effects: {
    unlocksFactoryMachineConfigIds?: string[];
    unlocksFactoryComponentConfigIds?: string[];
  };
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

  // Factory Specific Stats
  factoryPurchased: boolean;
  factoryPowerUnitsGenerated: number;
  factoryPowerConsumptionKw: number; 
  factoryRawMaterials: number;
  factoryMachines: FactoryMachine[];
  factoryProductionLines: FactoryProductionLine[];
  factoryPowerBuildings: FactoryPowerBuilding[];
  factoryProducedComponents: Record<string, number>;
  factoryMaterialCollectors: FactoryMaterialCollector[];

  // Research Specific Stats
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


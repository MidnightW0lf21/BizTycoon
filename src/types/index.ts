
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

export interface FactoryMachineConfig {
  id: string; // e.g., "basic_assembler_mk1"
  name: string;
  icon: LucideIcon;
  description: string;
  baseCost: number; // This might be for unlocking the *type*, instance costs could vary
  powerConsumptionKw: number;
}

export interface FactoryMachine {
  instanceId: string; // Unique ID for this machine instance, e.g., generated on purchase
  configId: string;   // ID of the FactoryMachineConfig (e.g., "basic_assembler_mk1")
  assignedProductionLineId: string | null;
  // workerAssigned: boolean; // Future state
  // currentProductionComponentId: string | null; // Future state
  // productionProgress: number; // 0 to 1, future state
  // productionTimeTotal: number; // seconds, future state
  // upgrades: { // Future state
  //   speedLevel: number;
  //   batchSizeLevel: number;
  // };
}

export interface FactoryProductionLine {
  id: string; // Unique ID for this line, e.g., "line_1"
  name: string; // e.g., "Production Line 1"
  machineInstanceIds: (string | null)[]; // Array of 6: machine instance IDs or null for empty slot
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

  // Factory Specific Stats - These DO NOT reset on prestige
  factoryPurchased: boolean;
  factoryPowerUnitsGenerated: number;
  factoryRawMaterials: number;
  factoryMachines: FactoryMachine[];
  factoryProductionLines: FactoryProductionLine[];
  factoryPowerBuildings: FactoryPowerBuilding[];
  factoryProducedComponents: Record<string, number>;
}

export interface SaveData {
  playerStats: PlayerStats;
  businesses: Business[];
  lastSaved: number; // Timestamp
}

export type RiskTolerance = "low" | "medium" | "high";


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
  // Removed: unlocksBulkBuy?: true; // This is now a skill effect for specific business
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
  unlocksBulkBuyForBusiness?: string; // Specific business ID
  autoBuyUpgradesForBusiness?: string; // Specific business ID
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
  // Add other global effects as needed
}

export interface HQUpgrade {
  id: string;
  name: string;
  description: string;
  costMoney: number;
  costPrestigePoints?: number;
  requiredTimesPrestiged?: number;
  icon: LucideIcon;
  effects: HQUpgradeEffects;
  // isPurchased will be tracked via playerStats.purchasedHQUpgradeIds
}


export interface PlayerStats {
  money: number;
  totalIncomePerSecond: number;
  investmentsValue: number;
  stockHoldings: StockHolding[];
  prestigePoints: number;
  timesPrestiged: number;
  unlockedSkillIds: string[];
  purchasedHQUpgradeIds: string[]; // New field
}

export interface SaveData {
  playerStats: PlayerStats;
  businesses: Business[];
  lastSaved: number; // Timestamp
}

export type RiskTolerance = "low" | "medium" | "high";



import type { LucideIcon } from "lucide-react";

export interface BusinessUpgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  requiredLevel: number;
  isPurchased: boolean;
  incomeBoostPercent?: number; // e.g., 10 for a 10% boost
  levelUpgradeCostReductionPercent?: number; // e.g., 5 for 5% reduction
  unlocksBulkBuy?: true; // If true, this upgrade unlocks bulk buy for its parent business
}

export interface Business {
  id: string;
  name: string;
  level: number;
  baseIncome: number; // Income per level per second
  baseCost: number; // Cost for level 1
  upgradeCostMultiplier: number; // Multiplier for cost increase per level
  icon: LucideIcon;
  managerOwned: boolean; // Future feature: auto-collects income
  description: string;
  upgrades?: BusinessUpgrade[];
  requiredTimesPrestiged?: number; // Number of prestiges required to unlock this business
}

export interface Stock {
  id: string;
  ticker: string;
  companyName: string;
  price: number; // Current price per share
  dividendYield: number; // Per-second dividend yield as a fraction of current price (e.g., 0.00001 for 0.001% per second)
  icon: LucideIcon;
  description: string;
  totalOutstandingShares: number; // Total shares available for this company
  requiredSkillToUnlock?: string; // Skill ID required to make this stock available
}

export interface StockHolding {
  stockId: string;
  shares: number;
  averagePurchasePrice: number;
}

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  cost: number; // Prestige points
  icon: LucideIcon;
  dependencies?: string[]; // IDs of other skill nodes that must be unlocked first
  effects: {
    globalIncomeBoostPercent?: number;
    globalCostReductionPercent?: number; // For business level-up costs
    businessSpecificIncomeBoost?: { businessId: string; percent: number };
    increaseStartingMoney?: number; // Flat amount added to initial money after prestige
    globalDividendYieldBoostPercent?: number; // Percentage boost to all stock dividend yields
    globalBusinessUpgradeCostReductionPercent?: number; // Percentage reduction to cost of business-specific upgrades
    increaseMaxBusinessLevelBy?: number; // Increase max level for all businesses
    // unlockBulkBuy?: boolean; // This is now a per-business upgrade, not a skill effect
    // Add more specific effect types as needed
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
}


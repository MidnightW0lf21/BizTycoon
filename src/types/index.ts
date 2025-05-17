
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
  // Add other potential effects here, e.g., unlocksManager: true
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
}

export interface PlayerStats {
  money: number;
  totalIncomePerSecond: number;
  investmentsValue: number;
}

export interface StockHolding {
  ticker: string;
  companyName: string;
  shares: number;
  purchasePrice: number;
  currentPrice: number;
}

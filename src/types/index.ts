
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

export interface Stock {
  id: string;
  ticker: string;
  companyName: string;
  price: number; // Current price per share
  dividendYield: number; // Per-second dividend yield as a fraction of current price (e.g., 0.00001 for 0.001% per second)
  icon: LucideIcon;
  description: string;
  totalOutstandingShares: number; // Total shares available for this company
}

export interface StockHolding {
  stockId: string;
  shares: number;
  averagePurchasePrice: number;
}

export interface PlayerStats {
  money: number;
  totalIncomePerSecond: number;
  investmentsValue: number;
  stockHoldings: StockHolding[];
}

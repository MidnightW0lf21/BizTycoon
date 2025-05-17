import type { LucideIcon } from "lucide-react";

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
}

export interface PlayerStats {
  money: number;
  totalIncomePerSecond: number;
  investmentsValue: number; // Future feature: value of stocks
}

export interface StockHolding {
  ticker: string;
  companyName: string;
  shares: number;
  purchasePrice: number;
  currentPrice: number;
}

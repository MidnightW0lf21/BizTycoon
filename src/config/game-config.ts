
import type { Business, BusinessUpgrade } from '@/types';
import { Citrus, Coffee, Cpu, Landmark, Rocket, Factory } from 'lucide-react';

export const INITIAL_MONEY = 100;

export const INITIAL_BUSINESSES: Business[] = [
  {
    id: 'lemonade_stand',
    name: 'Lemonade Stand',
    level: 0,
    baseIncome: 1,
    baseCost: 10,
    upgradeCostMultiplier: 1.07,
    icon: Citrus,
    managerOwned: false,
    description: 'A humble start, selling refreshing lemonade.',
    upgrades: [
      { id: 'ls_bigger_pitcher', name: 'Bigger Pitcher', description: 'Serve more lemonade, +10% income.', cost: 50, requiredLevel: 5, isPurchased: false, incomeBoostPercent: 10 },
      { id: 'ls_catchy_sign', name: 'Catchy Sign', description: 'Attract more customers, +15% income.', cost: 150, requiredLevel: 10, isPurchased: false, incomeBoostPercent: 15 },
      { id: 'ls_bulk_lemons', name: 'Bulk Lemons', description: 'Cheaper supplies, -5% level upgrade cost.', cost: 200, requiredLevel: 15, isPurchased: false, levelUpgradeCostReductionPercent: 5 },
    ],
  },
  {
    id: 'coffee_shop',
    name: 'Coffee Shop',
    level: 0,
    baseIncome: 5,
    baseCost: 100,
    upgradeCostMultiplier: 1.15,
    icon: Coffee,
    managerOwned: false,
    description: 'Caffeinate the masses and your profits.',
    upgrades: [
      { id: 'cs_espresso_machine', name: 'Espresso Machine', description: 'Faster service, +20% income.', cost: 500, requiredLevel: 5, isPurchased: false, incomeBoostPercent: 20 },
      { id: 'cs_loyal_customer_program', name: 'Loyalty Program', description: 'Repeat customers, +10% income.', cost: 1000, requiredLevel: 10, isPurchased: false, incomeBoostPercent: 10 },
      { id: 'cs_efficient_barista', name: 'Efficient Barista Training', description: 'Streamlined operations, -10% level upgrade cost.', cost: 1200, requiredLevel: 15, isPurchased: false, levelUpgradeCostReductionPercent: 10 },
    ],
  },
  {
    id: 'tech_startup',
    name: 'Tech Startup',
    level: 0,
    baseIncome: 50,
    baseCost: 1500,
    upgradeCostMultiplier: 1.20,
    icon: Cpu,
    managerOwned: false,
    description: 'Innovate and disrupt with cutting-edge technology.',
    upgrades: [
        { id: 'ts_server_upgrade', name: 'Server Upgrade', description: 'Handle more users, +25% income.', cost: 7500, requiredLevel: 5, isPurchased: false, incomeBoostPercent: 25 },
        { id: 'ts_marketing_campaign', name: 'Marketing Campaign', description: 'Increase visibility, +15% income.', cost: 15000, requiredLevel: 10, isPurchased: false, incomeBoostPercent: 15 },
    ],
  },
  {
    id: 'real_estate',
    name: 'Real Estate Agency',
    level: 0,
    baseIncome: 250,
    baseCost: 10000,
    upgradeCostMultiplier: 1.18,
    icon: Landmark,
    managerOwned: false,
    description: 'Buy, sell, and lease properties for big returns.',
    // No upgrades defined yet for this one
  },
  {
    id: 'manufacturing_plant',
    name: 'Manufacturing Plant',
    level: 0,
    baseIncome: 1000,
    baseCost: 75000,
    upgradeCostMultiplier: 1.16,
    icon: Factory,
    managerOwned: false,
    description: 'Mass produce goods and dominate the market.',
  },
  {
    id: 'space_exploration_inc',
    name: 'Space Exploration Inc.',
    level: 0,
    baseIncome: 5000,
    baseCost: 500000,
    upgradeCostMultiplier: 1.22,
    icon: Rocket,
    managerOwned: false,
    description: 'Reach for the stars and astronomical profits.',
  },
];

export const calculateIncome = (business: Business): number => {
  if (business.level === 0) return 0;

  let currentIncome = business.level * business.baseIncome;
  
  // Apply level multiplier for specific businesses like Tech Startup
  if (business.name === 'Tech Startup') {
    currentIncome *= Math.pow(1.05, business.level);
  }
  
  // Apply income boosts from purchased upgrades
  if (business.upgrades) {
    business.upgrades.forEach(upgrade => {
      if (upgrade.isPurchased && upgrade.incomeBoostPercent) {
        currentIncome *= (1 + upgrade.incomeBoostPercent / 100);
      }
    });
  }
  
  return currentIncome;
};

export const calculateUpgradeCost = (business: Business): number => {
  let currentCost = business.baseCost * Math.pow(business.upgradeCostMultiplier, business.level);
  
  // Apply cost reductions from purchased upgrades
  if (business.upgrades) {
    business.upgrades.forEach(upgrade => {
      if (upgrade.isPurchased && upgrade.levelUpgradeCostReductionPercent) {
        currentCost *= (1 - upgrade.levelUpgradeCostReductionPercent / 100);
      }
    });
  }
  
  return Math.floor(currentCost);
};

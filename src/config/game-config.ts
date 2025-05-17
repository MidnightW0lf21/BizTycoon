import type { Business } from '@/types';
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
  // Example: income grows slightly more than linearly with level for some businesses
  const levelMultiplier = business.name === 'Tech Startup' ? Math.pow(1.05, business.level) : 1;
  return business.level * business.baseIncome * levelMultiplier;
};

export const calculateUpgradeCost = (business: Business): number => {
  return Math.floor(business.baseCost * Math.pow(business.upgradeCostMultiplier, business.level));
};

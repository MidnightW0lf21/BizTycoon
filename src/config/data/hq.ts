
import type { HQUpgrade, HQUpgradeLevel } from '@/types';
import { INITIAL_BUSINESSES } from './businesses';
import { INITIAL_STOCKS } from './stocks';
import { INITIAL_FACTORY_COMPONENTS_CONFIG } from './factory';
import { Activity, Scaling, Target, Award, PiggyBank, Gem, Archive, ShieldEllipsis, Scroll, BookOpen, FlaskConical, Cpu, AtomIcon } from 'lucide-react';

const globalHQUgrades: HQUpgrade[] = [
  {
    id: 'hq_market_analysis_1',
    name: 'Market Analysis Department',
    description: 'Conducts market research to boost overall income.',
    icon: Activity,
    requiredTimesPrestiged: 0,
    levels: [
      { level: 1, costMoney: 50000, costPrestigePoints: 0, description: '+0.5% to all business income.', effects: { globalIncomeBoostPercent: 0.5 } },
      { level: 2, costMoney: 250000, costPrestigePoints: 0, description: '+1.0% to all business income (total).', effects: { globalIncomeBoostPercent: 1.0 } },
      { level: 3, costMoney: 1000000, costPrestigePoints: 1, description: '+1.5% to all business income (total).', effects: { globalIncomeBoostPercent: 1.5 } },
      { level: 4, costMoney: 5000000, costPrestigePoints: 2, description: '+2.5% to all business income (total).', effects: { globalIncomeBoostPercent: 2.5 } },
      { level: 5, costMoney: 20000000, costPrestigePoints: 5, description: '+4.0% to all business income (total).', effects: { globalIncomeBoostPercent: 4.0 } },
    ],
  },
  {
    id: 'hq_operational_efficiency_1',
    name: 'Efficiency Training Institute',
    description: 'Improves operational methods, reducing business level-up costs.',
    icon: Scaling,
    requiredTimesPrestiged: 1,
    levels: [
      { level: 1, costMoney: 75000, costPrestigePoints: 0, description: '-0.5% to all business level-up costs.', effects: { globalCostReductionPercent: 0.5 } },
      { level: 2, costMoney: 350000, costPrestigePoints: 0, description: '-1.0% to all business level-up costs (total).', effects: { globalCostReductionPercent: 1.0 } },
      { level: 3, costMoney: 1500000, costPrestigePoints: 1, description: '-1.75% to all business level-up costs (total).', effects: { globalCostReductionPercent: 1.75 } },
      { level: 4, costMoney: 6000000, costPrestigePoints: 3, description: '-2.75% to all business level-up costs (total).', effects: { globalCostReductionPercent: 2.75 } },
      { level: 5, costMoney: 25000000, costPrestigePoints: 6, description: '-4.0% to all business level-up costs (total).', effects: { globalCostReductionPercent: 4.0 } },
    ]
  },
  {
    id: 'hq_investment_division_1',
    name: 'Investment Advisory Division',
    description: 'Enhances stock market returns through expert analysis.',
    icon: Target,
    requiredTimesPrestiged: 2,
    levels: [
      { level: 1, costMoney: 100000, costPrestigePoints: 0, description: '+0.1% to all stock dividend yields.', effects: { globalDividendYieldBoostPercent: 0.1 } },
      { level: 2, costMoney: 500000, costPrestigePoints: 0, description: '+0.25% to all stock dividend yields (total).', effects: { globalDividendYieldBoostPercent: 0.25 } },
      { level: 3, costMoney: 2000000, costPrestigePoints: 2, description: '+0.5% to all stock dividend yields (total).', effects: { globalDividendYieldBoostPercent: 0.5 } },
      { level: 4, costMoney: 8000000, costPrestigePoints: 4, description: '+1.0% to all stock dividend yields (total).', effects: { globalDividendYieldBoostPercent: 1.0 } },
      { level: 5, costMoney: 30000000, costPrestigePoints: 8, description: '+1.75% to all stock dividend yields (total).', effects: { globalDividendYieldBoostPercent: 1.75 } },
    ]
  },
  {
    id: 'hq_prestige_planning_1',
    name: 'Prestige Planning Dept.',
    description: 'Optimizes prestige transitions for greater point gains.',
    icon: Award,
    requiredTimesPrestiged: 3,
    levels: [
      { level: 1, costMoney: 250000, costPrestigePoints: 5, description: '+1% to Prestige Points gained (stacks with skill tree).', effects: { globalPrestigePointBoostPercent: 1 } },
      { level: 2, costMoney: 1200000, costPrestigePoints: 10, description: '+2% to Prestige Points gained (total, stacks with skill tree).', effects: { globalPrestigePointBoostPercent: 2 } },
      { level: 3, costMoney: 5000000, costPrestigePoints: 20, description: '+3.5% to Prestige Points gained (total, stacks with skill tree).', effects: { globalPrestigePointBoostPercent: 3.5 } },
      { level: 4, costMoney: 20000000, costPrestigePoints: 35, description: '+5% to Prestige Points gained (total, stacks with skill tree).', effects: { globalPrestigePointBoostPercent: 5 } },
      { level: 5, costMoney: 75000000, costPrestigePoints: 50, description: '+7.5% to Prestige Points gained (total, stacks with skill tree).', effects: { globalPrestigePointBoostPercent: 7.5 } },
    ]
  },
  {
    id: 'hq_global_expansion_1',
    name: 'Global Expansion Office',
    description: 'Increases starting money after each prestige.',
    icon: PiggyBank,
    requiredTimesPrestiged: 4,
    levels: [
        { level: 1, costMoney: 1000000, costPrestigePoints: 3, description: '+ $10,000 starting cash.', effects: { increaseStartingMoney: 10000 } },
        { level: 2, costMoney: 5000000, costPrestigePoints: 6, description: '+ $25,000 starting cash (total).', effects: { increaseStartingMoney: 25000 } },
        { level: 3, costMoney: 20000000, costPrestigePoints: 10, description: '+ $50,000 starting cash (total).', effects: { increaseStartingMoney: 50000 } },
    ]
  },
  {
    id: 'hq_quantum_entanglement_market_predictor',
    name: 'Quantum Market Predictor',
    description: 'Hypothetical tech giving a massive edge in stock dividends.',
    icon: Gem,
    requiredTimesPrestiged: 10,
    levels: [
      { level: 1, costMoney: 5E10, costPrestigePoints: 1000, description: '+5% to all stock dividend yields. Truly game-changing.', effects: { globalDividendYieldBoostPercent: 5 } },
      { level: 2, costMoney: 2.5E11, costPrestigePoints: 2500, description: '+10% to all stock dividend yields (total). Unrivaled insight.', effects: { globalDividendYieldBoostPercent: 10 } },
    ]
  },
  // Factory Recipe Unlocks
  {
    id: 'hq_unlock_tier1_recipes',
    name: 'Tier 1 Recipe Blueprints',
    description: 'Unlocks all Tier 1 factory component recipes.',
    icon: Scroll,
    requiredTimesPrestiged: 5, // Assuming factory unlocks at prestige 5
    levels: [
      { level: 1, costMoney: 100000, costPrestigePoints: 2, description: 'Gain access to basic component schematics.', effects: { unlocksFactoryComponentRecipeIds: INITIAL_FACTORY_COMPONENTS_CONFIG.filter(c => c.tier === 1).map(c => c.id) } }
    ]
  },
  {
    id: 'hq_unlock_tier2_recipes',
    name: 'Tier 2 Advanced Schematics',
    description: 'Unlocks all Tier 2 factory component recipes.',
    icon: BookOpen,
    requiredTimesPrestiged: 5,
    levels: [
      { level: 1, costMoney: 500000, costPrestigePoints: 5, description: 'Learn to craft more complex components.', effects: { unlocksFactoryComponentRecipeIds: INITIAL_FACTORY_COMPONENTS_CONFIG.filter(c => c.tier === 2).map(c => c.id) } }
    ]
  },
  {
    id: 'hq_unlock_tier3_recipes',
    name: 'Tier 3 Production Mastery',
    description: 'Unlocks all Tier 3 factory component recipes.',
    icon: FlaskConical,
    requiredTimesPrestiged: 6,
    levels: [
      { level: 1, costMoney: 2000000, costPrestigePoints: 10, description: 'Master the production of intricate parts.', effects: { unlocksFactoryComponentRecipeIds: INITIAL_FACTORY_COMPONENTS_CONFIG.filter(c => c.tier === 3).map(c => c.id) } }
    ]
  },
  {
    id: 'hq_unlock_tier4_recipes',
    name: 'Tier 4 Complex Assemblies',
    description: 'Unlocks all Tier 4 factory component recipes.',
    icon: Cpu,
    requiredTimesPrestiged: 7,
    levels: [
      { level: 1, costMoney: 8000000, costPrestigePoints: 20, description: 'Manufacture highly advanced technological components.', effects: { unlocksFactoryComponentRecipeIds: INITIAL_FACTORY_COMPONENTS_CONFIG.filter(c => c.tier === 4).map(c => c.id) } }
    ]
  },
  {
    id: 'hq_unlock_tier5_recipes',
    name: 'Tier 5 Quantum Fabrication',
    description: 'Unlocks all Tier 5 factory component recipes, the pinnacle of manufacturing.',
    icon: AtomIcon,
    requiredTimesPrestiged: 8,
    levels: [
      { level: 1, costMoney: 25000000, costPrestigePoints: 40, description: 'Harness quantum principles for ultimate components.', effects: { unlocksFactoryComponentRecipeIds: INITIAL_FACTORY_COMPONENTS_CONFIG.filter(c => c.tier === 5).map(c => c.id) } }
    ]
  },
];

const businessRetentionUpgrades: HQUpgrade[] = INITIAL_BUSINESSES.map((business, index) => {
  const levels: HQUpgradeLevel[] = [20, 40, 60, 80, 100].map((percent, levelIndex) => ({
    level: levelIndex + 1,
    costMoney: Math.floor(Math.pow(10, 3 + index * 0.18 + levelIndex * 0.5) * (2 + levelIndex * 2.5)),
    costPrestigePoints: Math.max(1, Math.floor(Math.pow(2.2, 1 + index * 0.1 + levelIndex * 0.6) * (2 + levelIndex * 1.5))),
    description: `Retain ${percent}% of ${business.name} levels.`,
    effects: { retentionPercentage: percent },
  }));
  return {
    id: `retain_level_${business.id}`,
    name: `${business.name} Level Retention`,
    description: `Secure a percentage of ${business.name}'s levels through prestige.`,
    icon: Archive,
    requiredTimesPrestiged: 5 + Math.floor(index / 5),
    levels,
  };
});

const stockRetentionUpgrades: HQUpgrade[] = INITIAL_STOCKS.map((stock, index) => {
  const levels: HQUpgradeLevel[] = [20, 40, 60, 80, 100].map((percent, levelIndex) => ({
    level: levelIndex + 1,
    costMoney: Math.floor(Math.pow(10, 3.5 + index * 0.16 + levelIndex * 0.55) * (2.5 + levelIndex * 2.8)),
    costPrestigePoints: Math.max(1, Math.floor(Math.pow(2.3, 1.05 + index * 0.11 + levelIndex * 0.65) * (2.5 + levelIndex * 1.8))),
    description: `Retain ${percent}% of ${stock.companyName} shares.`,
    effects: { retentionPercentage: percent },
  }));
  return {
    id: `retain_shares_${stock.id}`,
    name: `${stock.companyName} Share Insurance`,
    description: `Retain a percentage of ${stock.companyName}'s shares through prestige.`,
    icon: ShieldEllipsis,
    requiredTimesPrestiged: 6 + Math.floor(index / 3),
    levels,
  };
});

export const INITIAL_HQ_UPGRADES: HQUpgrade[] = [
  ...globalHQUgrades,
  ...businessRetentionUpgrades,
  ...stockRetentionUpgrades
];
    

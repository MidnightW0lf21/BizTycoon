
import type { Business, SkillNode } from '@/types';
import { INITIAL_BUSINESSES } from './businesses';
import {
  TrendingUpIcon, ArrowDownCircle, PiggyBank, Sparkles, ChevronsUp, Settings2, ShoppingCart, Award, Star, Crown,
  Briefcase, Unlock, ShieldCheck, Percent, Telescope, Rocket, Zap, BrainCircuit, GitMerge, Tv, Factory as FactoryIconLucide,
  LineChart, Languages, MessagesSquare, MountainSnow, Sprout, UserCheck, Beaker, Plane, PenTool, Scroll, Bone, InfinityIcon, Power, Share2, Aperture, Clock, Orbit, Layers, SquareCode, Compass, Truck, Replace, Building2, Handshake, Database, HelpCircle, MessageCircleQuestion, Bot, Cloud, Palette, Users2, Unplug, Recycle, Trees, Drama, HandCoins, LandPlot, Microscope, Combine, Group, Castle, Coins, Brain, Swords, Diamond, TelescopeIcon as TelescopeIconLucide, Biohazard, Gavel, Library, Map, Pyramid, Hourglass, University, KeyRound, TowerControl, Puzzle, Binary, Route, AtomIcon, SproutIcon, SunIcon, SatelliteIcon, BrainIcon, ShieldAlert, CloudCog, Milestone, Bitcoin, BotIcon, CloudDrizzle, Eye, Hammer, Wrench, Settings, PackageCheck, Package, Building, Landmark, Citrus, Coffee, Cpu, Film, FlaskConical, Wind, Ship, Dna, Lightbulb, Users, BarChart, GitMerge as GitMergeIcon, TrendingUp as TrendingUpLucideIcon, Radio, Cog, Sigma, Anchor, Waves, Construction
} from 'lucide-react';

const createBusinessBoostSkills = (business: Business, index: number): SkillNode[] => {
  const skills: SkillNode[] = [];
  const baseCost = 2 + Math.floor(index * 0.1);
  const baseBoost = 10 + Math.floor(index * 0.1);

  skills.push({
    id: `${business.id}_boost_1`,
    name: `${business.name} Focus I`,
    description: `${business.name} income +${baseBoost}%.`,
    cost: baseCost,
    icon: business.icon,
    dependencies: index > 2 ? ['global_income_boost_1'] : [],
    effects: { businessSpecificIncomeBoost: { businessId: business.id, percent: baseBoost } },
  });

  skills.push({
    id: `${business.id}_boost_2`,
    name: `${business.name} Specialization I`,
    description: `${business.name} income +${Math.floor(baseBoost * 1.5)}%.`,
    cost: Math.floor(baseCost * 2.1),
    icon: business.icon,
    dependencies: [`${business.id}_boost_1`],
    effects: { businessSpecificIncomeBoost: { businessId: business.id, percent: Math.floor(baseBoost * 1.5) } },
  });

  if (index >= 3) {
    skills.push({
      id: `${business.id}_mastery_1`,
      name: `${business.name} Mastery`,
      description: `${business.name} income +${Math.floor(baseBoost * 2)}% and level up cost -3%.`,
      cost: Math.floor(baseCost * 4.2),
      icon: Award,
      dependencies: [`${business.id}_boost_2`],
      effects: {
        businessSpecificIncomeBoost: { businessId: business.id, percent: Math.floor(baseBoost * 2) },
      },
    });
  }
  return skills;
};

const createAutoBuyUpgradeSkills = (business: Business, index: number): SkillNode => {
  return {
    id: `auto_buy_upgrades_${business.id}`,
    name: `${business.name} Automation`,
    description: `Automatically purchases affordable upgrades for ${business.name}.`,
    cost: Math.max(2, Math.floor(index * 0.15) + 1),
    icon: Zap,
    dependencies: [`${business.id}_boost_1`],
    effects: { autoBuyUpgradesForBusiness: business.id },
  };
};

const baseSkillTree: SkillNode[] = [
  {
    id: 'global_income_boost_1',
    name: 'Entrepreneurial Spirit I',
    description: 'All businesses generate +5% income.',
    cost: 1,
    icon: TrendingUpIcon,
    effects: { globalIncomeBoostPercent: 5 },
  },
  {
    id: 'global_cost_reduction_1',
    name: 'Efficient Operations I',
    description: 'All business level-up costs reduced by 3%.',
    cost: 3,
    icon: ArrowDownCircle,
    effects: { globalCostReductionPercent: 3 },
  },
  {
    id: 'starting_cash_boost_1',
    name: 'Head Start I',
    description: 'Start with an extra $5,000 after prestiging.',
    cost: 5,
    icon: PiggyBank,
    effects: { increaseStartingMoney: 5000 },
  },
  {
    id: 'prestige_point_boost_1',
    name: 'Prestige Power I',
    description: 'Gain +10% more base prestige points when prestiging.',
    cost: 15,
    icon: Sparkles,
    effects: { globalPrestigePointBoostPercent: 10 },
  },
  {
    id: 'global_income_boost_2',
    name: 'Entrepreneurial Spirit II',
    description: 'All businesses generate an additional +7% income.',
    cost: 10,
    icon: ChevronsUp,
    dependencies: ['global_income_boost_1'],
    effects: { globalIncomeBoostPercent: 7 },
  },
  {
    id: 'global_cost_reduction_2',
    name: 'Efficient Operations II',
    description: 'All business level-up costs reduced by an additional 5%.',
    cost: 12,
    icon: Settings2,
    dependencies: ['global_cost_reduction_1'],
    effects: { globalCostReductionPercent: 5 },
  },
  {
    id: 'upgrade_cost_slasher_1',
    name: 'Negotiation Master',
    description: 'All business-specific upgrades (not level-ups) are 5% cheaper.',
    cost: 18,
    icon: ShoppingCart,
    effects: { globalBusinessUpgradeCostReductionPercent: 5 },
  },
  {
    id: 'global_income_boost_3',
    name: 'Entrepreneurial Spirit III',
    description: 'All businesses generate an additional +10% income.',
    cost: 25,
    icon: TrendingUpIcon,
    dependencies: ['global_income_boost_2'],
    effects: { globalIncomeBoostPercent: 10 },
  },
  {
    id: 'prestige_power_2',
    name: 'Prestige Power II',
    description: 'Gain an additional +10% base prestige points (stacks with PP I).',
    cost: 30,
    icon: Star,
    dependencies: ['prestige_point_boost_1'],
    effects: { globalPrestigePointBoostPercent: 10 },
  },
  {
    id: 'tycoons_ambition',
    name: "Tycoon's Ambition",
    description: "All businesses generate an additional +25% income. The mark of a true tycoon.",
    cost: 100,
    icon: Crown,
    dependencies: ['global_income_boost_3', 'prestige_power_2'],
    effects: { globalIncomeBoostPercent: 25 },
  },
  {
    id: 'advanced_management_1',
    name: 'Advanced Management I',
    description: 'Increases the maximum level for all businesses by 10.',
    cost: 35,
    icon: Briefcase,
    dependencies: ['global_income_boost_2'],
    effects: { increaseMaxBusinessLevelBy: 10 },
  },
  {
    id: 'advanced_management_2',
    name: 'Advanced Management II',
    description: 'Further increases the maximum level for all businesses by 15 (stacks).',
    cost: 70,
    icon: Briefcase,
    dependencies: ['advanced_management_1'],
    effects: { increaseMaxBusinessLevelBy: 15 },
  },
  {
    id: 'advanced_management_3',
    name: 'Advanced Management III',
    description: 'Max business level +20. True mastery of scale.',
    cost: 120,
    icon: Briefcase,
    dependencies: ['advanced_management_2'],
    effects: { increaseMaxBusinessLevelBy: 20 },
  },
  {
    id: 'advanced_management_4',
    name: 'Advanced Management IV',
    description: 'The pinnacle of expansion. Max business level +25.',
    cost: 180,
    icon: Briefcase,
    dependencies: ['advanced_management_3'],
    effects: { increaseMaxBusinessLevelBy: 25 },
  },
  {
    id: 'advanced_management_5',
    name: 'Advanced Management V',
    description: 'Ultimate operational scale. Max business level +30. (Caps at 200 total).',
    cost: 250,
    icon: Briefcase,
    dependencies: ['advanced_management_4'],
    effects: { increaseMaxBusinessLevelBy: 30 },
  },
  {
    id: 'unlock_advanced_stocks_tier_1',
    name: 'Stock Market License I',
    description: 'Unlock access to more advanced stock options (e.g., Cosmic Ventures).',
    cost: 8,
    icon: Unlock,
    effects: {},
  },
  {
    id: 'unlock_advanced_stocks_tier_2',
    name: 'Stock Market License II',
    description: 'Unlock access to elite stock options (e.g., BioFuture Med, Aether Logistics).',
    cost: 20,
    icon: ShieldCheck,
    dependencies: ['unlock_advanced_stocks_tier_1'],
    effects: {},
  },
  {
    id: 'dividend_magnifier_1',
    name: 'Dividend Connoisseur',
    description: 'Increase all stock dividend yields by +10%.',
    cost: 10,
    icon: Percent,
    effects: { globalDividendYieldBoostPercent: 10 },
  },
  {
    id: 'market_analyst',
    name: 'Market Analyst',
    description: "Unlocks the speculative 'Omega Corp (OMG)' stock.",
    cost: 40,
    icon: Telescope,
    dependencies: ['unlock_advanced_stocks_tier_2'],
    effects: {},
  },
  {
    id: 'investment_mogul',
    name: 'Investment Mogul',
    description: "Unlocks the end-game 'Stellar Dynamics (STLR)' stock and boosts all dividend yields by an additional +5%.",
    cost: 80,
    icon: Rocket,
    dependencies: ['market_analyst', 'dividend_magnifier_1'],
    effects: { globalDividendYieldBoostPercent: 5 },
  },
  {
    id: 'tech_empire_synergy',
    name: 'Tech Empire Synergy',
    description: 'Income of specific Tech businesses +15%.',
    cost: 22,
    icon: BrainCircuit,
    dependencies: ['global_income_boost_1'],
    effects: { /* Logic handled in calculateIncome */ },
  },
  {
    id: 'logistics_network_optimization',
    name: 'Logistics Network Opt.',
    description: 'Income of specific Logistics businesses +15%.',
    cost: 20,
    icon: GitMergeIcon,
    dependencies: ['global_income_boost_1'],
    effects: { /* Logic handled in calculateIncome */ },
  },
  {
    id: 'media_mogul_influence',
    name: 'Media Mogul Influence',
    description: 'Income of specific Media businesses +15%.',
    cost: 24,
    icon: Tv,
    dependencies: ['global_income_boost_1'],
    effects: { /* Logic handled in calculateIncome */ },
  },
  {
    id: 'industrial_powerhouse',
    name: 'Industrial Powerhouse',
    description: 'Income of specific Manufacturing businesses +15%.',
    cost: 26,
    icon: FactoryIconLucide,
    dependencies: ['global_income_boost_1'],
    effects: { /* Logic handled in calculateIncome */ },
  },
  ...INITIAL_BUSINESSES.map((business, index) => ({
    id: `unlock_bulk_buy_${business.id}`,
    name: `${business.name} Logistics`,
    description: `Unlocks bulk purchasing (10x, 25x, MAX) for ${business.name}.`,
    cost: Math.max(1, Math.floor(index || 0) + 2),
    icon: ShoppingCart,
    dependencies: (index || 0) > 0 ? ['global_income_boost_1'] : [],
    effects: { unlocksBulkBuyForBusiness: business.id },
  })),
];

export const INITIAL_SKILL_TREE: SkillNode[] = [
  ...baseSkillTree,
  ...INITIAL_BUSINESSES.flatMap((biz, index) => createBusinessBoostSkills(biz, index)),
  ...INITIAL_BUSINESSES.flatMap((biz, index) => createAutoBuyUpgradeSkills(biz, index)),
];

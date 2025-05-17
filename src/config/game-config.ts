
import type { Business, BusinessUpgrade } from '@/types';
import { Citrus, Coffee, Cpu, Landmark, Rocket, Factory, Utensils, Film, FlaskConical, BrainCircuit } from 'lucide-react';

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
      { id: 'ls_premium_ingredients', name: 'Premium Ingredients', description: 'Use organic lemons & sugar, +20% income.', cost: 300, requiredLevel: 20, isPurchased: false, incomeBoostPercent: 20 },
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
      { id: 'cs_artisanal_beans', name: 'Artisanal Beans', description: 'Source high-quality beans, +25% income.', cost: 2000, requiredLevel: 20, isPurchased: false, incomeBoostPercent: 25 },
    ],
  },
  {
    id: 'fast_food_franchise',
    name: 'Fast Food Franchise',
    level: 0,
    baseIncome: 20,
    baseCost: 750,
    upgradeCostMultiplier: 1.17,
    icon: Utensils,
    managerOwned: false,
    description: 'Serve quick meals to hungry customers.',
    upgrades: [
      { id: 'fff_drive_thru', name: 'Drive-Thru Window', description: 'Serve customers faster, +20% income.', cost: 3000, requiredLevel: 5, isPurchased: false, incomeBoostPercent: 20 },
      { id: 'fff_combo_meals', name: 'Combo Meal Deals', description: 'Increase average order value, +15% income.', cost: 5000, requiredLevel: 10, isPurchased: false, incomeBoostPercent: 15 },
      { id: 'fff_franchise_training', name: 'Franchise Training Program', description: 'Standardize operations, -5% level upgrade cost.', cost: 7000, requiredLevel: 15, isPurchased: false, levelUpgradeCostReductionPercent: 5 },
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
        { id: 'ts_ai_integration', name: 'AI Integration', description: 'Implement AI for better product, +30% income', cost: 25000, requiredLevel: 15, isPurchased: false, incomeBoostPercent: 30 },
        { id: 'ts_agile_dev_team', name: 'Agile Dev Team', description: 'Faster development cycles, -10% level upgrade cost', cost: 30000, requiredLevel: 20, isPurchased: false, levelUpgradeCostReductionPercent: 10 },
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
    upgrades: [
      { id: 're_luxury_listings', name: 'Luxury Listings', description: 'Focus on high-end properties, +30% income.', cost: 20000, requiredLevel: 5, isPurchased: false, incomeBoostPercent: 30 },
      { id: 're_virtual_tours', name: 'Virtual Tours', description: 'Attract more clients with tech, +20% income.', cost: 30000, requiredLevel: 10, isPurchased: false, incomeBoostPercent: 20 },
      { id: 're_negotiation_experts', name: 'Expert Negotiators', description: 'Better deals, -10% level upgrade cost.', cost: 40000, requiredLevel: 15, isPurchased: false, levelUpgradeCostReductionPercent: 10 },
    ],
  },
  {
    id: 'movie_studio',
    name: 'Movie Studio',
    level: 0,
    baseIncome: 800,
    baseCost: 50000,
    upgradeCostMultiplier: 1.19,
    icon: Film,
    managerOwned: false,
    description: 'Produce blockbuster films and entertain the world.',
    upgrades: [
      { id: 'ms_cgi_department', name: 'CGI Department', description: 'Create stunning visual effects, +25% income.', cost: 200000, requiredLevel: 5, isPurchased: false, incomeBoostPercent: 25 },
      { id: 'ms_star_actors_contracts', name: 'Star Actor Contracts', description: 'Attract larger audiences, +30% income.', cost: 350000, requiredLevel: 10, isPurchased: false, incomeBoostPercent: 30 },
      { id: 'ms_distribution_network', name: 'Global Distribution Network', description: 'Wider release, +20% income.', cost: 500000, requiredLevel: 15, isPurchased: false, incomeBoostPercent: 20 },
    ],
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
    upgrades: [
      { id: 'mp_robotics_automation', name: 'Robotics Automation', description: 'Increase production speed, +35% income.', cost: 150000, requiredLevel: 5, isPurchased: false, incomeBoostPercent: 35 },
      { id: 'mp_supply_chain_optimization', name: 'Supply Chain Optimization', description: 'Reduce material costs, -15% level upgrade cost.', cost: 200000, requiredLevel: 10, isPurchased: false, levelUpgradeCostReductionPercent: 15 },
      { id: 'mp_quality_control_systems', name: 'Advanced QC Systems', description: 'Better product quality, +20% income.', cost: 250000, requiredLevel: 15, isPurchased: false, incomeBoostPercent: 20 },
    ],
  },
  {
    id: 'pharmaceutical_company',
    name: 'Pharmaceutical Company',
    level: 0,
    baseIncome: 2000,
    baseCost: 200000,
    upgradeCostMultiplier: 1.21,
    icon: FlaskConical,
    managerOwned: false,
    description: 'Develop life-saving drugs and treatments.',
    upgrades: [
      { id: 'pc_research_lab_expansion', name: 'Research Lab Expansion', description: 'Faster drug discovery, +30% income.', cost: 800000, requiredLevel: 5, isPurchased: false, incomeBoostPercent: 30 },
      { id: 'pc_clinical_trials_fast_track', name: 'Clinical Trials Fast-Track', description: 'Speed up approval process, -10% level upgrade cost.', cost: 1200000, requiredLevel: 10, isPurchased: false, levelUpgradeCostReductionPercent: 10 },
      { id: 'pc_patented_drug_portfolio', name: 'Patented Drug Portfolio', description: 'Secure long-term revenue, +35% income.', cost: 2000000, requiredLevel: 15, isPurchased: false, incomeBoostPercent: 35 },
    ],
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
    upgrades: [
      { id: 'se_reusable_rockets', name: 'Reusable Rockets', description: 'Drastically cut launch costs, -20% level upgrade cost.', cost: 1000000, requiredLevel: 5, isPurchased: false, levelUpgradeCostReductionPercent: 20 },
      { id: 'se_asteroid_mining_prototype', name: 'Asteroid Mining Tech', description: 'Explore new revenue streams, +40% income.', cost: 2500000, requiredLevel: 10, isPurchased: false, incomeBoostPercent: 40 },
      { id: 'se_interstellar_comms', name: 'Interstellar Comms', description: 'Expand operational reach, +25% income.', cost: 5000000, requiredLevel: 15, isPurchased: false, incomeBoostPercent: 25 },
    ],
  },
  {
    id: 'ai_research_lab',
    name: 'AI Research Lab',
    level: 0,
    baseIncome: 10000,
    baseCost: 1000000,
    upgradeCostMultiplier: 1.25,
    icon: BrainCircuit,
    managerOwned: false,
    description: 'Pioneer the future of artificial intelligence.',
    upgrades: [
      { id: 'ai_quantum_computing_access', name: 'Quantum Computing Access', description: 'Unlock new research frontiers, +40% income.', cost: 5000000, requiredLevel: 5, isPurchased: false, incomeBoostPercent: 40 },
      { id: 'ai_ethics_board', name: 'AI Ethics Board', description: 'Ensure responsible AI development.', cost: 2000000, requiredLevel: 7, isPurchased: false },
      { id: 'ai_talent_acquisition', name: 'Top Talent Acquisition', description: 'Hire the best minds, +30% income.', cost: 7500000, requiredLevel: 10, isPurchased: false, incomeBoostPercent: 30 },
      { id: 'ai_breakthrough_algorithm', name: 'Breakthrough Algorithm', description: 'Revolutionize a field, +50% income.', cost: 15000000, requiredLevel: 15, isPurchased: false, incomeBoostPercent: 50 },
    ],
  },
];

export const calculateIncome = (business: Business): number => {
  if (business.level === 0) return 0;

  let currentIncome = business.level * business.baseIncome;
  
  // Apply level multiplier for specific businesses if defined (example was Tech Startup)
  // You can add more specific business logic here if needed
  // if (business.name === 'Tech Startup') {
  //   currentIncome *= Math.pow(1.05, business.level); // Example: 5% compounding income per level
  // }
  
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
  
  if (business.upgrades) {
    business.upgrades.forEach(upgrade => {
      if (upgrade.isPurchased && upgrade.levelUpgradeCostReductionPercent) {
        currentCost *= (1 - upgrade.levelUpgradeCostReductionPercent / 100);
      }
    });
  }
  
  return Math.floor(currentCost);
};

    
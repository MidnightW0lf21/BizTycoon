

import type { Business, BusinessUpgrade, Stock, SkillNode, HQUpgrade, HQUpgradeLevel, FactoryPowerBuildingConfig, FactoryMachineConfig, FactoryComponent, FactoryMaterialCollectorConfig, ResearchItemConfig, Worker, Artifact, QuarryUpgrade, ArtifactRarity, ToastSettings, ETF, BusinessSynergy, IPO, FarmField, Crop, FarmVehicleConfig, FarmVehicle, CropId, FarmActivity, KitchenCraftingActivity, KitchenItem, KitchenRecipe } from '@/types';
import { INITIAL_BUSINESSES, TECH_BUSINESS_IDS, LOGISTICS_BUSINESS_IDS, MEDIA_BUSINESS_IDS, MANUFACTURING_BUSINESS_IDS, ENERGY_BUSINESS_IDS, FINANCE_BUSINESS_IDS, BIO_TECH_BUSINESS_IDS, AEROSPACE_BUSINESS_IDS, MISC_ADVANCED_BUSINESS_IDS } from './data/businesses';
import { INITIAL_STOCKS, STOCK_ETF_UNLOCK_ORDER } from './data/stocks';
import { INITIAL_STOCK_UPGRADES } from './data/stock-upgrades';
import { INITIAL_SKILL_TREE } from './data/skills';
import { INITIAL_HQ_UPGRADES } from './data/hq';
import { INITIAL_ARTIFACTS } from './data/artifacts';
import { INITIAL_FACTORY_COMPONENTS_CONFIG, INITIAL_FACTORY_MACHINE_CONFIGS, INITIAL_FACTORY_POWER_BUILDINGS_CONFIG, INITIAL_FACTORY_MATERIAL_COLLECTORS_CONFIG } from './data/factory';
import { INITIAL_RESEARCH_ITEMS_CONFIG } from './data/research';
import { WORKER_HIRE_COST_BASE, WORKER_HIRE_COST_MULTIPLIER, MAX_WORKERS, INITIAL_WORKER_MAX_ENERGY, WORKER_ENERGY_TIERS, WORKER_ENERGY_RATE } from './data/workers';
import { INITIAL_QUARRY_UPGRADES } from './data/quarry';
import { INITIAL_ETFS } from './data/etfs';
import { BUSINESS_SYNERGIES } from './data/synergies';
import { Sandwich, Combine, Sprout, Tractor, Wheat, Bot, Shell, Popcorn, Salad, Apple, Grape, Candy, Soup, CakeSlice, Cake, GlassWater, CookingPot, Utensils, UtensilsCrossed, Pizza, Beef, Lollipop, SandwichIcon } from 'lucide-react';


export const INITIAL_MONEY = 10;
export const MAX_BUSINESS_LEVEL = 100;
export const INITIAL_PRESTIGE_POINTS = 0;
export const INITIAL_TIMES_PRESTIGED = 0;
export const INITIAL_UNLOCKED_SKILL_IDS: string[] = [];
export const INITIAL_PURCHASED_STOCK_UPGRADE_IDS: string[] = [];
export const INITIAL_HQ_UPGRADE_LEVELS: Record<string, number> = {};
export const INITIAL_UNLOCKED_ARTIFACT_IDS: string[] = [];
export const INITIAL_FACTORY_WORKERS: Worker[] = [];
export const INITIAL_WORKER_ENERGY_TIER = 0;
export const INITIAL_FACTORY_RAW_MATERIALS_CAP = 500;

export const PRESTIGE_BASE_LEVEL_COST = 75;
export const PRESTIGE_LEVEL_COST_INCREMENT = 25;

export const FACTORY_PURCHASE_COST = 1000000;
export const MATERIAL_COLLECTION_AMOUNT = 10;
export const MATERIAL_COLLECTION_COOLDOWN_MS = 5000;

// Quarry Config
export const BASE_QUARRY_COST = 10000;
export const QUARRY_COST_MULTIPLIER = 2.5;
export const BASE_QUARRY_DEPTH = 1000; // 10m in cm
export const QUARRY_DEPTH_MULTIPLIER = 1.2;
export const BASE_ARTIFACT_CHANCE_PER_DIG = 0.005; // 0.5%
export const ARTIFACT_CHANCE_DEPTH_MULTIPLIER = 1.0001; // Small increase per cm
export const ARTIFACT_RARITY_WEIGHTS: Record<ArtifactRarity, number> = { Common: 60, Uncommon: 25, Rare: 10, Legendary: 4, Mythic: 1 };
export const INITIAL_QUARRY_LEVEL = 0;
export const QUARRY_ENERGY_MAX = 25;
export const QUARRY_ENERGY_COST_PER_DIG = 10;
export const QUARRY_ENERGY_REGEN_PER_SECOND = 1;
export const QUARRY_DIG_COOLDOWN_MS = 2000; // 2 seconds
export const QUARRY_NAME_PREFIXES = ["Stone", "Deep", "Crystal", "Gem", "Forgotten", "Lost", "Ancient", "Glimmering", "Echoing"];
export const QUARRY_NAME_SUFFIXES = ["Mine", "Quarry", "Cavern", "Chasm", "Pit", "Delve", "Excavation", "Hollow", "Depths"];

// Farm Config
export const FARM_PURCHASE_COST = 50000000;
export const INITIAL_SILO_CAPACITY = 1000;
export const SILO_CAPACITY_MAX = 75000;
export const INITIAL_FUEL_CAPACITY = 500;
export const FUEL_CAPACITY_MAX = 10000;
export const FUEL_ORDER_COST_PER_LTR = 1000;
export const FUEL_DELIVERY_TIME_BASE_SECONDS = 60; // 1 minute base
export const FUEL_DELIVERY_TIME_PER_LTR_SECONDS = 0.5; // Half a second per liter
export const VEHICLE_REPAIR_COST_PER_PERCENT = 50000;
export const VEHICLE_REPAIR_TIME_PER_PERCENT_SECONDS = 10;
export const SILO_UPGRADE_COST_BASE = 1000000;
export const SILO_UPGRADE_COST_MULTIPLIER = 1.8;
export const FUEL_DEPOT_UPGRADE_COST_BASE = 750000;
export const FUEL_DEPOT_UPGRADE_COST_MULTIPLIER = 1.6;


const fieldSizes = [5, 8, 5, 12, 10, 15, 8, 20, 12, 25];
export const INITIAL_FARM_FIELDS: FarmField[] = Array.from({ length: 10 }, (_, i) => ({
  id: `field_${i + 1}`,
  name: `Field ${i + 1}`,
  sizeHa: fieldSizes[i],
  purchaseCost: Math.floor(15000000 * Math.pow(1.6, i)),
  isOwned: i < 2, // First 2 fields are owned by default
  status: 'Empty',
}));

export const FARM_CROPS: Crop[] = [
  { id: 'Wheat', name: 'Wheat', icon: Wheat, growthTimeSeconds: 600, yieldPerHa: 100 },
  { id: 'Corn', name: 'Corn', icon: Sprout, growthTimeSeconds: 1200, yieldPerHa: 150 },
  { id: 'Potatoes', name: 'Potatoes', icon: CookingPot, growthTimeSeconds: 900, yieldPerHa: 200 },
  { id: 'Carrots', name: 'Carrots', icon: Sprout, growthTimeSeconds: 800, yieldPerHa: 180 },
  { id: 'Tomatoes', name: 'Tomatoes', icon: Apple, growthTimeSeconds: 1500, yieldPerHa: 120 },
  { id: 'Sugarcane', name: 'Sugarcane', icon: UtensilsCrossed, growthTimeSeconds: 2400, yieldPerHa: 250 },
  { id: 'Apples', name: 'Apples', icon: Apple, growthTimeSeconds: 3000, yieldPerHa: 80 },
  { id: 'Strawberries', name: 'Strawberries', icon: Grape, growthTimeSeconds: 1800, yieldPerHa: 130 },
];


export const FARM_VEHICLES: FarmVehicleConfig[] = [
  // Tractors
  { id: 'tractor_tier1', name: 'Old Tractor', type: 'Tractor', icon: Tractor, speedHaPerHr: 10, fuelCapacity: 100, fuelUsageLtrPerHr: 10, wearPerHr: 2, purchaseCost: 2500000 },
  { id: 'tractor_tier2', name: 'Modern Tractor', type: 'Tractor', icon: Tractor, speedHaPerHr: 15, fuelCapacity: 120, fuelUsageLtrPerHr: 12, wearPerHr: 1.8, purchaseCost: 55000000 },
  { id: 'tractor_tier3', name: 'Advanced Tractor', type: 'Tractor', icon: Tractor, speedHaPerHr: 22, fuelCapacity: 150, fuelUsageLtrPerHr: 15, wearPerHr: 1.5, purchaseCost: 150000000 },
  { id: 'tractor_tier4', name: 'High-Tech Tractor', type: 'Tractor', icon: Tractor, speedHaPerHr: 35, fuelCapacity: 200, fuelUsageLtrPerHr: 20, wearPerHr: 1.2, purchaseCost: 400000000 },
  { id: 'tractor_tier5', name: 'Quantum Tractor', type: 'Tractor', icon: Bot, speedHaPerHr: 50, fuelCapacity: 300, fuelUsageLtrPerHr: 25, wearPerHr: 0.8, purchaseCost: 1200000000 },
  // Harvesters
  { id: 'harvester_tier1', name: 'Basic Combine', type: 'Harvester', icon: Combine, speedHaPerHr: 8, fuelCapacity: 150, fuelUsageLtrPerHr: 15, wearPerHr: 3, purchaseCost: 3000000 },
  { id: 'harvester_tier2', name: 'Heavy Combine', type: 'Harvester', icon: Combine, speedHaPerHr: 13, fuelCapacity: 180, fuelUsageLtrPerHr: 20, wearPerHr: 2.5, purchaseCost: 80000000 },
  { id: 'harvester_tier3', name: 'Industrial Harvester', type: 'Harvester', icon: Combine, speedHaPerHr: 20, fuelCapacity: 220, fuelUsageLtrPerHr: 25, wearPerHr: 2, purchaseCost: 220000000 },
  { id: 'harvester_tier4', name: 'Autonomous Harvester', type: 'Harvester', icon: Bot, speedHaPerHr: 30, fuelCapacity: 300, fuelUsageLtrPerHr: 30, wearPerHr: 1.5, purchaseCost: 600000000 },
  { id: 'harvester_tier5', name: 'Fusion-Powered Harvester', type: 'Harvester', icon: Bot, speedHaPerHr: 45, fuelCapacity: 500, fuelUsageLtrPerHr: 35, wearPerHr: 1, purchaseCost: 1800000000 },
];

export const KITCHEN_RECIPES: KitchenRecipe[] = [
    // Intermediate Goods
    { id: 'flour', name: 'Flour', icon: Shell, ingredients: [{ cropId: 'Wheat', quantity: 5 }], outputItemId: 'flour', outputQuantity: 1, craftTimeSeconds: 15 },
    { id: 'sugar', name: 'Sugar', icon: Candy, ingredients: [{ cropId: 'Sugarcane', quantity: 15 }], outputItemId: 'sugar', outputQuantity: 1, craftTimeSeconds: 50 },
    { id: 'tomato_sauce', name: 'Tomato Sauce', icon: Soup, ingredients: [{ cropId: 'Tomatoes', quantity: 8 }], outputItemId: 'tomato_sauce', outputQuantity: 1, craftTimeSeconds: 40 },
    { id: 'dough', name: 'Dough', icon: CookingPot, ingredients: [{ cropId: 'flour', quantity: 2 }], outputItemId: 'dough', outputQuantity: 1, craftTimeSeconds: 25 },

    // Simple Recipes
    { id: 'bread', name: 'Bread', icon: Sandwich, ingredients: [{ cropId: 'flour', quantity: 1 }], outputItemId: 'bread', outputQuantity: 1, craftTimeSeconds: 30 },
    { id: 'popcorn', name: 'Popcorn', icon: Popcorn, ingredients: [{ cropId: 'Corn', quantity: 8 }], outputItemId: 'popcorn', outputQuantity: 1, craftTimeSeconds: 25 },
    { id: 'potato_wedges', name: 'Potato Wedges', icon: Salad, ingredients: [{ cropId: 'Potatoes', quantity: 12 }], outputItemId: 'potato_wedges', outputQuantity: 1, craftTimeSeconds: 40 },
    { id: 'fruit_salad', name: 'Fruit Salad', icon: Salad, ingredients: [{ cropId: 'Apples', quantity: 5 }, { cropId: 'Strawberries', quantity: 10 }], outputItemId: 'fruit_salad', outputQuantity: 1, craftTimeSeconds: 45 },
    { id: 'strawberry_jam', name: 'Strawberry Jam', icon: GlassWater, ingredients: [{ cropId: 'Strawberries', quantity: 20 }, { cropId: 'sugar', quantity: 2 }], outputItemId: 'strawberry_jam', outputQuantity: 1, craftTimeSeconds: 75 },
    { id: 'candied_apple', name: 'Candied Apple', icon: Lollipop, ingredients: [{ cropId: 'Apples', quantity: 1 }, { cropId: 'sugar', quantity: 3 }], outputItemId: 'candied_apple', outputQuantity: 1, craftTimeSeconds: 60 },
    { id: 'corn_on_cob', name: 'Corn on the Cob', icon: Sprout, ingredients: [{ cropId: 'Corn', quantity: 5 }], outputItemId: 'corn_on_cob', outputQuantity: 1, craftTimeSeconds: 35 },
    
    // Complex Recipes
    { id: 'vegetable_stew', name: 'Vegetable Stew', icon: CookingPot, ingredients: [{ cropId: 'Potatoes', quantity: 10 }, { cropId: 'Carrots', quantity: 8 }, { cropId: 'Tomatoes', quantity: 6 }], outputItemId: 'vegetable_stew', outputQuantity: 1, craftTimeSeconds: 100 },
    { id: 'carrot_cake', name: 'Carrot Cake', icon: Cake, ingredients: [{ cropId: 'Carrots', quantity: 15 }, { cropId: 'flour', quantity: 3 }, { cropId: 'sugar', quantity: 5 }], outputItemId: 'carrot_cake', outputQuantity: 1, craftTimeSeconds: 120 },
    { id: 'apple_pie', name: 'Apple Pie', icon: CakeSlice, ingredients: [{ cropId: 'Apples', quantity: 8 }, { cropId: 'dough', quantity: 1 }, { cropId: 'sugar', quantity: 2 }], outputItemId: 'apple_pie', outputQuantity: 1, craftTimeSeconds: 90 },
    { id: 'pizza', name: 'Pizza', icon: Pizza, ingredients: [{ cropId: 'dough', quantity: 1 }, { cropId: 'tomato_sauce', quantity: 1 }], outputItemId: 'pizza', outputQuantity: 1, craftTimeSeconds: 80 },
    { id: 'tomato_soup', name: 'Tomato Soup', icon: Soup, ingredients: [{ cropId: 'tomato_sauce', quantity: 2 }, { cropId: 'Carrots', quantity: 2 }], outputItemId: 'tomato_soup', outputQuantity: 1, craftTimeSeconds: 60 },
    { id: 'beef_stew', name: 'Beef Stew (Vegan)', icon: Beef, ingredients: [{ cropId: 'vegetable_stew', quantity: 1 }, { cropId: 'Potatoes', quantity: 5 }], outputItemId: 'beef_stew', outputQuantity: 1, craftTimeSeconds: 150 },
    { id: 'fruit_tart', name: 'Fruit Tart', icon: CakeSlice, ingredients: [{ cropId: 'dough', quantity: 1 }, { cropId: 'fruit_salad', quantity: 1 }, { cropId: 'sugar', quantity: 3 }], outputItemId: 'fruit_tart', outputQuantity: 1, craftTimeSeconds: 110 },
    { id: 'gourmet_sandwich', name: 'Gourmet Sandwich', icon: SandwichIcon, ingredients: [{ cropId: 'bread', quantity: 2 }, { cropId: 'Tomatoes', quantity: 3 }, { cropId: 'Carrots', quantity: 3 }], outputItemId: 'gourmet_sandwich', outputQuantity: 1, craftTimeSeconds: 55 },
    { id: 'strawberry_shortcake', name: 'Strawberry Shortcake', icon: Cake, ingredients: [{ cropId: 'Strawberries', quantity: 15 }, { cropId: 'flour', quantity: 2 }, { cropId: 'sugar', quantity: 4 }], outputItemId: 'strawberry_shortcake', outputQuantity: 1, craftTimeSeconds: 130 },
];


export const INITIAL_RESEARCH_POINTS = 0;
export const INITIAL_UNLOCKED_RESEARCH_IDS: string[] = [];
export const INITIAL_UNLOCKED_FACTORY_COMPONENT_RECIPE_IDS: string[] = [];
export const RESEARCH_MANUAL_GENERATION_AMOUNT = 1; // Base RP per click
export const RESEARCH_MANUAL_GENERATION_COST_MONEY = 10000; // Base money cost per click
export const MANUAL_RESEARCH_ADDITIVE_COST_INCREASE_PER_BOOST = 10000; // Money cost increase per "manual_rp_boost" stage
export const RESEARCH_MANUAL_COOLDOWN_MS = 10000; // 10 seconds
export const REQUIRED_PRESTIGE_LEVEL_FOR_RESEARCH_TAB = 6;

export const defaultToastSettings: ToastSettings = {
  showAutoBuyUpgrades: true,
  showManualPurchases: true,
  showStockTrades: true,
  showPrestige: true,
  showFactory: true,
  showQuarry: true,
};


export const calculateIncome = (
    business: Business,
    unlockedSkillIds: string[] = [],
    skillTree: SkillNode[] = [],
    purchasedHQUpgradeLevels: Record<string, number> = {},
    hqUpgradesConfig: HQUpgrade[] = [],
    producedFactoryComponents: Record<string, number> = {},
    factoryComponentsConfig: FactoryComponent[] = [],
    unlockedArtifactIds: string[] = [],
    artifactsConfig: Artifact[] = []
  ): number => {
  if (business.level === 0) return 0;
  let currentIncome = business.level * business.baseIncome;

  if (business.upgrades) {
    business.upgrades.forEach(upgrade => {
      if (upgrade.isPurchased && upgrade.incomeBoostPercent) {
        currentIncome *= (1 + upgrade.incomeBoostPercent / 100);
      }
    });
  }

  let totalGlobalIncomeBoost = 0;
  let businessSpecificBoost = 0;

  unlockedSkillIds.forEach(skillId => {
    const skill = skillTree.find(s => s.id === skillId);
    if (skill && skill.effects) {
      if (skill.effects.globalIncomeBoostPercent) {
        totalGlobalIncomeBoost += skill.effects.globalIncomeBoostPercent;
      }
      if (skill.effects.businessSpecificIncomeBoost && skill.effects.businessSpecificIncomeBoost.businessId === business.id) {
        businessSpecificBoost += skill.effects.businessSpecificIncomeBoost.percent;
      }
      if (skill.id === 'tech_empire_synergy' && TECH_BUSINESS_IDS.includes(business.id)) { businessSpecificBoost += 15; }
      if (skill.id === 'logistics_network_optimization' && LOGISTICS_BUSINESS_IDS.includes(business.id)) { businessSpecificBoost += 15; }
      if (skill.id === 'media_mogul_influence' && MEDIA_BUSINESS_IDS.includes(business.id)) { businessSpecificBoost += 15; }
      if (skill.id === 'industrial_powerhouse' && MANUFACTURING_BUSINESS_IDS.includes(business.id)) { businessSpecificBoost += 15; }
    }
  });

  for (const hqId in purchasedHQUpgradeLevels) {
    const purchasedLevel = purchasedHQUpgradeLevels[hqId];
    if (purchasedLevel > 0) {
        const hqUpgrade = hqUpgradesConfig.find(h => h.id === hqId);
        if (hqUpgrade && hqUpgrade.levels) {
            const levelData = hqUpgrade.levels.find(l => l.level === purchasedLevel);
            if (levelData && levelData.effects.globalIncomeBoostPercent) { totalGlobalIncomeBoost += levelData.effects.globalIncomeBoostPercent; }
          }
      }
  }

  (unlockedArtifactIds || []).forEach(artifactId => {
    const artifact = artifactsConfig.find(a => a.id === artifactId);
    if (artifact?.effects.globalIncomeBoostPercent) {
      totalGlobalIncomeBoost += artifact.effects.globalIncomeBoostPercent;
    }
  });

  for (const componentId in producedFactoryComponents) {
    const count = producedFactoryComponents[componentId];
    if (count > 0) {
      const componentConfig = factoryComponentsConfig.find(fc => fc.id === componentId);
      if (componentConfig && componentConfig.effects?.globalIncomeBoostPercent) {
        totalGlobalIncomeBoost += count * componentConfig.effects.globalIncomeBoostPercent;
      }
    }
  }
  if (totalGlobalIncomeBoost > 0) { currentIncome *= (1 + totalGlobalIncomeBoost / 100); }
  if (businessSpecificBoost > 0) { currentIncome *= (1 + businessSpecificBoost / 100); }
  return currentIncome;
};

export const calculateSingleLevelUpgradeCost = (
    businessLevel: number,
    baseCost: number,
    upgradeCostMultiplier: number,
    purchasedUpgrades: BusinessUpgrade[] = [],
    unlockedSkillIds: string[] = [],
    skillTree: SkillNode[] = [],
    businessId: string | undefined,
    purchasedHQUpgradeLevels: Record<string, number> = {},
    hqUpgradesConfig: HQUpgrade[] = [],
    unlockedArtifactIds: string[] = [],
    artifactsConfig: Artifact[] = []
  ): number => {
  let currentCost = baseCost * Math.pow(upgradeCostMultiplier, businessLevel);

  (purchasedUpgrades || []).forEach(upgrade => {
    if (upgrade.isPurchased && upgrade.levelUpgradeCostReductionPercent) {
      currentCost *= (1 - upgrade.levelUpgradeCostReductionPercent / 100);
    }
  });

  let totalGlobalCostReduction = 0;
  unlockedSkillIds.forEach(skillId => {
    const skill = skillTree.find(s => s.id === skillId);
    if (skill && skill.effects) {
        if (skill.effects.globalCostReductionPercent) {
          totalGlobalCostReduction += skill.effects.globalCostReductionPercent;
        }
        if (businessId && skill.id === `${businessId}_mastery_1`) {
          const masterySkill = skillTree.find(s => s.id === `${businessId}_mastery_1`);
          if (masterySkill && masterySkill.description.includes('level up cost -3%')) {
             totalGlobalCostReduction += 3;
          }
        }
    }
  });

  for (const hqId in purchasedHQUpgradeLevels) {
    const purchasedLevel = purchasedHQUpgradeLevels[hqId];
    if (purchasedLevel > 0) {
        const hqUpgrade = hqUpgradesConfig.find(h => h.id === hqId);
        if (hqUpgrade && hqUpgrade.levels) {
            const levelData = hqUpgrade.levels.find(l => l.level === purchasedLevel);
            if (levelData && levelData.effects.globalCostReductionPercent) {
                totalGlobalCostReduction += levelData.effects.globalCostReductionPercent;
            }
        }
    }
  }

  (unlockedArtifactIds || []).forEach(artifactId => {
    const artifact = artifactsConfig.find(a => a.id === artifactId);
    if (artifact?.effects.globalCostReductionPercent) {
      totalGlobalCostReduction += artifact.effects.globalCostReductionPercent;
    }
  });


  if (totalGlobalCostReduction > 0) {
    currentCost *= (1 - totalGlobalCostReduction / 100);
  }
  return Math.max(1, Math.floor(currentCost));
};


export const calculateCostForNLevels = (
  business: Business,
  levelsToAttempt: number,
  unlockedSkillIds: string[] = [],
  skillTree: SkillNode[] = [],
  dynamicMaxLevel: number,
  purchasedHQUpgradeLevels: Record<string, number> = {},
  hqUpgradesConfig: HQUpgrade[] = [],
  unlockedArtifactIds: string[] = [],
  artifactsConfig: Artifact[] = []
): { totalCost: number; levelsPurchasable: number } => {
  let totalCost = 0;
  let levelsPurchased = 0;
  let currentSimulatedLevel = business.level;

  for (let i = 0; i < levelsToAttempt; i++) {
    if (currentSimulatedLevel >= dynamicMaxLevel) {
      break;
    }
    const costForThisLevel = calculateSingleLevelUpgradeCost(
      currentSimulatedLevel,
      business.baseCost,
      business.upgradeCostMultiplier,
      business.upgrades?.filter(u => u.isPurchased),
      unlockedSkillIds,
      skillTree,
      business.id,
      purchasedHQUpgradeLevels,
      hqUpgradesConfig,
      unlockedArtifactIds,
      artifactsConfig
    );
    totalCost += costForThisLevel;
    levelsPurchased++;
    currentSimulatedLevel++;
  }
  return { totalCost: Math.floor(totalCost), levelsPurchasable: levelsPurchased };
};

export const calculateMaxAffordableLevels = (
  business: Business,
  currentMoney: number,
  unlockedSkillIds: string[] = [],
  skillTree: SkillNode[] = [],
  dynamicMaxLevel: number,
  purchasedHQUpgradeLevels: Record<string, number> = {},
  hqUpgradesConfig: HQUpgrade[] = [],
  unlockedArtifactIds: string[] = [],
  artifactsConfig: Artifact[] = []
): { levelsToBuy: number; totalCost: number } => {
  let affordableLevels = 0;
  let cumulativeCost = 0;
  let moneyLeft = currentMoney;
  let currentSimulatedLevel = business.level;

  while (currentSimulatedLevel < dynamicMaxLevel) {
    const costForNextLevel = calculateSingleLevelUpgradeCost(
      currentSimulatedLevel,
      business.baseCost,
      business.upgradeCostMultiplier,
      business.upgrades?.filter(u => u.isPurchased),
      unlockedSkillIds,
      skillTree,
      business.id,
      purchasedHQUpgradeLevels,
      hqUpgradesConfig,
      unlockedArtifactIds,
      artifactsConfig
    );

    if (moneyLeft >= costForNextLevel) {
      moneyLeft -= costForNextLevel;
      cumulativeCost += costForNextLevel;
      affordableLevels++;
      currentSimulatedLevel++;
    } else {
      break;
    }
  }
  return { levelsToBuy: affordableLevels, totalCost: Math.floor(cumulativeCost) };
};


export const getStartingMoneyBonus = (
  unlockedSkillIds: string[] = [],
  skillTree: SkillNode[] = [],
  purchasedHQUpgradeLevels: Record<string, number> = {},
  hqUpgradesConfig: HQUpgrade[] = [],
  unlockedArtifactIds: string[] = [],
  artifactsConfig: Artifact[] = []
): number => {
  let bonus = 0;
  unlockedSkillIds.forEach(skillId => {
    const skill = skillTree.find(s => s.id === skillId);
    if (skill && skill.effects && skill.effects.increaseStartingMoney) {
      bonus += skill.effects.increaseStartingMoney;
    }
  });

  for (const hqId in purchasedHQUpgradeLevels) {
    const purchasedLevel = purchasedHQUpgradeLevels[hqId];
    if (purchasedLevel > 0) {
        const hqUpgrade = hqUpgradesConfig.find(h => h.id === hqId);
        if (hqUpgrade && hqUpgrade.levels) {
            const levelData = hqUpgrade.levels.find(l => l.level === purchasedLevel);
            if (levelData && levelData.effects.increaseStartingMoney) {
                bonus += levelData.effects.increaseStartingMoney;
            }
        }
    }
  }

  (unlockedArtifactIds || []).forEach(artifactId => {
    const artifact = artifactsConfig.find(a => a.id === artifactId);
    if (artifact?.effects.increaseStartingMoney) {
      bonus += artifact.effects.increaseStartingMoney;
    }
  });

  return bonus;
};

export const getPrestigePointBoostPercent = (
  unlockedSkillIds: string[] = [],
  skillTree: SkillNode[] = [],
  purchasedHQUpgradeLevels: Record<string, number> = {},
  hqUpgradesConfig: HQUpgrade[] = [],
  unlockedArtifactIds: string[] = [],
  artifactsConfig: Artifact[] = []
): number => {
  let boostPercent = 0;
  unlockedSkillIds.forEach(skillId => {
    const skill = skillTree.find(s => s.id === skillId);
    if (skill && skill.effects && skill.effects.globalPrestigePointBoostPercent) {
      boostPercent += skill.effects.globalPrestigePointBoostPercent;
    }
  });

  for (const hqId in purchasedHQUpgradeLevels) {
    const purchasedLevel = purchasedHQUpgradeLevels[hqId];
     if (purchasedLevel > 0) {
        const hqUpgradeConfigEntry = hqUpgradesConfig.find(h => h.id === hqId);
        if (hqUpgradeConfigEntry && hqUpgradeConfigEntry.levels) {
            const levelData = hqUpgradeConfigEntry.levels.find(l => l.level === purchasedLevel);
            if (levelData && levelData.effects.globalPrestigePointBoostPercent) {
                boostPercent += levelData.effects.globalPrestigePointBoostPercent;
            }
        }
    }
  }

  (unlockedArtifactIds || []).forEach(artifactId => {
    const artifact = artifactsConfig.find(a => a.id === artifactId);
    if (artifact?.effects.globalPrestigePointBoostPercent) {
      boostPercent += artifact.effects.globalPrestigePointBoostPercent;
    }
  });

  return boostPercent;
};

export const calculateDiminishingPrestigePoints = (totalLevels: number): number => {
  let points = 0;
  let cumulativeLevelsRequiredForCurrentPoints = 0;
  let costForThisSpecificPoint = PRESTIGE_BASE_LEVEL_COST;

  while (true) {
    if (totalLevels >= cumulativeLevelsRequiredForCurrentPoints + costForThisSpecificPoint) {
      points++;
      cumulativeLevelsRequiredForCurrentPoints += costForThisSpecificPoint;
      costForThisSpecificPoint += PRESTIGE_LEVEL_COST_INCREMENT;
    } else {
      break;
    }
  }
  return points;
};

export const getCostForNthPoint = (n: number): number => {
  if (n <= 0) return PRESTIGE_BASE_LEVEL_COST;
  return PRESTIGE_BASE_LEVEL_COST + (n - 1) * PRESTIGE_LEVEL_COST_INCREMENT;
};

export const getLevelsRequiredForNPoints = (pointsToAchieve: number): number => {
  if (pointsToAchieve <= 0) return 0;
  let totalLevels = 0;
  for (let i = 1; i <= pointsToAchieve; i++) {
    totalLevels += getCostForNthPoint(i);
  }
  return totalLevels;
};

export {
  INITIAL_BUSINESSES,
  TECH_BUSINESS_IDS,
  LOGISTICS_BUSINESS_IDS,
  MEDIA_BUSINESS_IDS,
  MANUFACTURING_BUSINESS_IDS,
  ENERGY_BUSINESS_IDS,
  FINANCE_BUSINESS_IDS,
  BIO_TECH_BUSINESS_IDS,
  AEROSPACE_BUSINESS_IDS,
  MISC_ADVANCED_BUSINESS_IDS,
} from './data/businesses';

export { INITIAL_STOCKS, STOCK_ETF_UNLOCK_ORDER } from './data/stocks';
export { INITIAL_STOCK_UPGRADES } from './data/stock-upgrades';
export { INITIAL_ETFS } from './data/etfs';
export { BUSINESS_SYNERGIES } from './data/synergies';
export { INITIAL_SKILL_TREE } from './data/skills';
export { INITIAL_HQ_UPGRADES } from './data/hq';
export { INITIAL_ARTIFACTS } from './data/artifacts';
export { INITIAL_QUARRY_UPGRADES } from './data/quarry';
export {
  INITIAL_FACTORY_POWER_BUILDINGS_CONFIG,
  INITIAL_FACTORY_COMPONENTS_CONFIG,
  INITIAL_FACTORY_MACHINE_CONFIGS,
  INITIAL_FACTORY_MATERIAL_COLLECTORS_CONFIG
} from './data/factory';
export { INITIAL_RESEARCH_ITEMS_CONFIG } from './data/research';
export { WORKER_FIRST_NAMES, WORKER_LAST_NAMES, INITIAL_WORKER_MAX_ENERGY, WORKER_ENERGY_TIERS, WORKER_ENERGY_RATE, WORKER_HIRE_COST_BASE, WORKER_HIRE_COST_MULTIPLIER, MAX_WORKERS } from './data/workers';
    

    








import type { Business, BusinessUpgrade, Stock, SkillNode, HQUpgrade, HQUpgradeLevel, FactoryPowerBuildingConfig, FactoryMachineConfig, FactoryComponent, FactoryMaterialCollectorConfig, ResearchItemConfig, Worker, Artifact, QuarryUpgrade, ArtifactRarity, ToastSettings } from '@/types';
import { INITIAL_BUSINESSES, TECH_BUSINESS_IDS, LOGISTICS_BUSINESS_IDS, MEDIA_BUSINESS_IDS, MANUFACTURING_BUSINESS_IDS, ENERGY_BUSINESS_IDS, FINANCE_BUSINESS_IDS, BIO_TECH_BUSINESS_IDS, AEROSPACE_BUSINESS_IDS, MISC_ADVANCED_BUSINESS_IDS } from './data/businesses';
import { INITIAL_STOCKS } from './data/stocks';
import { INITIAL_SKILL_TREE } from './data/skills';
import { INITIAL_HQ_UPGRADES } from './data/hq';
import { INITIAL_ARTIFACTS } from './data/artifacts';
import { INITIAL_FACTORY_COMPONENTS_CONFIG, INITIAL_FACTORY_MACHINE_CONFIGS, INITIAL_FACTORY_POWER_BUILDINGS_CONFIG, INITIAL_FACTORY_MATERIAL_COLLECTORS_CONFIG } from './data/factory';
import { INITIAL_RESEARCH_ITEMS_CONFIG } from './data/research';
import { WORKER_HIRE_COST_BASE, WORKER_HIRE_COST_MULTIPLIER, MAX_WORKERS, INITIAL_WORKER_MAX_ENERGY, WORKER_ENERGY_TIERS, WORKER_ENERGY_RATE } from './data/workers';
import { INITIAL_QUARRY_UPGRADES } from './data/quarry';


export const INITIAL_MONEY = 10;
export const MAX_BUSINESS_LEVEL = 100;
export const INITIAL_PRESTIGE_POINTS = 0;
export const INITIAL_TIMES_PRESTIGED = 0;
export const INITIAL_UNLOCKED_SKILL_IDS: string[] = [];
export const INITIAL_HQ_UPGRADE_LEVELS: Record<string, number> = {};
export const INITIAL_UNLOCKED_ARTIFACT_IDS: string[] = [];
export const INITIAL_FACTORY_WORKERS: Worker[] = [];
export const INITIAL_WORKER_ENERGY_TIER = 0;
export const INITIAL_UNLOCKED_FACTORY_COMPONENT_RECIPE_IDS: string[] = [];
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


export const INITIAL_RESEARCH_POINTS = 0;
export const INITIAL_UNLOCKED_RESEARCH_IDS: string[] = [];
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
      if (componentConfig && componentConfig.effects?.globalIncomeBoostPerComponentPercent) {
        totalGlobalIncomeBoost += count * componentConfig.effects.globalIncomeBoostPerComponentPercent;
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

export { INITIAL_STOCKS } from './data/stocks';
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

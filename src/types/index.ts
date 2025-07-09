
import type { LucideIcon } from "lucide-react";

export interface BusinessUpgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  requiredLevel: number;
  isPurchased: boolean;
  incomeBoostPercent?: number;
  levelUpgradeCostReductionPercent?: number;
  unlocksBulkBuy?: true;
}

export interface Business {
  id:string;
  name: string;
  level: number;
  baseIncome: number;
  baseCost: number;
  upgradeCostMultiplier: number;
  icon: LucideIcon;
  managerOwned: boolean;
  description: string;
  upgrades?: BusinessUpgrade[];
}

export interface Stock {
  id: string;
  ticker: string;
  companyName: string;
  price: number;
  dividendYield: number;
  icon: LucideIcon;
  description: string;
  totalOutstandingShares: number;
  requiredSkillToUnlock?: string;
}

export interface StockHolding {
  stockId: string;
  shares: number;
  averagePurchasePrice: number;
}

export interface ETF {
  id: string;
  ticker: string;
  name: string;
  description: string;
  sector: string; // e.g., 'TECH', 'FINANCE'
  icon: LucideIcon;
  totalOutstandingShares: number;
}

export interface EtfHolding {
  etfId: string;
  shares: number;
  averagePurchasePrice: number;
}

export interface StockUpgradeEffect {
  dividendYieldBoost?: number; // Additive boost, e.g., 0.0001
}

export interface StockUpgrade {
  id: string;
  name: string;
  description: string;
  costMoney: number;
  costPrestigePoints?: number;
  targetStockId: string;
  icon: LucideIcon;
  effects: StockUpgradeEffect;
}

export interface SkillNodeEffects {
  globalIncomeBoostPercent?: number;
  globalCostReductionPercent?: number;
  businessSpecificIncomeBoost?: { businessId: string; percent: number };
  increaseStartingMoney?: number;
  globalDividendYieldBoostPercent?: number;
  globalBusinessUpgradeCostReductionPercent?: number;
  increaseMaxBusinessLevelBy?: number;
  unlocksBulkBuyForBusiness?: string;
  autoBuyUpgradesForBusiness?: string;
  globalPrestigePointBoostPercent?: number;
}

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: LucideIcon;
  dependencies?: string[];
  effects: SkillNodeEffects;
}

export interface HQUpgradeEffects {
  globalIncomeBoostPercent?: number;
  globalCostReductionPercent?: number;
  increaseStartingMoney?: number;
  globalDividendYieldBoostPercent?: number;
  globalPrestigePointBoostPercent?: number;
  retentionPercentage?: number; // Generic retention for both business levels and stock shares
  unlocksFactoryComponentRecipeIds?: string[];
}

export interface HQUpgradeLevel {
  level: number; // 1-indexed
  costMoney: number;
  costPrestigePoints?: number;
  description: string; // Description for this specific level's benefit
  effects: HQUpgradeEffects;
}

export interface HQUpgrade {
  id: string;
  name: string;
  description: string; // General description of the upgrade
  icon: LucideIcon;
  requiredTimesPrestiged?: number; // Overall requirement to start upgrading this
  levels: HQUpgradeLevel[];
}

export type ArtifactRarity = 'Common' | 'Uncommon' | 'Rare' | 'Legendary' | 'Mythic';

export interface ArtifactEffects {
  globalIncomeBoostPercent?: number;
  globalCostReductionPercent?: number;
  globalBusinessUpgradeCostReductionPercent?: number;
  increaseStartingMoney?: number;
  globalDividendYieldBoostPercent?: number;
  globalPrestigePointBoostPercent?: number;
  factoryPowerGenerationBoostPercent?: number;
  increaseManualMaterialCollection?: number;
  quarryDigPower?: number; // Additive dig power
  increaseMaxEnergy?: number;
  mineralBonus?: number;
  factoryManualRPGenerationBoost?: number;
}

export interface Artifact {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  effects: ArtifactEffects;
  rarity: ArtifactRarity;
  dropChance?: number;
}

export interface FactoryPowerBuildingConfig {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  baseCost: number;
  costMultiplier: number;
  powerOutputKw: number;
  maxInstances?: number;
  requiredResearchId?: string;
}

export interface FactoryPowerBuilding {
  instanceId: string; // Unique ID for this specific building instance
  configId: string;   // ID of the FactoryPowerBuildingConfig
  level: number;      // For future upgrades of individual buildings
}

export interface FactoryComponentEffects {
  globalIncomeBoostPercent?: number;
  businessSpecificIncomeBoostPercent?: { businessId: string; percent: number };
  stockSpecificDividendYieldBoostPercent?: { stockId: string; percent: number };
  factoryGlobalPowerOutputBoostPercent?: number;
  factoryGlobalMaterialCollectionBoostPercent?: number;
  businessSpecificLevelUpCostReductionPercent?: { businessId: string; percent: number };
  businessSpecificUpgradeCostReductionPercent?: { businessId: string; percent: number };
  businessTypeIncomeBoostPercent?: { businessType: string; percent: number };
  businessTypeLevelUpCostReductionPercent?: { businessType: string; percent: number };
  businessTypeUpgradeCostReductionPercent?: { businessType: string; percent: number };
  globalBusinessUpgradeCostReductionPercent?: number;
  globalCostReductionPercent?: number;
  globalDividendYieldBoostPercent?: number;
  factoryWorkerEnergyDrainModifier?: number;
  factoryManualRPGenerationBoost?: number;
  factoryGlobalPowerConsumptionModifier?: number;
  factoryWorkerEnergyRegenModifier?: number;
  factoryGlobalProductionSpeedModifier?: number;
  maxBonusPercent?: number;
}

export interface FactoryComponent {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  tier: number;
  recipe: { componentId: string, quantity: number }[];
  rawMaterialCost: number;
  productionTimeSeconds: number;
  requiredAssemblerMark: number;
  effects?: FactoryComponentEffects;
}

export interface FactoryMachineUpgradeEffect {
  productionSpeedMultiplier?: number;
  powerConsumptionModifier?: number;
}

export interface FactoryMachineUpgradeConfig {
  id: string;
  name: string;
  description: string;
  costMoney: number;
  costRP?: number;
  requiredResearchId?: string;
  effects: FactoryMachineUpgradeEffect;
}

export interface FactoryMachineConfig {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  baseCost: number;
  powerConsumptionKw: number;
  maxCraftableTier: number;
  requiredResearchId?: string;
  familyId?: string;
  mark?: number;
  upgrades?: FactoryMachineUpgradeConfig[];
}

export interface FactoryMachine {
  instanceId: string;
  configId: string;
  assignedProductionLineId: string | null;
  purchasedUpgradeIds?: string[];
}

export interface FactoryProductionLineSlot {
  machineInstanceId: string | null;
  targetComponentId: string | null;
}

export interface FactoryProductionLine {
  id: string;
  name: string;
  slots: FactoryProductionLineSlot[];
  isUnlocked: boolean;
  unlockCost?: number;
  requiredResearchId?: string;
}

export interface FactoryMaterialCollectorConfig {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  baseCost: number;
  costMultiplier: number;
  powerConsumptionKw: number;
  materialsPerSecond: number;
  maxInstances?: number;
  requiredResearchId?: string;
}

export interface FactoryMaterialCollector {
  instanceId: string;
  configId: string;
  currentMaterialsPerSecond: number;
}

export type WorkerStatus = 'idle' | 'working' | 'resting';

export interface Worker {
  id: string;
  name: string;
  assignedMachineInstanceId: string | null;
  energy: number;
  status: WorkerStatus;
}

export interface ResearchItemEffects {
  unlocksFactoryMachineConfigIds?: string[];
  unlocksFactoryComponentConfigIds?: string[];
  unlocksProductionLineId?: string;
  unlocksFactoryMaterialCollectorConfigIds?: string[];
  factoryMaterialCollectorBoost?: {
    collectorConfigId: string;
    materialsPerSecondBoostPercent: number;
  };
  unlocksFactoryPowerBuildingConfigIds?: string[];
  factoryPowerBuildingBoost?: {
    buildingConfigId: string;
    powerOutputBoostPercent: number;
  };
  upgradesWorkerEnergyTier?: boolean;
  increaseManualResearchBonus?: number;
  increaseFactoryRawMaterialsCap?: number;
  factoryWorkerEnergyRegenModifier?: number;
  unlocksSetAllForLine?: string;
}

export interface ResearchItemConfig {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  costRP: number;
  costMoney?: number;
  dependencies?: string[];
  effects: ResearchItemEffects;
}

export interface FactoryProductionProgressData {
  remainingSeconds: number;
  totalSeconds: number;
}

export interface QuarryUpgrade {
  id: string;
  name: string;
  description: string;
  cost: number; // Cost in Minerals
  icon?: LucideIcon;
  effects: {
    digPower?: number;
    automationRate?: number;
    increaseMaxEnergy?: number;
    mineralBonus?: number;
  };
}

export type ArtifactFindChances = Record<ArtifactRarity, number>;

export type QuarryChoice = {
  name: string;
  depth: number;
  cost: number;
  rarityBias: ArtifactRarity;
  description: string;
};

export interface ToastSettings {
  showAutoBuyUpgrades: boolean;
  showManualPurchases: boolean;
  showStockTrades: boolean;
  showPrestige: boolean;
  showFactory: boolean;
  showQuarry: boolean;
}

export interface PlayerStats {
  money: number;
  totalIncomePerSecond: number;
  investmentsValue: number;
  stockHoldings: StockHolding[];
  etfHoldings: EtfHolding[];
  prestigePoints: number;
  timesPrestiged: number;
  unlockedSkillIds: string[];
  purchasedStockUpgradeIds: string[];
  hqUpgradeLevels: Record<string, number>;
  achievedBusinessMilestones?: Record<string, {
    maxLevelReached?: boolean;
    purchasedUpgradeIds?: string[];
  }>;
  unlockedArtifactIds?: string[];

  // Factory Stats
  factoryPurchased: boolean;
  factoryPowerUnitsGenerated: number;
  factoryPowerConsumptionKw: number;
  factoryRawMaterials: number;
  factoryRawMaterialsCap: number;
  factoryMachines: FactoryMachine[];
  factoryProductionLines: FactoryProductionLine[];
  factoryPowerBuildings: FactoryPowerBuilding[];
  factoryProducedComponents: Record<string, number>;
  factoryMaterialCollectors: FactoryMaterialCollector[];
  factoryProductionProgress?: Record<string, FactoryProductionProgressData>;
  factoryWorkers: Worker[];
  currentWorkerEnergyTier: number;
  manualResearchBonus?: number;
  unlockedFactoryComponentRecipeIds?: string[];
  factoryWorkerEnergyRegenModifier?: number;
  
  // Quarry Stats
  minerals: number;
  quarryDepth: number;
  quarryTargetDepth: number;
  quarryLevel: number;
  purchasedQuarryUpgradeIds: string[];
  quarryEnergy: number;
  maxQuarryEnergy: number;
  lastDigTimestamp: number;
  quarryRarityBias: ArtifactRarity | null;
  quarryName: string;

  // App Settings
  toastSettings?: ToastSettings;
  
  // Lifetime Stats
  timePlayedSeconds?: number;
  totalMoneyEarned?: number;
  totalBusinessLevelsPurchased?: number;
  totalDividendsEarned?: number;
  totalMineralsDug?: number;
  totalFactoryComponentsProduced?: number;
}

export interface SaveData {
  playerStats: PlayerStats;
  businesses: Business[];
  stocks: Stock[]; // Save stock prices
  lastSaved: number;
}

export type RiskTolerance = "low" | "medium" | "high";

export interface BusinessSynergy {
  businessId: string;
  perLevels: number; // e.g., for every 100 levels
  effect: {
    type: 'STOCK_PRICE_BOOST' | 'ETF_DIVIDEND_BOOST';
    targetId: string; // Stock or ETF ID
    value: number; // The percentage boost (e.g., 0.5 for 0.5%)
  };
}

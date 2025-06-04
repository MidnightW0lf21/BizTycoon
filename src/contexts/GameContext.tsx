
"use client";

import type { Business, PlayerStats, Stock, StockHolding, SkillNode, SaveData, HQUpgrade } from '@/types';
import {
  INITIAL_BUSINESSES,
  INITIAL_MONEY,
  calculateIncome,
  INITIAL_STOCKS,
  INITIAL_PRESTIGE_POINTS,
  INITIAL_TIMES_PRESTIGED,
  INITIAL_SKILL_TREE,
  INITIAL_UNLOCKED_SKILL_IDS,
  INITIAL_HQ_UPGRADE_LEVELS,
  INITIAL_HQ_UPGRADES,
  getStartingMoneyBonus,
  getPrestigePointBoostPercent,
  calculateDiminishingPrestigePoints,
  calculateCostForNLevels,
  calculateMaxAffordableLevels,
  calculateSingleLevelUpgradeCost,
  MAX_BUSINESS_LEVEL,
} from '@/config/game-config';
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useMemo } from 'react';
import { useToast } from "@/hooks/use-toast";

const SAVE_DATA_KEY = 'bizTycoonSaveData_v1';
const AUTO_SAVE_INTERVAL = 30000; 
const STOCK_PRICE_UPDATE_INTERVAL = 150000; // 2.5 minutes

interface GameContextType {
  playerStats: PlayerStats;
  businesses: Business[];
  stocks: Stock[]; // This will be the dynamically priced, unlocked stocks
  skillTree: SkillNode[];
  hqUpgrades: HQUpgrade[];
  lastSavedTimestamp: number | null;
  lastMarketTrends: string;
  setLastMarketTrends: (trends: string) => void;
  lastRiskTolerance: "low" | "medium" | "high";
  setLastRiskTolerance: (tolerance: "low" | "medium" | "high") => void;
  upgradeBusiness: (businessId: string, levelsToBuy?: number) => void;
  purchaseBusinessUpgrade: (businessId: string, upgradeId: string, isAutoBuy?: boolean) => boolean;
  purchaseHQUpgrade: (upgradeId: string) => void;
  getBusinessIncome: (businessId: string) => number;
  getBusinessUpgradeCost: (businessId: string) => number; 
  buyStock: (stockId: string, sharesToBuy: number) => void;
  sellStock: (stockId: string, sharesToSell: number) => void;
  performPrestige: () => void;
  unlockSkillNode: (skillId: string) => void;
  getDynamicMaxBusinessLevel: () => number;
  calculateCostForNLevelsForDisplay: (businessId: string, levelsToBuy: number) => { totalCost: number; levelsPurchasable: number };
  calculateMaxAffordableLevelsForDisplay: (businessId: string) => { levelsToBuy: number; totalCost: number };
  manualSaveGame: () => void;
  exportGameState: () => string;
  importGameState: (jsonString: string) => boolean;
  wipeGameData: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const getInitialPlayerStats = (): PlayerStats => {
  const startingMoneyBonus = getStartingMoneyBonus(INITIAL_UNLOCKED_SKILL_IDS, INITIAL_SKILL_TREE, INITIAL_HQ_UPGRADE_LEVELS, INITIAL_HQ_UPGRADES);
  return {
    money: INITIAL_MONEY + startingMoneyBonus,
    totalIncomePerSecond: 0,
    investmentsValue: 0,
    stockHoldings: [],
    prestigePoints: INITIAL_PRESTIGE_POINTS,
    timesPrestiged: INITIAL_TIMES_PRESTIGED,
    unlockedSkillIds: [...INITIAL_UNLOCKED_SKILL_IDS],
    hqUpgradeLevels: { ...INITIAL_HQ_UPGRADE_LEVELS },
    achievedBusinessMilestones: {},
  };
};

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();

  const [skillTreeState] = useState<SkillNode[]>(INITIAL_SKILL_TREE);
  const [hqUpgradesState] = useState<HQUpgrade[]>(INITIAL_HQ_UPGRADES);
  const [lastSavedTimestamp, setLastSavedTimestamp] = useState<number | null>(null);
  const [playerStats, setPlayerStats] = useState<PlayerStats>(getInitialPlayerStats());

  const [businesses, setBusinesses] = useState<Business[]>(() =>
    INITIAL_BUSINESSES.map(biz => ({
      ...biz,
      level: 0,
      managerOwned: false,
      upgrades: biz.upgrades ? biz.upgrades.map(upg => ({ ...upg, isPurchased: false })) : [],
      icon: biz.icon,
    }))
  );

  // Holds ALL stocks with their CURRENT DYNAMIC prices. Initialized with base prices.
  const [stocksWithDynamicPrices, setStocksWithDynamicPrices] = useState<Stock[]>(() =>
    INITIAL_STOCKS.map(s => ({ ...s })) // Create a mutable copy with initial prices
  );

  const [lastMarketTrends, setLastMarketTrendsInternal] = useState<string>("Tech stocks are performing well, while energy sectors are seeing a slight downturn.");
  const [lastRiskTolerance, setLastRiskToleranceInternal] = useState<"low" | "medium" | "high">("medium");


  const setLastMarketTrends = (trends: string) => {
    setLastMarketTrendsInternal(trends);
  };

  const setLastRiskTolerance = (tolerance: "low" | "medium" | "high") => {
    setLastRiskToleranceInternal(tolerance);
  };

  // Effect for dynamic stock price updates
  useEffect(() => {
    const stockUpdateInterval = setInterval(() => {
      setStocksWithDynamicPrices(prevStocks =>
        prevStocks.map(currentStock => {
          const initialStockData = INITIAL_STOCKS.find(is => is.id === currentStock.id);
          if (!initialStockData) return currentStock; // Should ideally not happen

          const basePrice = initialStockData.price; // Base price from initial config
          const percentageChange = Math.random() * 0.8 - 0.3; // Random factor between -0.3 (-30%) and +0.5 (+50%)
          let newPrice = basePrice * (1 + percentageChange);
          newPrice = Math.max(1, Math.floor(newPrice)); // Ensure price is at least $1 and an integer

          return { ...currentStock, price: newPrice };
        })
      );
    }, STOCK_PRICE_UPDATE_INTERVAL);

    return () => clearInterval(stockUpdateInterval);
  }, []); // Runs once on mount


  // Memoized list of stocks accessible to the player, with their current dynamic prices
  const unlockedStocks = useMemo(() => {
    return stocksWithDynamicPrices.filter(currentDynamicStock => {
      // Find the corresponding initial stock data to check for unlock requirements
      const initialStockData = INITIAL_STOCKS.find(is => is.id === currentDynamicStock.id);
      if (!initialStockData) return false; // Should not happen if lists are in sync

      if (!initialStockData.requiredSkillToUnlock) return true; // No skill required
      return playerStats.unlockedSkillIds.includes(initialStockData.requiredSkillToUnlock);
    });
  }, [stocksWithDynamicPrices, playerStats.unlockedSkillIds]);


  const saveStateToLocalStorage = useCallback(() => {
    try {
      const currentTimestamp = Date.now();
      const saveData: SaveData = {
        playerStats,
        businesses,
        lastSaved: currentTimestamp,
        // Dynamic stock prices are NOT saved; they reset to base on load.
      };
      localStorage.setItem(SAVE_DATA_KEY, JSON.stringify(saveData));
      setLastSavedTimestamp(currentTimestamp);
    } catch (error) {
      console.error("Error saving game state:", error);
      toast({
        title: "Save Error",
        description: "Could not save game data to local storage.",
        variant: "destructive",
      });
    }
  }, [playerStats, businesses, toast]);

  const manualSaveGame = () => {
    saveStateToLocalStorage();
    toast({
      title: "Game Saved!",
      description: "Your progress has been saved.",
    });
  };

  const exportGameState = (): string => {
    const currentTimestamp = Date.now();
     const saveData: SaveData = {
        playerStats,
        businesses,
        lastSaved: currentTimestamp,
      };
    return JSON.stringify(saveData, null, 2);
  };

  const importGameState = (jsonString: string): boolean => {
    try {
      const importedData: SaveData = JSON.parse(jsonString);
      if (!importedData.playerStats || !importedData.businesses) {
        throw new Error("Invalid save data structure.");
      }

      setPlayerStats(prev => ({
         ...getInitialPlayerStats(), 
         ...importedData.playerStats, 
         unlockedSkillIds: Array.isArray(importedData.playerStats.unlockedSkillIds) ? importedData.playerStats.unlockedSkillIds : INITIAL_UNLOCKED_SKILL_IDS,
         hqUpgradeLevels: typeof importedData.playerStats.hqUpgradeLevels === 'object' && importedData.playerStats.hqUpgradeLevels !== null ? importedData.playerStats.hqUpgradeLevels : INITIAL_HQ_UPGRADE_LEVELS,
         stockHoldings: Array.isArray(importedData.playerStats.stockHoldings) ? importedData.playerStats.stockHoldings : [],
         achievedBusinessMilestones: typeof importedData.playerStats.achievedBusinessMilestones === 'object' && importedData.playerStats.achievedBusinessMilestones !== null ? importedData.playerStats.achievedBusinessMilestones : {},
      }));

      setBusinesses(INITIAL_BUSINESSES.map(initialBiz => {
        const savedBusiness = importedData.businesses.find(b => b.id === initialBiz.id);
        return {
          ...initialBiz, 
          level: savedBusiness ? savedBusiness.level : 0,
          managerOwned: savedBusiness ? savedBusiness.managerOwned : false,
          upgrades: initialBiz.upgrades?.map(initialUpg => {
            const savedUpg = savedBusiness?.upgrades?.find(su => su.id === initialUpg.id);
            return { ...initialUpg, isPurchased: savedUpg ? savedUpg.isPurchased : false };
          }) || [],
          icon: initialBiz.icon,
        };
      }));
      setLastSavedTimestamp(importedData.lastSaved || Date.now());
      // Reset stock prices to base on import; they will start fluctuating again via the interval.
      setStocksWithDynamicPrices(INITIAL_STOCKS.map(s => ({ ...s })));

      toast({
        title: "Game Loaded Successfully!",
        description: "Your game state has been imported.",
      });
      return true;
    } catch (error) {
      console.error("Error importing game state:", error);
      toast({
        title: "Import Error",
        description: `Failed to import save data. ${error instanceof Error ? error.message : 'Unknown error.'}`,
        variant: "destructive",
      });
      return false;
    }
  };

  const wipeGameData = () => {
    setPlayerStats(getInitialPlayerStats());
    setBusinesses(INITIAL_BUSINESSES.map(biz => ({
      ...biz,
      level: 0,
      managerOwned: false,
      upgrades: biz.upgrades ? biz.upgrades.map(upg => ({ ...upg, isPurchased: false })) : [],
      icon: biz.icon,
    })));
    // Reset stock prices to base on wipe
    setStocksWithDynamicPrices(INITIAL_STOCKS.map(s => ({ ...s })));
    localStorage.removeItem(SAVE_DATA_KEY);
    setLastSavedTimestamp(null);
    toast({
      title: "Game Data Wiped",
      description: "All progress has been reset to default.",
      variant: "destructive",
    });
  };


  useEffect(() => {
    try {
      const savedDataString = localStorage.getItem(SAVE_DATA_KEY);
      if (savedDataString) {
        const loadedData: SaveData = JSON.parse(savedDataString);
        setPlayerStats(prev => ({
          ...getInitialPlayerStats(),
          ...loadedData.playerStats,
          unlockedSkillIds: Array.isArray(loadedData.playerStats.unlockedSkillIds) ? loadedData.playerStats.unlockedSkillIds : INITIAL_UNLOCKED_SKILL_IDS,
          hqUpgradeLevels: typeof loadedData.playerStats.hqUpgradeLevels === 'object' && loadedData.playerStats.hqUpgradeLevels !== null ? loadedData.playerStats.hqUpgradeLevels : INITIAL_HQ_UPGRADE_LEVELS,
          stockHoldings: Array.isArray(loadedData.playerStats.stockHoldings) ? loadedData.playerStats.stockHoldings : [],
          achievedBusinessMilestones: typeof loadedData.playerStats.achievedBusinessMilestones === 'object' && loadedData.playerStats.achievedBusinessMilestones !== null ? loadedData.playerStats.achievedBusinessMilestones : {},
        }));
        setBusinesses(() => {
          return INITIAL_BUSINESSES.map(initialBiz => {
            const savedBusinessState = loadedData.businesses.find(b => b.id === initialBiz.id);
            return {
                ...initialBiz, 
                level: savedBusinessState ? savedBusinessState.level : 0,
                managerOwned: savedBusinessState ? savedBusinessState.managerOwned : false,
                upgrades: initialBiz.upgrades?.map(initialUpg => {
                  const savedUpgData = savedBusinessState?.upgrades?.find(su => su.id === initialUpg.id);
                  return { ...initialUpg, isPurchased: savedUpgData ? savedUpgData.isPurchased : false };
                }) || [],
                icon: initialBiz.icon, 
              };
          });
        });
        setLastSavedTimestamp(loadedData.lastSaved || Date.now());
        // Stock prices are not saved, so they initialize from INITIAL_STOCKS via stocksWithDynamicPrices state
      } else {
        setPlayerStats(getInitialPlayerStats());
        // stocksWithDynamicPrices is already initialized from INITIAL_STOCKS
      }
    } catch (error) {
      console.error("Error loading game state from local storage:", error);
      localStorage.removeItem(SAVE_DATA_KEY);
      toast({ title: "Load Error", description: "Could not load previous save. Starting a new game.", variant: "destructive"});
      setPlayerStats(getInitialPlayerStats());
      // stocksWithDynamicPrices is already initialized from INITIAL_STOCKS
    }
  }, [toast]);


  useEffect(() => {
    const intervalId = setInterval(() => {
      saveStateToLocalStorage();
    }, AUTO_SAVE_INTERVAL);
    return () => clearInterval(intervalId);
  }, [saveStateToLocalStorage]);

  const getDynamicMaxBusinessLevel = useCallback((): number => {
    let currentMaxLevel = MAX_BUSINESS_LEVEL; 
    playerStats.unlockedSkillIds.forEach(skillId => {
        const skill = skillTreeState.find(s => s.id === skillId);
        if (skill && skill.effects.increaseMaxBusinessLevelBy) {
            currentMaxLevel += skill.effects.increaseMaxBusinessLevelBy;
        }
    });
    return currentMaxLevel;
  }, [playerStats.unlockedSkillIds, skillTreeState]);


  const getBusinessIncome = useCallback((businessId: string): number => {
    const business = businesses.find(b => b.id === businessId);
    return business ? calculateIncome(business, playerStats.unlockedSkillIds, skillTreeState, playerStats.hqUpgradeLevels, hqUpgradesState) : 0;
  }, [businesses, playerStats.unlockedSkillIds, skillTreeState, playerStats.hqUpgradeLevels, hqUpgradesState]);


  const getBusinessUpgradeCost = useCallback((businessId: string): number => {
    const business = businesses.find(b => b.id === businessId);
    if (!business) return 0;
    const currentDynamicMaxLevel = getDynamicMaxBusinessLevel();
    if (business.level >= currentDynamicMaxLevel) return Infinity;

     return calculateSingleLevelUpgradeCost(
        business.level,
        business.baseCost,
        business.upgradeCostMultiplier,
        business.upgrades,
        playerStats.unlockedSkillIds,
        skillTreeState,
        business.id,
        playerStats.hqUpgradeLevels,
        hqUpgradesState
    );
  }, [businesses, playerStats.unlockedSkillIds, skillTreeState, playerStats.hqUpgradeLevels, hqUpgradesState, getDynamicMaxBusinessLevel]);


  const calculateCostForNLevelsForDisplay = useCallback((businessId: string, levelsToBuy: number) => {
    const business = businesses.find(b => b.id === businessId);
    if (!business) return { totalCost: Infinity, levelsPurchasable: 0 };
    const dynamicMax = getDynamicMaxBusinessLevel();
    return calculateCostForNLevels(business, levelsToBuy, playerStats.unlockedSkillIds, skillTreeState, dynamicMax, playerStats.hqUpgradeLevels, hqUpgradesState);
  }, [businesses, playerStats.unlockedSkillIds, skillTreeState, playerStats.hqUpgradeLevels, hqUpgradesState, getDynamicMaxBusinessLevel]);

  const calculateMaxAffordableLevelsForDisplay = useCallback((businessId: string) => {
    const business = businesses.find(b => b.id === businessId);
    if (!business) return { levelsToBuy: 0, totalCost: 0 };
    const dynamicMax = getDynamicMaxBusinessLevel();
    return calculateMaxAffordableLevels(business, playerStats.money, playerStats.unlockedSkillIds, skillTreeState, dynamicMax, playerStats.hqUpgradeLevels, hqUpgradesState);
  }, [businesses, playerStats.money, playerStats.unlockedSkillIds, skillTreeState, playerStats.hqUpgradeLevels, hqUpgradesState, getDynamicMaxBusinessLevel]);


  useEffect(() => {
    const totalBusinessIncome = businesses.reduce((sum, biz) => sum + getBusinessIncome(biz.id), 0);

    let dividendIncome = 0;
    let globalDividendBoost = 0;
    playerStats.unlockedSkillIds.forEach(skillId => {
      const skill = skillTreeState.find(s => s.id === skillId);
      if (skill && skill.effects && skill.effects.globalDividendYieldBoostPercent) {
        globalDividendBoost += skill.effects.globalDividendYieldBoostPercent;
      }
    });
    
    for (const hqId in playerStats.hqUpgradeLevels) {
        const purchasedLevel = playerStats.hqUpgradeLevels[hqId];
        if (purchasedLevel > 0) {
            const hqUpgrade = hqUpgradesState.find(h => h.id === hqId);
            if (hqUpgrade && hqUpgrade.levels) {
                const levelData = hqUpgrade.levels.find(l => l.level === purchasedLevel);
                if (levelData && levelData.effects.globalDividendYieldBoostPercent) {
                    globalDividendBoost += levelData.effects.globalDividendYieldBoostPercent;
                }
            }
        }
    }


    for (const holding of playerStats.stockHoldings) {
      // Use `unlockedStocks` here as it contains stocks with their current dynamic prices
      const stockDetails = unlockedStocks.find(s => s.id === holding.stockId);
      if (stockDetails) {
        let currentDividendYield = stockDetails.dividendYield; // Base yield from definition
        const initialStockInfo = INITIAL_STOCKS.find(is => is.id === holding.stockId);
        if(initialStockInfo) { // Ensure we have base yield
            currentDividendYield = initialStockInfo.dividendYield;
        }
        currentDividendYield *= (1 + globalDividendBoost / 100);
        dividendIncome += holding.shares * stockDetails.price * currentDividendYield; // stockDetails.price is dynamic
      }
    }
    setPlayerStats(prev => ({ ...prev, totalIncomePerSecond: totalBusinessIncome + dividendIncome }));
  }, [businesses, getBusinessIncome, playerStats.stockHoldings, playerStats.unlockedSkillIds, skillTreeState, playerStats.hqUpgradeLevels, hqUpgradesState, unlockedStocks]);

  const purchaseBusinessUpgrade = useCallback((businessId: string, upgradeId: string, isAutoBuy: boolean = false): boolean => {
    const businessToUpdate = businesses.find(b => b.id === businessId);
    if (!businessToUpdate || !businessToUpdate.upgrades) return false;

    const businessIndexInConfig = INITIAL_BUSINESSES.findIndex(b => b.id === businessId);
    if (playerStats.timesPrestiged < businessIndexInConfig && !isAutoBuy) {
      toast({ title: "Locked", description: `This business unlocks after ${businessIndexInConfig} prestige(s).`, variant: "destructive"});
      return false;
    }

    const upgrade = businessToUpdate.upgrades.find(u => u.id === upgradeId);
    if (!upgrade) return false;

    if (upgrade.isPurchased) {
      if (!isAutoBuy) toast({ title: "Already Owned", description: "You already own this upgrade.", variant: "default" });
      return false;
    }
    if (businessToUpdate.level < upgrade.requiredLevel) {
      if (!isAutoBuy) toast({ title: "Level Requirement Not Met", description: `${businessToUpdate.name} must be level ${upgrade.requiredLevel} for this upgrade.`, variant: "destructive" });
      return false;
    }

    let actualCost = upgrade.cost;
    let globalUpgradeCostReduction = 0;
    playerStats.unlockedSkillIds.forEach(skillId => {
        const skill = skillTreeState.find(s => s.id === skillId);
        if (skill && skill.effects && skill.effects.globalBusinessUpgradeCostReductionPercent) {
            globalUpgradeCostReduction += skill.effects.globalBusinessUpgradeCostReductionPercent;
        }
    });
    if (globalUpgradeCostReduction > 0) {
        actualCost *= (1 - globalUpgradeCostReduction / 100);
        actualCost = Math.max(0, Math.floor(actualCost));
    }

    if (playerStats.money < actualCost) {
      if (!isAutoBuy) toast({ title: "Not Enough Money", description: `You need $${Number(actualCost).toLocaleString('en-US', { maximumFractionDigits: 0 })} to purchase ${upgrade.name}.`, variant: "destructive" });
      return false;
    }

    setPlayerStats(prev => {
        const existingMilestonesForBusiness = prev.achievedBusinessMilestones?.[businessId] || {};
        const existingPurchasedUpgrades = existingMilestonesForBusiness.purchasedUpgradeIds || [];
        let updatedPurchasedUpgrades = [...existingPurchasedUpgrades];

        if (!existingPurchasedUpgrades.includes(upgradeId)) {
            updatedPurchasedUpgrades.push(upgradeId);
        }
        return {
            ...prev,
            money: prev.money - actualCost,
            achievedBusinessMilestones: {
                ...prev.achievedBusinessMilestones,
                [businessId]: {
                    ...existingMilestonesForBusiness,
                    purchasedUpgradeIds: updatedPurchasedUpgrades,
                },
            },
        };
    });

    setBusinesses(prevBusinesses =>
      prevBusinesses.map(b =>
        b.id === businessId
          ? { ...b, upgrades: b.upgrades?.map(u => u.id === upgradeId ? { ...u, isPurchased: true } : u) }
          : b
      )
    );
    if (!isAutoBuy) {
      toast({ title: "Upgrade Purchased!", description: `${upgrade.name} for ${businessToUpdate.name} is now active.` });
    } else {
       toast({ title: "Auto-Upgrade!", description: `${upgrade.name} for ${businessToUpdate.name}`, duration: 1500 });
    }
    return true;
  }, [businesses, playerStats.money, playerStats.timesPrestiged, playerStats.unlockedSkillIds, skillTreeState, playerStats.achievedBusinessMilestones, toast]);


  useEffect(() => {
    const gameLoop = setInterval(() => {
      setPlayerStats(prev => {
        const newMoney = prev.money + prev.totalIncomePerSecond;
        let currentInvestmentsValue = 0;
        for (const holding of prev.stockHoldings) {
          const stockDetails = unlockedStocks.find(s => s.id === holding.stockId); // unlockedStocks has dynamic prices
          if (stockDetails) {
            currentInvestmentsValue += holding.shares * stockDetails.price;
          }
        }
        return { ...prev, money: newMoney, investmentsValue: currentInvestmentsValue };
      });
    }, 1000);
    return () => clearInterval(gameLoop);
  }, [playerStats.totalIncomePerSecond, unlockedStocks]); // Add unlockedStocks dependency


  useEffect(() => {
    let purchasedInThisTick = false;
    let currentMoneySnapshot = playerStats.money;
    
    const updatedBusinesses = businesses.map(business => {
        let businessChanged = false;
        const skillIdToCheck = `auto_buy_upgrades_${business.id}`;

        if (playerStats.unlockedSkillIds.includes(skillIdToCheck) && business.upgrades) {
            const updatedUpgrades = business.upgrades.map(upgrade => {
                if (!upgrade.isPurchased && business.level >= upgrade.requiredLevel) {
                    let actualCost = upgrade.cost;
                    let globalUpgradeCostReduction = 0;
                    playerStats.unlockedSkillIds.forEach(sId => {
                        const sk = skillTreeState.find(s => s.id === sId);
                        if (sk && sk.effects && sk.effects.globalBusinessUpgradeCostReductionPercent) {
                            globalUpgradeCostReduction += sk.effects.globalBusinessUpgradeCostReductionPercent;
                        }
                    });
                    if (globalUpgradeCostReduction > 0) {
                        actualCost *= (1 - globalUpgradeCostReduction / 100);
                        actualCost = Math.max(0, Math.floor(actualCost));
                    }

                    if (currentMoneySnapshot >= actualCost) {
                        currentMoneySnapshot -= actualCost;
                        purchasedInThisTick = true;
                        businessChanged = true;
                        setPlayerStats(prev => {
                            const existingMilestonesForBusiness = prev.achievedBusinessMilestones?.[business.id] || {};
                            const existingPurchasedUpgrades = existingMilestonesForBusiness.purchasedUpgradeIds || [];
                            let updatedPurchasedUpgradesForAuto = [...existingPurchasedUpgrades];
                    
                            if (!existingPurchasedUpgrades.includes(upgrade.id)) {
                                updatedPurchasedUpgradesForAuto.push(upgrade.id);
                                toast({ title: "Auto-Upgrade!", description: `${upgrade.name} for ${business.name}`, duration: 1500 });
                            }
                            return {
                                ...prev,
                                achievedBusinessMilestones: {
                                    ...prev.achievedBusinessMilestones,
                                    [business.id]: {
                                        ...existingMilestonesForBusiness,
                                        purchasedUpgradeIds: updatedPurchasedUpgradesForAuto,
                                    },
                                },
                            };
                        });
                        return { ...upgrade, isPurchased: true };
                    }
                }
                return upgrade;
            });
            if (businessChanged) {
                return { ...business, upgrades: updatedUpgrades };
            }
        }
        return business;
    });


    if (purchasedInThisTick) {
      setPlayerStats(prev => ({ ...prev, money: currentMoneySnapshot }));
      setBusinesses(updatedBusinesses);
    }
  }, [playerStats.money, playerStats.unlockedSkillIds, businesses, skillTreeState, toast]);


  const upgradeBusiness = (businessId: string, levelsToAttempt: number = 1) => {
    const businessToUpdate = businesses.find(b => b.id === businessId);
    if (!businessToUpdate) return;

    const businessIndexInConfig = INITIAL_BUSINESSES.findIndex(b => b.id === businessId);
    if (playerStats.timesPrestiged < businessIndexInConfig) {
       toast({ title: "Locked", description: `This business unlocks after prestiging ${businessIndexInConfig} time(s). (Currently: ${playerStats.timesPrestiged})`, variant: "destructive"});
       return;
    }

    const currentDynamicMaxLevel = getDynamicMaxBusinessLevel();
    if (businessToUpdate.level >= currentDynamicMaxLevel) {
      toast({ title: "Max Level Reached!", description: `${businessToUpdate.name} is already at the maximum level (${currentDynamicMaxLevel}).`, variant: "default" });
      return;
    }

    const { totalCost, levelsPurchasable } = calculateCostForNLevels(
        businessToUpdate,
        levelsToAttempt,
        playerStats.unlockedSkillIds,
        skillTreeState,
        currentDynamicMaxLevel,
        playerStats.hqUpgradeLevels,
        hqUpgradesState
    );

    if (levelsPurchasable === 0) {
        toast({ title: "Cannot level up", description: `${businessToUpdate.name} is at max level or no levels can be purchased.`, variant: "default" });
        return;
    }

    if (playerStats.money < totalCost) {
      toast({ title: "Not enough money!", description: `You need $${Number(totalCost).toLocaleString('en-US', { maximumFractionDigits: 0 })} to level up ${businessToUpdate.name} by ${levelsPurchasable} level(s).`, variant: "destructive" });
      return;
    }
    
    const newLevelAfterUpgrade = businessToUpdate.level + levelsPurchasable;

    setPlayerStats(prev => {
        let newAchievedMilestones = { ...(prev.achievedBusinessMilestones || {}) };
        if (newLevelAfterUpgrade >= currentDynamicMaxLevel && !(newAchievedMilestones[businessId]?.maxLevelReached)) {
            newAchievedMilestones[businessId] = {
                ...(newAchievedMilestones[businessId] || {}),
                maxLevelReached: true,
            };
        }
        return { 
            ...prev, 
            money: prev.money - totalCost,
            achievedBusinessMilestones: newAchievedMilestones,
        };
    });

    setBusinesses(prevBusinesses =>
      prevBusinesses.map(b =>
        b.id === businessId ? { ...b, level: newLevelAfterUpgrade } : b
      )
    );
    toast({ title: "Business Leveled Up!", description: `${businessToUpdate.name} is now level ${newLevelAfterUpgrade} (+${levelsPurchasable}).` });
  };


  const buyStock = (stockId: string, sharesToBuyInput: number) => {
    if (playerStats.timesPrestiged < 2) {
        toast({ title: "Stocks Locked", description: "You need to prestige at least 2 times to access the stock market.", variant: "destructive" });
        return;
    }
    if (sharesToBuyInput <= 0) {
      toast({ title: "Invalid Amount", description: "Number of shares must be positive.", variant: "destructive" });
      return;
    }
    const stock = unlockedStocks.find(s => s.id === stockId); // Use unlockedStocks which has dynamic prices
    if (!stock) {
      toast({ title: "Stock Not Found", description: "This stock is not available or does not exist.", variant: "destructive" });
      return;
    }

    const initialStockData = INITIAL_STOCKS.find(is => is.id === stockId);
    if (!initialStockData) return; // Should not happen

    const existingHolding = playerStats.stockHoldings.find(h => h.stockId === stockId);
    const sharesAlreadyOwnedByPlayer = existingHolding?.shares || 0;
    const sharesAvailableToBuy = initialStockData.totalOutstandingShares - sharesAlreadyOwnedByPlayer;

    if (sharesAvailableToBuy <= 0) {
      toast({ title: "No Shares Available", description: `All outstanding shares of ${stock.companyName} (${stock.ticker}) are accounted for.`, variant: "default" });
      return;
    }
    let sharesToBuy = sharesToBuyInput;
    if (sharesToBuyInput > sharesAvailableToBuy) {
      toast({ title: "Purchase Adjusted", description: `Only ${sharesAvailableToBuy.toLocaleString('en-US')} shares available. Purchase adjusted.`, variant: "default" });
      sharesToBuy = sharesAvailableToBuy;
    }
    if (sharesToBuy <= 0) {
        toast({ title: "No Shares to Buy", description: `No shares of ${stock.companyName} (${stock.ticker}) could be purchased.`, variant: "destructive" });
        return;
    }
    const cost = stock.price * sharesToBuy; // Use dynamic price from `stock` (which is from unlockedStocks)
    if (playerStats.money < cost) {
      toast({ title: "Not Enough Money", description: `You need $${Number(cost).toLocaleString('en-US', { maximumFractionDigits: 0 })} to buy ${sharesToBuy.toLocaleString('en-US')} share(s).`, variant: "destructive" });
      return;
    }
    setPlayerStats(prev => {
      const newHoldings = prev.stockHoldings.find(h => h.stockId === stockId)
        ? prev.stockHoldings.map(h => h.stockId === stockId ? { ...h, shares: h.shares + sharesToBuy, averagePurchasePrice: ((h.averagePurchasePrice * h.shares) + (stock.price * sharesToBuy)) / (h.shares + sharesToBuy) } : h)
        : [...prev.stockHoldings, { stockId, shares: sharesToBuy, averagePurchasePrice: stock.price }];
      return { ...prev, money: prev.money - cost, stockHoldings: newHoldings };
    });
    toast({ title: "Stock Purchased!", description: `Bought ${sharesToBuy.toLocaleString('en-US')} share(s) of ${stock.companyName}.` });
  };

  const sellStock = (stockId: string, sharesToSell: number) => {
     if (playerStats.timesPrestiged < 2) {
        toast({ title: "Stocks Locked", description: "You need to prestige at least 2 times to access the stock market.", variant: "destructive" });
        return;
    }
    if (sharesToSell <= 0) {
      toast({ title: "Invalid Amount", description: "Number of shares must be positive.", variant: "destructive" });
      return;
    }
    const stock = unlockedStocks.find(s => s.id === stockId); // Use unlockedStocks which has dynamic prices
    if (!stock) {
      toast({ title: "Stock Not Found", variant: "destructive" });
      return;
    }
    const existingHolding = playerStats.stockHoldings.find(h => h.stockId === stockId);
    if (!existingHolding || existingHolding.shares < sharesToSell) {
      toast({ title: "Not Enough Shares", description: `You only own ${existingHolding?.shares || 0} share(s).`, variant: "destructive" });
      return;
    }
    const earnings = stock.price * sharesToSell; // Use dynamic price from `stock`
    setPlayerStats(prev => {
      const newHoldings = existingHolding.shares === sharesToSell
        ? prev.stockHoldings.filter(h => h.stockId !== stockId)
        : prev.stockHoldings.map(h => h.stockId === stockId ? { ...h, shares: h.shares - sharesToSell } : h);
      return { ...prev, money: prev.money + earnings, stockHoldings: newHoldings };
    });
    toast({ title: "Stock Sold!", description: `Sold ${sharesToSell.toLocaleString('en-US')} share(s) of ${stock.companyName}.` });
  };

  const performPrestige = useCallback(() => {
    const moneyRequiredForFirstPrestige = 100000;
    if (playerStats.money < moneyRequiredForFirstPrestige && playerStats.timesPrestiged === 0) {
      toast({ title: "Not Enough Money", description: `Need $${Number(moneyRequiredForFirstPrestige).toLocaleString('en-US', { maximumFractionDigits: 0 })} to prestige for the first time.`, variant: "destructive" });
      return;
    }

    const totalLevels = businesses.reduce((sum, b) => sum + b.level, 0);
    let basePointsFromLevels = calculateDiminishingPrestigePoints(totalLevels);

    const prestigePointBoost = getPrestigePointBoostPercent(playerStats.unlockedSkillIds, skillTreeState, playerStats.hqUpgradeLevels, hqUpgradesState);
    const actualNewPrestigePoints = Math.floor(Math.max(0, basePointsFromLevels - playerStats.prestigePoints) * (1 + prestigePointBoost / 100));

    let moneyAfterPrestige = INITIAL_MONEY;
    const startingMoneyBonus = getStartingMoneyBonus(playerStats.unlockedSkillIds, skillTreeState, playerStats.hqUpgradeLevels, hqUpgradesState);
    moneyAfterPrestige += startingMoneyBonus;

    const retainedBusinessLevels: Record<string, number> = {};
    const retainedStockHoldings: StockHolding[] = [];

    for (const hqUpgradeId in playerStats.hqUpgradeLevels) {
        const purchasedLevel = playerStats.hqUpgradeLevels[hqUpgradeId];
        if (purchasedLevel > 0) {
            const hqUpgradeConfig = hqUpgradesState.find(hq => hq.id === hqUpgradeId);
            if (hqUpgradeConfig && hqUpgradeConfig.levels) {
                const levelData = hqUpgradeConfig.levels.find(l => l.level === purchasedLevel);
                if (levelData && levelData.effects.retentionPercentage) {
                    const retentionPercentage = levelData.effects.retentionPercentage;
                    if (hqUpgradeId.startsWith('retain_level_')) {
                        const businessId = hqUpgradeId.replace('retain_level_', '');
                        const business = businesses.find(b => b.id === businessId);
                        if (business) {
                            retainedBusinessLevels[businessId] = Math.floor(business.level * (retentionPercentage / 100));
                        }
                    } else if (hqUpgradeId.startsWith('retain_shares_')) {
                        const stockId = hqUpgradeId.replace('retain_shares_', '');
                        const currentHolding = playerStats.stockHoldings.find(h => h.stockId === stockId);
                        if (currentHolding) {
                            const retainedShares = Math.floor(currentHolding.shares * (retentionPercentage / 100));
                            if (retainedShares > 0) {
                                retainedStockHoldings.push({ stockId, shares: retainedShares, averagePurchasePrice: currentHolding.averagePurchasePrice });
                            }
                        }
                    }
                }
            }
        }
    }
    

    setPlayerStats(prev => ({
      ...prev,
      money: moneyAfterPrestige,
      investmentsValue: 0, 
      stockHoldings: retainedStockHoldings,
      prestigePoints: prev.prestigePoints + actualNewPrestigePoints,
      timesPrestiged: prev.timesPrestiged + 1,
    }));

    setBusinesses(INITIAL_BUSINESSES.map(biz => ({
      ...biz, 
      level: retainedBusinessLevels[biz.id] || 0, 
      managerOwned: false, 
      upgrades: biz.upgrades ? biz.upgrades.map(upg => ({ ...upg, isPurchased: false })) : [],
      icon: biz.icon,
    })));
    
    // Reset stock prices to base on prestige
    setStocksWithDynamicPrices(INITIAL_STOCKS.map(s => ({ ...s })));

    toast({ title: "Prestige Successful!", description: `Earned ${actualNewPrestigePoints} prestige point(s)! Progress partially reset. Starting money now $${Number(moneyAfterPrestige).toLocaleString('en-US', { maximumFractionDigits: 0 })}.` });
  }, [playerStats, businesses, toast, skillTreeState, hqUpgradesState]);

  const unlockSkillNode = (skillId: string) => {
    const skill = skillTreeState.find(s => s.id === skillId);
    if (!skill) {
      toast({ title: "Skill Not Found", variant: "destructive" });
      return;
    }
    if (playerStats.unlockedSkillIds.includes(skillId)) {
      toast({ title: "Skill Already Unlocked", variant: "default" });
      return;
    }

    if (playerStats.prestigePoints < skill.cost) {
        toast({ title: "Not Enough Prestige Points", description: `Need ${skill.cost} PP. You have ${playerStats.prestigePoints}.`, variant: "destructive" });
        return;
    }
    if (skill.dependencies && skill.dependencies.some(depId => !playerStats.unlockedSkillIds.includes(depId))) {
        toast({ title: "Dependencies Not Met", description: "Unlock prerequisite skills first.", variant: "destructive" });
        return;
    }

    setPlayerStats(prev => ({
      ...prev,
      prestigePoints: prev.prestigePoints - skill.cost,
      unlockedSkillIds: [...prev.unlockedSkillIds, skillId],
    }));

    toast({ title: "Skill Unlocked!", description: `${skill.name} is now active.` });
  };

  const purchaseHQUpgrade = (upgradeId: string) => {
    const upgradeConfig = hqUpgradesState.find(u => u.id === upgradeId);
    if (!upgradeConfig) {
      toast({ title: "HQ Upgrade Not Found", variant: "destructive" });
      return;
    }

    const currentLevel = playerStats.hqUpgradeLevels[upgradeId] || 0;
    const nextLevel = currentLevel + 1;
    const nextLevelData = upgradeConfig.levels.find(l => l.level === nextLevel);

    if (!nextLevelData) {
      toast({ title: "Max Level Reached", description: `${upgradeConfig.name} is already at its maximum level.`, variant: "default" });
      return;
    }
    
    if (upgradeConfig.requiredTimesPrestiged && playerStats.timesPrestiged < upgradeConfig.requiredTimesPrestiged) {
      toast({ title: "Prestige Requirement Not Met", description: `This HQ upgrade requires ${upgradeConfig.requiredTimesPrestiged} prestige(s).`, variant: "destructive"});
      return;
    }

    if (playerStats.money < nextLevelData.costMoney) {
      toast({ title: "Not Enough Money", description: `Need $${Number(nextLevelData.costMoney).toLocaleString('en-US', { maximumFractionDigits: 0 })}.`, variant: "destructive"});
      return;
    }
    if (nextLevelData.costPrestigePoints && playerStats.prestigePoints < nextLevelData.costPrestigePoints) {
      toast({ title: "Not Enough Prestige Points", description: `Need ${nextLevelData.costPrestigePoints} PP.`, variant: "destructive"});
      return;
    }

    setPlayerStats(prev => ({
      ...prev,
      money: prev.money - nextLevelData.costMoney,
      prestigePoints: nextLevelData.costPrestigePoints ? prev.prestigePoints - nextLevelData.costPrestigePoints : prev.prestigePoints,
      hqUpgradeLevels: {
        ...prev.hqUpgradeLevels,
        [upgradeId]: nextLevel,
      },
    }));
    toast({ title: "HQ Upgrade Purchased!", description: `${upgradeConfig.name} upgraded to Level ${nextLevel}.` });
  };


  return (
    <GameContext.Provider value={{
      playerStats,
      businesses,
      stocks: unlockedStocks, // Provide the dynamically priced, unlocked stocks
      skillTree: skillTreeState,
      hqUpgrades: hqUpgradesState,
      lastSavedTimestamp,
      lastMarketTrends,
      setLastMarketTrends,
      lastRiskTolerance,
      setLastRiskTolerance,
      upgradeBusiness,
      purchaseBusinessUpgrade,
      purchaseHQUpgrade,
      getBusinessIncome,
      getBusinessUpgradeCost,
      buyStock,
      sellStock,
      performPrestige,
      unlockSkillNode,
      getDynamicMaxBusinessLevel,
      calculateCostForNLevelsForDisplay,
      calculateMaxAffordableLevelsForDisplay,
      manualSaveGame,
      exportGameState,
      importGameState,
      wipeGameData,
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};



"use client";

import type { Business, PlayerStats, Stock, StockHolding, SkillNode, SaveData, HQUpgrade } from '@/types';
import {
  INITIAL_BUSINESSES,
  INITIAL_MONEY,
  calculateIncome,
  MAX_BUSINESS_LEVEL,
  INITIAL_STOCKS,
  INITIAL_PRESTIGE_POINTS,
  INITIAL_TIMES_PRESTIGED,
  INITIAL_SKILL_TREE,
  INITIAL_UNLOCKED_SKILL_IDS,
  INITIAL_PURCHASED_HQ_UPGRADE_IDS, // Added
  INITIAL_HQ_UPGRADES, // Added
  getStartingMoneyBonus,
  getPrestigePointBoostPercent,
  calculateDiminishingPrestigePoints,
  calculateCostForNLevels,
  calculateMaxAffordableLevels,
  calculateSingleLevelUpgradeCost,
} from '@/config/game-config';
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";

const SAVE_DATA_KEY = 'bizTycoonSaveData_v1';
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

interface GameContextType {
  playerStats: PlayerStats;
  businesses: Business[];
  stocks: Stock[];
  skillTree: SkillNode[];
  hqUpgrades: HQUpgrade[]; // Added
  lastSavedTimestamp: number | null;
  upgradeBusiness: (businessId: string, levelsToBuy?: number) => void;
  purchaseBusinessUpgrade: (businessId: string, upgradeId: string, isAutoBuy?: boolean) => boolean;
  purchaseHQUpgrade: (upgradeId: string) => void; // Added
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
  const startingMoneyBonus = getStartingMoneyBonus(INITIAL_UNLOCKED_SKILL_IDS, INITIAL_SKILL_TREE, INITIAL_PURCHASED_HQ_UPGRADE_IDS, INITIAL_HQ_UPGRADES);
  return {
    money: INITIAL_MONEY + startingMoneyBonus,
    totalIncomePerSecond: 0,
    investmentsValue: 0,
    stockHoldings: [],
    prestigePoints: INITIAL_PRESTIGE_POINTS,
    timesPrestiged: INITIAL_TIMES_PRESTIGED,
    unlockedSkillIds: [...INITIAL_UNLOCKED_SKILL_IDS],
    purchasedHQUpgradeIds: [...INITIAL_PURCHASED_HQ_UPGRADE_IDS], // Added
  };
};

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();

  const [skillTreeState] = useState<SkillNode[]>(INITIAL_SKILL_TREE);
  const [hqUpgradesState] = useState<HQUpgrade[]>(INITIAL_HQ_UPGRADES); // Added
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

  const [unlockedStocks, setUnlockedStocks] = useState<Stock[]>([]);

  const saveStateToLocalStorage = useCallback(() => {
    try {
      const currentTimestamp = Date.now();
      const saveData: SaveData = {
        playerStats,
        businesses,
        lastSaved: currentTimestamp,
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
         ...getInitialPlayerStats(), // Start with defaults
         ...importedData.playerStats, // Override with saved stats
         // Ensure arrays are properly initialized if missing from save
         unlockedSkillIds: Array.isArray(importedData.playerStats.unlockedSkillIds) ? importedData.playerStats.unlockedSkillIds : INITIAL_UNLOCKED_SKILL_IDS,
         purchasedHQUpgradeIds: Array.isArray(importedData.playerStats.purchasedHQUpgradeIds) ? importedData.playerStats.purchasedHQUpgradeIds : INITIAL_PURCHASED_HQ_UPGRADE_IDS,
         stockHoldings: Array.isArray(importedData.playerStats.stockHoldings) ? importedData.playerStats.stockHoldings : [],
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
        };
      }));
      setLastSavedTimestamp(importedData.lastSaved || Date.now());

      saveStateToLocalStorage(); 
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
          ...getInitialPlayerStats(), // Start with defaults to ensure all fields are present
          ...loadedData.playerStats,
          unlockedSkillIds: Array.isArray(loadedData.playerStats.unlockedSkillIds) ? loadedData.playerStats.unlockedSkillIds : INITIAL_UNLOCKED_SKILL_IDS,
          purchasedHQUpgradeIds: Array.isArray(loadedData.playerStats.purchasedHQUpgradeIds) ? loadedData.playerStats.purchasedHQUpgradeIds : INITIAL_PURCHASED_HQ_UPGRADE_IDS,
          stockHoldings: Array.isArray(loadedData.playerStats.stockHoldings) ? loadedData.playerStats.stockHoldings : [],
        }));
        setBusinesses(() => {
          return INITIAL_BUSINESSES.map(initialBiz => {
            const savedBusinessState = loadedData.businesses.find(b => b.id === initialBiz.id);
            if (savedBusinessState) {
              return {
                ...initialBiz, 
                level: savedBusinessState.level,
                managerOwned: savedBusinessState.managerOwned,
                upgrades: initialBiz.upgrades?.map(initialUpg => {
                  const savedUpgData = savedBusinessState.upgrades?.find(su => su.id === initialUpg.id);
                  return { ...initialUpg, isPurchased: savedUpgData ? savedUpgData.isPurchased : false };
                }) || [],
              };
            }
            return {
              ...initialBiz,
              level: 0,
              managerOwned: false,
              upgrades: initialBiz.upgrades?.map(upg => ({ ...upg, isPurchased: false })) || [],
            };
          });
        });
        setLastSavedTimestamp(loadedData.lastSaved || Date.now());
      } else {
        setPlayerStats(getInitialPlayerStats());
      }
    } catch (error) {
      console.error("Error loading game state from local storage:", error);
      localStorage.removeItem(SAVE_DATA_KEY);
      toast({ title: "Load Error", description: "Could not load previous save. Starting a new game.", variant: "destructive"});
      setPlayerStats(getInitialPlayerStats());
    }
  }, [toast]);


  useEffect(() => {
    const intervalId = setInterval(() => {
      saveStateToLocalStorage();
    }, AUTO_SAVE_INTERVAL);
    return () => clearInterval(intervalId);
  }, [saveStateToLocalStorage]);


  useEffect(() => {
    const filteredStocks = INITIAL_STOCKS.filter(stock => {
      if (!stock.requiredSkillToUnlock) return true;
      return playerStats.unlockedSkillIds.includes(stock.requiredSkillToUnlock);
    });
    setUnlockedStocks(filteredStocks);
  }, [playerStats.unlockedSkillIds]);

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
    return business ? calculateIncome(business, playerStats.unlockedSkillIds, skillTreeState, playerStats.purchasedHQUpgradeIds, hqUpgradesState) : 0;
  }, [businesses, playerStats.unlockedSkillIds, skillTreeState, playerStats.purchasedHQUpgradeIds, hqUpgradesState]);


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
        playerStats.purchasedHQUpgradeIds,
        hqUpgradesState
    );
  }, [businesses, playerStats.unlockedSkillIds, skillTreeState, playerStats.purchasedHQUpgradeIds, hqUpgradesState, getDynamicMaxBusinessLevel]);


  const calculateCostForNLevelsForDisplay = useCallback((businessId: string, levelsToBuy: number) => {
    const business = businesses.find(b => b.id === businessId);
    if (!business) return { totalCost: Infinity, levelsPurchasable: 0 };
    const dynamicMax = getDynamicMaxBusinessLevel();
    return calculateCostForNLevels(business, levelsToBuy, playerStats.unlockedSkillIds, skillTreeState, dynamicMax, playerStats.purchasedHQUpgradeIds, hqUpgradesState);
  }, [businesses, playerStats.unlockedSkillIds, skillTreeState, playerStats.purchasedHQUpgradeIds, hqUpgradesState, getDynamicMaxBusinessLevel]);

  const calculateMaxAffordableLevelsForDisplay = useCallback((businessId: string) => {
    const business = businesses.find(b => b.id === businessId);
    if (!business) return { levelsToBuy: 0, totalCost: 0 };
    const dynamicMax = getDynamicMaxBusinessLevel();
    return calculateMaxAffordableLevels(business, playerStats.money, playerStats.unlockedSkillIds, skillTreeState, dynamicMax, playerStats.purchasedHQUpgradeIds, hqUpgradesState);
  }, [businesses, playerStats.money, playerStats.unlockedSkillIds, skillTreeState, playerStats.purchasedHQUpgradeIds, hqUpgradesState, getDynamicMaxBusinessLevel]);


  useEffect(() => {
    const totalBusinessIncome = businesses.reduce((sum, biz) => sum + getBusinessIncome(biz.id), 0);

    let dividendIncome = 0;
    let globalDividendBoost = 0;
    playerStats.unlockedSkillIds.forEach(skillId => {
      const skill = skillTreeState.find(s => s.id === skillId);
      if (skill && skill.effects.globalDividendYieldBoostPercent) {
        globalDividendBoost += skill.effects.globalDividendYieldBoostPercent;
      }
    });
    playerStats.purchasedHQUpgradeIds.forEach(hqId => {
        const hqUpgrade = hqUpgradesState.find(h => h.id === hqId);
        if (hqUpgrade && hqUpgrade.effects.globalDividendYieldBoostPercent) {
            globalDividendBoost += hqUpgrade.effects.globalDividendYieldBoostPercent;
        }
    });


    for (const holding of playerStats.stockHoldings) {
      const stockDetails = unlockedStocks.find(s => s.id === holding.stockId);
      if (stockDetails) {
        let currentDividendYield = stockDetails.dividendYield;
        currentDividendYield *= (1 + globalDividendBoost / 100);
        dividendIncome += holding.shares * stockDetails.price * currentDividendYield;
      }
    }
    setPlayerStats(prev => ({ ...prev, totalIncomePerSecond: totalBusinessIncome + dividendIncome }));
  }, [businesses, getBusinessIncome, playerStats.stockHoldings, unlockedStocks, playerStats.unlockedSkillIds, skillTreeState, playerStats.purchasedHQUpgradeIds, hqUpgradesState]);

  const purchaseBusinessUpgrade = useCallback((businessId: string, upgradeId: string, isAutoBuy: boolean = false): boolean => {
    const businessToUpdate = businesses.find(b => b.id === businessId);
    if (!businessToUpdate || !businessToUpdate.upgrades) return false;

    const businessIndexInConfig = INITIAL_BUSINESSES.findIndex(b => b.id === businessId);
    if (businessIndexInConfig === -1) return false; 

    if (playerStats.timesPrestiged < businessIndexInConfig) {
      if (!isAutoBuy) toast({ title: "Locked", description: `This business unlocks after ${businessIndexInConfig} prestige(s).`, variant: "destructive"});
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
        if (skill && skill.effects.globalBusinessUpgradeCostReductionPercent) {
            globalUpgradeCostReduction += skill.effects.globalBusinessUpgradeCostReductionPercent;
        }
    });
    if (globalUpgradeCostReduction > 0) {
        actualCost *= (1 - globalUpgradeCostReduction / 100);
        actualCost = Math.max(0, Math.floor(actualCost));
    }

    if (playerStats.money < actualCost) {
      if (!isAutoBuy) toast({ title: "Not Enough Money", description: `You need $${actualCost.toLocaleString('en-US')} to purchase ${upgrade.name}.`, variant: "destructive" });
      return false;
    }

    setPlayerStats(prev => ({ ...prev, money: prev.money - actualCost }));
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
       toast({ title: "Auto-Upgrade!", description: `${upgrade.name} for ${businessToUpdate.name} bought automatically.` });
    }
    return true;
  }, [businesses, playerStats.money, playerStats.timesPrestiged, playerStats.unlockedSkillIds, skillTreeState, toast]);


  useEffect(() => {
    const gameLoop = setInterval(() => {
      setPlayerStats(prev => {
        const newMoney = prev.money + prev.totalIncomePerSecond;
        let currentInvestmentsValue = 0;
        for (const holding of prev.stockHoldings) {
          const stockDetails = unlockedStocks.find(s => s.id === holding.stockId);
          if (stockDetails) {
            currentInvestmentsValue += holding.shares * stockDetails.price;
          }
        }
        return { ...prev, money: newMoney, investmentsValue: currentInvestmentsValue };
      });
    }, 1000);
    return () => clearInterval(gameLoop);
  }, [playerStats.totalIncomePerSecond, unlockedStocks]);


  useEffect(() => {
    let purchasedInThisTick = false;
    const businessesCopy = JSON.parse(JSON.stringify(businesses)) as Business[];
    let currentMoneySnapshot = playerStats.money;

    playerStats.unlockedSkillIds.forEach(skillId => {
      const skill = skillTreeState.find(s => s.id === skillId);
      if (skill && skill.effects.autoBuyUpgradesForBusiness) {
        const businessIdToAutoBuy = skill.effects.autoBuyUpgradesForBusiness;
        const businessIndex = businessesCopy.findIndex(b => b.id === businessIdToAutoBuy);

        if (businessIndex !== -1) {
          const business = businessesCopy[businessIndex];
          if (business.upgrades) {
            business.upgrades.forEach((upgrade, upgradeIndex) => {
              if (!upgrade.isPurchased && business.level >= upgrade.requiredLevel) {
                let actualCost = upgrade.cost;
                let globalUpgradeCostReduction = 0;
                playerStats.unlockedSkillIds.forEach(sId => {
                  const sk = skillTreeState.find(s => s.id === sId);
                  if (sk && sk.effects.globalBusinessUpgradeCostReductionPercent) {
                    globalUpgradeCostReduction += sk.effects.globalBusinessUpgradeCostReductionPercent;
                  }
                });
                if (globalUpgradeCostReduction > 0) {
                  actualCost *= (1 - globalUpgradeCostReduction / 100);
                  actualCost = Math.max(0, Math.floor(actualCost));
                }

                if (currentMoneySnapshot >= actualCost) {
                  currentMoneySnapshot -= actualCost;
                  businessesCopy[businessIndex].upgrades![upgradeIndex].isPurchased = true;
                  purchasedInThisTick = true;
                  // Simplified toast here for auto-buy
                  toast({ title: "Auto-Upgrade!", description: `${upgrade.name} for ${business.name}`, duration: 1500 });
                }
              }
            });
          }
        }
      }
    });

    if (purchasedInThisTick) {
      setPlayerStats(prev => ({ ...prev, money: currentMoneySnapshot }));
      setBusinesses(businessesCopy);
    }
  }, [playerStats.money, playerStats.unlockedSkillIds, businesses, skillTreeState, toast ]);


  const upgradeBusiness = (businessId: string, levelsToAttempt: number = 1) => {
    const businessToUpdate = businesses.find(b => b.id === businessId);
    if (!businessToUpdate) return;

    const businessIndexInConfig = INITIAL_BUSINESSES.findIndex(b => b.id === businessId);
    if (businessIndexInConfig === -1) return;

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
        playerStats.purchasedHQUpgradeIds,
        hqUpgradesState
    );

    if (levelsPurchasable === 0) {
        toast({ title: "Cannot level up", description: `${businessToUpdate.name} is at max level or no levels can be purchased.`, variant: "default" });
        return;
    }

    if (playerStats.money < totalCost) {
      toast({ title: "Not enough money!", description: `You need $${totalCost.toLocaleString('en-US')} to level up ${businessToUpdate.name} by ${levelsPurchasable} level(s).`, variant: "destructive" });
      return;
    }

    setPlayerStats(prev => ({ ...prev, money: prev.money - totalCost }));
    setBusinesses(prevBusinesses =>
      prevBusinesses.map(b =>
        b.id === businessId ? { ...b, level: b.level + levelsPurchasable } : b
      )
    );
    toast({ title: "Business Leveled Up!", description: `${businessToUpdate.name} is now level ${businessToUpdate.level + levelsPurchasable} (+${levelsPurchasable}).` });
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
    const stock = unlockedStocks.find(s => s.id === stockId);
    if (!stock) {
      toast({ title: "Stock Not Found", description: "This stock is not available or does not exist.", variant: "destructive" });
      return;
    }

    const existingHolding = playerStats.stockHoldings.find(h => h.stockId === stockId);
    const sharesAlreadyOwnedByPlayer = existingHolding?.shares || 0;
    const sharesAvailableToBuy = stock.totalOutstandingShares - sharesAlreadyOwnedByPlayer;

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
    const cost = stock.price * sharesToBuy;
    if (playerStats.money < cost) {
      toast({ title: "Not Enough Money", description: `You need $${cost.toLocaleString('en-US')} to buy ${sharesToBuy.toLocaleString('en-US')} share(s).`, variant: "destructive" });
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
    const stock = unlockedStocks.find(s => s.id === stockId);
    if (!stock) {
      toast({ title: "Stock Not Found", variant: "destructive" });
      return;
    }
    const existingHolding = playerStats.stockHoldings.find(h => h.stockId === stockId);
    if (!existingHolding || existingHolding.shares < sharesToSell) {
      toast({ title: "Not Enough Shares", description: `You only own ${existingHolding?.shares || 0} share(s).`, variant: "destructive" });
      return;
    }
    const earnings = stock.price * sharesToSell;
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
      toast({ title: "Not Enough Money", description: `Need $${moneyRequiredForFirstPrestige.toLocaleString('en-US')} to prestige for the first time.`, variant: "destructive" });
      return;
    }

    const totalLevels = businesses.reduce((sum, b) => sum + b.level, 0);
    let basePointsFromLevels = calculateDiminishingPrestigePoints(totalLevels);

    const prestigePointBoost = getPrestigePointBoostPercent(playerStats.unlockedSkillIds, skillTreeState, playerStats.purchasedHQUpgradeIds, hqUpgradesState);
    const actualNewPrestigePoints = Math.floor(Math.max(0, basePointsFromLevels - playerStats.prestigePoints) * (1 + prestigePointBoost / 100));

    let moneyAfterPrestige = INITIAL_MONEY;
    const startingMoneyBonus = getStartingMoneyBonus(playerStats.unlockedSkillIds, skillTreeState, playerStats.purchasedHQUpgradeIds, hqUpgradesState);
    moneyAfterPrestige += startingMoneyBonus;

    setPlayerStats(prev => ({
      ...prev,
      money: moneyAfterPrestige,
      investmentsValue: 0,
      stockHoldings: [],
      prestigePoints: prev.prestigePoints + actualNewPrestigePoints,
      timesPrestiged: prev.timesPrestiged + 1,
      // purchasedHQUpgradeIds are kept through prestige
      // unlockedSkillIds are kept through prestige
    }));

    setBusinesses(INITIAL_BUSINESSES.map(biz => ({
      ...biz, level: 0, managerOwned: false,
      upgrades: biz.upgrades ? biz.upgrades.map(upg => ({ ...upg, isPurchased: false })) : [],
      icon: biz.icon,
    })));
    toast({ title: "Prestige Successful!", description: `Earned ${actualNewPrestigePoints} prestige point(s)! Game reset. Starting money now $${moneyAfterPrestige.toLocaleString('en-US')}.` });
  }, [playerStats.money, playerStats.timesPrestiged, playerStats.prestigePoints, playerStats.unlockedSkillIds, playerStats.purchasedHQUpgradeIds, businesses, toast, skillTreeState, hqUpgradesState]);

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
    const upgrade = hqUpgradesState.find(u => u.id === upgradeId);
    if (!upgrade) {
      toast({ title: "HQ Upgrade Not Found", variant: "destructive" });
      return;
    }
    if (playerStats.purchasedHQUpgradeIds.includes(upgradeId)) {
      toast({ title: "HQ Upgrade Already Purchased", variant: "default" });
      return;
    }
    if (upgrade.requiredTimesPrestiged && playerStats.timesPrestiged < upgrade.requiredTimesPrestiged) {
      toast({ title: "Prestige Requirement Not Met", description: `Requires ${upgrade.requiredTimesPrestiged} prestige(s).`, variant: "destructive"});
      return;
    }
    if (playerStats.money < upgrade.costMoney) {
      toast({ title: "Not Enough Money", description: `Need $${upgrade.costMoney.toLocaleString('en-US')}.`, variant: "destructive"});
      return;
    }
    if (upgrade.costPrestigePoints && playerStats.prestigePoints < upgrade.costPrestigePoints) {
      toast({ title: "Not Enough Prestige Points", description: `Need ${upgrade.costPrestigePoints} PP.`, variant: "destructive"});
      return;
    }

    setPlayerStats(prev => ({
      ...prev,
      money: prev.money - upgrade.costMoney,
      prestigePoints: upgrade.costPrestigePoints ? prev.prestigePoints - upgrade.costPrestigePoints : prev.prestigePoints,
      purchasedHQUpgradeIds: [...prev.purchasedHQUpgradeIds, upgradeId],
    }));
    toast({ title: "HQ Upgrade Purchased!", description: `${upgrade.name} is now active.` });
  };


  return (
    <GameContext.Provider value={{
      playerStats,
      businesses,
      stocks: unlockedStocks,
      skillTree: skillTreeState,
      hqUpgrades: hqUpgradesState, // Added
      lastSavedTimestamp,
      upgradeBusiness,
      purchaseBusinessUpgrade,
      purchaseHQUpgrade, // Added
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



"use client";

import type { Business, PlayerStats, Stock, StockHolding, SkillNode } from '@/types';
import { 
  INITIAL_BUSINESSES, 
  INITIAL_MONEY, 
  calculateIncome, 
  // calculateUpgradeCost, // Single level cost now primarily used within calculateCostForNLevels
  MAX_BUSINESS_LEVEL, 
  INITIAL_STOCKS, 
  INITIAL_PRESTIGE_POINTS, 
  INITIAL_TIMES_PRESTIGED,
  INITIAL_SKILL_TREE,
  INITIAL_UNLOCKED_SKILL_IDS,
  getStartingMoneyBonus,
  getPrestigePointBoostPercent,
  calculateDiminishingPrestigePoints,
  calculateCostForNLevels, // Import new bulk cost calculator
  calculateMaxAffordableLevels, // Import new max affordable calculator
} from '@/config/game-config';
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";

const GOD_MODE_ACTIVE = false; // Set to true for testing

interface GameContextType {
  playerStats: PlayerStats;
  businesses: Business[];
  stocks: Stock[]; 
  skillTree: SkillNode[];
  upgradeBusiness: (businessId: string, levelsToBuy?: number) => void; // levelsToBuy is optional
  purchaseBusinessUpgrade: (businessId: string, upgradeId: string) => void;
  getBusinessIncome: (businessId: string) => number;
  getBusinessUpgradeCost: (businessId: string) => number; // Cost for single next level, useful for display
  buyStock: (stockId: string, sharesToBuy: number) => void;
  sellStock: (stockId: string, sharesToSell: number) => void;
  performPrestige: () => void;
  unlockSkillNode: (skillId: string) => void;
  getDynamicMaxBusinessLevel: () => number;
  // For BusinessCard to calculate display costs for bulk buys:
  calculateCostForNLevelsForDisplay: (businessId: string, levelsToBuy: number) => { totalCost: number; levelsPurchasable: number };
  calculateMaxAffordableLevelsForDisplay: (businessId: string) => { levelsToBuy: number; totalCost: number };

}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  
  const [skillTreeState] = useState<SkillNode[]>(INITIAL_SKILL_TREE);

  const [playerStats, setPlayerStats] = useState<PlayerStats>(() => {
    let money = INITIAL_MONEY;
    let prestigePoints = INITIAL_PRESTIGE_POINTS;
    let timesPrestiged = INITIAL_TIMES_PRESTIGED;
    let unlockedSkillIds = [...INITIAL_UNLOCKED_SKILL_IDS];

    if (GOD_MODE_ACTIVE) {
      money = Number.MAX_SAFE_INTEGER / 1000; // A very large number
      prestigePoints = 0; // Start with 0 for testing normal progression
      timesPrestiged = 0; // Start with 0 for testing normal progression
      unlockedSkillIds = []; // Start with no skills for testing normal progression
    } else {
        const startingMoneyBonus = getStartingMoneyBonus(unlockedSkillIds, skillTreeState);
        money += startingMoneyBonus;
    }
    
    return {
      money,
      totalIncomePerSecond: 0,
      investmentsValue: 0,
      stockHoldings: [],
      prestigePoints,
      timesPrestiged,
      unlockedSkillIds,
    };
  });
  
  const [businesses, setBusinesses] = useState<Business[]>(() => 
    INITIAL_BUSINESSES.map(biz => ({
      ...biz,
      level: 0,
      upgrades: biz.upgrades ? biz.upgrades.map(upg => ({ ...upg, isPurchased: false })) : [],
    }))
  );

  const [unlockedStocks, setUnlockedStocks] = useState<Stock[]>([]);

  useEffect(() => {
    const filteredStocks = INITIAL_STOCKS.filter(stock => {
      if (!stock.requiredSkillToUnlock) return true; 
      return playerStats.unlockedSkillIds.includes(stock.requiredSkillToUnlock);
    });
    setUnlockedStocks(filteredStocks);
  }, [playerStats.unlockedSkillIds]);

  const getDynamicMaxBusinessLevel = useCallback((): number => {
    let bonusLevels = 0;
    playerStats.unlockedSkillIds.forEach(skillId => {
        const skill = skillTreeState.find(s => s.id === skillId);
        if (skill && skill.effects.increaseMaxBusinessLevelBy) {
            bonusLevels += skill.effects.increaseMaxBusinessLevelBy;
        }
    });
    return MAX_BUSINESS_LEVEL + bonusLevels;
  }, [playerStats.unlockedSkillIds, skillTreeState]);


  const getBusinessIncome = useCallback((businessId: string): number => {
    const business = businesses.find(b => b.id === businessId);
    return business ? calculateIncome(business, playerStats.unlockedSkillIds, skillTreeState) : 0;
  }, [businesses, playerStats.unlockedSkillIds, skillTreeState]);
  
  // Returns cost for the single next level
  const getBusinessUpgradeCost = useCallback((businessId: string): number => {
    const business = businesses.find(b => b.id === businessId);
    if (!business) return 0;
    const currentDynamicMaxLevel = getDynamicMaxBusinessLevel();
    if (business.level >= currentDynamicMaxLevel) return Infinity;

    const {totalCost} = calculateCostForNLevels(business, 1, playerStats.unlockedSkillIds, skillTreeState, currentDynamicMaxLevel);
    return totalCost; // This will be cost for 1 level
  }, [businesses, playerStats.unlockedSkillIds, skillTreeState, getDynamicMaxBusinessLevel]);

  // Helper for BusinessCard to display costs
  const calculateCostForNLevelsForDisplay = useCallback((businessId: string, levelsToBuy: number) => {
    const business = businesses.find(b => b.id === businessId);
    if (!business) return { totalCost: Infinity, levelsPurchasable: 0 };
    const dynamicMax = getDynamicMaxBusinessLevel();
    return calculateCostForNLevels(business, levelsToBuy, playerStats.unlockedSkillIds, skillTreeState, dynamicMax);
  }, [businesses, playerStats.unlockedSkillIds, skillTreeState, getDynamicMaxBusinessLevel]);

  const calculateMaxAffordableLevelsForDisplay = useCallback((businessId: string) => {
    const business = businesses.find(b => b.id === businessId);
    if (!business) return { levelsToBuy: 0, totalCost: 0 };
    const dynamicMax = getDynamicMaxBusinessLevel();
    return calculateMaxAffordableLevels(business, playerStats.money, playerStats.unlockedSkillIds, skillTreeState, dynamicMax);
  }, [businesses, playerStats.money, playerStats.unlockedSkillIds, skillTreeState, getDynamicMaxBusinessLevel]);


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

    for (const holding of playerStats.stockHoldings) {
      const stockDetails = unlockedStocks.find(s => s.id === holding.stockId);
      if (stockDetails) {
        let currentDividendYield = stockDetails.dividendYield;
        currentDividendYield *= (1 + globalDividendBoost / 100);
        dividendIncome += holding.shares * stockDetails.price * currentDividendYield;
      }
    }
    setPlayerStats(prev => ({ ...prev, totalIncomePerSecond: totalBusinessIncome + dividendIncome }));
  }, [businesses, getBusinessIncome, playerStats.stockHoldings, unlockedStocks, playerStats.unlockedSkillIds, skillTreeState]);

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
        return {
          ...prev,
          money: newMoney,
          investmentsValue: currentInvestmentsValue,
        };
      });
    }, 1000); 

    return () => clearInterval(gameLoop);
  }, [playerStats.totalIncomePerSecond, unlockedStocks]); 

  const upgradeBusiness = (businessId: string, levelsToAttempt: number = 1) => {
    const business = businesses.find(b => b.id === businessId);
    if (!business) return;

    const requiredPrestiges = business.requiredTimesPrestiged || 0;
    if (playerStats.timesPrestiged < requiredPrestiges) { 
       toast({ title: "Locked", description: `This business requires ${requiredPrestiges} prestige(s) to operate.`, variant: "destructive"});
       return;
    }
    
    const currentDynamicMaxLevel = getDynamicMaxBusinessLevel();
    if (business.level >= currentDynamicMaxLevel) {
      toast({ title: "Max Level Reached!", description: `${business.name} is already at the maximum level (${currentDynamicMaxLevel}).`, variant: "default" });
      return;
    }

    const { totalCost, levelsPurchasable } = calculateCostForNLevels(
        business, 
        levelsToAttempt, 
        playerStats.unlockedSkillIds, 
        skillTreeState, 
        currentDynamicMaxLevel
    );

    if (levelsPurchasable === 0) {
        toast({ title: "Cannot level up", description: `${business.name} is at max level or no levels can be purchased.`, variant: "default" });
        return;
    }

    if (playerStats.money < totalCost) {
      toast({ title: "Not enough money!", description: `You need $${totalCost.toLocaleString('en-US')} to level up ${business.name} by ${levelsPurchasable} level(s).`, variant: "destructive" });
      return;
    }

    setPlayerStats(prev => ({ ...prev, money: prev.money - totalCost }));
    setBusinesses(prevBusinesses =>
      prevBusinesses.map(b =>
        b.id === businessId ? { ...b, level: b.level + levelsPurchasable } : b
      )
    );
    toast({ title: "Business Leveled Up!", description: `${business.name} is now level ${business.level + levelsPurchasable} (+${levelsPurchasable}).` });
  };

  const purchaseBusinessUpgrade = (businessId: string, upgradeId: string) => {
    const business = businesses.find(b => b.id === businessId);
    if (!business || !business.upgrades) return;

    const requiredPrestiges = business.requiredTimesPrestiged || 0;
    if (playerStats.timesPrestiged < requiredPrestiges) {
       toast({ title: "Locked", description: `This business requires ${requiredPrestiges} prestige(s) to operate.`, variant: "destructive"});
       return;
    }

    const upgrade = business.upgrades.find(u => u.id === upgradeId);
    if (!upgrade) return;

    if (upgrade.isPurchased) {
      toast({ title: "Already Owned", description: "You already own this upgrade.", variant: "default" });
      return;
    }
    if (business.level < upgrade.requiredLevel) { 
      toast({ title: "Level Requirement Not Met", description: `${business.name} must be level ${upgrade.requiredLevel} for this upgrade.`, variant: "destructive" });
      return;
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
      toast({ title: "Not Enough Money", description: `You need $${actualCost.toLocaleString('en-US')} to purchase ${upgrade.name}.`, variant: "destructive" });
      return;
    }

    setPlayerStats(prev => ({ ...prev, money: prev.money - actualCost }));
    setBusinesses(prevBusinesses =>
      prevBusinesses.map(b =>
        b.id === businessId
          ? { ...b, upgrades: b.upgrades?.map(u => u.id === upgradeId ? { ...u, isPurchased: true } : u) }
          : b
      )
    );
    toast({ title: "Upgrade Purchased!", description: `${upgrade.name} for ${business.name} is now active.` });
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
    const moneyRequiredForPrestige = 1000000;
    if (playerStats.money < moneyRequiredForPrestige && playerStats.timesPrestiged === 0) { 
      toast({ title: "Not Enough Money", description: `Need $${moneyRequiredForPrestige.toLocaleString('en-US')} to prestige for the first time.`, variant: "destructive" });
      return;
    }

    const totalLevels = businesses.reduce((sum, b) => sum + b.level, 0);
    let basePointsFromLevels = calculateDiminishingPrestigePoints(totalLevels);
    
    const prestigePointBoost = getPrestigePointBoostPercent(playerStats.unlockedSkillIds, skillTreeState);
    const actualNewPrestigePoints = Math.floor(Math.max(0, basePointsFromLevels - playerStats.prestigePoints) * (1 + prestigePointBoost / 100));

    let moneyAfterPrestige = INITIAL_MONEY;
    if (GOD_MODE_ACTIVE) {
        moneyAfterPrestige = Number.MAX_SAFE_INTEGER / 1000;
    } else {
        const startingMoneyBonus = getStartingMoneyBonus(playerStats.unlockedSkillIds, skillTreeState);
        moneyAfterPrestige += startingMoneyBonus;
    }
    
    setPlayerStats(prev => ({
      ...prev,
      money: moneyAfterPrestige,
      investmentsValue: 0,
      stockHoldings: [],
      prestigePoints: GOD_MODE_ACTIVE ? 0 : prev.prestigePoints + actualNewPrestigePoints,
      timesPrestiged: GOD_MODE_ACTIVE ? 0 : prev.timesPrestiged + 1,
    }));

    setBusinesses(INITIAL_BUSINESSES.map(biz => ({
      ...biz, level: 0, managerOwned: false, 
      upgrades: biz.upgrades ? biz.upgrades.map(upg => ({ ...upg, isPurchased: false })) : [],
    })));
    toast({ title: "Prestige Successful!", description: `Earned ${actualNewPrestigePoints} prestige point(s)! Game reset. Starting money now $${moneyAfterPrestige.toLocaleString('en-US')}.` });
  }, [playerStats.money, playerStats.timesPrestiged, playerStats.prestigePoints, playerStats.unlockedSkillIds, businesses, toast, skillTreeState]);

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

  return (
    <GameContext.Provider value={{ 
      playerStats, 
      businesses, 
      stocks: unlockedStocks, 
      skillTree: skillTreeState,
      upgradeBusiness,
      purchaseBusinessUpgrade,
      getBusinessIncome, 
      getBusinessUpgradeCost,
      buyStock,
      sellStock,
      performPrestige,
      unlockSkillNode,
      getDynamicMaxBusinessLevel,
      calculateCostForNLevelsForDisplay,
      calculateMaxAffordableLevelsForDisplay,
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


    
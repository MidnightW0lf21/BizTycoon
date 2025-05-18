
"use client";

import type { Business, BusinessUpgrade, PlayerStats, Stock, StockHolding, SkillNode, RiskTolerance } from '@/types';
import { 
  INITIAL_BUSINESSES, 
  INITIAL_MONEY, 
  calculateIncome, 
  calculateUpgradeCost, 
  MAX_BUSINESS_LEVEL, 
  INITIAL_STOCKS, 
  INITIAL_PRESTIGE_POINTS, 
  INITIAL_TIMES_PRESTIGED,
  INITIAL_SKILL_TREE,
  INITIAL_UNLOCKED_SKILL_IDS,
  getStartingMoneyBonus,
  getPrestigePointBoostPercent,
  calculateDiminishingPrestigePoints,
  TECH_BUSINESS_IDS, 
  LOGISTICS_BUSINESS_IDS 
} from '@/config/game-config';
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";

interface GameContextType {
  playerStats: PlayerStats;
  businesses: Business[];
  stocks: Stock[]; 
  skillTree: SkillNode[];
  upgradeBusiness: (businessId: string) => void;
  purchaseBusinessUpgrade: (businessId: string, upgradeId: string) => void;
  getBusinessIncome: (businessId: string) => number;
  getBusinessUpgradeCost: (businessId: string) => number;
  buyStock: (stockId: string, sharesToBuy: number) => void;
  sellStock: (stockId: string, sharesToSell: number) => void;
  performPrestige: () => void;
  unlockSkillNode: (skillId: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  
  const GOD_MODE_ACTIVE = true; 
  const [skillTreeState] = useState<SkillNode[]>(INITIAL_SKILL_TREE);

  const [playerStats, setPlayerStats] = useState<PlayerStats>(() => {
    let baseMoney = INITIAL_MONEY;
    let initialUnlockedSkills = [...INITIAL_UNLOCKED_SKILL_IDS]; 
    let initialTimesPrestiged = INITIAL_TIMES_PRESTIGED; 
    let initialPrestigePoints = INITIAL_PRESTIGE_POINTS; 

    if (GOD_MODE_ACTIVE) {
      baseMoney = Number.MAX_SAFE_INTEGER / 100; 
      initialPrestigePoints = 9999; 
      initialTimesPrestiged = 999;  
      console.log("--- GOD MODE ACTIVATED: Max Money, High Prestige Levels, High PP ---");
    }
    
    const startingMoneyBonus = getStartingMoneyBonus(initialUnlockedSkills, skillTreeState);
    const finalInitialMoney = baseMoney + startingMoneyBonus;

    return {
      money: finalInitialMoney,
      totalIncomePerSecond: 0,
      investmentsValue: 0,
      stockHoldings: [],
      prestigePoints: initialPrestigePoints,
      timesPrestiged: initialTimesPrestiged,
      unlockedSkillIds: initialUnlockedSkills,
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
      if (GOD_MODE_ACTIVE) return true; // In God Mode, all stocks are available
      if (!stock.requiredSkillToUnlock) return true; 
      return playerStats.unlockedSkillIds.includes(stock.requiredSkillToUnlock);
    });
    setUnlockedStocks(filteredStocks);
  }, [playerStats.unlockedSkillIds]);


  const getBusinessIncome = useCallback((businessId: string): number => {
    const business = businesses.find(b => b.id === businessId);
    return business ? calculateIncome(business, playerStats.unlockedSkillIds, skillTreeState) : 0;
  }, [businesses, playerStats.unlockedSkillIds, skillTreeState]);
  
  const getBusinessUpgradeCost = useCallback((businessId: string): number => {
    const business = businesses.find(b => b.id === businessId);
    return business ? calculateUpgradeCost(business, playerStats.unlockedSkillIds, skillTreeState) : 0;
  }, [businesses, playerStats.unlockedSkillIds, skillTreeState]);

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
        const newMoney = GOD_MODE_ACTIVE ? prev.money : prev.money + prev.totalIncomePerSecond;
        
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

  const upgradeBusiness = (businessId: string) => {
    const business = businesses.find(b => b.id === businessId);
    if (!business) return;

    const requiredPrestiges = business.requiredTimesPrestiged || 0;
    if (playerStats.timesPrestiged < requiredPrestiges && !GOD_MODE_ACTIVE) { 
       toast({ title: "Locked", description: `This business requires ${requiredPrestiges} prestige(s) to operate.`, variant: "destructive"});
       return;
    }

    if (business.level >= MAX_BUSINESS_LEVEL) {
      if (!GOD_MODE_ACTIVE) toast({ title: "Max Level Reached!", description: `${business.name} is already at the maximum level.`, variant: "default" });
      return;
    }

    const cost = getBusinessUpgradeCost(business.id);
    if (playerStats.money < cost && !GOD_MODE_ACTIVE) {
      toast({ title: "Not enough money!", description: `You need $${cost.toLocaleString('en-US')} to level up ${business.name}.`, variant: "destructive" });
      return;
    }

    setPlayerStats(prev => ({ ...prev, money: GOD_MODE_ACTIVE ? prev.money : prev.money - cost }));
    setBusinesses(prevBusinesses =>
      prevBusinesses.map(b =>
        b.id === businessId ? { ...b, level: b.level + 1 } : b
      )
    );
    if (!GOD_MODE_ACTIVE) {
        toast({ title: "Business Leveled Up!", description: `${business.name} is now level ${business.level + 1}.` });
    }
  };

  const purchaseBusinessUpgrade = (businessId: string, upgradeId: string) => {
    const business = businesses.find(b => b.id === businessId);
    if (!business || !business.upgrades) return;

    const requiredPrestiges = business.requiredTimesPrestiged || 0;
    if (playerStats.timesPrestiged < requiredPrestiges && !GOD_MODE_ACTIVE) {
       toast({ title: "Locked", description: `This business requires ${requiredPrestiges} prestige(s) to operate.`, variant: "destructive"});
       return;
    }

    const upgrade = business.upgrades.find(u => u.id === upgradeId);
    if (!upgrade) return;

    if (upgrade.isPurchased) {
      if (!GOD_MODE_ACTIVE) toast({ title: "Already Owned", description: "You already own this upgrade.", variant: "default" });
      return;
    }
    if (business.level < upgrade.requiredLevel && !GOD_MODE_ACTIVE) { 
      if(!GOD_MODE_ACTIVE) toast({ title: "Level Requirement Not Met", description: `${business.name} must be level ${upgrade.requiredLevel} for this upgrade.`, variant: "destructive" });
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

    if (playerStats.money < actualCost && !GOD_MODE_ACTIVE) {
      toast({ title: "Not Enough Money", description: `You need $${actualCost.toLocaleString('en-US')} to purchase ${upgrade.name}.`, variant: "destructive" });
      return;
    }

    setPlayerStats(prev => ({ ...prev, money: GOD_MODE_ACTIVE ? prev.money : prev.money - actualCost }));
    setBusinesses(prevBusinesses =>
      prevBusinesses.map(b =>
        b.id === businessId
          ? { ...b, upgrades: b.upgrades?.map(u => u.id === upgradeId ? { ...u, isPurchased: true } : u) }
          : b
      )
    );
    if(!GOD_MODE_ACTIVE) toast({ title: "Upgrade Purchased!", description: `${upgrade.name} for ${business.name} is now active.` });
  };

  const buyStock = (stockId: string, sharesToBuyInput: number) => {
    if (playerStats.timesPrestiged < 2 && !GOD_MODE_ACTIVE) { 
        toast({ title: "Stocks Locked", description: "You need to prestige at least 2 times to access the stock market.", variant: "destructive" });
        return;
    }
    if (sharesToBuyInput <= 0 && !GOD_MODE_ACTIVE) {
      if(!GOD_MODE_ACTIVE) toast({ title: "Invalid Amount", description: "Number of shares must be positive.", variant: "destructive" });
      return;
    }
    const stock = unlockedStocks.find(s => s.id === stockId); 
    if (!stock) {
      if(!GOD_MODE_ACTIVE) toast({ title: "Stock Not Found", description: "This stock is not available or does not exist.", variant: "destructive" });
      return;
    }

    const existingHolding = playerStats.stockHoldings.find(h => h.stockId === stockId);
    const sharesAlreadyOwnedByPlayer = existingHolding?.shares || 0;
    const sharesAvailableToBuy = stock.totalOutstandingShares - sharesAlreadyOwnedByPlayer;

    if (sharesAvailableToBuy <= 0 && !GOD_MODE_ACTIVE) {
      toast({ title: "No Shares Available", description: `All outstanding shares of ${stock.companyName} (${stock.ticker}) are accounted for.`, variant: "default" });
      return;
    }
    let sharesToBuy = sharesToBuyInput;
    if (sharesToBuyInput > sharesAvailableToBuy && !GOD_MODE_ACTIVE) {
      toast({ title: "Purchase Adjusted", description: `Only ${sharesAvailableToBuy.toLocaleString('en-US')} shares available. Purchase adjusted.`, variant: "default" });
      sharesToBuy = sharesAvailableToBuy;
    }
    if (sharesToBuy <= 0 && !GOD_MODE_ACTIVE) { 
        toast({ title: "No Shares to Buy", description: `No shares of ${stock.companyName} (${stock.ticker}) could be purchased.`, variant: "destructive" });
        return;
    }
    const cost = stock.price * sharesToBuy;
    if (playerStats.money < cost && !GOD_MODE_ACTIVE) {
      toast({ title: "Not Enough Money", description: `You need $${cost.toLocaleString('en-US')} to buy ${sharesToBuy.toLocaleString('en-US')} share(s).`, variant: "destructive" });
      return;
    }
    setPlayerStats(prev => {
      const newHoldings = prev.stockHoldings.find(h => h.stockId === stockId)
        ? prev.stockHoldings.map(h => h.stockId === stockId ? { ...h, shares: h.shares + sharesToBuy, averagePurchasePrice: ((h.averagePurchasePrice * h.shares) + (stock.price * sharesToBuy)) / (h.shares + sharesToBuy) } : h)
        : [...prev.stockHoldings, { stockId, shares: sharesToBuy, averagePurchasePrice: stock.price }];
      return { ...prev, money: GOD_MODE_ACTIVE ? prev.money : prev.money - cost, stockHoldings: newHoldings };
    });
    if(!GOD_MODE_ACTIVE) toast({ title: "Stock Purchased!", description: `Bought ${sharesToBuy.toLocaleString('en-US')} share(s) of ${stock.companyName}.` });
  };

  const sellStock = (stockId: string, sharesToSell: number) => {
     if (playerStats.timesPrestiged < 2 && !GOD_MODE_ACTIVE) {
        toast({ title: "Stocks Locked", description: "You need to prestige at least 2 times to access the stock market.", variant: "destructive" });
        return;
    }
    if (sharesToSell <= 0 && !GOD_MODE_ACTIVE) {
      if(!GOD_MODE_ACTIVE) toast({ title: "Invalid Amount", description: "Number of shares must be positive.", variant: "destructive" });
      return;
    }
    const stock = unlockedStocks.find(s => s.id === stockId); 
    if (!stock) {
      if(!GOD_MODE_ACTIVE) toast({ title: "Stock Not Found", variant: "destructive" });
      return;
    }
    const existingHolding = playerStats.stockHoldings.find(h => h.stockId === stockId);
    if (!existingHolding || existingHolding.shares < sharesToSell) {
      if(!GOD_MODE_ACTIVE) toast({ title: "Not Enough Shares", description: `You only own ${existingHolding?.shares || 0} share(s).`, variant: "destructive" });
      return;
    }
    const earnings = stock.price * sharesToSell;
    setPlayerStats(prev => {
      const newHoldings = existingHolding.shares === sharesToSell
        ? prev.stockHoldings.filter(h => h.stockId !== stockId)
        : prev.stockHoldings.map(h => h.stockId === stockId ? { ...h, shares: h.shares - sharesToSell } : h);
      return { ...prev, money: GOD_MODE_ACTIVE ? prev.money : prev.money + earnings, stockHoldings: newHoldings };
    });
    if(!GOD_MODE_ACTIVE) toast({ title: "Stock Sold!", description: `Sold ${sharesToSell.toLocaleString('en-US')} share(s) of ${stock.companyName}.` });
  };

  const performPrestige = useCallback(() => {
    const moneyRequiredForPrestige = 1000000;
    if (playerStats.money < moneyRequiredForPrestige && playerStats.timesPrestiged === 0 && !GOD_MODE_ACTIVE) { 
      toast({ title: "Not Enough Money", description: `Need $${moneyRequiredForPrestige.toLocaleString('en-US')} to prestige for the first time.`, variant: "destructive" });
      return;
    }

    const totalLevels = businesses.reduce((sum, b) => sum + b.level, 0);
    let basePointsFromLevels = calculateDiminishingPrestigePoints(totalLevels);
    
    const prestigePointBoost = getPrestigePointBoostPercent(playerStats.unlockedSkillIds, skillTreeState);
    const actualNewPrestigePoints = Math.floor(Math.max(0, basePointsFromLevels - playerStats.prestigePoints) * (1 + prestigePointBoost / 100));

    const startingMoneyBonus = getStartingMoneyBonus(playerStats.unlockedSkillIds, skillTreeState);
    
    const moneyAfterPrestige = GOD_MODE_ACTIVE 
      ? Number.MAX_SAFE_INTEGER / 100 
      : INITIAL_MONEY + startingMoneyBonus;

    setPlayerStats(prev => ({
      ...prev,
      money: moneyAfterPrestige,
      investmentsValue: 0,
      stockHoldings: [],
      prestigePoints: GOD_MODE_ACTIVE ? 9999 : prev.prestigePoints + actualNewPrestigePoints,
      timesPrestiged: GOD_MODE_ACTIVE ? 999 : prev.timesPrestiged + 1,
      // unlockedSkillIds are intentionally persisted through prestige
    }));
    setBusinesses(INITIAL_BUSINESSES.map(biz => ({
      ...biz, level: 0, managerOwned: false, 
      upgrades: biz.upgrades ? biz.upgrades.map(upg => ({ ...upg, isPurchased: false })) : [],
    })));
    if(!GOD_MODE_ACTIVE) toast({ title: "Prestige Successful!", description: `Earned ${actualNewPrestigePoints} prestige point(s)! Game reset. Starting money now $${moneyAfterPrestige.toLocaleString('en-US')}.` });
  }, [playerStats.money, playerStats.timesPrestiged, playerStats.prestigePoints, playerStats.unlockedSkillIds, businesses, toast, skillTreeState]);

  const unlockSkillNode = (skillId: string) => {
    const skill = skillTreeState.find(s => s.id === skillId);
    if (!skill) {
      if(!GOD_MODE_ACTIVE) toast({ title: "Skill Not Found", variant: "destructive" });
      return;
    }
    if (playerStats.unlockedSkillIds.includes(skillId)) {
      if(!GOD_MODE_ACTIVE) toast({ title: "Skill Already Unlocked", variant: "default" });
      return;
    }

    if (playerStats.prestigePoints < skill.cost && !GOD_MODE_ACTIVE) { 
        toast({ title: "Not Enough Prestige Points", description: `Need ${skill.cost} PP. You have ${playerStats.prestigePoints}.`, variant: "destructive" });
        return;
    }
    if (skill.dependencies && skill.dependencies.some(depId => !playerStats.unlockedSkillIds.includes(depId)) && !GOD_MODE_ACTIVE) { 
        toast({ title: "Dependencies Not Met", description: "Unlock prerequisite skills first.", variant: "destructive" });
        return;
    }
    
    setPlayerStats(prev => ({
      ...prev,
      prestigePoints: GOD_MODE_ACTIVE ? prev.prestigePoints : prev.prestigePoints - skill.cost,
      unlockedSkillIds: [...prev.unlockedSkillIds, skillId],
    }));

    if(!GOD_MODE_ACTIVE) toast({ title: "Skill Unlocked!", description: `${skill.name} is now active.` });
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

    

    
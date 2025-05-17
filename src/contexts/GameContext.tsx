
"use client";

import type { Business, BusinessUpgrade, PlayerStats, Stock, StockHolding, SkillNode } from '@/types';
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
  getPrestigePointBoostPercent
} from '@/config/game-config';
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";

interface GameContextType {
  playerStats: PlayerStats;
  businesses: Business[];
  stocks: Stock[];
  skillTree: SkillNode[]; // All available skills
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
  
  const [businesses, setBusinesses] = useState<Business[]>(() => 
    INITIAL_BUSINESSES.map(biz => ({
      ...biz,
      level: 0,
      upgrades: biz.upgrades ? biz.upgrades.map(upg => ({ ...upg, isPurchased: false })) : [],
    }))
  );

  const [stocks, setStocks] = useState<Stock[]>(INITIAL_STOCKS);
  const [skillTree] = useState<SkillNode[]>(INITIAL_SKILL_TREE);


  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    money: INITIAL_MONEY,
    totalIncomePerSecond: 0,
    investmentsValue: 0,
    stockHoldings: [],
    prestigePoints: INITIAL_PRESTIGE_POINTS,
    timesPrestiged: INITIAL_TIMES_PRESTIGED,
    unlockedSkillIds: INITIAL_UNLOCKED_SKILL_IDS,
  });

  const getBusinessIncome = useCallback((businessId: string): number => {
    const business = businesses.find(b => b.id === businessId);
    return business ? calculateIncome(business, playerStats.unlockedSkillIds, skillTree) : 0;
  }, [businesses, playerStats.unlockedSkillIds, skillTree]);
  
  const getBusinessUpgradeCost = useCallback((businessId: string): number => {
    const business = businesses.find(b => b.id === businessId);
    return business ? calculateUpgradeCost(business, playerStats.unlockedSkillIds, skillTree) : 0;
  }, [businesses, playerStats.unlockedSkillIds, skillTree]);

  // Effect to update total income per second
  useEffect(() => {
    const totalBusinessIncome = businesses.reduce((sum, biz) => sum + getBusinessIncome(biz.id), 0);
    
    let dividendIncome = 0;
    for (const holding of playerStats.stockHoldings) {
      const stock = stocks.find(s => s.id === holding.stockId);
      if (stock) {
        dividendIncome += holding.shares * stock.price * stock.dividendYield;
      }
    }
    setPlayerStats(prev => ({ ...prev, totalIncomePerSecond: totalBusinessIncome + dividendIncome }));
  }, [businesses, getBusinessIncome, playerStats.stockHoldings, stocks, playerStats.unlockedSkillIds]); // Added unlockedSkillIds

  // Game loop for money and investment value
  useEffect(() => {
    const gameLoop = setInterval(() => {
      setPlayerStats(prev => {
        let currentInvestmentsValue = 0;
        for (const holding of prev.stockHoldings) {
          const stock = stocks.find(s => s.id === holding.stockId);
          if (stock) {
            currentInvestmentsValue += holding.shares * stock.price;
          }
        }
        return {
          ...prev,
          money: prev.money + prev.totalIncomePerSecond,
          investmentsValue: currentInvestmentsValue,
        };
      });
    }, 1000); 

    return () => clearInterval(gameLoop);
  }, [playerStats.totalIncomePerSecond, stocks]);

  const upgradeBusiness = (businessId: string) => {
    const business = businesses.find(b => b.id === businessId);
    if (!business) return;

    const requiredPrestiges = business.requiredTimesPrestiged || 0;
    if (playerStats.timesPrestiged < requiredPrestiges) {
       toast({ title: "Locked", description: `This business requires ${requiredPrestiges} prestige(s) to operate.`, variant: "destructive"});
       return;
    }

    if (business.level >= MAX_BUSINESS_LEVEL) {
      toast({ title: "Max Level Reached!", description: `${business.name} is already at the maximum level.`, variant: "default" });
      return;
    }

    const cost = getBusinessUpgradeCost(business.id);
    if (playerStats.money >= cost) {
      setPlayerStats(prev => ({ ...prev, money: prev.money - cost }));
      setBusinesses(prevBusinesses =>
        prevBusinesses.map(b =>
          b.id === businessId ? { ...b, level: b.level + 1 } : b
        )
      );
      toast({ title: "Business Leveled Up!", description: `${business.name} is now level ${business.level + 1}.` });
    } else {
      toast({ title: "Not enough money!", description: `You need $${cost.toLocaleString('en-US')} to level up ${business.name}.`, variant: "destructive" });
    }
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
    if (playerStats.money < upgrade.cost) {
      toast({ title: "Not Enough Money", description: `You need $${upgrade.cost.toLocaleString('en-US')} to purchase ${upgrade.name}.`, variant: "destructive" });
      return;
    }

    setPlayerStats(prev => ({ ...prev, money: prev.money - upgrade.cost }));
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
    if (playerStats.timesPrestiged < 2) { // Assuming stocks unlock at prestige 2
        toast({ title: "Stocks Locked", description: "You need to prestige at least 2 times to access the stock market.", variant: "destructive" });
        return;
    }
    if (sharesToBuyInput <= 0) {
      toast({ title: "Invalid Amount", description: "Number of shares must be positive.", variant: "destructive" });
      return;
    }
    const stock = stocks.find(s => s.id === stockId);
    if (!stock) {
      toast({ title: "Stock Not Found", description: "This stock does not exist.", variant: "destructive" });
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
    const stock = stocks.find(s => s.id === stockId);
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
    if (playerStats.money < moneyRequiredForPrestige) {
      toast({ title: "Not Enough Money", description: `Need $${moneyRequiredForPrestige.toLocaleString('en-US')} to prestige.`, variant: "destructive" });
      return;
    }
    const totalLevels = businesses.reduce((sum, b) => sum + b.level, 0);
    let basePrestigePointsEarned = Math.max(1, Math.floor(totalLevels / 50));
    
    const prestigeBoostPercent = getPrestigePointBoostPercent(playerStats.unlockedSkillIds, skillTree);
    const actualPrestigePointsEarned = Math.floor(basePrestigePointsEarned * (1 + prestigeBoostPercent / 100));

    const startingMoneyBonus = getStartingMoneyBonus(playerStats.unlockedSkillIds, skillTree);

    setPlayerStats(prev => ({
      ...prev,
      money: INITIAL_MONEY + startingMoneyBonus,
      investmentsValue: 0,
      stockHoldings: [],
      prestigePoints: prev.prestigePoints + actualPrestigePointsEarned,
      timesPrestiged: prev.timesPrestiged + 1,
      // unlockedSkillIds remain
    }));
    setBusinesses(INITIAL_BUSINESSES.map(biz => ({
      ...biz, level: 0, managerOwned: false, 
      upgrades: biz.upgrades ? biz.upgrades.map(upg => ({ ...upg, isPurchased: false })) : [],
    })));
    toast({ title: "Prestige Successful!", description: `Earned ${actualPrestigePointsEarned} prestige point(s)! Game reset. Starting money boosted by $${startingMoneyBonus.toLocaleString('en-US')}.` });
  }, [playerStats.money, playerStats.unlockedSkillIds, businesses, toast, skillTree]);

  const unlockSkillNode = (skillId: string) => {
    const skill = skillTree.find(s => s.id === skillId);
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
      stocks,
      skillTree,
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

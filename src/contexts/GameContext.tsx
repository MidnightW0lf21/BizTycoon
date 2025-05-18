
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
  
  // --- GOD MODE TOGGLE ---
  // Set to true to enable god mode for testing (unlimited money, all unlocks)
  // Set to false for normal gameplay.
  const GOD_MODE_ACTIVE = true; 
  // --- END GOD MODE TOGGLE ---

  const [skillTreeState] = useState<SkillNode[]>(INITIAL_SKILL_TREE); // Renamed to avoid conflict with prop

  const [playerStats, setPlayerStats] = useState<PlayerStats>(() => {
    let initialUnlockedSkills = [...INITIAL_UNLOCKED_SKILL_IDS];
    let initialTimesPrestiged = INITIAL_TIMES_PRESTIGED;
    let initialPrestigePoints = INITIAL_PRESTIGE_POINTS;
    let baseMoney = INITIAL_MONEY;

    if (GOD_MODE_ACTIVE) {
      initialUnlockedSkills = skillTreeState.map(skill => skill.id);
      initialTimesPrestiged = 100; // High enough to unlock all prestige-gated content
      initialPrestigePoints = 1000000; // Abundant prestige points
      baseMoney = Number.MAX_SAFE_INTEGER / 100; // Effectively infinite money for game purposes
      console.log("--- GOD MODE ACTIVATED ---");
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

  const [stocks, setStocks] = useState<Stock[]>(INITIAL_STOCKS);


  const getBusinessIncome = useCallback((businessId: string): number => {
    const business = businesses.find(b => b.id === businessId);
    return business ? calculateIncome(business, playerStats.unlockedSkillIds, skillTreeState) : 0;
  }, [businesses, playerStats.unlockedSkillIds, skillTreeState]);
  
  const getBusinessUpgradeCost = useCallback((businessId: string): number => {
    const business = businesses.find(b => b.id === businessId);
    return business ? calculateUpgradeCost(business, playerStats.unlockedSkillIds, skillTreeState) : 0;
  }, [businesses, playerStats.unlockedSkillIds, skillTreeState]);

  // Effect to update total income per second
  useEffect(() => {
    const totalBusinessIncome = businesses.reduce((sum, biz) => sum + getBusinessIncome(biz.id), 0);
    
    let dividendIncome = 0;
    for (const holding of playerStats.stockHoldings) {
      const stockDetails = stocks.find(s => s.id === holding.stockId);
      if (stockDetails) {
        dividendIncome += holding.shares * stockDetails.price * stockDetails.dividendYield;
      }
    }
    setPlayerStats(prev => ({ ...prev, totalIncomePerSecond: totalBusinessIncome + dividendIncome }));
  }, [businesses, getBusinessIncome, playerStats.stockHoldings, stocks, playerStats.unlockedSkillIds]);

  // Game loop for money and investment value
  useEffect(() => {
    const gameLoop = setInterval(() => {
      setPlayerStats(prev => {
        // Only add income if not in god mode, otherwise money is already maxed.
        const newMoney = GOD_MODE_ACTIVE ? prev.money : prev.money + prev.totalIncomePerSecond;
        
        let currentInvestmentsValue = 0;
        for (const holding of prev.stockHoldings) {
          const stockDetails = stocks.find(s => s.id === holding.stockId);
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
  }, [playerStats.totalIncomePerSecond, stocks]); // GOD_MODE_ACTIVE dependency removed from here as it only affects initial setup or money gain logic

  const upgradeBusiness = (businessId: string) => {
    const business = businesses.find(b => b.id === businessId);
    if (!business) return;

    const requiredPrestiges = business.requiredTimesPrestiged || 0;
    // Bypass prestige check if in god mode
    if (!GOD_MODE_ACTIVE && playerStats.timesPrestiged < requiredPrestiges) {
       toast({ title: "Locked", description: `This business requires ${requiredPrestiges} prestige(s) to operate.`, variant: "destructive"});
       return;
    }

    if (business.level >= MAX_BUSINESS_LEVEL) {
      toast({ title: "Max Level Reached!", description: `${business.name} is already at the maximum level.`, variant: "default" });
      return;
    }

    const cost = getBusinessUpgradeCost(business.id);
    // Bypass cost check if in god mode
    if (!GOD_MODE_ACTIVE && playerStats.money < cost) {
      toast({ title: "Not enough money!", description: `You need $${cost.toLocaleString('en-US')} to level up ${business.name}.`, variant: "destructive" });
      return;
    }

    setPlayerStats(prev => ({ ...prev, money: GOD_MODE_ACTIVE ? prev.money : prev.money - cost }));
    setBusinesses(prevBusinesses =>
      prevBusinesses.map(b =>
        b.id === businessId ? { ...b, level: b.level + 1 } : b
      )
    );
    if (!GOD_MODE_ACTIVE) { // Don't toast for every click in god mode
        toast({ title: "Business Leveled Up!", description: `${business.name} is now level ${business.level + 1}.` });
    }
  };

  const purchaseBusinessUpgrade = (businessId: string, upgradeId: string) => {
    const business = businesses.find(b => b.id === businessId);
    if (!business || !business.upgrades) return;

    const requiredPrestiges = business.requiredTimesPrestiged || 0;
     // Bypass prestige check if in god mode
    if (!GOD_MODE_ACTIVE && playerStats.timesPrestiged < requiredPrestiges) {
       toast({ title: "Locked", description: `This business requires ${requiredPrestiges} prestige(s) to operate.`, variant: "destructive"});
       return;
    }

    const upgrade = business.upgrades.find(u => u.id === upgradeId);
    if (!upgrade) return;

    if (upgrade.isPurchased) {
      // No toast in god mode for already purchased
      if (!GOD_MODE_ACTIVE) toast({ title: "Already Owned", description: "You already own this upgrade.", variant: "default" });
      return;
    }
    if (business.level < upgrade.requiredLevel) {
      // No toast in god mode for level req
      if(!GOD_MODE_ACTIVE) toast({ title: "Level Requirement Not Met", description: `${business.name} must be level ${upgrade.requiredLevel} for this upgrade.`, variant: "destructive" });
      return;
    }
    // Bypass cost check if in god mode
    if (!GOD_MODE_ACTIVE && playerStats.money < upgrade.cost) {
      toast({ title: "Not Enough Money", description: `You need $${upgrade.cost.toLocaleString('en-US')} to purchase ${upgrade.name}.`, variant: "destructive" });
      return;
    }

    setPlayerStats(prev => ({ ...prev, money: GOD_MODE_ACTIVE ? prev.money : prev.money - upgrade.cost }));
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
    // Bypass prestige check if in god mode
    if (!GOD_MODE_ACTIVE && playerStats.timesPrestiged < 2) {
        toast({ title: "Stocks Locked", description: "You need to prestige at least 2 times to access the stock market.", variant: "destructive" });
        return;
    }
    if (sharesToBuyInput <= 0) {
      if(!GOD_MODE_ACTIVE) toast({ title: "Invalid Amount", description: "Number of shares must be positive.", variant: "destructive" });
      return;
    }
    const stock = stocks.find(s => s.id === stockId);
    if (!stock) {
      if(!GOD_MODE_ACTIVE) toast({ title: "Stock Not Found", description: "This stock does not exist.", variant: "destructive" });
      return;
    }

    const existingHolding = playerStats.stockHoldings.find(h => h.stockId === stockId);
    const sharesAlreadyOwnedByPlayer = existingHolding?.shares || 0;
    const sharesAvailableToBuy = stock.totalOutstandingShares - sharesAlreadyOwnedByPlayer;

    if (sharesAvailableToBuy <= 0 && !GOD_MODE_ACTIVE) { // God mode can buy past total
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
     if (!GOD_MODE_ACTIVE && playerStats.timesPrestiged < 2) {
        toast({ title: "Stocks Locked", description: "You need to prestige at least 2 times to access the stock market.", variant: "destructive" });
        return;
    }
    if (sharesToSell <= 0) {
      if(!GOD_MODE_ACTIVE) toast({ title: "Invalid Amount", description: "Number of shares must be positive.", variant: "destructive" });
      return;
    }
    const stock = stocks.find(s => s.id === stockId);
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
      // In God mode, money isn't increased by selling as it's already maxed.
      return { ...prev, money: GOD_MODE_ACTIVE ? prev.money : prev.money + earnings, stockHoldings: newHoldings };
    });
    if(!GOD_MODE_ACTIVE) toast({ title: "Stock Sold!", description: `Sold ${sharesToSell.toLocaleString('en-US')} share(s) of ${stock.companyName}.` });
  };

  const performPrestige = useCallback(() => {
    // God mode bypasses prestige requirements and offers no points if already maxed out effectively
    if (GOD_MODE_ACTIVE) {
        toast({ title: "God Mode Active", description: "Prestige is disabled in God Mode or has no effect.", variant: "default" });
        return;
    }

    const moneyRequiredForPrestige = 1000000;
    if (playerStats.money < moneyRequiredForPrestige) {
      toast({ title: "Not Enough Money", description: `Need $${moneyRequiredForPrestige.toLocaleString('en-US')} to prestige.`, variant: "destructive" });
      return;
    }
    const totalLevels = businesses.reduce((sum, b) => sum + b.level, 0);
    let basePrestigePointsEarned = Math.max(1, Math.floor(totalLevels / 75)); // Changed 50 to 75
    
    const prestigeBoostPercent = getPrestigePointBoostPercent(playerStats.unlockedSkillIds, skillTreeState);
    const actualPrestigePointsEarned = Math.floor(basePrestigePointsEarned * (1 + prestigeBoostPercent / 100));

    const startingMoneyBonus = getStartingMoneyBonus(playerStats.unlockedSkillIds, skillTreeState);

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
  }, [playerStats.money, playerStats.unlockedSkillIds, businesses, toast, skillTreeState, GOD_MODE_ACTIVE]);

  const unlockSkillNode = (skillId: string) => {
    const skill = skillTreeState.find(s => s.id === skillId);
    if (!skill) {
      if(!GOD_MODE_ACTIVE) toast({ title: "Skill Not Found", variant: "destructive" });
      return;
    }
    if (playerStats.unlockedSkillIds.includes(skillId)) {
      // No toast in god mode for already unlocked
      if(!GOD_MODE_ACTIVE) toast({ title: "Skill Already Unlocked", variant: "default" });
      return;
    }

    // Bypass checks if in God Mode, as all skills are pre-unlocked effectively or points are abundant
    if (!GOD_MODE_ACTIVE) {
        if (playerStats.prestigePoints < skill.cost) {
            toast({ title: "Not Enough Prestige Points", description: `Need ${skill.cost} PP. You have ${playerStats.prestigePoints}.`, variant: "destructive" });
            return;
        }
        if (skill.dependencies && skill.dependencies.some(depId => !playerStats.unlockedSkillIds.includes(depId))) {
            toast({ title: "Dependencies Not Met", description: "Unlock prerequisite skills first.", variant: "destructive" });
            return;
        }
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
      stocks,
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


    
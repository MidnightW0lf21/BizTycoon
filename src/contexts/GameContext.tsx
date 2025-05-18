
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
  getPrestigePointBoostPercent,
  calculateDiminishingPrestigePoints
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
  // Set to true for effectively infinite money.
  // Prestige points, times prestiged, and unlocked skills will start at their normal defaults.
  const GOD_MODE_ACTIVE = true; 
  // --- END GOD MODE TOGGLE ---

  const [skillTreeState] = useState<SkillNode[]>(INITIAL_SKILL_TREE);

  const [playerStats, setPlayerStats] = useState<PlayerStats>(() => {
    let baseMoney = INITIAL_MONEY;
    let initialUnlockedSkills = [...INITIAL_UNLOCKED_SKILL_IDS]; // Start with default
    let initialTimesPrestiged = INITIAL_TIMES_PRESTIGED; // Start with default
    let initialPrestigePoints = INITIAL_PRESTIGE_POINTS; // Start with default

    if (GOD_MODE_ACTIVE) {
      baseMoney = Number.MAX_SAFE_INTEGER / 100; // Effectively infinite money
      console.log("--- GOD MODE ACTIVATED: Infinite Money ---");
      // Prestige points, times prestiged, and unlocked skills remain at their normal initial values
      // The main benefit of god mode is now cash for testing upgrades, not skipping progression.
    }
    
    // Starting money bonus from skills should still apply if any skills are somehow initially unlocked
    // or if this is calculated after a prestige in a god-mode-like scenario (though prestige itself isn't god-moded).
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
  }, [playerStats.totalIncomePerSecond, stocks]);

  const upgradeBusiness = (businessId: string) => {
    const business = businesses.find(b => b.id === businessId);
    if (!business) return;

    const requiredPrestiges = business.requiredTimesPrestiged || 0;
    if (playerStats.timesPrestiged < requiredPrestiges && !GOD_MODE_ACTIVE) { // God mode still respects prestige locks for businesses unless explicitly bypassed elsewhere
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
    if (business.level < upgrade.requiredLevel && !GOD_MODE_ACTIVE) { // God mode might bypass level req for upgrades
      if(!GOD_MODE_ACTIVE) toast({ title: "Level Requirement Not Met", description: `${business.name} must be level ${upgrade.requiredLevel} for this upgrade.`, variant: "destructive" });
      return;
    }
    if (playerStats.money < upgrade.cost && !GOD_MODE_ACTIVE) {
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
    if (playerStats.timesPrestiged < 2 && !GOD_MODE_ACTIVE) { // God mode respects prestige locks for stocks
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
      return { ...prev, money: GOD_MODE_ACTIVE ? prev.money : prev.money + earnings, stockHoldings: newHoldings };
    });
    if(!GOD_MODE_ACTIVE) toast({ title: "Stock Sold!", description: `Sold ${sharesToSell.toLocaleString('en-US')} share(s) of ${stock.companyName}.` });
  };

  const performPrestige = useCallback(() => {
    if (GOD_MODE_ACTIVE) {
        toast({ title: "God Mode Active", description: "Prestige is a normal operation in this God Mode; it will reset cash per normal prestige.", variant: "default" });
        // Prestige still resets things, but you'll get infinite cash again if you re-enable god mode or if it applies post-prestige.
        // This is a bit of a design choice; currently, prestige resets money to INITIAL_MONEY + bonus.
        // If god mode is active, it might be confusing. Let's make prestige just not award god-like cash.
    }

    const moneyRequiredForPrestige = 1000000;
    if (playerStats.money < moneyRequiredForPrestige && playerStats.timesPrestiged === 0) { // First prestige still needs money
      toast({ title: "Not Enough Money", description: `Need $${moneyRequiredForPrestige.toLocaleString('en-US')} to prestige for the first time.`, variant: "destructive" });
      return;
    }

    const totalLevels = businesses.reduce((sum, b) => sum + b.level, 0);
    let basePrestigePointsEarned = calculateDiminishingPrestigePoints(totalLevels);
    
    const prestigeBoostPercent = getPrestigePointBoostPercent(playerStats.unlockedSkillIds, skillTreeState);
    const actualPrestigePointsEarned = Math.floor(basePrestigePointsEarned * (1 + prestigeBoostPercent / 100));

    const startingMoneyBonus = getStartingMoneyBonus(playerStats.unlockedSkillIds, skillTreeState);
    
    // Determine the money after prestige. If God Mode is active, it will be MAX_SAFE_INTEGER again.
    // Otherwise, it's INITIAL_MONEY + bonus.
    const moneyAfterPrestige = GOD_MODE_ACTIVE 
      ? Number.MAX_SAFE_INTEGER / 100 
      : INITIAL_MONEY + startingMoneyBonus;


    setPlayerStats(prev => ({
      ...prev,
      money: moneyAfterPrestige,
      investmentsValue: 0,
      stockHoldings: [],
      prestigePoints: prev.prestigePoints + actualPrestigePointsEarned,
      timesPrestiged: prev.timesPrestiged + 1,
    }));
    setBusinesses(INITIAL_BUSINESSES.map(biz => ({
      ...biz, level: 0, managerOwned: false, 
      upgrades: biz.upgrades ? biz.upgrades.map(upg => ({ ...upg, isPurchased: false })) : [],
    })));
    toast({ title: "Prestige Successful!", description: `Earned ${actualPrestigePointsEarned} prestige point(s)! Game reset. Starting money now $${moneyAfterPrestige.toLocaleString('en-US')}.` });
  }, [playerStats.money, playerStats.timesPrestiged, playerStats.unlockedSkillIds, businesses, toast, skillTreeState, GOD_MODE_ACTIVE]);

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

    if (playerStats.prestigePoints < skill.cost && !GOD_MODE_ACTIVE) { // God mode bypasses PP cost for skills
        toast({ title: "Not Enough Prestige Points", description: `Need ${skill.cost} PP. You have ${playerStats.prestigePoints}.`, variant: "destructive" });
        return;
    }
    if (skill.dependencies && skill.dependencies.some(depId => !playerStats.unlockedSkillIds.includes(depId)) && !GOD_MODE_ACTIVE) { // God mode bypasses dependencies
        toast({ title: "Dependencies Not Met", description: "Unlock prerequisite skills first.", variant: "destructive" });
        return;
    }
    

    setPlayerStats(prev => ({
      ...prev,
      prestigePoints: GOD_MODE_ACTIVE ? prev.prestigePoints : prev.prestigePoints - skill.cost,
      unlockedSkillIds: [...prev.unlockedSkillIds, skillId],
    }));

    // Apply starting money bonus immediately if that skill is unlocked
    if (skill.effects.increaseStartingMoney && !GOD_MODE_ACTIVE) { // Don't add more money if already in god mode
        setPlayerStats(prev => ({...prev, money: prev.money + (skill.effects.increaseStartingMoney || 0)}));
    }

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

    
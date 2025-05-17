
"use client";

import type { Business, BusinessUpgrade, PlayerStats, Stock, StockHolding } from '@/types';
import { INITIAL_BUSINESSES, INITIAL_MONEY, calculateIncome, calculateUpgradeCost, MAX_BUSINESS_LEVEL, INITIAL_STOCKS } from '@/config/game-config';
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";

interface GameContextType {
  playerStats: PlayerStats;
  businesses: Business[];
  stocks: Stock[];
  upgradeBusiness: (businessId: string) => void;
  purchaseBusinessUpgrade: (businessId: string, upgradeId: string) => void;
  getBusinessIncome: (businessId: string) => number;
  getBusinessUpgradeCost: (businessId: string) => number;
  buyStock: (stockId: string, sharesToBuy: number) => void;
  sellStock: (stockId: string, sharesToSell: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  
  const [businesses, setBusinesses] = useState<Business[]>(() => 
    INITIAL_BUSINESSES.map(biz => ({
      ...biz,
      upgrades: biz.upgrades ? biz.upgrades.map(upg => ({ ...upg, isPurchased: false })) : [],
    }))
  );

  const [stocks, setStocks] = useState<Stock[]>(INITIAL_STOCKS);

  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    money: INITIAL_MONEY,
    totalIncomePerSecond: 0,
    investmentsValue: 0,
    stockHoldings: [],
  });

  const getBusinessIncome = useCallback((businessId: string): number => {
    const business = businesses.find(b => b.id === businessId);
    return business ? calculateIncome(business) : 0;
  }, [businesses]);
  
  const getBusinessUpgradeCost = useCallback((businessId: string): number => {
    const business = businesses.find(b => b.id === businessId);
    return business ? calculateUpgradeCost(business) : 0;
  }, [businesses]);

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
  }, [businesses, getBusinessIncome, playerStats.stockHoldings, stocks]);

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
  }, [playerStats.totalIncomePerSecond, stocks]); // stocks dependency added for investment value recalculation if prices change (future)

  const upgradeBusiness = (businessId: string) => {
    const business = businesses.find(b => b.id === businessId);
    if (!business) return;

    if (business.level >= MAX_BUSINESS_LEVEL) {
      toast({
        title: "Max Level Reached!",
        description: `${business.name} is already at the maximum level (${MAX_BUSINESS_LEVEL}).`,
        variant: "default",
      });
      return;
    }

    const cost = getBusinessUpgradeCost(business.id);
    if (playerStats.money >= cost) {
      setPlayerStats(prev => ({ ...prev, money: prev.money - cost }));
      setBusinesses(prevBusinesses =>
        prevBusinesses.map(b =>
          b.id === businessId
            ? { ...b, level: b.level + 1 }
            : b
        )
      );
      toast({
        title: "Business Leveled Up!",
        description: `${business.name} is now level ${business.level + 1}.`,
      });
    } else {
      toast({
        title: "Not enough money!",
        description: `You need $${cost.toLocaleString()} to level up ${business.name}.`,
        variant: "destructive",
      });
    }
  };

  const purchaseBusinessUpgrade = (businessId: string, upgradeId: string) => {
    const business = businesses.find(b => b.id === businessId);
    if (!business || !business.upgrades) return;

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
      toast({ title: "Not Enough Money", description: `You need $${upgrade.cost.toLocaleString()} to purchase ${upgrade.name}.`, variant: "destructive" });
      return;
    }

    setPlayerStats(prev => ({ ...prev, money: prev.money - upgrade.cost }));
    setBusinesses(prevBusinesses =>
      prevBusinesses.map(b =>
        b.id === businessId
          ? {
              ...b,
              upgrades: b.upgrades?.map(u =>
                u.id === upgradeId ? { ...u, isPurchased: true } : u
              ),
            }
          : b
      )
    );

    toast({
      title: "Upgrade Purchased!",
      description: `${upgrade.name} for ${business.name} is now active.`,
    });
  };

  const buyStock = (stockId: string, sharesToBuy: number) => {
    if (sharesToBuy <= 0) {
      toast({ title: "Invalid Amount", description: "Number of shares must be positive.", variant: "destructive" });
      return;
    }
    const stock = stocks.find(s => s.id === stockId);
    if (!stock) {
      toast({ title: "Stock Not Found", description: "This stock does not exist.", variant: "destructive" });
      return;
    }

    const cost = stock.price * sharesToBuy;
    if (playerStats.money < cost) {
      toast({ title: "Not Enough Money", description: `You need $${cost.toLocaleString()} to buy ${sharesToBuy} share(s) of ${stock.ticker}.`, variant: "destructive" });
      return;
    }

    setPlayerStats(prev => {
      const existingHolding = prev.stockHoldings.find(h => h.stockId === stockId);
      let newHoldings: StockHolding[];

      if (existingHolding) {
        const totalShares = existingHolding.shares + sharesToBuy;
        const totalCost = (existingHolding.averagePurchasePrice * existingHolding.shares) + (stock.price * sharesToBuy);
        const newAveragePrice = totalCost / totalShares;
        newHoldings = prev.stockHoldings.map(h => 
          h.stockId === stockId ? { ...h, shares: totalShares, averagePurchasePrice: newAveragePrice } : h
        );
      } else {
        newHoldings = [...prev.stockHoldings, { stockId, shares: sharesToBuy, averagePurchasePrice: stock.price }];
      }
      return { ...prev, money: prev.money - cost, stockHoldings: newHoldings };
    });

    toast({ title: "Stock Purchased!", description: `Bought ${sharesToBuy} share(s) of ${stock.companyName} (${stock.ticker}).` });
  };

  const sellStock = (stockId: string, sharesToSell: number) => {
    if (sharesToSell <= 0) {
      toast({ title: "Invalid Amount", description: "Number of shares must be positive.", variant: "destructive" });
      return;
    }
    const stock = stocks.find(s => s.id === stockId);
    if (!stock) {
      toast({ title: "Stock Not Found", description: "This stock does not exist.", variant: "destructive" });
      return;
    }

    const existingHolding = playerStats.stockHoldings.find(h => h.stockId === stockId);
    if (!existingHolding || existingHolding.shares < sharesToSell) {
      toast({ title: "Not Enough Shares", description: `You don't own enough shares of ${stock.ticker} to sell. You have ${existingHolding?.shares || 0}.`, variant: "destructive" });
      return;
    }

    const earnings = stock.price * sharesToSell;
    setPlayerStats(prev => {
      let newHoldings: StockHolding[];
      if (existingHolding.shares === sharesToSell) {
        newHoldings = prev.stockHoldings.filter(h => h.stockId !== stockId);
      } else {
        newHoldings = prev.stockHoldings.map(h =>
          h.stockId === stockId ? { ...h, shares: h.shares - sharesToSell } : h
        );
      }
      return { ...prev, money: prev.money + earnings, stockHoldings: newHoldings };
    });

    toast({ title: "Stock Sold!", description: `Sold ${sharesToSell} share(s) of ${stock.companyName} (${stock.ticker}).` });
  };


  return (
    <GameContext.Provider value={{ 
      playerStats, 
      businesses, 
      stocks,
      upgradeBusiness,
      purchaseBusinessUpgrade,
      getBusinessIncome, 
      getBusinessUpgradeCost,
      buyStock,
      sellStock,
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

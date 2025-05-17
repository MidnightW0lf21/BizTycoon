"use client";

import type { Business, PlayerStats, RiskTolerance } from '@/types';
import { INITIAL_BUSINESSES, INITIAL_MONEY, calculateIncome, calculateUpgradeCost } from '@/config/game-config';
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";

interface GameContextType {
  playerStats: PlayerStats;
  businesses: Business[];
  upgradeBusiness: (businessId: string) => void;
  getBusinessIncome: (businessId: string) => number;
  getBusinessUpgradeCost: (businessId: string) => number;
  lastMarketTrends: string;
  setLastMarketTrends: (trends: string) => void;
  lastRiskTolerance: RiskTolerance;
  setLastRiskTolerance: (risk: RiskTolerance) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [businesses, setBusinesses] = useState<Business[]>(() => 
    INITIAL_BUSINESSES.map(biz => ({
      ...biz,
    }))
  );

  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    money: INITIAL_MONEY,
    totalIncomePerSecond: 0,
    investmentsValue: 0,
  });

  const [lastMarketTrends, setLastMarketTrends] = useState<string>("The market is stable with moderate growth in tech stocks.");
  const [lastRiskTolerance, setLastRiskTolerance] = useState<RiskTolerance>("medium");

  const getBusinessIncome = useCallback((businessId: string): number => {
    const business = businesses.find(b => b.id === businessId);
    return business ? calculateIncome(business) : 0;
  }, [businesses]);
  
  const getBusinessUpgradeCost = useCallback((businessId: string): number => {
    const business = businesses.find(b => b.id === businessId);
    return business ? calculateUpgradeCost(business) : 0;
  }, [businesses]);

  useEffect(() => {
    const totalIncome = businesses.reduce((sum, biz) => sum + getBusinessIncome(biz.id), 0);
    setPlayerStats(prev => ({ ...prev, totalIncomePerSecond: totalIncome }));
  }, [businesses, getBusinessIncome]);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      setPlayerStats(prev => ({
        ...prev,
        money: prev.money + prev.totalIncomePerSecond,
      }));
    }, 1000); // Income generated every second

    return () => clearInterval(gameLoop);
  }, [playerStats.totalIncomePerSecond]);

  const upgradeBusiness = (businessId: string) => {
    const business = businesses.find(b => b.id === businessId);
    if (!business) return;

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
        title: "Business Upgraded!",
        description: `${business.name} is now level ${business.level + 1}.`,
      });
    } else {
      toast({
        title: "Not enough money!",
        description: `You need $${cost.toLocaleString()} to upgrade ${business.name}.`,
        variant: "destructive",
      });
    }
  };

  return (
    <GameContext.Provider value={{ 
      playerStats, 
      businesses, 
      upgradeBusiness, 
      getBusinessIncome, 
      getBusinessUpgradeCost,
      lastMarketTrends,
      setLastMarketTrends,
      lastRiskTolerance,
      setLastRiskTolerance
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

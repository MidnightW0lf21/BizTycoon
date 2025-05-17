
"use client";

import type { Business, BusinessUpgrade, PlayerStats } from '@/types';
import { INITIAL_BUSINESSES, INITIAL_MONEY, calculateIncome, calculateUpgradeCost, MAX_BUSINESS_LEVEL } from '@/config/game-config';
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";

interface GameContextType {
  playerStats: PlayerStats;
  businesses: Business[];
  upgradeBusiness: (businessId: string) => void;
  purchaseBusinessUpgrade: (businessId: string, upgradeId: string) => void;
  getBusinessIncome: (businessId: string) => number;
  getBusinessUpgradeCost: (businessId: string) => number;
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

  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    money: INITIAL_MONEY,
    totalIncomePerSecond: 0,
    investmentsValue: 0,
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

  return (
    <GameContext.Provider value={{ 
      playerStats, 
      businesses, 
      upgradeBusiness,
      purchaseBusinessUpgrade,
      getBusinessIncome, 
      getBusinessUpgradeCost,
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

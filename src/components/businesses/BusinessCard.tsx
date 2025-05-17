"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useGame } from "@/contexts/GameContext";
import type { Business } from "@/types";
import { Zap, DollarSign, ArrowUpCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface BusinessCardProps {
  business: Business;
}

export function BusinessCard({ business }: BusinessCardProps) {
  const { playerStats, upgradeBusiness, getBusinessIncome, getBusinessUpgradeCost } = useGame();
  const Icon = business.icon;

  const [income, setIncome] = useState(0);
  const [upgradeCost, setUpgradeCost] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(business.level);

  useEffect(() => {
    setCurrentLevel(business.level); // Sync with global state if it changes elsewhere
    setIncome(getBusinessIncome(business.id));
    setUpgradeCost(getBusinessUpgradeCost(business.id));
  }, [business.level, business.id, getBusinessIncome, getBusinessUpgradeCost]);


  const handleUpgrade = () => {
    upgradeBusiness(business.id);
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{business.name}</CardTitle>
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <CardDescription>{business.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Level:</span>
          <span className="font-semibold">{currentLevel}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Income/sec:</span>
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4 text-green-500" />
            <span className="font-semibold text-green-500">${income.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Next Upgrade:</span>
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4 text-red-500" />
            <span className="font-semibold text-red-500">${upgradeCost.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleUpgrade}
          disabled={playerStats.money < upgradeCost}
          className="w-full bg-accent text-accent-foreground hover:bg-yellow-400"
        >
          <ArrowUpCircle className="mr-2 h-5 w-5" />
          Upgrade (Lvl {currentLevel + 1})
        </Button>
      </CardFooter>
    </Card>
  );
}

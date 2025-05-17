
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useGame } from "@/contexts/GameContext";
import type { Business, BusinessUpgrade } from "@/types";
import { Zap, DollarSign, ArrowUpCircle, CheckCircle, ShoppingCart, Info, Crown } from "lucide-react";
import { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MAX_BUSINESS_LEVEL } from "@/config/game-config";

interface BusinessCardProps {
  business: Business;
}

export function BusinessCard({ business }: BusinessCardProps) {
  const { playerStats, upgradeBusiness, purchaseBusinessUpgrade, getBusinessIncome, getBusinessUpgradeCost } = useGame();
  const Icon = business.icon;

  const [income, setIncome] = useState(0);
  const [levelUpgradeCost, setLevelUpgradeCost] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(business.level);
  const [currentUpgrades, setCurrentUpgrades] = useState(business.upgrades || []);

  useEffect(() => {
    setCurrentLevel(business.level);
    setCurrentUpgrades(business.upgrades || []);
    setIncome(getBusinessIncome(business.id));
    setLevelUpgradeCost(getBusinessUpgradeCost(business.id));
  }, [business, business.level, business.upgrades, getBusinessIncome, getBusinessUpgradeCost, playerStats.money]);


  const handleLevelUpgrade = () => {
    if (currentLevel < MAX_BUSINESS_LEVEL) {
      upgradeBusiness(business.id);
    }
  };

  const handlePurchaseUpgrade = (upgradeId: string) => {
    purchaseBusinessUpgrade(business.id, upgradeId);
  };

  const isMaxLevel = currentLevel >= MAX_BUSINESS_LEVEL;
  const canAffordLevelUpgrade = playerStats.money >= levelUpgradeCost && !isMaxLevel;

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
          <span className="font-semibold">{currentLevel} / {MAX_BUSINESS_LEVEL}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Income/sec:</span>
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4 text-green-500" />
            <span className="font-semibold text-green-500">${income.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})}</span>
          </div>
        </div>
        {!isMaxLevel && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Next Level Cost:</span>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-red-500" />
              <span className="font-semibold text-red-500">${levelUpgradeCost.toLocaleString()}</span>
            </div>
          </div>
        )}
        
        {currentUpgrades && currentUpgrades.length > 0 && (
          <Accordion type="single" collapsible className="w-full mt-3">
            <AccordionItem value="upgrades">
              <AccordionTrigger className="text-sm py-2 hover:no-underline">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Business Upgrades
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 space-y-3">
                <TooltipProvider delayDuration={100}>
                  {currentUpgrades.map((upgrade) => {
                    const canAffordUpgrade = playerStats.money >= upgrade.cost;
                    const levelRequirementMet = currentLevel >= upgrade.requiredLevel;
                    const canPurchase = !upgrade.isPurchased && canAffordUpgrade && levelRequirementMet;
                    
                    return (
                      <div key={upgrade.id} className="p-3 border rounded-md bg-muted/30">
                        <div className="flex items-center justify-between">
                          <div className="flex-grow">
                            <h4 className="font-semibold text-sm">{upgrade.name}</h4>
                            <p className="text-xs text-muted-foreground">{upgrade.description}</p>
                            <div className="text-xs mt-1">
                              {!upgrade.isPurchased && (
                                <>
                                  <span>Cost: ${upgrade.cost.toLocaleString()}</span>
                                  <span className="mx-1">|</span>
                                  <span>Req. Lvl: {upgrade.requiredLevel}</span>
                                </>
                              )}
                              {upgrade.isPurchased && <Badge variant="secondary" className="text-xs">Owned</Badge>}
                            </div>
                          </div>
                          {!upgrade.isPurchased && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div> 
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handlePurchaseUpgrade(upgrade.id)}
                                    disabled={!canPurchase}
                                    className="ml-2 px-3 py-1 h-auto"
                                  >
                                    <ShoppingCart className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                { !levelRequirementMet ? <p>Requires Level {upgrade.requiredLevel}</p> :
                                  !canAffordUpgrade ? <p>Need ${upgrade.cost.toLocaleString()}</p> :
                                  <p>Purchase Upgrade</p>
                                }
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </TooltipProvider>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

      </CardContent>
      <CardFooter>
        <Button
          onClick={handleLevelUpgrade}
          disabled={!canAffordLevelUpgrade || isMaxLevel}
          className="w-full bg-accent text-accent-foreground hover:bg-yellow-400"
        >
          {isMaxLevel ? (
            <>
              <Crown className="mr-2 h-5 w-5" />
              Max Level
            </>
          ) : (
            <>
              <ArrowUpCircle className="mr-2 h-5 w-5" />
              Level Up (Lvl {currentLevel + 1})
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

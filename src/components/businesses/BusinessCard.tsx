
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useGame } from "@/contexts/GameContext";
import type { Business, BusinessUpgrade } from "@/types";
import { Zap, DollarSign, ArrowUpCircle, CheckCircle, ShoppingCart, Info, Crown, LockKeyhole } from "lucide-react";
import { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
// Removed MAX_BUSINESS_LEVEL import, will use dynamic one from context

interface BusinessCardProps {
  business: Business;
}

export function BusinessCard({ business }: BusinessCardProps) {
  const { playerStats, upgradeBusiness, purchaseBusinessUpgrade, getBusinessIncome, getBusinessUpgradeCost, getDynamicMaxBusinessLevel, skillTree } = useGame();
  const Icon = business.icon;

  const [income, setIncome] = useState(0);
  const [levelUpgradeCost, setLevelUpgradeCost] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(business.level);
  const [currentUpgrades, setCurrentUpgrades] = useState(business.upgrades || []);
  const [dynamicMaxLevel, setDynamicMaxLevel] = useState(getDynamicMaxBusinessLevel());


  const requiredPrestiges = business.requiredTimesPrestiged || 0;
  const isUnlocked = playerStats.timesPrestiged >= requiredPrestiges;

  useEffect(() => {
    setCurrentLevel(business.level);
    setCurrentUpgrades(business.upgrades || []);
    setDynamicMaxLevel(getDynamicMaxBusinessLevel());
    if (isUnlocked) {
      setIncome(getBusinessIncome(business.id));
      setLevelUpgradeCost(getBusinessUpgradeCost(business.id));
    } else {
      setIncome(0);
      setLevelUpgradeCost(0);
    }
  }, [business, business.level, business.upgrades, getBusinessIncome, getBusinessUpgradeCost, playerStats.money, playerStats.unlockedSkillIds, isUnlocked, getDynamicMaxBusinessLevel]);


  const handleLevelUpgrade = () => {
    if (!isUnlocked || currentLevel >= dynamicMaxLevel) return;
    upgradeBusiness(business.id);
  };

  const handlePurchaseUpgrade = (upgradeId: string) => {
    if (!isUnlocked) return;
    purchaseBusinessUpgrade(business.id, upgradeId);
  };

  const isMaxLevel = currentLevel >= dynamicMaxLevel;
  const canAffordLevelUpgrade = playerStats.money >= levelUpgradeCost && !isMaxLevel && isUnlocked;

  return (
    <Card className={cn("flex flex-col relative", !isUnlocked && "bg-muted/50 border-dashed")}>
      {!isUnlocked && (
        <div className="absolute inset-0 bg-background/70 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg p-4">
          <LockKeyhole className="h-12 w-12 text-primary mb-2" />
          <p className="text-center font-semibold text-primary">Locked</p>
          <p className="text-center text-sm text-muted-foreground">
            Requires {requiredPrestiges} prestige level{requiredPrestiges !== 1 ? 's' : ''} to unlock.
          </p>
           <p className="text-center text-xs text-muted-foreground"> (Currently: {playerStats.timesPrestiged})</p>
        </div>
      )}
      <CardHeader className={cn("pb-4", !isUnlocked && "opacity-50")}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{business.name}</CardTitle>
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <CardDescription>{business.description}</CardDescription>
      </CardHeader>
      <CardContent className={cn("flex-grow space-y-3", !isUnlocked && "opacity-50")}>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Level:</span>
          <span className="font-semibold">{isUnlocked ? `${currentLevel} / ${dynamicMaxLevel}` : 'N/A'}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Income/sec:</span>
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4 text-green-500" />
            <span className="font-semibold text-green-500">
              {isUnlocked ? `$${income.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 2})}` : 'N/A'}
            </span>
          </div>
        </div>
        {!isMaxLevel && isUnlocked && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Next Level Cost:</span>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-red-500" />
              <span className="font-semibold text-red-500">${levelUpgradeCost.toLocaleString('en-US')}</span>
            </div>
          </div>
        )}
        
        {currentUpgrades && currentUpgrades.length > 0 && isUnlocked && (
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
                                  <span>Cost: ${upgrade.cost.toLocaleString('en-US')}</span>
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
                                    disabled={!canPurchase || !isUnlocked}
                                    className="ml-2 px-3 py-1 h-auto"
                                  >
                                    <ShoppingCart className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                { !levelRequirementMet ? <p>Requires Level {upgrade.requiredLevel}</p> :
                                  !canAffordUpgrade ? <p>Need ${upgrade.cost.toLocaleString('en-US')}</p> :
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
      <CardFooter className={cn(!isUnlocked && "opacity-50")}>
        <Button
          onClick={handleLevelUpgrade}
          disabled={!canAffordLevelUpgrade || isMaxLevel || !isUnlocked}
          className="w-full bg-accent text-accent-foreground hover:bg-yellow-400"
        >
          {isUnlocked ? (
            isMaxLevel ? (
              <>
                <Crown className="mr-2 h-5 w-5" />
                Max Level ({dynamicMaxLevel})
              </>
            ) : (
              <>
                <ArrowUpCircle className="mr-2 h-5 w-5" />
                Level Up (Lvl {currentLevel + 1})
              </>
            )
          ) : (
            <>
              <LockKeyhole className="mr-2 h-5 w-5" />
              Locked
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

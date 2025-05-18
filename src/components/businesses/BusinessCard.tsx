
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useGame } from "@/contexts/GameContext";
import type { Business, BusinessUpgrade } from "@/types";
import { Zap, DollarSign, ArrowUpCircle, CheckCircle, ShoppingCart, Info, Crown, LockKeyhole } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type BuyAmountOption = 1 | 10 | 25 | 'MAX';

const BUY_AMOUNTS: BuyAmountOption[] = [1, 10, 25, 'MAX'];

interface BusinessCardProps {
  business: Business;
}

export function BusinessCard({ business }: BusinessCardProps) {
  const { 
    playerStats, 
    upgradeBusiness, 
    purchaseBusinessUpgrade, 
    getBusinessIncome, 
    getDynamicMaxBusinessLevel,
    calculateCostForNLevelsForDisplay,
    calculateMaxAffordableLevelsForDisplay,
    skillTree, // Get the skill tree for checking unlocks
  } = useGame();
  const Icon = business.icon;

  const [income, setIncome] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(business.level);
  const [currentUpgrades, setCurrentUpgrades] = useState(business.upgrades || []);
  const [dynamicMaxLevel, setDynamicMaxLevel] = useState(getDynamicMaxBusinessLevel());
  
  const [selectedBuyAmount, setSelectedBuyAmount] = useState<BuyAmountOption>(1);
  const [displayCost, setDisplayCost] = useState(0);
  const [levelsToBuyDisplay, setLevelsToBuyDisplay] = useState(0);
  const [canAffordUpgrade, setCanAffordUpgrade] = useState(false);

  const requiredPrestiges = business.requiredTimesPrestiged || 0;
  const isUnlocked = playerStats.timesPrestiged >= requiredPrestiges;

  const bulkBuyUnlockedForThisBusiness = useMemo(() => {
    const bulkBuySkillId = `unlock_bulk_buy_${business.id}`;
    return playerStats.unlockedSkillIds.includes(bulkBuySkillId);
  }, [playerStats.unlockedSkillIds, business.id]);

  useEffect(() => {
    if (!bulkBuyUnlockedForThisBusiness) {
      setSelectedBuyAmount(1); // Default to 1 if bulk buy isn't unlocked for this business
    }
  }, [bulkBuyUnlockedForThisBusiness]);

  useEffect(() => {
    setCurrentLevel(business.level);
    setCurrentUpgrades(business.upgrades || []);
    setDynamicMaxLevel(getDynamicMaxBusinessLevel());
    if (isUnlocked) {
      setIncome(getBusinessIncome(business.id));
    } else {
      setIncome(0);
    }
  }, [business, business.level, business.upgrades, getBusinessIncome, playerStats.timesPrestiged, isUnlocked, getDynamicMaxBusinessLevel]);

  useEffect(() => {
    if (!isUnlocked || business.level >= dynamicMaxLevel) {
      setDisplayCost(Infinity);
      setLevelsToBuyDisplay(0);
      setCanAffordUpgrade(false);
      return;
    }

    let costResult: { totalCost: number; levelsPurchasable?: number; levelsToBuy?: number };
    const currentBuyAmount = bulkBuyUnlockedForThisBusiness ? selectedBuyAmount : 1;

    if (currentBuyAmount === 'MAX') {
      costResult = calculateMaxAffordableLevelsForDisplay(business.id);
    } else {
      costResult = calculateCostForNLevelsForDisplay(business.id, currentBuyAmount);
    }
    
    const actualLevels = costResult.levelsPurchasable ?? costResult.levelsToBuy ?? 0;
    
    setDisplayCost(costResult.totalCost);
    setLevelsToBuyDisplay(actualLevels);
    setCanAffordUpgrade(playerStats.money >= costResult.totalCost && actualLevels > 0);

  }, [
    selectedBuyAmount, 
    business.id, 
    business.level, 
    playerStats.money, 
    calculateCostForNLevelsForDisplay, 
    calculateMaxAffordableLevelsForDisplay,
    dynamicMaxLevel,
    isUnlocked,
    bulkBuyUnlockedForThisBusiness
  ]);


  const handleLevelUpgrade = () => {
    if (!isUnlocked || !canAffordUpgrade || levelsToBuyDisplay === 0) return;
    
    let levelsToPassToUpgrade = 0;
    const currentBuyAmount = bulkBuyUnlockedForThisBusiness ? selectedBuyAmount : 1;

    if (currentBuyAmount === 'MAX') {
        const maxAffordable = calculateMaxAffordableLevelsForDisplay(business.id);
        levelsToPassToUpgrade = maxAffordable.levelsToBuy;
    } else {
        const potentialPurchase = calculateCostForNLevelsForDisplay(business.id, currentBuyAmount);
        levelsToPassToUpgrade = potentialPurchase.levelsPurchasable || 0;
    }
    
    if (levelsToPassToUpgrade > 0) {
        upgradeBusiness(business.id, levelsToPassToUpgrade);
    }
  };

  const handlePurchaseUpgrade = (upgradeId: string) => {
    if (!isUnlocked) return;
    purchaseBusinessUpgrade(business.id, upgradeId);
  };

  const isMaxLevel = currentLevel >= dynamicMaxLevel;

  const levelUpButtonText = useMemo(() => {
    if (!isUnlocked) return "Locked";
    if (isMaxLevel) return `Max Level (${dynamicMaxLevel})`;
    if (levelsToBuyDisplay > 0) {
      return `Level Up (+${levelsToBuyDisplay})`;
    }
    return "Cannot Afford";
  }, [isUnlocked, isMaxLevel, dynamicMaxLevel, levelsToBuyDisplay]);


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

        {isUnlocked && !isMaxLevel && bulkBuyUnlockedForThisBusiness && (
          <div className="pt-2 space-y-2">
            <Label className="text-xs text-muted-foreground">Buy Amount:</Label>
            <RadioGroup
              value={String(selectedBuyAmount)} 
              onValueChange={(value) => setSelectedBuyAmount(value as BuyAmountOption)}
              className="flex space-x-2"
            >
              {BUY_AMOUNTS.map((amount) => (
                <Label
                  key={amount}
                  htmlFor={`${business.id}-buy-${amount}`}
                  className={cn(
                    "flex items-center justify-center rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer hover:bg-accent hover:text-accent-foreground",
                    selectedBuyAmount === amount && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
                    !isUnlocked && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <RadioGroupItem value={String(amount)} id={`${business.id}-buy-${amount}`} className="sr-only" disabled={!isUnlocked} />
                  {amount === 'MAX' ? 'MAX' : `x${amount}`}
                </Label>
              ))}
            </RadioGroup>
          </div>
        )}
        
        {isUnlocked && !isMaxLevel && ( 
           <div className="pt-2 space-y-2"> 
            <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Cost for {levelsToBuyDisplay > 0 ? `+${levelsToBuyDisplay}`: (bulkBuyUnlockedForThisBusiness ? 'selected' : 'next')}:</span>
                <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-red-500" />
                    <span className="font-semibold text-red-500">
                    {isUnlocked && !isMaxLevel && levelsToBuyDisplay > 0 ? `$${displayCost.toLocaleString('en-US')}` : (isMaxLevel ? 'N/A' : 'N/A')}
                    </span>
                </div>
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
                    const canAffordThisUpgrade = playerStats.money >= upgrade.cost; 
                    const levelRequirementMet = currentLevel >= upgrade.requiredLevel;
                    const canPurchaseThisUpgrade = !upgrade.isPurchased && canAffordThisUpgrade && levelRequirementMet;
                    
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
                                    disabled={!canPurchaseThisUpgrade || !isUnlocked}
                                    className="ml-2 px-3 py-1 h-auto"
                                  >
                                    <ShoppingCart className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                { !levelRequirementMet ? <p>Requires Level {upgrade.requiredLevel}</p> :
                                  !canAffordThisUpgrade ? <p>Need ${upgrade.cost.toLocaleString('en-US')}</p> :
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
      <CardFooter className={cn("pt-2",!isUnlocked && "opacity-50")}>
        <Button
          onClick={handleLevelUpgrade}
          disabled={!canAffordUpgrade || !isUnlocked || isMaxLevel || levelsToBuyDisplay === 0}
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
                {levelUpButtonText}
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


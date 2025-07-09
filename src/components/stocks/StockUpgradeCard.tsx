
"use client";

import type { StockUpgrade } from "@/types";
import { INITIAL_STOCKS } from "@/config/game-config";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Sparkles, CheckCircle2, TrendingUp, LockKeyhole } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface StockUpgradeCardProps {
  upgrade: StockUpgrade;
  playerMoney: number;
  playerPrestigePoints: number;
  isPurchased: boolean;
  onPurchase: (upgradeId: string) => void;
}

export function StockUpgradeCard({ upgrade, playerMoney, playerPrestigePoints, isPurchased, onPurchase }: StockUpgradeCardProps) {
  const stock = INITIAL_STOCKS.find(s => s.id === upgrade.targetStockId);
  if (!stock) return null;

  const canAffordMoney = playerMoney >= upgrade.costMoney;
  const canAffordPP = upgrade.costPrestigePoints ? playerPrestigePoints >= upgrade.costPrestigePoints : true;
  const canPurchase = !isPurchased && canAffordMoney && canAffordPP;

  const getEffectText = () => {
    if (upgrade.effects.dividendYieldBoost) {
      return `+${(upgrade.effects.dividendYieldBoost * 100).toFixed(4)}% Dividend Yield`;
    }
    return "Special Effect";
  };

  return (
    <TooltipProvider>
      <Card className={cn("flex flex-col", isPurchased && "bg-primary/10 border-primary")}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <upgrade.icon className="h-5 w-5 text-primary"/>
                {upgrade.name}
              </CardTitle>
              <CardDescription className="text-xs">
                Upgrade for: <span className="font-semibold text-foreground">{stock.companyName} ({stock.ticker})</span>
              </CardDescription>
            </div>
            {isPurchased && <Badge variant="secondary"><CheckCircle2 className="mr-1 h-3 w-3" /> Purchased</Badge>}
          </div>
        </CardHeader>
        <CardContent className="flex-grow space-y-3">
          <p className="text-sm text-muted-foreground min-h-[40px]">{upgrade.description}</p>
          <div className="p-2 rounded-md bg-muted/50">
            <p className="text-sm font-semibold flex items-center gap-2 text-green-600 dark:text-green-500">
                <TrendingUp className="h-4 w-4"/>
                Effect: {getEffectText()}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-2">
            <p className="text-sm font-medium">Cost:</p>
            <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-primary"/>
                    <span>{upgrade.costMoney.toLocaleString('en-US')}</span>
                </div>
                {upgrade.costPrestigePoints && (
                    <div className="flex items-center gap-1">
                        <Sparkles className="h-4 w-4 text-amber-400"/>
                        <span>{upgrade.costPrestigePoints.toLocaleString('en-US')} PP</span>
                    </div>
                )}
            </div>
            {!isPurchased && (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="w-full pt-2">
                            <Button className="w-full" onClick={() => onPurchase(upgrade.id)} disabled={!canPurchase}>
                                Purchase Upgrade
                            </Button>
                        </div>
                    </TooltipTrigger>
                    {!canPurchase && (
                        <TooltipContent>
                            {!canAffordMoney ? <p>Not enough money.</p> : !canAffordPP ? <p>Not enough Prestige Points.</p> : <p>Cannot purchase.</p>}
                        </TooltipContent>
                    )}
                </Tooltip>
            )}
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
}


"use client";

import type { Stock } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGame } from "@/contexts/GameContext";
import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, TrendingDown, Info, Package } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StockMarketItemProps {
  stock: Stock;
}

export function StockMarketItem({ stock }: StockMarketItemProps) {
  const { playerStats, buyStock, sellStock } = useGame();
  const [sharesAmount, setSharesAmount] = useState<number>(1);
  const Icon = stock.icon;

  const playerHolding = playerStats.stockHoldings.find(h => h.stockId === stock.id);
  const sharesOwned = playerHolding?.shares || 0;

  const handleBuy = () => {
    if (sharesAmount > 0) {
      buyStock(stock.id, sharesAmount);
    }
  };

  const handleSell = () => {
    if (sharesAmount > 0) {
      sellStock(stock.id, sharesAmount);
    }
  };
  
  const dividendPerSharePerSec = stock.price * stock.dividendYield;

  return (
    <TooltipProvider delayDuration={100}>
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Icon className="h-6 w-6 text-primary" />
            {stock.companyName} ({stock.ticker})
          </CardTitle>
          <div className="flex items-center text-lg font-semibold text-primary">
            <DollarSign className="h-5 w-5 mr-1" />
            {stock.price.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            <span className="text-xs text-muted-foreground ml-1">/ share</span>
          </div>
        </div>
        <CardDescription className="text-xs">{stock.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pt-2 pb-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Dividend/sec per share:</span>
          <Tooltip>
            <TooltipTrigger asChild>
                <span className="font-semibold text-green-500 flex items-center">
                    <DollarSign className="h-3 w-3 mr-0.5" />
                    {dividendPerSharePerSec.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    <Info className="h-3 w-3 ml-1 text-muted-foreground cursor-help" />
                </span>
            </TooltipTrigger>
            <TooltipContent>
                <p>This stock yields { (stock.dividendYield * 100).toFixed(4) }% of its current price as dividend per second.</p>
            </TooltipContent>
          </Tooltip>
        </div>
         <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Shares Owned:</span>
          <span className="font-semibold">{sharesOwned.toLocaleString('en-US')}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Total Outstanding Shares:</span>
           <Tooltip>
            <TooltipTrigger asChild>
              <span className="font-semibold flex items-center">
                  <Package className="h-3 w-3 mr-0.5 text-muted-foreground" />
                  {stock.totalOutstandingShares.toLocaleString('en-US')}
                  <Info className="h-3 w-3 ml-1 text-muted-foreground cursor-help" />
              </span>
            </TooltipTrigger>
            <TooltipContent>
                <p>The total number of shares issued by {stock.companyName}.</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="space-y-1">
          <Label htmlFor={`shares-${stock.id}`} className="text-xs">Shares to trade:</Label>
          <Input
            id={`shares-${stock.id}`}
            type="number"
            min="1"
            value={sharesAmount}
            onChange={(e) => setSharesAmount(Math.max(1, parseInt(e.target.value) || 1))}
            className="h-8 text-sm"
          />
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 pt-2">
        <Button onClick={handleBuy} size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
          <TrendingUp className="mr-1 h-4 w-4" /> Buy
        </Button>
        <Button onClick={handleSell} size="sm" variant="outline" className="flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
          <TrendingDown className="mr-1 h-4 w-4" /> Sell
        </Button>
      </CardFooter>
    </Card>
    </TooltipProvider>
  );
}

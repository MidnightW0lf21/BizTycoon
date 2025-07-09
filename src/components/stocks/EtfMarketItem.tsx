
"use client";

import type { ETF } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGame } from "@/contexts/GameContext";
import { useState, useMemo } from "react";
import { DollarSign, TrendingUp, TrendingDown, Info, Package } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface EtfMarketItemProps {
  etf: ETF;
}

export function EtfMarketItem({ etf }: EtfMarketItemProps) {
  const { playerStats, stocks, buyEtf, sellEtf, businessSynergies, businesses } = useGame();
  const [sharesAmount, setSharesAmount] = useState<number>(1);
  const Icon = etf.icon;

  const playerHolding = playerStats.etfHoldings.find(h => h.etfId === etf.id);
  const sharesOwned = playerHolding?.shares || 0;

  const { price, dividendPerSharePerSec } = useMemo(() => {
    const underlyingStocks = stocks.filter(stock => {
      // A more robust system might have explicit mappings
      // For now, we'll use a simple name-based heuristic
      if (etf.sector === 'TECH') return ['TINV', 'QLC', 'OMG'].includes(stock.ticker);
      if (etf.sector === 'ENERGY') return ['GEC', 'STLR'].includes(stock.ticker);
      if (etf.sector === 'FINANCE') return ['SRE', 'GC'].includes(stock.ticker);
      if (etf.sector === 'INDUSTRIAL') return ['MMTR', 'AETL'].includes(stock.ticker);
      if (etf.sector === 'AEROSPACE') return ['CVNT', 'STLR'].includes(stock.ticker);
      if (etf.sector === 'BIOTECH') return ['APRX', 'BSG', 'BFM'].includes(stock.ticker);
      return false;
    });

    if (underlyingStocks.length === 0) {
      return { price: 100, dividendPerSharePerSec: 0 }; // Default fallback
    }

    const etfPrice = underlyingStocks.reduce((sum, stock) => sum + stock.price, 0) / underlyingStocks.length;

    let totalDividend = 0;
    underlyingStocks.forEach(stock => {
      totalDividend += stock.price * stock.dividendYield;
    });
    
    // Apply Synergy
    let dividendBoost = 1;
    businessSynergies.forEach(synergy => {
      if (synergy.effect.type === 'ETF_DIVIDEND_BOOST' && synergy.effect.targetId === etf.id) {
        const business = businesses.find(b => b.id === synergy.businessId);
        if (business && business.level > 0) {
          const boostTiers = Math.floor(business.level / synergy.perLevels);
          dividendBoost += (boostTiers * synergy.effect.value) / 100;
        }
      }
    });

    return { price: Math.floor(etfPrice), dividendPerSharePerSec: (totalDividend / underlyingStocks.length) * dividendBoost };
  }, [stocks, etf.id, etf.sector, businessSynergies, businesses]);

  const handleBuy = () => {
    if (sharesAmount > 0) {
      buyEtf(etf.id, sharesAmount, price);
    }
  };

  const handleSell = () => {
    if (sharesAmount > 0) {
      sellEtf(etf.id, sharesAmount, price);
    }
  };
  
  return (
    <TooltipProvider delayDuration={100}>
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Icon className="h-6 w-6 text-primary" />
              {etf.name} ({etf.ticker})
            </CardTitle>
            <div className="flex items-center text-lg font-semibold text-primary">
              <DollarSign className="h-5 w-5 mr-1" />
              {price.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              <span className="text-xs text-muted-foreground ml-1">/ share</span>
            </div>
          </div>
          <CardDescription className="text-xs">{etf.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 pt-2 pb-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Dividend/sec per share:</span>
            <Tooltip>
              <TooltipTrigger asChild>
                  <span className="font-semibold text-green-500 flex items-center gap-1">
                      <DollarSign className="h-3 w-3 mr-0.5" />
                      {dividendPerSharePerSec.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
                      <Info className="h-3 w-3 ml-1 text-muted-foreground cursor-help" />
                  </span>
              </TooltipTrigger>
              <TooltipContent>
                  <p>Estimated dividend based on underlying assets.</p>
                  <p>Synergy bonuses may apply.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Total Units Outstanding:</span>
            <span className="font-semibold flex items-center gap-1">
              <Package className="h-3 w-3" />
              {etf.totalOutstandingShares.toLocaleString('en-US')}
            </span>
          </div>
           <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Units Owned:</span>
            <span className="font-semibold">{sharesOwned.toLocaleString('en-US')}</span>
          </div>
          <div className="space-y-1">
            <Label htmlFor={`shares-${etf.id}`} className="text-xs">Units to trade:</Label>
            <Input
              id={`shares-${etf.id}`}
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

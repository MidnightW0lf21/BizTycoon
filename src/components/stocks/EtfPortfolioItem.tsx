
"use client";

import type { ETF, EtfHolding } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge"; 
import { useGame } from "@/contexts/GameContext";
import { useMemo } from "react";

interface EtfPortfolioItemProps {
  holding: EtfHolding;
  etf: ETF;
}

export function EtfPortfolioItem({ holding, etf }: EtfPortfolioItemProps) {
  const { stocks } = useGame();
  const Icon = etf.icon;

  const currentPrice = useMemo(() => {
    const underlyingStocks = stocks.filter(stock => {
      if (etf.sector === 'TECH') return ['TINV', 'QLC', 'OMG'].includes(stock.ticker);
      if (etf.sector === 'ENERGY') return ['GEC', 'STLR'].includes(stock.ticker);
      if (etf.sector === 'FINANCE') return ['SRE', 'GC'].includes(stock.ticker);
      if (etf.sector === 'INDUSTRIAL') return ['MMTR', 'AETL'].includes(stock.ticker);
      if (etf.sector === 'AEROSPACE') return ['CVNT', 'STLR'].includes(stock.ticker);
      if (etf.sector === 'BIOTECH') return ['APRX', 'BSG', 'BFM'].includes(stock.ticker);
      return false;
    });

    if (underlyingStocks.length === 0) return 100;
    const etfPrice = underlyingStocks.reduce((sum, stock) => sum + stock.price, 0) / underlyingStocks.length;
    return Math.floor(etfPrice);
  }, [stocks, etf.sector]);

  const currentValue = holding.shares * currentPrice;

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2 pt-4">
        <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
                <Icon className="h-5 w-5 text-primary" />
                {etf.name} ({etf.ticker})
            </CardTitle>
             <Badge className="text-xs" variant="secondary">
                {holding.shares.toLocaleString('en-US')} Shares
            </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-1.5 text-xs pt-2 pb-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Avg. Purchase Price:</span>
          <span className="font-medium">${holding.averagePurchasePrice.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Current Price:</span>
          <span className="font-medium">${currentPrice.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Current Value:</span>
          <span className="font-bold text-primary">${currentValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
        </div>
      </CardContent>
    </Card>
  );
}

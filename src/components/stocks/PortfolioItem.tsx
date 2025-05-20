
"use client";

import type { Stock, StockHolding } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { DollarSign, Info, Percent } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge"; 

interface PortfolioItemProps {
  holding: StockHolding;
  stock: Stock;
}

export function PortfolioItem({ holding, stock }: PortfolioItemProps) {
  const Icon = stock.icon;
  const currentValue = holding.shares * stock.price;
  const dividendPerSecondFromHolding = holding.shares * stock.price * stock.dividendYield;
  const ownershipPercentage = (holding.shares / stock.totalOutstandingShares) * 100;

  return (
    <TooltipProvider delayDuration={100}>
    <Card className="shadow-sm">
      <CardHeader className="pb-2 pt-4">
        <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
                <Icon className="h-5 w-5 text-primary" />
                {stock.companyName} ({stock.ticker})
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
          <span className="font-medium">${stock.price.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Current Value:</span>
          <span className="font-bold text-primary">${currentValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Dividend/sec:</span>
          <Tooltip>
            <TooltipTrigger asChild>
                <span className="font-medium text-green-500 flex items-center">
                    <DollarSign className="h-3 w-3 mr-0.5" />
                    {dividendPerSecondFromHolding.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                     <Info className="h-3 w-3 ml-1 text-muted-foreground cursor-help" />
                </span>
            </TooltipTrigger>
            <TooltipContent>
                <p>Total dividend from these shares per second.</p>
                <p>Calculation: Shares × Price × Yield</p>
                <p>{holding.shares.toLocaleString('en-US')} × ${stock.price.toLocaleString('en-US', {maximumFractionDigits:0})} × {(stock.dividendYield * 100).toFixed(4)}%</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Ownership:</span>
           <Tooltip>
            <TooltipTrigger asChild>
              <span className="font-medium flex items-center">
                <Percent className="h-3 w-3 mr-0.5 text-primary" />
                {ownershipPercentage.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}%
                <Info className="h-3 w-3 ml-1 text-muted-foreground cursor-help" />
              </span>
            </TooltipTrigger>
            <TooltipContent>
                <p>Your percentage of {stock.companyName}'s total outstanding shares ({stock.totalOutstandingShares.toLocaleString('en-US')}).</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardContent>
    </Card>
    </TooltipProvider>
  );
}

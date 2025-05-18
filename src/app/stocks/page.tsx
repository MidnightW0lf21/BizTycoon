
"use client";

import { useGame } from "@/contexts/GameContext";
import { StockMarketItem } from "@/components/stocks/StockMarketItem";
import { PortfolioItem } from "@/components/stocks/PortfolioItem";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { LockKeyhole, BarChart } from "lucide-react";

const REQUIRED_PRESTIGE_LEVEL = 2;

export default function StocksPage() {
  const { stocks, playerStats } = useGame();

  if (playerStats.timesPrestiged < REQUIRED_PRESTIGE_LEVEL) {
    return (
      <Card className="w-full md:max-w-2xl mx-auto">
        <CardHeader className="items-center">
          <LockKeyhole className="h-16 w-16 text-primary mb-4" />
          <CardTitle>Stocks Locked</CardTitle>
          <CardDescription className="text-center">
            The Stock Market is a powerful tool for wealth generation! <br />
            Unlock this feature by reaching Prestige Level {REQUIRED_PRESTIGE_LEVEL}.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            (Current Prestige Level: {playerStats.timesPrestiged})
          </p>
        </CardContent>
      </Card>
    );
  }

  const playerHoldingsWithStockData = playerStats.stockHoldings.map(holding => {
    const stockDetails = stocks.find(s => s.id === holding.stockId);
    return { ...holding, stockDetails };
  }).filter(item => item.stockDetails);

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Stock Market Section */}
      <div className="md:col-span-2 flex flex-col gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <BarChart className="h-6 w-6 text-primary" /> Stock Market
          </h2>
          <p className="text-sm text-muted-foreground">Buy and sell shares of various companies.</p>
        </div>
        
        {stocks.length === 0 ? (
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 min-h-[200px] flex items-center justify-center">
            <p className="text-center text-muted-foreground">No stocks available in the market currently.</p>
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-220px)] pr-4"> {/* Adjusted height to be more dynamic */}
            <div className="space-y-4">
              {stocks.map((stock) => (
                <StockMarketItem key={stock.id} stock={stock} />
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Your Portfolio Section */}
      <div className="md:col-span-1 flex flex-col gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Your Portfolio</h2>
          <p className="text-sm text-muted-foreground">Overview of your current stock holdings.</p>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 flex-grow flex flex-col"> {/* Added card-like styling here for the content area */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">Total Investment Value:</p>
            <p className="text-2xl font-bold text-primary">${playerStats.investmentsValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <Separator className="my-4" />
          {playerHoldingsWithStockData.length === 0 ? (
            <div className="flex-grow flex items-center justify-center">
              <p className="text-center text-muted-foreground">You do not own any stocks yet.</p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-380px)] pr-4"> {/* Adjusted height */}
              <div className="space-y-4">
                {playerHoldingsWithStockData.map((holdingItem) => (
                  holdingItem.stockDetails ? (
                    <PortfolioItem 
                      key={holdingItem.stockId} 
                      holding={holdingItem} 
                      stock={holdingItem.stockDetails} 
                    />
                  ) : null
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  );
}

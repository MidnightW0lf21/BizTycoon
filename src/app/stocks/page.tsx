
"use client";

import { useGame } from "@/contexts/GameContext";
import { StockMarketItem } from "@/components/stocks/StockMarketItem";
import { PortfolioItem } from "@/components/stocks/PortfolioItem";
import { EtfMarketItem } from "@/components/stocks/EtfMarketItem";
import { EtfPortfolioItem } from "@/components/stocks/EtfPortfolioItem";
import { IpoOfferingCard } from "@/components/stocks/IpoOfferingCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { LockKeyhole, BarChart, Package, Briefcase, Landmark, Flame } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { STOCK_ETF_UNLOCK_ORDER } from "@/config/game-config";

const REQUIRED_PRESTIGE_LEVEL = 1;

export default function StocksPage() {
  const { playerStats, stocks, etfs, buyIpoShares } = useGame();

  const unlockedItems = STOCK_ETF_UNLOCK_ORDER.slice(0, playerStats.timesPrestiged);
  const unlockedStockIds = unlockedItems.filter(item => item.type === 'STOCK').map(item => item.id);
  const unlockedEtfIds = unlockedItems.filter(item => item.type === 'ETF').map(item => item.id);

  const availableStocks = stocks.filter(stock => unlockedStockIds.includes(stock.id));
  const availableEtfs = etfs.filter(etf => unlockedEtfIds.includes(etf.id));

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

  const playerEtfHoldingsWithData = playerStats.etfHoldings.map(holding => {
    const etfDetails = etfs.find(e => e.id === holding.etfId);
    return { ...holding, etfDetails };
  }).filter(item => item.etfDetails);

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 flex flex-col gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <BarChart className="h-6 w-6 text-primary" /> Global Exchange
          </h2>
          <p className="text-sm text-muted-foreground">Buy and sell shares of companies, ETFs, and participate in IPOs. You unlock one new item per prestige level.</p>
        </div>
        
        <Tabs defaultValue="stocks" className="w-full flex-grow flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="stocks"><Briefcase className="mr-2 h-4 w-4"/>Stocks</TabsTrigger>
            <TabsTrigger value="etfs"><Package className="mr-2 h-4 w-4"/>ETFs</TabsTrigger>
            <TabsTrigger value="ipos"><Flame className="mr-2 h-4 w-4"/>IPOs</TabsTrigger>
          </TabsList>

          <TabsContent value="stocks" className="flex-grow mt-4">
            {availableStocks.length === 0 ? (
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 min-h-[200px] flex items-center justify-center">
                <p className="text-center text-muted-foreground">No stocks unlocked yet. Prestige to unlock more!</p>
              </div>
            ) : (
              <ScrollArea className="h-[calc(100vh-280px)] pr-4"> 
                <div className="space-y-4">
                  {availableStocks.map((stock) => (
                    <StockMarketItem key={stock.id} stock={stock} />
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>

          <TabsContent value="etfs" className="flex-grow mt-4">
             {availableEtfs.length === 0 ? (
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 min-h-[200px] flex items-center justify-center">
                <p className="text-center text-muted-foreground">No ETFs unlocked yet. Prestige to unlock more!</p>
              </div>
            ) : (
              <ScrollArea className="h-[calc(100vh-280px)] pr-4"> 
                <div className="space-y-4">
                  {availableEtfs.map((etf) => (
                    <EtfMarketItem key={etf.id} etf={etf} />
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>

           <TabsContent value="ipos" className="flex-grow mt-4">
             {playerStats.activeIpo ? (
                <IpoOfferingCard 
                  ipo={playerStats.activeIpo}
                  onBuyShares={buyIpoShares}
                  playerMoney={playerStats.money}
                />
             ) : (
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 min-h-[200px] flex items-center justify-center">
                <p className="text-center text-muted-foreground">No active IPOs at the moment. Check back later!</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <div className="md:col-span-1 flex flex-col gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Your Portfolio</h2>
          <p className="text-sm text-muted-foreground">Overview of your current holdings.</p>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 flex-grow flex flex-col"> 
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">Total Investment Value:</p>
            <p className="text-2xl font-bold text-primary">${playerStats.investmentsValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
          </div>
          <Separator className="my-4" />
          <ScrollArea className="h-[calc(100vh-380px)] pr-4">
            <div className="space-y-4">
              {playerHoldingsWithStockData.length > 0 && (
                <>
                  <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2"><Briefcase className="h-4 w-4"/>Individual Stocks</h3>
                  {playerHoldingsWithStockData.map((holdingItem) => (
                    holdingItem.stockDetails ? (
                      <PortfolioItem 
                        key={holdingItem.stockId} 
                        holding={holdingItem} 
                        stock={holdingItem.stockDetails} 
                      />
                    ) : null
                  ))}
                </>
              )}
              {playerEtfHoldingsWithData.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2"><Package className="h-4 w-4"/>ETFs</h3>
                  {playerEtfHoldingsWithData.map((holdingItem) => (
                     holdingItem.etfDetails ? (
                      <EtfPortfolioItem
                        key={holdingItem.etfId}
                        holding={holdingItem}
                        etf={holdingItem.etfDetails}
                      />
                    ) : null
                  ))}
                </>
              )}
              {playerHoldingsWithStockData.length === 0 && playerEtfHoldingsWithData.length === 0 && (
                <div className="flex-grow flex items-center justify-center h-full pt-10">
                  <p className="text-center text-muted-foreground">You do not own any stocks or ETFs yet.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

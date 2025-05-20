
"use client";

import { useGame } from "@/contexts/GameContext";
import { HQUpgradeCard } from "@/components/hq/HQUpgradeCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building as HQIcon, LockKeyhole } from "lucide-react"; // Added LockKeyhole
import { useMemo, useState, useEffect } from "react"; 
import { Skeleton } from "@/components/ui/skeleton"; 
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; // Added CardFooter

const REQUIRED_PRESTIGE_LEVEL_HQ = 3;

export default function HQPage() {
  const { playerStats, hqUpgrades, purchaseHQUpgrade } = useGame();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (playerStats.timesPrestiged < REQUIRED_PRESTIGE_LEVEL_HQ) {
    return (
      <Card className="w-full md:max-w-2xl mx-auto">
        <CardHeader className="items-center">
          <LockKeyhole className="h-16 w-16 text-primary mb-4" />
          <CardTitle>Headquarters Locked</CardTitle>
          <CardDescription className="text-center">
            Headquarters provides powerful global upgrades. <br />
            Unlock this feature by reaching Prestige Level {REQUIRED_PRESTIGE_LEVEL_HQ}.
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

  const categorizedUpgrades = useMemo(() => {
    const global: typeof hqUpgrades = [];
    const businessRetention: typeof hqUpgrades = [];
    const stockRetention: typeof hqUpgrades = [];

    hqUpgrades.forEach(upgrade => {
      if (upgrade.id.startsWith('retain_level_')) {
        businessRetention.push(upgrade);
      } else if (upgrade.id.startsWith('retain_shares_')) {
        stockRetention.push(upgrade);
      } else {
        global.push(upgrade);
      }
    });
    return { global, businessRetention, stockRetention };
  }, [hqUpgrades]);

  const renderUpgradeGrid = (upgradesToRender: typeof hqUpgrades) => {
    if (!mounted) { 
      return (
        <ScrollArea className="flex-grow pr-1 h-[calc(100vh-280px)]">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => ( 
              <Card className="flex flex-col relative transition-shadow duration-200 h-[240px] min-h-[220px]" key={i}>
                <CardHeader className="pb-3 pt-4">
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-8 w-8 mt-1 shrink-0 rounded-md" />
                    <div className="flex-grow space-y-1.5">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-3 w-full mt-1" />
                      <Skeleton className="h-3 w-1/2 mt-1" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow space-y-2 text-sm pt-2">
                  <Skeleton className="h-3 w-1/3 mb-2" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3 mt-1" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardContent>
                <CardFooter className="pt-2">
                  <Skeleton className="h-9 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      );
    }
    if (upgradesToRender.length === 0) {
      return (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-center text-muted-foreground py-10">
            No upgrades available in this category.
          </p>
        </div>
      );
    }
    return (
      <ScrollArea className="flex-grow pr-1 h-[calc(100vh-280px)]"> 
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {upgradesToRender.map((upgrade) => (
            <HQUpgradeCard
              key={upgrade.id}
              hqUpgrade={upgrade}
              playerMoney={playerStats.money}
              playerPrestigePoints={playerStats.prestigePoints}
              playerTimesPrestiged={playerStats.timesPrestiged}
              currentUpgradeLevels={playerStats.hqUpgradeLevels}
              onPurchaseUpgrade={purchaseHQUpgrade}
            />
          ))}
        </div>
      </ScrollArea>
    );
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <HQIcon className="h-7 w-7 text-primary" />
          Headquarters Upgrades
        </h1>
        <p className="text-muted-foreground">
          Invest in global upgrades to boost your entire empire. You currently have <strong className="text-primary">${playerStats.money.toLocaleString('en-US')}</strong> and <strong className="text-primary">{playerStats.prestigePoints.toLocaleString('en-US')} PP</strong>.
        </p>
      </div>
      
      {hqUpgrades.length === 0 && mounted ? ( 
        <div className="flex-grow flex items-center justify-center">
          <p className="text-center text-muted-foreground py-10">
            No HQ upgrades available yet. Check back later!
          </p>
        </div>
      ) : (
        <Tabs defaultValue="global" className="flex flex-col flex-grow">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="global">Global {mounted && `(${categorizedUpgrades.global.length})`}</TabsTrigger>
            <TabsTrigger value="business_retention">Business Retention {mounted && `(${categorizedUpgrades.businessRetention.length})`}</TabsTrigger>
            <TabsTrigger value="stock_retention">Stock Retention {mounted && `(${categorizedUpgrades.stockRetention.length})`}</TabsTrigger>
          </TabsList>
          <TabsContent value="global" className="flex-grow flex flex-col">
            {renderUpgradeGrid(categorizedUpgrades.global)}
          </TabsContent>
          <TabsContent value="business_retention" className="flex-grow flex flex-col">
            {renderUpgradeGrid(categorizedUpgrades.businessRetention)}
          </TabsContent>
          <TabsContent value="stock_retention" className="flex-grow flex flex-col">
            {renderUpgradeGrid(categorizedUpgrades.stockRetention)}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

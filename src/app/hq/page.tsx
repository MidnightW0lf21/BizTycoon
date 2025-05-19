
"use client";

import { useGame } from "@/contexts/GameContext";
import { HQUpgradeCard } from "@/components/hq/HQUpgradeCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building as HQIcon } from "lucide-react";
import { useMemo } from "react";

export default function HQPage() {
  const { playerStats, hqUpgrades, purchaseHQUpgrade } = useGame();

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
      <ScrollArea className="flex-grow pr-1 h-[calc(100vh-280px)]"> {/* Adjusted height for tabs */}
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
      
      {hqUpgrades.length === 0 ? (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-center text-muted-foreground py-10">
            No HQ upgrades available yet. Check back later!
          </p>
        </div>
      ) : (
        <Tabs defaultValue="global" className="flex flex-col flex-grow">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="global">Global ({categorizedUpgrades.global.length})</TabsTrigger>
            <TabsTrigger value="business_retention">Business Retention ({categorizedUpgrades.businessRetention.length})</TabsTrigger>
            <TabsTrigger value="stock_retention">Stock Retention ({categorizedUpgrades.stockRetention.length})</TabsTrigger>
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

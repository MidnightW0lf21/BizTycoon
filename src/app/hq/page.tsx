
"use client";

import { useGame } from "@/contexts/GameContext";
import { HQUpgradeCard } from "@/components/hq/HQUpgradeCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Building as HQIcon } from "lucide-react";

export default function HQPage() {
  const { playerStats, hqUpgrades, purchaseHQUpgrade } = useGame();

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
        <ScrollArea className="flex-grow pr-1 h-[calc(100vh-220px)]">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {hqUpgrades.map((upgrade) => (
              <HQUpgradeCard
                key={upgrade.id}
                hqUpgrade={upgrade}
                playerMoney={playerStats.money}
                playerPrestigePoints={playerStats.prestigePoints}
                playerTimesPrestiged={playerStats.timesPrestiged}
                purchasedHQUpgradeIds={playerStats.purchasedHQUpgradeIds}
                onPurchaseUpgrade={purchaseHQUpgrade}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

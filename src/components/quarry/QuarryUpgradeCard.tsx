
"use client";

import type { QuarryUpgrade } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Gem, CheckCircle2, Pickaxe } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuarryUpgradeCardProps {
  upgrade: QuarryUpgrade;
  onPurchase: (upgradeId: string) => void;
  playerMinerals: number;
  isPurchased: boolean;
}

export function QuarryUpgradeCard({ upgrade, onPurchase, playerMinerals, isPurchased }: QuarryUpgradeCardProps) {
  const canAfford = playerMinerals >= upgrade.cost;
  const Icon = upgrade.icon || Pickaxe;

  return (
    <Card className={cn("shadow-sm", isPurchased && "bg-primary/10 border-primary")}>
      <CardHeader className="pb-2 pt-3">
        <CardTitle className="text-base flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-primary"/>
            {upgrade.name}
          </span>
          {isPurchased && <CheckCircle2 className="h-5 w-5 text-green-500" />}
        </CardTitle>
        <CardDescription className="text-xs">{upgrade.description}</CardDescription>
      </CardHeader>
      <CardContent className="text-xs pb-3">
        <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Cost:</span>
            <div className="flex items-center gap-1 font-semibold text-primary">
                <Gem className="h-3.5 w-3.5"/>
                {upgrade.cost.toLocaleString()} Minerals
            </div>
        </div>
      </CardContent>
      {!isPurchased && (
        <CardFooter className="p-2 pt-0">
          <Button
            size="sm"
            className="w-full"
            disabled={!canAfford}
            onClick={() => onPurchase(upgrade.id)}
          >
            <Pickaxe className="mr-2 h-4 w-4" /> Purchase
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

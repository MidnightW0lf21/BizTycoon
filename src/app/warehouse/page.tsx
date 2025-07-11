
"use client";

import { useGame } from "@/contexts/GameContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { LockKeyhole, Truck, Inbox } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { WAREHOUSE_CAPACITY_MAX, WAREHOUSE_UPGRADE_COST_BASE, WAREHOUSE_UPGRADE_COST_MULTIPLIER, KITCHEN_RECIPES } from "@/config/game-config";
import { useMemo } from "react";

const REQUIRED_PRESTIGE_LEVEL_WAREHOUSE = 15;

export default function WarehousePage() {
  const { playerStats } = useGame(); // Removed upgradeWarehouse as it's not implemented yet

  const totalWarehouseContent = useMemo(() => {
    return (playerStats.warehouseStorage || []).reduce((sum, item) => sum + item.quantity, 0);
  }, [playerStats.warehouseStorage]);

  const warehouseUpgradeCost = useMemo(() => {
    const currentLevel = Math.floor(Math.log((playerStats.warehouseCapacity || 1000) / 1000) / Math.log(2));
    return Math.floor(WAREHOUSE_UPGRADE_COST_BASE * Math.pow(WAREHOUSE_UPGRADE_COST_MULTIPLIER, currentLevel));
  }, [playerStats.warehouseCapacity]);

  const warehouseFillPercentage = useMemo(() => {
    if (!playerStats.warehouseCapacity) return 0;
    return (totalWarehouseContent / playerStats.warehouseCapacity) * 100;
  }, [totalWarehouseContent, playerStats.warehouseCapacity]);

  const isWarehouseMaxed = (playerStats.warehouseCapacity || 0) >= WAREHOUSE_CAPACITY_MAX;

  if (playerStats.timesPrestiged < REQUIRED_PRESTIGE_LEVEL_WAREHOUSE) {
    return (
      <Card className="w-full md:max-w-2xl mx-auto">
        <CardHeader className="items-center">
          <LockKeyhole className="h-16 w-16 text-primary mb-4" />
          <CardTitle>Warehouse Locked</CardTitle>
          <CardDescription className="text-center">
            This feature is part of a multi-layered mini-game. <br />
            Unlock it by reaching Prestige Level {REQUIRED_PRESTIGE_LEVEL_WAREHOUSE}.
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

  return (
    <div className="flex flex-col gap-6">
      <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-6 w-6 text-primary" />
              Delivery Warehouse
            </CardTitle>
            <CardDescription>
              Manage your warehouse and delivery logistics. This feature is under construction.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Warehouse content coming soon!</p>
          </CardContent>
        </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Inbox className="h-5 w-5 text-primary"/>Warehouse Inventory</CardTitle>
          <CardDescription>Goods shipped from your farm, ready for retail.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 mb-4">
            <Progress value={warehouseFillPercentage} />
            <p className="text-xs text-muted-foreground text-center">
              {totalWarehouseContent.toLocaleString()} / {(playerStats.warehouseCapacity || 0).toLocaleString()} units
            </p>
          </div>
          <div className="space-y-2">
              {(playerStats.warehouseStorage || []).length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Warehouse is empty.</p>
              ) : (
                  (playerStats.warehouseStorage || []).map(item => {
                      const recipe = KITCHEN_RECIPES.find(c => c.outputItemId === item.itemId);
                      if (!recipe) return null;
                      const Icon = recipe.icon;
                      return (
                          <div key={item.itemId} className="flex items-center justify-between text-sm p-2 rounded-md bg-muted/50">
                              <div className="flex items-center gap-2">
                                  <Icon className="h-5 w-5 text-primary" />
                                  <span>{recipe.name}</span>
                              </div>
                              <span className="font-semibold">{item.quantity.toLocaleString()}</span>
                          </div>
                      );
                  })
              )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            // onClick={upgradeWarehouse}
            disabled={true || isWarehouseMaxed || playerStats.money < warehouseUpgradeCost}
          >
            { isWarehouseMaxed ? "Max Capacity" : `Upgrade ($${warehouseUpgradeCost.toLocaleString()})` } (Coming Soon)
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}


"use client";

import { useGame } from "@/contexts/GameContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LockKeyhole, Sprout, ShoppingCart, DollarSign, Fuel, Warehouse, Timer, PlusCircle, ChefHat, Package, Check, Truck as ShipIcon } from "lucide-react";
import { FARM_PURCHASE_COST, FUEL_ORDER_COST_PER_LTR, SILO_UPGRADE_COST_BASE, SILO_UPGRADE_COST_MULTIPLIER, FUEL_DEPOT_UPGRADE_COST_BASE, FUEL_DEPOT_UPGRADE_COST_MULTIPLIER, KITCHEN_RECIPES, FARM_CROPS } from "@/config/game-config";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FarmFieldCard } from "@/components/farm/FarmFieldCard";
import { VehicleCard } from "@/components/farm/VehicleCard";
import { useState, useMemo, useEffect } from "react";
import { PlantingDialog } from "@/components/farm/PlantingDialog";
import { VehicleShopDialog } from "@/components/farm/VehicleShopDialog";
import { FuelOrderDialog } from "@/components/farm/FuelOrderDialog";
import type { FarmField } from "@/types";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const REQUIRED_PRESTIGE_LEVEL_FARM = 15;

export default function FarmPage() {
  const { playerStats, purchaseFarm, harvestField, cultivateField, upgradeSilo, upgradeFuelDepot, refuelVehicle, repairVehicle, sellVehicle, craftKitchenRecipe, shipKitchenItem } = useGame();
  const [isPlantingDialogOpen, setIsPlantingDialogOpen] = useState(false);
  const [isVehicleShopOpen, setIsVehicleShopOpen] = useState(false);
  const [isFuelOrderOpen, setIsFuelOrderOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<FarmField | null>(null);
  const [fuelDeliveryTimeLeft, setFuelDeliveryTimeLeft] = useState(0);

  const handleOpenPlantingDialog = (field: FarmField) => {
    setSelectedField(field);
    setIsPlantingDialogOpen(true);
  };

  const totalSiloContent = useMemo(() => {
    return (playerStats.siloStorage || []).reduce((sum, item) => sum + item.quantity, 0);
  }, [playerStats.siloStorage]);
  
  const siloUpgradeCost = useMemo(() => {
    const currentLevel = Math.floor(Math.log((playerStats.siloCapacity || 1000) / 1000) / Math.log(2));
    return SILO_UPGRADE_COST_BASE * Math.pow(SILO_UPGRADE_COST_MULTIPLIER, currentLevel);
  }, [playerStats.siloCapacity]);

  const fuelDepotUpgradeCost = useMemo(() => {
    const currentLevel = Math.floor(Math.log((playerStats.fuelCapacity || 500) / 500) / Math.log(2));
    return FUEL_DEPOT_UPGRADE_COST_BASE * Math.pow(FUEL_DEPOT_UPGRADE_COST_MULTIPLIER, currentLevel);
  }, [playerStats.fuelCapacity]);
  
  const siloFillPercentage = useMemo(() => {
    if (!playerStats.siloCapacity) return 0;
    return (totalSiloContent / playerStats.siloCapacity) * 100;
  }, [totalSiloContent, playerStats.siloCapacity]);

  const fuelFillPercentage = useMemo(() => {
    if (!playerStats.fuelCapacity) return 0;
    return ((playerStats.fuelStorage || 0) / playerStats.fuelCapacity) * 100;
  }, [playerStats.fuelStorage, playerStats.fuelCapacity]);


  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;
    if (playerStats.pendingFuelDelivery && playerStats.pendingFuelDelivery.arrivalTime > Date.now()) {
      const updateCountdown = () => {
        const timeLeft = Math.max(0, playerStats.pendingFuelDelivery!.arrivalTime - Date.now());
        setFuelDeliveryTimeLeft(timeLeft / 1000);
        if (timeLeft === 0 && intervalId) {
          clearInterval(intervalId);
        }
      };
      updateCountdown();
      intervalId = setInterval(updateCountdown, 1000);
    } else {
      setFuelDeliveryTimeLeft(0);
    }
    return () => clearInterval(intervalId);
  }, [playerStats.pendingFuelDelivery]);


  if (playerStats.timesPrestiged < REQUIRED_PRESTIGE_LEVEL_FARM) {
    return (
      <Card className="w-full md:max-w-2xl mx-auto">
        <CardHeader className="items-center">
          <LockKeyhole className="h-16 w-16 text-primary mb-4" />
          <CardTitle>Farm Locked</CardTitle>
          <CardDescription className="text-center">
            This feature is part of a multi-layered mini-game. <br />
            Unlock it by reaching Prestige Level {REQUIRED_PRESTIGE_LEVEL_FARM}.
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

  if (!playerStats.farmPurchased) {
    return (
      <Card className="w-full md:max-w-lg mx-auto">
        <CardHeader className="items-center">
          <Sprout className="h-16 w-16 text-primary mb-4" />
          <CardTitle>Purchase Your Farm</CardTitle>
          <CardDescription className="text-center">
            Invest in your first farm to start agricultural production.
            This is a one-time purchase and will persist through prestiges.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
            <DollarSign className="h-7 w-7" />
            {FARM_PURCHASE_COST.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </div>
          <p className="text-sm text-muted-foreground">
            Your current balance: ${playerStats.money.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </p>
        </CardContent>
        <CardFooter>
          <Button
            onClick={purchaseFarm}
            className="w-full"
            disabled={playerStats.money < FARM_PURCHASE_COST}
          >
            <ShoppingCart className="mr-2 h-5 w-5" /> Purchase Farm
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sprout className="h-6 w-6 text-primary" />
              My Farm
            </CardTitle>
            <CardDescription>
              Manage your agricultural empire. Purchase fields, vehicles, and process crops.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2"><Warehouse className="h-5 w-5 text-primary"/>Silo Storage</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-4 items-start">
                    <div className="flex-grow space-y-2">
                        <p className="text-2xl font-bold">
                            {totalSiloContent.toLocaleString()}
                            <span className="text-lg text-muted-foreground"> / {(playerStats.siloCapacity || 0).toLocaleString()} units</span>
                        </p>
                        <p className="text-sm text-muted-foreground">Your total storage for harvested crops.</p>
                        <Button size="sm" variant="outline" className="mt-2" onClick={upgradeSilo} disabled={playerStats.money < siloUpgradeCost}>
                            Upgrade (${siloUpgradeCost.toLocaleString()})
                        </Button>
                    </div>
                    <div className="w-12 h-40">
                       <Progress value={siloFillPercentage} orientation="vertical" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2"><Fuel className="h-5 w-5 text-primary"/>Fuel Depot</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-4 items-start">
                    <div className="flex-grow space-y-2">
                        <p className="text-2xl font-bold">
                            {Math.floor(playerStats.fuelStorage || 0)}
                            <span className="text-lg text-muted-foreground"> / {(playerStats.fuelCapacity || 0).toLocaleString()} L</span>
                        </p>
                        <p className="text-sm text-muted-foreground">Fuel for your farm vehicles.</p>
                        <div className="flex items-center gap-2 mt-2">
                            <Button size="sm" variant="outline" onClick={() => setIsFuelOrderOpen(true)} disabled={!!playerStats.pendingFuelDelivery}>
                                Order Fuel
                            </Button>
                            <Button size="sm" variant="outline" onClick={upgradeFuelDepot} disabled={playerStats.money < fuelDepotUpgradeCost}>
                                Upgrade (${fuelDepotUpgradeCost.toLocaleString()})
                            </Button>
                        </div>
                        {playerStats.pendingFuelDelivery && fuelDeliveryTimeLeft > 0 && (
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                            <Timer className="h-3 w-3"/> Delivery arriving in: {Math.ceil(fuelDeliveryTimeLeft)}s
                        </p>
                        )}
                    </div>
                    <div className="w-12 h-40">
                        <Progress value={fuelFillPercentage} orientation="vertical" indicatorClassName="bg-orange-400" />
                    </div>
                </CardContent>
            </Card>
          </CardContent>
        </Card>

        <Tabs defaultValue="fields" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="fields">Fields</TabsTrigger>
            <TabsTrigger value="garage">Garage</TabsTrigger>
            <TabsTrigger value="kitchen">Kitchen & Logistics</TabsTrigger>
          </TabsList>
          <TabsContent value="fields" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {(playerStats.farmFields || []).map(field => (
                <FarmFieldCard
                  key={field.id}
                  field={field}
                  onPlantClick={() => handleOpenPlantingDialog(field)}
                  onHarvestClick={() => harvestField(field.id)}
                  onCultivateClick={() => cultivateField(field.id)}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="garage" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Garage</CardTitle>
                <CardDescription>Manage your tractors and harvesters. Keep them fueled and in good repair.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(playerStats.farmVehicles || []).map(vehicle => (
                  <VehicleCard key={vehicle.instanceId} vehicle={vehicle} onRefuel={refuelVehicle} onRepair={repairVehicle} onSell={sellVehicle} playerFuel={playerStats.fuelStorage || 0} playerMoney={playerStats.money}/>
                ))}
                <Card className="flex flex-col justify-center items-center text-center p-4 border-dashed">
                    <PlusCircle className="h-10 w-10 text-muted-foreground mb-2"/>
                    <CardTitle className="text-lg">Buy New Vehicle</CardTitle>
                    <CardDescription className="mb-4">Expand your fleet.</CardDescription>
                    <Button onClick={() => setIsVehicleShopOpen(true)}>
                        <ShoppingCart className="mr-2 h-4 w-4"/>Open Vehicle Shop
                    </Button>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="kitchen" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle>Silo Contents</CardTitle>
                    <CardDescription>Raw materials from your fields.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    {(playerStats.siloStorage || []).length === 0 ? (
                        <p className="text-sm text-muted-foreground">Silo is empty.</p>
                    ) : (
                        (playerStats.siloStorage || []).map(item => {
                            const crop = FARM_CROPS.find(c => c.id === item.cropId);
                            if (!crop) return null;
                            const Icon = crop.icon;
                            return (
                                <div key={item.cropId} className="flex items-center justify-between text-sm p-2 rounded-md bg-muted/50">
                                    <div className="flex items-center gap-2">
                                        <Icon className="h-5 w-5 text-primary" />
                                        <span>{crop.name}</span>
                                    </div>
                                    <span className="font-semibold">{item.quantity.toLocaleString()}</span>
                                </div>
                            );
                        })
                    )}
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Kitchen & Logistics</CardTitle>
                    <CardDescription>Process harvested crops into valuable goods and ship them to your warehouse.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {KITCHEN_RECIPES.map(recipe => {
                        const canCraft = recipe.ingredients.every(ing => {
                            const siloItem = (playerStats.siloStorage || []).find(item => item.cropId === ing.cropId);
                            return siloItem && siloItem.quantity >= ing.quantity;
                        });
                        const existingQueueItem = (playerStats.kitchenQueue || []).find(q => q.recipeId === recipe.id);
                        const progress = existingQueueItem ? (1 - ((existingQueueItem.completionTime - Date.now()) / (recipe.craftTimeSeconds * 1000))) * 100 : 0;

                        return (
                            <Card key={recipe.id}>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2"><recipe.icon className="h-5 w-5 text-primary"/>{recipe.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm font-semibold mb-2">Ingredients:</p>
                                    <ul className="text-sm space-y-1">
                                        {recipe.ingredients.map(ing => {
                                             const siloItem = (playerStats.siloStorage || []).find(item => item.cropId === ing.cropId);
                                             const hasEnough = siloItem && siloItem.quantity >= ing.quantity;
                                            return (
                                            <li key={ing.cropId} className="flex items-center justify-between">
                                                <span>{ing.quantity}x {ing.cropId}</span>
                                                {hasEnough ? <Check className="h-4 w-4 text-green-500"/> : <span className="text-destructive">({(siloItem?.quantity || 0)}/{ing.quantity})</span>}
                                            </li>
                                        )})}
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    {existingQueueItem ? (
                                        <div className="w-full space-y-1">
                                            <Progress value={progress} />
                                            <p className="text-xs text-muted-foreground text-center">Crafting...</p>
                                        </div>
                                    ) : (
                                        <Button onClick={() => craftKitchenRecipe(recipe.id)} disabled={!canCraft} className="w-full">
                                            <ChefHat className="mr-2 h-4 w-4"/>Craft ({recipe.craftTimeSeconds}s)
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        );
                    })}
                </CardContent>
              </Card>

              <Card className="lg:col-span-3">
                  <CardHeader>
                      <CardTitle>Finished Goods Inventory</CardTitle>
                      <CardDescription>Items crafted in the kitchen, ready to be shipped.</CardDescription>
                  </CardHeader>
                  <CardContent>
                       {(playerStats.kitchenInventory || []).length === 0 ? (
                        <p className="text-sm text-muted-foreground">No finished goods yet.</p>
                    ) : (
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                           {(playerStats.kitchenInventory || []).map(item => {
                                const recipe = KITCHEN_RECIPES.find(r => r.outputItemId === item.itemId);
                                if (!recipe) return null;
                                const Icon = recipe.icon;
                                return (
                                    <Card key={item.itemId} className="p-4 flex flex-col items-center justify-center text-center">
                                        <Icon className="h-10 w-10 text-primary mb-2"/>
                                        <p className="font-bold">{recipe.name}</p>
                                        <p className="text-2xl">{item.quantity.toLocaleString()}</p>
                                        <Button size="sm" className="mt-2 w-full" onClick={() => shipKitchenItem(item.itemId, item.quantity)}>
                                            <ShipIcon className="mr-2 h-4 w-4"/> Ship to Warehouse
                                        </Button>
                                    </Card>
                                );
                           })}
                         </div>
                    )}
                  </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {selectedField && (
        <PlantingDialog
          isOpen={isPlantingDialogOpen}
          onClose={() => setIsPlantingDialogOpen(false)}
          field={selectedField}
        />
      )}
      <VehicleShopDialog
        isOpen={isVehicleShopOpen}
        onClose={() => setIsVehicleShopOpen(false)}
      />
      <FuelOrderDialog
        isOpen={isFuelOrderOpen}
        onClose={() => setIsFuelOrderOpen(false)}
      />
    </>
  );
}

    
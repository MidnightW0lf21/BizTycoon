
"use client";

import { useGame } from "@/contexts/GameContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LockKeyhole, Sprout, ShoppingCart, DollarSign, Fuel, Warehouse } from "lucide-react";
import { FARM_PURCHASE_COST } from "@/config/game-config";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FarmFieldCard } from "@/components/farm/FarmFieldCard";
import { VehicleCard } from "@/components/farm/VehicleCard";
import { useState, useMemo } from "react";
import { PlantingDialog } from "@/components/farm/PlantingDialog";
import type { FarmField } from "@/types";

const REQUIRED_PRESTIGE_LEVEL_FARM = 15;

export default function FarmPage() {
  const { playerStats, purchaseFarm, harvestField, cultivateField } = useGame();
  const [isPlantingDialogOpen, setIsPlantingDialogOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<FarmField | null>(null);

  const handleOpenPlantingDialog = (field: FarmField) => {
    setSelectedField(field);
    setIsPlantingDialogOpen(true);
  };

  const totalSiloContent = useMemo(() => {
    return (playerStats.siloStorage || []).reduce((sum, item) => sum + item.quantity, 0);
  }, [playerStats.siloStorage]);
  
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
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2"><Warehouse className="h-5 w-5 text-primary"/>Silo Storage</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {totalSiloContent.toLocaleString()} / {(playerStats.siloCapacity || 0).toLocaleString()} units
                  </p>
                  <Button size="sm" variant="outline" className="mt-2" disabled>Upgrade Silo</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2"><Fuel className="h-5 w-5 text-primary"/>Fuel Depot</CardTitle>
                </CardHeader>
                <CardContent>
                   <p className="text-2xl font-bold">
                    {Math.floor(playerStats.fuelStorage || 0)} / {playerStats.fuelCapacity || 0} L
                  </p>
                  <Button size="sm" variant="outline" className="mt-2" disabled>Order Fuel</Button>
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
                  <VehicleCard key={vehicle.instanceId} vehicle={vehicle} />
                ))}
                {/* Placeholder to buy vehicles */}
                <Card>
                  <CardHeader><CardTitle className="text-base">Vehicle Shop</CardTitle></CardHeader>
                  <CardContent><p className="text-sm text-muted-foreground">Purchase new vehicles here.</p></CardContent>
                  <CardFooter><Button disabled>Buy Tractor</Button></CardFooter>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="kitchen" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Kitchen & Logistics</CardTitle>
                <CardDescription>Process harvested crops and ship them to the warehouse. (Coming Soon)</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">This feature is under construction.</p>
              </CardContent>
            </Card>
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
    </>
  );
}

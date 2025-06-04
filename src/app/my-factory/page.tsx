
"use client";

import { useGame } from "@/contexts/GameContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Factory, LockKeyhole, ShoppingCart, DollarSign, Zap, Box, Wrench } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { INITIAL_FACTORY_POWER_BUILDINGS_CONFIG, INITIAL_FACTORY_MACHINE_CONFIGS } from "@/config/game-config";
import { FactoryPowerBuildingCard } from "@/components/factory/FactoryPowerBuildingCard";
import { MachinePurchaseCard } from "@/components/factory/MachinePurchaseCard";
import { ProductionLineDisplay } from "@/components/factory/ProductionLineDisplay";

const REQUIRED_PRESTIGE_LEVEL_MY_FACTORY = 5;
const FACTORY_PURCHASE_COST = 1000000;

export default function MyFactoryPage() {
  const { 
    playerStats, 
    purchaseFactoryBuilding,
    purchaseFactoryPowerBuilding,
    manuallyCollectRawMaterials,
    purchaseFactoryMachine,
    calculateNextMachineCost,
    factoryMachines // Renamed from playerStats.factoryMachines for brevity
  } = useGame();


  if (playerStats.timesPrestiged < REQUIRED_PRESTIGE_LEVEL_MY_FACTORY) {
    return (
      <Card className="w-full md:max-w-2xl mx-auto">
        <CardHeader className="items-center">
          <LockKeyhole className="h-16 w-16 text-primary mb-4" />
          <CardTitle>My Factory Locked</CardTitle>
          <CardDescription className="text-center">
            Unlock powerful factory automation and production lines! <br />
            This feature is available after you have prestiged at least {REQUIRED_PRESTIGE_LEVEL_MY_FACTORY} times.
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

  if (!playerStats.factoryPurchased) {
    return (
      <Card className="w-full md:max-w-lg mx-auto">
        <CardHeader className="items-center">
          <Factory className="h-16 w-16 text-primary mb-4" />
          <CardTitle>Purchase Your Factory</CardTitle>
          <CardDescription className="text-center">
            Invest in your first factory building to start production.
            This is a one-time purchase and will persist through prestiges.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
            <DollarSign className="h-7 w-7" />
            {FACTORY_PURCHASE_COST.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </div>
          <p className="text-sm text-muted-foreground">
            Your current balance: ${playerStats.money.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </p>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={purchaseFactoryBuilding} 
            className="w-full"
            disabled={playerStats.money < FACTORY_PURCHASE_COST}
          >
            <ShoppingCart className="mr-2 h-5 w-5" /> Purchase Factory Building
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const ownedPowerBuildingCounts = playerStats.factoryPowerBuildings.reduce((acc, building) => {
    acc[building.configId] = (acc[building.configId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const nextMachineCost = calculateNextMachineCost(playerStats.factoryMachines.length);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Factory className="h-7 w-7 text-primary" /> Your Industrial Complex
            </CardTitle>
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-1 font-medium">
                <Zap className="h-4 w-4 text-yellow-400" /> Power: {playerStats.factoryPowerUnitsGenerated.toLocaleString()} kW
              </span>
              <span className="flex items-center gap-1 font-medium">
                <Box className="h-4 w-4 text-orange-400" /> Materials: {playerStats.factoryRawMaterials.toLocaleString()} units
              </span>
            </div>
          </div>
          <CardDescription>Manage power, materials, and production lines to create valuable components.</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="power" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="power"><Zap className="mr-2 h-4 w-4"/>Power</TabsTrigger>
          <TabsTrigger value="materials"><Box className="mr-2 h-4 w-4"/>Materials</TabsTrigger>
          <TabsTrigger value="production"><Wrench className="mr-2 h-4 w-4"/>Production</TabsTrigger>
        </TabsList>

        <TabsContent value="power">
          <Card>
            <CardHeader>
              <CardTitle>Power Generation</CardTitle>
              <CardDescription>Build and manage power buildings to supply your factory.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {INITIAL_FACTORY_POWER_BUILDINGS_CONFIG.map(config => (
                <FactoryPowerBuildingCard
                  key={config.id}
                  powerBuildingConfig={config}
                  numOwned={ownedPowerBuildingCounts[config.id] || 0}
                  currentMoney={playerStats.money}
                  onPurchase={() => purchaseFactoryPowerBuilding(config.id)}
                />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials">
          <Card>
            <CardHeader>
              <CardTitle>Raw Material Acquisition</CardTitle>
              <CardDescription>Gather raw materials needed for production.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg">
                Current Raw Materials: <strong className="text-primary">{playerStats.factoryRawMaterials.toLocaleString()} units</strong>
              </p>
              <Button onClick={manuallyCollectRawMaterials} size="lg">
                <Box className="mr-2 h-5 w-5"/>Manually Collect 100 Raw Materials
              </Button>
              <p className="text-sm text-muted-foreground">Automation for material collection will be available later.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="production">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Build Machines</CardTitle>
                <CardDescription>Construct machines to place in your production lines.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {INITIAL_FACTORY_MACHINE_CONFIGS.map(config => (
                  <MachinePurchaseCard
                    key={config.id}
                    machineConfig={config}
                    nextMachineCost={nextMachineCost}
                    playerMoney={playerStats.money}
                    onPurchase={() => purchaseFactoryMachine(config.id)}
                  />
                ))}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Production Lines</CardTitle>
                <CardDescription>Assign machines to production lines to manufacture components.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {playerStats.factoryProductionLines.map((line, index) => (
                  <ProductionLineDisplay
                    key={line.id}
                    productionLine={line}
                    allMachines={playerStats.factoryMachines} 
                    lineIndex={index}
                  />
                ))}
                <p className="text-sm text-muted-foreground text-center pt-4">
                  Machine assignment and component production coming soon!
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

    
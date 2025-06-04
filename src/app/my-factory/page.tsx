
"use client";

import { useGame } from "@/contexts/GameContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Factory, LockKeyhole, ShoppingCart, DollarSign, Zap, Box, Wrench, PackageCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { INITIAL_FACTORY_POWER_BUILDINGS_CONFIG, INITIAL_FACTORY_MACHINE_CONFIGS, INITIAL_FACTORY_COMPONENTS_CONFIG } from "@/config/game-config";
import { FactoryPowerBuildingCard } from "@/components/factory/FactoryPowerBuildingCard";
import { MachinePurchaseCard } from "@/components/factory/MachinePurchaseCard";
import { ProductionLineDisplay } from "@/components/factory/ProductionLineDisplay";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const netPower = playerStats.factoryPowerUnitsGenerated - playerStats.factoryPowerConsumptionKw;

  return (
    <div className="flex flex-col gap-6 h-full">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Factory className="h-7 w-7 text-primary" /> Your Industrial Complex
            </CardTitle>
            <div className="flex gap-4 text-sm flex-wrap justify-end">
              <span className="flex items-center gap-1 font-medium text-yellow-400">
                <Zap className="h-4 w-4" /> Power Gen: {playerStats.factoryPowerUnitsGenerated.toLocaleString()} kW
              </span>
              <span className="flex items-center gap-1 font-medium text-red-400">
                <Zap className="h-4 w-4" /> Power Cons: {playerStats.factoryPowerConsumptionKw.toLocaleString()} kW
              </span>
              <span className={`flex items-center gap-1 font-bold ${netPower >= 0 ? 'text-green-500' : 'text-destructive'}`}>
                <Zap className="h-4 w-4" /> Net Power: {netPower.toLocaleString()} kW
              </span>
              <span className="flex items-center gap-1 font-medium text-orange-400">
                <Box className="h-4 w-4" /> Materials: {playerStats.factoryRawMaterials.toLocaleString()} units
              </span>
            </div>
          </div>
          <CardDescription>Manage power, materials, and production lines to create valuable components.</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="production" className="w-full flex-grow flex flex-col">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="power"><Zap className="mr-2 h-4 w-4"/>Power</TabsTrigger>
          <TabsTrigger value="materials"><Box className="mr-2 h-4 w-4"/>Materials</TabsTrigger>
          <TabsTrigger value="production"><Wrench className="mr-2 h-4 w-4"/>Production</TabsTrigger>
          <TabsTrigger value="inventory"><PackageCheck className="mr-2 h-4 w-4"/>Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="power" className="flex-grow">
          <ScrollArea className="h-[calc(100vh-300px)] pr-2">
            <Card>
              <CardHeader>
                <CardTitle>Power Generation</CardTitle>
                <CardDescription>Build and manage power buildings to supply your factory.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
          </ScrollArea>
        </TabsContent>

        <TabsContent value="materials" className="flex-grow">
          <ScrollArea className="h-[calc(100vh-300px)] pr-2">
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
                  <Box className="mr-2 h-5 w-5"/>Manually Collect 10 Raw Materials
                </Button>
                <p className="text-sm text-muted-foreground">Automation for material collection will be available later.</p>
              </CardContent>
            </Card>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="production" className="flex-grow flex flex-col">
          <ScrollArea className="h-[calc(100vh-300px)] pr-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Build Machines</CardTitle>
                <CardDescription>Construct machines to place in your production lines. Machines are auto-assigned.</CardDescription>
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
                <CardDescription>Machines are auto-assigned to empty slots. Production starts if power and materials are sufficient.</CardDescription>
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
              </CardContent>
            </Card>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="inventory" className="flex-grow">
          <ScrollArea className="h-[calc(100vh-300px)] pr-2">
            <Card>
              <CardHeader>
                <CardTitle>Produced Components</CardTitle>
                <CardDescription>Inventory of components manufactured by your factory. These persist through prestige.</CardDescription>
              </CardHeader>
              <CardContent>
                {Object.keys(playerStats.factoryProducedComponents).length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No components produced yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {INITIAL_FACTORY_COMPONENTS_CONFIG.map(compConfig => {
                      const count = playerStats.factoryProducedComponents[compConfig.id] || 0;
                      if (count > 0 || Object.keys(playerStats.factoryProducedComponents).includes(compConfig.id)) { 
                        const Icon = compConfig.icon;
                        return (
                          <Card key={compConfig.id} className="p-4 flex flex-col items-center justify-center text-center">
                            <Icon className="h-10 w-10 text-primary mb-2" />
                            <p className="font-semibold">{compConfig.name}</p>
                            <p className="text-2xl font-bold text-accent">{count.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">{compConfig.description}</p>
                          </Card>
                        );
                      }
                      return null;
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}


"use client";

import { useGame } from "@/contexts/GameContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { LockKeyhole, Truck, Inbox, Users, Link as LinkIcon, PlusCircle, UserPlus, DollarSign } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { WAREHOUSE_CAPACITY_MAX, WAREHOUSE_UPGRADE_COST_BASE, WAREHOUSE_UPGRADE_COST_MULTIPLIER, KITCHEN_RECIPES, DRIVER_HIRE_COST, TRUCK_DEPOT_SLOT_COST, DRIVER_LOUNGE_SLOT_COST, DRIVER_UPGRADE_COST, DRIVER_UPGRADE_MAX_LEVEL } from "@/config/game-config";
import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContractCard } from "@/components/warehouse/ContractCard";
import { ActiveContractCard } from "@/components/warehouse/ActiveContractCard";
import { TruckCard } from "@/components/warehouse/TruckCard";
import { DriverCard } from "@/components/warehouse/DriverCard";
import { AcceptContractDialog } from "@/components/warehouse/AcceptContractDialog";
import { TruckShopDialog } from "@/components/warehouse/TruckShopDialog";
import type { Contract, Truck as TruckType, Driver as DriverType } from "@/types";

const REQUIRED_PRESTIGE_LEVEL_WAREHOUSE = 15;

export default function WarehousePage() {
  const { playerStats, upgradeWarehouse, hireDriver, upgradeDriver, purchaseTruckDepotSlot, purchaseDriverLoungeSlot, acceptContract, toggleContractPause, abandonContract, refuelTruck, repairTruck } = useGame();

  const [isAcceptContractOpen, setIsAcceptContractOpen] = useState(false);
  const [isTruckShopOpen, setIsTruckShopOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

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

  const handleOpenAcceptDialog = (contract: Contract) => {
    setSelectedContract(contract);
    setIsAcceptContractOpen(true);
  };

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
    <>
    <div className="flex flex-col gap-6">
       <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-6 w-6 text-primary" />
              Delivery Warehouse & Logistics
            </CardTitle>
            <CardDescription>
              Manage your fleet, drivers, and inventory to fulfill shop orders via contracts.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2"><LinkIcon className="h-5 w-5 text-primary"/>Active Contracts</CardTitle>
                </CardHeader>
                <CardContent>
                     <p className="text-2xl font-bold">{playerStats.activeContracts?.length || 0}</p>
                    <p className="text-xs text-muted-foreground">Trucks currently on delivery</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2"><Users className="h-5 w-5 text-primary"/>Driver Pool</CardTitle>
                </CardHeader>
                <CardContent>
                     <p className="text-2xl font-bold">{playerStats.drivers?.length || 0} / {playerStats.driverLoungeCapacity || 0}</p>
                    <p className="text-xs text-muted-foreground">Total available drivers</p>
                </CardContent>
            </Card>
          </CardContent>
        </Card>

      <Tabs defaultValue="logistics" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="logistics">Logistics Center</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="truck_depot">Truck Depot</TabsTrigger>
            <TabsTrigger value="drivers_lounge">Driver's Lounge</TabsTrigger>
          </TabsList>
          
          <TabsContent value="logistics" className="mt-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Contracts</CardTitle>
                <CardDescription>Accept contracts to deliver goods and earn money.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(playerStats.availableContracts || []).length > 0 ? (
                  playerStats.availableContracts!.map(contract => (
                    <ContractCard key={contract.id} contract={contract} onAccept={() => handleOpenAcceptDialog(contract)} />
                  ))
                ) : (
                  <p className="text-muted-foreground text-center col-span-full py-8">No contracts available. Check back soon!</p>
                )}
              </CardContent>
            </Card>
             <Card>
              <CardHeader>
                <CardTitle>Active Deliveries</CardTitle>
                <CardDescription>Monitor your trucks on their delivery routes.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(playerStats.activeContracts || []).length > 0 ? (
                  playerStats.activeContracts!.map(contract => (
                    <ActiveContractCard key={contract.id} contract={contract} onTogglePause={toggleContractPause} onAbandon={abandonContract}/>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center col-span-full py-8">No active deliveries.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="mt-4">
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
                  onClick={upgradeWarehouse}
                  disabled={isWarehouseMaxed || playerStats.money < warehouseUpgradeCost}
                >
                  { isWarehouseMaxed ? "Max Capacity" : `Upgrade ($${warehouseUpgradeCost.toLocaleString()})` }
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="truck_depot" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Truck Depot</span>
                  <span className="text-sm font-medium text-muted-foreground">
                    {(playerStats.trucks?.length || 0)} / {playerStats.truckDepotCapacity || 0} Slots
                  </span>
                </CardTitle>
                <CardDescription>Manage your delivery fleet. More trucks allow more concurrent deliveries.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(playerStats.trucks || []).map(truck => (
                    <TruckCard key={truck.instanceId} truck={truck} onRefuel={refuelTruck} onRepair={repairTruck} playerFuel={playerStats.fuelStorage} playerMoney={playerStats.money}/>
                ))}
                <Card className="flex flex-col justify-center items-center text-center p-4 border-dashed">
                    <PlusCircle className="h-10 w-10 text-muted-foreground mb-2"/>
                    <CardTitle className="text-lg">Buy New Truck</CardTitle>
                    <CardDescription className="mb-4">Expand your fleet.</CardDescription>
                    <Button onClick={() => setIsTruckShopOpen(true)} disabled={(playerStats.trucks?.length || 0) >= (playerStats.truckDepotCapacity || 0)}>
                       {(playerStats.trucks?.length || 0) >= (playerStats.truckDepotCapacity || 0) ? 'Depot Full' : 'Open Truck Shop'}
                    </Button>
                </Card>
              </CardContent>
              <CardFooter>
                 <Button onClick={purchaseTruckDepotSlot} disabled={playerStats.money < TRUCK_DEPOT_SLOT_COST} variant="outline" className="w-full">
                    <Truck className="mr-2 h-4 w-4" />
                    Expand Depot (+1 Slot) - ${TRUCK_DEPOT_SLOT_COST.toLocaleString()}
                  </Button>
              </CardFooter>
            </Card>
          </TabsContent>

           <TabsContent value="drivers_lounge" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span>Driver's Lounge</span>
                    <span className="text-sm font-medium text-muted-foreground">
                        {(playerStats.drivers?.length || 0)} / {playerStats.driverLoungeCapacity || 0} Slots
                    </span>
                </CardTitle>
                <CardDescription>Hire and manage drivers for your trucks. Drivers need rest between trips.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(playerStats.drivers || []).map(driver => (
                    <DriverCard key={driver.id} driver={driver} onUpgrade={upgradeDriver} playerMoney={playerStats.money}/>
                ))}
                 <Card className="flex flex-col justify-center items-center text-center p-4 border-dashed">
                    <UserPlus className="h-10 w-10 text-muted-foreground mb-2"/>
                    <CardTitle className="text-lg">Hire New Driver</CardTitle>
                    <CardDescription className="mb-4">Expand your workforce.</CardDescription>
                    <Button onClick={hireDriver} disabled={(playerStats.drivers?.length || 0) >= (playerStats.driverLoungeCapacity || 0) || playerStats.money < DRIVER_HIRE_COST}>
                       <DollarSign className="mr-2 h-4 w-4" />
                       {(playerStats.drivers?.length || 0) >= (playerStats.driverLoungeCapacity || 0) ? 'Lounge Full' : `Hire (${DRIVER_HIRE_COST.toLocaleString()})`}
                    </Button>
                </Card>
              </CardContent>
              <CardFooter>
                 <Button onClick={purchaseDriverLoungeSlot} disabled={playerStats.money < DRIVER_LOUNGE_SLOT_COST} variant="outline" className="w-full">
                    <Users className="mr-2 h-4 w-4" />
                    Expand Lounge (+1 Slot) - ${DRIVER_LOUNGE_SLOT_COST.toLocaleString()}
                  </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
        </Tabs>
    </div>

    {selectedContract && (
        <AcceptContractDialog 
            isOpen={isAcceptContractOpen} 
            onClose={() => setIsAcceptContractOpen(false)}
            contract={selectedContract}
            onAccept={acceptContract}
        />
    )}
    <TruckShopDialog
        isOpen={isTruckShopOpen}
        onClose={() => setIsTruckShopOpen(false)}
    />
    </>
  );
}

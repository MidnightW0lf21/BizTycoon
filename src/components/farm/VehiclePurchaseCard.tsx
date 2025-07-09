
"use client";

import type { FarmVehicleConfig } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Tractor, Combine, Route, Fuel, Wrench } from "lucide-react";

interface VehiclePurchaseCardProps {
  vehicleConfig: FarmVehicleConfig;
  playerMoney: number;
  onPurchase: (configId: string) => void;
}

export function VehiclePurchaseCard({ vehicleConfig, playerMoney, onPurchase }: VehiclePurchaseCardProps) {
  const canAfford = playerMoney >= vehicleConfig.purchaseCost;
  const Icon = vehicleConfig.icon;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <Icon className="h-6 w-6 text-primary" />
            {vehicleConfig.name}
          </CardTitle>
          <div className="text-sm font-semibold">{vehicleConfig.type}</div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-2 text-sm">
        <div className="flex justify-between">
            <span className="text-muted-foreground flex items-center gap-1"><Route className="h-4 w-4" /> Speed:</span>
            <span>{vehicleConfig.speedHaPerHr} Ha/hr</span>
        </div>
        <div className="flex justify-between">
            <span className="text-muted-foreground flex items-center gap-1"><Fuel className="h-4 w-4" /> Fuel Capacity:</span>
            <span>{vehicleConfig.fuelCapacity} L</span>
        </div>
         <div className="flex justify-between">
            <span className="text-muted-foreground flex items-center gap-1"><Wrench className="h-4 w-4" /> Wear Rate:</span>
            <span>{vehicleConfig.wearPerHr}% per hour</span>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-stretch space-y-2">
         <div className="flex justify-center items-center gap-1 font-bold text-lg text-primary">
            <DollarSign className="h-5 w-5" />
            {vehicleConfig.purchaseCost.toLocaleString()}
        </div>
        <Button onClick={() => onPurchase(vehicleConfig.id)} disabled={!canAfford}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          {canAfford ? "Purchase" : "Not Enough Money"}
        </Button>
      </CardFooter>
    </Card>
  );
}

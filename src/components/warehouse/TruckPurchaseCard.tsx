
"use client";

import type { TruckConfig } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Package, Route, Fuel, Wrench } from "lucide-react";

interface TruckPurchaseCardProps {
  truckConfig: TruckConfig;
  playerMoney: number;
  onPurchase: (configId: string) => void;
}

export function TruckPurchaseCard({ truckConfig, playerMoney, onPurchase }: TruckPurchaseCardProps) {
  const canAfford = playerMoney >= truckConfig.baseCost;
  const Icon = truckConfig.icon;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <Icon className="h-6 w-6 text-primary" />
            {truckConfig.name}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-2 text-sm">
        <div className="flex justify-between">
            <span className="text-muted-foreground flex items-center gap-1"><Package className="h-4 w-4" /> Capacity:</span>
            <span>{truckConfig.capacity} units</span>
        </div>
        <div className="flex justify-between">
            <span className="text-muted-foreground flex items-center gap-1"><Route className="h-4 w-4" /> Speed:</span>
            <span>{truckConfig.speedKmh} km/h</span>
        </div>
        <div className="flex justify-between">
            <span className="text-muted-foreground flex items-center gap-1"><Fuel className="h-4 w-4" /> Fuel Capacity:</span>
            <span>{truckConfig.fuelCapacity} L</span>
        </div>
         <div className="flex justify-between">
            <span className="text-muted-foreground flex items-center gap-1"><Wrench className="h-4 w-4" /> Wear Rate:</span>
            <span>{truckConfig.wearRatePer1000Km}% per 1000km</span>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-stretch space-y-2">
         <div className="flex justify-center items-center gap-1 font-bold text-lg text-primary">
            <DollarSign className="h-5 w-5" />
            {truckConfig.baseCost.toLocaleString()}
        </div>
        <Button onClick={() => onPurchase(truckConfig.id)} disabled={!canAfford}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          {canAfford ? "Purchase" : "Not Enough Money"}
        </Button>
      </CardFooter>
    </Card>
  );
}

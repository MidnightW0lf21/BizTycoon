
"use client";

import type { Truck } from "@/types";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Truck as TruckIcon, Fuel, Wrench, Route } from "lucide-react";
import { cn } from "@/lib/utils";

interface TruckCardProps {
    truck: Truck;
    playerMoney: number;
    playerFuel: number;
    onRefuel: (truckId: string) => void;
    onRepair: (truckId: string) => void;
}

export function TruckCard({ truck, playerMoney, playerFuel, onRefuel, onRepair }: TruckCardProps) {
    const wearPercent = truck.wear; // Assuming wear is 0-100
    // Simplified logic, in a real game this would come from config
    const repairCost = Math.ceil(truck.wear * 100000); 

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><TruckIcon className="h-5 w-5 text-primary"/> Truck #{truck.instanceId.slice(-6)}</span>
                    <span className="text-sm font-medium capitalize text-muted-foreground">{truck.status}</span>
                </CardTitle>
                <CardDescription className="flex items-center gap-1 text-xs">
                    <Route className="h-3 w-3"/> Odometer: {truck.odometerKm.toLocaleString()} km
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="flex items-center gap-1"><Fuel className="h-4 w-4"/> Fuel</span>
                        <span>{truck.fuel.toFixed(0)} L</span>
                    </div>
                    <Progress value={(truck.fuel / 100) * 100} /> 
                </div>
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="flex items-center gap-1"><Wrench className="h-4 w-4"/> Wear & Tear</span>
                        <span>{wearPercent.toFixed(1)}%</span>
                    </div>
                    <Progress value={wearPercent} indicatorClassName={cn(wearPercent > 50 && "bg-yellow-500", wearPercent > 80 && "bg-orange-500", wearPercent > 95 && "bg-destructive")} />
                </div>
            </CardContent>
            <CardFooter className="flex gap-2">
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    disabled={truck.fuel >= 100 || playerFuel < 1 || truck.status !== 'Idle'}
                    onClick={() => onRefuel(truck.instanceId)}
                >
                    <Fuel className="mr-2 h-4 w-4"/> Refuel
                </Button>
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    disabled={truck.wear < 1 || playerMoney < repairCost || truck.status !== 'Idle'}
                    onClick={() => onRepair(truck.instanceId)}
                >
                    <Wrench className="mr-2 h-4 w-4"/> Repair (${repairCost.toLocaleString()})
                </Button>
            </CardFooter>
        </Card>
    );
}

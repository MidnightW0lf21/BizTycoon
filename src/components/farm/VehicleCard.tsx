
"use client";

import type { FarmVehicle } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Fuel, Wrench, Ban, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface VehicleCardProps {
  vehicle: FarmVehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const fuelPercent = (vehicle.fuel / vehicle.fuelCapacity) * 100;
  const wearPercent = vehicle.wear; // Wear is already 0-100

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="flex items-center gap-2">
                    <vehicle.icon className="h-6 w-6 text-primary" />
                    {vehicle.name}
                </CardTitle>
                <CardDescription>
                    Status: <span className={cn("font-semibold", vehicle.status === 'Idle' ? 'text-green-500' : 'text-yellow-500')}>{vehicle.status}</span>
                </CardDescription>
            </div>
            {wearPercent > 95 && (
                <div className="flex items-center gap-1 text-destructive text-xs font-bold p-1 bg-destructive/10 rounded-md">
                    <Ban className="h-3 w-3"/> Needs Repair
                </div>
            )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span className="flex items-center gap-1"><Fuel className="h-4 w-4"/> Fuel</span>
                <span>{Math.floor(vehicle.fuel)} / {vehicle.fuelCapacity} L</span>
            </div>
            <Progress value={fuelPercent} indicatorClassName={cn(fuelPercent < 20 && "bg-destructive")} />
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
        <Button variant="outline" size="sm" className="flex-1" disabled={fuelPercent === 100}>
            <Fuel className="mr-2 h-4 w-4"/> Refuel
        </Button>
        <Button variant="outline" size="sm" className="flex-1" disabled={wearPercent === 0}>
            <Wrench className="mr-2 h-4 w-4"/> Repair
        </Button>
      </CardFooter>
    </Card>
  );
}

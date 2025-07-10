
"use client";

import type { FarmVehicle } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Fuel, Wrench, Ban, Timer, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { VEHICLE_REPAIR_COST_PER_PERCENT, VEHICLE_REPAIR_TIME_PER_PERCENT_SECONDS } from "@/config/game-config";
import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


interface VehicleCardProps {
  vehicle: FarmVehicle;
  onRefuel: (vehicleInstanceId: string) => void;
  onRepair: (vehicleInstanceId: string) => void;
  onSell: (vehicleInstanceId: string) => void;
  playerFuel: number;
  playerMoney: number;
}

export function VehicleCard({ vehicle, onRefuel, onRepair, onSell, playerFuel, playerMoney }: VehicleCardProps) {
  const Icon = vehicle.icon;
  const fuelPercent = (vehicle.fuel / vehicle.fuelCapacity) * 100;
  const wearPercent = vehicle.wear; // Wear is already 0-100

  const repairCost = Math.ceil(vehicle.wear * VEHICLE_REPAIR_COST_PER_PERCENT);
  const totalRepairTimeSeconds = Math.ceil(vehicle.wear * VEHICLE_REPAIR_TIME_PER_PERCENT_SECONDS);
  const canAffordRepair = playerMoney >= repairCost;
  const isRepairing = vehicle.status === 'Repairing';

  const salePrice = Math.floor(vehicle.purchaseCost * 0.5 * (1 - vehicle.wear / 100));

  const [repairTimeLeft, setRepairTimeLeft] = useState(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;
    if (isRepairing && vehicle.activity) {
      const updateCountdown = () => {
        const endTime = vehicle.activity!.startTime + vehicle.activity!.durationSeconds * 1000;
        const timeLeft = Math.max(0, endTime - Date.now());
        setRepairTimeLeft(timeLeft / 1000);
        if (timeLeft === 0 && intervalId) {
          clearInterval(intervalId);
        }
      };
      updateCountdown();
      intervalId = setInterval(updateCountdown, 1000);
    } else {
      setRepairTimeLeft(0);
    }
    return () => clearInterval(intervalId);
  }, [isRepairing, vehicle.activity]);


  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="flex items-center gap-2">
                    <Icon className="h-6 w-6 text-primary" />
                    {vehicle.name}
                </CardTitle>
                <CardDescription>
                    Status: <span className={cn("font-semibold", vehicle.status === 'Idle' ? 'text-green-500' : 'text-yellow-500', isRepairing && 'text-blue-500')}>{vehicle.status}</span>
                </CardDescription>
            </div>
            {wearPercent > 95 && !isRepairing && (
                <div className="flex items-center gap-1 text-destructive text-xs font-bold p-1 bg-destructive/10 rounded-md">
                    <Ban className="h-3 w-3"/> Needs Repair
                </div>
            )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isRepairing && vehicle.activity ? (
            <div className="text-center space-y-2">
                <p className="text-sm font-semibold text-blue-500">Repairing...</p>
                 <Progress value={(1 - repairTimeLeft / totalRepairTimeSeconds) * 100} indicatorClassName="bg-blue-500" />
                <p className="text-xs text-muted-foreground">Time Remaining: {Math.ceil(repairTimeLeft)}s</p>
            </div>
        ) : (
          <>
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
          </>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button 
            variant="outline" 
            size="sm" 
            className="flex-1" 
            disabled={fuelPercent === 100 || playerFuel < 1 || vehicle.status !== 'Idle'}
            onClick={() => onRefuel(vehicle.instanceId)}
        >
            <Fuel className="mr-2 h-4 w-4"/> Refuel
        </Button>
        <Button 
            variant="outline" 
            size="sm" 
            className="flex-1" 
            disabled={wearPercent < 1 || !canAffordRepair || vehicle.status !== 'Idle'}
            onClick={() => onRepair(vehicle.instanceId)}
        >
            <Wrench className="mr-2 h-4 w-4"/> Repair (${repairCost.toLocaleString()})
        </Button>
         <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" disabled={vehicle.status !== 'Idle'}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Sell {vehicle.name}?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to sell this vehicle? It can only be sold when idle.
                <br /><br />
                Original Price: ${vehicle.purchaseCost.toLocaleString()}<br />
                Sale Value (50% base, minus wear): <strong className="text-primary">${salePrice.toLocaleString()}</strong>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive/90"
                onClick={() => onSell(vehicle.instanceId)}
              >
                Sell Vehicle
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}

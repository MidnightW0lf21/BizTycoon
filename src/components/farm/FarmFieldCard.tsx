
"use client";

import type { FarmField, FarmVehicle } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sprout, Tractor, Combine, CheckCircle, Wheat, LandPlot, Unlock, Timer, Fuel, Wrench } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { cn } from "@/lib/utils";
import { FARM_CROPS } from "@/config/game-config";
import { useState, useEffect, useMemo } from "react";

interface FarmFieldCardProps {
  field: FarmField;
  onPlantClick: (field: FarmField) => void;
  onHarvestClick: (fieldId: string) => void;
  onCultivateClick: (fieldId: string) => void;
}

export function FarmFieldCard({ field, onPlantClick, onHarvestClick, onCultivateClick }: FarmFieldCardProps) {
  const { playerStats } = useGame();
  const [timeLeft, setTimeLeft] = useState(0);

  const activeVehicle = useMemo(() => {
    if (!field.activity?.vehicleId) return null;
    return (playerStats.farmVehicles || []).find(v => v.instanceId === field.activity!.vehicleId) || null;
  }, [field.activity, playerStats.farmVehicles]);

  useEffect(() => {
    if (!field.activity) {
      setTimeLeft(0);
      return;
    }

    const calculateTimeLeft = () => {
      const endTime = field.activity!.startTime + (field.activity!.durationSeconds * 1000);
      const remaining = Math.max(0, endTime - Date.now());
      setTimeLeft(remaining / 1000);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);

  }, [field.activity]);


  const getStatusIcon = () => {
    switch (field.status) {
      case 'Sowing': return <Tractor className="h-5 w-5 text-yellow-500" />;
      case 'Growing': return <Sprout className="h-5 w-5 text-green-500" />;
      case 'ReadyToHarvest': return <Combine className="h-5 w-5 text-lime-500" />;
      case 'Harvesting': return <Combine className="h-5 w-5 text-orange-500" />;
      case 'Cultivating': return <Tractor className="h-5 w-5 text-amber-700" />;
      case 'Empty': return <CheckCircle className="h-5 w-5 text-gray-500" />;
      default: return <LandPlot className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getProgress = () => {
    if (!field.activity) return 0;
    const elapsed = Date.now() - field.activity.startTime;
    const progress = (elapsed / (field.activity.durationSeconds * 1000)) * 100;
    return Math.min(100, progress);
  };
  
  const plantedCrop = field.currentCropId ? FARM_CROPS.find(c => c.id === field.currentCropId) : null;

  if (!field.isOwned) {
    return (
       <Card className="border-dashed flex flex-col justify-center items-center text-center p-4">
        <LandPlot className="h-10 w-10 text-muted-foreground mb-2"/>
        <CardTitle className="text-lg">{field.name}</CardTitle>
        <CardDescription>{field.sizeHa} Hectares</CardDescription>
        <Button size="sm" className="mt-4" disabled>
            <Unlock className="mr-2 h-4 w-4"/>
            Purchase
        </Button>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{field.name}</CardTitle>
          <span className="text-sm text-muted-foreground">{field.sizeHa} Ha</span>
        </div>
        <div className="flex items-center gap-2">
            {getStatusIcon()}
            <p className="text-sm font-semibold capitalize">{field.status.replace(/([A-Z])/g, ' $1').trim()}</p>
        </div>
      </CardHeader>
      <CardContent>
        {plantedCrop && (
            <div className="flex items-center gap-2 text-sm mb-2">
                <plantedCrop.icon className="h-4 w-4 text-yellow-600"/>
                <span>Currently Planted: {plantedCrop.name}</span>
            </div>
        )}
        {(field.status === 'Sowing' || field.status === 'Growing' || field.status === 'Harvesting' || field.status === 'Cultivating') && field.activity && (
          <div className="space-y-2">
            <div>
              <Progress value={getProgress()} className="h-2" />
              <div className="flex items-center justify-center text-xs text-muted-foreground gap-1 mt-1">
                <Timer className="h-3 w-3" />
                <span>{Math.ceil(timeLeft)}s remaining</span>
              </div>
            </div>
            {activeVehicle && (field.status === 'Sowing' || field.status === 'Harvesting' || field.status === 'Cultivating') && (
              <div className="space-y-1 text-xs text-muted-foreground border-t pt-2">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1"><Fuel className="h-3 w-3 text-orange-400"/> {activeVehicle.name} Fuel</span>
                  <span>{((activeVehicle.fuel / activeVehicle.fuelCapacity) * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1"><Wrench className="h-3 w-3 text-red-400"/> {activeVehicle.name} Wear</span>
                  <span>{activeVehicle.wear.toFixed(1)}%</span>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        {field.status === 'Empty' && (
            <Button onClick={() => onPlantClick(field)} size="sm" className="w-full">
                <Sprout className="mr-2 h-4 w-4"/> Plant Crop
            </Button>
        )}
        {field.status === 'ReadyToHarvest' && (
            <Button onClick={() => onHarvestClick(field.id)} size="sm" className="w-full">
                <Combine className="mr-2 h-4 w-4"/> Harvest
            </Button>
        )}
         {field.status === 'Cultivating' && !field.activity && (
            <Button onClick={() => onCultivateClick(field.id)} size="sm" className="w-full">
                <Tractor className="mr-2 h-4 w-4"/> Cultivate
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}


"use client";

import type { FarmField } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sprout, Tractor, Combine, CheckCircle, Wheat, LandPlot, Unlock } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { cn } from "@/lib/utils";

interface FarmFieldCardProps {
  field: FarmField;
  onPlantClick: (field: FarmField) => void;
}

export function FarmFieldCard({ field, onPlantClick }: FarmFieldCardProps) {
  const { playerStats } = useGame(); // Use context for more complex actions later

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
        {field.currentCropId && (
            <div className="flex items-center gap-2 text-sm mb-2">
                <Wheat className="h-4 w-4 text-yellow-600"/>
                <span>Currently Planted: {field.currentCropId}</span>
            </div>
        )}
        {(field.status === 'Sowing' || field.status === 'Growing' || field.status === 'Harvesting' || field.status === 'Cultivating') && field.activity && (
          <Progress value={getProgress()} className="h-2" />
        )}
      </CardContent>
      <CardFooter>
        {field.status === 'Empty' && (
            <Button onClick={() => onPlantClick(field)} size="sm" className="w-full">
                <Sprout className="mr-2 h-4 w-4"/> Plant Crop
            </Button>
        )}
        {field.status === 'ReadyToHarvest' && (
            <Button size="sm" className="w-full" disabled>
                <Combine className="mr-2 h-4 w-4"/> Harvest
            </Button>
        )}
         {field.status === 'Cultivating' && (
            <Button size="sm" className="w-full" disabled>
                <Tractor className="mr-2 h-4 w-4"/> Cultivate
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}


"use client";

import type { FarmField } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FARM_CROPS, FARM_VEHICLES } from "@/config/game-config";
import { useState } from "react";
import { useGame } from "@/contexts/GameContext";
import { Sprout } from "lucide-react";

interface PlantingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  field: FarmField;
}

export function PlantingDialog({ isOpen, onClose, field }: PlantingDialogProps) {
  const { playerStats, plantCrop } = useGame();
  const [selectedCropId, setSelectedCropId] = useState<string | null>(null);
  const [selectedTractorId, setSelectedTractorId] = useState<string | null>(null);

  const availableTractors = (playerStats.farmVehicles || []).filter(v => v.type === 'Tractor' && v.status === 'Idle');

  const handlePlant = () => {
    if (selectedCropId && selectedTractorId) {
      plantCrop(field.id, selectedCropId, selectedTractorId);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Plant Crop on {field.name}</DialogTitle>
          <DialogDescription>Select a crop to plant and an available tractor to perform the sowing.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">1. Select Crop</h3>
            <RadioGroup onValueChange={setSelectedCropId}>
              <div className="space-y-2">
                {FARM_CROPS.map(crop => (
                  <Label key={crop.id} htmlFor={crop.id} className="flex items-center gap-3 rounded-md border p-3 hover:bg-accent hover:text-accent-foreground has-[:checked]:border-primary">
                    <RadioGroupItem value={crop.id} id={crop.id} />
                    <crop.icon className="h-5 w-5"/>
                    <div className="flex-1">
                      <p className="font-semibold">{crop.name}</p>
                      <p className="text-xs text-muted-foreground">Growth Time: {crop.growthTimeSeconds / 60} min</p>
                    </div>
                  </Label>
                ))}
              </div>
            </RadioGroup>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">2. Select Tractor</h3>
            <RadioGroup onValueChange={setSelectedTractorId}>
              <div className="space-y-2">
                {availableTractors.length > 0 ? availableTractors.map(tractor => (
                   <Label key={tractor.instanceId} htmlFor={tractor.instanceId} className="flex items-center gap-3 rounded-md border p-3 hover:bg-accent hover:text-accent-foreground has-[:checked]:border-primary">
                    <RadioGroupItem value={tractor.instanceId} id={tractor.instanceId} />
                    <tractor.icon className="h-5 w-5"/>
                    <div className="flex-1">
                      <p className="font-semibold">{tractor.name}</p>
                      <p className="text-xs text-muted-foreground">Fuel: {Math.floor(tractor.fuel)}L, Wear: {tractor.wear.toFixed(1)}%</p>
                    </div>
                  </Label>
                )) : (
                    <p className="text-sm text-muted-foreground text-center p-4 border rounded-md">No available tractors.</p>
                )}
              </div>
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handlePlant} disabled={!selectedCropId || !selectedTractorId}>
            <Sprout className="mr-2 h-4 w-4"/> Plant
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

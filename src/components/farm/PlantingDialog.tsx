
"use client";

import type { FarmField } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FARM_CROPS, FARM_VEHICLES } from "@/config/game-config";
import { useState, useMemo, useCallback } from "react";
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

  const availableTractors = useMemo(() => {
    return (playerStats.farmVehicles || []).filter(v => v.type === 'Tractor' && v.status === 'Idle');
  }, [playerStats.farmVehicles]);
  
  const selectedCrop = useMemo(() => {
    if (!selectedCropId) return null;
    return FARM_CROPS.find(c => c.id === selectedCropId) || null;
  }, [selectedCropId]);

  const selectedTractor = useMemo(() => {
    if (!selectedTractorId) return null;
    return availableTractors.find(t => t.instanceId === selectedTractorId) || null;
  }, [selectedTractorId, availableTractors]);
  
  const formatTime = useCallback((seconds: number | null) => {
    if (seconds === null || isNaN(seconds)) return '-';
    if (seconds < 60) return `${Math.ceil(seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.ceil(seconds % 60);
    if(remainingSeconds === 0) return `${minutes}m`;
    return `${minutes}m ${remainingSeconds}s`;
  }, []);

  const getSowingTime = useCallback((tractor: typeof selectedTractor) => {
    if (!tractor) return null;
    return (field.sizeHa / tractor.speedHaPerHr) * 3600;
  }, [field.sizeHa]);


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
            <RadioGroup onValueChange={setSelectedCropId} disabled={!selectedTractorId}>
              <div className="space-y-2">
                {FARM_CROPS.map(crop => (
                  <Label key={crop.id} htmlFor={crop.id} className="flex items-center gap-3 rounded-md border p-3 hover:bg-accent hover:text-accent-foreground has-[:checked]:border-primary has-[:disabled]:opacity-50 has-[:disabled]:cursor-not-allowed">
                    <RadioGroupItem value={crop.id} id={crop.id} disabled={!selectedTractorId} />
                    <crop.icon className="h-5 w-5"/>
                    <div className="flex-1">
                      <p className="font-semibold">{crop.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Sowing Time: {selectedTractor ? formatTime(getSowingTime(selectedTractor)) : 'Select tractor'}
                      </p>
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
                {availableTractors.length > 0 ? availableTractors.map(tractor => {
                   const Icon = tractor.icon;
                   return (
                   <Label key={tractor.instanceId} htmlFor={tractor.instanceId} className="flex items-center gap-3 rounded-md border p-3 hover:bg-accent hover:text-accent-foreground has-[:checked]:border-primary">
                    <RadioGroupItem value={tractor.instanceId} id={tractor.instanceId} />
                    <Icon className="h-5 w-5"/>
                    <div className="flex-1">
                      <p className="font-semibold">{tractor.name}</p>
                      <p className="text-xs text-muted-foreground">Fuel: {tractor.fuel.toFixed(1)}L, Wear: {tractor.wear.toFixed(1)}%</p>
                    </div>
                  </Label>
                )}) : (
                    <p className="text-sm text-muted-foreground text-center p-4 border rounded-md">No available tractors.</p>
                )}
              </div>
            </RadioGroup>
          </div>
        </div>
        
        {selectedCrop && selectedTractor && (
            <div className="text-center bg-muted/50 p-3 rounded-md">
                <p className="font-semibold">
                    Planting <span className="text-primary">{selectedCrop.name}</span> with <span className="text-primary">{selectedTractor.name}</span> will take approximately <span className="text-primary">{formatTime(getSowingTime(selectedTractor))}</span> to sow.
                </p>
                <p className="text-xs text-muted-foreground">The crop will then take {formatTime(selectedCrop.growthTimeSeconds)} to grow.</p>
            </div>
        )}

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

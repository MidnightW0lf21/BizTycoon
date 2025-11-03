
"use client";

import type { Contract } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useGame } from "@/contexts/GameContext";
import { useState, useMemo } from "react";
import { Truck, User } from "lucide-react";

interface AcceptContractDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contract: Contract;
  onAccept: (contractId: string, truckId: string, driverId: string) => void;
}

export function AcceptContractDialog({ isOpen, onClose, contract, onAccept }: AcceptContractDialogProps) {
  const { playerStats } = useGame();
  const [selectedTruckId, setSelectedTruckId] = useState<string | null>(null);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);

  const availableTrucks = useMemo(() => {
    return (playerStats.trucks || []).filter(t => t.status === 'Idle');
  }, [playerStats.trucks]);
  
  const availableDrivers = useMemo(() => {
    return (playerStats.drivers || []).filter(d => d.status === 'Idle');
  }, [playerStats.drivers]);

  const handleAccept = () => {
    if (selectedTruckId && selectedDriverId) {
      onAccept(contract.id, selectedTruckId, selectedDriverId);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assign to Contract: {contract.destinationName}</DialogTitle>
          <DialogDescription>Select an available truck and driver for this delivery.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">1. Select Truck</h3>
            <RadioGroup onValueChange={setSelectedTruckId} className="space-y-2">
              {availableTrucks.length > 0 ? availableTrucks.map(truck => (
                <Label key={truck.instanceId} htmlFor={truck.instanceId} className="flex items-center gap-3 rounded-md border p-3 hover:bg-accent hover:text-accent-foreground has-[:checked]:border-primary">
                  <RadioGroupItem value={truck.instanceId} id={truck.instanceId} />
                  <Truck className="h-5 w-5"/>
                  <div className="flex-1">
                    <p className="font-semibold">Truck #{truck.instanceId.slice(-6)}</p>
                    <p className="text-xs text-muted-foreground">Fuel: {truck.fuel.toFixed(0)}L, Wear: {truck.wear.toFixed(1)}%</p>
                  </div>
                </Label>
              )) : (
                <p className="text-sm text-muted-foreground text-center p-4 border rounded-md">No available trucks.</p>
              )}
            </RadioGroup>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">2. Select Driver</h3>
            <RadioGroup onValueChange={setSelectedDriverId} disabled={!selectedTruckId} className="space-y-2">
              {availableDrivers.length > 0 ? availableDrivers.map(driver => (
                <Label key={driver.id} htmlFor={driver.id} className="flex items-center gap-3 rounded-md border p-3 hover:bg-accent hover:text-accent-foreground has-[:checked]:border-primary has-[:disabled]:opacity-50 has-[:disabled]:cursor-not-allowed">
                  <RadioGroupItem value={driver.id} id={driver.id} disabled={!selectedTruckId} />
                  <User className="h-5 w-5"/>
                  <div className="flex-1">
                    <p className="font-semibold">{driver.name}</p>
                    <p className="text-xs text-muted-foreground">Energy: {driver.energy.toFixed(0)}/{driver.maxEnergy.toFixed(0)}</p>
                  </div>
                </Label>
              )) : (
                <p className="text-sm text-muted-foreground text-center p-4 border rounded-md">No available drivers.</p>
              )}
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleAccept} disabled={!selectedTruckId || !selectedDriverId}>
            Start Delivery
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


"use client";

import { useState, useMemo } from "react";
import { useGame } from "@/contexts/GameContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FUEL_ORDER_COST_PER_LTR, FUEL_DELIVERY_TIME_BASE_SECONDS, FUEL_DELIVERY_TIME_PER_LTR_SECONDS } from "@/config/game-config";
import { DollarSign, Timer, Fuel } from "lucide-react";

interface FuelOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FuelOrderDialog({ isOpen, onClose }: FuelOrderDialogProps) {
  const { playerStats, orderFuel } = useGame();
  const maxOrderAmount = Math.max(0, (playerStats.fuelCapacity || 0) - (playerStats.fuelStorage || 0));
  const maxAffordableAmount = Math.floor(playerStats.money / FUEL_ORDER_COST_PER_LTR);
  const effectiveMaxAmount = Math.floor(Math.min(maxOrderAmount, maxAffordableAmount));

  const [fuelAmount, setFuelAmount] = useState(Math.min(100, effectiveMaxAmount));

  const calculatedCost = useMemo(() => {
    return fuelAmount * FUEL_ORDER_COST_PER_LTR;
  }, [fuelAmount]);

  const calculatedTime = useMemo(() => {
    return FUEL_DELIVERY_TIME_BASE_SECONDS + fuelAmount * FUEL_DELIVERY_TIME_PER_LTR_SECONDS;
  }, [fuelAmount]);
  
  const handleOrder = () => {
    if (fuelAmount > 0) {
      orderFuel(fuelAmount);
      onClose();
    }
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${Math.ceil(seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.ceil(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Order Fuel</DialogTitle>
          <DialogDescription>Select how much fuel you want to order. The cost and delivery time will update automatically.</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fuelAmount">Fuel Amount (Liters)</Label>
            <div className="flex items-center gap-4">
              <Slider
                id="fuelAmount"
                min={0}
                max={effectiveMaxAmount}
                step={1}
                value={[fuelAmount]}
                onValueChange={(value) => setFuelAmount(value[0])}
                disabled={effectiveMaxAmount === 0}
              />
              <Input
                type="number"
                className="w-24"
                value={fuelAmount}
                onChange={(e) => setFuelAmount(Math.max(0, Math.min(effectiveMaxAmount, parseInt(e.target.value) || 0)))}
                disabled={effectiveMaxAmount === 0}
              />
            </div>
            <p className="text-xs text-muted-foreground">Max possible order: {effectiveMaxAmount.toLocaleString()} L</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 rounded-md bg-muted/50">
              <p className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-1"><DollarSign className="h-4 w-4"/>Total Cost</p>
              <p className="text-xl font-bold text-primary">${calculatedCost.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-md bg-muted/50">
              <p className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-1"><Timer className="h-4 w-4"/>Delivery Time</p>
              <p className="text-xl font-bold text-primary">{formatTime(calculatedTime)}</p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleOrder} disabled={fuelAmount <= 0 || calculatedCost > playerStats.money}>
            <Fuel className="mr-2 h-4 w-4" /> Place Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    
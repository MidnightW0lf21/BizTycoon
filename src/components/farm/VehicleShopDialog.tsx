
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FARM_VEHICLES } from "@/config/game-config";
import { VehiclePurchaseCard } from "./VehiclePurchaseCard";
import { useGame } from "@/contexts/GameContext";

interface VehicleShopDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VehicleShopDialog({ isOpen, onClose }: VehicleShopDialogProps) {
  const { playerStats, purchaseVehicle } = useGame();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Vehicle Shop</DialogTitle>
          <DialogDescription>Purchase new tractors and harvesters to expand your farm's capabilities.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] p-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {FARM_VEHICLES.map(vehicleConfig => (
              <VehiclePurchaseCard
                key={vehicleConfig.id}
                vehicleConfig={vehicleConfig}
                playerMoney={playerStats.money}
                onPurchase={purchaseVehicle}
              />
            ))}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

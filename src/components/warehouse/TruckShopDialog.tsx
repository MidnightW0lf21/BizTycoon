
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TRUCKS_CONFIG } from "@/config/data/trucks";
import { TruckPurchaseCard } from "./TruckPurchaseCard";
import { useGame } from "@/contexts/GameContext";

interface TruckShopDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TruckShopDialog({ isOpen, onClose }: TruckShopDialogProps) {
  const { playerStats, purchaseTruck } = useGame();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Truck Shop</DialogTitle>
          <DialogDescription>Purchase new trucks to expand your delivery fleet.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] p-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {TRUCKS_CONFIG.map(truckConfig => (
              <TruckPurchaseCard
                key={truckConfig.id}
                truckConfig={truckConfig}
                playerMoney={playerStats.money}
                onPurchase={purchaseTruck}
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


"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { QuarryChoice } from "@/types";
import { Gem, ArrowRight, TrendingUp, TrendingDown, Diamond, Shield } from "lucide-react";

interface QuarrySelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  quarryChoices: QuarryChoice[];
  onSelect: (choice: QuarryChoice) => void;
  playerMinerals: number;
}

export function QuarrySelectionDialog({ isOpen, onClose, quarryChoices, onSelect, playerMinerals }: QuarrySelectionDialogProps) {

  const getRarityIcon = (rarity: string) => {
    switch(rarity) {
      case 'Uncommon': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'Rare': return <Diamond className="h-4 w-4 text-blue-500" />;
      case 'Legendary': return <Shield className="h-4 w-4 text-amber-500" />;
      default: return <TrendingDown className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Choose Your Next Quarry</DialogTitle>
          <DialogDescription>
            A new deposit has been found. Scout reports suggest three potential excavation sites, each with unique characteristics. Your choice will affect the types of artifacts you are more likely to find.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
          {quarryChoices.map((choice, index) => {
            const canAfford = playerMinerals >= choice.cost;
            return (
              <Card key={index} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{choice.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Target Depth:</span>
                    <span className="font-semibold">{(choice.depth / 100).toFixed(2)}m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cost:</span>
                    <div className="flex items-center gap-1 font-semibold text-primary">
                      <Gem className="h-4 w-4" />
                      {choice.cost.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-start gap-2 pt-2">
                    {getRarityIcon(choice.rarityBias)}
                    <p className="text-xs text-muted-foreground">{choice.description}</p>
                  </div>
                </CardContent>
                <div className="p-4 pt-0">
                  <Button 
                    className="w-full"
                    onClick={() => onSelect(choice)}
                    disabled={!canAfford}
                  >
                    Select Site <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

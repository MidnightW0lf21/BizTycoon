
"use client";

import type { FactoryMachine, FactoryMachineConfig, FactoryComponent } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Settings, Cog, Zap, Box, HelpCircle, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecipeSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  productionLineId: string;
  slotIndex: number;
  assignedMachineInstanceId: string | null;
  allMachineConfigs: FactoryMachineConfig[];
  allPlayerMachines: FactoryMachine[];
  allComponentConfigs: FactoryComponent[];
  setRecipe: (productionLineId: string, slotIndex: number, componentId: string | null) => void;
  currentRecipeId: string | null;
}

export function RecipeSelectionDialog({
  isOpen,
  onClose,
  productionLineId,
  slotIndex,
  assignedMachineInstanceId,
  allMachineConfigs,
  allPlayerMachines,
  allComponentConfigs,
  setRecipe,
  currentRecipeId,
}: RecipeSelectionDialogProps) {
  if (!isOpen) return null;

  const assignedMachine = assignedMachineInstanceId 
    ? allPlayerMachines.find(m => m.instanceId === assignedMachineInstanceId) 
    : null;
  
  const machineConfig = assignedMachine 
    ? allMachineConfigs.find(mc => mc.id === assignedMachine.configId) 
    : null;

  const handleSelectRecipe = (componentId: string) => {
    setRecipe(productionLineId, slotIndex, componentId);
    onClose();
  };

  const handleClearRecipe = () => {
    setRecipe(productionLineId, slotIndex, null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select Recipe for {machineConfig ? machineConfig.name : "Machine"} in Slot {slotIndex + 1}</DialogTitle>
          <DialogDescription>
            Choose a component for this machine to produce. The machine must be capable of crafting the selected tier.
          </DialogDescription>
        </DialogHeader>

        {!machineConfig && (
          <div className="py-8 text-center text-muted-foreground">
            <HelpCircle className="mx-auto h-12 w-12 mb-2" />
            No machine assigned to this slot.
          </div>
        )}

        {machineConfig && (
          <>
            <ScrollArea className="h-[60vh] pr-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                {allComponentConfigs.map((component) => {
                  const canCraft = machineConfig.maxCraftableTier >= component.tier;
                  const isCurrentlyCraftingThis = currentRecipeId === component.id;
                  const Icon = component.icon;

                  return (
                    <Card 
                      key={component.id} 
                      className={cn(
                        isCurrentlyCraftingThis ? "border-primary shadow-lg ring-2 ring-primary" : "border-border",
                        !canCraft && "bg-muted/50 opacity-70"
                      )}
                    >
                      <CardHeader className="pb-2 pt-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Icon className="h-6 w-6 text-primary" />
                            {component.name}
                          </CardTitle>
                          <Badge variant={canCraft ? "default" : "secondary"} className={!canCraft ? "bg-destructive text-destructive-foreground" : ""}>
                            Tier {component.tier}
                          </Badge>
                        </div>
                        <CardDescription className="text-xs">{component.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="text-xs space-y-2 pt-1 pb-3">
                        <div className="flex justify-between">
                          <span>Requires Assembler:</span>
                          <span className="font-semibold">Mk{component.requiredAssemblerMark}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Raw Materials:</span>
                          <span className="font-semibold flex items-center gap-1">
                            <Box className="h-3 w-3" /> {component.rawMaterialCost}
                          </span>
                        </div>
                        {component.recipe.length > 0 && (
                          <div>
                            <p className="font-medium mb-1">Input Components:</p>
                            <ul className="list-disc list-inside pl-1 space-y-0.5">
                              {component.recipe.map(input => {
                                const inputCompConfig = allComponentConfigs.find(c => c.id === input.componentId);
                                return (
                                  <li key={input.componentId}>
                                    {input.quantity}x {inputCompConfig?.name || input.componentId}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        )}
                         <p className="text-xs text-muted-foreground pt-1">
                           Production Time: {component.productionTimeSeconds}s
                         </p>
                      </CardContent>
                      <div className="p-3 pt-0">
                        <Button
                          onClick={() => handleSelectRecipe(component.id)}
                          disabled={!canCraft || isCurrentlyCraftingThis}
                          className="w-full"
                          variant={isCurrentlyCraftingThis ? "secondary" : (canCraft ? "default" : "outline")}
                        >
                          {isCurrentlyCraftingThis ? (
                            <> <CheckCircle className="mr-2 h-4 w-4"/> Currently Crafting </>
                          ) : canCraft ? (
                            <> <PlusCircle className="mr-2 h-4 w-4"/> Select Recipe </>
                          ) : (
                            <> <XCircle className="mr-2 h-4 w-4"/> Machine Incapable </>
                          )}
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={handleClearRecipe} disabled={currentRecipeId === null}>
                Clear Recipe (Set to Idle)
              </Button>
              <Button onClick={onClose}>Close</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

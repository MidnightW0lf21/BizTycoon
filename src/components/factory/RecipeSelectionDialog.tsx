
"use client";

import type { FactoryMachine, FactoryMachineConfig, FactoryComponent, Worker } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Settings, Cog, Zap, Box, HelpCircle, PlusCircle, UserCog, UserPlus } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { MAX_WORKER_ENERGY } from "@/config/game-config";

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
  allWorkers: Worker[];
  assignWorkerToMachine: (workerId: string | null, machineInstanceId: string) => void;
  currentAssignedWorkerId: string | null;
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
  allWorkers,
  assignWorkerToMachine,
  currentAssignedWorkerId,
}: RecipeSelectionDialogProps) {
  if (!isOpen || !assignedMachineInstanceId) return null; // Dialog shouldn't open without a machine

  const assignedMachine = allPlayerMachines.find(m => m.instanceId === assignedMachineInstanceId);
  const machineConfig = assignedMachine ? allMachineConfigs.find(mc => mc.id === assignedMachine.configId) : null;

  const handleSelectRecipe = (componentId: string) => {
    setRecipe(productionLineId, slotIndex, componentId);
    // Keep dialog open if worker assignment is also part of this dialog
  };

  const handleClearRecipe = () => {
    setRecipe(productionLineId, slotIndex, null);
    // Keep dialog open
  };

  const handleWorkerAssignment = (workerId: string | null) => {
    if (assignedMachineInstanceId) {
      assignWorkerToMachine(workerId, assignedMachineInstanceId);
    }
  };

  const formatEnergyTime = (energy: number) => {
    const totalSeconds = energy; // Assuming WORKER_ENERGY_RATE is 1 per second
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };


  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-3xl"> {/* Increased width */}
        <DialogHeader>
          <DialogTitle>Configure Slot {slotIndex + 1} ({machineConfig ? machineConfig.name : "Machine"})</DialogTitle>
          <DialogDescription>
            Select a component for this machine to produce and assign a worker.
          </DialogDescription>
        </DialogHeader>

        {!machineConfig && (
          <div className="py-8 text-center text-muted-foreground">
            <HelpCircle className="mx-auto h-12 w-12 mb-2" />
            Machine configuration not found.
          </div>
        )}

        {machineConfig && assignedMachineInstanceId && (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Select Recipe</h3>
              <ScrollArea className="h-[50vh] pr-4 border rounded-md p-2">
                <div className="grid grid-cols-1 gap-3">
                  {allComponentConfigs.map((component) => {
                    const canCraft = machineConfig.maxCraftableTier >= component.tier;
                    const isCurrentlyCraftingThis = currentRecipeId === component.id;
                    const Icon = component.icon;

                    return (
                      <Card
                        key={component.id}
                        className={cn(
                          "cursor-pointer hover:shadow-md",
                          isCurrentlyCraftingThis ? "border-primary ring-2 ring-primary shadow-lg" : "border-border",
                          !canCraft && "bg-muted/50 opacity-70 cursor-not-allowed"
                        )}
                        onClick={() => canCraft && handleSelectRecipe(component.id)}
                      >
                        <CardHeader className="pb-1 pt-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base flex items-center gap-2">
                              <Icon className="h-5 w-5 text-primary" />
                              {component.name}
                            </CardTitle>
                            <Badge variant={isCurrentlyCraftingThis ? "default" : (canCraft ? "outline" : "secondary")} className={!canCraft && !isCurrentlyCraftingThis ? "bg-destructive text-destructive-foreground" : ""}>
                              Tier {component.tier}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="text-xs space-y-1 pt-1 pb-2">
                           <div className="flex justify-between text-muted-foreground">
                            <span>Raw Materials: <Box className="inline h-3 w-3 mr-1"/>{component.rawMaterialCost}</span>
                            <span>Time: {component.productionTimeSeconds}s</span>
                          </div>
                          {component.recipe.length > 0 && (
                            <div>
                              <p className="font-medium text-xs text-muted-foreground mb-0.5">Inputs:</p>
                              <ul className="list-none pl-0 space-y-0.5 text-muted-foreground">
                                {component.recipe.map(input => {
                                  const inputCompConfig = allComponentConfigs.find(c => c.id === input.componentId);
                                  const InputIcon = inputCompConfig?.icon || Settings;
                                  return (
                                    <li key={input.componentId} className="flex items-center text-xs">
                                      <InputIcon className="h-3 w-3 mr-1"/>
                                      {input.quantity}x {inputCompConfig?.name || input.componentId}
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          )}
                          
                        </CardContent>
                         {isCurrentlyCraftingThis && (
                            <div className="p-2 pt-0 text-center">
                                <Badge variant="secondary" className="bg-green-500/20 text-green-700 dark:text-green-400">Currently Crafting</Badge>
                            </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><UserCog className="h-5 w-5"/>Assign Worker</h3>
                 <Select
                    value={currentAssignedWorkerId || "none"}
                    onValueChange={(value) => handleWorkerAssignment(value === "none" ? null : value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a worker" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (Unassign)</SelectItem>
                      <SelectGroup>
                        <SelectLabel>Available Workers</SelectLabel>
                        {allWorkers.filter(w => w.assignedMachineInstanceId === null || w.assignedMachineInstanceId === assignedMachineInstanceId).map(worker => (
                          <SelectItem key={worker.id} value={worker.id}>
                            {worker.name} - {formatEnergyTime(worker.energy)} ({worker.status})
                          </SelectItem>
                        ))}
                      </SelectGroup>
                      {allWorkers.filter(w => w.assignedMachineInstanceId !== null && w.assignedMachineInstanceId !== assignedMachineInstanceId).length > 0 && (
                        <SelectGroup>
                           <SelectLabel className="text-muted-foreground italic">Assigned Elsewhere</SelectLabel>
                           {allWorkers.filter(w => w.assignedMachineInstanceId !== null && w.assignedMachineInstanceId !== assignedMachineInstanceId).map(worker => {
                             const assignedMachine = allPlayerMachines.find(m => m.instanceId === worker.assignedMachineInstanceId);
                             const assignedMachineConfig = assignedMachine ? allMachineConfigs.find(mc => mc.id === assignedMachine.configId) : null;
                             return (
                                <SelectItem key={worker.id} value={worker.id}>
                                    {worker.name} - {formatEnergyTime(worker.energy)} ({worker.status}) (on {assignedMachineConfig?.name || 'another machine'})
                                </SelectItem>
                             );
                           })}
                        </SelectGroup>
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Assigning a worker already on another machine will unassign them from their current task.
                  </p>
              </div>

              <div>
                 <h3 className="text-lg font-semibold mb-2">Actions</h3>
                 <Button variant="outline" onClick={handleClearRecipe} disabled={currentRecipeId === null} className="w-full">
                    <XCircle className="mr-2 h-4 w-4" /> Clear Recipe (Set Machine to Idle)
                  </Button>
              </div>
            </div>

          </div>
        )}
        <DialogFooter className="mt-6">
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    


"use client";

import type { FactoryComponent, FactoryMachineConfig, PlayerStats } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, PackageX, LockKeyhole, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useMemo } from 'react';
import { INITIAL_HQ_UPGRADES } from "@/config/game-config";

interface SetLineRecipeDialogProps {
    isOpen: boolean;
    onClose: () => void;
    productionLineId: string;
    allComponentConfigs: FactoryComponent[];
    allMachineConfigs: FactoryMachineConfig[];
    setRecipeForEntireLine: (lineId: string, componentId: string) => void;
    playerStats: PlayerStats;
}

export function SetLineRecipeDialog({
    isOpen,
    onClose,
    productionLineId,
    allComponentConfigs,
    allMachineConfigs,
    setRecipeForEntireLine,
    playerStats,
}: SetLineRecipeDialogProps) {

    const line = useMemo(() => playerStats.factoryProductionLines.find(l => l.id === productionLineId), [playerStats.factoryProductionLines, productionLineId]);

    const handleSelectRecipe = (componentId: string) => {
        setRecipeForEntireLine(productionLineId, componentId);
        onClose();
    };

    const getHqUnlockNameForComponent = (componentId: string): string | null => {
        const hqUpgrade = INITIAL_HQ_UPGRADES.find(hq => 
            hq.levels.some(l => l.effects.unlocksFactoryComponentRecipeIds?.includes(componentId))
        );
        return hqUpgrade?.name || null;
    };

    const isComponentCapped = (component: FactoryComponent): boolean => {
      const ownedCount = playerStats.factoryProducedComponents?.[component.id] || 0;
      if (ownedCount === 0 || !component.effects || !component.effects.maxBonusPercent) {
          return false;
      }
      return (ownedCount * (component.effects.globalIncomeBoostPerComponentPercent || 0)) >= component.effects.maxBonusPercent;
    };
    
    // Determine the minimum `maxCraftableTier` of all machines present in the line
    const minTierOfLine = useMemo(() => {
        if (!line) return 0;
        let minTier = Infinity;
        let hasMachines = false;
        line.slots.forEach(slot => {
            if (slot.machineInstanceId) {
                const machineInstance = playerStats.factoryMachines.find(m => m.instanceId === slot.machineInstanceId);
                const machineConfig = machineInstance ? allMachineConfigs.find(mc => mc.id === machineInstance.configId) : null;
                if (machineConfig) {
                    hasMachines = true;
                    minTier = Math.min(minTier, machineConfig.maxCraftableTier);
                }
            }
        });
        return hasMachines ? minTier : 0;
    }, [line, playerStats.factoryMachines, allMachineConfigs]);


    if (!isOpen || !line) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Set Recipe for {line.name}</DialogTitle>
                    <DialogDescription>
                        Select a recipe to assign to all compatible machines in this production line. Machines that cannot craft the selected tier will be ignored.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh] pr-4 border rounded-md p-2 my-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {allComponentConfigs
                            .filter(component => component.tier <= minTierOfLine) // Only show components the weakest machine can craft
                            .sort((a,b) => a.tier - b.tier || a.name.localeCompare(b.name))
                            .map((component) => {
                                const isUnlocked = (playerStats.unlockedFactoryComponentRecipeIds || []).includes(component.id);
                                const isCapped = isComponentCapped(component);
                                const canSelect = isUnlocked && !isCapped;
                                const hqUnlockName = !isUnlocked ? getHqUnlockNameForComponent(component.id) : null;
                                const Icon = component.icon;

                                return (
                                    <TooltipProvider key={component.id}>
                                    <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Card
                                            className={cn(
                                                "cursor-pointer hover:shadow-lg transition-shadow",
                                                !canSelect && "opacity-60 cursor-not-allowed bg-muted/30 border-dashed"
                                            )}
                                            onClick={() => canSelect && handleSelectRecipe(component.id)}
                                        >
                                            <CardHeader className="flex flex-row items-center justify-between pb-2 pt-3">
                                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                                    <Icon className="h-4 w-4 text-primary"/>
                                                    {component.name}
                                                </CardTitle>
                                                <Badge variant="outline">T{component.tier}</Badge>
                                            </CardHeader>
                                            <CardContent className="text-xs text-muted-foreground pb-2">
                                                {component.description}
                                            </CardContent>
                                            <CardFooter className="p-2 pt-0">
                                                {!isUnlocked && <Badge variant="destructive" className="w-full justify-center"><LockKeyhole className="mr-1 h-3 w-3" /> Locked</Badge>}
                                                {isCapped && <Badge variant="secondary" className="w-full justify-center"><PackageX className="mr-1 h-3 w-3" /> Capped</Badge>}
                                                {canSelect && <Badge variant="outline" className="w-full justify-center text-green-600 border-green-500/50"><CheckCircle2 className="mr-1 h-3 w-3" /> Selectable</Badge>}
                                            </CardFooter>
                                        </Card>
                                    </TooltipTrigger>
                                     <TooltipContent>
                                        {!isUnlocked && hqUnlockName && <p>Requires "{hqUnlockName}" HQ upgrade.</p>}
                                        {!isUnlocked && !hqUnlockName && <p>Recipe is locked.</p>}
                                        {isCapped && <p>This component's bonus is maxed out.</p>}
                                        {canSelect && <p>Set all compatible machines in {line.name} to produce {component.name}.</p>}
                                    </TooltipContent>
                                    </Tooltip>
                                    </TooltipProvider>
                                );
                            })
                        }
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


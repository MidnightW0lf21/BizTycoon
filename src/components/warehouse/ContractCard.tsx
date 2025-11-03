
"use client";

import type { Contract } from "@/types";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KITCHEN_RECIPES } from "@/config/game-config";
import { DollarSign, MapPin, Package, ArrowRight } from "lucide-react";

interface ContractCardProps {
    contract: Contract;
    onAccept: () => void;
}

export function ContractCard({ contract, onAccept }: ContractCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                    <span>{contract.destinationName}</span>
                    <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-4 w-4" /> {contract.distanceKm} km
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <div>
                    <p className="text-sm font-semibold mb-1">Required Goods:</p>
                    <ul className="text-sm space-y-1">
                        {contract.items.map(item => {
                            const recipe = KITCHEN_RECIPES.find(r => r.outputItemId === item.itemId);
                            return (
                                <li key={item.itemId} className="flex items-center justify-between bg-muted/50 p-1.5 rounded-md">
                                    <span className="flex items-center gap-2">
                                        <Package className="h-4 w-4" /> {recipe?.name || item.itemId}
                                    </span>
                                    <span>{item.quantity.toLocaleString()} units</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                    <p className="text-sm font-semibold">Reward:</p>
                    <p className="font-bold text-green-500 flex items-center gap-1">
                        <DollarSign className="h-4 w-4"/>
                        {contract.reward.toLocaleString()}
                    </p>
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full" onClick={onAccept}>
                    Accept Contract <ArrowRight className="ml-2 h-4 w-4"/>
                </Button>
            </CardFooter>
        </Card>
    );
}

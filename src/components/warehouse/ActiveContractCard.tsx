
"use client";

import type { ActiveContract } from "@/types";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MapPin, Truck, User, Play, Pause, X } from "lucide-react";

interface ActiveContractCardProps {
    contract: ActiveContract;
    onTogglePause: (contractId: string) => void;
    onAbandon: (contractId: string) => void;
}

export function ActiveContractCard({ contract, onTogglePause, onAbandon }: ActiveContractCardProps) {
    const progressPercent = (contract.progressKm / contract.distanceKm) * 100;
    const remainingKm = contract.distanceKm - contract.progressKm;

    return (
        <Card className="border-primary/50 shadow-sm">
            <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                    <span>Delivery to {contract.destinationName}</span>
                    <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-4 w-4" /> {contract.distanceKm} km
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <Progress value={progressPercent} />
                <div className="grid grid-cols-2 text-sm text-muted-foreground">
                    <p>Progress: {progressPercent.toFixed(1)}%</p>
                    <p className="text-right">Remaining: {remainingKm.toFixed(1)} km</p>
                </div>
                <div className="flex justify-between text-sm border-t pt-2">
                    <span className="flex items-center gap-1"><Truck className="h-4 w-4"/> Truck: #{contract.truckId.slice(-4)}</span>
                    <span className="flex items-center gap-1"><User className="h-4 w-4"/> Driver: #{contract.driverId.slice(-4)}</span>
                </div>
            </CardContent>
            <CardFooter className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => onTogglePause(contract.id)}>
                    {contract.isPaused ? <Play className="mr-2 h-4 w-4" /> : <Pause className="mr-2 h-4 w-4" />}
                    {contract.isPaused ? 'Resume' : 'Pause'}
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onAbandon(contract.id)}>
                    <X className="mr-2 h-4 w-4"/> Abandon
                </Button>
            </CardFooter>
        </Card>
    );
}

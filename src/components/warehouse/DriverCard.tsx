
"use client";

import type { Driver } from "@/types";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { User, Zap, ChevronsUp, DollarSign } from "lucide-react";
import { DRIVER_UPGRADE_COST, DRIVER_UPGRADE_MAX_ENERGY_LEVELS, DRIVER_UPGRADE_RECHARGE_RATE_LEVELS } from "@/config/game-config";
import { cn } from "@/lib/utils";

interface DriverCardProps {
    driver: Driver;
    playerMoney: number;
    onUpgrade: (driverId: string, upgradeType: 'maxEnergy' | 'rechargeRate') => void;
}

export function DriverCard({ driver, playerMoney, onUpgrade }: DriverCardProps) {
    const energyPercent = (driver.energy / driver.maxEnergy) * 100;
    
    const canUpgradeMaxEnergy = driver.upgradeLevels.maxEnergy < DRIVER_UPGRADE_MAX_ENERGY_LEVELS && playerMoney >= DRIVER_UPGRADE_COST;
    const canUpgradeRechargeRate = driver.upgradeLevels.rechargeRate < DRIVER_UPGRADE_RECHARGE_RATE_LEVELS && playerMoney >= DRIVER_UPGRADE_COST;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><User className="h-5 w-5 text-primary"/> {driver.name}</span>
                    <span className="text-sm font-medium capitalize text-muted-foreground">{driver.status}</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="flex items-center gap-1"><Zap className="h-4 w-4"/> Energy</span>
                        <span>{driver.energy.toFixed(0)} / {driver.maxEnergy.toFixed(0)}</span>
                    </div>
                    <Progress value={energyPercent} />
                </div>
                <div className="text-xs text-muted-foreground space-y-1 border-t pt-2">
                    <p>Recharge Rate: {driver.rechargeRate.toFixed(1)}/sec</p>
                    <p>Max Energy Upgrades: {driver.upgradeLevels.maxEnergy} / {DRIVER_UPGRADE_MAX_ENERGY_LEVELS}</p>
                    <p>Recharge Rate Upgrades: {driver.upgradeLevels.rechargeRate} / {DRIVER_UPGRADE_RECHARGE_RATE_LEVELS}</p>
                </div>
            </CardContent>
            <CardFooter className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" disabled={!canUpgradeMaxEnergy} onClick={() => onUpgrade(driver.id, 'maxEnergy')}>
                    <ChevronsUp className="mr-2 h-4 w-4"/> <span className="hidden sm:inline">Upgrade </span>Max Energy
                </Button>
                <Button variant="outline" size="sm" className="flex-1" disabled={!canUpgradeRechargeRate} onClick={() => onUpgrade(driver.id, 'rechargeRate')}>
                    <ChevronsUp className="mr-2 h-4 w-4"/> <span className="hidden sm:inline">Upgrade </span>Recharge
                </Button>
            </CardFooter>
        </Card>
    );
}

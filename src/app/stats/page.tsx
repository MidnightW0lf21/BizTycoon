
"use client";

import { useGame } from "@/contexts/GameContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Clock, DollarSign, Star, Sparkles, Gem, Network, Building } from "lucide-react";
import { useEffect, useState } from 'react';

const formatDuration = (totalSeconds: number) => {
    if (isNaN(totalSeconds) || totalSeconds < 0) {
        return "0s";
    }
    const days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

    return parts.join(' ');
};

interface StatDisplayProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  description?: string;
}

function StatDisplay({ icon: Icon, label, value, description }: StatDisplayProps) {
    return (
        <div className="flex items-start gap-4 p-4 rounded-lg border bg-muted/30">
            <Icon className="h-8 w-8 text-primary mt-1 shrink-0" />
            <div className="flex-grow">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
                {description && <p className="text-xs text-muted-foreground">{description}</p>}
            </div>
        </div>
    );
}

export default function StatisticsPage() {
    const { playerStats } = useGame();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const totalHqLevels = Object.values(playerStats.hqUpgradeLevels || {}).reduce((sum, level) => sum + level, 0);

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <LineChart className="h-7 w-7 text-primary" />
                        <CardTitle className="text-2xl">Game Statistics</CardTitle>
                    </div>
                    <CardDescription>An overview of your empire's performance across all of time.</CardDescription>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <h3 className="text-lg font-semibold col-span-full">Lifetime Statistics</h3>
                <StatDisplay 
                    icon={Clock}
                    label="Time Played"
                    value={mounted ? formatDuration(playerStats.timePlayedSeconds || 0) : "0s"}
                    description="Total duration this save has been active."
                />
                <StatDisplay 
                    icon={DollarSign}
                    label="Total Money Earned"
                    value={`$${(playerStats.totalMoneyEarned || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
                    description="Gross income earned across all prestiges."
                />
                 <StatDisplay 
                    icon={Star}
                    label="Times Prestiged"
                    value={(playerStats.timesPrestiged || 0).toLocaleString()}
                    description="Total number of times you have prestiged."
                />
            </div>
            
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <h3 className="text-lg font-semibold col-span-full">Current Prestige Highlights</h3>
                <StatDisplay 
                    icon={Sparkles}
                    label="Prestige Points"
                    value={(playerStats.prestigePoints || 0).toLocaleString()}
                    description="Your current balance of Prestige Points."
                />
                 <StatDisplay 
                    icon={Gem}
                    label="Artifacts Found"
                    value={(playerStats.unlockedArtifactIds?.length || 0).toLocaleString()}
                    description="Unique artifacts discovered in the Quarry."
                />
                 <StatDisplay 
                    icon={Network}
                    label="Skills Unlocked"
                    value={(playerStats.unlockedSkillIds?.length || 0).toLocaleString()}
                    description="Permanent skills purchased from the Skill Tree."
                />
                <StatDisplay 
                    icon={Building}
                    label="Total HQ Upgrade Levels"
                    value={totalHqLevels.toLocaleString()}
                    description="Sum of all levels purchased in the Headquarters."
                />
            </div>
        </div>
    );
}

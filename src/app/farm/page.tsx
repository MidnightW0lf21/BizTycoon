
"use client";

import { useGame } from "@/contexts/GameContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LockKeyhole, Sprout } from "lucide-react";

const REQUIRED_PRESTIGE_LEVEL_FARM = 15;

export default function FarmPage() {
  const { playerStats } = useGame();

  if (playerStats.timesPrestiged < REQUIRED_PRESTIGE_LEVEL_FARM) {
    return (
      <Card className="w-full md:max-w-2xl mx-auto">
        <CardHeader className="items-center">
          <LockKeyhole className="h-16 w-16 text-primary mb-4" />
          <CardTitle>Farm Locked</CardTitle>
          <CardDescription className="text-center">
            This feature is part of a multi-layered mini-game. <br />
            Unlock it by reaching Prestige Level {REQUIRED_PRESTIGE_LEVEL_FARM}.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            (Current Prestige Level: {playerStats.timesPrestiged})
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sprout className="h-6 w-6 text-primary" />
            Farm
          </CardTitle>
          <CardDescription>
            Manage your farm to produce goods. This feature is under construction.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Farm content coming soon!</p>
        </CardContent>
      </Card>
    </div>
  );
}

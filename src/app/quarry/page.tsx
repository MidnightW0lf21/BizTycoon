
"use client";

import { useGame } from "@/contexts/GameContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mountain, LockKeyhole, Pickaxe } from "lucide-react";
import { INITIAL_ARTIFACTS } from "@/config/data/artifacts";
import { ArtifactCard } from "@/components/quarry/ArtifactCard";
import { useEffect, useState } from "react";

const REQUIRED_PRESTIGE_LEVEL_QUARRY = 4;
export const EXCAVATION_COST_MONEY = 500000;
export const EXCAVATION_COST_MATERIALS = 100;

export default function QuarryPage() {
  const { playerStats, excavateQuarry, excavationCooldownEnd } = useGame();
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const updateCooldown = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((excavationCooldownEnd - now) / 1000));
      setSecondsRemaining(remaining);
      if (remaining === 0 && interval) {
        clearInterval(interval);
      }
    };

    if (excavationCooldownEnd > Date.now()) {
      updateCooldown();
      interval = setInterval(updateCooldown, 1000);
    } else {
      setSecondsRemaining(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [excavationCooldownEnd]);

  if (playerStats.timesPrestiged < REQUIRED_PRESTIGE_LEVEL_QUARRY) {
    return (
      <Card className="w-full md:max-w-2xl mx-auto">
        <CardHeader className="items-center">
          <LockKeyhole className="h-16 w-16 text-primary mb-4" />
          <CardTitle>Quarry Locked</CardTitle>
          <CardDescription className="text-center">
            The Quarry holds ancient artifacts with powerful bonuses. <br />
            Unlock this feature by reaching Prestige Level {REQUIRED_PRESTIGE_LEVEL_QUARRY}.
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

  const canAffordExcavation = playerStats.money >= EXCAVATION_COST_MONEY && (playerStats.factoryRawMaterials || 0) >= EXCAVATION_COST_MATERIALS;
  const onCooldown = secondsRemaining > 0;
  const unlockedCount = (playerStats.unlockedArtifactIds || []).length;
  const totalArtifacts = INITIAL_ARTIFACTS.length;
  const allArtifactsFound = unlockedCount >= totalArtifacts;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Mountain className="h-7 w-7 text-primary" />
            <CardTitle>The Quarry</CardTitle>
          </div>
          <CardDescription>
            Use your resources to excavate valuable artifacts. Each artifact provides a unique, permanent bonus to your empire. 
            Excavations cost ${EXCAVATION_COST_MONEY.toLocaleString()} and {EXCAVATION_COST_MATERIALS.toLocaleString()} raw materials.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            size="lg"
            className="w-full md:w-auto"
            onClick={excavateQuarry}
            disabled={!canAffordExcavation || onCooldown || allArtifactsFound}
          >
            <Pickaxe className="mr-2 h-5 w-5" />
            {onCooldown ? `Excavate (Ready in ${secondsRemaining}s)` :
             allArtifactsFound ? 'All Artifacts Found!' :
             !canAffordExcavation ? 'Insufficient Resources' : 
             'Begin Excavation'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Discovered Artifacts ({unlockedCount} / {totalArtifacts})</CardTitle>
          <CardDescription>Your collection of powerful relics. Their bonuses are always active.</CardDescription>
        </CardHeader>
        <CardContent>
          {INITIAL_ARTIFACTS.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">No artifacts are available in the game yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {INITIAL_ARTIFACTS.map(artifact => (
                <ArtifactCard
                  key={artifact.id}
                  artifact={artifact}
                  isUnlocked={(playerStats.unlockedArtifactIds || []).includes(artifact.id)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

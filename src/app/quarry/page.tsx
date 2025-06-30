
"use client";

import { useGame } from "@/contexts/GameContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mountain, LockKeyhole, Pickaxe, Gem, ChevronsRight } from "lucide-react";
import { INITIAL_ARTIFACTS, INITIAL_QUARRY_UPGRADES, ARTIFACT_RARITY_WEIGHTS } from "@/config/game-config";
import { ArtifactCard } from "@/components/quarry/ArtifactCard";
import { QuarryUpgradeCard } from "@/components/quarry/QuarryUpgradeCard";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { ArtifactRarity } from "@/types";

const REQUIRED_PRESTIGE_LEVEL_QUARRY = 4;

const rarityStyles: Record<ArtifactRarity, string> = {
  Common: "text-slate-500 dark:text-slate-400",
  Uncommon: "text-green-600 dark:text-green-500",
  Rare: "text-blue-600 dark:text-blue-500",
  Legendary: "text-amber-600 dark:text-amber-500",
  Mythic: "text-purple-600 dark:text-purple-500",
};

export default function QuarryPage() {
  const { playerStats, digInQuarry, purchaseQuarryUpgrade, getQuarryDigPower, getArtifactFindChances, purchaseNextQuarry } = useGame();

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
  
  const progressPercentage = (playerStats.quarryDepth / playerStats.quarryTargetDepth) * 100;
  const digPower = getQuarryDigPower();
  const artifactChances = getArtifactFindChances();
  const isQuarryComplete = playerStats.quarryDepth >= playerStats.quarryTargetDepth;
  const canAffordNextQuarry = playerStats.minerals >= (playerStats.nextQuarryCost || 0);

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1 flex flex-col gap-4">
        <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Mountain className="h-7 w-7 text-primary" />
                <CardTitle>Quarry #{playerStats.quarryLevel + 1}</CardTitle>
              </div>
              <CardDescription>
                Manually dig to unearth valuable Minerals and have a chance to find powerful Artifacts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Current Minerals</p>
                <p className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
                    <Gem className="h-6 w-6"/>
                    {playerStats.minerals.toLocaleString()}
                </p>
              </div>
              
              <Card className="p-3 bg-muted/50">
                <p className="text-xs font-semibold text-muted-foreground mb-2 text-center">Artifact Find Chance (per dig)</p>
                <ul className="space-y-1 text-xs">
                  {Object.entries(artifactChances).map(([rarity, chance]) => (
                     <li key={rarity} className="flex justify-between items-center">
                       <span className={cn("font-medium", rarityStyles[rarity as ArtifactRarity])}>{rarity}</span>
                       <span className="font-mono">{chance.toFixed(4)}%</span>
                     </li>
                  ))}
                </ul>
              </Card>

              <div>
                <div className="flex justify-between text-sm mb-1">
                    <span>Depth Progress</span>
                    <span className="font-medium">{(playerStats.quarryDepth / 100).toFixed(2)}m / {(playerStats.quarryTargetDepth / 100).toFixed(2)}m</span>
                </div>
                <Progress value={progressPercentage} />
              </div>
              
              {!isQuarryComplete ? (
                <Button
                  size="lg"
                  className="w-full"
                  onClick={digInQuarry}
                >
                  <Pickaxe className="mr-2 h-5 w-5" />
                  Dig (+{digPower}cm)
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={purchaseNextQuarry}
                  disabled={!canAffordNextQuarry}
                >
                  <ChevronsRight className="mr-2 h-5 w-5" />
                  Buy Next Quarry ({playerStats.nextQuarryCost?.toLocaleString()} Minerals)
                </Button>
              )}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
              <CardTitle>Quarry Upgrades</CardTitle>
              <CardDescription>Spend Minerals to improve your digging operations. Upgrades persist through prestige.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[calc(100vh-620px)] pr-2">
                    <div className="space-y-3">
                        {INITIAL_QUARRY_UPGRADES.map(upgrade => (
                            <QuarryUpgradeCard
                                key={upgrade.id}
                                upgrade={upgrade}
                                onPurchase={purchaseQuarryUpgrade}
                                playerMinerals={playerStats.minerals}
                                isPurchased={(playerStats.purchasedQuarryUpgradeIds || []).includes(upgrade.id)}
                            />
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2 flex flex-col gap-4">
        <Card className="flex-grow">
          <CardHeader>
            <CardTitle>Discovered Artifacts ({playerStats.unlockedArtifactIds?.length || 0} / {INITIAL_ARTIFACTS.length})</CardTitle>
            <CardDescription>Your collection of powerful relics. Their bonuses are always active.</CardDescription>
          </CardHeader>
          <CardContent>
            {INITIAL_ARTIFACTS.length === 0 ? (
              <p className="text-center text-muted-foreground py-10">No artifacts are available in the game yet.</p>
            ) : (
              <ScrollArea className="h-[calc(100vh-240px)] pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {INITIAL_ARTIFACTS.map(artifact => (
                    <ArtifactCard
                      key={artifact.id}
                      artifact={artifact}
                      isUnlocked={(playerStats.unlockedArtifactIds || []).includes(artifact.id)}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

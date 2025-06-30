
"use client";

import { useGame } from "@/contexts/GameContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mountain, LockKeyhole, Pickaxe, Gem } from "lucide-react";
import { INITIAL_ARTIFACTS, INITIAL_QUARRY_UPGRADES } from "@/config/game-config";
import { ArtifactCard } from "@/components/quarry/ArtifactCard";
import { QuarryUpgradeCard } from "@/components/quarry/QuarryUpgradeCard";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

const REQUIRED_PRESTIGE_LEVEL_QUARRY = 4;

export default function QuarryPage() {
  const { playerStats, digInQuarry, purchaseQuarryUpgrade, getQuarryDigPower } = useGame();

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

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Quarry Digging Section */}
      <div className="md:col-span-1 flex flex-col gap-4">
        <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Mountain className="h-7 w-7 text-primary" />
                <CardTitle>The Quarry</CardTitle>
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
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                    <span>Depth Progress</span>
                    <span className="font-medium">{(playerStats.quarryDepth / 100).toFixed(2)}m / {(playerStats.quarryTargetDepth / 100).toFixed(2)}m</span>
                </div>
                <Progress value={progressPercentage} />
              </div>
              
              <Button
                size="lg"
                className="w-full"
                onClick={digInQuarry}
              >
                <Pickaxe className="mr-2 h-5 w-5" />
                Dig (+{digPower}cm)
              </Button>
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

      {/* Discovered Artifacts Section */}
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


"use client";

import { useGame } from "@/contexts/GameContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mountain, LockKeyhole, Pickaxe, Gem, ChevronsRight, Zap, Grid, List } from "lucide-react";
import {
  INITIAL_ARTIFACTS,
  INITIAL_QUARRY_UPGRADES,
  QUARRY_NAME_PREFIXES,
  QUARRY_NAME_SUFFIXES,
  BASE_QUARRY_DEPTH,
  QUARRY_DEPTH_MULTIPLIER,
  BASE_QUARRY_COST,
  QUARRY_COST_MULTIPLIER,
  QUARRY_DIG_COOLDOWN_MS
} from "@/config/game-config";
import { ArtifactCard } from "@/components/quarry/ArtifactCard";
import { QuarryUpgradeCard } from "@/components/quarry/QuarryUpgradeCard";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Artifact, ArtifactRarity, QuarryChoice } from "@/types";
import { useState, useEffect, useMemo } from "react";
import { QuarrySelectionDialog } from "@/components/quarry/QuarrySelectionDialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const REQUIRED_PRESTIGE_LEVEL_QUARRY = 4;

const rarityStyles: Record<ArtifactRarity, string> = {
  Common: "text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-700",
  Uncommon: "text-green-600 dark:text-green-500 border-green-500/50",
  Rare: "text-blue-600 dark:text-blue-500 border-blue-500/50",
  Legendary: "text-amber-500 dark:text-amber-400 border-amber-500/50",
  Mythic: "text-purple-500 dark:text-purple-400 border-purple-500/50",
};


export default function QuarryPage() {
  const { playerStats, digInQuarry, purchaseQuarryUpgrade, getQuarryDigPower, getArtifactFindChances, selectNextQuarry } = useGame();
  
  const [isSelectionDialogOpen, setIsSelectionDialogOpen] = useState(false);
  const [quarryChoices, setQuarryChoices] = useState<QuarryChoice[]>([]);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [viewMode, setViewMode] = useState<'all' | 'owned' | 'undiscovered'>('all');
  const [isMiniMode, setIsMiniMode] = useState(false);

  const filteredAndSortedArtifacts = useMemo(() => {
    let artifactsToDisplay: Artifact[];

    switch (viewMode) {
      case 'owned':
        artifactsToDisplay = INITIAL_ARTIFACTS.filter(a => (playerStats.unlockedArtifactIds || []).includes(a.id));
        break;
      case 'undiscovered':
        artifactsToDisplay = INITIAL_ARTIFACTS.filter(a => !(playerStats.unlockedArtifactIds || []).includes(a.id));
        break;
      case 'all':
      default:
        artifactsToDisplay = [...INITIAL_ARTIFACTS];
        break;
    }

    const rarities: ArtifactRarity[] = ['Mythic', 'Legendary', 'Rare', 'Uncommon', 'Common'];
    const grouped: Record<ArtifactRarity, Artifact[]> = {
      Common: [], Uncommon: [], Rare: [], Legendary: [], Mythic: [],
    };
  
    artifactsToDisplay.forEach(artifact => {
      grouped[artifact.rarity].push(artifact);
    });
  
    for (const rarity of rarities) {
      grouped[rarity].sort((a, b) => a.name.localeCompare(b.name));
    }
    
    return rarities
      .map(rarity => ({
        rarity,
        artifacts: grouped[rarity]
      }))
      .filter(group => group.artifacts.length > 0);
  
  }, [viewMode, playerStats.unlockedArtifactIds]);

  const defaultAccordionValues = useMemo(() => filteredAndSortedArtifacts.map(group => group.rarity), [filteredAndSortedArtifacts]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;
    const updateCooldown = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((playerStats.lastDigTimestamp + QUARRY_DIG_COOLDOWN_MS - now) / 1000));
      setSecondsRemaining(remaining);
      if (remaining === 0 && intervalId) {
        clearInterval(intervalId);
      }
    };

    if (playerStats.lastDigTimestamp + QUARRY_DIG_COOLDOWN_MS > Date.now()) {
      updateCooldown();
      intervalId = setInterval(updateCooldown, 1000);
    } else {
      setSecondsRemaining(0);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [playerStats.lastDigTimestamp]);


  const handleOpenQuarrySelection = () => {
    const nextQuarryLevel = playerStats.quarryLevel + 1;
    const baseNextCost = Math.floor(BASE_QUARRY_COST * Math.pow(QUARRY_COST_MULTIPLIER, nextQuarryLevel));
    const baseNextDepth = Math.floor(BASE_QUARRY_DEPTH * Math.pow(QUARRY_DEPTH_MULTIPLIER, nextQuarryLevel));

    const availableBiases: ArtifactRarity[] = ['Common', 'Uncommon', 'Rare'];
    
    const choices: QuarryChoice[] = availableBiases.map(bias => {
      const depthVariance = (Math.random() - 0.5) * 0.2; // +/- 10%
      const costVariance = (Math.random() - 0.5) * 0.2; // +/- 10%
      
      const name = `${QUARRY_NAME_PREFIXES[Math.floor(Math.random() * QUARRY_NAME_PREFIXES.length)]} ${QUARRY_NAME_SUFFIXES[Math.floor(Math.random() * QUARRY_NAME_SUFFIXES.length)]}`;
      
      return {
        name,
        depth: Math.floor(baseNextDepth * (1 + depthVariance)),
        cost: Math.floor(baseNextCost * (1 + costVariance)),
        rarityBias: bias,
        description: `This quarry is known for a slightly higher chance of finding ${bias} artifacts.`
      };
    });

    setQuarryChoices(choices);
    setIsSelectionDialogOpen(true);
  };
  
  const handleSelectQuarry = (choice: QuarryChoice) => {
    selectNextQuarry(choice);
    setIsSelectionDialogOpen(false);
  };


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
  const energyPercentage = (playerStats.quarryEnergy / playerStats.maxQuarryEnergy) * 100;
  const digPower = getQuarryDigPower();
  const artifactChances = getArtifactFindChances();
  const isQuarryComplete = playerStats.quarryDepth >= playerStats.quarryTargetDepth;

  const nextQuarryBaseCost = isQuarryComplete 
    ? Math.floor(BASE_QUARRY_COST * Math.pow(QUARRY_COST_MULTIPLIER, playerStats.quarryLevel + 1)) 
    : 0;
    
  const canAffordNextQuarry = isQuarryComplete && playerStats.money >= nextQuarryBaseCost;
  const canDig = playerStats.quarryEnergy > 0 && secondsRemaining === 0 && !isQuarryComplete;

  return (
    <>
    <div className="grid md:grid-cols-3 gap-6 h-full">
      <div className="md:col-span-1 flex flex-col gap-4">
        <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Mountain className="h-7 w-7 text-primary" />
                <CardTitle>{playerStats.quarryName}</CardTitle>
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
                    {playerStats.minerals.toLocaleString()} kg
                </p>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                    <span className="flex items-center gap-1"><Zap className="h-4 w-4 text-yellow-400"/> Digging Energy</span>
                    <span className="font-medium">{Math.floor(playerStats.quarryEnergy)} / {playerStats.maxQuarryEnergy}</span>
                </div>
                <Progress value={energyPercentage} indicatorClassName="bg-yellow-400" />
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
                  disabled={!canDig}
                >
                  <Pickaxe className="mr-2 h-5 w-5" />
                  {secondsRemaining > 0 ? `Wait (${secondsRemaining}s)` : `Dig (+${digPower}cm)`}
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={handleOpenQuarrySelection}
                  disabled={!canAffordNextQuarry}
                >
                  <ChevronsRight className="mr-2 h-5 w-5" />
                  Buy Next Quarry
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
                <ScrollArea className="flex-grow h-auto min-h-0 pr-2">
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
        <Card className="flex-grow flex flex-col">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <CardTitle>Artifact Collection ({playerStats.unlockedArtifactIds?.length || 0} / {INITIAL_ARTIFACTS.length})</CardTitle>
                <CardDescription>Your collection of powerful relics. Their bonuses are always active.</CardDescription>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-center">
                  <RadioGroup
                      value={viewMode}
                      onValueChange={(value) => setViewMode(value as any)}
                      className="flex items-center space-x-1 rounded-md bg-muted p-1 text-sm"
                  >
                      <Label htmlFor="view-all" className={cn("cursor-pointer rounded-sm px-2.5 py-1.5 transition-colors text-xs font-medium", viewMode === 'all' ? 'bg-background text-primary shadow-sm' : 'hover:bg-muted-foreground/10')}>All</Label>
                      <RadioGroupItem value="all" id="view-all" className="sr-only" />
                      
                      <Label htmlFor="view-owned" className={cn("cursor-pointer rounded-sm px-2.5 py-1.5 transition-colors text-xs font-medium", viewMode === 'owned' ? 'bg-background text-primary shadow-sm' : 'hover:bg-muted-foreground/10')}>Owned</Label>
                      <RadioGroupItem value="owned" id="view-owned" className="sr-only" />

                      <Label htmlFor="view-undiscovered" className={cn("cursor-pointer rounded-sm px-2.5 py-1.5 transition-colors text-xs font-medium", viewMode === 'undiscovered' ? 'bg-background text-primary shadow-sm' : 'hover:bg-muted-foreground/10')}>New</Label>
                      <RadioGroupItem value="undiscovered" id="view-undiscovered" className="sr-only" />
                  </RadioGroup>
                  <Button variant="outline" size="icon" onClick={() => setIsMiniMode(prev => !prev)}>
                      {isMiniMode ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
                  </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col">
            {INITIAL_ARTIFACTS.length === 0 ? (
              <p className="text-center text-muted-foreground py-10">No artifacts are available in the game yet.</p>
            ) : (
              <ScrollArea className="flex-grow h-0 pr-4">
                {filteredAndSortedArtifacts.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-center text-muted-foreground py-10">No artifacts match the current filter.</p>
                  </div>
                ) : isMiniMode ? (
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                    {filteredAndSortedArtifacts.flatMap(({ artifacts }) => artifacts).map(artifact => (
                      <ArtifactCard
                        key={artifact.id}
                        artifact={artifact}
                        isUnlocked={(playerStats.unlockedArtifactIds || []).includes(artifact.id)}
                        isMiniMode={isMiniMode}
                      />
                    ))}
                  </div>
                ) : (
                  <Accordion type="multiple" defaultValue={defaultAccordionValues} className="w-full">
                    {filteredAndSortedArtifacts.map(({ rarity, artifacts }) => (
                      <AccordionItem value={rarity} key={rarity} className="border-b-0">
                        <AccordionTrigger className="hover:no-underline py-2">
                            <div className="flex items-center gap-4 flex-grow">
                                <h3 className={cn("text-lg font-semibold tracking-wider", rarityStyles[rarity])}>{rarity}</h3>
                                <div className={cn("flex-grow border-t", rarityStyles[rarity])}></div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 pb-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                              {artifacts.map(artifact => (
                                <ArtifactCard
                                  key={artifact.id}
                                  artifact={artifact}
                                  isUnlocked={(playerStats.unlockedArtifactIds || []).includes(artifact.id)}
                                  isMiniMode={isMiniMode}
                                />
                              ))}
                            </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
    
    <QuarrySelectionDialog 
      isOpen={isSelectionDialogOpen}
      onClose={() => setIsSelectionDialogOpen(false)}
      quarryChoices={quarryChoices}
      onSelect={handleSelectQuarry}
      playerMoney={playerStats.money}
    />
    </>
  );
}

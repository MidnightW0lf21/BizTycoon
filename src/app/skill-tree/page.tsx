
"use client";

import { useGame } from "@/contexts/GameContext";
import { SkillNodeCard } from "@/components/skill-tree/SkillNodeCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Eye, EyeOff } from "lucide-react";
import { INITIAL_SKILL_TREE } from "@/config/game-config";
import type { SkillNode } from "@/types";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";

export default function SkillTreePage() {
  const { playerStats, unlockSkillNode } = useGame();
  const [showAllSkills, setShowAllSkills] = useState(false);

  const REQUIRED_PRESTIGE_LEVEL = 1;

  const displayedSkillTree = useMemo(() => {
    const allSkills = [...INITIAL_SKILL_TREE];

    const getSkillStatus = (skill: SkillNode, unlockedIds: string[], currentPP: number): {
      isUnlocked: boolean;
      dependenciesMet: boolean;
      canAfford: boolean;
      statusOrder: number; // For sorting: 0=Purchasable, 1=DepsMet/CannotAfford, 2=DepsNotMet
    } => {
      const isUnlocked = unlockedIds.includes(skill.id);
      const dependenciesMet = skill.dependencies
        ? skill.dependencies.every(depId => unlockedIds.includes(depId))
        : true;
      const canAfford = currentPP >= skill.cost;
      
      let statusOrder = 3; // Default for unlocked or if logic below doesn't set it
      if (!isUnlocked) {
        if (dependenciesMet && canAfford) {
          statusOrder = 0; // Purchasable
        } else if (dependenciesMet && !canAfford) {
          statusOrder = 1; // Dependencies Met, Cannot Afford
        } else {
          statusOrder = 2; // Dependencies Not Met
        }
      }
      return { isUnlocked, dependenciesMet, canAfford, statusOrder };
    };

    const skillsWithFullStatus = allSkills.map(skill => {
      const status = getSkillStatus(skill, playerStats.unlockedSkillIds, playerStats.prestigePoints);
      return { ...skill, ...status };
    });

    if (showAllSkills) {
      // Show unlocked skills first, then all unpurchased skills sorted by statusOrder and cost
      const unlocked = skillsWithFullStatus
        .filter(s => s.isUnlocked)
        .sort((a, b) => a.cost - b.cost);
      
      const unpurchasedAndSorted = skillsWithFullStatus
        .filter(s => !s.isUnlocked)
        .sort((a, b) => {
          if (a.statusOrder !== b.statusOrder) {
            return a.statusOrder - b.statusOrder;
          }
          return a.cost - b.cost;
        });
      return [...unlocked, ...unpurchasedAndSorted];
    } else {
      // "Show Relevant Skills" mode:
      // Only show unpurchased skills where dependencies are met,
      // sorted by statusOrder (purchasable first) and then by cost.
      return skillsWithFullStatus
        .filter(s => !s.isUnlocked && s.dependenciesMet)
        .sort((a, b) => {
          if (a.statusOrder !== b.statusOrder) { // This will naturally put affordable ones (statusOrder 0) first
            return a.statusOrder - b.statusOrder;
          }
          return a.cost - b.cost;
        });
    }
  }, [playerStats.unlockedSkillIds, playerStats.prestigePoints, showAllSkills]);

  if (playerStats.timesPrestiged < REQUIRED_PRESTIGE_LEVEL) {
    return (
      <Card className="w-full md:max-w-2xl mx-auto">
        <CardHeader className="items-center">
          <Sparkles className="h-16 w-16 text-primary mb-4" />
          <CardTitle>Skill Tree Locked</CardTitle>
          <CardDescription className="text-center">
            Unlock powerful permanent upgrades by prestiging! <br />
            The Skill Tree is available after you have prestiged at least {REQUIRED_PRESTIGE_LEVEL} time.
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
    <div className="flex flex-col gap-4 h-full">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Sparkles className="h-7 w-7 text-primary" />
          Skill Tree
        </h1>
        <p className="text-muted-foreground">
          Spend your Prestige Points (PP) to unlock permanent upgrades. 
          You currently have <strong className="text-primary">{playerStats.prestigePoints.toLocaleString('en-US')} PP</strong>.
        </p>
      </div>

      <div className="flex justify-start mb-2">
        <Button
          variant="outline"
          onClick={() => setShowAllSkills(prev => !prev)}
          size="sm"
        >
          {showAllSkills ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
          {showAllSkills ? "Show Relevant Skills" : "Show All Skills"}
        </Button>
      </div>
      
      {displayedSkillTree.length === 0 ? (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-center text-muted-foreground py-10">
            {showAllSkills ? "All skills have been unlocked or none are defined." :
            "No relevant skills available to unlock. Try prestiging, unlocking prerequisite skills, or toggle to 'Show All Skills'."}
          </p>
        </div>
      ) : (
        <ScrollArea className="flex-grow pr-1 h-[calc(100vh-250px)]"> 
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {displayedSkillTree.map((skill) => (
              <SkillNodeCard
                key={skill.id}
                skillNode={skill}
                playerPrestigePoints={playerStats.prestigePoints}
                unlockedSkillIds={playerStats.unlockedSkillIds}
                onUnlockSkill={unlockSkillNode}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

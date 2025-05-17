
"use client";

import { useGame } from "@/contexts/GameContext";
import { SkillNodeCard } from "@/components/skill-tree/SkillNodeCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles } from "lucide-react";

export default function SkillTreePage() {
  const { playerStats, skillTree, unlockSkillNode } = useGame();

  const REQUIRED_PRESTIGE_LEVEL = 1; // Matches NavItem requirement

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
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Skill Tree
          </CardTitle>
          <CardDescription>
            Spend your Prestige Points (PP) to unlock permanent upgrades. 
            You currently have <strong className="text-primary">{playerStats.prestigePoints.toLocaleString('en-US')} PP</strong>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {skillTree.length === 0 ? (
            <p className="text-center text-muted-foreground">No skills available yet. Check back later!</p>
          ) : (
            <ScrollArea className="h-[600px] pr-4"> {/* Adjust height as needed */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {skillTree.map((skill) => (
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
        </CardContent>
      </Card>
    </div>
  );
}

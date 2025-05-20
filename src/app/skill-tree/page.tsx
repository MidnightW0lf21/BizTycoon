
"use client";

import { useGame } from "@/contexts/GameContext";
import { SkillNodeCard } from "@/components/skill-tree/SkillNodeCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Eye, EyeOff } from "lucide-react";
import { INITIAL_SKILL_TREE } from "@/config/game-config";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";

export default function SkillTreePage() {
  const { playerStats, unlockSkillNode } = useGame();
  const [showAllSkills, setShowAllSkills] = useState(false);

  const REQUIRED_PRESTIGE_LEVEL = 1;

  const sortedSkillTree = useMemo(() => {
    return [...INITIAL_SKILL_TREE].sort((a, b) => {
      const aUnlocked = playerStats.unlockedSkillIds.includes(a.id);
      const bUnlocked = playerStats.unlockedSkillIds.includes(b.id);
      if (aUnlocked && !bUnlocked) return -1; 
      if (!aUnlocked && bUnlocked) return 1;
      return a.cost - b.cost; 
    });
  }, [playerStats.unlockedSkillIds]);

  const filteredSkillTree = useMemo(() => {
    if (showAllSkills) {
      return sortedSkillTree;
    }
    return sortedSkillTree.filter(skill => {
      const isUnlocked = playerStats.unlockedSkillIds.includes(skill.id);
      if (isUnlocked) return true;

      const dependenciesMet = skill.dependencies
        ? skill.dependencies.every(depId => playerStats.unlockedSkillIds.includes(depId))
        : true;
      
      return dependenciesMet; 
    });
  }, [sortedSkillTree, playerStats.unlockedSkillIds, showAllSkills]);

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
      
      {filteredSkillTree.length === 0 ? (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-center text-muted-foreground py-10">
            No skills match your current filter or are available yet.
            <br />
            Try prestiging or adjusting the filter.
          </p>
        </div>
      ) : (
        <ScrollArea className="flex-grow pr-1 h-[calc(100vh-250px)]"> 
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {filteredSkillTree.map((skill) => (
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

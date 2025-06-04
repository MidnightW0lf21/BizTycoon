
"use client";

import { useMemo, useEffect, useState } from "react";
import { useGame } from "@/contexts/GameContext";
import { INITIAL_BUSINESSES, INITIAL_SKILL_TREE, INITIAL_STOCKS, INITIAL_HQ_UPGRADES } from "@/config/game-config";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ListChecks, Briefcase, Network, BarChart, Building as HQIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryProgressProps {
  title: string;
  icon: React.ElementType;
  currentValue: number;
  totalValue: number;
  unit: string;
}

function CategoryProgress({ title, icon: Icon, currentValue, totalValue, unit }: CategoryProgressProps) {
  const percentage = totalValue > 0 ? (currentValue / totalValue) * 100 : 0;
  const displayPercentage = Math.min(100, Math.max(0, percentage)); 

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Progress value={displayPercentage} className="w-full mb-2 h-3" />
        <p className="text-sm text-muted-foreground text-center">
          {currentValue.toLocaleString('en-US', {maximumFractionDigits: 0})} / {totalValue.toLocaleString('en-US', {maximumFractionDigits: 0})} {unit} completed ({displayPercentage.toFixed(1)}%)
        </p>
      </CardContent>
    </Card>
  );
}

export default function CompletionPage() {
  const { playerStats, getDynamicMaxBusinessLevel } = useGame(); // Removed businesses from direct destructuring
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const completionData = useMemo(() => {
    // getDynamicMaxBusinessLevel is still relevant for knowing what "max level" means, 
    // but the achieved state comes from achievedBusinessMilestones.
    // const dynamicMaxLevel = getDynamicMaxBusinessLevel(); 

    let achievedBusinessMaxLevelPoints = 0;
    let achievedBusinessUpgradePoints = 0;
    
    const totalBusinessMaxLevelPoints = INITIAL_BUSINESSES.length;
    const totalBusinessUpgradePoints = INITIAL_BUSINESSES.reduce((sum, biz) => sum + (biz.upgrades?.length || 0), 0);
    
    if (playerStats.achievedBusinessMilestones) {
      INITIAL_BUSINESSES.forEach(initialBusinessConfig => {
        const unlockIndex = INITIAL_BUSINESSES.findIndex(ib => ib.id === initialBusinessConfig.id);
        // Determine if the business milestone should be counted based on prestige unlock visibility
        // This ensures that milestones for businesses not yet "visible" due to prestige level aren't counted early.
        const isBusinessVisibleForCompletion = playerStats.timesPrestiged >= unlockIndex;

        if (isBusinessVisibleForCompletion) {
          const milestones = playerStats.achievedBusinessMilestones?.[initialBusinessConfig.id];
          if (milestones?.maxLevelReached) {
            achievedBusinessMaxLevelPoints++;
          }
          if (milestones?.purchasedUpgradeIds) {
            // We count all *distinct* upgrades available for this business in its initial config
            // and compare against the *distinct* purchased ones from milestones.
            // This prevents counting more upgrades than exist if data were somehow inconsistent.
            const totalUpgradesForThisBiz = initialBusinessConfig.upgrades?.length || 0;
            const purchasedCountForThisBiz = milestones.purchasedUpgradeIds.length;
            achievedBusinessUpgradePoints += Math.min(purchasedCountForThisBiz, totalUpgradesForThisBiz);
          }
        }
      });
    }
    const maxTotalBusinessCompletionPoints = totalBusinessMaxLevelPoints + totalBusinessUpgradePoints;
    const currentTotalBusinessCompletionPoints = achievedBusinessMaxLevelPoints + achievedBusinessUpgradePoints;
    const businessCompletionPercentage = maxTotalBusinessCompletionPoints > 0 ? (currentTotalBusinessCompletionPoints / maxTotalBusinessCompletionPoints) * 100 : 0;

    const totalSkills = INITIAL_SKILL_TREE.length;
    const unlockedSkills = playerStats.unlockedSkillIds.length;
    const skillCompletionPercentage = totalSkills > 0 ? (unlockedSkills / totalSkills) * 100 : 0;

    let totalPossibleHQLevels = 0;
    let achievedHQLevels = 0;
    INITIAL_HQ_UPGRADES.forEach(hqUpgrade => {
      totalPossibleHQLevels += hqUpgrade.levels.length;
      achievedHQLevels += playerStats.hqUpgradeLevels[hqUpgrade.id] || 0;
    });
    const hqCompletionPercentage = totalPossibleHQLevels > 0 ? (achievedHQLevels / totalPossibleHQLevels) * 100 : 0;
    
    const totalPossibleSharesToOwn = INITIAL_STOCKS.reduce((sum, stock) => sum + stock.totalOutstandingShares, 0);
    let currentOwnedShares = 0;
    playerStats.stockHoldings.forEach(holding => {
        currentOwnedShares += holding.shares;
    });
    const stockCompletionPercentage = totalPossibleSharesToOwn > 0 ? (currentOwnedShares / totalPossibleSharesToOwn) * 100 : 0;


    const overallCompletionPercentage = (businessCompletionPercentage + skillCompletionPercentage + hqCompletionPercentage + stockCompletionPercentage) / 4;

    return {
      overall: Math.min(100, Math.max(0, overallCompletionPercentage)),
      businesses: { current: currentTotalBusinessCompletionPoints, total: maxTotalBusinessCompletionPoints, percentage: businessCompletionPercentage },
      skills: { current: unlockedSkills, total: totalSkills, percentage: skillCompletionPercentage },
      hq: { current: achievedHQLevels, total: totalPossibleHQLevels, percentage: hqCompletionPercentage },
      stocks: { current: currentOwnedShares, total: totalPossibleSharesToOwn, percentage: stockCompletionPercentage },
    };
  }, [playerStats.achievedBusinessMilestones, playerStats.unlockedSkillIds, playerStats.hqUpgradeLevels, playerStats.stockHoldings, playerStats.timesPrestiged]); // Removed businesses, added playerStats.achievedBusinessMilestones, playerStats.timesPrestiged


  if (!mounted) {
    return (
      <div className="flex flex-col gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <ListChecks className="h-7 w-7 text-primary" />
              <CardTitle className="text-2xl">Overall Game Completion</CardTitle>
            </div>
            <CardDescription>Your journey towards 100% game mastery.</CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <Skeleton className="h-8 w-full mb-2" />
            <Skeleton className="h-4 w-1/4 mx-auto" />
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-3 w-full mb-2" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }


  return (
    <div className="flex flex-col gap-6">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <ListChecks className="h-7 w-7 text-primary" />
            <CardTitle className="text-2xl">Overall Game Completion</CardTitle>
          </div>
          <CardDescription>Your journey towards 100% game mastery.</CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <Progress value={completionData.overall} className="w-full mb-2 h-8" />
          <p className="text-lg font-semibold text-primary text-center">
            {completionData.overall.toFixed(1)}% Complete
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CategoryProgress 
          title="Business Milestones"
          icon={Briefcase}
          currentValue={completionData.businesses.current}
          totalValue={completionData.businesses.total}
          unit="milestones"
        />
        <CategoryProgress 
          title="Skill Tree Unlocks"
          icon={Network}
          currentValue={completionData.skills.current}
          totalValue={completionData.skills.total}
          unit="skills"
        />
        <CategoryProgress 
          title="HQ Upgrade Levels"
          icon={HQIcon}
          currentValue={completionData.hq.current}
          totalValue={completionData.hq.total}
          unit="levels"
        />
        <CategoryProgress 
          title="Total Share Ownership"
          icon={BarChart}
          currentValue={completionData.stocks.current}
          totalValue={completionData.stocks.total}
          unit="shares owned"
        />
      </div>
    </div>
  );
}

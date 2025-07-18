
"use client";

import { useMemo, useEffect, useState } from "react";
import { useGame } from "@/contexts/GameContext";
import { INITIAL_BUSINESSES, INITIAL_SKILL_TREE, INITIAL_STOCKS, INITIAL_HQ_UPGRADES, INITIAL_RESEARCH_ITEMS_CONFIG, INITIAL_FACTORY_COMPONENTS_CONFIG, INITIAL_ARTIFACTS, INITIAL_QUARRY_UPGRADES, INITIAL_ETFS } from "@/config/game-config";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ListChecks, Briefcase, Network, BarChart, Building as HQIcon, Factory as FactoryIcon, Mountain as QuarryIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChartConfig } from "@/components/ui/chart";
import { ChartContainer } from "@/components/ui/chart";
import { Pie, PieChart, Cell } from "recharts";


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
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex flex-col flex-grow justify-end space-y-2">
        <div className="text-3xl font-bold text-primary">{displayPercentage.toFixed(1)}%</div>
        <Progress value={displayPercentage} className="h-2" />
        <p className="text-xs text-muted-foreground">
          {currentValue.toLocaleString('en-US', { maximumFractionDigits: 0 })} / {totalValue.toLocaleString('en-US', { maximumFractionDigits: 0 })} {unit}
        </p>
      </CardContent>
    </Card>
  );
}

export default function CompletionPage() {
  const { playerStats } = useGame();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const completionData = useMemo(() => {
    // Business Milestones
    let achievedBusinessMaxLevelPoints = 0;
    let achievedBusinessUpgradePoints = 0;
    const totalBusinessMaxLevelPoints = INITIAL_BUSINESSES.length;
    const totalBusinessUpgradePoints = INITIAL_BUSINESSES.reduce((sum, biz) => sum + (biz.upgrades?.length || 0), 0);
    if (playerStats.achievedBusinessMilestones) {
      INITIAL_BUSINESSES.forEach(initialBusinessConfig => {
        const unlockIndex = INITIAL_BUSINESSES.findIndex(ib => ib.id === initialBusinessConfig.id);
        const isBusinessVisibleForCompletion = playerStats.timesPrestiged >= unlockIndex;
        if (isBusinessVisibleForCompletion) {
          const milestones = playerStats.achievedBusinessMilestones?.[initialBusinessConfig.id];
          if (milestones?.maxLevelReached) achievedBusinessMaxLevelPoints++;
          if (milestones?.purchasedUpgradeIds) {
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

    // Skill Tree
    const totalSkills = INITIAL_SKILL_TREE.length;
    const unlockedSkills = playerStats.unlockedSkillIds.length;
    const skillCompletionPercentage = totalSkills > 0 ? (unlockedSkills / totalSkills) * 100 : 0;

    // HQ Upgrades
    let totalPossibleHQLevels = 0;
    let achievedHQLevels = 0;
    INITIAL_HQ_UPGRADES.forEach(hqUpgrade => {
      totalPossibleHQLevels += hqUpgrade.levels.length;
      achievedHQLevels += playerStats.hqUpgradeLevels[hqUpgrade.id] || 0;
    });
    const hqCompletionPercentage = totalPossibleHQLevels > 0 ? (achievedHQLevels / totalPossibleHQLevels) * 100 : 0;
    
    // Market Ownership
    const totalPossibleStockShares = INITIAL_STOCKS.reduce((sum, stock) => sum + stock.totalOutstandingShares, 0);
    const totalPossibleEtfShares = INITIAL_ETFS.reduce((sum, etf) => sum + (etf.totalOutstandingShares || 0), 0);
    const totalMarketAssets = totalPossibleStockShares + totalPossibleEtfShares;

    let currentOwnedStockShares = 0;
    playerStats.stockHoldings.forEach(holding => {
        currentOwnedStockShares += holding.shares;
    });
    let currentOwnedEtfShares = 0;
    (playerStats.etfHoldings || []).forEach(holding => {
        currentOwnedEtfShares += holding.shares;
    });
    const currentOwnedAssets = currentOwnedStockShares + currentOwnedEtfShares;

    const marketCompletionPercentage = totalMarketAssets > 0 ? (currentOwnedAssets / totalMarketAssets) * 100 : 0;

    // Factory Completion
    let factoryCurrent = 0;
    let factoryTotal = 0;
    const totalResearchableItems = INITIAL_RESEARCH_ITEMS_CONFIG.length;
    const totalUniqueComponents = INITIAL_FACTORY_COMPONENTS_CONFIG.length;
    const totalProductionLines = (playerStats.factoryProductionLines || []).length || 5;
    let totalMaxableComponents = 0;

    INITIAL_FACTORY_COMPONENTS_CONFIG.forEach(compConfig => {
      if (compConfig.effects && compConfig.effects.maxBonusPercent) {
        let effectPerUnit = 0;
        if (compConfig.effects.globalIncomeBoostPerComponentPercent) effectPerUnit = compConfig.effects.globalIncomeBoostPerComponentPercent;
        else if (compConfig.effects.businessSpecificIncomeBoostPercent) effectPerUnit = compConfig.effects.businessSpecificIncomeBoostPercent.percent;
        else if (compConfig.effects.stockSpecificDividendYieldBoostPercent) effectPerUnit = compConfig.effects.stockSpecificDividendYieldBoostPercent.percent;
        else if (compConfig.effects.factoryGlobalPowerOutputBoostPercent) effectPerUnit = compConfig.effects.factoryGlobalPowerOutputBoostPercent;
        else if (compConfig.effects.factoryGlobalMaterialCollectionBoostPercent) effectPerUnit = compConfig.effects.factoryGlobalMaterialCollectionBoostPercent;
        if (effectPerUnit > 0) totalMaxableComponents++;
      }
    });

    factoryTotal = totalResearchableItems + totalUniqueComponents + totalProductionLines + totalMaxableComponents;

    if (playerStats.factoryPurchased) {
      const unlockedResearchItems = (playerStats.unlockedResearchIds || []).length;
      let producedUniqueComponentCount = 0;
      let achievedMaxedComponents = 0;
      INITIAL_FACTORY_COMPONENTS_CONFIG.forEach(compConfig => {
        if ((playerStats.factoryProducedComponents?.[compConfig.id] || 0) > 0) {
          producedUniqueComponentCount++;
        }
        if (compConfig.effects && compConfig.effects.maxBonusPercent) {
          let effectPerUnit = 0;
          if (compConfig.effects.globalIncomeBoostPerComponentPercent) effectPerUnit = compConfig.effects.globalIncomeBoostPerComponentPercent;
          else if (compConfig.effects.businessSpecificIncomeBoostPercent) effectPerUnit = compConfig.effects.businessSpecificIncomeBoostPercent.percent;
          else if (compConfig.effects.stockSpecificDividendYieldBoostPercent) effectPerUnit = compConfig.effects.stockSpecificDividendYieldBoostPercent.percent;
          else if (compConfig.effects.factoryGlobalPowerOutputBoostPercent) effectPerUnit = compConfig.effects.factoryGlobalPowerOutputBoostPercent;
          else if (compConfig.effects.factoryGlobalMaterialCollectionBoostPercent) effectPerUnit = compConfig.effects.factoryGlobalMaterialCollectionBoostPercent;
          
          if (effectPerUnit > 0) {
            const count = playerStats.factoryProducedComponents?.[compConfig.id] || 0;
            if (count * effectPerUnit >= compConfig.effects.maxBonusPercent) {
              achievedMaxedComponents++;
            }
          }
        }
      });
      const unlockedProductionLinesCount = (playerStats.factoryProductionLines || []).filter(line => line.isUnlocked).length;
      factoryCurrent = unlockedResearchItems + producedUniqueComponentCount + unlockedProductionLinesCount + achievedMaxedComponents;
    }
    const factoryCompletionPercentage = factoryTotal > 0 ? (factoryCurrent / factoryTotal) * 100 : 0;
    const factoryCompletion = { current: factoryCurrent, total: factoryTotal, percentage: factoryCompletionPercentage };
    
    // Quarry Completion
    const totalArtifacts = INITIAL_ARTIFACTS.length;
    const unlockedArtifacts = (playerStats.unlockedArtifactIds || []).length;
    const totalQuarryUpgrades = INITIAL_QUARRY_UPGRADES.length;
    const purchasedQuarryUpgrades = (playerStats.purchasedQuarryUpgradeIds || []).length;
    const quarryCurrent = unlockedArtifacts + purchasedQuarryUpgrades;
    const quarryTotal = totalArtifacts + totalQuarryUpgrades;
    const quarryCompletionPercentage = quarryTotal > 0 ? (quarryCurrent / quarryTotal) * 100 : 0;
    const quarryCompletion = {
      current: quarryCurrent,
      total: quarryTotal,
      percentage: quarryCompletionPercentage,
    };

    // Overall Completion
    const categoriesForAverage = [
      businessCompletionPercentage,
      skillCompletionPercentage,
      hqCompletionPercentage,
      marketCompletionPercentage,
      factoryCompletion.percentage,
      quarryCompletion.percentage,
    ];
    
    const overallCompletionPercentage = categoriesForAverage.length > 0 ? categoriesForAverage.reduce((sum, val) => sum + val, 0) / categoriesForAverage.length : 0;

    return {
      overall: Math.min(100, Math.max(0, overallCompletionPercentage)),
      businesses: { current: currentTotalBusinessCompletionPoints, total: maxTotalBusinessCompletionPoints, percentage: businessCompletionPercentage },
      skills: { current: unlockedSkills, total: totalSkills, percentage: skillCompletionPercentage },
      hq: { current: achievedHQLevels, total: totalPossibleHQLevels, percentage: hqCompletionPercentage },
      stocks: { current: currentOwnedAssets, total: totalMarketAssets, percentage: marketCompletionPercentage },
      factory: factoryCompletion,
      quarry: quarryCompletion,
    };
  }, [ playerStats ]);
  
  const chartData = useMemo(() => ([
    { name: 'completed', value: completionData.overall, fill: 'hsl(var(--primary))' },
    { name: 'remaining', value: 100 - completionData.overall, fill: 'hsl(var(--muted))' }
  ]), [completionData.overall]);

  const chartConfig = {
    completed: { label: 'Completed', color: 'hsl(var(--primary))' },
    remaining: { label: 'Remaining', color: 'hsl(var(--muted))' }
  } satisfies ChartConfig;

  if (!mounted) {
    return (
      <div className="flex flex-col gap-6">
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <ListChecks className="h-7 w-7 text-primary" />
              <CardTitle className="text-2xl">Overall Game Completion</CardTitle>
            </div>
            <CardDescription>Your journey towards 100% game mastery.</CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="mx-auto flex h-48 w-48 items-center justify-center">
              <Skeleton className="h-full w-full rounded-full" />
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
             <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-5" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-8 w-1/3" />
                  <Skeleton className="h-2 w-full" />
                  <Skeleton className="h-3 w-3/4" />
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
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <ListChecks className="h-7 w-7 text-primary" />
            <CardTitle className="text-2xl">Overall Game Completion</CardTitle>
          </div>
          <CardDescription>Your journey towards 100% game mastery.</CardDescription>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="relative mx-auto flex h-48 w-48 items-center justify-center">
            <ChartContainer
              config={chartConfig}
              className="absolute inset-0 flex h-full w-full items-center justify-center"
            >
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={65}
                  outerRadius={80}
                  startAngle={90}
                  endAngle={450}
                  strokeWidth={0}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="flex flex-col items-center justify-center">
              <span className="text-5xl font-bold tracking-tighter text-primary">
                {completionData.overall.toFixed(1)}%
              </span>
              <span className="text-sm text-muted-foreground">Complete</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          title="Market Ownership"
          icon={BarChart}
          currentValue={completionData.stocks.current}
          totalValue={completionData.stocks.total}
          unit="shares & units owned"
        />
        <CategoryProgress 
          title="Factory Progress"
          icon={FactoryIcon}
          currentValue={completionData.factory.current}
          totalValue={completionData.factory.total}
          unit="objectives"
        />
        <CategoryProgress 
          title="Quarry Discoveries"
          icon={QuarryIcon}
          currentValue={completionData.quarry.current}
          totalValue={completionData.quarry.total}
          unit="discoveries"
        />
      </div>
    </div>
  );
}

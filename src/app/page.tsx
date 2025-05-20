
"use client";

import { MetricCard } from "@/components/dashboard/MetricCard";
import { IncomeChart } from "@/components/dashboard/IncomeChart";
import { useGame } from "@/contexts/GameContext";
import { DollarSign, TrendingUp, Briefcase, ShieldCheck, Star, Settings2, XIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useMemo } from "react";
import { calculateDiminishingPrestigePoints, getLevelsRequiredForNPoints, getCostForNthPoint } from "@/config/game-config";
import { Progress } from "@/components/ui/progress";


const WELCOME_BANNER_DISMISSED_KEY = 'bizTycoonWelcomeBannerDismissed_v1';

export default function DashboardPage() {
  const { playerStats, businesses } = useGame();
  const [currentMoney, setCurrentMoney] = useState(playerStats.money);
  const [currentIncome, setCurrentIncome] = useState(playerStats.totalIncomePerSecond);
  const [isWelcomeBoxVisible, setIsWelcomeBoxVisible] = useState(true);

  const [prestigeProgress, setPrestigeProgress] = useState({
    percentage: 0,
    levelsAchievedTowardsDynamicTarget: 0,
    costOfDynamicTargetPoint: 0,
    currentTotalBusinessLevels: 0,
    cumulativeLevelsForCurrentOwnedPoints: 0, // For the note about surpassing current owned points
    potentialPointsIfPrestigedNow: 0, // How many points they'd have if they prestiged
  });

  useEffect(() => {
    const dismissed = localStorage.getItem(WELCOME_BANNER_DISMISSED_KEY);
    if (dismissed === 'true') {
      setIsWelcomeBoxVisible(false);
    }
  }, []);

  useEffect(() => {
    setCurrentMoney(playerStats.money);
    setCurrentIncome(playerStats.totalIncomePerSecond);

    const currentTotalLevels = businesses.reduce((sum, b) => sum + b.level, 0);
    
    // Calculate how many points player would have if they prestiged now
    const potentialTotalPoints = calculateDiminishingPrestigePoints(currentTotalLevels);
    
    // Target the point *after* all potentially claimable points
    const targetPointNumber = potentialTotalPoints + 1;
    const costForTargetPoint = getCostForNthPoint(targetPointNumber);
    const levelsRequiredForPotentialTotalPoints = getLevelsRequiredForNPoints(potentialTotalPoints);
    
    const levelsAchievedForTarget = Math.max(0, currentTotalLevels - levelsRequiredForPotentialTotalPoints);
    
    let percentage = 0;
    if (costForTargetPoint > 0 && costForTargetPoint !== Infinity) {
      percentage = Math.min(100, (levelsAchievedForTarget / costForTargetPoint) * 100);
    } else if (levelsAchievedForTarget > 0 && costForTargetPoint !== Infinity) {
      percentage = 100;
    }
    
    setPrestigeProgress({
      percentage: percentage,
      levelsAchievedTowardsDynamicTarget: levelsAchievedForTarget,
      costOfDynamicTargetPoint: costForTargetPoint === Infinity ? 0 : costForTargetPoint,
      currentTotalBusinessLevels: currentTotalLevels,
      cumulativeLevelsForCurrentOwnedPoints: getLevelsRequiredForNPoints(playerStats.prestigePoints), // For the note
      potentialPointsIfPrestigedNow: potentialTotalPoints,
    });

  }, [playerStats, businesses]);

  const totalBusinessesOwned = businesses.filter(b => b.level > 0).length;
  const totalBusinessLevels = businesses.reduce((sum, b) => sum + b.level, 0);

  const [newlyGainedPoints, setNewlyGainedPoints] = useState(0);

   useEffect(() => {
    const calculateNewlyGainedPointsLocal = () => {
      const moneyRequiredForPrestige = 100000; 
       if (playerStats.money < moneyRequiredForPrestige && playerStats.timesPrestiged === 0) return 0;

      const totalPotentialPointsPlayerWouldHave = calculateDiminishingPrestigePoints(totalBusinessLevels);
      return Math.max(0, totalPotentialPointsPlayerWouldHave - playerStats.prestigePoints);
    };
    setNewlyGainedPoints(calculateNewlyGainedPointsLocal());
  }, [playerStats.money, playerStats.timesPrestiged, playerStats.prestigePoints, totalBusinessLevels]);

  const handleDismissWelcomeBox = () => {
    setIsWelcomeBoxVisible(false);
    localStorage.setItem(WELCOME_BANNER_DISMISSED_KEY, 'true');
  };

  return (
    <div className="flex flex-col gap-6">
      {isWelcomeBoxVisible && (
        <Card className="w-full relative">
          <CardHeader>
            <CardTitle>Welcome to BizTycoon Idle!</CardTitle>
            <CardDescription>Build your empire from the ground up.</CardDescription>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 h-7 w-7"
              onClick={handleDismissWelcomeBox}
            >
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Dismiss</span>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Start by purchasing and upgrading businesses. Each business generates passive income.
              Invest in stocks for dividends. Prestige to earn points for powerful permanent upgrades!
            </p>
          </CardContent>
          <CardFooter className="flex gap-2 flex-wrap">
            <Button asChild>
              <Link href="/businesses">Manage Businesses</Link>
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        <MetricCard
          title="Current Money"
          value={`$${Math.floor(currentMoney).toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
          icon={DollarSign}
          description="Your total available cash."
        />
        <MetricCard
          title="Income / Sec"
          value={`$${currentIncome.toLocaleString('en-US', {maximumFractionDigits: 0})}`}
          icon={TrendingUp}
          description="Passive income from all sources."
        />
        <MetricCard
          title="Businesses Owned"
          value={totalBusinessesOwned}
          icon={Briefcase}
          description={`Total Levels: ${totalBusinessLevels.toLocaleString('en-US')}`}
        />
         <MetricCard
          title="Investment Value"
          value={`$${playerStats.investmentsValue.toLocaleString('en-US', {maximumFractionDigits: 0})}`}
          icon={ShieldCheck}
          description="Current value of your stock portfolio."
        />
        <MetricCard
          title="Prestige Points"
          value={playerStats.prestigePoints.toLocaleString('en-US')}
          icon={Star}
          description="Points for permanent upgrades."
        />
        <MetricCard
          title="Times Prestiged"
          value={playerStats.timesPrestiged.toLocaleString('en-US')}
          icon={Settings2}
          description="Total number of prestiges."
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Prestige Progress</CardTitle>
          <CardDescription>Your journey to the next Prestige Point based on total business levels.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Progress value={prestigeProgress.percentage} className="w-full" />
          {playerStats.prestigePoints > 0 && prestigeProgress.currentTotalBusinessLevels < prestigeProgress.cumulativeLevelsForCurrentOwnedPoints ? (
            <p className="text-sm text-muted-foreground text-center py-1">
              Reach {prestigeProgress.cumulativeLevelsForCurrentOwnedPoints.toLocaleString('en-US')} total business levels to start progress on your next point.
              (Currently: {prestigeProgress.currentTotalBusinessLevels.toLocaleString('en-US')})
            </p>
          ) : (
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                Levels towards Point #{prestigeProgress.potentialPointsIfPrestigedNow + 1}: {
                  prestigeProgress.levelsAchievedTowardsDynamicTarget.toLocaleString('en-US')
                } / {
                  (prestigeProgress.costOfDynamicTargetPoint > 0 ? prestigeProgress.costOfDynamicTargetPoint.toLocaleString('en-US') : 'MAX')
                }
              </span>
              <span>{prestigeProgress.percentage.toFixed(1)}%</span>
            </div>
          )}
          {playerStats.timesPrestiged === 0 && (
            <p className="text-xs text-muted-foreground pt-2">
              Note: You also need at least $${(100000).toLocaleString('en-US', { maximumFractionDigits: 0 })} to perform a prestige for the first time. 
              The points shown in the Prestige dialog are newly gained base points before skill bonuses.
              After prestiging, progress towards the next point starts after your total levels surpass the cumulative cost of points you already own.
            </p>
          )}
          {playerStats.timesPrestiged > 0 && (
             <p className="text-xs text-muted-foreground pt-2">
              The points shown in the Prestige dialog are newly gained base points before skill bonuses.
              After prestiging, progress towards the next point starts after your total levels surpass the cumulative cost of points you already own.
            </p>
          )}
        </CardContent>
      </Card>

      <IncomeChart />
    </div>
  );
}



"use client";

import { MetricCard } from "@/components/dashboard/MetricCard";
import { IncomeChart } from "@/components/dashboard/IncomeChart";
import { useGame } from "@/contexts/GameContext";
import { DollarSign, TrendingUp, Briefcase, ShieldCheck, Star, Settings2, XIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { calculateDiminishingPrestigePoints, getLevelsRequiredForNPoints, getCostForNthPoint } from "@/config/game-config";
import { Progress } from "@/components/ui/progress";


export default function DashboardPage() {
  const { playerStats, businesses } = useGame();
  const [currentMoney, setCurrentMoney] = useState(playerStats.money);
  const [currentIncome, setCurrentIncome] = useState(playerStats.totalIncomePerSecond);
  const [isWelcomeBoxVisible, setIsWelcomeBoxVisible] = useState(true);

  const [prestigeProgress, setPrestigeProgress] = useState({
    percentage: 0,
    levelsAchieved: 0,
    levelsForNext: 0,
  });

  useEffect(() => {
    setCurrentMoney(playerStats.money);
    setCurrentIncome(playerStats.totalIncomePerSecond);

    const currentTotalLevels = businesses.reduce((sum, b) => sum + b.level, 0);
    // Logic for progress bar display - should always aim for the next single point
    let displayPrestigePointsForProgressBar = playerStats.prestigePoints;
    
    const levelsForCurrentPointsPlayerHas = getLevelsRequiredForNPoints(displayPrestigePointsForProgressBar);
    const costForNextPotentialPoint = getCostForNthPoint(displayPrestigePointsForProgressBar + 1);
    const levelsProgressedForNextPoint = Math.max(0, currentTotalLevels - levelsForCurrentPointsPlayerHas);

    let percentage = 0;
    if (costForNextPotentialPoint > 0 && costForNextPotentialPoint !== Infinity) { 
      percentage = Math.min(100, (levelsProgressedForNextPoint / costForNextPotentialPoint) * 100);
    } else if (levelsProgressedForNextPoint > 0 && costForNextPotentialPoint !== Infinity) { 
      percentage = 100;
    }


    setPrestigeProgress({
      percentage: percentage,
      levelsAchieved: levelsProgressedForNextPoint,
      levelsForNext: costForNextPotentialPoint === Infinity ? 0 : costForNextPotentialPoint,
    });
  }, [playerStats.money, playerStats.totalIncomePerSecond, playerStats.prestigePoints, businesses]);

  const totalBusinessesOwned = businesses.filter(b => b.level > 0).length;
  const averageBusinessLevel = totalBusinessesOwned > 0
    ? businesses.reduce((sum, b) => sum + b.level, 0) / totalBusinessesOwned
    : 0;
  
  const currentTotalLevelsForDialog = businesses.reduce((sum, b) => sum + b.level, 0);
  const [newlyGainedPoints, setNewlyGainedPoints] = useState(0);

   useEffect(() => {
    const calculateNewlyGainedPointsLocal = () => {
      const moneyRequiredForPrestige = 1000000;
       if (playerStats.money < moneyRequiredForPrestige && playerStats.timesPrestiged === 0) return 0;
      
      const totalPotentialPointsPlayerWouldHave = calculateDiminishingPrestigePoints(currentTotalLevelsForDialog);
      return Math.max(0, totalPotentialPointsPlayerWouldHave - playerStats.prestigePoints);
    };
    setNewlyGainedPoints(calculateNewlyGainedPointsLocal());
  }, [playerStats.money, playerStats.timesPrestiged, playerStats.prestigePoints, businesses, currentTotalLevelsForDialog]);

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
              onClick={() => setIsWelcomeBoxVisible(false)}
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
          value={`$${Math.floor(currentMoney).toLocaleString('en-US')}`}
          icon={DollarSign}
          description="Your total available cash."
        />
        <MetricCard
          title="Income / Sec"
          value={`$${currentIncome.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
          icon={TrendingUp}
          description="Passive income from all sources."
        />
        <MetricCard
          title="Businesses Owned"
          value={totalBusinessesOwned}
          icon={Briefcase}
          description={`Avg. Level: ${averageBusinessLevel.toFixed(1)}`}
        />
         <MetricCard
          title="Investment Value"
          value={`$${playerStats.investmentsValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
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
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              Levels towards next point: {
                Math.min(prestigeProgress.levelsAchieved, prestigeProgress.levelsForNext > 0 ? prestigeProgress.levelsForNext : prestigeProgress.levelsAchieved)
                .toLocaleString('en-US')
              } / {
                (prestigeProgress.levelsForNext > 0 ? prestigeProgress.levelsForNext : 'N/A').toLocaleString('en-US')
              }
            </span>
            <span>{prestigeProgress.percentage.toFixed(1)}%</span>
          </div>
           <p className="text-xs text-muted-foreground pt-2">
            Note: You also need at least $1,000,000 to perform a prestige for the first time.
            The points shown in the Prestige dialog are newly gained base points before skill bonuses.
          </p>
        </CardContent>
      </Card>

      <IncomeChart />
    </div>
  );
}

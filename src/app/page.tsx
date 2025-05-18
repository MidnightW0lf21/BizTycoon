
"use client";

import { MetricCard } from "@/components/dashboard/MetricCard";
import { IncomeChart } from "@/components/dashboard/IncomeChart";
import { useGame } from "@/contexts/GameContext";
import { DollarSign, TrendingUp, Briefcase, ShieldCheck, Star, Settings2 } from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { calculateDiminishingPrestigePoints, getLevelsRequiredForNPoints, getCostForNthPoint } from "@/config/game-config";
import { Progress } from "@/components/ui/progress";


export default function DashboardPage() {
  const { playerStats, businesses, performPrestige } = useGame();
  const [currentMoney, setCurrentMoney] = useState(playerStats.money);
  const [currentIncome, setCurrentIncome] = useState(playerStats.totalIncomePerSecond);
  const [isPrestigeDialogOpen, setIsPrestigeDialogOpen] = useState(false);
  const { toast } = useToast();

  const [prestigeProgress, setPrestigeProgress] = useState({
    percentage: 0,
    levelsAchieved: 0,
    levelsForNext: 0,
  });

  const currentTotalLevels = businesses.reduce((sum, b) => sum + b.level, 0);

  useEffect(() => {
    setCurrentMoney(playerStats.money);
    setCurrentIncome(playerStats.totalIncomePerSecond);

    // Calculate prestige progress for the progress bar
    const levelsForCurrentPointsPlayerHas = getLevelsRequiredForNPoints(playerStats.prestigePoints);
    const costForNextPotentialPoint = getCostForNthPoint(playerStats.prestigePoints + 1);
    const levelsProgressedForNextPoint = Math.max(0, currentTotalLevels - levelsForCurrentPointsPlayerHas);

    let percentage = 0;
    if (costForNextPotentialPoint > 0) {
      percentage = Math.min(100, (levelsProgressedForNextPoint / costForNextPotentialPoint) * 100);
    } else {
      // This case implies max prestige points might be reached or an issue with cost calculation,
      // though costForNextPotentialPoint should always be positive with current logic.
      percentage = (levelsProgressedForNextPoint > 0) ? 100 : 0;
    }

    setPrestigeProgress({
      percentage: percentage,
      levelsAchieved: levelsProgressedForNextPoint,
      levelsForNext: costForNextPotentialPoint,
    });

  }, [playerStats, businesses, currentTotalLevels]);

  const totalBusinessesOwned = businesses.filter(b => b.level > 0).length;
  const averageBusinessLevel = totalBusinessesOwned > 0
    ? businesses.reduce((sum, b) => sum + b.level, 0) / totalBusinessesOwned
    : 0;

  // Calculate points to be *newly* gained if prestiged now
  const calculateNewlyGainedPoints = () => {
    const moneyRequiredForPrestige = 1000000;
    // For the first prestige, if money requirement isn't met, no points can be gained.
    if (playerStats.money < moneyRequiredForPrestige && playerStats.timesPrestiged === 0) return 0;

    const totalPotentialPointsPlayerWouldHave = calculateDiminishingPrestigePoints(currentTotalLevels);
    // Newly gained points are the difference between total potential and current points.
    return Math.max(0, totalPotentialPointsPlayerWouldHave - playerStats.prestigePoints);
  };
  const newlyGainedPoints = calculateNewlyGainedPoints();

  // Determine if player would earn any points from levels if they prestiged now (for button disabling/toast logic)
  const wouldGainAnyPointsFromLevels = calculateDiminishingPrestigePoints(currentTotalLevels) > playerStats.prestigePoints;


  return (
    <div className="flex flex-col gap-6">
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
              Levels towards next point: {prestigeProgress.levelsAchieved.toLocaleString('en-US')} / {prestigeProgress.levelsForNext.toLocaleString('en-US')}
            </span>
            <span>{prestigeProgress.percentage.toFixed(1)}%</span>
          </div>
           <p className="text-xs text-muted-foreground pt-2">
            Note: You also need at least $1,000,000 to perform a prestige for the first time.
            The points shown in the Prestige dialog are newly gained base points before skill bonuses.
          </p>
        </CardContent>
      </Card>


      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <IncomeChart className="lg:col-span-4" />
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Welcome to BizTycoon Idle!</CardTitle>
            <CardDescription>Build your empire from the ground up.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Start by purchasing and upgrading businesses. Each business generates passive income.
              Invest in stocks for dividends. Prestige to earn points for powerful permanent upgrades!
            </p>
            <div className="relative h-48 w-full overflow-hidden rounded-lg">
              <Image
                src="https://placehold.co/600x400.png"
                alt="Business Growth"
                layout="fill"
                objectFit="cover"
                data-ai-hint="business city"
              />
            </div>
          </CardContent>
          <CardFooter className="flex gap-2 flex-wrap">
            <Button asChild>
              <Link href="/businesses">Manage Businesses</Link>
            </Button>
            <AlertDialog open={isPrestigeDialogOpen} onOpenChange={setIsPrestigeDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  // Simplified disabled logic: Button active if first prestige money req met, or if already prestiged. Detailed checks in onClick.
                  disabled={(playerStats.money < 1000000 && playerStats.timesPrestiged === 0) && !wouldGainAnyPointsFromLevels}
                  onClick={() => {
                     if (playerStats.money < 1000000 && playerStats.timesPrestiged === 0) {
                        toast({
                          title: "Not Ready to Prestige",
                          description: "You need at least $1,000,000 to prestige for the first time.",
                          variant: "destructive",
                        });
                      } else if (newlyGainedPoints === 0 && playerStats.money >= 1000000 && playerStats.timesPrestiged === 0) {
                         toast({
                          title: "No Points to Gain Yet",
                          description: "You have enough money to prestige, but you wouldn't gain any prestige points from business levels yet. Level up your businesses further!",
                          variant: "default",
                        });
                      } else if (newlyGainedPoints === 0 && playerStats.timesPrestiged > 0) {
                         toast({
                          title: "No New Points to Gain",
                          description: "You wouldn't gain any new prestige points from business levels right now. Level up your businesses further!",
                          variant: "default",
                        });
                      }
                      else {
                        setIsPrestigeDialogOpen(true);
                      }
                  }}
                >
                  <Star className="mr-2 h-4 w-4" /> Prestige
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Prestige</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to prestige? This will reset your current money,
                    all business levels, business upgrades, and stock holdings.
                    <br /><br />
                    You will gain approximately <strong className="text-primary">{newlyGainedPoints}</strong> new base prestige point(s) from business levels.
                    <br />
                    (Skill bonuses, if any, will be applied on top of this value by the system.)
                    <br />
                    This action is irreversible.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      performPrestige();
                      setIsPrestigeDialogOpen(false);
                    }}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Confirm Prestige
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

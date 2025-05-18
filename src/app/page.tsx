
"use client";

import { MetricCard } from "@/components/dashboard/MetricCard";
import { IncomeChart } from "@/components/dashboard/IncomeChart";
import { useGame } from "@/contexts/GameContext";
import { DollarSign, TrendingUp, Briefcase, ShieldCheck, Star } from "lucide-react";
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
import { calculateDiminishingPrestigePoints } from "@/config/game-config";


export default function DashboardPage() {
  const { playerStats, businesses, performPrestige } = useGame();
  const [currentMoney, setCurrentMoney] = useState(playerStats.money);
  const [currentIncome, setCurrentIncome] = useState(playerStats.totalIncomePerSecond);
  const [isPrestigeDialogOpen, setIsPrestigeDialogOpen] = useState(false);
  const { toast } = useToast(); 

  useEffect(() => {
    setCurrentMoney(playerStats.money);
    setCurrentIncome(playerStats.totalIncomePerSecond);
  }, [playerStats]);

  const totalBusinessesOwned = businesses.filter(b => b.level > 0).length;
  const averageBusinessLevel = totalBusinessesOwned > 0 
    ? businesses.reduce((sum, b) => sum + b.level, 0) / totalBusinessesOwned
    : 0;

  const calculatePotentialPrestigePoints = () => {
    const moneyRequiredForPrestige = 1000000;
    // This check is for UI display only, actual prestige eligibility is handled in GameContext
    if (playerStats.money < moneyRequiredForPrestige && playerStats.timesPrestiged === 0) return 0; 
    
    const totalLevels = businesses.reduce((sum, b) => sum + b.level, 0);
    return calculateDiminishingPrestigePoints(totalLevels);
  };
  const potentialPrestigePoints = calculatePotentialPrestigePoints();

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"> {/* Adjusted to 3 columns for better fit */}
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
          icon={Star} // Consider RefreshCw or similar for variety if desired
          description="Total number of prestiges."
        />
      </div>

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
                  disabled={playerStats.money < 1000000 && playerStats.timesPrestiged === 0} 
                  onClick={() => {
                     if (playerStats.money < 1000000 && playerStats.timesPrestiged === 0) { // Check added for first prestige money req
                        toast({ 
                          title: "Not Ready to Prestige",
                          description: "You need at least $1,000,000 to prestige for the first time.",
                          variant: "destructive",
                        });
                      } else if (playerStats.money < 1000000 && playerStats.timesPrestiged > 0) {
                        // Allow opening dialog if prestiged before, even if money is low,
                        // as GameContext will handle the actual money check for prestiging.
                        setIsPrestigeDialogOpen(true);
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
                    You will gain approximately <strong className="text-primary">{potentialPrestigePoints}</strong> base prestige point(s) from business levels.
                    <br />
                    (Skill bonuses will be applied on top of this.)
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


    

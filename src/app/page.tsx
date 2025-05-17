
"use client";

import { MetricCard } from "@/components/dashboard/MetricCard";
import { IncomeChart } from "@/components/dashboard/IncomeChart";
import { useGame } from "@/contexts/GameContext";
import { DollarSign, TrendingUp, Briefcase, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { playerStats, businesses } = useGame();
  const [currentMoney, setCurrentMoney] = useState(playerStats.money);
  const [currentIncome, setCurrentIncome] = useState(playerStats.totalIncomePerSecond);

  useEffect(() => {
    setCurrentMoney(playerStats.money);
    setCurrentIncome(playerStats.totalIncomePerSecond);
  }, [playerStats]);

  const totalBusinessesOwned = businesses.filter(b => b.level > 0).length;
  const averageBusinessLevel = totalBusinessesOwned > 0 
    ? businesses.reduce((sum, b) => sum + b.level, 0) / totalBusinessesOwned
    : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
          description="Passive income from all businesses."
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
              Start by purchasing and upgrading businesses. Each business generates passive income, allowing you to expand further.
              Keep an eye on your dashboard for key metrics and manage your cash flow effectively.
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
          <CardFooter className="flex gap-2">
            <Button asChild>
              <Link href="/businesses">Manage Businesses</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

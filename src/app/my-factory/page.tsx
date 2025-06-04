
"use client";

import { useGame } from "@/contexts/GameContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Factory, LockKeyhole } from "lucide-react";

const REQUIRED_PRESTIGE_LEVEL_MY_FACTORY = 5;

export default function MyFactoryPage() {
  const { playerStats } = useGame();

  if (playerStats.timesPrestiged < REQUIRED_PRESTIGE_LEVEL_MY_FACTORY) {
    return (
      <Card className="w-full md:max-w-2xl mx-auto">
        <CardHeader className="items-center">
          <LockKeyhole className="h-16 w-16 text-primary mb-4" />
          <CardTitle>My Factory Locked</CardTitle>
          <CardDescription className="text-center">
            Unlock powerful factory automation and production lines! <br />
            This feature is available after you have prestiged at least {REQUIRED_PRESTIGE_LEVEL_MY_FACTORY} times.
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
    <div className="flex flex-col items-center justify-center h-full">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Factory className="h-20 w-20 text-primary" />
          </div>
          <CardTitle className="text-3xl">Welcome to Your Factory!</CardTitle>
          <CardDescription>
            This is where your industrial empire will take shape.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-muted-foreground">
            Factory management features are coming soon. Stay tuned for exciting updates!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

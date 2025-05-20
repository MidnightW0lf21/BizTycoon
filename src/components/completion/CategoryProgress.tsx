
"use client";

import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface CategoryProgressProps {
  title: string;
  icon: LucideIcon;
  currentValue: number;
  totalValue: number;
  unit: string;
}

export function CategoryProgress({ title, icon: Icon, currentValue, totalValue, unit }: CategoryProgressProps) {
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
          {currentValue.toLocaleString('en-US')} / {totalValue.toLocaleString('en-US')} {unit} ({displayPercentage.toFixed(1)}%)
        </p>
      </CardContent>
    </Card>
  );
}

    
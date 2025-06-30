
"use client";

import type { Artifact, ArtifactRarity } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle, Lock } from "lucide-react";
import { Badge } from "../ui/badge";

interface ArtifactCardProps {
  artifact: Artifact;
  isUnlocked: boolean;
}

const rarityStyles: Record<ArtifactRarity, { border: string, bg: string, text: string, badge: string }> = {
  Common: { border: "border-slate-300 dark:border-slate-600", bg: "bg-slate-500/5", text: "text-slate-600 dark:text-slate-300", badge: "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200" },
  Uncommon: { border: "border-green-500", bg: "bg-green-500/5", text: "text-green-700 dark:text-green-400", badge: "bg-green-500/20 text-green-800 dark:bg-green-500/20 dark:text-green-300" },
  Rare: { border: "border-blue-500", bg: "bg-blue-500/5", text: "text-blue-700 dark:text-blue-400", badge: "bg-blue-500/20 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300" },
  Legendary: { border: "border-purple-500", bg: "bg-purple-500/5", text: "text-purple-700 dark:text-purple-400", badge: "bg-purple-500/20 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300" },
  Mythic: { border: "border-amber-500", bg: "bg-amber-500/5", text: "text-amber-700 dark:text-amber-400", badge: "bg-amber-500/20 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300" },
};

export function ArtifactCard({ artifact, isUnlocked }: ArtifactCardProps) {
  const Icon = artifact.icon;
  const styles = rarityStyles[artifact.rarity];

  return (
    <Card className={cn(
      "shadow-md transition-all",
      isUnlocked ? `${styles.border} ${styles.bg}` : "border-dashed bg-muted/50"
    )}>
      <CardHeader className="pb-3 pt-4">
        <div className="flex items-start justify-between">
          <Icon className={cn("h-10 w-10", isUnlocked ? styles.text : "text-muted-foreground")} />
          {isUnlocked && <Badge variant="outline" className={cn("text-xs", styles.badge, styles.border)}>{artifact.rarity}</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle className={cn("text-lg", isUnlocked ? styles.text : "text-muted-foreground")}>
          {isUnlocked ? artifact.name : "Undiscovered Artifact"}
        </CardTitle>
        <CardDescription className="text-xs min-h-[40px] mt-1">
          {isUnlocked ? artifact.description : "Excavate in the Quarry to discover this artifact and its powerful bonus."}
        </CardDescription>
      </CardContent>
    </Card>
  );
}

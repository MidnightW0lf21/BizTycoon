
"use client";

import type { Artifact } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle, Lock } from "lucide-react";

interface ArtifactCardProps {
  artifact: Artifact;
  isUnlocked: boolean;
}

export function ArtifactCard({ artifact, isUnlocked }: ArtifactCardProps) {
  const Icon = artifact.icon;

  return (
    <Card className={cn(
      "shadow-md transition-all",
      isUnlocked ? "border-primary/80 bg-primary/5" : "border-dashed bg-muted/50"
    )}>
      <CardHeader className="pb-3 pt-4">
        <div className="flex items-center justify-between">
          <Icon className={cn("h-10 w-10", isUnlocked ? "text-primary" : "text-muted-foreground")} />
          {isUnlocked ? (
            <CheckCircle className="h-6 w-6 text-green-500" />
          ) : (
            <Lock className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle className={cn("text-lg", !isUnlocked && "text-muted-foreground")}>
          {isUnlocked ? artifact.name : "Undiscovered Artifact"}
        </CardTitle>
        <CardDescription className="text-xs min-h-[40px] mt-1">
          {isUnlocked ? artifact.description : "Excavate in the Quarry to discover this artifact and its powerful bonus."}
        </CardDescription>
      </CardContent>
    </Card>
  );
}

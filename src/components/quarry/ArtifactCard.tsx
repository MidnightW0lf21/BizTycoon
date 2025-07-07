
"use client";

import type { Artifact, ArtifactRarity, ArtifactEffects } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle, Lock, Sparkles, TrendingUp, ArrowDownCircle, ShoppingCart, PiggyBank, Star, Zap, Package, Pickaxe, BatteryCharging, FlaskConical } from "lucide-react";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ArtifactCardProps {
  artifact: Artifact;
  isUnlocked: boolean;
  isMiniMode?: boolean;
}

const rarityStyles: Record<ArtifactRarity, { border: string, bg: string, text: string, badge: string }> = {
  Common: { border: "border-slate-300 dark:border-slate-600", bg: "bg-slate-500/5", text: "text-slate-600 dark:text-slate-300", badge: "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200" },
  Uncommon: { border: "border-green-500", bg: "bg-green-500/5", text: "text-green-700 dark:text-green-400", badge: "bg-green-500/20 text-green-800 dark:bg-green-500/20 dark:text-green-300" },
  Rare: { border: "border-blue-500", bg: "bg-blue-500/5", text: "text-blue-700 dark:text-blue-400", badge: "bg-blue-500/20 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300" },
  Legendary: { border: "border-amber-500", bg: "bg-amber-500/5", text: "text-amber-700 dark:text-amber-400", badge: "bg-amber-500/20 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300" },
  Mythic: { border: "border-purple-500", bg: "bg-purple-500/5", text: "text-purple-700 dark:text-purple-400", badge: "bg-purple-500/20 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300" },
};

const EffectIcon = ({ effectKey }: { effectKey: keyof ArtifactEffects }) => {
  const iconProps = { className: "h-3.5 w-3.5 mr-2 shrink-0 opacity-80" };
  switch (effectKey) {
    case 'globalIncomeBoostPercent': return <TrendingUp {...iconProps} />;
    case 'globalDividendYieldBoostPercent': return <TrendingUp {...iconProps} />;
    case 'globalCostReductionPercent': return <ArrowDownCircle {...iconProps} />;
    case 'globalBusinessUpgradeCostReductionPercent': return <ShoppingCart {...iconProps} />;
    case 'increaseStartingMoney': return <PiggyBank {...iconProps} />;
    case 'globalPrestigePointBoostPercent': return <Star {...iconProps} />;
    case 'factoryPowerGenerationBoostPercent': return <Zap {...iconProps} />;
    case 'increaseManualMaterialCollection': return <Package {...iconProps} />;
    case 'quarryDigPower': return <Pickaxe {...iconProps} />;
    case 'increaseMaxEnergy': return <BatteryCharging {...iconProps} />;
    case 'factoryManualRPGenerationBoost': return <FlaskConical {...iconProps} />;
    default: return <Sparkles {...iconProps} />;
  }
};

export function ArtifactCard({ artifact, isUnlocked, isMiniMode = false }: ArtifactCardProps) {
  const Icon = artifact.icon;
  const styles = rarityStyles[artifact.rarity || 'Common'];

  if (isMiniMode) {
    if (!isUnlocked) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex flex-col items-center justify-center gap-1 text-center p-2 border border-dashed bg-muted/50 rounded-md aspect-square h-full">
                <Lock className="h-6 w-6 text-muted-foreground" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Undiscovered Artifact</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className={cn("flex flex-col items-center justify-center text-center p-2 rounded-md aspect-square h-full cursor-pointer", styles.border, styles.bg)}>
              <Icon className={cn("h-8 w-8", styles.text)} />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-bold">{artifact.name} <span className={cn("text-xs font-normal", styles.text)}>({artifact.rarity})</span></p>
            <p className="text-sm text-muted-foreground max-w-xs">{artifact.description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  const renderableEffects: { text: string; key: keyof ArtifactEffects }[] = [];
  if (isUnlocked) {
    const effects = artifact.effects;
    if (effects.globalIncomeBoostPercent) renderableEffects.push({ key: 'globalIncomeBoostPercent', text: `+${effects.globalIncomeBoostPercent}% Global Income` });
    if (effects.globalCostReductionPercent) renderableEffects.push({ key: 'globalCostReductionPercent', text: `-${effects.globalCostReductionPercent}% Global Lvl Cost` });
    if (effects.globalBusinessUpgradeCostReductionPercent) renderableEffects.push({ key: 'globalBusinessUpgradeCostReductionPercent', text: `-${effects.globalBusinessUpgradeCostReductionPercent}% Global Upg. Cost` });
    if (effects.increaseStartingMoney) renderableEffects.push({ key: 'increaseStartingMoney', text: `+$${effects.increaseStartingMoney.toLocaleString()} Starting Cash` });
    if (effects.globalDividendYieldBoostPercent) renderableEffects.push({ key: 'globalDividendYieldBoostPercent', text: `+${effects.globalDividendYieldBoostPercent}% Dividend Yield` });
    if (effects.globalPrestigePointBoostPercent) renderableEffects.push({ key: 'globalPrestigePointBoostPercent', text: `+${effects.globalPrestigePointBoostPercent}% Prestige Points` });
    if (effects.factoryPowerGenerationBoostPercent) renderableEffects.push({ key: 'factoryPowerGenerationBoostPercent', text: `+${effects.factoryPowerGenerationBoostPercent}% Factory Power` });
    if (effects.increaseManualMaterialCollection) renderableEffects.push({ key: 'increaseManualMaterialCollection', text: `+${effects.increaseManualMaterialCollection} Manual Materials` });
    if (effects.quarryDigPower) renderableEffects.push({ key: 'quarryDigPower', text: `+${effects.quarryDigPower} Dig Power` });
    if (effects.increaseMaxEnergy) renderableEffects.push({ key: 'increaseMaxEnergy', text: `+${effects.increaseMaxEnergy} Max Quarry Energy` });
    if (effects.mineralBonus) renderableEffects.push({ key: 'mineralBonus', text: `+${effects.mineralBonus} to max minerals per dig` });
    if (effects.factoryManualRPGenerationBoost) renderableEffects.push({ key: 'factoryManualRPGenerationBoost', text: `+${effects.factoryManualRPGenerationBoost} Manual RP Gen` });
  }

  return (
    <Card className={cn(
      "shadow-md transition-all flex flex-col",
      isUnlocked ? `${styles.border} ${styles.bg}` : "border-dashed bg-muted/50"
    )}>
      <CardHeader className="pb-3 pt-4">
        <div className="flex items-start justify-between">
          <Icon className={cn("h-10 w-10", isUnlocked ? styles.text : "text-muted-foreground")} />
          {isUnlocked && <Badge variant="outline" className={cn("text-xs", styles.badge, styles.border)}>{artifact.rarity}</Badge>}
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <CardTitle className={cn("text-lg", isUnlocked ? styles.text : "text-muted-foreground")}>
          {isUnlocked ? artifact.name : "Undiscovered Artifact"}
        </CardTitle>
        <CardDescription className="text-xs min-h-[40px] mt-1 flex-grow">
          {isUnlocked ? artifact.description : "Excavate in the Quarry to discover this artifact and its powerful bonus."}
        </CardDescription>

        {isUnlocked && renderableEffects.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border/60 border-dashed space-y-1.5">
            {renderableEffects.map((effect) => (
              <div key={effect.key} className="flex items-center text-sm font-medium text-primary">
                <EffectIcon effectKey={effect.key} />
                <span>{effect.text}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

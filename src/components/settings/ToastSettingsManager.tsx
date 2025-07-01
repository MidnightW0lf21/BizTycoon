
"use client";

import { useGame } from "@/contexts/GameContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { defaultToastSettings } from "@/config/game-config";
import { useEffect, useState } from "react";
import type { ToastSettings } from "@/types";

const toastCategories = [
  { key: 'showManualPurchases', label: 'Manual Purchases & Unlocks', description: 'Upgrades, skills, or unlocks you click to buy.' },
  { key: 'showAutoBuyUpgrades', label: 'Automated Purchases', description: 'Notifications for upgrades bought automatically by skills.' },
  { key: 'showStockTrades', label: 'Stock Trades', description: 'Confirmations for buying and selling stocks.' },
  { key: 'showFactory', label: 'Factory Actions', description: 'Hiring workers, building machines, research, etc.' },
  { key: 'showQuarry', label: 'Quarry Actions', description: 'Digging, finding artifacts, and buying new quarries.' },
  { key: 'showPrestige', label: 'Prestige Confirmations', description: 'Notifications after successfully prestiging.' },
] as const;


export function ToastSettingsManager() {
  const { playerStats, updateToastSettings } = useGame();
  
  const [localSettings, setLocalSettings] = useState(playerStats.toastSettings || defaultToastSettings);

  useEffect(() => {
    setLocalSettings(playerStats.toastSettings || defaultToastSettings);
  }, [playerStats.toastSettings]);
  
  const allEnabled = Object.values(localSettings).every(Boolean);

  const handleMasterToggle = (checked: boolean) => {
    const newSettings = {
      showAutoBuyUpgrades: checked,
      showManualPurchases: checked,
      showStockTrades: checked,
      showPrestige: checked,
      showFactory: checked,
      showQuarry: checked,
    };
    setLocalSettings(newSettings);
    updateToastSettings(newSettings);
  };

  const handleIndividualToggle = (key: keyof ToastSettings, checked: boolean) => {
    const newSettings = { ...localSettings, [key]: checked };
    setLocalSettings(newSettings);
    updateToastSettings(newSettings);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label htmlFor="master-toggle" className="text-base font-medium">Enable All Notifications</Label>
          <p className="text-sm text-muted-foreground">
            A master switch for all in-game event notifications.
          </p>
        </div>
        <Switch
          id="master-toggle"
          checked={allEnabled}
          onCheckedChange={handleMasterToggle}
          aria-label="Toggle all notifications"
        />
      </div>
      
      <div className="space-y-4">
        <h4 className="text-md font-medium text-muted-foreground">Fine-Tune Notifications</h4>
        {toastCategories.map(({ key, label, description }) => (
          <div key={key} className="flex items-center justify-between rounded-lg border p-4">
             <div className="space-y-0.5">
              <Label htmlFor={key} className="font-medium">{label}</Label>
              <p className="text-xs text-muted-foreground">
                {description}
              </p>
            </div>
            <Switch
              id={key}
              checked={localSettings[key]}
              onCheckedChange={(checked) => handleIndividualToggle(key, checked)}
              aria-label={`Toggle ${label} notifications`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

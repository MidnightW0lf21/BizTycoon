
"use client";

import { BusinessCard } from "@/components/businesses/BusinessCard";
import { useGame } from "@/contexts/GameContext";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { INITIAL_BUSINESSES } from "@/config/game-config"; // Import initial config to get unlock order

export default function BusinessesPage() {
  const { businesses, playerStats, getDynamicMaxBusinessLevel } = useGame();
  const [showMaxedBusinesses, setShowMaxedBusinesses] = useState(true);

  const filteredBusinesses = useMemo(() => {
    const dynamicMaxLevel = getDynamicMaxBusinessLevel();
    
    return businesses.filter(business => {
      const unlockIndex = INITIAL_BUSINESSES.findIndex(b => b.id === business.id);
      if (unlockIndex === -1) return false; // Should not happen if data is consistent

      // Filter 1: Hide businesses locked too far ahead in prestige
      const prestigeVisibilityThreshold = playerStats.timesPrestiged + 3;
      if (unlockIndex > prestigeVisibilityThreshold) {
        return false;
      }

      // Filter 2: Hide maxed out businesses if toggled
      if (!showMaxedBusinesses) {
        const isMaxed = business.level >= dynamicMaxLevel;
        if (isMaxed) {
          return false;
        }
      }
      return true;
    });
  }, [businesses, playerStats.timesPrestiged, showMaxedBusinesses, getDynamicMaxBusinessLevel]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-start">
        <Button
          onClick={() => setShowMaxedBusinesses(prev => !prev)}
          variant="outline"
          className="mb-4"
        >
          {showMaxedBusinesses ? "Hide Maxed Businesses" : "Show Maxed Businesses"}
        </Button>
      </div>

      {filteredBusinesses.length === 0 ? (
        <p className="text-center text-muted-foreground py-10">
          {businesses.length === 0 
            ? "No businesses available yet. Check back later!" 
            : "No businesses match your current filters or are currently unlocked."}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredBusinesses.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      )}
    </div>
  );
}


"use client";

import { BusinessCard } from "@/components/businesses/BusinessCard";
import { useGame } from "@/contexts/GameContext";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { INITIAL_BUSINESSES } from "@/config/game-config";

const HIDE_MAXED_BUSINESSES_KEY = 'bizTycoonHideMaxedBusinesses_v1';

export default function BusinessesPage() {
  const { businesses, playerStats, getDynamicMaxBusinessLevel } = useGame();
  
  const [hideMaxed, setHideMaxed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedPreference = localStorage.getItem(HIDE_MAXED_BUSINESSES_KEY);
    if (savedPreference !== null) {
      setHideMaxed(savedPreference === 'true');
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(HIDE_MAXED_BUSINESSES_KEY, String(hideMaxed));
    }
  }, [hideMaxed, mounted]);

  const filteredBusinesses = useMemo(() => {
    const dynamicMaxLevel = getDynamicMaxBusinessLevel();

    return businesses.filter(business => {
      const unlockIndex = INITIAL_BUSINESSES.findIndex(b => b.id === business.id);
      if (unlockIndex === -1) return false;

      const prestigeVisibilityThreshold = playerStats.timesPrestiged + 3;
      if (unlockIndex > prestigeVisibilityThreshold) {
        return false;
      }

      if (hideMaxed) {
        const isMaxed = business.level >= dynamicMaxLevel;
        if (isMaxed) {
          return false;
        }
      }
      return true;
    });
  }, [businesses, playerStats.timesPrestiged, hideMaxed, getDynamicMaxBusinessLevel]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-start">
        <Button
          onClick={() => setHideMaxed(prev => !prev)}
          variant="outline"
          className="mb-4"
        >
          {hideMaxed ? "Show Maxed Businesses" : "Hide Maxed Businesses"}
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

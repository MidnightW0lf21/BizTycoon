"use client";

import { BusinessCard } from "@/components/businesses/BusinessCard";
import { useGame } from "@/contexts/GameContext";

export default function BusinessesPage() {
  const { businesses } = useGame();

  return (
    <div className="flex flex-col gap-6">
      {businesses.length === 0 ? (
        <p className="text-center text-muted-foreground">No businesses available yet. Check back later!</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {businesses.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      )}
    </div>
  );
}

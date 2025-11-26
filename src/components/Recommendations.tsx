"use client";

import { useState } from "react";
import RecommendationCard from "~/components/RecommendationCard";
import type { Recommendation } from "~/db/schema";

type RecommendationsProps = {
  initialRecommendations: Recommendation[];
};

export default function Recommendations({
  initialRecommendations,
}: RecommendationsProps) {
  const [filter, setFilter] = useState<
    "all" | "anime" | "manga" | "novel" | "vn"
  >("all");

  const filteredRecommendations = initialRecommendations.filter((rec) => {
    if (filter === "all") return true;
    return rec.type === filter;
  });

  const animeCount = initialRecommendations.filter(
    (r) => r.type === "anime",
  ).length;
  const mangaCount = initialRecommendations.filter(
    (r) => r.type === "manga",
  ).length;
  const novelCount = initialRecommendations.filter(
    (r) => r.type === "novel",
  ).length;
  const vnCount = initialRecommendations.filter((r) => r.type === "vn").length;

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-6">
        <FilterButton
          active={filter === "all"}
          onClick={() => setFilter("all")}
        >
          All ({initialRecommendations.length})
        </FilterButton>
        <FilterButton
          active={filter === "anime"}
          onClick={() => setFilter("anime")}
        >
          Anime ({animeCount})
        </FilterButton>
        <FilterButton
          active={filter === "manga"}
          onClick={() => setFilter("manga")}
        >
          Manga ({mangaCount})
        </FilterButton>
        <FilterButton
          active={filter === "novel"}
          onClick={() => setFilter("novel")}
        >
          Light Novels ({novelCount})
        </FilterButton>
        <FilterButton active={filter === "vn"} onClick={() => setFilter("vn")}>
          Visual Novels ({vnCount})
        </FilterButton>
      </div>

      <div className="space-y-4">
        {filteredRecommendations.length > 0 ? (
          filteredRecommendations.map((rec) => (
            <RecommendationCard key={rec.id} recommendation={rec} />
          ))
        ) : (
          <p className="text-center text-muted-foreground py-12">
            No recommendations yet for this category.
          </p>
        )}
      </div>
    </div>
  );
}

type FilterButtonProps = {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

function FilterButton({ active, onClick, children }: FilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        active
          ? "bg-fuchsia-300/20 text-fuchsia-300 border border-fuchsia-300/40"
          : "bg-accent/20 text-muted-foreground border border-border/40 hover:border-fuchsia-300/20 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

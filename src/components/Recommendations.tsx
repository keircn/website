"use client";

import { AnimatePresence, motion } from "motion/react";
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

  const getCount = (type: string) =>
    initialRecommendations.filter((r) => r.type === type).length;

  const filters = [
    { id: "all", label: `All (${initialRecommendations.length})` },
    { id: "anime", label: `Anime (${getCount("anime")})` },
    { id: "manga", label: `Manga (${getCount("manga")})` },
    { id: "novel", label: `Light Novels (${getCount("novel")})` },
    { id: "vn", label: `Visual Novels (${getCount("vn")})` },
  ] as const;

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((f) => (
          <FilterButton
            key={f.id}
            active={filter === f.id}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </FilterButton>
        ))}
      </div>

      <motion.div layout className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredRecommendations.length > 0 ? (
            filteredRecommendations.map((rec) => (
              <motion.div
                key={rec.id}
                layout
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 10 }}
                transition={{
                  duration: 0.2,
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              >
                <RecommendationCard recommendation={rec} />
              </motion.div>
            ))
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-muted-foreground py-12"
            >
              No recommendations yet for this category.
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
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
      className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300/50 ${
        active
          ? "text-fuchsia-300"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {active && (
        <motion.div
          layoutId="activeFilter"
          className="absolute inset-0 bg-fuchsia-300/10 border border-fuchsia-300/30 rounded-lg"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
      {!active && (
        <div className="absolute inset-0 bg-accent/20 border border-border/40 rounded-lg -z-10 group-hover:border-fuchsia-300/20 transition-colors" />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}

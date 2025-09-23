"use client";

import { useCallback, useEffect, useState } from "react";
import AnimeCard from "~/components/AnimeCard";
import AnimeCardSkeleton from "~/components/AnimeCardSkeleton";

interface MediaTitle {
  english?: string;
  romaji?: string;
  native?: string;
}

interface CoverImage {
  large?: string;
  medium?: string;
}

interface Media {
  id: number;
  title: MediaTitle;
  format?: string;
  status?: string;
  episodes?: number;
  averageScore?: number;
  genres: string[];
  coverImage: CoverImage | null;
}

interface ListEntry {
  id: number;
  status?: string;
  score?: number;
  progress?: number;
  updatedAt?: number;
  media: Media;
}

interface ListGroup {
  name: string;
  entries: ListEntry[];
}

export default function AniListViewer() {
  const [username] = useState("keiran");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [grouped, setGrouped] = useState<Record<string, ListGroup> | null>(
    null,
  );
  const [total, setTotal] = useState<number | null>(null);
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>(
    {},
  );

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    setGrouped(null);
    setTotal(null);
    setVisibleCounts({});
    try {
      const res = await fetch(
        `/api/anilist?username=${encodeURIComponent(username)}&type=ANIME&perChunk=500`,
      );
      if (!res.ok) throw new Error((await res.json()).error || res.statusText);
      const data = await res.json();
      setGrouped(data.listsByStatus || null);
      setTotal(data.totalEntries || 0);

      const initialCounts: Record<string, number> = {};
      if (data.listsByStatus) {
        Object.keys(data.listsByStatus).forEach((status) => {
          initialCounts[status] = 25;
        });
      }
      setVisibleCounts(initialCounts);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  function loadMoreForStatus(status: string) {
    setVisibleCounts((prev) => ({
      ...prev,
      [status]: (prev[status] || 25) + 25,
    }));
  }

  return (
    <div className="max-w-6xl mx-auto px-4 border border-border rounded-lg p-4 ml-6 mr-2 mt-12 md:mt-2">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold font-mono">
            keiran {"//"} AniList
          </h1>
        </div>
        <button
          type="button"
          onClick={fetchList}
          className="px-3 py-1 bg-muted text-foreground rounded hover:opacity-90 transition text-sm"
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      <div className="mt-4">
        {error && (
          <div className="border border-red-200 bg-red-50/10 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="text-red-400 text-lg">⚠️</div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-400 mb-1">
                  Failed to load anime list
                </h3>
                <p className="text-sm text-muted-foreground mb-3">{error}</p>
                <button
                  type="button"
                  onClick={fetchList}
                  className="px-3 py-1 bg-muted text-foreground rounded hover:opacity-90 transition text-sm"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="mt-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="text-sm text-muted-foreground">
                Loading anime list...
              </div>
              <div className="w-4 h-4 border-2 border-muted border-t-foreground rounded-full animate-spin" />
            </div>

            <div className="space-y-6">
              {["watching", "planning", "completed"].map((section) => (
                <section key={section}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-6 bg-muted/30 rounded w-32 animate-pulse" />
                    <div className="h-4 bg-muted/20 rounded w-20 animate-pulse" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Array.from(
                      { length: 8 },
                      (_, i) => `${section}-skeleton-${i}`,
                    ).map((skeletonId) => (
                      <AnimeCardSkeleton key={skeletonId} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        )}

        {!loading && !grouped && !error && (
          <div className="text-sm text-muted-foreground">
            Enter a username and press Fetch to see their public anime lists.
          </div>
        )}

        {grouped && (
          <div className="mt-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="text-sm text-muted-foreground">Total</div>
              <div className="px-2 py-1 bg-muted text-foreground rounded text-sm font-medium">
                {total}
              </div>
            </div>

            {(() => {
              const priority = (s: string) => {
                if (!s || s === "OTHER") return 50;
                if (s === "CURRENT") return 0;
                if (s === "PLANNING") return 10;
                if (s === "COMPLETED") return 20;
                if (s === "REPEATING") return 25;
                if (s === "PAUSED") return 90;
                if (s === "DROPPED") return 100;
                return 30;
              };

              const statusLabel = (s: string, name: string) => {
                if (!s || s === "OTHER") return "Unflowed";
                if (s === "CURRENT") return "Watching";
                if (s === "PLANNING") return "Plan to Watch";
                if (s === "COMPLETED") return "Completed";
                if (s === "PAUSED") return "Paused";
                if (s === "DROPPED") return "Dropped";
                return name || s;
              };

              return Object.entries(grouped)
                .sort((a, b) => {
                  const pa = priority(a[0]);
                  const pb = priority(b[0]);
                  if (pa !== pb) return pa - pb;
                  return a[1].name.localeCompare(b[1].name);
                })
                .map(([status, group]) => {
                  const isMuted = status === "PAUSED" || status === "DROPPED";
                  const label = statusLabel(status, group.name);
                  const visibleCount = visibleCounts[status] || 25;
                  const visibleEntries = group.entries.slice(0, visibleCount);
                  const hasMore = group.entries.length > visibleCount;

                  return (
                    <section key={status} className="">
                      <div className="flex items-center justify-between mb-3">
                        <h3
                          className={`text-lg font-semibold font-mono ${isMuted ? "text-muted-foreground" : "text-foreground"}`}
                        >
                          {label}
                        </h3>
                        <div className="text-sm text-muted-foreground">
                          {visibleEntries.length} of {group.entries.length}{" "}
                          items
                        </div>
                      </div>
                      <div
                        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${isMuted ? "opacity-70" : ""}`}
                      >
                        {visibleEntries.map((e: ListEntry) => (
                          <AnimeCard key={e.media.id} media={e.media} />
                        ))}
                      </div>
                      {hasMore && (
                        <div className="text-center mt-4">
                          <button
                            type="button"
                            onClick={() => loadMoreForStatus(status)}
                            className="px-3 py-1 bg-muted/20 text-foreground rounded hover:bg-muted/30 transition text-sm"
                          >
                            Load More ({group.entries.length - visibleCount}{" "}
                            remaining)
                          </button>
                        </div>
                      )}
                    </section>
                  );
                });
            })()}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import AnimeCard from "~/components/AnimeCard";

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

export default function AniListPage() {
  const [username] = useState("keiran");
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState<Record<string, boolean>>(
    {},
  );
  const [error, setError] = useState<string | null>(null);
  const [grouped, setGrouped] = useState<Record<string, ListGroup> | null>(
    null,
  );
  const [total, setTotal] = useState<number | null>(null);
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>(
    {},
  );
  const [statusTotals, setStatusTotals] = useState<Record<string, number>>({});
  const [lastRefresh, setLastRefresh] = useState<number>(0);

  const fetchInitialList = useCallback(
    async (backgroundRefresh = false) => {
      if (!backgroundRefresh) {
        setLoading(true);
        setError(null);
        setGrouped(null);
        setTotal(null);
        setVisibleCounts({});
        setStatusTotals({});
      }

      try {
        // First, fetch with limit to get just 25 items per status initially
        const res = await fetch(
          `/api/anilist?username=${encodeURIComponent(username)}&type=ANIME&perChunk=500&offset=0&limit=25`,
        );
        if (!res.ok)
          throw new Error((await res.json()).error || res.statusText);
        const data = await res.json();

        // If it's a limited request, we need to also get the full counts
        if (data.pagination) {
          // Fetch full data to get total counts per status
          const fullRes = await fetch(
            `/api/anilist?username=${encodeURIComponent(username)}&type=ANIME&perChunk=500`,
          );
          if (fullRes.ok) {
            const fullData = await fullRes.json();
            const totals: Record<string, number> = {};
            if (fullData.listsByStatus) {
              Object.entries(fullData.listsByStatus).forEach(
                ([status, group]: [string, ListGroup]) => {
                  totals[status] = group.entries.length;
                },
              );
            }
            setStatusTotals(totals);
            setTotal(fullData.totalEntries || 0);
          }
        }

        setGrouped(data.listsByStatus || null);
        if (!data.pagination) {
          setTotal(data.totalEntries || 0);
        }

        const initialCounts: Record<string, number> = {};
        if (data.listsByStatus) {
          Object.entries(data.listsByStatus).forEach(
            ([status, group]: [string, ListGroup]) => {
              initialCounts[status] = group.entries.length;
            },
          );
        }
        setVisibleCounts(initialCounts);
        setLastRefresh(Date.now());
      } catch (err: unknown) {
        if (!backgroundRefresh) {
          setError(err instanceof Error ? err.message : String(err));
        }
      } finally {
        if (!backgroundRefresh) {
          setLoading(false);
        }
      }
    },
    [username],
  );

  // Background refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastRefresh > 5 * 60 * 1000) {
        // 5 minutes
        fetchInitialList(true);
      }
    }, 60 * 1000); // Check every minute

    return () => clearInterval(interval);
  }, [fetchInitialList, lastRefresh]);

  const loadMoreForStatus = useCallback(
    async (status: string, retryCount = 0) => {
      if (loadingStatus[status]) return; // Already loading

      setLoadingStatus((prev) => ({ ...prev, [status]: true }));
      try {
        const currentCount = visibleCounts[status] || 0;
        const res = await fetch(
          `/api/anilist?username=${encodeURIComponent(username)}&type=ANIME&perChunk=500&offset=${currentCount}&limit=25`,
        );
        if (!res.ok)
          throw new Error((await res.json()).error || res.statusText);
        const data = await res.json();

        if (data.listsByStatus?.[status]?.entries) {
          setGrouped((prev) => {
            if (!prev || !prev[status]) return prev;
            return {
              ...prev,
              [status]: {
                ...prev[status],
                entries: [
                  ...prev[status].entries,
                  ...data.listsByStatus[status].entries,
                ],
              },
            };
          });

          setVisibleCounts((prev) => ({
            ...prev,
            [status]: currentCount + data.listsByStatus[status].entries.length,
          }));
        }
      } catch (err: unknown) {
        // Retry once on failure
        if (retryCount < 1) {
          setTimeout(() => loadMoreForStatus(status, retryCount + 1), 2000);
          return;
        }
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoadingStatus((prev) => ({ ...prev, [status]: false }));
      }
    },
    [username, visibleCounts, loadingStatus],
  );

  useEffect(() => {
    fetchInitialList();
  }, [fetchInitialList]);

  return (
    <main className="flex-1">
      <div className="max-w-6xl mx-auto px-4 border border-border rounded-lg p-4 ml-4 mr-2">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold font-mono">
              keiran {"//"} AniList
            </h1>
          </div>
          <button
            type="button"
            onClick={() => fetchInitialList(false)}
            className="px-3 py-1 bg-muted text-foreground rounded hover:opacity-90 transition text-sm"
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>

        <div className="mt-4">
          {error && <div className="text-sm text-red-400 mb-4">{error}</div>}

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
                    const visibleCount = visibleCounts[status] || 0;
                    const totalForStatus =
                      statusTotals[status] || group.entries.length;
                    const visibleEntries = group.entries;
                    const hasMore = visibleCount < totalForStatus;
                    const isLoadingMore = loadingStatus[status] || false;

                    return (
                      <section key={status} className="">
                        <div className="flex items-center justify-between mb-3">
                          <h3
                            className={`text-lg font-semibold font-mono ${isMuted ? "text-muted-foreground" : "text-foreground"}`}
                          >
                            {label}
                          </h3>
                          <div className="text-sm text-muted-foreground">
                            {visibleCount} of {totalForStatus} items
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
                              disabled={isLoadingMore}
                              className="px-3 py-1 bg-muted/20 text-foreground rounded hover:bg-muted/30 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isLoadingMore
                                ? "Loading..."
                                : `Load More (${totalForStatus - visibleCount} remaining)`}
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
    </main>
  );
}

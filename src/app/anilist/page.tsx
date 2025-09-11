"use client";

import { useEffect, useState } from "react";
import AnimeCard from "~/components/AnimeCard";

export default function AniListPage() {
  const [username] = useState("keiran");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [grouped, setGrouped] = useState<Record<
    string,
    { name: string; entries: any[] }
  > | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [perChunk, setPerChunk] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextChunk, setHasNextChunk] = useState(false);

  useEffect(() => {
    fetchList();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    fetchList();
  }, [perChunk]);

  async function fetchList(page = 1) {
    setLoading(true);
    setError(null);
    if (page === 1) {
      setGrouped(null);
      setTotal(null);
    }
    try {
      const res = await fetch(
        `/api/anilist?username=${encodeURIComponent(username)}&type=ANIME&perChunk=${perChunk}&page=${page}`,
      );
      if (!res.ok) throw new Error((await res.json()).error || res.statusText);
      const data = await res.json();

      if (page === 1) {
        setGrouped(data.listsByStatus || null);
      } else {
        setGrouped((prev) => {
          if (!prev || !data.listsByStatus) return prev;
          const newGrouped = { ...prev };
          Object.entries(data.listsByStatus).forEach(
            ([status, group]: [string, any]) => {
              if (newGrouped[status]) {
                newGrouped[status].entries = [
                  ...newGrouped[status].entries,
                  ...group.entries,
                ];
              } else {
                newGrouped[status] = group;
              }
            },
          );
          return newGrouped;
        });
      }

      setTotal(data.totalEntries || 0);
      setHasNextChunk(data.hasNextChunk || false);
      setCurrentPage(page);
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  function loadMore() {
    if (!loading && hasNextChunk) {
      fetchList(currentPage + 1);
    }
  }

  return (
    <main className="flex-1 pt-12 md:pt-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-muted/10 border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold font-mono">keiran — AniList</h1>
              <p className="text-sm text-muted-foreground mt-1">
                A curated view of keiran's public AniList — lists are grouped to
                match AniList categories.
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <select
                value={perChunk}
                onChange={(e) => setPerChunk(Number(e.target.value))}
                className="text-sm bg-background border border-border rounded px-2 py-1"
              >
                <option value={25}>25 per list</option>
                <option value={50}>50 per list</option>
                <option value={100}>100 per list</option>
              </select>
              <button
                type="button"
                onClick={() => fetchList()}
                className="px-3 py-1 bg-foreground text-background rounded hover:opacity-90 transition text-sm"
              >
                {loading ? "Refreshing…" : "Refresh"}
              </button>
            </div>
          </div>

          <div className="mt-4">
            {error && <div className="text-sm text-red-400 mb-4">{error}</div>}

            {!loading && !grouped && !error && (
              <div className="text-sm text-muted-foreground">
                Enter a username and press Fetch to see their public anime
                lists.
              </div>
            )}

            {grouped && (
              <div className="mt-4 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="text-sm text-muted-foreground">Total</div>
                  <div className="px-2 py-1 bg-foreground text-background rounded text-sm font-medium">
                    {total}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ({perChunk} per list max)
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
                      const isMuted =
                        status === "PAUSED" || status === "DROPPED";
                      const label = statusLabel(status, group.name);
                      return (
                        <section key={status} className="">
                          <div className="flex items-center justify-between mb-3">
                            <h3
                              className={`text-lg font-semibold font-mono ${isMuted ? "text-muted-foreground" : "text-foreground"}`}
                            >
                              {label}
                            </h3>
                            <div className="text-sm text-muted-foreground">
                              {group.entries.length} items
                            </div>
                          </div>
                          <div
                            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${isMuted ? "opacity-70" : ""}`}
                          >
                            {group.entries.map((e: any) => (
                              <AnimeCard key={e.media.id} media={e.media} />
                            ))}
                          </div>
                        </section>
                      );
                    });
                })()}

                {hasNextChunk && (
                  <div className="text-center pt-6">
                    <button
                      type="button"
                      onClick={loadMore}
                      disabled={loading}
                      className="px-4 py-2 bg-foreground text-background rounded hover:opacity-90 transition disabled:opacity-50"
                    >
                      {loading ? "Loading..." : "Load More"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
